import { type Faker } from "@faker-js/faker"
import { collection, collectionType } from "../../drizzle/schema"

type Collection = typeof collection.$inferInsert

const getIdCollection = async (faker: Faker): Promise<Collection["idCollection"]> => {
    const randomId = faker.string.alpha({ length: 3, casing: "upper" });
    const randomDigits = faker.number.int({ min: 1111, max: 9999 });
    return `${randomId}-${randomDigits}`;
};

const getCollection = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Collection> => ({
    idCollection: await getIdCollection(faker),
    idRoom: keys.room,
    nameCollection: `Colección de ${faker.company.name()}`,
    descriptionCollection: faker.lorem.paragraph(3),
    typeCollection: faker.helpers.arrayElement(collectionType.enumValues)
})

export {
    getCollection
}
