import React from "react";

const FILE_TYPES = {
    logo: { label: "Logo", color: "bg-blue-100 text-blue-700" },
    banner: { label: "Banner", color: "bg-purple-100 text-purple-700" },
    document: { label: "Documents", color: "bg-green-100 text-green-700" },
    product: { label: "Products", color: "bg-orange-100 text-orange-700" }
};

export default function FileListTable({ files = [], onDelete, isLoading = false }) {
    const filteredFiles = files;

    // Log files for debugging
    React.useEffect(() => {
        console.log('FileListTable received files:', filteredFiles);
    }, [filteredFiles]);

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return dateString;
        }
    };

    const getFileTypeConfig = (type) => FILE_TYPES[type] || FILE_TYPES.product;

    return (
        <div>
            {/* Files Table */}
            {filteredFiles.length === 0 ? (
                <div className="text-center py-12">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-slate-300 mx-auto mb-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3v-6"
                        />
                    </svg>
                    <p className="text-slate-600 text-sm font-medium">No files uploaded yet</p>
                </div>
            ) : (
                // List View
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="px-4 py-3 text-left font-semibold text-slate-900">Filename</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900">Type</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-900">Size</th>
                                <th className="px-4 py-3 text-left font-semibold text-slate-900">Date</th>
                                <th className="px-4 py-3 text-right font-semibold text-slate-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredFiles.map((file) => {
                                const typeConfig = getFileTypeConfig(file.type);
                                return (
                                    <tr key={file.id} className="hover:bg-slate-50 transition-colors duration-200 hover:shadow-sm">
                                        <td className="px-4 py-3">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-700 hover:underline truncate max-w-sm block transition-colors duration-150"
                                                title={file.name}
                                            >
                                                {file.name}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${typeConfig.color} transition-transform duration-200 hover:scale-105`}>
                                                {typeConfig.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-600">
                                            {formatFileSize(file.size)}
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            {formatDate(file.uploadedAt)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => onDelete(file.id)}
                                                disabled={isLoading}
                                                className="text-red-600 hover:text-red-700 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
