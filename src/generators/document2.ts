import { faker } from "@faker-js/faker/locale/es";
import { createInsertSchema } from "drizzle-zod";
import { generateMock } from "@anatine/zod-mock";
import {
    book, document, documentCollection, documentType, magazine,
    manuscript, map, media, music, paint, picture, reference
} from "../../drizzle/schema";

type Keys = { document: string, collection: string }
type Params = { keys: Keys }

const documentSchema = createInsertSchema(document)
const documentCollectionSchema = createInsertSchema(documentCollection)
const manuscriptSchema = createInsertSchema(manuscript)
const bookSchema = createInsertSchema(book)
const mapSchema = createInsertSchema(map)
const pictureSchema = createInsertSchema(picture)
const paintSchema = createInsertSchema(paint)
const mediaSchema = createInsertSchema(media)
const musicSchema = createInsertSchema(music)
const referenceSchema = createInsertSchema(reference)
const magazineSchema = createInsertSchema(magazine)

const getIssn = (): string => {
    const prefix = faker.number.int({ min: 1000, max: 9999 });
    const suffix = faker.number.int({ min: 1000, max: 9999 });
    return `${prefix}-${suffix}`;
};

export const getDocument = () => {
    const typeDocument = faker.helpers.arrayElement(documentType.enumValues)
    const title = typeDocument === 'music'
        ? faker.helpers.unique(faker.music.songName)
        : faker.helpers.arrayElement(['b1', 'b2'])

    return generateMock(
        documentSchema, {
        stringMap: {
            title: () => title,
            createdAt: () => faker.date.past().toString(),
            editorial: () => 'Editorial ' + faker.company.name(),
            publicationPlace: () => `${faker.location.city}, ${faker.location.country}`,
            language: () => faker.helpers.arrayElement(["es", "en", "fr", "de", "it", "ru"]),
            subject: () => faker.word.noun(),
            summary: () => faker.lorem.paragraph(2),
            note: () => faker.lorem.paragraph(2),
            typeDocument: () => typeDocument,
        }
    })
}

export const getDocumentCollection = ({ keys }: Params) => generateMock(documentCollectionSchema, {
    stringMap: {
        idDocument: () => keys.document,
        idCollection: () => keys.collection,
    }
})

export const getManuscript = ({ keys }: Params) => generateMock(manuscriptSchema, {
    stringMap: {
        idDocument: () => keys.document,
        period: () => faker.lorem.sentence(3)
    }
})

export const getBook = ({ keys }: Params) => generateMock(bookSchema, {
    stringMap: {
        idDocument: () => keys.document,
        createdAt: () => faker.date.past().toString(),
        genre: () => faker.helpers.arrayElement([
            "Fiction", "Nonfiction", "Mystery", "Thriller",
            "Science Fiction", "Fantasy", "Biography", "History",
            "Romance", "Young Adult"
        ]),
        issn: getIssn,
        dewey: () => faker.number.float({ min: 100, max: 999, precision: 3 }).toString(),
    }
});

export const getMap = ({ keys }: Params) => generateMock(mapSchema, {
    stringMap: {
        idDocument: () => keys.document,
        dimensionHeight: () => faker.number.int({ min: 0, max: 99999 }).toString(),
        dimensionWidth: () => faker.number.int({ min: 0, max: 99999 }).toString(),
        scale: () => `${faker.number.int(1000)}:${faker.number.int(1000)}`,
    }
})

export const getPicture = ({ keys }: Params) => generateMock(pictureSchema, {
    stringMap: {
        idDocument: () => keys.document,
        dimensionHeight: () => faker.number.int({ min: 0, max: 99999 }).toString(),
        dimensionWidth: () => faker.number.int({ min: 0, max: 99999 }).toString(),
    }
})

export const getPaint = ({ keys }: Params) => generateMock(paintSchema, {
    stringMap: {
        idDocument: () => keys.document,
        dimensionHeight: () => faker.number.int({ min: 0, max: 99999 }).toString(),
        dimensionWidth: () => faker.number.int({ min: 0, max: 99999 }).toString(),
    }
})

export const getMedia = ({ keys }: Params) => generateMock(
    mediaSchema, {
    stringMap: {
        idDocument: () => keys.document,
        genre: () => faker.helpers.arrayElement([
            "Action", "Comedy", "Drama", "Historical", "Horror",
            "Romance", "Science Fiction", "Thriller", "Western",
            "Animation", "Crime", "Documentary", "Mystery", "War", "Musical",
        ]),
        director: () => faker.person.fullName(),
        producer: () => faker.person.fullName(),
        duration: () => faker.number.int({ min: 0, max: 9999 }).toString(),
    }
})

export const getMusic = ({ keys }: Params) => generateMock(musicSchema, {
    stringMap: {
        idDocument: () => keys.document,
        genre: () => faker.music.genre(),
        performer: () => faker.person.fullName(),
        composer: () => faker.person.fullName(),
        duration: () => faker.number.int({ min: 0, max: 9999 }).toString(),
    }
})

export const getReference = ({ keys }: Params) => generateMock(referenceSchema, {
    stringMap: {
        idDocument: () => keys.document,
        serial: () => faker.number.int({ min: 0, max: 9999 }).toString(),
    }
})

export const getMagazine = ({ keys }: Params) => generateMock(magazineSchema, {
    stringMap: {
        idDocument: () => keys.document,
        editor: () => faker.person.fullName(),
        issn: getIssn
    }
})
