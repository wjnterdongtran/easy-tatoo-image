import sharp from "sharp";
import {
    ImageSettings,
    SplitImage,
    PAPER_SIZE,
    GRID_SPACING_CM,
    ALIGNMENT_MARK_SIZE_MM,
} from "./types";

/**
 * Calculate final dimensions for the image based on target width
 */
export function calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    targetWidthInches: number
) {
    const aspectRatio = originalHeight / originalWidth;
    const finalWidthPx = Math.round(originalWidth);
    const finalHeightPx = Math.round(originalWidth * aspectRatio);

    return {
        width: finalWidthPx,
        height: finalHeightPx,
        dpi: Math.round(originalWidth / targetWidthInches),
    };
}

/**
 * Split image into 4 A4 sheets (2x2 grid) that can be reassembled into the original
 *
 * Process:
 * 1. Apply rotation to full image (if needed)
 * 2. Resize to target width while maintaining aspect ratio
 * 3. Split into exact 2x2 grid (no overlap)
 * 4. Add grid lines and alignment marks to each sheet
 * 5. Add white padding if needed to ensure sheets can be perfectly reassembled
 */
export async function splitImageIntoSheets(
    imageBuffer: Buffer,
    settings: ImageSettings
): Promise<{ buffers: Buffer[]; positions: SplitImage["position"][] }> {
    const { targetWidthInches, rotation } = settings;

    // STEP 1: Apply rotation first (to the full image)
    let processedImage = sharp(imageBuffer);

    if (rotation !== 0) {
        processedImage = processedImage.rotate(rotation, {
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        });
    }

    // Get metadata after rotation
    const rotatedMetadata = await processedImage.metadata();
    const originalWidth = rotatedMetadata.width || 0;
    const originalHeight = rotatedMetadata.height || 0;

    // STEP 2: Calculate target dimensions based on desired print width
    // We want the FINAL assembled image to be targetWidthInches wide
    // Always use OPTIMAL_DPI (300) for print output to ensure correct physical size
    const OPTIMAL_DPI = 300;
    const targetDPI = OPTIMAL_DPI;

    const pixelsPerMm = targetDPI / 25.4;
    const pixelsPerInch = targetDPI;

    // Calculate final image dimensions at target width and DPI
    // This will resize the image to achieve the target print size
    const finalWidth = Math.round(targetWidthInches * pixelsPerInch);
    const aspectRatio = originalHeight / originalWidth;
    const finalHeight = Math.round(finalWidth * aspectRatio);

    // Resize image to target dimensions
    processedImage = processedImage.resize(finalWidth, finalHeight, {
        fit: "fill",
        kernel: "lanczos3", // High quality
    });

    // Convert to buffer for splitting
    const resizedBuffer = await processedImage.toBuffer();

    // STEP 3: Calculate split dimensions
    // Grid spacing in pixels (1cm)
    const gridSpacingPx = Math.round(GRID_SPACING_CM * 10 * pixelsPerMm);

    // Split image into exactly 4 equal parts
    // Calculate width and height for each quadrant
    const halfWidth = Math.ceil(finalWidth / 2);
    const halfHeight = Math.ceil(finalHeight / 2);

    // Positions for 2x2 grid
    const positions: SplitImage["position"][] = [
        { row: 0, col: 0 }, // Top-left
        { row: 0, col: 1 }, // Top-right
        { row: 1, col: 0 }, // Bottom-left
        { row: 1, col: 1 }, // Bottom-right
    ];

    const buffers: Buffer[] = [];

    // STEP 4: Extract each sheet as exact quadrant
    for (const pos of positions) {
        const { row, col } = pos;

        // Calculate extraction boundaries - perfect quadrants
        const left = col * halfWidth;
        const top = row * halfHeight;

        // Calculate width and height for this quadrant
        // Last column/row may have fewer pixels if image dimensions are odd
        const extractWidth = Math.min(halfWidth, finalWidth - left);
        const extractHeight = Math.min(halfHeight, finalHeight - top);

        // Extract this section from the resized image
        let sheet = sharp(resizedBuffer).extract({
            left: Math.round(left),
            top: Math.round(top),
            width: Math.round(extractWidth),
            height: Math.round(extractHeight),
        });

        // If this quadrant is smaller than halfWidth/halfHeight, extend it with white padding
        // This ensures all sheets are the same size and can be perfectly reassembled
        if (extractWidth < halfWidth || extractHeight < halfHeight) {
            sheet = sheet.extend({
                right: Math.round(halfWidth - extractWidth),
                bottom: Math.round(halfHeight - extractHeight),
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            });
        }

        const sheetBuffer = await sheet.toBuffer();

        // // STEP 5: Add grid lines and alignment marks
        // const sheetWithGrid = await addGridAndMarks(
        //     sheetBuffer,
        //     halfWidth,
        //     halfHeight,
        //     gridSpacingPx,
        //     0, // No overlap in new design
        //     pos,
        //     pixelsPerMm
        // );

        // STEP 5: No grid lines or alignment marks - just push the clean sheet
        buffers.push(sheetBuffer);
    }

    return { buffers, positions };
}

