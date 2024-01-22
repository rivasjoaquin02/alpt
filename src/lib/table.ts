import { Worker } from "worker_threads"
import { getTableName } from "drizzle-orm";
import { getTableConfig, type PgTable } from "drizzle-orm/pg-core";
import { type Faker, faker } from "@faker-js/faker"
import { groupBy } from "./utils"
import { client } from "./db";
import { from } from "pg-copy-streams"
import { pipeline } from "node:stream/promises"

type GeneratorFn<T> = ({ faker, deps }: { faker: Faker, deps?: PgTable[] })
    => Promise<T>
type ErrorFn<T> = (e: T) => void;


export class Table<T, E = void> {
    private table: PgTable;
    private generatorFn: GeneratorFn<T>;
    private onError?: ErrorFn<E>;

    constructor(
        table: PgTable,
        generatorFn: GeneratorFn<T>,
        onError?: ErrorFn<E>
    ) {
        this.table = table;
        this.generatorFn = generatorFn
        this.onError = onError;
    }

    getDependencies(): PgTable[] {
        const { foreignKeys } = getTableConfig(this.table)
        return foreignKeys
            ? foreignKeys.map(({ reference }) => reference().foreignTable)
            : []
    }

    async insertData(amount: number): Promise<void> {
        const tick = performance.now()
        const values = await this.generateValues(amount)
        console.log(`⌛: Time Generating ${amount} values: ${performance.now() - tick}ms`)

        if (values && values[0]) {
            console.log(values)
            const tableName = getTableName(this.table)
            const file = Bun.file(`${tableName}.csv`, { type: "csv" })
            const writer = file.writer()

            const header = Object.keys(values[0]).join(",") + '\n'
            writer.write(header)

            for (let i = 0; i < values.length; i++) {
                const line = Object.values(values[i]).join(",") + '\n'
                writer.write(line)
            }
            writer.end()

            // ingest data using sql's COPY
            const ingestStream = client.query(from(`COPY ${tableName} FROM STDIN WITH DELIMITER ',' CSV HEADER; `))
            const sourceStream = file.stream()
            await pipeline(sourceStream, ingestStream)
        }
    }

    async generateValue(): Promise<T> {
        const deps = this.getDependencies()

        return this.generatorFn({ faker, deps })
    }

    private async generateValues(amount: number): Promise<T[]> {
        // generate an array of promises with the generated values
        const valuesPromises = Array.from({ length: amount }, () =>
            new Promise<T>((resolve, reject) => {
                const table = getTableName(this.table)
                const worker = new Worker("./src/lib/table-worker.ts", {
                    workerData: { table }
                })
                worker.once("message", resolve)
                worker.once("error", reject)
                worker.on("exit", (code) => {
                    if (code !== 0)
                        reject(new Error(`Worker stopped with exit code ${code}`))
                })
            })
        )

        const result = await Promise.allSettled(valuesPromises)
        const { fulfilled, rejected } = groupBy(result, res => res.status)

        console.log(`Table: ${getTableName(this.table)} -> Generated ${fulfilled.length} of ${amount} values`)
        if (rejected) {
            console.log(`Table: ${getTableName(this.table)} -> Errors ${rejected.length}`)
            console.log(rejected)
        }

        return fulfilled.map(({ value }) => value)
    }
}

export class TableBuilder<T, E = void> {
    private table: PgTable;
    private generatorFn: GeneratorFn<T>
    private onError?: ErrorFn<E>;

    constructor(table: PgTable) {
        this.table = table;
    }

    withGenerator(callback: GeneratorFn<T>): this {
        this.generatorFn = callback
        return this;
    }

    withError(onError: ErrorFn<E>): this {
        this.onError = onError
        return this;
    }

    build(): Table<T, E> {
        return new Table(this.table, this.generatorFn, this.onError);
    }
}


