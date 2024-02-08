import type { Faker } from "@faker-js/faker"
import { author, authorDocument } from "../../drizzle/schema"

type Author = typeof author.$inferInsert
type AuthorDocument = typeof authorDocument.$inferInsert

const getAuthor = async ({ faker }: { faker: Faker }): Promise<Author> => ({
    nameAuthor: faker.person.fullName(),
    countryAuthor: faker.helpers.arrayElement(["Cuba", faker.location.country()]),
    descriptionAuthor: faker.lorem.paragraph(),
})

const getAuthorDocument = async ({ keys }): Promise<AuthorDocument> => ({
    idAuthor: keys.author,
    idDocument: keys.document
})

export {
    getAuthor,
    getAuthorDocument
}
