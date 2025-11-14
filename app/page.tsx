import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Tattoo Stencil Printer
          </h1>
          <div className="flex gap-3">
            {user ? (
              <>
                <Link href="/editor">
                  <Button variant="outline">Editor</Button>
                </Link>
                <Link href="/history">
                  <Button variant="outline">History</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
            Print Large Tattoo Stencils{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              on Small Printers
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Split your tattoo designs into 4 A4 sheets with alignment marks and grid lines.
            Perfect for creating large stencils with a standard home printer.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href={user ? '/editor' : '/auth/signup'}>
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                How It Works
              </Button>
            </a>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto">
          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="text-3xl mb-2">📤</div>
              <h3 className="font-semibold text-lg">Upload Your Design</h3>
              <p className="text-sm text-gray-600">
                Drag and drop your tattoo design image. Supports JPG, PNG, and WebP formats.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="text-3xl mb-2">✂️</div>
              <h3 className="font-semibold text-lg">Auto-Split Into 4 Sheets</h3>
              <p className="text-sm text-gray-600">
                Automatically split into 2×2 A4 sheets with overlap zones for easy alignment.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-2">
              <div className="text-3xl mb-2">🖨️</div>
              <h3 className="font-semibold text-lg">Print & Apply</h3>
              <p className="text-sm text-gray-600">
                Print on any A4 printer. Grid lines and alignment marks make application easy.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mt-24 max-w-3xl mx-auto space-y-8">
          <h3 className="text-3xl font-bold text-center">How It Works</h3>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-lg">Upload Your Image</h4>
                <p className="text-gray-600">
                  Choose your tattoo design and upload it to the editor. The app will automatically
                  analyze the image quality.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-lg">Adjust Settings</h4>
                <p className="text-gray-600">
                  Resize, rotate, and position your design. Set the target print width (6-7 inches
                  recommended) and overlap amount.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-lg">Split & Preview</h4>
                <p className="text-gray-600">
                  Click "Split Image" to divide it into 4 A4 sheets. Preview each sheet with grid
                  lines and alignment marks.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-lg">Print All Sheets</h4>
                <p className="text-gray-600">
                  Generate a PDF with all 4 pages. Print on A4 paper and align using the overlap
                  zones and marks.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-24 text-center space-y-6">
          <h3 className="text-3xl font-bold">Ready to Create Your Stencil?</h3>
          <p className="text-gray-600">
            Sign up now and start printing professional tattoo stencils in minutes.
          </p>
          <Link href={user ? '/editor' : '/auth/signup'}>
            <Button size="lg" className="text-lg px-8 py-6">
              {user ? 'Go to Editor' : 'Start for Free'}
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-24 py-8 bg-white/50">
        <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>© 2025 Tattoo Stencil Printer. Built with Next.js 16 and Supabase.</p>
        </div>
      </footer>
    </div>
  )
}
