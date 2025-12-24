import { useState, useEffect } from "react";
import ImageUpload from "../../components/ui/ImageUpload";
import FileUploadCard from "../../components/ui/FileUploadCard";
import FileListTable from "../../components/ui/FileListTable";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { Image, FileText } from "lucide-react";

export default function BrandingForm({ 
    form, 
    updateForm, 
    onSubmit, 
    submitting, 
    submitError, 
    submitSuccess 
}) {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileDeleteLoading, setFileDeleteLoading] = useState(false);

    // Simulate loading uploaded files from API
    useEffect(() => {
        // In a real app, fetch files from API
        // For now, initialize empty or with mock data
        setUploadedFiles([]);
    }, []);

    const handleLogoUpload = (file) => {
        updateForm({ ...form, store_logo: file });
    };

    const handleBannerUpload = (file) => {
        updateForm({ ...form, store_banner: file });
    };

    const handleDocumentUpload = (file) => {
        // Add to files list
        const newFile = {
            id: Date.now(),
            name: file.name,
            type: "document",
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
            file: file
        };
        setUploadedFiles([...uploadedFiles, newFile]);
    };

    const handleProductUpload = (file) => {
        // Add to files list
        const newFile = {
            id: Date.now(),
            name: file.name,
            type: "product",
            size: file.size,
            url: URL.createObjectURL(file),
            uploadedAt: new Date().toISOString(),
            file: file
        };
        setUploadedFiles([...uploadedFiles, newFile]);
    };

    const handleDeleteFile = (fileId) => {
        if (confirm("Are you sure you want to delete this file?")) {
            setUploadedFiles(uploadedFiles.filter(f => f.id !== fileId));
        }
    };

    return (
        <form className="space-y-8" onSubmit={onSubmit} autoComplete="off">
            {/* Success Message */}
            {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                    Branding updated successfully!
                </div>
            )}
            
            {/* Error Message */}
            {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    <p className="font-medium">Failed to update branding</p>
                    {typeof submitError === 'object' ? (
                        <ul className="text-sm list-disc list-inside mt-1">
                            {Object.entries(submitError).map(([field, messages]) => (
                                <li key={field}>{field}: {Array.isArray(messages) ? messages.join(', ') : messages}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm">{submitError}</p>
                    )}
                </div>
            )}

            {/* Upload Cards Section */}
            <div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Files</h3>
                    <p className="text-sm text-slate-600">Upload your store branding and document files</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Store Logo Card */}
                    <FileUploadCard
                        icon={Image}
                        title="Store Logo"
                        formats={["PNG", "JPG", "WebP"]}
                        maxSize={5 * 1024 * 1024}
                        onFileSelect={handleLogoUpload}
                        isLoading={submitting}
                    />

                    {/* Store Banner Card */}
                    <FileUploadCard
                        icon={Image}
                        title="Store Banner"
                        formats={["PNG", "JPG", "WebP"]}
                        maxSize={5 * 1024 * 1024}
                        onFileSelect={handleBannerUpload}
                        isLoading={submitting}
                    />

                    {/* Documents Card */}
                    <FileUploadCard
                        icon={FileText}
                        title="Documents"
                        formats={["PDF", "DOC"]}
                        maxSize={10 * 1024 * 1024}
                        onFileSelect={handleDocumentUpload}
                        isLoading={submitting}
                    />
                </div>
            </div>

            {/* File List Section */}
            <div>
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">All Files</h3>
                </div>

                <Card className="p-6">
                    <FileListTable
                        files={uploadedFiles}
                        onDelete={handleDeleteFile}
                        isLoading={fileDeleteLoading}
                    />
                </Card>
            </div>
        </form>
    );
}
