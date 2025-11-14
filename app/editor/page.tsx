import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "./components/ImageUploader";
import { CanvasEditor } from "./components/CanvasEditor";
import { ControlPanel } from "./components/ControlPanel";
import { PreviewGrid } from "./components/PreviewGrid";
import { PrintButton } from "./components/PrintButton";
import { logout } from "../auth/actions";

export default function EditorPage() {
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
                        <Link href="/history">
                            <Button variant="outline">History</Button>
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
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold">
                            Create Your Tattoo Stencil
                        </h2>
                        <p className="text-gray-600">
                            Upload, adjust, split into 4 A4 sheets, and print!
                        </p>
                    </div>

                    {/* Layout: Two columns on large screens */}
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Left Column: Upload & Canvas */}
                        <div className="space-y-8">
                            <ImageUploader />
                            <CanvasEditor />
                        </div>

                        {/* Right Column: Controls */}
                        <div className="space-y-8">
                            <ControlPanel />
                        </div>
                    </div>

                    {/* Full Width: Preview & Print */}
                    <div className="space-y-8">
                        <PreviewGrid />
                        <PrintButton />
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold text-lg text-blue-900">
                            How to Use
                        </h3>
                        <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                            <li>
                                <strong>Upload</strong> your tattoo design image
                                (JPG, PNG, or WebP)
                            </li>
                            <li>
                                <strong>Adjust</strong> the size, rotation, and
                                settings using the controls
                            </li>
                            <li>
                                <strong>Split</strong> the image into 4 A4
                                sheets by clicking "Split Into 4 Sheets"
                            </li>
                            <li>
                                <strong>Preview</strong> each sheet to ensure
                                quality and alignment
                            </li>
                            <li>
                                <strong>Print</strong> all sheets or download as
                                PDF
                            </li>
                            <li>
                                <strong>Align</strong> the printed sheets using
                                the overlap zones and marks
                            </li>
                        </ol>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-16 py-8 bg-white/50">
                <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                    <p>
                        © 2025 Tattoo Stencil Printer. Built with Next.js 16 and
                        Supabase.
                    </p>
                </div>
            </footer>
        </div>
    );
}
