drop database if exists library_db;
create database library_db;

-- types
create type access_method_type as enum ('member card', 'provisional pass');
create type format_type as enum ('physical', 'digital');
create type document_type as enum (
    'art',
    'manuscript',
    'ethnology',
    'file',
    'map',
    'picture',
    'poster',
    'media',
    'music',
    'reference',
    'magazine',
    'book');
create type service_type as enum (
    'loan', 'heritage preservation', 'cultural event',
    'consultation in a room', 'bibliographic references');
create type status_type as enum ('requested','approved', 'in-loan', 'renovated' ,'returned', 'non-returned', 'lost');
create type loan_type as enum ('loan_member', 'loan_library');
create type penalty_type as enum ('late fees', 'suspension of borrowing privileges', 'replacement cost', 'processing fee');
create type category_type as enum ('researcher', 'professional', 'student', 'foreign');
create type collection_type as enum ('special', 'general');
create type map_type as enum ('topographic', 'road', 'thematic', 'geologic', 'political', 'physical');
create type technique_type as enum ('oil', 'acrylic', 'watercolor', 'pastel', 'encaustic', 'fresco', 'gouache', 'ink wash', 'spray');

create table library
(
    id_library          serial primary key,
    name_library        varchar(255) unique not null,
    location_library    varchar(255)        not null,
    description_library text,
    website             varchar(255)
);
create table room
(
    id_room          varchar(20)         not null primary key,
    id_library       int                 not null,
    name_room        varchar(255) unique not null,
    location_room    varchar(255)        not null,
    description_room text,
    access_method    access_method_type,
    phone_extension  int,
    constraint id_room_check check (id_room like '___ ____-____-_'),
    constraint fk_library foreign key (id_library) references library (id_library)
);
create table collection
(
    id_collection          varchar(10) primary key,
    id_room                varchar(20),
    name_collection        varchar(255) unique not null,
    description_collection text,
    type_collection        collection_type     not null default ('general'),
    constraint fk_room foreign key (id_room) references room (id_room)
);

-- creating phone's
create table phone
(
    phone_number      varchar(20) not null primary key,
    description_phone text
--     constraint phone_format_check check (phone_number like '(__) ____-____')
);
create table phone_library
(
    phone_number varchar(20) not null primary key,
    id_library   int         not null,
    constraint fk_phone foreign key (phone_number) references phone (phone_number),
    constraint fk_library foreign key (id_library) references library (id_library)
);
create table phone_room
(
    phone_number varchar(20) not null primary key,
    id_room      varchar(20) not null,
    constraint fk_phone foreign key (phone_number) references phone (phone_number),
    constraint fk_room foreign key (id_room) references room (id_room)
);


-- creating email's
create table email
(
    email             varchar(100) not null primary key,
    description_email text,
    constraint email_check check (email like '%_@__%.__%')
);
create table email_library
(
    email      varchar(100) not null primary key,
    id_library int          not null,
    constraint fk_email foreign key (email) references email (email),
    constraint fk_library foreign key (id_library) references library (id_library)
);
create table email_room
(
    email   varchar(100) not null primary key,
    id_room varchar(20),
    constraint fk_email foreign key (email) references email (email),
    constraint fk_room foreign key (id_room) references room (id_room)
);
create table email_collection
(
    email         varchar(100) not null primary key,
    id_collection varchar(10),
    constraint fk_email foreign key (email) references email (email),
    constraint fk_collection foreign key (id_collection) references collection (id_collection)
);

-- creating member's
create table member
(
    id_member bigserial    not null primary key,
    name      varchar(100) not null,
    age       int,
    country   varchar(100) not null,
    category  category_type
);
create table researcher
(
    id_member int not null primary key,
    constraint fk_member foreign key (id_member) references member (id_member)
);
create table professional
(
    id_member    int not null primary key,
    organization varchar(100),
    constraint fk_member foreign key (id_member) references member (id_member)
);
create table student
(
    id_member int not null primary key,
    school    varchar(100),
    constraint fk_member foreign key (id_member) references member (id_member)
);

-- creating document's
create table document
(
    id_document       serial       not null primary key,
    title             varchar(255) not null,
    created_at        date,
    editorial         varchar(255),
    publication_place varchar(255),
    language          varchar(50),
    format            format_type,
    subject           varchar(255),
    summary           text,
    is_patrimony      bool,
    note              text,
    type_document     document_type
--     constraint document_number_check check (number_document like 'doc-%-%')
);
create table document_collection
(
    id_collection varchar(10) not null,
    id_document   int         not null,
    primary key (id_collection, id_document),
    constraint fk_collection foreign key (id_collection) references collection (id_collection),
    constraint fk_document foreign key (id_document) references document (id_document)
);

