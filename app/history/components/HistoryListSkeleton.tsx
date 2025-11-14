import { Card, CardContent, CardFooter } from '@/components/ui/card'

export function HistoryListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-video relative bg-gray-200 animate-pulse" />

          <CardContent className="p-4 space-y-2">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 flex gap-2">
            <div className="h-9 flex-1 bg-gray-200 rounded animate-pulse" />
            <div className="h-9 w-20 bg-gray-200 rounded animate-pulse" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
