import type { Faker } from "@faker-js/faker"
import { email, emailCollection, emailLibrary, emailRoom } from "../../drizzle/schema"

type Email = typeof email.$inferInsert
type EmailLibrary = typeof emailLibrary.$inferInsert
type EmailRoom = typeof emailRoom.$inferInsert
type EmailCollection = typeof emailCollection.$inferInsert

// TODO: le puedo pasar firstname, lastname, provider
const getEmail = async ({ faker }: { faker: Faker }): Promise<Email> => ({
    email: faker.internet
        .email({ allowSpecialCharacters: false })
        .toLocaleLowerCase(),
    descriptionEmail: faker.lorem.sentence(5),
})

const getEmailLibrary = async ({ keys }: { keys: any }): Promise<EmailLibrary> => ({
    email: keys.email,
    idLibrary: keys.library
})

const getEmailRoom = async ({ keys }: { keys: any }): Promise<EmailRoom> => ({
    email: keys.email,
    idRoom: keys.room
})

const getEmailCollection = async ({ keys }: { keys: any }): Promise<EmailCollection> => ({
    email: keys.email,
    idCollection: keys.room
})

export {
    getEmail,
    getEmailLibrary,
    getEmailRoom,
    getEmailCollection
}