/**
 * Add grid lines and alignment marks to a sheet
 */
async function addGridAndMarks(
    imageBuffer: Buffer,
    width: number,
    height: number,
    gridSpacingPx: number,
    overlapPx: number,
    position: SplitImage["position"],
    pixelsPerMm: number
): Promise<Buffer> {
    // Create SVG overlay for grid and marks
    const gridLines: string[] = [];

    // Vertical grid lines
    for (let x = 0; x < width; x += gridSpacingPx) {
        gridLines.push(
            `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="#CCCCCC" stroke-width="1" opacity="0.5"/>`
        );
    }

    // Horizontal grid lines
    for (let y = 0; y < height; y += gridSpacingPx) {
        gridLines.push(
            `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="#CCCCCC" stroke-width="1" opacity="0.5"/>`
        );
    }

    // Alignment marks (small crosses in overlap zones)
    const markSize = ALIGNMENT_MARK_SIZE_MM * pixelsPerMm;
    const marks: string[] = [];

    // Add corner marks based on position
    const { row, col } = position;

    // Top-left corner (if not at top or left edge)
    if (row > 0 && col > 0) {
        marks.push(createCrossMark(overlapPx / 2, overlapPx / 2, markSize));
    }

    // Top-right corner (if not at top or right edge)
    if (row > 0 && col < 1) {
        marks.push(
            createCrossMark(width - overlapPx / 2, overlapPx / 2, markSize)
        );
    }

    // Bottom-left corner (if not at bottom or left edge)
    if (row < 1 && col > 0) {
        marks.push(
            createCrossMark(overlapPx / 2, height - overlapPx / 2, markSize)
        );
    }

    // Bottom-right corner (if not at bottom or right edge)
    if (row < 1 && col < 1) {
        marks.push(
            createCrossMark(
                width - overlapPx / 2,
                height - overlapPx / 2,
                markSize
            )
        );
    }

    // Create SVG overlay
    const svg = `
    <svg width="${width}" height="${height}">
      ${gridLines.join("\n")}
      ${marks.join("\n")}
    </svg>
  `;

    // Composite the SVG over the image
    const result = await sharp(imageBuffer)
        .composite([
            {
                input: Buffer.from(svg),
                top: 0,
                left: 0,
            },
        ])
        .toBuffer();

    return result;
}

/**
 * Create an SVG cross mark for alignment
 */
function createCrossMark(x: number, y: number, size: number): string {
    const half = size / 2;
    return `
    <g>
      <line x1="${x - half}" y1="${y}" x2="${
        x + half
    }" y2="${y}" stroke="#000000" stroke-width="2"/>
      <line x1="${x}" y1="${y - half}" x2="${x}" y2="${
        y + half
    }" stroke="#000000" stroke-width="2"/>
      <circle cx="${x}" cy="${y}" r="${
        size / 4
    }" fill="none" stroke="#000000" stroke-width="2"/>
    </g>
  `;
}

/**
 * Get image dimensions from buffer
 */
export async function getImageDimensions(
    buffer: Buffer
): Promise<{ width: number; height: number }> {
    const metadata = await sharp(buffer).metadata();
    return {
        width: metadata.width || 0,
        height: metadata.height || 0,
    };
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): {
    valid: boolean;
    error?: string;
} {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
        return {
            valid: false,
            error: "Invalid file type. Please upload a JPG, PNG, or WebP image.",
        };
    }

    const maxSizeMB = 10;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (file.size > maxSizeBytes) {
        return {
            valid: false,
            error: `File too large. Maximum size is ${maxSizeMB}MB.`,
        };
    }

    return { valid: true };
}
