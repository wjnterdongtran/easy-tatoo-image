# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - Project name: `tattoo-print-app` (or your choice)
   - Database password: (create a strong password)
   - Region: Choose closest to your users
5. Wait for project to be created (~2 minutes)

## 2. Get API Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

3. Create `.env.local` in your project root:
```bash
cp .env.local.example .env.local
```

4. Paste your credentials into `.env.local`

## 3. Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Run this SQL:

```sql
-- Create print_jobs table
create table print_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  original_image_url text not null,
  split_images jsonb not null, -- Array of 4 image URLs
  settings jsonb not null, -- {width_inches, dpi, overlap_mm, rotation}
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table print_jobs enable row level security;

-- Create policies
-- Users can only see their own jobs
create policy "Users can view their own print jobs"
  on print_jobs for select
  using (auth.uid() = user_id);

-- Users can insert their own jobs
create policy "Users can create their own print jobs"
  on print_jobs for insert
  with check (auth.uid() = user_id);

-- Users can delete their own jobs
create policy "Users can delete their own print jobs"
  on print_jobs for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index print_jobs_user_id_idx on print_jobs(user_id);
create index print_jobs_created_at_idx on print_jobs(created_at desc);
```

## 4. Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Settings:
   - **Name**: `tattoo-images`
   - **Public bucket**: ✅ Enable (so images can be viewed)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`
4. Click **Create bucket**

## 5. Set Storage Policies

1. Click on the `tattoo-images` bucket
2. Go to **Policies** tab
3. Click **New Policy** for each:

**Policy 1: Allow authenticated users to upload**
```sql
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'tattoo-images');
```

**Policy 2: Public read access**
```sql
create policy "Public can view images"
on storage.objects for select
to public
using (bucket_id = 'tattoo-images');
```

**Policy 3: Users can delete their own images**
```sql
create policy "Users can delete their own images"
on storage.objects for delete
to authenticated
using (bucket_id = 'tattoo-images' and auth.uid()::text = (storage.foldername(name))[1]);
```

## 6. Enable Email Auth

1. Go to **Authentication** → **Providers**
2. Ensure **Email** is enabled
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize confirmation email if desired

## 7. Verify Setup

Run this query in SQL Editor to verify:
```sql
-- Check if table exists
select * from print_jobs limit 1;

-- Check if bucket exists
select * from storage.buckets where name = 'tattoo-images';
```

## 8. Done!

Your Supabase backend is now ready. Return to your Next.js app and continue development.

## Troubleshooting

### Can't connect to Supabase
- Verify `.env.local` credentials are correct
- Ensure `.env.local` is in your project root
- Restart your Next.js dev server after changing env vars

### Images won't upload
- Check storage policies are created
- Verify bucket name is `tattoo-images`
- Check file size is under 10MB

### Database queries failing
- Verify RLS policies are created
- Check that user is authenticated
- View error logs in Supabase dashboard: **Database** → **Logs**
