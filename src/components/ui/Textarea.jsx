import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function Textarea({
    label,
    error,
    className = "",
    value,
    onChange,
    apiKey = "inuw9fihz5kkkjbwdh2cido79371p1jozyn0m62wpzc8ywra",
    ...props
}) {
    // Handle TinyMCE's onEditorChange callback
    const handleEditorChange = (content) => {
        if (onChange) {
            // Create a synthetic event object that matches the expected interface
            const syntheticEvent = {
                target: {
                    value: content
                }
            };
            onChange(syntheticEvent);
        }
    };

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
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
            {error && (
                <p className="text-xs text-rose-600">{error}</p>
            )}
        </div>
    );
}