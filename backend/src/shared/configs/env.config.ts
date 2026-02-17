import { z } from 'zod';

export const envConfigSchema = z.object({
  APP_PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  AUTH_JWT_SECRET: z.string(),
  AUTH_JWT_EXPIRES_IN: z.string(),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://127.0.0.1:5173'),
});

export type EnvConfig = z.infer<typeof envConfigSchema>;

export function validateEnv(config: unknown): EnvConfig {
  const parsed = envConfigSchema.safeParse(config);
  if (!parsed.success) {
    const errorMessage = parsed.error.issues.map((issue) => {
      return {
        field: issue.path.join('.'),
        message: issue.message,
      };
    });
    throw new Error(
      `Invalid environment configuration: ${JSON.stringify(errorMessage)}`,
    );
  }
  return parsed.data;
}
