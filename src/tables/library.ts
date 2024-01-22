import { TableBuilder } from "../lib/table";
import { collection, email, emailLibrary, library, member } from "../../drizzle/schema";

const errors: Record<string, number> = {}
const onError = (e: Error) => {
    const { message } = e

    errors[message] = errors[message]
        ? errors[message] + 1
        : errors[message] = 1
}
export const ids: Record<string, (string | number)[]> = {}

// fix this
/* for (const [error, amount] of Object.entries(errors)) 
    console.log(`${amount}: ${error}`) */

/* type Email = typeof email.$inferInsert
const emailTable = new TableBuilder<Email>(email)
    .withGenerator(async ({ faker }) => ({
        email: faker.internet.email({ allowSpecialCharacters: false }),
        descriptionEmail: faker.lorem.sentence(5)
    }))
    .withError(onError)
    .build()
emailTable.insertData(100_000) */

/* const getRandomId = (table: PgTable): (string | number) => {
    const tableName = getTableName(table)
    const randIdx = Math.floor(Math.random() * ids[tableName].length);
    return ids[tableName][randIdx]
}

type EmailLibrary = typeof emailLibrary.$inferInsert
const emailLibraryTable = new TableBuilder<EmailLibrary>(emailLibrary)
    .withGenerator(async () => ({
        email: getRandomId(email),
        idLibrary: getRandomId(library)
    }), [email, library])
    .build()

emailLibraryTable.insertData(100_000)
console.log("ids", res.length) */
