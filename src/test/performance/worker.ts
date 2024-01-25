import { faker } from "@faker-js/faker"
import { parentPort, workerData } from "worker_threads"
import type { library } from "../../../drizzle/schema"

type Library = typeof library.$inferInsert
const generateLibrary = (): Library => ({
    nameLibrary: faker.helpers.fake(`Library {{person.fullName()}}`),
    locationLibrary: faker.location.streetAddress(true),
    descriptionLibrary: faker.lorem.paragraph(),
    website: faker.internet.url()
})

const amount = workerData.amount

const results = []
for (let i = 0; i < amount; i++) results.push(generateLibrary())

parentPort?.postMessage(results)
