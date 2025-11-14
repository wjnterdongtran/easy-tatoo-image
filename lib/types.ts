import { User } from '@supabase/supabase-js'

// Image Settings for canvas and processing
export interface ImageSettings {
  targetWidthInches: number // Target print width (4-8 inches)
  rotation: number // Rotation in degrees (-180 to 180)
  overlapMm: number // Overlap between sheets (5, 10, 15mm)
  dpi: number // Calculated DPI based on image resolution
  scaleFactor: number // Scale factor for canvas
}

// Canvas State
export interface CanvasState {
  imageUrl: string | null
  originalWidth: number
  originalHeight: number
  settings: ImageSettings
  isProcessing: boolean
}

// Split image result
export interface SplitImage {
  url: string
  position: {
    row: number // 0 or 1
    col: number // 0 or 1
  }
  pageNumber: number // 1-4
}

export interface SplitImageResult {
  images: SplitImage[]
  settings: ImageSettings
}

// Print Job (database record)
export interface PrintJob {
  id: string
  user_id: string
  original_image_url: string
  split_images: SplitImage[]
  settings: ImageSettings
  created_at: string
}

// Database insert type (without id and created_at)
export interface PrintJobInsert {
  user_id: string
  original_image_url: string
  split_images: SplitImage[]
  settings: ImageSettings
}

// User session
export interface UserSession {
  user: User | null
  isLoading: boolean
}

// Server Action responses
export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

// Upload response
export interface UploadResponse {
  url: string
  filename: string
  size: number
  dimensions: {
    width: number
    height: number
  }
}

// Constants
export const PAPER_SIZE = {
  A4: {
    widthMm: 210,
    heightMm: 297,
    widthInches: 8.27,
    heightInches: 11.69,
  },
} as const

export const OVERLAP_OPTIONS = [5, 10, 15] as const // mm
export const TARGET_WIDTH_RANGE = { min: 4, max: 8 } as const // inches
export const MIN_DPI = 150
export const OPTIMAL_DPI = 300
export const GRID_SPACING_CM = 1
export const ALIGNMENT_MARK_SIZE_MM = 5

// Image constraints
export const MAX_FILE_SIZE_MB = 10
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
