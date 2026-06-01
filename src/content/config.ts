import { defineCollection, z } from 'astro:content';

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title:       z.string(),
    summary:     z.string(),
    date:        z.date(),
    author:      z.string(),
    category:    z.enum(['Mannschaften', 'Club', 'Jugend', 'Tennisschule']),
    image:       z.string().optional(),
    imageAlt:    z.string().optional(),
    featured:    z.boolean().default(false),
    published:   z.boolean().default(true),
  }),
});

export const collections = { news: newsCollection };
