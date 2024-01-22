import { pgTable, foreignKey, pgEnum, varchar, unique, serial, text, integer, bigserial, date, boolean, numeric, doublePrecision, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const accessMethodType = pgEnum("access_method_type", ['member card', 'provisional pass'])
export const formatType = pgEnum("format_type", ['physical', 'digital'])
export const documentType = pgEnum("document_type", ['art', 'manuscript', 'ethnology', 'file', 'map', 'picture', 'poster', 'media', 'music', 'reference', 'magazine', 'book'])
export const serviceType = pgEnum("service_type", ['loan', 'heritage preservation', 'cultural event', 'consultation in a room', 'bibliographic references'])
export const statusType = pgEnum("status_type", ['requested', 'approved', 'in-loan', 'renovated', 'returned', 'non-returned', 'lost'])
export const loanType = pgEnum("loan_type", ['loan_member', 'loan_library'])
export const penaltyType = pgEnum("penalty_type", ['late fees', 'suspension of borrowing privileges', 'replacement cost', 'processing fee'])
export const categoryType = pgEnum("category_type", ['researcher', 'professional', 'student', 'foreign'])
export const collectionType = pgEnum("collection_type", ['special', 'general'])
export const mapType = pgEnum("map_type", ['topographic', 'road', 'thematic', 'geologic', 'political', 'physical'])
export const techniqueType = pgEnum("technique_type", ['oil', 'acrylic', 'watercolor', 'pastel', 'encaustic', 'fresco', 'gouache', 'ink wash', 'spray'])


export const emailCollection = pgTable("email_collection", {
	email: varchar("email", { length: 100 }).primaryKey().notNull().references(() => email.email),
	idCollection: varchar("id_collection", { length: 10 }).references(() => collection.idCollection),
});

export const library = pgTable("library", {
	idLibrary: serial("id_library").primaryKey().notNull(),
	nameLibrary: varchar("name_library", { length: 255 }).notNull(),
	locationLibrary: varchar("location_library", { length: 255 }).notNull(),
	descriptionLibrary: text("description_library"),
	website: varchar("website", { length: 255 }),
},
(table) => {
	return {
		libraryNameLibraryKey: unique("library_name_library_key").on(table.nameLibrary),
	}
});

export const room = pgTable("room", {
	idRoom: varchar("id_room", { length: 20 }).primaryKey().notNull(),
	idLibrary: integer("id_library").notNull().references(() => library.idLibrary),
	nameRoom: varchar("name_room", { length: 255 }).notNull(),
	locationRoom: varchar("location_room", { length: 255 }).notNull(),
	descriptionRoom: text("description_room"),
	accessMethod: accessMethodType("access_method"),
	phoneExtension: integer("phone_extension"),
},
(table) => {
	return {
		roomNameRoomKey: unique("room_name_room_key").on(table.nameRoom),
	}
});

export const collection = pgTable("collection", {
	idCollection: varchar("id_collection", { length: 10 }).primaryKey().notNull(),
	idRoom: varchar("id_room", { length: 20 }).references(() => room.idRoom),
	nameCollection: varchar("name_collection", { length: 255 }).notNull(),
	descriptionCollection: text("description_collection"),
	typeCollection: collectionType("type_collection").default('general').notNull(),
},
(table) => {
	return {
		collectionNameCollectionKey: unique("collection_name_collection_key").on(table.nameCollection),
	}
});

export const email = pgTable("email", {
	email: varchar("email", { length: 100 }).primaryKey().notNull(),
	descriptionEmail: text("description_email"),
});

export const phone = pgTable("phone", {
	phoneNumber: varchar("phone_number", { length: 20 }).primaryKey().notNull(),
	descriptionPhone: text("description_phone"),
});

export const phoneLibrary = pgTable("phone_library", {
	phoneNumber: varchar("phone_number", { length: 20 }).primaryKey().notNull().references(() => phone.phoneNumber),
	idLibrary: integer("id_library").notNull().references(() => library.idLibrary),
});

export const phoneRoom = pgTable("phone_room", {
	phoneNumber: varchar("phone_number", { length: 20 }).primaryKey().notNull().references(() => phone.phoneNumber),
	idRoom: varchar("id_room", { length: 20 }).notNull().references(() => room.idRoom),
});

export const emailLibrary = pgTable("email_library", {
	email: varchar("email", { length: 100 }).primaryKey().notNull().references(() => email.email),
	idLibrary: integer("id_library").notNull().references(() => library.idLibrary),
});

export const emailRoom = pgTable("email_room", {
	email: varchar("email", { length: 100 }).primaryKey().notNull().references(() => email.email),
	idRoom: varchar("id_room", { length: 20 }).references(() => room.idRoom),
});

export const member = pgTable("member", {
	idMember: bigserial("id_member", { mode: "bigint" }).primaryKey().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	age: integer("age"),
	country: varchar("country", { length: 100 }).notNull(),
	category: categoryType("category"),
});

export const researcher = pgTable("researcher", {
	idMember: integer("id_member").primaryKey().notNull().references(() => member.idMember),
});

export const professional = pgTable("professional", {
	idMember: integer("id_member").primaryKey().notNull().references(() => member.idMember),
	organization: varchar("organization", { length: 100 }),
});

export const student = pgTable("student", {
	idMember: integer("id_member").primaryKey().notNull().references(() => member.idMember),
	school: varchar("school", { length: 100 }),
});

export const document = pgTable("document", {
	idDocument: serial("id_document").primaryKey().notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	createdAt: date("created_at"),
	editorial: varchar("editorial", { length: 255 }),
	publicationPlace: varchar("publication_place", { length: 255 }),
	language: varchar("language", { length: 50 }),
	format: formatType("format"),
	subject: varchar("subject", { length: 255 }),
	summary: text("summary"),
	isPatrimony: boolean("is_patrimony"),
	note: text("note"),
	typeDocument: documentType("type_document"),
});

export const manuscript = pgTable("manuscript", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	period: varchar("period", { length: 100 }),
});

