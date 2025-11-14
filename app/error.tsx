'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-red-600">Something went wrong!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            An error occurred while processing your request. This could be due to:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
            <li>Network connection issues</li>
            <li>Server unavailability</li>
            <li>Invalid data</li>
          </ul>
          {error.message && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
              <p className="font-medium text-red-900">Error message:</p>
              <p className="text-red-700 mt-1">{error.message}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button onClick={reset} className="flex-1">
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = '/')}
            className="flex-1"
          >
            Go Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
