import { Card, CardContent } from '@/components/ui/card'

export default function EditorLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header Skeleton */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title Skeleton */}
          <div className="text-center space-y-2">
            <div className="h-10 w-96 bg-gray-200 rounded mx-auto animate-pulse" />
            <div className="h-6 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
          </div>

          {/* Content Grid Skeleton */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="h-64 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-8">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
