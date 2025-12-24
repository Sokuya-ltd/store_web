import { useState } from "react";

export default function ImageUpload({ label, value, onChange, recommendation, accept = "image/*" }) {
    const [preview, setPreview] = useState(value);
    const [dragActive, setDragActive] = useState(false);

    const handleChange = (file) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onChange(file);
            };
            reader.readAsDataURL(file);
        }
    };

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
        if (file && file.type.startsWith("image/")) {
            handleChange(file);
        }
    };

    const handleFileInput = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            handleChange(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange(null);
    };

    return (
        <div className="flex flex-col">
            {label && <label className="block text-sm font-medium text-slate-700 mb-3">{label}</label>}
            
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    dragActive
                        ? "border-[#556B2F] bg-[#556B2F]/5"
                        : "border-slate-300 bg-slate-50 hover:border-slate-400"
                }`}
            >
                {preview ? (
                    <div className="flex flex-col items-center gap-3">
                        <img src={preview} alt="Preview" className="max-h-32 max-w-32 object-contain rounded" />
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                        >
                            Remove Image
                        </button>
                    </div>
                ) : (
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
                        <p className="text-sm font-medium text-slate-700">Click to upload</p>
                        <p className="text-xs text-slate-500">or drag and drop</p>
                        {recommendation && <p className="text-xs text-slate-400 mt-1">{recommendation}</p>}
                    </div>
                )}
            </div>
            
            <input
                type="file"
                accept={accept}
                onChange={handleFileInput}
                className="hidden"
                id={`image-upload-${label}`}
            />
            
            {!preview && (
                <label htmlFor={`image-upload-${label}`} className="mt-2">
                    <span className="inline-block px-3 py-2 bg-slate-200 text-slate-700 rounded text-sm font-medium cursor-pointer hover:bg-slate-300 transition-colors">
                        Choose File
                    </span>
                </label>
            )}
        </div>
    );
}
