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
                onEditorChange={onChange}
                {...props}
            />
            {error && (
                <p className="text-xs text-rose-600">{error}</p>
            )}
        </div>
    );
}