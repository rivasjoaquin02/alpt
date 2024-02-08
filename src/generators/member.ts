import type { Faker } from "@faker-js/faker"
import { member, researcher, professional, student, categoryType } from "../../drizzle/schema"

type Member = typeof member.$inferInsert
type Researcher = typeof researcher.$inferInsert
type Professional = typeof professional.$inferInsert
type Student = typeof student.$inferInsert

const getMember = async ({ faker }: { faker: Faker }): Promise<Member> => ({
    name: faker.person.fullName(),
    age: faker.number.int({ min: 18, max: 100 }),
    country: faker.helpers.arrayElement(["Cuba", faker.location.country()]),
    category: faker.helpers.arrayElement(categoryType.enumValues),
})

const getResearcher = async ({ keys }: { keys: any }): Promise<Researcher> => ({
    idMember: keys.member
})

const getProfessional = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Professional> => ({
    idMember: keys.member,
    organization: faker.company.name()
})

const getStudent = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Student> => ({
    idMember: keys.member,
    school: `${faker.helpers.arrayElement([
        "HighSchool",
        "University",
        "Catholic School",
    ])} ${faker.company.name()}`,
})

export {
    type Member, 
    type Researcher,
    type Professional,
    type Student,
    getMember,
    getResearcher,
    getProfessional,
    getStudent
}
