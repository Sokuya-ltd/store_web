import React from 'react';

export default function Textarea({ label, error, className = "", ...props }) {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <textarea
                className={`w-full min-h-20 border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/70 ${
                    error ? "border-rose-500 focus:ring-rose-500" : ""
                } ${className}`}
                {...props}
            />
            {error && (
                <p className="text-xs text-rose-600">{error}</p>
            )}
        </div>
    );
}