# Tattoo Stencil Printer

A Next.js 16 web application that splits large tattoo designs into 4 A4 sheets for printing on standard home printers. Features include canvas editing, grid lines, alignment marks, and PDF generation.

## Features

- **Image Upload**: Drag & drop or click to upload JPG, PNG, or WebP images
- **Canvas Editor**: Resize, rotate, and position your design with Fabric.js
- **Smart Splitting**: Automatically split images into 2×2 A4 grid with configurable overlap
- **Grid Lines & Alignment Marks**: 1cm grid spacing and corner alignment marks for easy application
- **DPI Calculator**: Real-time DPI calculation with quality warnings
- **PDF Generation**: Generate print-ready PDFs with all 4 sheets or individual pages
- **Print History**: Save and manage your print jobs
- **Authentication**: Secure user accounts with Supabase Auth
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Storage + Auth)
- **State Management**: Zustand
- **Canvas**: Fabric.js
- **Image Processing**: Sharp (server-side)
- **PDF Generation**: jsPDF
- **File Upload**: react-dropzone
- **Notifications**: react-hot-toast

## Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- Git

## Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd easy-tatoo-image
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

Follow the detailed instructions in [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) to:
- Create a Supabase project
- Set up the database schema
- Create the storage bucket
- Configure authentication

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

**Option A: Debug Mode (Quick Start - No Supabase needed)**

Perfect for testing without setting up Supabase:

```env
NEXT_PUBLIC_DEBUG_MODE=true
```

This enables:
- ✅ Local storage instead of Supabase
- ✅ Mock authentication (any login works)
- ✅ All features work offline
- ⚠️ Data only in browser localStorage

See [`docs/DEBUG_MODE.md`](docs/DEBUG_MODE.md) for full details.

**Option B: Production Mode (Supabase Required)**

Edit `.env.local` and add your Supabase credentials:

```env
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Debug Mode**: Yellow banner appears at top. Use any credentials to login.
**Production Mode**: Follow Supabase setup guide before using.

## Project Structure

```
app/
├── page.tsx                 # Landing page
├── layout.tsx               # Root layout with Toaster
├── auth/
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── callback/           # Auth callback
│   └── actions.ts          # Auth server actions
├── editor/
│   ├── page.tsx            # Main editor page
│   ├── actions.ts          # Editor server actions
│   └── components/         # Editor components
└── history/
    ├── page.tsx            # Print history page
    └── components/         # History components

lib/
├── supabase/
│   ├── client.ts           # Client-side Supabase
│   ├── server.ts           # Server-side Supabase
│   └── middleware.ts       # Auth middleware
├── types.ts                # TypeScript types
├── image-processor.ts      # Sharp utilities
├── print-utils.ts          # PDF generation
└── store.ts                # Zustand store

components/ui/              # shadcn/ui components
docs/                       # Documentation
middleware.ts               # Next.js middleware
```

## How It Works

### 1. Upload Image
- User uploads a tattoo design (max 10MB)
- Image is validated and uploaded to Supabase Storage
- Image dimensions and DPI are calculated

### 2. Adjust Settings
- **Target Width**: Set print width (4-8 inches, 6-7 recommended)
- **Rotation**: Rotate image (-180° to 180°)
- **Overlap**: Choose overlap amount (5mm, 10mm, or 15mm)
- Real-time DPI calculation with quality warnings

### 3. Split Image
- Server Action uses Sharp to:
  - Split image into 2×2 grid (4 sheets)
  - Add configurable overlap zones
  - Draw 1cm grid lines
  - Add alignment marks at corners
- Split images uploaded to Supabase Storage

### 4. Preview & Print
- Preview all 4 A4 sheets
- Generate PDF with jsPDF
- Print all sheets or download individual pages
- Save job to database for later access

## Key Features Explained

### Image Splitting Algorithm
- Divides image into 2×2 grid (4 sheets)
- Adds user-configurable overlap (5/10/15mm) on edges
- Maintains aspect ratio
- A4 size: 210mm × 297mm (8.27" × 11.69")

### Grid Lines & Alignment Marks
- **Grid**: 1cm spacing, light gray (#CCCCCC)
- **Marks**: 5mm crosses with circles at overlap corners
- Helps with precise alignment when applying tattoo

### DPI Calculation
```
DPI = Image Width (pixels) / Target Width (inches)
```
- **Minimum**: 150 DPI (acceptable for stencils)
- **Optimal**: 300 DPI (best quality)
- App warns if DPI < 150

### Server Components vs Client Components
- **Server Components**: Landing, history list, preview sheets (static rendering)
- **Client Components**: Canvas editor, image uploader, controls (interactivity)
- **Server Actions**: Upload, split, save (mutations)

## API Routes & Server Actions

### Authentication
- `login(email, password)` - Sign in user
- `signup(email, password)` - Create account
- `logout()` - Sign out

### Editor
- `uploadImage(formData)` - Upload image to Supabase
- `splitImage(imageUrl, settings)` - Split and process image
- `saveJob(originalUrl, splitImages, settings)` - Save to database

## Database Schema

```sql
create table print_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  original_image_url text not null,
  split_images jsonb not null,
  settings jsonb not null,
  created_at timestamp with time zone default now()
);
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | ✅ |

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Update Supabase Auth Callback

In your Supabase dashboard:
1. Go to **Authentication** → **URL Configuration**
2. Add your production URL to **Redirect URLs**:
   ```
   https://your-domain.com/auth/callback
   ```

## Troubleshooting

### Images Won't Upload
- Check Supabase storage policies
- Verify `tattoo-images` bucket exists and is public
- Check file size < 10MB

### Split Image Fails
- Ensure Sharp is installed correctly
- Check server logs for errors
- Verify image format is supported (JPG/PNG/WebP)

### Authentication Issues
- Verify environment variables are set
- Check Supabase Auth is enabled
- Restart dev server after changing `.env.local`

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

## Development

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Lint Code
```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

MIT License - feel free to use this project for any purpose.

## Support

For issues and questions:
- Check [`docs/SUPABASE_SETUP.md`](docs/SUPABASE_SETUP.md) for setup help
- Open an issue on GitHub
- Review the troubleshooting section above

## Roadmap

Potential future enhancements:
- [ ] Support for more grid sizes (3×3, 4×4)
- [ ] Image editing (brightness, contrast, filters)
- [ ] Custom grid spacing
- [ ] Multiple print size options (Letter, Legal)
- [ ] Social sharing of stencils
- [ ] Mobile app version

---

Built with ❤️ using Next.js 16, Supabase, and modern web technologies.
