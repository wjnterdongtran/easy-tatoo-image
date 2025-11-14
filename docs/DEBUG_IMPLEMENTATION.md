# Debug Mode Implementation Summary

## Overview

Debug mode allows testing the tattoo stencil application without Supabase, using browser localStorage for all data storage. This saves bandwidth, costs, and setup time during development.

## Files Modified/Created

### Core Debug Logic
- **`lib/debug.ts`** ✨ NEW
  - Main debug mode utilities
  - localStorage helpers
  - Mock user management
  - Debug logging functions

### Server Actions (Modified)
- **`app/editor/actions.ts`**
  - `uploadImage()` - Uses base64 instead of Supabase Storage
  - `splitImage()` - Stores splits as base64
  - `saveJob()` - Saves to localStorage instead of database

- **`app/auth/actions.ts`**
  - `login()` - Mock login (always succeeds)
  - `signup()` - Mock signup (no email needed)
  - `logout()` - Mock logout

### Middleware
- **`middleware.ts`**
  - Bypasses auth checks in debug mode
  - Allows access to protected routes

### UI Components
- **`components/DebugBanner.tsx`** ✨ NEW
  - Yellow banner indicator
  - View Data button (logs to console)
  - Clear Data button
  - Only visible when debug mode active

- **`app/layout.tsx`**
  - Added `<DebugBanner />` component

### Configuration
- **`.env.example`** ✨ NEW
  - Added `NEXT_PUBLIC_DEBUG_MODE` variable
  - Documentation and warnings

### Scripts
- **`scripts/toggle-debug.sh`** ✨ NEW
  - Bash script to toggle debug mode
  - Enable/disable/status commands
  - Color-coded output

- **`package.json`**
  - Added npm scripts: `debug:on`, `debug:off`, `debug:status`

### Documentation
- **`docs/DEBUG_MODE.md`** ✨ NEW
  - Comprehensive debug mode guide
  - Features, limitations, best practices
  - Troubleshooting section

- **`docs/DEBUG_QUICK_START.md`** ✨ NEW
  - Quick 30-second setup guide
  - Command reference
  - Feature comparison table

- **`docs/DEBUG_IMPLEMENTATION.md`** ✨ NEW (this file)
  - Technical implementation details

- **`README.md`** (updated)
  - Added debug mode section
  - Quick start options (A/B)

## How It Works

### Environment Variable

```env
NEXT_PUBLIC_DEBUG_MODE=true   # Debug mode ON
NEXT_PUBLIC_DEBUG_MODE=false  # Production mode
```

### Code Flow

```
User Action
    ↓
Server Action Check: if (DEBUG_MODE)
    ↓
    Yes → Use localStorage (base64)
    No  → Use Supabase (cloud storage)
```

### Example: Upload Image

**Production Mode:**
```typescript
// Upload to Supabase Storage
const { data } = await supabase.storage
  .from('tattoo-images')
  .upload(filename, buffer)

return { url: publicUrl }
```

**Debug Mode:**
```typescript
// Convert to base64
const base64 = `data:${file.type};base64,${buffer.toString('base64')}`
console.log('[DEBUG MODE] Image stored as base64')

return { url: base64 }
```

## localStorage Schema

### Keys Used

```javascript
debug_images       // Uploaded images (base64)
debug_print_jobs   // Saved print jobs
debug_user         // Mock user data
```

### Data Structure

```typescript
// debug_images
{
  "image_1699123456": {
    "base64": "data:image/jpeg;base64,...",
    "filename": "tattoo.jpg",
    "size": 102400,
    "timestamp": 1699123456789
  }
}

// debug_print_jobs
{
  "job_abc123": {
    "id": "job_abc123",
    "user_id": "debug-user-123",
    "original_image_url": "data:image/jpeg;base64,...",
    "split_images": [...],
    "settings": { ... },
    "created_at": "2025-01-08T10:30:00.000Z"
  }
}

// debug_user
{
  "id": "debug-user-123",
  "email": "debug@example.com",
  "created_at": "2025-01-08T10:00:00.000Z"
}
```

## Features in Debug Mode

### ✅ Fully Working

1. **Image Upload** - Base64 encoding
2. **Canvas Editing** - Fabric.js (no changes needed)
3. **Image Splitting** - Sharp processing + base64 output
4. **PDF Generation** - jsPDF works with base64
5. **Print Jobs** - Saved to localStorage
6. **History** - Retrieved from localStorage
7. **Delete Jobs** - Remove from localStorage
8. **Mock Auth** - Login/signup always succeed

### 🔄 Modified Behavior

1. **Authentication** - No email verification
2. **Storage** - localStorage instead of Supabase
3. **User Sessions** - Mock user (same for all)
4. **Protected Routes** - Accessible without real auth