export const map = pgTable("map", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	dimensionHeight: integer("dimension_height").notNull(),
	dimensionWidth: integer("dimension_width").notNull(),
	scale: varchar("scale", { length: 20 }),
	typeMap: mapType("type_map"),
});

export const picture = pgTable("picture", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	dimensionHeight: integer("dimension_height").notNull(),
	dimensionWidth: integer("dimension_width").notNull(),
});

export const paint = pgTable("paint", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	technique: techniqueType("technique"),
	dimensionHeight: integer("dimension_height").notNull(),
	dimensionWidth: integer("dimension_width").notNull(),
});

export const media = pgTable("media", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	genre: varchar("genre", { length: 100 }),
	director: varchar("director", { length: 100 }),
	producer: varchar("producer", { length: 100 }),
	duration: integer("duration"),
});

export const music = pgTable("music", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	genre: varchar("genre", { length: 100 }),
	performer: varchar("performer", { length: 100 }),
	composer: varchar("composer", { length: 100 }),
	duration: integer("duration"),
});

export const reference = pgTable("reference", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	serial: integer("serial"),
});

export const magazine = pgTable("magazine", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	editor: varchar("editor", { length: 100 }),
	issn: varchar("issn", { length: 20 }),
});

export const book = pgTable("book", {
	idDocument: integer("id_document").primaryKey().notNull().references(() => document.idDocument),
	genre: varchar("genre", { length: 50 }),
	issn: varchar("issn", { length: 20 }),
	isbn: varchar("isbn", { length: 20 }),
	dewey: numeric("dewey", { precision: 5, scale:  2 }),
});

export const author = pgTable("author", {
	idAuthor: bigserial("id_author", { mode: "bigint" }).primaryKey().notNull(),
	nameAuthor: varchar("name_author", { length: 100 }).notNull(),
	countryAuthor: varchar("country_author", { length: 100 }).notNull(),
	descriptionAuthor: text("description_author"),
});

export const service = pgTable("service", {
	idService: bigserial("id_service", { mode: "bigint" }).primaryKey().notNull(),
	descriptionService: text("description_service"),
	typeService: serviceType("type_service").notNull(),
});

export const fine = pgTable("fine", {
	idFine: bigserial("id_fine", { mode: "bigint" }).primaryKey().notNull(),
	idService: integer("id_service").notNull(),
	idDocument: integer("id_document").notNull(),
	penalty: penaltyType("penalty").notNull(),
	fee: doublePrecision("fee"),
},
(table) => {
	return {
		fkService: foreignKey({
			columns: [table.idService, table.idDocument],
			foreignColumns: [loan.idService, loan.idDocument],
			name: "fk_service"
		}),
	}
});

