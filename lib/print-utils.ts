import { jsPDF } from 'jspdf'
import { SplitImage, PAPER_SIZE } from './types'

/**
 * Generate a PDF from split images
 */
export async function generatePDF(splitImages: SplitImage[]): Promise<Blob> {
  // Create PDF in A4 size
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = PAPER_SIZE.A4.widthMm
  const pageHeight = PAPER_SIZE.A4.heightMm

  // Sort images by page number
  const sortedImages = [...splitImages].sort((a, b) => a.pageNumber - b.pageNumber)

  // Add each image to the PDF
  for (let i = 0; i < sortedImages.length; i++) {
    const image = sortedImages[i]

    // Add new page for all except the first
    if (i > 0) {
      pdf.addPage()
    }

    // Add page number text
    pdf.setFontSize(10)
    pdf.setTextColor(100)
    pdf.text(`Page ${image.pageNumber} of 4`, pageWidth - 30, 10)

    // Add the image to fill the page
    try {
      // Add image - it will be fitted to the page
      pdf.addImage({
        imageData: image.url,
        format: 'PNG',
        x: 0,
        y: 0,
        width: pageWidth,
        height: pageHeight,
        compression: 'MEDIUM',
      })
    } catch (error) {
      console.error(`Error adding image ${image.pageNumber}:`, error)
    }
  }

  // Return PDF as blob
  return pdf.output('blob')
}

/**
 * Download PDF file
 */
export function downloadPDF(blob: Blob, filename: string = 'tattoo-stencil.pdf') {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Print PDF directly (opens print dialog)
 */
export function printPDF(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = url
  document.body.appendChild(iframe)

  iframe.onload = () => {
    iframe.contentWindow?.print()
    // Clean up after printing
    setTimeout(() => {
      document.body.removeChild(iframe)
      URL.revokeObjectURL(url)
    }, 100)
  }
}

/**
 * Generate PDF for a single sheet
 */
export async function generateSingleSheetPDF(image: SplitImage): Promise<Blob> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = PAPER_SIZE.A4.widthMm
  const pageHeight = PAPER_SIZE.A4.heightMm

  // Add page number
  pdf.setFontSize(10)
  pdf.setTextColor(100)
  pdf.text(`Page ${image.pageNumber} of 4`, pageWidth - 30, 10)

  // Add image
  pdf.addImage({
    imageData: image.url,
    format: 'PNG',
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight,
    compression: 'MEDIUM',
  })

  return pdf.output('blob')
}
