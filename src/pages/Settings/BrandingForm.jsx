import { useState, useEffect } from "react";
import ImageUpload from "../../components/ui/ImageUpload";
import FileUploadCard from "../../components/ui/FileUploadCard";
import FileListTable from "../../components/ui/FileListTable";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ToastContainer from "../../components/ui/ToastContainer";
import { Image, FileText } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import { colors } from "../../lib/colors";
import { uploadStoreFile, retrieveStoreFiles } from "../../services/api";

export default function BrandingForm({ 
    form, 
    updateForm, 
    onSubmit, 
    submitting, 
    submitError, 
    submitSuccess 
}) {
    const { toasts, hideToast, success: showSuccess, error: showError } = useToast();
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [fileDeleteLoading, setFileDeleteLoading] = useState(false);
    const [uploading, setUploading] = useState({ logo: false, banner: false, documents: false });
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [showTypeDialog, setShowTypeDialog] = useState(false);

    // Helper function to clean URLs - extract Cloudinary URL if it's been double-prefixed
    const cleanUrl = (url) => {
        if (!url) return '';
        
        // If URL is already a full Cloudinary/external URL, return as-is
        if (url.startsWith('http://') || url.startsWith('https://')) {
            // Check if it's been double-prefixed (storage path + full URL)
            const cloudinaryMatch = url.match(/https?:\/\/res\.cloudinary\.com\/.+/);
            if (cloudinaryMatch) {
                return cloudinaryMatch[0]; // Return only the Cloudinary URL
            }
            return url;
        }
        
        // If it's a relative path, return as-is
        return url;
    };

    // Fetch uploaded files on component mount
    useEffect(() => {
        fetchUploadedFiles();
    }, []);

    const fetchUploadedFiles = async () => {
        setLoadingFiles(true);
        try {
            const allFiles = [];

            // Fetch images - separate call as per backend route handler
            try {
                console.log('Fetching images...');
                const imagesResponse = await retrieveStoreFiles('images');
                console.log('Images response:', imagesResponse);
                const imagesData = imagesResponse.data || imagesResponse;
                
                if (imagesData.images) {
                    Object.entries(imagesData.images).forEach(([type, image]) => {
                        if (image.uploaded && image.url) {
                            allFiles.push({
                                id: `${type}_${Date.now()}`,
                                name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
                                type: type, // 'logo' or 'banner'
                                size: image.size || 0,
                                url: cleanUrl(image.url),
                                uploadedAt: new Date().toISOString(),
                                filePath: image.path
                            });
                        }
                    });
                }
            } catch (imageError) {
                console.error('Error fetching images:', imageError);
            }
            
            // Fetch documents - separate call as per backend route handler
            try {
                console.log('Fetching documents...');
                const docsResponse = await retrieveStoreFiles('documents');
                console.log('Documents response:', docsResponse);
                
                const docsData = docsResponse.data || docsResponse;
                let documents = [];
                
                // Handle various response formats from backend
                if (Array.isArray(docsData.documents)) {
                    documents = docsData.documents;
                } else if (Array.isArray(docsData.data)) {
                    documents = docsData.data;
                } else if (Array.isArray(docsData)) {
                    documents = docsData;
                }
                
                console.log('Parsed documents:', documents);
                
                if (documents && documents.length > 0) {
                    documents.forEach((doc, idx) => {
                        const downloadUrl = `/api/store/documents/${doc.id}/download`;
                        
                        const transformedDoc = {
                            id: doc.id,
                            name: doc.filename || doc.file_name || doc.name,
                            type: 'document',
                            size: parseFloat(doc.size_mb) || doc.size || 0,
                            url: cleanUrl(doc.url || downloadUrl),
                            uploadedAt: doc.uploaded_at || doc.createdAt || new Date().toISOString(),
                            filePath: cleanUrl(doc.url || downloadUrl),
                            documentType: doc.type,
                            canDownload: doc.can_download !== false
                        };
                        allFiles.push(transformedDoc);
                    });
                }
            } catch (docError) {
                console.error('Error fetching documents:', docError);
            }

            console.log('Total files to display:', allFiles);
            setUploadedFiles(allFiles);

        } catch (error) {
            // Silently fail - user can still upload new files
        } finally {
            setLoadingFiles(false);
        }
    };

    const handleLogoUpload = async (file) => {
        setUploading(prev => ({ ...prev, logo: true }));
        try {
            console.log('Uploading logo...');
            const response = await uploadStoreFile(file, 'logo');
            console.log('Logo upload response:', response);
            
            const data = response.data || response;
            const logoUrl = data.url || data.file_path || data.path;
            
            if (logoUrl) {
                updateForm({ ...form, store_logo: cleanUrl(logoUrl) });
            }
            
            showSuccess('✓ Logo uploaded successfully!');
            
            // Refresh files list
            setTimeout(() => fetchUploadedFiles(), 800);
        } catch (error) {
            console.error('Logo upload error:', error);
            showError('✗ Failed to upload logo: ' + (error.message || 'Unknown error'));
        } finally {
            setUploading(prev => ({ ...prev, logo: false }));
        }
    };

    const handleBannerUpload = async (file) => {
        setUploading(prev => ({ ...prev, banner: true }));
        try {
            console.log('Uploading banner...');
            const response = await uploadStoreFile(file, 'banner');
            console.log('Banner upload response:', response);
            
            const data = response.data || response;
            const bannerUrl = data.url || data.file_path || data.path;
            
            if (bannerUrl) {
                updateForm({ ...form, store_banner: cleanUrl(bannerUrl) });
            }
            
            showSuccess('✓ Banner uploaded successfully!');
            
            // Refresh files list
            setTimeout(() => fetchUploadedFiles(), 800);
        } catch (error) {
            console.error('Banner upload error:', error);
            showError('✗ Failed to upload banner: ' + (error.message || 'Unknown error'));
        } finally {
            setUploading(prev => ({ ...prev, banner: false }));
        }
    };

    const handleDocumentUpload = async (file) => {
        // Show dialog to select document type
        setPendingFile(file);
        setShowTypeDialog(true);
    };

    const handleDocumentTypeSelect = async (documentType) => {
        if (!pendingFile) return;
        
        setShowTypeDialog(false);
        setUploading(prev => ({ ...prev, documents: true }));
        
        try {
            // Upload with document_type using the uploadStoreFile helper
            const formData = new FormData();
            formData.append('file', pendingFile);
            formData.append('type', 'document');
            formData.append('document_type', documentType);
            
            // Get auth token using the same method as API service
            const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
            
            console.log('Uploading document:', {
                filename: pendingFile.name,
                size: pendingFile.size,
                type: documentType,
                documentType: documentType
            });
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/store/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData
            });
            
            // Try to parse response
            let data;
            try {
                data = await response.json();
                console.log('Document upload response:', data);
            } catch (e) {
                console.error('Failed to parse response:', e);
                throw new Error('Server returned invalid JSON response');
            }
            
            if (!response.ok) {
                throw {
                    status: response.status,
                    message: data.message || 'Failed to upload document',
                    errors: data.errors
                };
            }
            
            // Add the new document to the list immediately
            const newFile = {
                id: data.document_id || data.id || Date.now(),
                name: pendingFile.name,
                type: 'document',
                size: pendingFile.size,
                url: data.url || data.file_path || data.path,
                uploadedAt: data.uploaded_at || new Date().toISOString(),
                filePath: data.url || data.file_path || data.path,
                documentType: documentType
            };
            
            console.log('Adding document to list:', newFile);
            
            // Add immediately to UI
            setUploadedFiles(prev => [...prev, newFile]);
            showSuccess('✓ Document uploaded successfully!');
            
            // Refresh the file list to stay in sync with backend
            setTimeout(async () => {
                console.log('Refreshing file list...');
                await fetchUploadedFiles();
            }, 800);
        } catch (error) {
            // Handle specific error messages from backend
            if (error.status === 422 && error.errors) {
                const errorMessages = Object.entries(error.errors)
                    .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
                    .join(' | ');
                showError(`✗ Validation Error: ${errorMessages}`);
            } else if (error.status === 422) {
                showError(`✗ ${error.message || 'Validation failed'}`);
            } else {
                showError('✗ Failed to upload document: ' + (error.message || 'Unknown error'));
            }
        } finally {
            setUploading(prev => ({ ...prev, documents: false }));
            setPendingFile(null);
        }
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

    const documentTypes = [
        { value: 'business_license', label: 'Business License' },
        { value: 'tax_id', label: 'Tax ID' },
        { value: 'bank_details', label: 'Bank Details' },
        { value: 'other', label: 'Other' }
    ];

    return (
        <>
            {/* Document Type Selection Dialog */}
            {showTypeDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Document Type</h3>
                        <div className="space-y-2 mb-6">
                            {documentTypes.map(docType => (
                                <button
                                    key={docType.value}
                                    onClick={() => handleDocumentTypeSelect(docType.value)}
                                    className="w-full text-left px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                    {docType.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                setShowTypeDialog(false);
                                setPendingFile(null);
                            }}
                            className="w-full px-4 py-2 text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

        <form className="space-y-8" onSubmit={onSubmit} autoComplete="off">
            <ToastContainer toasts={toasts} onClose={hideToast} />
            
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
                        isLoading={uploading.logo}
                    />

                    {/* Store Banner Card */}
                    <FileUploadCard
                        icon={Image}
                        title="Store Banner"
                        formats={["PNG", "JPG", "WebP"]}
                        maxSize={5 * 1024 * 1024}
                        onFileSelect={handleBannerUpload}
                        isLoading={uploading.banner}
                    />

                    {/* Documents Card */}
                    <FileUploadCard
                        icon={FileText}
                        title="Documents"
                        formats={["PDF", "DOC"]}
                        maxSize={10 * 1024 * 1024}
                        onFileSelect={handleDocumentUpload}
                        isLoading={uploading.documents}
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
                        isLoading={fileDeleteLoading || loadingFiles}
                    />
                </Card>
            </div>
        </form>
        </>
    );
}
