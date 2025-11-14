'use client'

import { useState } from 'react'
import { PrintJob } from '@/lib/types'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { generatePDF, downloadPDF } from '@/lib/print-utils'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

interface HistoryItemProps {
  job: PrintJob
}

export function HistoryItem({ job }: HistoryItemProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formattedDate = new Date(job.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const handleDownload = async () => {
    setIsGenerating(true)

    try {
      const blob = await generatePDF(job.split_images)
      const date = new Date(job.created_at).toISOString().split('T')[0]
      downloadPDF(blob, `tattoo-stencil-${date}.pdf`)
      toast.success('PDF downloaded!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from('print_jobs')
        .delete()
        .eq('id', job.id)

      if (error) {
        throw error
      }

      toast.success('Print job deleted')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete job')
      setIsDeleting(false)
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative bg-gray-100">
        <img
          src={job.original_image_url}
          alt="Tattoo design"
          className="w-full h-full object-contain"
        />
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {job.settings.targetWidthInches.toFixed(1)}" width
            </p>
            <p className="text-xs text-gray-500">{formattedDate}</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-sm font-medium">{job.settings.dpi} DPI</p>
            <p className="text-xs text-gray-500">
              {job.settings.overlapMm}mm overlap
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <p className="text-xs text-gray-600">
            Rotation: {job.settings.rotation}°
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          size="sm"
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex-1"
        >
          {isGenerating ? 'Generating...' : 'Download'}
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline" disabled={isDeleting}>
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Print Job?</DialogTitle>
              <DialogDescription>
                This will permanently delete this print job. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {}}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
