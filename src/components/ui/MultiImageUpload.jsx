import { useState } from "react";

export default function MultiImageUpload({ label, value = [], onChange, maxImages = 5, maxFileSize = 5 }) {
    const [dragActive, setDragActive] = useState(false);
    const [isCompressing, setIsCompressing] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        const files = e.dataTransfer.files;
        if (files) {
            handleFiles(Array.from(files));
        }
    };

    const handleFileInput = (e) => {
        const files = e.target.files;
        if (files) {
            handleFiles(Array.from(files));
        }
    };

    // Compress image to WebP format and reduce dimensions
    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Reduce dimensions to max 600x600 for aggressive compression (fits buffer)
                    let width = img.width;
                    let height = img.height;
                    if (width > 600 || height > 600) {
                        const ratio = Math.min(600 / width, 600 / height);
                        width *= ratio;
                        height *= ratio;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    ctx.drawImage(img, 0, 0, width, height);

                    // Compress to WebP with very aggressive quality to keep request <4MB
                    // Max individual file: 1MB, starts at 50% quality and reduces if needed
                    const attemptCompress = (quality) => {
                        canvas.toBlob((blob) => {
                            // If still too large (>1MB), recursively try lower quality
                            if (blob.size > 1024 * 1024 && quality > 0.25) {
                                console.log(`⚠ File still ${(blob.size / 1024 / 1024).toFixed(2)}MB at ${(quality * 100).toFixed(0)}% quality, reducing...`);
                                attemptCompress(quality - 0.05);
                                return;
                            }

                            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                                type: 'image/webp'
                            });
                            const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
                            const compressedSizeMB = (blob.size / 1024 / 1024).toFixed(2);
                            const reduction = (((file.size - blob.size) / file.size) * 100).toFixed(0);
                            console.log(`✓ Image compressed: ${file.name} | ${originalSizeMB}MB → ${compressedSizeMB}MB at ${(quality * 100).toFixed(0)}% quality (${reduction}% reduction)`);
                            resolve({
                                original: file,
                                compressed: compressedFile,
                                originalSize: file.size,
                                compressedSize: blob.size,
                            });
                        }, 'image/webp', quality);
                    };
                    attemptCompress(0.5);
                };
            };
        });
    };

    const handleFiles = async (files) => {
        const validFiles = files.filter((file) => {
            if (!file.type.startsWith("image/")) {
                return false;
            }
            if (file.size > maxFileSize * 1024 * 1024) {
                return false;
            }
            return true;
        });

        const currentCount = value.length;
        const availableSlots = maxImages - currentCount;
        const filesToAdd = validFiles.slice(0, availableSlots);

        setIsCompressing(true);

        try {
            // Compress all images
            const compressedData = await Promise.all(
                filesToAdd.map(file => compressImage(file))
            );

            // Collect all processed images
            let processedCount = 0;
            const newImages = [];

            compressedData.forEach((data, index) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const newImage = {
                        id: Date.now() + Math.random(),
                        preview: reader.result,
                        file: data.compressed, // Use compressed file instead of original
                        originalFile: data.original,
                        alt_text: "",
                        is_primary: value.length === 0 && index === 0,
                        originalSize: data.originalSize,
                        compressedSize: data.compressedSize,
                    };
                    newImages.push(newImage);
                    processedCount++;

                    // When all files are processed, update once
                    if (processedCount === compressedData.length) {
                        onChange([...value, ...newImages]);
                        setIsCompressing(false);
                    }
                };
                reader.readAsDataURL(data.compressed);
            });
        } catch (error) {
            console.error('Error compressing images:', error);
            setIsCompressing(false);
        }
    };

    const handleRemoveImage = (id) => {
        const updatedImages = value.filter((img) => img.id !== id);

        // If removed image was primary, set first image as primary
        if (updatedImages.length > 0 && !updatedImages.some(img => img.is_primary)) {
            updatedImages[0].is_primary = true;
        }

        onChange(updatedImages);
    };

    const handleSetPrimary = (id) => {
        const updatedImages = value.map((img) => ({
            ...img,
            is_primary: img.id === id,
        }));
        onChange(updatedImages);
    };

    const handleAltTextChange = (id, altText) => {
        const updatedImages = value.map((img) =>
            img.id === id ? { ...img, alt_text: altText } : img
        );
        onChange(updatedImages);
    };

    return (
        <div className="flex flex-col">
            {label && <label className="block text-sm font-medium text-slate-700 mb-3">{label}</label>}

            {/* Upload Area */}
            {value.length < maxImages && (
                <label htmlFor="multi-image-upload" className="mb-4 cursor-pointer">
                    <div
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isCompressing
                            ? "border-orange-400 bg-orange-50"
                            : dragActive
                                ? "border-[#556B2F] bg-[#556B2F]/5"
                                : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
                            } ${isCompressing ? 'opacity-75' : ''}`}
                    >
                        <div className="flex flex-col items-center gap-2">
                            {isCompressing ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mb-2"></div>
                                    <p className="text-sm font-medium text-orange-700">Compressing images...</p>
                                    <p className="text-xs text-orange-600">Optimizing for faster upload and reduced storage</p>
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-8 w-8 text-slate-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="text-sm font-medium text-slate-700">Drag and drop images here or click to browse</p>
                                    <p className="text-xs text-slate-500">
                                        Minimum {maxImages === 1 ? "1 image" : `2 images`}. Max {maxImages} images. Images will be auto-compressed to WebP format
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </label>
            )}

            {/* File Input */}
            <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/gif,image/webp,image/tiff,image/svg+xml,image/bmp,image/vnd.microsoft.icon,image/avif,image/heic,image/heif"
                onChange={handleFileInput}
                className="hidden"
                id="multi-image-upload"
            />

            {/* Uploaded Images Display */}
            {value.length > 0 && (
                <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                        Uploaded images ({value.length}/{maxImages})
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {value.map((image, index) => (
                            <div
                                key={image.id}
                                className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors shrink-0"
                                style={{ width: '320px' }}
                            >
                                <div className="flex flex-col gap-3">
                                    {/* Image Preview */}
                                    <div className="relative self-center">
                                        <img
                                            src={image.preview}
                                            alt={`Upload preview ${index + 1}`}
                                            className="w-32 h-32 object-cover rounded border border-slate-200"
                                        />
                                        {image.is_primary && (
                                            <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded-bl">
                                                Primary
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Details and Controls */}
                                    <div className="flex flex-col gap-3">
                                        {/* Compression Stats */}
                                        {image.compressedSize && (
                                            <div className="text-xs bg-green-50 border border-green-200 rounded p-2 text-green-700">
                                                <p className="font-medium">✓ Compressed</p>
                                                <p>{(image.originalSize / 1024 / 1024).toFixed(2)}MB → {(image.compressedSize / 1024 / 1024).toFixed(2)}MB</p>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Alt Text
                                            </label>
                                            <input
                                                type="text"
                                                value={image.alt_text}
                                                onChange={(e) => handleAltTextChange(image.id, e.target.value)}
                                                placeholder="Describe this image..."
                                                className="w-full border border-slate-300 px-2 py-1 text-xs rounded focus:outline-none focus:ring-2 focus:ring-slate-900/70"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {!image.is_primary && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetPrimary(image.id)}
                                                    className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                                                >
                                                    Set Primary
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(image.id)}
                                                className="px-2 py-1 text-xs font-medium text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
