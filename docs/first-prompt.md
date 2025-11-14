# Tattoo Print Application - Implementation Guide

## Project Context

I have an existing Next.js 16 project that needs features implemented for a tattoo printing application. The app allows users to upload an image, split it into 4 A4 sheets (for printing large tattoo stencils on a small printer), preview with grid lines/alignment marks, and print.

## Tech Stack (Already Decided)

-   **Next.js 16 (latest)** with App Router and TypeScript
-   React 19 (bundled with Next.js 16)
-   Tailwind CSS
-   Fabric.js for canvas manipulation
-   sharp for server-side image processing
-   Supabase (PostgreSQL + Storage)
-   shadcn/ui components
-   Zustand for state management
-   jsPDF for PDF generation
-   react-dropzone for file upload
-   react-hot-toast for notifications

## Next.js 16 Specific Features to Use

-   **Server Actions** for file upload and database operations (instead of API routes when possible)
-   **Partial Prerendering (PPR)** for faster page loads where applicable
-   **Improved caching** with automatic request deduplication
-   **Server Components** by default for better performance
-   **Client Components** only where interactivity is needed (Canvas, upload, etc.)
-   Use `use server` directive for server actions
-   Use `use client` directive sparingly for interactive components

## Core Requirements

### 1. Image Upload Feature

-   User can drag & drop or click to upload an image
-   Support common formats: JPG, PNG, WebP
-   Show preview thumbnail after upload
-   **Use Server Action** to upload to Supabase Storage and get URL
-   Store metadata in PostgreSQL (upload_id, filename, url, timestamp, user_id if auth enabled)
-   Implement with progressive enhancement

### 2. Canvas Editor (Client Component)

-   Use Fabric.js to display uploaded image
-   User can:
    -   Resize image (proportionally)
    -   Rotate image
    -   Adjust position on canvas
-   Show real-time dimensions in inches (target: 6-7 inch width for final print)
-   Calculate and display DPI based on image resolution and target print size
-   This must be a Client Component due to Canvas API usage

### 3. Image Splitting Logic (Server Action)

-   Split one large image into 4 A4 sheets (2x2 grid)
-   A4 paper size: 210mm x 297mm (8.27" x 11.69")
-   Add overlap between sheets: 5-10mm for easier alignment when applying tattoo
-   Add grid lines on each sheet (subtle, for alignment reference)
-   Add alignment marks (corner crosses or circles) on overlap areas
-   **Use Server Action** with sharp for processing
-   Return split images as base64 or upload to Supabase and return URLs

### 4. Preview System (Mix of Server/Client Components)

-   Show all 4 sheets in a grid layout
-   Each sheet displays:
    -   Page number (1/4, 2/4, etc.)
    -   Part of the split image
    -   Grid lines (light gray, 1cm spacing)
    -   Alignment marks in overlap zones
    -   Border showing A4 dimensions
-   User can zoom in/out to inspect details (Client Component for interactivity)
-   Use Server Component for initial rendering when possible

### 5. Print Functionality (Client Component)

-   "Print All" button generates PDF with all 4 pages
-   Each page is exactly A4 size
-   Maintain proper DPI (at least 150 DPI for tattoo stencil quality)
-   Option to print individual sheets
-   Use jsPDF to generate PDF from canvas elements
-   Must be Client Component due to jsPDF browser dependency

### 6. History/Database (Server Components + Server Actions)

-   **Use Server Actions** to save each print job to Supabase:
    -   original_image_url
    -   split_images_urls (array of 4 URLs)
    -   settings (dimensions, DPI, overlap amount)
    -   created_at
    -   optional: user_id
-   History page as Server Component with streaming for better performance
-   Use Suspense boundaries for loading states

## File Structure (Next.js 16 App Router)

app/
├── page.tsx # Landing/home (Server Component)
├── editor/
│ ├── page.tsx # Main editor page (Server Component wrapper)
│ ├── actions.ts # Server Actions for upload, split, save
│ └── components/
│ ├── ImageUploader.tsx # 'use client' - file upload
│ ├── CanvasEditor.tsx # 'use client' - Fabric.js
│ ├── ControlPanel.tsx # 'use client' - interactive controls
│ ├── PreviewGrid.tsx # Can be Server Component initially
│ ├── PreviewSheet.tsx # Server Component for static display
│ └── PrintButton.tsx # 'use client' - print functionality
├── history/
│ ├── page.tsx # Server Component with Suspense
│ └── components/
│ └── HistoryList.tsx # Server Component
└── lib/
├── supabase/
│ ├── client.ts # Client-side Supabase
│ └── server.ts # Server-side Supabase
├── types.ts # TypeScript types
├── image-processor.ts # Server-side utilities
├── print-utils.ts # Client-side PDF generation
└── store.ts # Zustand store (client-side)

## Server Actions Examples

### Upload Action

