'use client'

import { useState, useEffect } from 'react'
import { clearDebugData } from '@/lib/debug'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

export function DebugBanner() {
  const [debugMode, setDebugMode] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    setDebugMode(process.env.NEXT_PUBLIC_DEBUG_MODE === 'true')
  }, [])

  if (!isClient) return null

  const handleToggle = async () => {
    const newMode = !debugMode

    // Update environment variable via API route
    try {
      const response = await fetch('/api/debug/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newMode }),
      })

      if (response.ok) {
        toast.success(
          newMode
            ? '🐛 Debug mode enabled! Reloading...'
            : '🔒 Debug mode disabled! Reloading...',
          { duration: 2000 }
        )

        // Reload page after 2 seconds
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.error('Failed to toggle debug mode. Update .env.local manually.')
      }
    } catch (error) {
      toast.error('Failed to toggle debug mode. Update .env.local manually.')
    }
  }

  const handleClearData = () => {
    if (confirm('Clear all debug data (images and print jobs)?')) {
      clearDebugData()
      toast.success('Debug data cleared!')
      window.location.reload()
    }
  }

  const handleViewData = () => {
    const images = localStorage.getItem('debug_images')
    const jobs = localStorage.getItem('debug_print_jobs')

    console.group('🐛 DEBUG DATA')
    console.log('Images:', images ? JSON.parse(images) : 'None')
    console.log('Print Jobs:', jobs ? JSON.parse(jobs) : 'None')
    console.groupEnd()

    toast.success('Debug data logged to console (F12)')
  }

  const getStorageSize = () => {
    let total = 0
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length
      }
    }
    return (total / 1024).toFixed(2) // KB
  }

  return (
    <div
      className={`px-4 py-2 text-center text-sm font-medium sticky top-0 z-50 flex items-center justify-between ${
        debugMode
          ? 'bg-yellow-500 text-black'
          : 'bg-gray-100 border-b text-gray-700'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className="font-semibold">
          {debugMode ? '🐛 DEBUG MODE' : '🔒 PRODUCTION MODE'}
        </span>
        {debugMode && (
          <span className="text-xs opacity-75">
            Using localStorage instead of Supabase
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {debugMode && (
          <>
            <span className="text-xs opacity-75">
              Storage: {getStorageSize()} KB
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs bg-white hover:bg-gray-100"
                >
                  Debug Tools
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Debug Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleViewData}>
                  📊 View Data (Console)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleClearData}>
                  🗑️ Clear All Data
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    console.log('localStorage keys:', Object.keys(localStorage))
                    toast.success('Keys logged to console')
                  }}
                >
                  🔑 View Keys
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(
                      JSON.stringify(
                        {
                          images: localStorage.getItem('debug_images'),
                          jobs: localStorage.getItem('debug_print_jobs'),
                        },
                        null,
                        2
                      )
                    )
                    toast.success('Debug data copied to clipboard!')
                  }}
                >
                  📋 Copy Data
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <Button
          size="sm"
          variant="outline"
          className={`h-7 text-xs font-semibold ${
            debugMode
              ? 'bg-white hover:bg-gray-100 text-black'
              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
          }`}
          onClick={handleToggle}
        >
          {debugMode ? '🔒 Switch to Production' : '🐛 Switch to Debug'}
        </Button>
      </div>
    </div>
  )
}
