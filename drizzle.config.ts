import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config();

export default {
    schema: "./src/schema/*",
    out: "./drizzle",
    driver: 'pg',
    dbCredentials: {
        host: process.env.PG_HOST || "127.0.0.1",
        port: Number(process.env.PG_PORT) || 5433,
        user: process.env.PG_USER,
        password: process.env.PG_PASS,
        database: process.env.PG_DATABASE || "postgres"
    }
} satisfies Config;
