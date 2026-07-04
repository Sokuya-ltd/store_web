import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function Textarea({
    label,
    error,
    className = "",
    value,
    onChange,
    apiKey = "inuw9fihz5kkkjbwdh2cido79371p1jozyn0m62wpzc8ywra",
    useTinyMCE = true,
    rows = 4,
    ...props
}) {
    const [isMobile, setIsMobile] = useState(false);

    // Detect mobile on mount and window resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };
        
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Handle TinyMCE's onEditorChange callback
    const handleEditorChange = (content) => {
        if (onChange) {
            const syntheticEvent = {
                target: {
                    value: content
                }
            };
            onChange(syntheticEvent);
        }
    };

    // Handle simple textarea change
    const handleTextareaChange = (e) => {
        if (onChange) {
            onChange(e);
        }
    };

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-neutral-200">
                    {label}
                </label>
            )}
            
            {/* Use simple textarea on mobile to avoid keyboard hiding issues */}
            {isMobile || !useTinyMCE ? (
                <textarea
                    className={`w-full bg-white/10 border border-white/20 text-white placeholder-neutral-500 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400/50 transition-all resize-none ${
                        error ? "border-red-400 focus:ring-red-400" : ""
                    }`}
                    value={value}
                    onChange={handleTextareaChange}
                    rows={rows}
                    {...props}
                />
            ) : (
                <Editor
                    apiKey={apiKey}
                    value={value}
                    init={{
                        height: 335,
                        menubar: false,
                        plugins: ['link', 'lists', 'code', 'table'],
                        toolbar:
                            'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link code',
                    }}
                    onEditorChange={handleEditorChange}
                    {...props}
                />
            )}
            
            {error && (
                <p className="text-xs text-red-300">{error}</p>
            )}
        </div>
    );
}