import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createHash } from "node:crypto";
import { diffLines, createTwoFilesPatch } from "diff";

export interface FileChange {
  path: string;
  action: "create" | "modify" | "delete";
  content?: string;
  previousContent?: string;
}

export class FileOps {
  private rootDir: string;
  private changeLog: FileChange[] = [];

  constructor(rootDir: string) {
    this.rootDir = rootDir;
  }

  private resolve(filePath: string): string {
    if (path.isAbsolute(filePath)) return filePath;
    return path.resolve(this.rootDir, filePath);
  }

  async readFile(filePath: string): Promise<string | null> {
    try {
      return await fs.readFile(this.resolve(filePath), "utf-8");
    } catch {
      return null;
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = this.resolve(filePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    const previousContent = await this.readFile(filePath);
    const action = previousContent === null ? "create" : "modify";

    await fs.writeFile(fullPath, content, "utf-8");

    this.changeLog.push({
      path: filePath,
      action,
      content,
      previousContent: previousContent ?? undefined,
    });
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = this.resolve(filePath);
    const previousContent = await this.readFile(filePath);

    try {
      await fs.unlink(fullPath);
      this.changeLog.push({
        path: filePath,
        action: "delete",
        previousContent: previousContent ?? undefined,
      });
    } catch {
      // File doesn't exist, nothing to delete
    }
  }

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(filePath));
      return true;
    } catch {
      return false;
    }
  }

  async ensureDir(dirPath: string): Promise<void> {
    await fs.mkdir(this.resolve(dirPath), { recursive: true });
  }

  async listFiles(dirPath: string, pattern?: RegExp): Promise<string[]> {
    const fullPath = this.resolve(dirPath);
    const results: string[] = [];

    const walk = async (dir: string): Promise<void> => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
          const entryPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (entry.name !== "node_modules" && entry.name !== ".git") {
              await walk(entryPath);
            }
          } else {
            const relativePath = path.relative(this.rootDir, entryPath);
            if (!pattern || pattern.test(relativePath)) {
              results.push(relativePath);
            }
          }
        }
      } catch {
        // Directory doesn't exist
      }
    };

    await walk(fullPath);
    return results.sort();
  }

  async copyFile(src: string, dest: string): Promise<void> {
    const content = await this.readFile(src);
    if (content !== null) {
      await this.writeFile(dest, content);
    }
  }

  generateDiff(oldContent: string, newContent: string, filePath: string): string {
    return createTwoFilesPatch(
      `a/${filePath}`,
      `b/${filePath}`,
      oldContent,
      newContent,
      "",
      ""
    );
  }

  async getFileDiff(filePath: string, newContent: string): Promise<string> {
    const oldContent = (await this.readFile(filePath)) || "";
    return this.generateDiff(oldContent, newContent, filePath);
  }

  hashContent(content: string): string {
    return createHash("sha256").update(content).digest("hex").slice(0, 12);
  }

  async getFileHash(filePath: string): Promise<string | null> {
    const content = await this.readFile(filePath);
    if (content === null) return null;
    return this.hashContent(content);
  }

  getChangeLog(): FileChange[] {
    return [...this.changeLog];
  }

  clearChangeLog(): void {
    this.changeLog = [];
  }

  async rollback(): Promise<void> {
    for (const change of [...this.changeLog].reverse()) {
      switch (change.action) {
        case "create":
          await fs.unlink(this.resolve(change.path)).catch(() => {});
          break;
        case "modify":
          if (change.previousContent !== undefined) {
            await fs.writeFile(
              this.resolve(change.path),
              change.previousContent,
              "utf-8"
            );
          }
          break;
        case "delete":
          if (change.content !== undefined) {
            await this.writeFile(change.path, change.content);
          }
          break;
      }
    }
    this.changeLog = [];
  }

  getStats(): { created: number; modified: number; deleted: number } {
    return {
      created: this.changeLog.filter((c) => c.action === "create").length,
      modified: this.changeLog.filter((c) => c.action === "modify").length,
      deleted: this.changeLog.filter((c) => c.action === "delete").length,
    };
  }
}
