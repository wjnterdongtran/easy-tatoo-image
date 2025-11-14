'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  ActionResponse,
  UploadResponse,
  ImageSettings,
  SplitImageResult,
  SplitImage,
  PrintJobInsert,
} from '@/lib/types'
import {
  validateImageFile,
  getImageDimensions,
  splitImageIntoSheets,
} from '@/lib/image-processor'
import { DEBUG_MODE } from '@/lib/debug'

/**
 * Upload image to Supabase Storage (or localStorage in debug mode)
 */
export async function uploadImage(formData: FormData): Promise<ActionResponse<UploadResponse>> {
  try {
    // Get the uploaded file
    const file = formData.get('image') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      return { success: false, error: validation.error }
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Get image dimensions
    const dimensions = await getImageDimensions(buffer)

    // DEBUG MODE: Use base64 instead of uploading to Supabase
    if (DEBUG_MODE) {
      // Convert to base64
      const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

      console.log('[DEBUG MODE] Image stored as base64 (not uploaded to Supabase)')

      return {
        success: true,
        data: {
          url: base64,
          filename: file.name,
          size: file.size,
          dimensions,
        },
      }
    }

    // PRODUCTION MODE: Upload to Supabase
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${user.id}/${timestamp}-${file.name}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('tattoo-images')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: 'Failed to upload image' }
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('tattoo-images').getPublicUrl(filename)

    revalidatePath('/editor')

    return {
      success: true,
      data: {
        url: publicUrl,
        filename: file.name,
        size: file.size,
        dimensions,
      },
    }
  } catch (error: any) {
    console.error('Upload action error:', error)
    return { success: false, error: error.message || 'Failed to upload image' }
  }
}

/**
 * Split image into 4 A4 sheets with grid lines and alignment marks
 */
export async function splitImage(
  imageUrl: string,
  settings: ImageSettings
): Promise<ActionResponse<SplitImageResult>> {
  try {
    // Fetch the original image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      return { success: false, error: 'Failed to fetch image' }
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Split the image
    const { buffers, positions } = await splitImageIntoSheets(buffer, settings)

    const splitImages: SplitImage[] = []
    const timestamp = Date.now()

    // DEBUG MODE: Convert to base64
    if (DEBUG_MODE) {
      console.log('[DEBUG MODE] Split images stored as base64 (not uploaded to Supabase)')

      for (let i = 0; i < buffers.length; i++) {
        const sheetBuffer = buffers[i]
        const position = positions[i]
        const pageNumber = i + 1

        // Convert to base64
        const base64 = `data:image/png;base64,${sheetBuffer.toString('base64')}`

        splitImages.push({
          url: base64,
          position,
          pageNumber,
        })
      }

      return {
        success: true,
        data: {
          images: splitImages,
          settings,
        },
      }
    }

    // PRODUCTION MODE: Upload to Supabase
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    for (let i = 0; i < buffers.length; i++) {
      const sheetBuffer = buffers[i]
      const position = positions[i]
      const pageNumber = i + 1

      // Upload split image
      const filename = `${user.id}/split-${timestamp}-page-${pageNumber}.png`

      const { error: uploadError } = await supabase.storage
        .from('tattoo-images')
        .upload(filename, sheetBuffer, {
          contentType: 'image/png',
          upsert: true,
        })

      if (uploadError) {
        console.error('Split image upload error:', uploadError)
        return { success: false, error: `Failed to upload sheet ${pageNumber}` }
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('tattoo-images').getPublicUrl(filename)

      splitImages.push({
        url: publicUrl,
        position,
        pageNumber,
      })
    }

    revalidatePath('/editor')

    return {
      success: true,
      data: {
        images: splitImages,
        settings,
      },
    }
  } catch (error: any) {
    console.error('Split image error:', error)
    return { success: false, error: error.message || 'Failed to split image' }
  }
}

/**
 * Save print job to database (or localStorage in debug mode)
 */
export async function saveJob(
  originalImageUrl: string,
  splitImages: SplitImage[],
  settings: ImageSettings
): Promise<ActionResponse<{ id: string }>> {
  try {
    // DEBUG MODE: Save to localStorage
    if (DEBUG_MODE) {
      const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const jobData = {
        id,
        user_id: 'debug-user-123',
        original_image_url: originalImageUrl,
        split_images: splitImages,
        settings,
        created_at: new Date().toISOString(),
      }

      // Store in localStorage
      const jobs = JSON.parse(localStorage.getItem('debug_print_jobs') || '{}')
      jobs[id] = jobData
      localStorage.setItem('debug_print_jobs', JSON.stringify(jobs))

      console.log('[DEBUG MODE] Print job saved to localStorage:', id)

      return {
        success: true,
        data: { id },
      }
    }

    // PRODUCTION MODE: Save to Supabase
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    const jobData: PrintJobInsert = {
      user_id: user.id,
      original_image_url: originalImageUrl,
      split_images: splitImages,
      settings,
    }

    const { data, error } = await supabase
      .from('print_jobs')
      .insert(jobData)
      .select('id')
      .single()

    if (error) {
      console.error('Save job error:', error)
      return { success: false, error: 'Failed to save print job' }
    }

    revalidatePath('/history')

    return {
      success: true,
      data: { id: data.id },
    }
  } catch (error: any) {
    console.error('Save job error:', error)
    return { success: false, error: error.message || 'Failed to save print job' }
  }
}
