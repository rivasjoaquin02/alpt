import { faker } from "@faker-js/faker"
import workerpool from "workerpool"
import type { library } from "../../../../drizzle/schema"

type Library = typeof library.$inferInsert

const getLibrary = async (): Promise<Library> => ({
    nameLibrary: faker.helpers.fake(`Library {{person.fullName()}}`),
    locationLibrary: faker.location.streetAddress(true),
    descriptionLibrary: faker.lorem.paragraph(),
    website: faker.internet.url()
})


workerpool.worker({ asyncGenerateLibrary: getLibrary })
