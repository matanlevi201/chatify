import { z, ZodError } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
  CLERK_PUBLISHABLE_KEY: z.string(),
  CLERK_SECRET_KEY: z.string(),
  COULDFLARE_TOKEN: z.string().min(1),
  COULDFLARE_ACCESS_KEY: z.string().min(1),
  COULDFLARE_SECRET_KEY: z.string().min(1),
  BUCKET_ACCOUNT_ID: z.string().min(1),
  BUCKET_ENDPOINT: z.string().min(1),
  BUCKET_NAME: z.string().min(1),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const env = (() => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Invalid environment variables:", error.format());
    }
    process.exit(1);
  }
})();
