# Debug Mode UI Toggle

## Overview

The app now has a **visual UI toggle** at the top of every page to switch between Debug Mode and Production Mode with a single click.

## Features

### 🎛️ Visual Toggle Bar

**Debug Mode (Yellow Bar):**
```
🐛 DEBUG MODE | Using localStorage instead of Supabase | Storage: 2.5 KB | [Debug Tools ▼] [🔒 Switch to Production]
```

**Production Mode (Gray Bar):**
```
🔒 PRODUCTION MODE | [🐛 Switch to Debug]
```

### 📊 Debug Tools Dropdown

When in debug mode, click **"Debug Tools"** to access:

1. **📊 View Data (Console)** - Logs all localStorage data to browser console
2. **🗑️ Clear All Data** - Removes all debug data with confirmation
3. **🔑 View Keys** - Shows all localStorage keys in console
4. **📋 Copy Data** - Copies all debug data to clipboard as JSON

### 🔄 One-Click Toggle

Click the toggle button to switch modes:
- **Debug → Production**: Updates `.env.local` and reloads
- **Production → Debug**: Updates `.env.local` and reloads

## How It Works

### UI Component

`components/DebugBanner.tsx`:
- Always visible at top of page
- Shows current mode (Debug or Production)
- Provides quick access to debug tools
- Displays localStorage usage in debug mode

### API Route

`app/api/debug/toggle/route.ts`:
- **POST** - Updates `NEXT_PUBLIC_DEBUG_MODE` in `.env.local`
- **GET** - Returns current debug mode status
- Handles file creation if `.env.local` doesn't exist

### Toggle Flow

```
User clicks toggle button
    ↓
API POST /api/debug/toggle
    ↓
Updates .env.local file
    ↓
Returns success
    ↓
Page auto-reloads
    ↓
App now in new mode
```

## Usage

### Switch to Debug Mode

1. Click **"🐛 Switch to Debug"** button in top bar
2. Wait for toast notification
3. Page auto-reloads in debug mode
4. Yellow banner appears
5. Use any credentials to login

### Switch to Production Mode

1. Click **"🔒 Switch to Production"** button
2. Wait for toast notification
3. Page auto-reloads in production mode
4. Gray banner appears
5. Need real Supabase credentials

### View Debug Data

1. In debug mode, click **"Debug Tools"** dropdown
2. Click **"📊 View Data (Console)"**
3. Open DevTools (F12)
4. See all data in console

### Clear Debug Data

1. Click **"Debug Tools"** → **"🗑️ Clear All Data"**
2. Confirm deletion
3. All localStorage cleared
4. Page reloads

### Copy Debug Data

1. Click **"Debug Tools"** → **"📋 Copy Data"**
2. Data copied to clipboard as JSON
3. Paste anywhere to share/backup

## Visual States

### Debug Mode Active
```
┌─────────────────────────────────────────────────────────────────┐
│ 🐛 DEBUG MODE | localStorage | Storage: 2.5 KB | [...] [Toggle] │
└─────────────────────────────────────────────────────────────────┘
  ↑ Yellow background
```

### Production Mode Active
```
┌─────────────────────────────────────────────────────────────────┐
│ 🔒 PRODUCTION MODE                              [🐛 Switch]      │
└─────────────────────────────────────────────────────────────────┘
  ↑ Gray background
```

## Storage Usage Indicator

Shows real-time localStorage usage:
- Updates automatically
- Format: `X.XX KB`
- Helps monitor storage limits (~5-10MB)

Example:
```
Storage: 0.00 KB    (empty)
Storage: 1.23 KB    (small data)
Storage: 125.45 KB  (moderate data)
Storage: 2048.00 KB (large data, ~2MB)
```

## Benefits

### ✅ User-Friendly
- Visual feedback (yellow = debug, gray = production)
- One-click toggle (no terminal needed)
- Auto-reload after switch
- Clear status indicator

### ✅ Developer-Friendly
- Quick mode switching during development
- Easy debug data inspection
- Storage monitoring
- Export/import capabilities

### ✅ Safe
- Confirmation for destructive actions
- Toast notifications for all actions
- Error handling with fallback messages
- No accidental data loss

## Examples

### Quick Debug Session

```
1. Open app (production mode)
2. Click "🐛 Switch to Debug"
3. Page reloads with yellow banner
4. Login with test@test.com / password
5. Upload image → click "Debug Tools" → "View Data"
6. See base64 image in console
7. Done testing → click "🔒 Switch to Production"
```

### Inspect localStorage

```
1. In debug mode
2. Upload image and split
3. Click "Debug Tools" → "View Keys"
4. Console shows: ['debug_images', 'debug_print_jobs', 'debug_user']
5. Click "View Data (Console)"
6. Console shows full JSON of all data
```

### Export Debug Data

```
1. Do some testing in debug mode
2. Click "Debug Tools" → "Copy Data"
3. Paste into text editor
4. Share with team or save as backup
```

## Troubleshooting

### Toggle not working

**Issue**: Click toggle but nothing happens

**Solution**:
1. Check browser console for errors
2. Ensure API route is accessible (`/api/debug/toggle`)
3. Check file permissions on `.env.local`
4. Manually edit `.env.local` if needed

### Banner not showing

**Issue**: No banner at top of page

**Solution**:
1. Check `app/layout.tsx` includes `<DebugBanner />`
2. Hard refresh (Ctrl+Shift+R)
3. Clear browser cache

### Mode doesn't change

**Issue**: Toggle succeeds but mode stays the same

**Solution**:
1. Wait for auto-reload (2 seconds)
2. If no reload, manually refresh (F5)
3. Check `.env.local` was actually updated
4. Restart dev server: `npm run dev`

## Advanced Usage

### Programmatic Toggle

You can also toggle via API directly:

```javascript
// Enable debug mode
await fetch('/api/debug/toggle', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ enabled: true })
})

// Check status
const response = await fetch('/api/debug/toggle')
const { debugMode } = await response.json()
console.log('Debug mode:', debugMode)
```

### Custom Debug Tools

Extend the dropdown menu in `DebugBanner.tsx`:

```typescript
<DropdownMenuItem onClick={() => {
  // Your custom debug action
  console.log('Custom debug info')
}}>
  🔧 Custom Tool
</DropdownMenuItem>
```

## Keyboard Shortcuts (Future)

Could add keyboard shortcuts:
- `Ctrl+Shift+D` - Toggle debug mode
- `Ctrl+Shift+V` - View debug data
- `Ctrl+Shift+C` - Clear debug data

## Summary

The UI toggle provides:
- ✅ **Visual** mode indicator (always visible)
- ✅ **One-click** mode switching
- ✅ **Debug tools** dropdown menu
- ✅ **Storage** usage monitoring
- ✅ **Quick access** to debug actions
- ✅ **No terminal** commands needed

**Perfect for rapid development iterations!** 🚀
