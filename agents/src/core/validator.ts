import { z, ZodSchema, ZodError } from "zod";
import type { ValidationResult } from "./types.js";

export class Validator {
  static validate<T>(schema: ZodSchema<T>, data: unknown): {
    success: boolean;
    data?: T;
    errors: string[];
  } {
    try {
      const parsed = schema.parse(data);
      return { success: true, data: parsed, errors: [] };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          success: false,
          errors: error.errors.map(
            (e) => `${e.path.join(".")}: ${e.message}`
          ),
        };
      }
      return {
        success: false,
        errors: [(error as Error).message],
      };
    }
  }

  static validatePartial<T>(
    schema: ZodSchema<T>,
    data: unknown
  ): ValidationResult {
    const result = this.validate(schema, data);
    return {
      valid: result.success,
      errors: result.errors,
      warnings: [],
    };
  }

  static safeParse<T>(
    schema: ZodSchema<T>,
    data: unknown
  ): T | null {
    try {
      return schema.parse(data);
    } catch {
      return null;
    }
  }

  static mergeValidationResults(
    ...results: ValidationResult[]
  ): ValidationResult {
    return {
      valid: results.every((r) => r.valid),
      errors: results.flatMap((r) => r.errors),
      warnings: results.flatMap((r) => r.warnings),
    };
  }

  // Common validation schemas for agent I/O
  static readonly schemas = {
    filePath: z
      .string()
      .min(1)
      .refine((p) => !p.includes(".."), "Path traversal not allowed"),

    hexColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid hex color"),

    semver: z
      .string()
      .regex(/^\d+\.\d+\.\d+$/, "Invalid semver format"),

    url: z.string().url("Invalid URL"),

    nonEmptyArray: <T extends z.ZodTypeAny>(schema: T) =>
      z.array(schema).min(1, "Array must not be empty"),

    stringEnum: <T extends string>(values: readonly T[]) =>
      z.enum(values as [T, ...T[]]),
  };
}
