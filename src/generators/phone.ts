import type { Faker } from "@faker-js/faker"
import { phone, phoneLibrary, phoneRoom } from "../../drizzle/schema"

type Phone = typeof phone.$inferInsert
type PhoneLibrary = typeof phoneLibrary.$inferInsert
type PhoneRoom = typeof phoneRoom.$inferInsert

const getPhoneNumber = async (faker: Faker): Promise<string> => {
    const phone_number = `(${faker.number.int(999)}) ${faker.number.int({
        min: 1111,
        max: 9999,
    })}-${faker.number.int({ min: 1111, max: 9999 })}`;
    return phone_number;
}

const getPhone = async ({ faker }: { faker: Faker }): Promise<Phone> => ({
    phoneNumber: await getPhoneNumber(faker),
    descriptionPhone: faker.lorem.sentence(3),
})

const getPhoneLibrary = async ({ keys }: { keys: any }): Promise<PhoneLibrary> => ({
    phoneNumber: keys.phone,
    idLibrary: keys.library,
})

const getPhoneRoom = async ({ keys }: { keys: any }): Promise<PhoneRoom> => ({
    phoneNumber: keys.phone,
    idRoom: keys.room,
})

export {
    getPhone,
    getPhoneLibrary,
    getPhoneRoom
}
