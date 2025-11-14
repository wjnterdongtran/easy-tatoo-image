'use client'

import { useState } from 'react'
import { useCanvasStore } from '@/lib/store'
import { generatePDF, downloadPDF, printPDF, generateSingleSheetPDF } from '@/lib/print-utils'
import { saveJob as saveJobAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import toast from 'react-hot-toast'

export function PrintButton() {
  const imageUrl = useCanvasStore((state) => state.imageUrl)
  const splitImages = useCanvasStore((state) => state.splitImages)
  const settings = useCanvasStore((state) => state.settings)

  const [isGenerating, setIsGenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handlePrintAll = async () => {
    if (!splitImages || splitImages.length === 0) {
      toast.error('Please split the image first')
      return
    }

    setIsGenerating(true)

    try {
      const blob = await generatePDF(splitImages)
      printPDF(blob)
      toast.success('PDF opened for printing!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadAll = async () => {
    if (!splitImages || splitImages.length === 0) {
      toast.error('Please split the image first')
      return
    }

    setIsGenerating(true)

    try {
      const blob = await generatePDF(splitImages)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadPDF(blob, `tattoo-stencil-${timestamp}.pdf`)
      toast.success('PDF downloaded!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadSingle = async (pageNumber: number) => {
    const image = splitImages.find((img) => img.pageNumber === pageNumber)
    if (!image) return

    setIsGenerating(true)

    try {
      const blob = await generateSingleSheetPDF(image)
      const timestamp = new Date().toISOString().split('T')[0]
      downloadPDF(blob, `tattoo-stencil-page-${pageNumber}-${timestamp}.pdf`)
      toast.success(`Page ${pageNumber} downloaded!`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveJob = async () => {
    if (!imageUrl || !splitImages || splitImages.length === 0) {
      toast.error('Please upload and split an image first')
      return
    }

    setIsSaving(true)

    try {
      const result = await saveJobAction(imageUrl, splitImages, settings)

      if (result.success) {
        toast.success('Print job saved to history!')
      } else {
        toast.error(result.error || 'Failed to save job')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to save job')
    } finally {
      setIsSaving(false)
    }
  }

  if (!splitImages || splitImages.length === 0) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Ready to Print!</h3>
          <p className="text-sm text-gray-600">
            Generate a PDF with all 4 pages or download individual sheets.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handlePrintAll}
            disabled={isGenerating}
            className="flex-1"
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Print All (4 Pages)'}
          </Button>

          <Button
            onClick={handleDownloadAll}
            disabled={isGenerating}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            Download PDF
          </Button>
        </div>

        <div className="flex gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1" disabled={isGenerating}>
                Download Single Sheet
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {splitImages.map((image) => (
                <DropdownMenuItem
                  key={image.pageNumber}
                  onClick={() => handleDownloadSingle(image.pageNumber)}
                >
                  Page {image.pageNumber} of 4
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={handleSaveJob}
            disabled={isSaving || isGenerating}
            variant="outline"
            className="flex-1"
          >
            {isSaving ? 'Saving...' : 'Save to History'}
          </Button>
        </div>

        <div className="pt-4 border-t space-y-2">
          <p className="text-xs font-semibold text-gray-700">Printing Tips:</p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>Print at 100% scale (no scaling)</li>
            <li>Use high-quality or best print settings</li>
            <li>Align sheets using the overlap zones and marks</li>
            <li>Grid lines help with precise placement</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
