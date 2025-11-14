'use client'

import { useState } from 'react'
import { useCanvasStore } from '@/lib/store'
import { splitImage as splitImageAction } from '../actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  TARGET_WIDTH_RANGE,
  OVERLAP_OPTIONS,
  MIN_DPI,
  OPTIMAL_DPI,
} from '@/lib/types'
import toast from 'react-hot-toast'

export function ControlPanel() {
  const imageUrl = useCanvasStore((state) => state.imageUrl)
  const settings = useCanvasStore((state) => state.settings)
  const updateSettings = useCanvasStore((state) => state.updateSettings)
  const setSplitImages = useCanvasStore((state) => state.setSplitImages)
  const setProcessing = useCanvasStore((state) => state.setProcessing)
  const isProcessing = useCanvasStore((state) => state.isProcessing)
  const calculateDPI = useCanvasStore((state) => state.calculateDPI)

  const [isSplitting, setIsSplitting] = useState(false)

  const dpi = calculateDPI()
  const dpiStatus =
    dpi >= OPTIMAL_DPI ? 'excellent' : dpi >= MIN_DPI ? 'good' : 'warning'

  const handleSplit = async () => {
    if (!imageUrl) {
      toast.error('Please upload an image first')
      return
    }

    if (dpi < MIN_DPI) {
      const confirmed = window.confirm(
        `Warning: DPI is ${dpi}, which is below the recommended ${MIN_DPI}. The print quality may be poor. Continue anyway?`
      )
      if (!confirmed) return
    }

    setIsSplitting(true)
    setProcessing(true)

    try {
      const result = await splitImageAction(imageUrl, settings)

      if (result.success && result.data) {
        setSplitImages(result.data.images)
        toast.success('Image split successfully!')
      } else {
        toast.error(result.error || 'Failed to split image')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to split image')
    } finally {
      setIsSplitting(false)
      setProcessing(false)
    }
  }

  if (!imageUrl) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Print Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Target Width */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Target Width (inches)
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-gray-600 cursor-help">
                    {settings.targetWidthInches.toFixed(1)}"
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Final print width (6-7 inches recommended for tattoos)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Slider
            value={[settings.targetWidthInches]}
            onValueChange={([value]) => updateSettings({ targetWidthInches: value })}
            min={TARGET_WIDTH_RANGE.min}
            max={TARGET_WIDTH_RANGE.max}
            step={0.1}
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Range: {TARGET_WIDTH_RANGE.min}" - {TARGET_WIDTH_RANGE.max}"
          </p>
        </div>

        {/* Rotation */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Rotation (degrees)</label>
            <span className="text-sm text-gray-600">{settings.rotation}°</span>
          </div>
          <Slider
            value={[settings.rotation]}
            onValueChange={([value]) => updateSettings({ rotation: value })}
            min={-180}
            max={180}
            step={1}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSettings({ rotation: 0 })}
            >
              Reset
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSettings({ rotation: settings.rotation - 90 })}
            >
              -90°
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateSettings({ rotation: settings.rotation + 90 })}
            >
              +90°
            </Button>
          </div>
        </div>

        {/* Overlap */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Sheet Overlap (mm)
            </label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-sm text-gray-600 cursor-help">
                    {settings.overlapMm}mm
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Overlap between sheets for easier alignment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            {OVERLAP_OPTIONS.map((option) => (
              <Button
                key={option}
                size="sm"
                variant={settings.overlapMm === option ? 'default' : 'outline'}
                onClick={() => updateSettings({ overlapMm: option })}
                className="flex-1"
              >
                {option}mm
              </Button>
            ))}
          </div>
        </div>

        {/* DPI Display */}
        <div className="space-y-2 p-4 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Print Quality (DPI)</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={`text-sm font-bold cursor-help ${
                      dpiStatus === 'excellent'
                        ? 'text-green-600'
                        : dpiStatus === 'good'
                        ? 'text-blue-600'
                        : 'text-orange-600'
                    }`}
                  >
                    {dpi} DPI
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {dpiStatus === 'excellent'
                      ? 'Excellent quality!'
                      : dpiStatus === 'good'
                      ? 'Good quality for tattoo stencils'
                      : 'Below recommended DPI'}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Minimum: {MIN_DPI} DPI</p>
            <p>Optimal: {OPTIMAL_DPI} DPI</p>
          </div>
          {dpi < MIN_DPI && (
            <p className="text-xs text-orange-600 font-medium">
              ⚠️ Quality may be too low for detailed tattoos
            </p>
          )}
        </div>

        {/* Split Button */}
        <Button
          onClick={handleSplit}
          disabled={isSplitting || isProcessing || !imageUrl}
          className="w-full"
          size="lg"
        >
          {isSplitting ? 'Splitting Image...' : 'Split Into 4 Sheets'}
        </Button>
      </CardContent>
    </Card>
  )
}
