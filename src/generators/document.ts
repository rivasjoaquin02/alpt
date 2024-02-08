import { type Faker } from "@faker-js/faker"
import { formatType, documentType, mapType, techniqueType, document, documentCollection, manuscript, map, picture, paint, media, music, reference, magazine, book } from "../../drizzle/schema"

type Document = typeof document.$inferInsert
type DocumentCollection = typeof documentCollection.$inferInsert
type Manuscript = typeof manuscript.$inferInsert
type Map = typeof map.$inferInsert
type Picture = typeof picture.$inferInsert
type Paint = typeof paint.$inferInsert
type Media = typeof media.$inferInsert
type Music = typeof music.$inferInsert
type Reference = typeof reference.$inferInsert
type Magazine = typeof magazine.$inferInsert
type Book = typeof book.$inferInsert

const getIssn = async (faker: Faker): Promise<string> => {
    const prefix = faker.number.int({ min: 1000, max: 9999 });
    const suffix = faker.number.int({
        min: 1000,
        max: 9999,
    });
    return `${prefix}-${suffix}`;
};

const getDocument = async ({ faker }: { faker: Faker }): Promise<Document> => {

    const typeDocument = faker.helpers.arrayElement(documentType.enumValues)
    const title = typeDocument === 'music'
        ? faker.music.songName()
        : faker.lorem.sentences(3)

    return {
        title,
        createdAt: faker.date.past().toString(),
        editorial: faker.company.name(),
        publicationPlace: faker.location.city() + ', ' + faker.location.county(),
        language: faker.helpers.arrayElement(["es", "en", "fr", "de", "it", "ru"]),
        format: faker.helpers.arrayElement(formatType.enumValues),
        subject: faker.lorem.sentence(10),
        summary: faker.lorem.paragraph(3),
        isPatrimony: faker.datatype.boolean(),
        note: faker.lorem.paragraph(3),
        typeDocument
    }
}

const getBook = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Book> => ({
    idDocument: keys.document,
    genre: faker.helpers.arrayElement([
        "Fiction",
        "Nonfiction",
        "Mystery",
        "Thriller",
        "Science Fiction",
        "Fantasy",
        "Biography",
        "History",
        "Romance",
        "Young Adult"
    ]),
    issn: await getIssn(faker),
    isbn: faker.commerce.isbn(),
    dewey: faker.number.float({ min: 100, max: 999, precision: 3 }).toString(),
});

const getDocumentCollection = async ({ keys }): Promise<DocumentCollection> => ({
    idDocument: keys.document,
    idCollection: keys.collection,
});

const getManuscript = async ({ faker, keys }): Promise<Manuscript> => ({
    idDocument: keys.document,
    period: faker.lorem.sentence(3)
});


const getMap = async ({ faker, keys }): Promise<Map> => ({
    idDocument: keys.document,
    dimensionHeight: faker.number.int(1000),
    dimensionWidth: faker.number.int(1000),
    scale: `${faker.number.int(1000)}:${faker.number.int(1000)}`,
    typeMap: faker.helpers.arrayElement(mapType.enumValues),
});

const getPicture = async ({ faker, keys }): Promise<Picture> => ({
    idDocument: keys.document,
    dimensionHeight: faker.number.int(1000),
    dimensionWidth: faker.number.int(1000),
});

const getPaint = async ({ faker, keys }): Promise<Paint> => ({
    idDocument: keys.document,
    technique: faker.helpers.arrayElement(techniqueType.enumValues),
    dimensionHeight: faker.number.int(1000),
    dimensionWidth: faker.number.int(1000),
});

const getMedia = async ({ faker, keys }): Promise<Media> => ({
    idDocument: keys.document,
    genre:
        faker.helpers.arrayElement(
            [
                "Action", "Comedy", "Drama", "Historical", "Horror",
                "Romance", "Science Fiction", "Thriller", "Western",
                "Animation", "Crime", "Documentary", "Mystery", "War", "Musical",
            ]),
    director: faker.person.fullName(),
    producer: faker.person.fullName(),
    duration: faker.number.int(1000),
});

// TODO: use music.songName()
const getMusic = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Music> => ({
    idDocument: keys.document,
    genre: faker.music.genre(),
    performer: faker.person.fullName(),
    composer: faker.person.fullName(),
    duration: faker.number.int(1000),
});

const getReference = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Reference> => ({
    idDocument: keys.document,
    serial: faker.number.int(1000)
});

const getMagazine = async ({ faker, keys }: { faker: Faker, keys: any }): Promise<Magazine> => ({
    idDocument: keys.document,
    editor: faker.person.fullName(),
    issn: await getIssn(faker)
});

export {
    getDocument,
    getDocumentCollection,
    getBook,
    getManuscript,
    getMap,
    getPicture,
    getPaint,
    getMedia,
    getMusic,
    getReference,
    getMagazine
}

