"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";
import { uploadImage } from "../actions";
import { useCanvasStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MAX_FILE_SIZE_MB } from "@/lib/types";

export function ImageUploader() {
    const [isUploading, setIsUploading] = useState(false);
    const setImage = useCanvasStore((state) => state.setImage);
    const imageUrl = useCanvasStore((state) => state.imageUrl);

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setIsUploading(true);

            try {
                const formData = new FormData();
                formData.append("image", file);

                const result = await uploadImage(formData);

                if (result.success && result.data) {
                    setImage(
                        result.data.url,
                        result.data.dimensions.width,
                        result.data.dimensions.height
                    );
                    toast.success("Image uploaded successfully!");
                } else {
                    toast.error(result.error || "Failed to upload image");
                }
            } catch (error: any) {
                toast.error(error.message || "Failed to upload image");
            } finally {
                setIsUploading(false);
            }
        },
        [setImage]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/webp": [".webp"],
        },
        maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
        maxFiles: 1,
        disabled: isUploading,
    });

    if (imageUrl) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-100">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageUrl}
                                alt="Uploaded tattoo design"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                                setImage(null as any, 0, 0);
                                useCanvasStore.getState().reset();
                            }}
                        >
                            Upload Different Image
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div
                    {...getRootProps()}
                    className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${
                isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
            }
            ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
                >
                    <input {...getInputProps()} />

                    <div className="space-y-4">
                        <div className="text-5xl">📤</div>

                        {isUploading ? (
                            <div className="space-y-2">
                                <p className="text-lg font-medium">
                                    Uploading...
                                </p>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600 animate-pulse"
                                        style={{ width: "60%" }}
                                    />
                                </div>
                            </div>
                        ) : isDragActive ? (
                            <p className="text-lg font-medium text-blue-600">
                                Drop your image here...
                            </p>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-lg font-medium">
                                    Drag & drop your tattoo design
                                </p>
                                <p className="text-sm text-gray-600">
                                    or click to browse
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    Supports JPG, PNG, WebP (max{" "}
                                    {MAX_FILE_SIZE_MB}MB)
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
