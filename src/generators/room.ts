import type { Faker } from "@faker-js/faker"
import { accessMethodType, room } from "../../drizzle/schema"

type Room = typeof room.$inferInsert

const generateIdRoom = async (faker: Faker): Promise<string> => {
    const randomId = faker.string.alpha({ length: 3, casing: "upper" });
    const randomYear = faker.date
        .between({ from: 2000, to: 2022 })
        .getFullYear();
    const randomDigits = faker.number.int({ min: 1111, max: 9999 });
    const randomLetter = faker.string.alpha({ length: 1, casing: "upper" });
    const fullId = `${randomId} ${randomYear}-${randomDigits}-${randomLetter}`;
    return fullId;
};

const getRoom = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Room> => ({
    idRoom: await generateIdRoom(faker),
    idLibrary: keys.library,
    nameRoom: faker.helpers.fake(`Sala {{company.name()}}`),
    locationRoom: `${faker.number.int({ min: 1, max: 10 })} floor`,
    descriptionRoom: faker.lorem.paragraph(3),
    accessMethod: faker.helpers.arrayElement(accessMethodType.enumValues),
    phoneExtension: faker.number.int({ min: 100, max: 999 }),
})

export {
    getRoom
}
