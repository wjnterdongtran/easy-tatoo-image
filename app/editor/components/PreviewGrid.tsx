"use client";

import { useCanvasStore } from "@/lib/store";
import { PreviewSheet } from "./PreviewSheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PreviewGrid() {
    const splitImages = useCanvasStore((state) => state.splitImages);

    if (!splitImages || splitImages.length === 0) {
        return null;
    }

    return (
        // <Card className="rounded-none">
        //   <CardHeader>
        //     <CardTitle>Preview - 4 A4 Sheets</CardTitle>
        //     <p className="text-sm text-gray-600">
        //       These are the 4 sheets that will be printed. Each includes grid lines and alignment marks.
        //     </p>
        //   </CardHeader>
        //   <CardContent>
        //   </CardContent>
        // </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {splitImages
                .sort((a, b) => a.pageNumber - b.pageNumber)
                .map((image) => (
                    <PreviewSheet key={image.pageNumber} image={image} />
                ))}
        </div>
    );
}
