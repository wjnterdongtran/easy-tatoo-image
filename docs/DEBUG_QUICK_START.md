# Debug Mode - Quick Start

Get up and running in 30 seconds without Supabase setup!

## 🚀 Quick Start (3 Commands)

```bash
# 1. Enable debug mode
npm run debug:on

# 2. Start dev server
npm run dev

# 3. Open browser and login with ANY credentials
# Email: test@example.com
# Password: anything
```

That's it! 🎉

## ✅ What You Can Do

- ✅ Upload images (stored as base64)
- ✅ Edit on canvas (Fabric.js)
- ✅ Split into 4 A4 sheets
- ✅ Generate PDFs
- ✅ Save print jobs (localStorage)
- ✅ View history
- ✅ Delete jobs

## 🔄 Toggle Debug Mode

```bash
# Enable debug mode
npm run debug:on

# Disable debug mode (switch to Supabase)
npm run debug:off

# Check current status
npm run debug:status
```

## 🐛 Debug Features

| Feature | Debug Mode | Production |
|---------|-----------|------------|
| **Storage** | localStorage | Supabase |
| **Auth** | Mock (any login) | Real |
| **Images** | Base64 | Cloud URLs |
| **Setup Time** | 0 seconds | ~10 minutes |
| **Cost** | Free | Supabase usage |

## 📊 Debug Banner

Yellow banner at top shows:
- 🐛 Debug mode is active
- **View Data** - See all localStorage data
- **Clear Data** - Remove test data

## ⚠️ Limitations

- Data only in browser (not persistent)
- ~5MB localStorage limit
- Can't test email verification
- Single browser/tab only

## 🎯 Perfect For

- ✅ Feature development
- ✅ UI/UX testing
- ✅ Quick demos
- ✅ Learning the codebase
- ✅ Testing without costs

## 🔒 Switch to Production

When ready for real deployment:

```bash
# 1. Disable debug mode
npm run debug:off

# 2. Set Supabase credentials in .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# 3. Follow full setup guide
# See docs/SUPABASE_SETUP.md

# 4. Restart server
npm run dev
```

## 📚 Full Documentation

- [Full Debug Guide](./DEBUG_MODE.md)
- [Supabase Setup](./SUPABASE_SETUP.md)
- [Main README](../README.md)

---

**TL;DR**: `npm run debug:on` → `npm run dev` → Login with anything → Build!