create table manuscript
(
    id_document int not null primary key,
    period      varchar(100),
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table map
(
    id_document      int not null primary key,
    dimension_height int not null,
    dimension_width  int not null,
    scale            varchar(20),
    type_map         map_type,
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table picture
(
    id_document      int not null primary key,
    dimension_height int not null,
    dimension_width  int not null,
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table paint
(
    id_document      int not null primary key,
    technique        technique_type,
    dimension_height int not null,
    dimension_width  int not null,
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table media
(
    id_document int not null primary key,
    genre       varchar(100),
    director    varchar(100),
    producer    varchar(100),
    duration    int,
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table music
(
    id_document int not null primary key,
    genre       varchar(100),
    performer   varchar(100),
    composer    varchar(100),
    duration    int,
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table reference
(
    id_document int not null primary key,
    serial      int,
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table magazine
(
    id_document int not null primary key,
    editor      varchar(100),
    issn        varchar(20),
    constraint fk_document foreign key (id_document) references document (id_document),
    constraint issn_check check ( issn like '____-____')
);
create table book
(
    id_document int not null primary key,
    genre       varchar(50),
    issn        varchar(20),
    isbn        varchar(20),
    dewey       decimal(5, 2),
    constraint fk_document foreign key (id_document) references document (id_document)
);

-- creating author
create table author
(
    id_author          bigserial    not null primary key,
    name_author        varchar(100) not null,
    country_author     varchar(100) not null,
    description_author text
);
create table author_document
(
    id_author   integer not null,
    id_document integer not null,
    constraint fk_author foreign key (id_author) references author (id_author),
    constraint fk_document foreign key (id_document) references document (id_document),
    primary key (id_author, id_document)
);

-- creating services
create table service
(
    id_service          bigserial    not null primary key,
    description_service text,
    type_service        service_type not null
);
create table service_room
(
    id_service int         not null,
    id_room    varchar(20) not null,
    primary key (id_service, id_room),
    constraint fk_service foreign key (id_service) references service (id_service),
    constraint fk_room foreign key (id_room) references room (id_room)
);
create table service_member
(
    id_service int not null,
    id_member  int not null,
    primary key (id_service, id_member),
    constraint fk_service foreign key (id_service) references service (id_service),
    constraint fk_member foreign key (id_member) references member (id_member)
);
create table loan
(
    id_service  int         not null,
    id_document int         not null,
    term        int,
    start_date  date        not null,
    end_date    date        not null,
    status      status_type not null,
    type_loan   loan_type   not null,
    primary key (id_service, id_document),
    constraint fk_service foreign key (id_service) references service (id_service),
    constraint fk_document foreign key (id_document) references document (id_document)
);
create table loan_researcher
(
    id_service  int not null,
    id_document int not null,
    id_member   int not null,
    primary key (id_service, id_document, id_member),
    constraint fk_service foreign key (id_service) references service (id_service),
    constraint fk_document foreign key (id_document) references document (id_document),
    constraint fk_member foreign key (id_member) references researcher (id_member)
);
create table loan_professional
(
    id_service  int not null,
    id_document int not null,
    id_member   int not null,
    primary key (id_service, id_document, id_member),
    constraint fk_service foreign key (id_service) references service (id_service),
    constraint fk_document foreign key (id_document) references document (id_document),
    constraint fk_member foreign key (id_member) references professional (id_member)
);
create table loan_library
(
    id_service  int not null,
    id_document int not null,
    id_library  int not null,
    id_library2 int not null,
    primary key (id_service, id_document, id_library, id_library2),
    constraint fk_service foreign key (id_service) references service (id_service),
    constraint fk_document foreign key (id_document) references document (id_document),
    constraint fk_library foreign key (id_library) references library (id_library),
    constraint fk_library2 foreign key (id_library2) references library (id_library)
);
create table fine
(
    id_fine     bigserial    not null primary key,
    id_service  int          not null,
    id_document int          not null,
    penalty     penalty_type not null,
    fee         float,
    constraint fk_service foreign key (id_service, id_document) references loan (id_service, id_document)
);

