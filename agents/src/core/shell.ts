import { exec, spawn } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export interface ShellResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  success: boolean;
}

export interface ShellOptions {
  cwd?: string;
  env?: Record<string, string>;
  timeout?: number;
  silent?: boolean;
}

export class Shell {
  private defaultCwd: string;

  constructor(cwd: string) {
    this.defaultCwd = cwd;
  }

  async run(command: string, options: ShellOptions = {}): Promise<ShellResult> {
    const cwd = options.cwd || this.defaultCwd;
    const timeout = options.timeout || 120_000; // 2 minutes default

    try {
      const { stdout, stderr } = await execAsync(command, {
        cwd,
        timeout,
        env: { ...process.env, ...options.env },
        maxBuffer: 10 * 1024 * 1024, // 10MB
      });

      return {
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode: 0,
        success: true,
      };
    } catch (error: unknown) {
      const err = error as {
        stdout?: string;
        stderr?: string;
        code?: number;
        message?: string;
      };
      return {
        stdout: (err.stdout || "").toString().trim(),
        stderr: (err.stderr || err.message || "").toString().trim(),
        exitCode: err.code || 1,
        success: false,
      };
    }
  }

  async runStreaming(
    command: string,
    args: string[],
    options: ShellOptions & {
      onStdout?: (data: string) => void;
      onStderr?: (data: string) => void;
    } = {}
  ): Promise<ShellResult> {
    return new Promise((resolve) => {
      const cwd = options.cwd || this.defaultCwd;

      const child = spawn(command, args, {
        cwd,
        env: { ...process.env, ...options.env },
        shell: true,
      });

      let stdout = "";
      let stderr = "";

      child.stdout?.on("data", (data: Buffer) => {
        const text = data.toString();
        stdout += text;
        options.onStdout?.(text);
      });

      child.stderr?.on("data", (data: Buffer) => {
        const text = data.toString();
        stderr += text;
        options.onStderr?.(text);
      });

      child.on("close", (code) => {
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code || 0,
          success: code === 0,
        });
      });

      child.on("error", (err) => {
        resolve({
          stdout: stdout.trim(),
          stderr: err.message,
          exitCode: 1,
          success: false,
        });
      });

      if (options.timeout) {
        setTimeout(() => {
          child.kill("SIGTERM");
        }, options.timeout);
      }
    });
  }

  async npmInstall(
    packages: string[],
    options: { dev?: boolean; cwd?: string } = {}
  ): Promise<ShellResult> {
    const flag = options.dev ? "--save-dev" : "--save";
    const cmd = `npm install ${flag} ${packages.join(" ")}`;
    return this.run(cmd, { cwd: options.cwd });
  }

  async npmRun(
    script: string,
    options: { cwd?: string } = {}
  ): Promise<ShellResult> {
    return this.run(`npm run ${script}`, { cwd: options.cwd });
  }

  async npx(
    command: string,
    args: string = "",
    options: ShellOptions = {}
  ): Promise<ShellResult> {
    return this.run(`npx --yes ${command} ${args}`.trim(), options);
  }

  async which(command: string): Promise<boolean> {
    const result = await this.run(`which ${command}`);
    return result.success;
  }

  async nodeVersion(): Promise<string> {
    const result = await this.run("node --version");
    return result.stdout.replace("v", "");
  }

  async npmVersion(): Promise<string> {
    const result = await this.run("npm --version");
    return result.stdout;
  }
}
