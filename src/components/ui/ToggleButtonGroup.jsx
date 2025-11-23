// src/components/ui/ToggleButtonGroup.jsx
import React from "react";

export default function ToggleButtonGroup({
    label,
    error,
    options,
    value,
    onChange,
    name,
    color = "#556B2F",
    className = "",
    ...props
}) {
    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-slate-700">
                    {label}
                </label>
            )}
            <div
                className={`flex border border-slate-700 rounded overflow-hidden w-fit ${error ? "border-rose-500" : ""
                    } ${className}`}
                {...props}
            >
                {options.map((opt, idx) => (
                    <React.Fragment key={opt.value}>
                        <input
                            type="radio"
                            name={name}
                            id={`${name}-${opt.value}`}
                            checked={value === opt.value}
                            onChange={() => onChange(opt.value)}
                            className="sr-only"
                        />
                        <label
                            htmlFor={`${name}-${opt.value}`}
                            className={`px-4 py-2 cursor-pointer font-medium transition-all duration-150 ${value === opt.value
                                ? "bg-slate-700 text-white"
                                : "bg-white text-slate-700"} ${idx < options.length - 1 ? "border-r border-slate-700" : ""}`}
                            style={{ minWidth: 70, textAlign: "center" }}
                        >
                            {opt.label}
                        </label>
                    </React.Fragment>
                ))}
            </div>
            {error && (
                <p className="text-xs text-rose-600">{error}</p>
            )}
        </div>
    );
}