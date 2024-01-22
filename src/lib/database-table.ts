import { getTableName } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { type Faker, faker } from "@faker-js/faker"
import { db } from "./db";

type GeneratorFn<T> = ({ faker, deps }: { faker: Faker, deps?: string[] }) => Promise<T>
type ErrorFn = (e: Error) => void;

const CHUNK_SIZE = 1000

class Table<T> {
    private table: PgTable;
    private generatorFn: GeneratorFn<T>
    dependencies: PgTable[] | undefined
    private onError?: ErrorFn;

    constructor(
        table: PgTable,
        generatorFn: GeneratorFn<T>,
        dependencies: PgTable[] | undefined,
        onError?: ErrorFn
    ) {
        this.table = table;
        this.generatorFn = generatorFn
        this.dependencies = dependencies;
        this.onError = onError;
    }

    insertData = async (amount: number) => {
        // get the corresponding table name from PgTable 
        const deps = this.dependencies
            ? this.dependencies.map(getTableName)
            : undefined

        let generatingTime = 0
        let insertionTime = 0

        // insert chunks of data
        let totalAmount = amount
        while (totalAmount > 0) {
            const amountToInsert = totalAmount > CHUNK_SIZE
                ? CHUNK_SIZE
                : totalAmount

            let start = performance.now()
            const values = await this.generateValues(amountToInsert, deps)
            generatingTime += (performance.now() - start)

            start = performance.now()
            await this.insertValues(values)
            insertionTime += (performance.now() - start)

            totalAmount -= CHUNK_SIZE;
        }

        console.log(`⏳: Generation ${generatingTime} ms`)
        console.log(`⏳: Insertion ${insertionTime} ms`)
    };

    private generateValues = async (amount: number, deps?: string[]): Promise<T[]> => {
        // generate an array of promises with the generated values
        const generateArray = Array.from({ length: amount }, () =>
            this.generatorFn({ faker, deps })
        )

        try {
            const values = await Promise.all(generateArray)
            //console.log(`Table: ${getTableName(this.table)} -> Generated ${values.length} values`)
            return values
        } catch (e) {
            const err = e as Error
            console.error(`Error generating values of table ${this.table}: `, err.cause);
            if (this.onError) this.onError(err);
        }
        return []
    }

    private insertValues = async (values: T[]) => {
        await db
            .insert(this.table)
            .values(values)
            .then(() => {
                console.log(
                    `Seeded ${values.length} into table ${getTableName(this.table)}`
                )
            })
            .catch((e: Error) => {
                console.count(`Error seeding table "${getTableName(this.table)}": ${e.message}`);
                if (this.onError) this.onError(e);
            })
    }
}

export class TableBuilder<T> {
    private table: PgTable;
    private generatorFn: GeneratorFn<T>;
    private dependencies?: PgTable[];
    private onError?: ErrorFn;

    constructor(table: PgTable) {
        this.table = table;
    }

    withGenerator(callback: GeneratorFn<T>, deps?: PgTable[]): this {
        this.generatorFn = callback
        this.dependencies = deps
        return this;
    }

    withError(onError: ErrorFn): this {
        this.onError = onError
        return this;
    }

    build(): Table<T> {
        return new Table(
            this.table,
            this.generatorFn,
            this.dependencies,
            this.onError
        );
    }
}


