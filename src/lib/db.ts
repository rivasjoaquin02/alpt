import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { env } from "./config";

export const client = new Client({
    host: env.PG_HOST,
    port: env.PG_PORT,
    user: env.PG_USER,
    password: env.PG_PASS,
    database: env.PG_DATABASE
});

await client.connect();
export const db = drizzle(client);
