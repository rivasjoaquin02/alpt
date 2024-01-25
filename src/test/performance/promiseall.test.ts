import { faker } from "@faker-js/faker"
import type { library } from "../../../drizzle/schema"

type Library = typeof library.$inferInsert

const asyncGenerateLibrary = async (): Promise<Library> => ({
    nameLibrary: faker.helpers.fake(`Library {{person.fullName()}}`),
    locationLibrary: faker.location.streetAddress(true),
    descriptionLibrary: faker.lorem.paragraph(),
    website: faker.internet.url()
})

const amount = Number(process.argv[2]) | 0
const libraries = Array.from({ length: amount }, asyncGenerateLibrary)
await Promise.all(libraries)
