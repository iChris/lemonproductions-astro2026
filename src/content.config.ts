import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const CLIENTS_PATH = "src/data/clients";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const clients = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${CLIENTS_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      draft: z.boolean().optional(),
      featured: z.boolean().optional(),
      ogImage: image().or(z.string()).optional(),
      podcastArtwork: image().optional(),
      // Client-specific fields
      websiteUrl: z.string().url().optional(),
      applePodcastUrl: z.string().url().optional(),
      youtubeChannelUrl: z.string().url().optional(),
      socialMediaUrl: z.string().url().optional(),
      host1Name: z.string().optional(),
      host2Name: z.string().optional(),
      host3Name: z.string().optional(),
    }),
});

export const collections = { blog, clients };

