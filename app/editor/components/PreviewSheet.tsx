"use client";

import { SplitImage } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface PreviewSheetProps {
    image: SplitImage;
}

export function PreviewSheet({ image }: PreviewSheetProps) {
    return (
        <Card className="relative rounded-none border-0 p-0">
            <CardContent className="p-0">
                <div className="aspect-210/297 relative overflow-hidden bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={image.url}
                        alt={`Sheet ${image.pageNumber}`}
                        className="w-full h-full"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
