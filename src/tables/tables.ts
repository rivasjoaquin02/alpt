import { PgTable } from "drizzle-orm/pg-core";
import { email, emailLibrary, library } from "../../drizzle/schema";
import { Table, TableBuilder } from "../lib/table";
import { getTableName } from "drizzle-orm";

type Library = typeof library.$inferInsert
type Email = typeof email.$inferInsert
type EmailLibrary = typeof emailLibrary.$inferInsert

export const idxs = new Map<string, (string | number)[]>()

export const tables = new Map<string, Table>([
    [
        "library",
        new TableBuilder<Library>(library)
            .withGenerator(async ({ faker }) => ({
                nameLibrary: faker.helpers.fake(`Library {{person.fullName()}}`),
                locationLibrary: faker.location.streetAddress(true),
                descriptionLibrary: faker.lorem.paragraph(),
                website: faker.internet.url()
            }))
            .build()
    ],
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



