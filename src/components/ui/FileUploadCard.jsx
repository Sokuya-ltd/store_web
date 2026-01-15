import { useState } from "react";

export default function FileUploadCard({ 
    icon: Icon, 
    title, 
    formats, 
    maxSize, 
    onFileSelect,
    isLoading = false 
}) {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState({ logo: false, banner: false, documents: false });

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

        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        const fileSizeInMB = file.size / (1024 * 1024);
        const maxSizeInMB = maxSize / (1024 * 1024);

        if (fileSizeInMB > maxSizeInMB) {
            alert(`File size exceeds ${maxSizeInMB}MB limit`);
            return;
        }

        onFileSelect(file);
    };

    const formatsList = formats.join(", ").toUpperCase();
    const maxSizeLabel = maxSize >= 1024 * 1024 
        ? `${(maxSize / (1024 * 1024)).toFixed(0)}MB`
        : `${(maxSize / 1024).toFixed(0)}KB`;

    return (
        <div className="bg-white border border-slate-200 p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                {Icon && (
                    <div className="p-2 bg-blue-100 rounded">
                        <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-slate-900">{title}</h4>
                    <p className="text-xs text-slate-600">{formatsList}</p>
                </div>
            </div>

            {/* Upload Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed p-8 text-center transition-all ${
                    isLoading
                        ? "border-slate-300 bg-slate-50 opacity-60 cursor-wait"
                        : dragActive
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-300 bg-slate-50 hover:border-slate-400 cursor-pointer"
                }`}
            >
                {isLoading ? (
                    <>
                        <div className="flex items-center justify-center mb-3">
                            <div className="animate-spin">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-8 w-8 text-blue-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                </svg>
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-blue-600">Uploading...</p>
                        <p className="text-xs text-slate-500 mt-1">Please wait, this may take a moment</p>
                    </>
                ) : (
                    <>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-blue-400 mx-auto mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        <p className="text-sm font-medium text-slate-900 mb-1">Drag and drop your file here</p>
                    </>
                )}
                <p className="text-xs text-slate-600 mb-4">or click to browse</p>
                
                <label htmlFor={`upload-${title}`}>
                    <span className={`inline-block px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded font-medium text-sm transition-all ${
                        isLoading 
                            ? 'opacity-50 cursor-not-allowed' 
                            : 'cursor-pointer hover:bg-slate-50'
                    }`}>
                        {isLoading ? 'Uploading...' : 'Select File'}
                    </span>
                </label>

                <input
                    id={`upload-${title}`}
                    type="file"
                    accept={formats.map(f => `.${f.toLowerCase()}`).join(",")}
                    onChange={handleFileInput}
                    disabled={isLoading}
                    className="hidden"
                />
            </div>

            {/* File Size Info */}
            <p className="text-xs text-slate-600 mt-3">Max size: {maxSizeLabel}</p>
        </div>
    );
}