```typescript
"use server";

export async function uploadImage(formData: FormData) {
    const file = formData.get("image") as File;

    // Upload to Supabase
    // Return URL
    // Handle errors

    revalidatePath("/editor");
    return { success: true, url: "..." };
}
```

### Split Image Action

```typescript
'use server'

export async function splitImage(imageUrl: string, settings: Settings) {
  // Use sharp to process
  // Generate 4 images with grid lines
  // Upload to Supabase
  // Return array of URLs

  return { success: true, images: [...] }
}
```

### Save Job Action

```typescript
"use server";

export async function saveJob(data: JobData) {
    // Save to Supabase
    // Revalidate history page

    revalidatePath("/history");
    return { success: true, id: "..." };
}
```

## Key Technical Details

### Image Splitting Algorithm

-   Input: Original image + target width (6-7 inches)
-   Calculate final dimensions maintaining aspect ratio
-   Divide into 2x2 grid
-   Add 10mm overlap on each edge (except outer edges)
-   Draw grid lines at 1cm intervals
-   Add corner alignment marks (5mm circles or crosses) at overlap zones

### DPI Calculation

Target print width = 6-7 inches
Image pixel width = W
DPI = W / target_width_inches
Minimum recommended: 150 DPI for tattoo stencils
Optimal: 300 DPI

### Grid Lines & Alignment Marks

-   Grid: 1cm spacing, light gray (#CCCCCC), 1px stroke
-   Alignment marks: Small crosses or circles at corners of overlap zones
-   Make them visible but not overwhelming

### Supabase Schema

```sql
-- print_jobs table
create table print_jobs (
  id uuid primary key default uuid_generate_v4(),
  original_image_url text not null,
  split_images jsonb not null, -- array of 4 URLs
  settings jsonb not null, -- {width_inches, dpi, overlap_mm, rotation}
  created_at timestamp default now()
);
```

## Next.js 16 Best Practices to Follow

1. **Use Server Components by default**
    - Only add 'use client' when needed (interactivity, browser APIs, state)
2. **Use Server Actions instead of API routes**
    - For mutations (upload, save, delete)
    - Better type safety and easier to use
3. **Streaming and Suspense**
    - Use Suspense boundaries for async operations
    - Stream data when possible for better UX
4. **Data fetching**
    - Fetch data in Server Components directly
    - Use React cache() for deduplication
5. **Error handling**
    - Use error.tsx for error boundaries
    - Use loading.tsx for loading states
6. **Metadata API**
    - Use generateMetadata for dynamic SEO

## Component Architecture

### Server Components (no 'use client')

-   page.tsx files (landing, editor wrapper, history)
-   PreviewSheet.tsx (displays static image)
-   HistoryList.tsx (displays data from DB)
-   Any component that only displays data

### Client Components ('use client')

-   ImageUploader.tsx (file input, drag & drop)
-   CanvasEditor.tsx (Fabric.js, Canvas API)
-   ControlPanel.tsx (sliders, inputs with state)
-   PrintButton.tsx (jsPDF, window.print())
-   Any component using useState, useEffect, event handlers

## Step-by-Step Implementation Order

1. Set up Supabase client (separate client/server versions)
2. Create TypeScript types in lib/types.ts
3. Create Server Actions in editor/actions.ts
4. Implement ImageUploader Client Component
5. Create Zustand store for client-side state
6. Implement CanvasEditor with Fabric.js
7. Create splitImage Server Action with sharp
8. Build PreviewGrid components (mix of Server/Client)
9. Implement PDF generation in PrintButton Client Component
10. Create history page with Server Components and Suspense
11. Add error.tsx and loading.tsx files
12. Polish UI with shadcn/ui components

## Important Notes

-   **Mark components with 'use client' only when necessary**
-   Use Server Actions for data mutations
-   Always maintain aspect ratio when resizing
-   Validate image quality (warn if DPI < 150)
-   Use Suspense and streaming for better UX
-   Handle errors gracefully with error boundaries
-   Make UI responsive but optimize for desktop use
-   Add tooltips to explain technical terms (DPI, overlap, etc.)
-   Use TypeScript strict mode
-   Implement proper loading states with Suspense

## Environment Variables Needed

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= # For server-side operations

## Questions to Consider During Implementation

-   Should we support auth or make it public?
-   Do we need image editing features (brightness/contrast)?
-   Should overlap amount be adjustable by user?
-   Do we want to save intermediate states (auto-save)?

Please implement these features following Next.js 16 best practices:

-   Maximize use of Server Components
-   Use Server Actions for mutations
-   Implement proper streaming and Suspense
-   Type-safe with TypeScript
-   Error handling with error boundaries
-   Progressive enhancement where possible
-   Optimized bundle size (split Client Components carefully)

Start with the core flow: upload (Server Action) → canvas (Client) → split (Server Action) → preview (Server + Client) → print (Client).
