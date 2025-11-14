# Changelog

All notable changes to the Tattoo Stencil Printer project.

## [Unreleased]

### Added - Debug Mode Feature

#### Core Functionality
- **Debug Mode System** - Complete localStorage-based testing environment
  - Environment variable: `NEXT_PUBLIC_DEBUG_MODE=true/false`
  - No Supabase required for testing
  - All features work offline with mock data

#### New Files
- `lib/debug.ts` - Debug mode utilities and localStorage helpers
- `components/DebugBanner.tsx` - Visual debug mode indicator with controls
- `scripts/toggle-debug.sh` - Bash script to toggle debug mode
- `docs/DEBUG_MODE.md` - Comprehensive debug mode documentation
- `docs/DEBUG_QUICK_START.md` - Quick start guide for debug mode
- `docs/DEBUG_IMPLEMENTATION.md` - Technical implementation details
- `.env.example` - Environment variables template with debug mode

#### Modified Files
- `app/editor/actions.ts` - Added debug mode support for upload/split/save
- `app/auth/actions.ts` - Added mock authentication for debug mode
- `middleware.ts` - Bypass auth checks in debug mode
- `app/layout.tsx` - Added DebugBanner component
- `package.json` - Added npm scripts: `debug:on`, `debug:off`, `debug:status`
- `README.md` - Updated with debug mode quick start options

#### Features in Debug Mode
- ✅ Image upload (base64 encoding)
- ✅ Canvas editing with Fabric.js
- ✅ Image splitting with Sharp
- ✅ PDF generation with jsPDF
- ✅ Print job persistence (localStorage)
- ✅ History viewing and management
- ✅ Mock authentication (any login works)
- ✅ Visual debug banner with data controls

#### Developer Experience
- 🚀 Zero-config quick start
- 🐛 Console logging for all debug operations
- 🔄 Easy toggle with `npm run debug:on/off`
- 📊 View debug data from banner button
- 🗑️ Clear debug data with one click
- ⚡ Fast iteration without network requests

#### Benefits
- **Cost Savings** - No Supabase usage during development
- **Faster Testing** - No setup required
- **Offline Development** - Work without internet
- **Quick Demos** - Show features immediately
- **Learning Aid** - Understand codebase without external deps

---

## [0.1.0] - 2025-01-08

### Added - Initial Release

#### Core Features
- Next.js 16 application with App Router
- Tattoo stencil splitting (1 image → 4 A4 sheets)
- Canvas-based image editor with Fabric.js
- PDF generation with jsPDF
- User authentication with Supabase Auth
- Image storage with Supabase Storage
- Print history with Supabase Database

#### Technologies
- Next.js 16 (React 19)
- TypeScript (strict mode)
- Tailwind CSS v4
- shadcn/ui components
- Fabric.js v6 (canvas editing)
- Sharp (server-side image processing)
- Supabase (backend services)
- Zustand (state management)

#### Features
- Drag & drop image upload
- Interactive canvas editing (resize, rotate, pan)
- Real-time DPI calculation
- Configurable overlap (5/10/15mm)
- Grid lines (1cm spacing)
- Corner alignment marks
- PDF download (all sheets or individual)
- Print history management
- Responsive design

#### Documentation
- README.md - Main documentation
- SUPABASE_SETUP.md - Backend setup guide
- Complete TypeScript types
- Inline code comments

---

## Version History

- **v0.1.0** - Initial release (2025-01-08)
  - Full tattoo stencil printing application
  - Supabase backend integration
  - Production-ready code

- **Unreleased** - Debug Mode (2025-01-08)
  - localStorage-based testing
  - Mock authentication
  - Offline development support
  - Developer experience improvements

---

## Migration Guide

### From Production to Debug Mode

```bash
# Enable debug mode
npm run debug:on

# Restart server
npm run dev

# Login with any credentials
# Email: anything@test.com
# Password: anything
```

### From Debug to Production Mode

```bash
# Disable debug mode
npm run debug:off

# Add Supabase credentials to .env.local
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Restart server
npm run dev
```

---

## Breaking Changes

None - Debug mode is fully backward compatible. Existing production deployments are not affected.

## Deprecations

None

## Security

No security issues to report. Debug mode is client-side only and disabled by default in production.

## Notes

- Debug mode should **never** be enabled in production
- Always set `NEXT_PUBLIC_DEBUG_MODE=false` for deployments
- localStorage has ~5-10MB limit in debug mode
- Debug data is browser-specific (not shared across devices)
