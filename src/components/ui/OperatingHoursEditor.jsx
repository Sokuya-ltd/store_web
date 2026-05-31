import React from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const defaultHours = { enabled: true, from: "09:00", to: "17:30" };

export default function OperatingHoursEditor({ value, onChange, themeColor = "#f97316", className = "" }) {
    const initialValue = DAYS.reduce((acc, day) => {
        acc[day] = day === "Sunday"
            ? { enabled: false, from: "09:00", to: "17:30" }
            : { ...defaultHours };
        return acc;
    }, {});

    const mergedValue = { ...initialValue, ...value };

    const handleToggle = (day) => {
        onChange({ ...mergedValue, [day]: { ...mergedValue[day], enabled: !mergedValue[day]?.enabled } });
    };

    const handleTimeChange = (day, field, time) => {
        onChange({ ...mergedValue, [day]: { ...mergedValue[day], [field]: time } });
    };

    return (
        <div className={`flex flex-col gap-2 mt-3 ${className}`}>
            <style>{`
                input[type="time"]::-webkit-calendar-picker-indicator { filter: invert(0.5); cursor: pointer; }
            `}</style>
            {DAYS.map((day) => {
                const enabled = mergedValue[day]?.enabled ?? false;
                return (
                    <div
                        key={day}
                        className="grid items-center gap-2"
                        style={{ gridTemplateColumns: "36px 100px 1fr 24px 1fr" }}
                    >
                        {/* Toggle */}
                        <button
                            type="button"
                            aria-label={`Toggle ${day}`}
                            onClick={() => handleToggle(day)}
                            className="relative w-9 h-5 rounded-full shrink-0 transition-colors duration-150 focus:outline-none"
                            style={{ backgroundColor: enabled ? themeColor : "#374151" }}
                        >
                            <span
                                className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-150"
                                style={{ left: enabled ? "calc(100% - 18px)" : "2px" }}
                            />
                        </button>

                        {/* Day name */}
                        <span className={`text-sm ${enabled ? "text-neutral-300" : "text-neutral-600"}`}>
                            {day}
                        </span>

                        {/* From time or Closed */}
                        {enabled ? (
                            <input
                                type="time"
                                value={mergedValue[day]?.from || "09:00"}
                                onChange={e => handleTimeChange(day, "from", e.target.value)}
                                className="w-full bg-white/5 border border-white/15 text-neutral-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                            />
                        ) : (
                            <span className="col-span-3 text-sm text-neutral-600">Closed</span>
                        )}

                        {enabled && (
                            <>
                                <span className="text-xs text-neutral-600 text-center">to</span>
                                <input
                                    type="time"
                                    value={mergedValue[day]?.to || "17:30"}
                                    onChange={e => handleTimeChange(day, "to", e.target.value)}
                                    className="w-full bg-white/5 border border-white/15 text-neutral-200 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
                                />
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
