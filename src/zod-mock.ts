import { generateMock } from '@anatine/zod-mock';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

const schema = z.object({
    uid: z.string().min(1),
    theme: z.enum([`light`, `dark`]),
    email: z.string().email().optional(),
    phoneNumber: z.string().min(10).optional(),
    avatar: z.string().url().optional(),
    jobTitle: z.string().optional(),
    otherUserEmails: z.array(z.string().email()),
    stringArrays: z.array(z.string()),
    stringLength: z.string().transform((val) => val.length),
    numberCount: z.number().transform((item) => `total value = ${item}`),
    age: z.number().min(18).max(120),
});

const langs = ['es', 'en', 'zh', 'hi', 'ar', 'pt', 'bn', 'ru', 'ja', 'pa', 'de', 'jv', 'fr', 'te', 'mr', 'tr', 'ta', 'vi', 'ko', 'ur'] as const;

import { document } from '../drizzle/schema';
import { faker } from '@faker-js/faker';
import { getDocument } from './generators/document';

console.log(mockDocuments)
