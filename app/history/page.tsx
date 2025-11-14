import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { logout } from '../auth/actions'
import { HistoryList } from './components/HistoryList'
import { HistoryListSkeleton } from './components/HistoryListSkeleton'

export default async function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent cursor-pointer">
              Tattoo Stencil Printer
            </h1>
          </Link>
          <div className="flex gap-3">
            <Link href="/editor">
              <Button variant="outline">Editor</Button>
            </Link>
            <form action={logout}>
              <Button variant="ghost" type="submit">
                Logout
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">Print History</h2>
            <p className="text-gray-600">
              View and manage your saved tattoo stencil print jobs.
            </p>
          </div>

          {/* History List with Suspense */}
          <Suspense fallback={<HistoryListSkeleton />}>
            <HistoryList />
          </Suspense>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 Tattoo Stencil Printer. Built with Next.js 16 and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
