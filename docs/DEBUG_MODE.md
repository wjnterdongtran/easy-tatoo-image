# Debug Mode Guide

Debug mode allows you to test the application without consuming Supabase resources. All data is stored locally in your browser's localStorage.

## Why Use Debug Mode?

- **Save Costs**: No Supabase bandwidth or storage usage during development
- **Faster Testing**: No network requests to external services
- **Offline Development**: Work without internet connection
- **Quick Iteration**: Test features without database setup

## Enabling Debug Mode

### 1. Set Environment Variable

In your `.env.local` file:

```env
NEXT_PUBLIC_DEBUG_MODE=true
```

### 2. Restart Development Server

```bash
npm run dev
```

You'll see a **yellow banner** at the top of the page indicating debug mode is active.

## What Changes in Debug Mode?

### ✅ What Works

| Feature | Debug Mode | Production Mode |
|---------|-----------|-----------------|
| Image Upload | Base64 in localStorage | Supabase Storage |
| Image Splitting | Works (base64) | Works (Supabase) |
| Print Jobs | localStorage | Supabase Database |
| PDF Generation | ✅ Works | ✅ Works |
| Authentication | Mock (always succeeds) | Real Supabase Auth |
| History | localStorage | Supabase Database |

### 🔄 Mock Authentication

In debug mode, authentication is **mocked**:

- **Login**: Any email/password combination works
- **Signup**: No email verification needed
- **Logout**: Clears debug data
- **Protected Routes**: Accessible without real authentication

Example:
```
Email: test@example.com
Password: anything
```

### 💾 Data Storage

All data is stored in browser localStorage:

```javascript
// Storage keys
debug_images        // Uploaded images (base64)
debug_print_jobs    // Saved print jobs
debug_user          // Mock user data
```

### 🐛 Debug Banner Features

When debug mode is active, you'll see a yellow banner with:

- **View Data**: Logs all debug data to browser console (F12)
- **Clear Data**: Removes all stored debug data

## Using Debug Mode

### Step 1: Enable Debug Mode

```bash
echo "NEXT_PUBLIC_DEBUG_MODE=true" >> .env.local
npm run dev
```

### Step 2: Login with Any Credentials

Go to `/auth/login` and use any email/password:

```
Email: debug@test.com
Password: 12345
```

### Step 3: Test Features

1. **Upload Image**: Images stored as base64
2. **Adjust Settings**: Works normally
3. **Split Image**: Creates 4 sheets (base64)
4. **Generate PDF**: Works with base64 images
5. **Save Job**: Stored in localStorage
6. **View History**: Shows localStorage jobs

### Step 4: View Debug Data

Click "View Data" in the yellow banner, then open browser console (F12):

```javascript
// You'll see:
🐛 DEBUG DATA
  Images: {...}
  Print Jobs: {...}
```

### Step 5: Clear Debug Data (Optional)

Click "Clear Data" in the yellow banner to remove all test data.

## Switching Between Modes

### Debug → Production

1. Set `NEXT_PUBLIC_DEBUG_MODE=false` in `.env.local`
2. Restart server: `npm run dev`
3. Set up Supabase credentials
4. Yellow banner disappears

### Production → Debug

1. Set `NEXT_PUBLIC_DEBUG_MODE=true` in `.env.local`
2. Restart server: `npm run dev`
3. Yellow banner appears
4. Can test without Supabase

## Limitations

### ⚠️ Debug Mode Limitations

1. **Data Persistence**: localStorage is cleared if you:
   - Clear browser cache
   - Use incognito/private mode
   - Switch browsers

2. **Storage Size**: localStorage has ~5-10MB limit
   - Large images may exceed limit
   - Use smaller test images

3. **No Real Auth**:
   - Can't test email verification
   - Can't test real authentication flows
   - All users share same "debug user"

4. **No Server-Side Features**:
   - No real-time updates
   - No database triggers
   - No storage policies

5. **Single User**: All data stored under one debug user ID

### ✅ What Still Works Perfectly

- Image processing with Sharp
- PDF generation with jsPDF
- Canvas editing with Fabric.js
- All UI components
- State management
- Client-side features

## Debug Console Logs

When debug mode is active, you'll see console logs:

```
[DEBUG MODE] Image stored as base64 (not uploaded to Supabase)
[DEBUG MODE] Split images stored as base64 (not uploaded to Supabase)
[DEBUG MODE] Print job saved to localStorage: job_123456
[DEBUG MODE] Mock login: test@example.com
```

## Inspecting Debug Data

### View in Console

```javascript
// In browser console (F12)
localStorage.getItem('debug_images')
localStorage.getItem('debug_print_jobs')
localStorage.getItem('debug_user')
```

### View in Application Tab

1. Open DevTools (F12)
2. Go to "Application" tab
3. Navigate to "Local Storage"
4. Select your domain
5. See all debug keys

## Clearing Debug Data

### Method 1: Use Debug Banner

Click "Clear Data" button in yellow banner.

### Method 2: Console

```javascript
// Clear all debug data
localStorage.removeItem('debug_images')
localStorage.removeItem('debug_print_jobs')
localStorage.removeItem('debug_user')
```

### Method 3: Clear All localStorage

```javascript
localStorage.clear()
```

## Best Practices

### ✅ Do

- Use debug mode for feature development
- Use debug mode for UI testing
- Use debug mode for quick iterations
- Clear data between test sessions
- Test with small images (<1MB)

### ❌ Don't

- Use debug mode in production
- Commit `NEXT_PUBLIC_DEBUG_MODE=true`
- Store sensitive data in localStorage
- Test with very large images
- Rely on debug data long-term

## Common Issues

### Issue: "localStorage is full"

**Solution**: Clear debug data or use smaller images

```javascript
localStorage.clear()
```

### Issue: Debug banner not showing

**Solution**:
1. Check `NEXT_PUBLIC_DEBUG_MODE=true` in `.env.local`
2. Restart development server
3. Hard refresh browser (Ctrl+Shift+R)

### Issue: Can't access protected routes

**Solution**: Debug mode should bypass auth. If not:
1. Restart server
2. Clear browser cache
3. Check middleware.ts

### Issue: Images not displaying

**Solution**: Base64 images might be too large for localStorage. Use smaller test images (<500KB).

## Production Checklist

Before deploying to production:

- [ ] Set `NEXT_PUBLIC_DEBUG_MODE=false`
- [ ] Set up real Supabase credentials
- [ ] Test with real authentication
- [ ] Verify Supabase storage works
- [ ] Check database writes
- [ ] Remove any debug logs

## Environment Variables

```env
# Development (Debug Mode)
NEXT_PUBLIC_DEBUG_MODE=true

# Production (Real Supabase)
NEXT_PUBLIC_DEBUG_MODE=false
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

## Summary

Debug mode is perfect for:
- ✅ Rapid feature development
- ✅ UI/UX testing
- ✅ Offline development
- ✅ Saving Supabase costs
- ✅ Quick prototyping

But remember:
- ⚠️ Not for production use
- ⚠️ Limited by localStorage size
- ⚠️ No real authentication
- ⚠️ Data not persistent across browsers

Happy debugging! 🐛