### ⚠️ Limitations

1. **Data Persistence** - Cleared with browser cache
2. **Storage Size** - ~5-10MB limit
3. **Sharing** - Can't share between browsers/tabs
4. **Real-time** - No server-side features

## Benefits

### For Development

- ✅ **No Setup** - Start coding immediately
- ✅ **Fast Iteration** - No network requests
- ✅ **Offline Work** - No internet needed
- ✅ **Cost Savings** - No Supabase usage

### For Testing

- ✅ **Quick Tests** - Login with any credentials
- ✅ **Fresh State** - Easy to clear data
- ✅ **Predictable** - No external dependencies
- ✅ **Console Logs** - All actions logged

## Production Checklist

Before deploying, ensure:

```bash
# 1. Disable debug mode
npm run debug:off

# 2. Verify in .env.local
NEXT_PUBLIC_DEBUG_MODE=false  ✅

# 3. Set Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=...  ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=...  ✅
SUPABASE_SERVICE_ROLE_KEY=...  ✅

# 4. Test real authentication
✅ Login with real account
✅ Upload image to Supabase
✅ Verify database writes
✅ Check storage bucket

# 5. Remove debug logs
✅ No console.log('[DEBUG MODE]...')
```

## Testing Debug Mode

### Enable Debug Mode
```bash
npm run debug:on
npm run dev
```

### Test Workflow
1. Go to `/auth/login`
2. Login: `test@test.com` / `password`
3. Upload image → Check console for `[DEBUG MODE]`
4. Split image → Check base64 URLs
5. Save job → Open DevTools → Application → localStorage
6. View history → See saved jobs
7. Click "View Data" in banner → See all data in console

### Verify localStorage
```javascript
// In browser console (F12)
Object.keys(localStorage)
// Should show: ['debug_images', 'debug_print_jobs', 'debug_user']
```

### Clear Debug Data
```bash
# Method 1: Click "Clear Data" in yellow banner
# Method 2: Console
localStorage.clear()
```

## Troubleshooting

### Issue: Debug mode not activating

**Check:**
1. `.env.local` has `NEXT_PUBLIC_DEBUG_MODE=true`
2. Server restarted after changing env
3. Hard refresh browser (Ctrl+Shift+R)
4. Check console for `[DEBUG MODE]` logs

### Issue: localStorage full

**Solution:**
```javascript
// Clear old data
localStorage.removeItem('debug_images')
localStorage.removeItem('debug_print_jobs')

// Or use smaller test images (<500KB)
```

### Issue: Auth still redirecting

**Check:**
1. Middleware is checking `DEBUG_MODE`
2. Server restarted
3. Browser cache cleared

## Future Enhancements

Potential improvements:

- [ ] IndexedDB for larger storage
- [ ] Export/import debug data
- [ ] Multiple debug users
- [ ] Debug session management
- [ ] Visual debug panel
- [ ] Performance metrics in debug mode

## Console Logs

All debug operations log to console:

```
[DEBUG MODE] Image stored as base64 (not uploaded to Supabase)
[DEBUG MODE] Split images stored as base64 (not uploaded to Supabase)
[DEBUG MODE] Print job saved to localStorage: job_abc123
[DEBUG MODE] Mock login: test@example.com
[DEBUG MODE] Mock logout
```

## Code Patterns

### Consistent Pattern in Server Actions

```typescript
export async function someAction() {
  // DEBUG MODE: Use localStorage
  if (DEBUG_MODE) {
    console.log('[DEBUG MODE] ...')
    // localStorage logic
    return { success: true, data: ... }
  }

  // PRODUCTION MODE: Use Supabase
  const supabase = await createClient()
  // Supabase logic
  return { success: true, data: ... }
}
```

### Environment Variable Access

```typescript
// Server-side (Server Actions, middleware)
import { DEBUG_MODE } from '@/lib/debug'
if (DEBUG_MODE) { ... }

// Or direct access
if (process.env.NEXT_PUBLIC_DEBUG_MODE === 'true') { ... }

// Client-side (React components)
import { DEBUG_MODE } from '@/lib/debug'
if (DEBUG_MODE) { ... }
```

## Summary

Debug mode provides a **complete local development experience** without external dependencies. Perfect for:

- 🚀 Quick prototyping
- 🧪 Testing new features
- 📚 Learning the codebase
- 💰 Saving Supabase costs
- 🔌 Offline development

**Use debug mode for development, production mode for deployment.**

---

**Quick Commands:**

```bash
npm run debug:on      # Enable debug mode
npm run debug:off     # Disable debug mode
npm run debug:status  # Check status
```
