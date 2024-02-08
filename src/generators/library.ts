
import type { Faker } from "@faker-js/faker"
import { library } from "../../drizzle/schema"

type Library = typeof library.$inferInsert

const getLibrary = async ({ faker }: {faker: Faker}): Promise<Library> => ({
    nameLibrary: faker.helpers.fake(`Library {{person.fullName()}}`),
    locationLibrary: faker.location.streetAddress(true),
    descriptionLibrary: faker.lorem.words(20),
    website: faker.internet.url()
})

export {
    getLibrary
}