export const documentCollection = pgTable("document_collection", {
	idCollection: varchar("id_collection", { length: 10 }).notNull().references(() => collection.idCollection),
	idDocument: integer("id_document").notNull().references(() => document.idDocument),
},
(table) => {
	return {
		documentCollectionPkey: primaryKey({ columns: [table.idCollection, table.idDocument], name: "document_collection_pkey"})
	}
});

export const serviceRoom = pgTable("service_room", {
	idService: integer("id_service").notNull(),
	idRoom: varchar("id_room", { length: 20 }).notNull().references(() => room.idRoom),
},
(table) => {
	return {
		fkService: foreignKey({
			columns: [table.idService, table.idDocument],
			foreignColumns: [loan.idService, loan.idDocument],
			name: "fk_service"
		}),
		serviceRoomPkey: primaryKey({ columns: [table.idService, table.idRoom], name: "service_room_pkey"})
	}
});

export const authorDocument = pgTable("author_document", {
	idAuthor: integer("id_author").notNull().references(() => author.idAuthor),
	idDocument: integer("id_document").notNull().references(() => document.idDocument),
},
(table) => {
	return {
		authorDocumentPkey: primaryKey({ columns: [table.idAuthor, table.idDocument], name: "author_document_pkey"})
	}
});

export const serviceMember = pgTable("service_member", {
	idService: integer("id_service").notNull(),
	idMember: integer("id_member").notNull().references(() => member.idMember),
},
(table) => {
	return {
		fkService: foreignKey({
			columns: [table.idService, table.idDocument],
			foreignColumns: [loan.idService, loan.idDocument],
			name: "fk_service"
		}),
		serviceMemberPkey: primaryKey({ columns: [table.idService, table.idMember], name: "service_member_pkey"})
	}
});

export const loanResearcher = pgTable("loan_researcher", {
	idService: integer("id_service").notNull(),
	idDocument: integer("id_document").notNull().references(() => document.idDocument),
	idMember: integer("id_member").notNull().references(() => member.idMember),
},
(table) => {
	return {
		fkService: foreignKey({
			columns: [table.idService, table.idDocument],
			foreignColumns: [loan.idService, loan.idDocument],
			name: "fk_service"
		}),
		loanResearcherPkey: primaryKey({ columns: [table.idService, table.idDocument, table.idMember], name: "loan_researcher_pkey"})
	}
});

export const loanProfessional = pgTable("loan_professional", {
	idService: integer("id_service").notNull(),
	idDocument: integer("id_document").notNull().references(() => document.idDocument),
	idMember: integer("id_member").notNull().references(() => member.idMember),
},
(table) => {
	return {
		fkService: foreignKey({
			columns: [table.idService, table.idDocument],
			foreignColumns: [loan.idService, loan.idDocument],
			name: "fk_service"
		}),
		loanProfessionalPkey: primaryKey({ columns: [table.idService, table.idDocument, table.idMember], name: "loan_professional_pkey"})
	}
});

export const loanLibrary = pgTable("loan_library", {
	idService: integer("id_service").notNull(),
	idDocument: integer("id_document").notNull().references(() => document.idDocument),
	idLibrary: integer("id_library").notNull().references(() => library.idLibrary),
	idLibrary2: integer("id_library2").notNull().references(() => library.idLibrary),
},
(table) => {
	return {
		fkService: foreignKey({
			columns: [table.idService, table.idDocument],
			foreignColumns: [loan.idService, loan.idDocument],
			name: "fk_service"
		}),
		loanLibraryPkey: primaryKey({ columns: [table.idService, table.idDocument, table.idLibrary, table.idLibrary2], name: "loan_library_pkey"})
	}
});

export const loan = pgTable("loan", {
	idService: integer("id_service").notNull(),
	idDocument: integer("id_document").notNull().references(() => document.idDocument),
	term: integer("term"),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	status: statusType("status").notNull(),
	typeLoan: loanType("type_loan").notNull(),
},
(table) => {
	return {
		fkService: foreignKey({
			columns: [table.idService, table.idDocument],
			foreignColumns: [table.idService, table.idDocument],
			name: "fk_service"
		}),
		loanPkey: primaryKey({ columns: [table.idService, table.idDocument], name: "loan_pkey"})
	}
});
