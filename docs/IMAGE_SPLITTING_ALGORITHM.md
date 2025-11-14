# Image Splitting Algorithm

## Problem Solved

**Issue**: When splitting image after applying target width, the 4 sheets don't align properly when assembled.

**Root Cause**: The old algorithm was:
1. Calculate split dimensions from original image
2. Apply rotation during extraction
3. Result: Misaligned pieces due to dimension calculations on un-rotated image

## New Algorithm (Fixed)

### Process Flow

```
Original Image (e.g., 3000x2000 px)
    ↓
1. ROTATE (if needed)
    ↓
Rotated Image (e.g., 2000x3000 px if 90°)
    ↓
2. RESIZE to target width
   Target: 6.5 inches @ calculated DPI
    ↓
Resized Image (e.g., 1950x1300 px)
    ↓
3. SPLIT into 2x2 grid with overlap
    ↓
4 Sheets with overlap zones
    ↓
4. ADD grid lines & alignment marks
    ↓
Final 4 A4 sheets ready to print
```

### Step-by-Step

#### Step 1: Apply Rotation to Full Image

```typescript
// Rotate the ENTIRE image first
if (rotation !== 0) {
  processedImage = processedImage.rotate(rotation, {
    background: { r: 255, g: 255, b: 255, alpha: 1 }
  })
}

// Get dimensions AFTER rotation
const rotatedMetadata = await processedImage.metadata()
const originalWidth = rotatedMetadata.width
const originalHeight = rotatedMetadata.height
```

**Why**: Rotating changes dimensions. A 3000x2000 image rotated 90° becomes 2000x3000.

#### Step 2: Resize to Target Width

```typescript
// Calculate DPI based on rotated dimensions
const dpi = Math.round(originalWidth / targetWidthInches)

// Calculate final dimensions
const finalWidth = Math.round(targetWidthInches * dpi)
const aspectRatio = originalHeight / originalWidth
const finalHeight = Math.round(finalWidth * aspectRatio)

// Resize the entire image
processedImage = processedImage.resize(finalWidth, finalHeight, {
  fit: 'fill',
  kernel: 'lanczos3', // High quality
})
```

**Why**: We resize the FULL image to target dimensions before splitting. This ensures the assembled result matches the target width exactly.

#### Step 3: Calculate Split Dimensions

```typescript
// Overlap in pixels
const overlapPx = Math.round(overlapMm * pixelsPerMm)

// Each sheet is half the image
const sheetWidth = Math.floor(finalWidth / 2)
const sheetHeight = Math.floor(finalHeight / 2)

// 2x2 grid positions
// [0,0] [0,1]
// [1,0] [1,1]
```

**Why**: Simple 2x2 split. Each piece is exactly half width and half height, with overlap added.

#### Step 4: Extract Each Sheet with Overlap

```typescript
// For each position (row, col):

// Top-left [0,0]: Start at (0, 0), add overlap on right & bottom
// Top-right [0,1]: Start at (width/2 - overlap, 0), add overlap on left & bottom
// Bottom-left [1,0]: Start at (0, height/2 - overlap), add overlap on right & top
// Bottom-right [1,1]: Start at (width/2 - overlap, height/2 - overlap), overlap all sides

const left = col === 0 ? 0 : sheetWidth - overlapPx
const top = row === 0 ? 0 : sheetHeight - overlapPx

const extractWidth = col === 0
  ? sheetWidth + overlapPx  // Right edge overlaps into next sheet
  : sheetWidth + overlapPx  // Left edge overlaps from previous sheet

const extractHeight = row === 0
  ? sheetHeight + overlapPx  // Bottom edge overlaps
  : sheetHeight + overlapPx  // Top edge overlaps
```

**Why**: Overlap zones ensure no gaps when assembling. Interior edges have overlap, exterior edges don't.

#### Step 5: Add Grid Lines & Alignment Marks

```typescript
// For each extracted sheet:
// 1. Draw grid lines every 1cm
// 2. Add alignment crosses at overlap corners
// 3. Composite SVG overlay on image
```

**Why**: Visual guides for alignment when applying the tattoo stencil.

## Overlap Strategy

### Visual Representation

```
┌────────────────┬────────────────┐
│                │                │
│   Sheet 1      │   Sheet 2      │
│   [0,0]        │   [0,1]        │
│                │                │
│          ┌─────┼─────┐          │
│          │ OL  │  OL │          │
├──────────┼─────┼─────┼──────────┤
│          │ OL  │  OL │          │
│          └─────┼─────┘          │
│                │                │
│   Sheet 3      │   Sheet 4      │
│   [1,0]        │   [1,1]        │
│                │                │
└────────────────┴────────────────┘

OL = Overlap zone (5mm, 10mm, or 15mm)
```

### Overlap Dimensions

For a 1950px wide image with 10mm overlap:

```
Sheet 1 [0,0]:
  - Start: (0, 0)
  - Width: 975px + overlap
  - Height: 650px + overlap

Sheet 2 [0,1]:
  - Start: (975px - overlap, 0)
  - Width: 975px + overlap
  - Height: 650px + overlap

Sheet 3 [1,0]:
  - Start: (0, 650px - overlap)
  - Width: 975px + overlap
  - Height: 650px + overlap

Sheet 4 [1,1]:
  - Start: (975px - overlap, 650px - overlap)
  - Width: 975px + overlap
  - Height: 650px + overlap
```

