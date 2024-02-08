import { Table, TableBuilder } from "../lib/table";
import { getTableName } from "drizzle-orm";
import { email, emailLibrary } from "../../drizzle/schema";

type Email = typeof email.$inferInsert
type EmailLibrary = typeof emailLibrary.$inferInsert

const errors: Record<string, number> = {}
const onError = (e: Error) => {
    const { message } = e

    errors[message] = errors[message]
        ? errors[message] + 1
        : errors[message] = 1
}
export const idxs = new Map<string, (string | number)[]>()

export const tables = new Map<string, Table>([
    [
        "email",
        new TableBuilder<Email>(email)
            .withGenerator(async ({ faker }) => ({
                email: faker.internet.email({ allowSpecialCharacters: false }),
                descriptionEmail: faker.lorem.sentence(5)
            }))
            .build()
    ],
    [
        "email_library",
        new TableBuilder<EmailLibrary>(emailLibrary)
            .withGenerator(async ({ deps }) => {
                console.log(getTableName(deps[0]))
                console.log(getTableName(deps[1]))

                return {
                    idLibrary: 1,
                    email: "sad"
                }
            })
            .build()
    ]
])


tables.set("library", libraryTable)




