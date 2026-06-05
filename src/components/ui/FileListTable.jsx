import React from "react";

const FILE_TYPES = {
    logo: { label: "Logo", color: "bg-blue-500/15 text-blue-300 border border-blue-500/20" },
    banner: { label: "Banner", color: "bg-purple-500/15 text-purple-300 border border-purple-500/20" },
    document: { label: "Documents", color: "bg-green-500/15 text-green-300 border border-green-500/20" },
    product: { label: "Products", color: "bg-orange-500/15 text-orange-300 border border-orange-500/20" }
};

export default function FileListTable({ files = [], onDelete, isLoading = false }) {
    const filteredFiles = files;

    // Log files for debugging
    React.useEffect(() => {
        console.log('FileListTable received files:', filteredFiles);
    }, [filteredFiles]);

    const formatFileSize = (bytes) => {
        if (bytes === null || bytes === undefined) return "—";
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    const formatDate = (dateString) => {
        if (!dateString) return "—";
        try {
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return "—";
            return d.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        } catch {
            return "—";
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
                        className="h-12 w-12 text-white/20 mx-auto mb-3"
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
                    <p className="text-neutral-400 text-sm font-medium">No files uploaded yet</p>
                </div>
            ) : (
                // List View
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="px-4 py-3 text-left font-semibold text-neutral-400">Filename</th>
                                <th className="px-4 py-3 text-left font-semibold text-neutral-400">Type</th>
                                <th className="px-4 py-3 text-right font-semibold text-neutral-400">Size</th>
                                <th className="px-4 py-3 text-left font-semibold text-neutral-400">Date</th>
                                <th className="px-4 py-3 text-right font-semibold text-neutral-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredFiles.map((file) => {
                                const typeConfig = getFileTypeConfig(file.type);
                                return (
                                    <tr key={file.id} className="hover:bg-white/5 transition-colors duration-200">
                                        <td className="px-4 py-3">
                                            <a
                                                href={file.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-400 hover:text-blue-300 hover:underline truncate max-w-sm block transition-colors duration-150"
                                                title={file.name}
                                            >
                                                {file.name}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeConfig.color}`}>
                                                {typeConfig.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-neutral-400">
                                            {formatFileSize(file.size)}
                                        </td>
                                        <td className="px-4 py-3 text-neutral-400">
                                            {formatDate(file.uploadedAt)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => onDelete(file.id)}
                                                disabled={isLoading}
                                                className="text-red-400 hover:text-red-300 font-medium text-xs disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
