"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, FabricImage } from "fabric";
import { useCanvasStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";

export function CanvasEditor() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<Canvas | null>(null);
    const imageRef = useRef<FabricImage | null>(null);

    const imageUrl = useCanvasStore((state) => state.imageUrl);
    const settings = useCanvasStore((state) => state.settings);
    const updateSettings = useCanvasStore((state) => state.updateSettings);

    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    console.log(imageUrl);
    // Initialize fabric canvas
    useEffect(() => {
        if (!canvasRef.current) return;

        // Calculate responsive canvas size
        const container = canvasRef.current.parentElement;
        if (container) {
            const width = Math.min(container.clientWidth - 32, 800);
            const height = Math.floor(width * 0.75); // 4:3 aspect ratio
            setCanvasSize({ width, height });
        }

        // Initialize fabric canvas
        fabricCanvasRef.current = new Canvas(canvasRef.current, {
            width: canvasSize.width,
            height: canvasSize.height,
            backgroundColor: "#f3f4f6",
        });

        return () => {
            fabricCanvasRef.current?.dispose();
        };
    }, []);

    // Update canvas size
    useEffect(() => {
        if (fabricCanvasRef.current) {
            fabricCanvasRef.current.setDimensions(canvasSize);
        }
    }, [canvasSize]);

    // Load image onto canvas
    useEffect(() => {
        if (!imageUrl || !fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;

        // Fabric v6 uses FabricImage.fromURL with Promise
        FabricImage.fromURL(imageUrl, { crossOrigin: "anonymous" })
            .then((img) => {
                if (!img || !canvas) return;

                // Remove previous image if exists
                if (imageRef.current) {
                    canvas.remove(imageRef.current);
                }

                // Scale image to fit canvas
                const scale = Math.min(
                    (canvas.width * 0.8) / (img.width || 1),
                    (canvas.height * 0.8) / (img.height || 1)
                );

                img.scale(scale);
                img.set({
                    left: canvas.width / 2,
                    top: canvas.height / 2,
                    originX: "center",
                    originY: "center",
                    angle: settings.rotation,
                });

                canvas.add(img);
                canvas.setActiveObject(img);
                imageRef.current = img;

                // Listen for object modifications
                img.on("modified", () => {
                    updateSettings({
                        rotation: img.angle || 0,
                        scaleFactor: img.scaleX || 1,
                    });
                });

                canvas.renderAll();
            })
            .catch((error) => {
                console.error("Error loading image:", error);
            });
    }, [imageUrl]);

    // Update rotation from external controls
    useEffect(() => {
        if (imageRef.current && fabricCanvasRef.current) {
            imageRef.current.rotate(settings.rotation);
            fabricCanvasRef.current.renderAll();
        }
    }, [settings.rotation]);

    // if (!imageUrl) {
    //     return null;
    // }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg">Canvas Editor</h3>
                        <p className="text-sm text-gray-600">
                            Drag, resize, and rotate your design
                        </p>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <canvas ref={canvasRef} />
                    </div>

                    <p className="text-xs text-gray-500">
                        Tip: Use the handles to resize, or grab the rotation
                        handle to rotate.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
