import { db } from "./lib/db";
import { faker, type Faker } from "@faker-js/faker";
import type { PgTable } from "drizzle-orm/pg-core";
import { document, library, member, music, professional, researcher, service, serviceMember, student } from "../drizzle/schema";
import { getService, getServiceMember } from "./generators/service";
import { getLibrary } from "./generators/library";
import { getMember, getProfessional, getStudent, type Professional, type Student, type Researcher, getResearcher, type Member } from "./generators/member";
import { match } from "ts-pattern";
import { desc, getTableName } from "drizzle-orm";
import { getDocument, getMusic } from "./generators/document";

const AMOUNT = Number(process.argv[2]) || 0
const CHUNK_SIZE = 10_000

type GetFnArgs =
    { faker: Faker, keys?: any } |
    { faker?: Faker, keys: any } |
    { faker: Faker, keys: any }
type GetFn<T> = (args: GetFnArgs) => Promise<T>
type GenDataFn<T, U> = {
    getFn: GetFn<T>,
    args?: GetFnArgs,
    getDeps?: () => U
}

async function generateData<T, U>({ getFn, args, getDeps }: GenDataFn<T, U>): Promise<T[]> {
    const data = []

    for (let i = 0; i < AMOUNT; i++) {
        const keys = getDeps && getDeps()
        const tuple = await getFn({ ...args, keys })
        data.push(tuple)
    }
    console.log("Generated Data")
    return data;
}

async function insertDataInChunks<T>(table: PgTable, data: T[]): Promise<void> {
    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
        const chunk = data.slice(i, i + CHUNK_SIZE)
        await db
            .insert(table)
            .values(chunk)
        //.onConflictDoNothing()
    }
    console.log(`Inserted ${data.length} -> ${getTableName(table)}`)
}

/* const order = [
    "author", "document",
    "author_document", "loan", "fine", "loan_professional", "loan_researcher",
    "email", "phone", "library", "email_library", "phone_library", "loan_library",
    "room", "collection", "email_collection", "document_collection", "email_room",
    "phone_room", "service_room",
]; */

async function seedService() {
    const data = await generateData({ getFn: getService, args: { faker } })
    await insertDataInChunks(service, data)
}

async function seedMember() {
    const memberData = await generateData({ getFn: getMember, args: { faker } })
    const studentData: Student[] = []
    const professionalData: Professional[] = []
    const researcherData: Researcher[] = []

    await insertDataInChunks(member, memberData)
    const ids = await db
        .select({ id: member.idMember, category: member.category })
        .from(member)
        .orderBy(desc(member.idMember))
        .limit(AMOUNT)

    for (let i = 0; i < ids.length; i++) {
        const { id, category } = ids[i]

        await match(category)
            .with("student", async () => {
                const value = await getStudent({ faker, keys: { member: id } })
                studentData.push(value)
            })
            .with("professional", async () => {
                const value = await getProfessional({ faker, keys: { member: id } })
                professionalData.push(value)
            })
            .with("researcher", async () => {
                const value = await getResearcher({ keys: { member: id } })
                researcherData.push(value)
            })
            .with("foreign", () => undefined)
            .with(null, () => undefined)
            .exhaustive()
    }

    await insertDataInChunks(student, studentData)
    await insertDataInChunks(professional, professionalData)
    await insertDataInChunks(researcher, researcherData)
}

async function seedServiceMember() {
    // pre-requisites
    const serviceKeys = (await db.select({ id: service.idService }).from(service))
        .map(({ id }) => id)
    const memberKeys = (await db.select({ id: member.idMember }).from(member))
        .map(({ id }) => id)

    // get-necesary side effects data function
    const getDeps = () => ({
        service: faker.helpers.arrayElement(serviceKeys),
        member: faker.helpers.arrayElement(memberKeys)
    })

    // generate
    const data = await generateData({ getFn: getServiceMember, getDeps })
    await insertDataInChunks(serviceMember, data)
}

async function seedLibrary() {
    const data = await generateData({ getFn: getLibrary, args: { faker } })
    await insertDataInChunks(library, data)
}

async function seedDocument() {
    const documentData = await generateData({ getFn: getDocument, args: { faker } })
    const musicData = []

    console.log(documentData)
    await insertDataInChunks(document, documentData)
    const ids = await db
        .select({ id: document.idDocument, typeDocument: document.typeDocument })
        .from(document)
        .orderBy(desc(document.idDocument))
        .limit(AMOUNT)

    for (let i = 0; i < ids.length; i++) {
        const { id, typeDocument } = ids[i]

        await match(typeDocument)
            .with("music", async () => {
                const value = await getMusic({ faker, keys: { document: id } })
                musicData.push(value)
            })
            .with(null, () => undefined)
            .otherwise(() => undefined)
    }

    await insertDataInChunks(music, musicData)
}

// await seedService()
//await seedMember()
// await seedServiceMember()
// await seedLibrary()
await seedDocument()


