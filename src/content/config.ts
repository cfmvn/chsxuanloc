import { defineCollection, z } from 'astro:content';

const batchesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    batchName: z.string(), // e.g. "Khóa 1990 - 1993"
    startYear: z.number(),
    endYear: z.number(),
    description: z.string(),
    featuredImage: z.string().default('/assets/images/default-batch.jpg'),
    studentCount: z.number().optional().default(0),
    classes: z.array(z.string()).optional().default([]),
    teachers: z.array(z.string()).optional().default([]),
    motto: z.string().optional(),
    gallery: z.array(z.object({
      src: z.string(),
      caption: z.string().optional()
    })).optional().default([]),
    representative: z.object({
      name: z.string(),
      contact: z.string().optional(),
      role: z.string().optional()
    }).optional()
  }),
});

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    author: z.string().default('Ban Liên Lạc CHS'),
    description: z.string(),
    category: z.enum(['Tin tức', 'Sự kiện', 'Họp khóa', 'Gương sáng', 'Tri ân', 'Bảng vàng', 'Văn hoá', 'Lịch sử', 'Cựu học sinh', 'Học bổng']),
    featuredImage: z.string().default('/assets/images/default-post.jpg'),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([])
  }),
});

export const collections = {
  batches: batchesCollection,
  posts: postsCollection,
};