## Alignment Marks

### Mark Placement

```
Sheet 1 [0,0]:          Sheet 2 [0,1]:
┌─────────────┐         ┌─────────────┐
│             │         │             │
│             │         │             │
│             │         │             │
│           ┌─+─┐     ┌─+─┐           │
│           │ X │     │ X │           │
└───────────┴─+─┘     └─+─┴───────────┘
                ^       ^
            Overlap    Overlap
             marks     marks

Sheet 3 [1,0]:          Sheet 4 [1,1]:
┌───────────┬─+─┐     ┌─+─┬───────────┐
│           │ X │     │ X │           │
│           └─+─┘     └─+─┘           │
│             │         │             │
│             │         │             │
│             │         │             │
└─────────────┘         └─────────────┘
```

Each `X` is a cross mark with circle for precise alignment.

## Example Calculations

### Input
- Original image: 3000x2000 px
- Rotation: 0°
- Target width: 6.5 inches
- Overlap: 10mm

### Step-by-Step Calculation

```
1. ROTATION
   - No rotation (0°)
   - Dimensions: 3000x2000 px

2. DPI CALCULATION
   - DPI = 3000 / 6.5 = 461 DPI
   - pixels/mm = 461 / 25.4 = 18.15 px/mm

3. RESIZE
   - Final width = 6.5 * 461 = 2996 px ≈ 3000 px
   - Aspect ratio = 2000 / 3000 = 0.667
   - Final height = 2996 * 0.667 = 1998 px ≈ 2000 px
   - (No resize needed in this case!)

4. OVERLAP
   - Overlap = 10mm * 18.15 = 181.5 px ≈ 182 px

5. SHEET DIMENSIONS
   - Sheet width = 3000 / 2 = 1500 px
   - Sheet height = 2000 / 2 = 1000 px
   - With overlap = 1500 + 182 = 1682 px wide

6. EXTRACTION
   Sheet 1: Extract(0, 0, 1682px, 1182px)
   Sheet 2: Extract(1318, 0, 1682px, 1182px)
   Sheet 3: Extract(0, 818, 1682px, 1182px)
   Sheet 4: Extract(1318, 818, 1682px, 1182px)
```

### Result
- 4 sheets, each ~1682x1182 px
- Each sheet overlaps with neighbors by 182px (10mm)
- When assembled, total size is 3000x2000 px (6.5 inches wide)

## Benefits of New Algorithm

### ✅ Accurate Assembly
- **Before**: Sheets didn't align due to rotation being applied after split calculation
- **After**: Sheets align perfectly because split happens after all transformations

### ✅ Predictable Output
- **Before**: Final assembled size was unpredictable
- **After**: Final assembled size matches target width exactly

### ✅ Quality Preservation
- Uses Lanczos3 resampling (highest quality)
- Maintains aspect ratio
- Sharp edges and details

### ✅ Correct Overlap
- Overlap zones calculated at final DPI
- Consistent overlap width/height
- Proper alignment marks placement

## Testing

### Test Case 1: No Rotation

```typescript
Input:
  - Image: 3000x2000 px
  - Target: 6 inches
  - Overlap: 10mm
  - Rotation: 0°

Expected:
  - DPI: 500
  - Final: 3000x2000 px
  - Each sheet: ~1590x1090 px (with overlap)
  - Assembled: Exactly 6 inches wide
```

### Test Case 2: 90° Rotation

```typescript
Input:
  - Image: 3000x2000 px (landscape)
  - Target: 6 inches
  - Overlap: 10mm
  - Rotation: 90°

After Rotation:
  - Rotated: 2000x3000 px (portrait)
  - DPI: 333
  - Final: 2000x3000 px
  - Each sheet: ~1060x1590 px
  - Assembled: Exactly 6 inches wide (in portrait)
```

### Test Case 3: Large Overlap

```typescript
Input:
  - Image: 3000x2000 px
  - Target: 6.5 inches
  - Overlap: 15mm (larger overlap)
  - Rotation: 0°

Expected:
  - Overlap px: ~273 px
  - Each sheet: ~1773x1273 px
  - More overlap = easier alignment but larger sheets
```

## Common Issues (Now Fixed)

### ❌ Issue 1: Misaligned Sheets
**Cause**: Rotation applied after dimension calculation
**Fix**: Rotate first, then calculate dimensions

### ❌ Issue 2: Wrong Final Size
**Cause**: No resize step, just direct split
**Fix**: Resize to target dimensions before splitting

### ❌ Issue 3: Inconsistent Overlap
**Cause**: Overlap calculated from original image DPI
**Fix**: Calculate overlap from final DPI

## Summary

The new algorithm ensures:
1. ✅ **Rotation** applied to full image first
2. ✅ **Resize** to exact target width
3. ✅ **Split** with precise overlap calculations
4. ✅ **Grid & marks** at correct DPI
5. ✅ **Perfect alignment** when sheets are assembled

**Result**: 4 sheets that fit together perfectly to create the desired final size!
