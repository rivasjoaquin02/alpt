import { z } from "zod";

const envSchema = z.object({
    PG_HOST: z.string().ip().default("127.0.0.1"),
    PG_PORT: z.coerce.number().default(5433),
    PG_USER: z.string(),
    PG_PASS: z.string(),
    PG_DATABASE: z.string(),
});

export const env = envSchema.parse(process.env)
