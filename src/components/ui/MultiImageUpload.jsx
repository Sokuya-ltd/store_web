import { useState } from "react";

export default function MultiImageUpload({ label, value = [], onChange, maxImages = 5, maxFileSize = 5 }) {
    const [dragActive, setDragActive] = useState(false);

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

    const handleFiles = (files) => {
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

        filesToAdd.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImage = {
                    id: Date.now() + Math.random(),
                    preview: reader.result,
                    file: file,
                    alt_text: "",
                    is_primary: value.length === 0 && filesToAdd.indexOf(file) === 0,
                };
                onChange([...value, newImage]);
            };
            reader.readAsDataURL(file);
        });
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
                <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors mb-4 ${
                        dragActive
                            ? "border-[#556B2F] bg-[#556B2F]/5"
                            : "border-slate-300 bg-slate-50 hover:border-slate-400"
                    }`}
                >
                    <div className="flex flex-col items-center gap-2">
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
                            Minimum {maxImages === 1 ? "1 image" : `2 images`}. Max {maxImages} images, {maxFileSize}MB each
                        </p>
                    </div>
                </div>
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

            {value.length < maxImages && (
                <label htmlFor="multi-image-upload" className="mb-4">
                    <span className="inline-block px-3 py-2 bg-slate-200 text-slate-700 rounded text-sm font-medium cursor-pointer hover:bg-slate-300 transition-colors">
                        Select Images
                    </span>
                </label>
            )}

            {/* Uploaded Images Display */}
            {value.length > 0 && (
                <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                        Uploaded images ({value.length}/{maxImages})
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                        {value.map((image, index) => (
                            <div
                                key={image.id}
                                className="border border-slate-200 rounded-lg p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Image Preview */}
                                    <div className="relative shrink-0">
                                        <img
                                            src={image.preview}
                                            alt={`Upload preview ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded border border-slate-200"
                                        />
                                        {image.is_primary && (
                                            <div className="absolute top-0 right-0 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded-bl">
                                                Primary
                                            </div>
                                        )}
                                    </div>

                                    {/* Image Details and Controls */}
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-700 mb-1">
                                                Alt Text
                                            </label>
                                            <input
                                                type="text"
                                                value={image.alt_text}
                                                onChange={(e) => handleAltTextChange(image.id, e.target.value)}
                                                placeholder="Describe this image..."
                                                className="w-full border border-slate-300 px-3 py-2 text-sm rounded focus:outline-none focus:ring-2 focus:ring-slate-900/70"
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            {!image.is_primary && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleSetPrimary(image.id)}
                                                    className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                                                >
                                                    Set as Primary
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(image.id)}
                                                className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 border border-red-300 rounded hover:bg-red-50 transition-colors"
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
