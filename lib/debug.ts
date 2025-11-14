/**
 * Debug Mode Configuration
 *
 * When enabled, the app uses local storage instead of Supabase:
 * - Images stored as base64 in localStorage
 * - Print jobs stored in localStorage
 * - Mock authentication (no real Supabase calls)
 *
 * Set NEXT_PUBLIC_DEBUG_MODE=true in .env.local to enable
 */

export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

// LocalStorage keys
export const DEBUG_KEYS = {
  IMAGES: 'debug_images',
  PRINT_JOBS: 'debug_print_jobs',
  USER: 'debug_user',
} as const

// Mock user for debug mode
export const DEBUG_USER = {
  id: 'debug-user-123',
  email: 'debug@example.com',
  created_at: new Date().toISOString(),
}

/**
 * Store image in localStorage (base64)
 */
export function storeDebugImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const base64 = reader.result as string
      const timestamp = Date.now()
      const key = `image_${timestamp}`

      // Store in localStorage
      const images = getDebugImages()
      images[key] = {
        base64,
        filename: file.name,
        size: file.size,
        timestamp,
      }
      localStorage.setItem(DEBUG_KEYS.IMAGES, JSON.stringify(images))

      // Return fake URL (the key that we can use to retrieve it)
      resolve(base64)
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Get all stored debug images
 */
export function getDebugImages(): Record<string, any> {
  if (typeof window === 'undefined') return {}

  const stored = localStorage.getItem(DEBUG_KEYS.IMAGES)
  return stored ? JSON.parse(stored) : {}
}

/**
 * Store print job in localStorage
 */
export function storeDebugPrintJob(job: any): string {
  const jobs = getDebugPrintJobs()
  const id = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  jobs[id] = {
    ...job,
    id,
    created_at: new Date().toISOString(),
  }

  localStorage.setItem(DEBUG_KEYS.PRINT_JOBS, JSON.stringify(jobs))
  return id
}

/**
 * Get all stored debug print jobs
 */
export function getDebugPrintJobs(): Record<string, any> {
  if (typeof window === 'undefined') return {}

  const stored = localStorage.getItem(DEBUG_KEYS.PRINT_JOBS)
  return stored ? JSON.parse(stored) : {}
}

/**
 * Delete a debug print job
 */
export function deleteDebugPrintJob(id: string): void {
  const jobs = getDebugPrintJobs()
  delete jobs[id]
  localStorage.setItem(DEBUG_KEYS.PRINT_JOBS, JSON.stringify(jobs))
}

/**
 * Clear all debug data
 */
export function clearDebugData(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(DEBUG_KEYS.IMAGES)
  localStorage.removeItem(DEBUG_KEYS.PRINT_JOBS)
  localStorage.removeItem(DEBUG_KEYS.USER)
}

/**
 * Get debug user
 */
export function getDebugUser() {
  if (typeof window === 'undefined') return null

  const stored = localStorage.getItem(DEBUG_KEYS.USER)
  return stored ? JSON.parse(stored) : DEBUG_USER
}

/**
 * Set debug user (for mock login)
 */
export function setDebugUser(email: string) {
  if (typeof window === 'undefined') return

  const user = {
    id: `debug-user-${Date.now()}`,
    email,
    created_at: new Date().toISOString(),
  }

  localStorage.setItem(DEBUG_KEYS.USER, JSON.stringify(user))
  return user
}

/**
 * Clear debug user (for mock logout)
 */
export function clearDebugUser() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(DEBUG_KEYS.USER)
}

/**
 * Log debug info to console
 */
export function debugLog(message: string, ...args: any[]) {
  if (DEBUG_MODE) {
    console.log(`[DEBUG MODE] ${message}`, ...args)
  }
}
