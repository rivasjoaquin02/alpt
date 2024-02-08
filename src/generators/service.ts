import { faker, type Faker } from "@faker-js/faker"
import { fine, loan, loanLibrary, loanProfessional, loanResearcher, loanType, penaltyType, service, serviceMember, serviceRoom, serviceType, statusType } from "../../drizzle/schema"

type Service = typeof service.$inferInsert
type ServiceRoom = typeof serviceRoom.$inferInsert
type ServiceMember = typeof serviceMember.$inferInsert
type Loan = typeof loan.$inferInsert
type LoanLibrary = typeof loanLibrary.$inferInsert
type LoanResearcher = typeof loanResearcher.$inferInsert
type LoanProfessional = typeof loanProfessional.$inferInsert
type Fine = typeof fine.$inferInsert

const getService = async ({ faker }: { faker: Faker }): Promise<Service> => ({
    descriptionService: faker.lorem.paragraph(3),
    typeService: faker.helpers.arrayElement(serviceType.enumValues),
})

const getServiceRoom = async ({ keys }: { keys: any }): Promise<ServiceRoom> => ({
    idService: keys.service,
    idRoom: keys.room,
})

const getServiceMember = async ({ keys }: { keys: any }): Promise<ServiceMember> => ({
    idService: keys.service,
    idMember: keys.member,
})

const getLoan = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Loan> => ({
    idService: keys.service,
    idDocument: keys.document,
    term: faker.number.int(30),
    startDate: faker.date.past().toString(),
    endDate: faker.date.future().toString(),
    status: faker.helpers.arrayElement(statusType.enumValues),
    typeLoan: faker.helpers.arrayElement(loanType.enumValues),
})

const getLoanLibrary = async ({ keys }: { keys: any }): Promise<LoanLibrary> => ({
    idService: keys.service,
    idDocument: keys.document,
    idLibrary: keys.library,
    idLibrary2: keys.library2,
})

const getLoanResearcher = async ({ keys }: { keys: any }): Promise<LoanResearcher> => ({
    idService: keys.service,
    idDocument: keys.document,
    idMember: keys.member
})

const getLoanProfessional = async ({ keys }: { keys: any }): Promise<LoanProfessional> => ({
    idService: keys.service,
    idDocument: keys.document,
    idMember: keys.member
})

const getFine = async ({ keys }: { keys: any }): Promise<Fine> => ({
    idService: keys.service,
    idDocument: keys.document,
    penalty: faker.helpers.arrayElement(penaltyType.enumValues),
    fee: faker.number.float({ max: 1000, precision: 3 }),
})

export {
    getService,
    getServiceRoom,
    getServiceMember,
    getLoan,
    getLoanLibrary,
    getLoanResearcher,
    getLoanProfessional,
    getFine
}
