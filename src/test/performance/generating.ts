import { faker } from "@faker-js/faker"
import { library } from "../../../drizzle/schema"

const amount = Number(process.argv[2]) | 0

type Library = typeof library.$inferInsert
const generateLibrary = (): Library => ({
    nameLibrary: faker.helpers.fake(`Library {{person.fullName()}}`),
    locationLibrary: faker.location.streetAddress(true),
    descriptionLibrary: faker.lorem.paragraph(),
    website: faker.internet.url()
})


let start = performance.now()
for (let i = 0; i < amount; i++) {
    const library = generateLibrary()
}
console.log(`⌛ full sync: ${performance.now() - start}`)


start = performance.now()
let libraries = Array.from({ length: amount }, async () => generateLibrary())
for (let i = 0; i < amount; i++) {
    const library = await libraries[i]
}
console.log(`⌛ Async: ${performance.now() - start}`)


start = performance.now()
libraries = Array.from({ length: amount }, async () => generateLibrary())
await Promise.all(libraries)
console.log(`⌛ Promise.all: ${performance.now() - start}`)

