# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AstroPaper is a minimal, responsive, accessible and SEO-friendly Astro blog theme. It uses TypeScript, TailwindCSS v4, and Astro v5 with static site generation.

**Package Manager**: Use `pnpm` for all package management operations.

## Development Commands

### Core Development
- `pnpm install` - Install dependencies
- `pnpm run dev` - Start development server at `localhost:4321`
- `pnpm run build` - Full production build (includes type checking, Astro build, and Pagefind indexing)
- `pnpm run preview` - Preview production build locally

### Code Quality
- `pnpm run format` - Format code with Prettier
- `pnpm run format:check` - Check code formatting without changes
- `pnpm run lint` - Run ESLint
- `pnpm run sync` - Generate TypeScript types for Astro modules

### Docker (Alternative)
- `docker build -t astropaper .` - Build Docker image
- `docker run -p 4321:80 astropaper` - Run in container
- `docker compose up -d` - Run with docker-compose

## Architecture Overview

### Content System
**Blog posts** are stored as Markdown files in `src/data/blog/`. The content system uses Astro's Content Collections API with the following architecture:

- **Content Collection Definition** (`src/content.config.ts`): Defines the `blog` collection with schema validation using Zod. Posts require `pubDatetime`, `title`, `description`, and support optional fields like `featured`, `draft`, `tags`, `ogImage`, `modDatetime`, `canonicalURL`, `timezone`, and `hideEditPost`.
- **Post Filtering** (`src/utils/postFilter.ts`): Filters out draft posts in production and respects the `scheduledPostMargin` (15 minutes) for scheduled posts.
- **Post Sorting** (`src/utils/getSortedPosts.ts`): Sorts posts by `modDatetime` (if present) or `pubDatetime` in descending order.

### Configuration
- **Site Configuration** (`src/config.ts`): Central configuration for site metadata, author info, pagination (`postPerIndex`, `postPerPage`), features (`lightAndDarkMode`, `showArchives`, `dynamicOgImage`), and edit post settings.
- **Social Links** (`src/constants.ts`): Defines `SOCIALS` array for social media profiles and `SHARE_LINKS` for post sharing options.
- **Astro Config** (`astro.config.ts`): Configures Astro with TailwindCSS v4 via Vite plugin, sitemap generation, markdown processing (remark-toc, remark-collapse), Shiki syntax highlighting with custom transformers, and environment variable schema.

### Routing Structure
Astro's file-based routing in `src/pages/`:
- `/` - Homepage (`index.astro`) showing featured/recent posts
- `/posts/[...slug]/` - Individual post pages using dynamic routing
- `/posts/[...page]` - Paginated post list
- `/tags/` - All tags listing
- `/tags/[tag]/[...page]` - Posts filtered by tag with pagination
- `/archives/` - Archives page (can be toggled via `SITE.showArchives`)
- `/search` - Search page using Pagefind
- `/about` - About page (markdown file)
- `/rss.xml` - RSS feed generation
- `/og.png` - Site OG image

### Dynamic OG Image Generation
When `SITE.dynamicOgImage` is enabled:
- Post-specific OG images are generated at `/posts/[...slug]/index.png` via API routes
- Uses Satori to convert SVG templates to PNG via resvg-js
- Templates are in `src/utils/og-templates/`
- Only generates for posts without a custom `ogImage` field and that aren't drafts

### Key Utilities
- **`getPath()`** - Generates proper URL paths for posts based on file structure
- **`slugifyStr()`** - Creates URL-safe slugs from strings
- **`getPostsByTag()`** - Filters posts by tag
- **`getUniqueTags()`** - Extracts unique tags from posts
- **`generateOgImages`** - Converts SVG templates to PNG for OG images

### Styling
- **TailwindCSS v4** integrated via Vite plugin
- Custom prose styling for markdown content in `src/styles/`
- Dark mode support via TailwindCSS and client-side theme toggle
- Theme toggle script in `public/toggle-theme.js`

### Search
Pagefind is used for static search:
- Built during `pnpm run build` via `pagefind --site dist`
- Indexes content marked with `data-pagefind-body`
- Search UI at `/search` page

## TypeScript Configuration
- **Path Alias**: `@/*` maps to `./src/*`
- Strict TypeScript enabled via `astro/tsconfigs/strict`
- JSX configured for React (for Satori in OG image generation)

## Content Editing Workflow

### Adding a New Blog Post
1. Create a new `.md` file in `src/data/blog/`
2. Add frontmatter with required fields: `title`, `description`, `pubDatetime`
3. Optional frontmatter: `author`, `modDatetime`, `featured`, `draft`, `tags`, `ogImage`, `canonicalURL`, `hideEditPost`, `timezone`
4. Write content in Markdown below the frontmatter
5. Draft posts (where `draft: true`) won't appear in production

### Modifying Site Configuration
- Edit `src/config.ts` for site-wide settings (site name, author, pagination, features)
- Edit `src/constants.ts` to modify social links or sharing options
- Edit `astro.config.ts` for build configuration, integrations, or Shiki themes

## Important Notes

### Build Process
The build command runs multiple steps sequentially:
1. `astro check` - TypeScript type checking
2. `astro build` - Static site generation
3. `pagefind --site dist` - Search index generation
4. `cp -r dist/pagefind public/` - Copy search index to public directory

### Image Optimization
- Astro's image optimization is enabled with responsive styles
- `@resvg/resvg-js` is excluded from Vite's optimizeDeps to prevent build issues

### Markdown Plugins
- `remark-toc` automatically generates table of contents
- `remark-collapse` collapses sections with "Table of contents" heading
- Custom Shiki transformers for file names, highlighting, and diffs

### Environment Variables
- `PUBLIC_GOOGLE_SITE_VERIFICATION` (optional) - Google Search Console verification tag

## Testing
This project does not currently have automated tests. Manual testing of features and visual review is recommended when making changes.
