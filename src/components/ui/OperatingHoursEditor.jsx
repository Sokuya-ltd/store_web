import React from "react";

const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

const defaultHours = {
    enabled: true,
    from: "09:00",
    to: "17:30",
};

export default function OperatingHoursEditor({ value, onChange, themeColor = "#000" }) {
    // Initialize default value: Monday-Saturday active, Sunday closed
    const initialValue = days.reduce((acc, day) => {
        acc[day] = day === "Sunday"
            ? { enabled: false, from: "09:00", to: "17:30" }
            : { ...defaultHours };
        return acc;
    }, {});

    // Merge initialValue with incoming value
    const mergedValue = { ...initialValue, ...value };

    const handleToggle = (day) => {
        onChange({
            ...mergedValue,
            [day]: {
                ...mergedValue[day],
                enabled: !mergedValue[day]?.enabled,
            },
        });
    };
    const handleTimeChange = (day, field, time) => {
        onChange({
            ...mergedValue,
            [day]: {
                ...mergedValue[day],
                [field]: time,
            },
        });
    };
    return (
        <div className="bg-white rounded-lg p-6">
            <div className="w-full max-w-2xl mx-auto px-2 md:px-0">
                <div className="overflow-x-auto">
                    <div className="grid grid-cols-[56px_120px_60px_120px_60px_120px_1fr] gap-x-2 gap-y-2 min-w-[700px] md:min-w-0">
                        {/* Header row for alignment */}
                        <div></div>
                        <div></div>
                        <div className="text-xs text-black text-right">From</div>
                        <div></div>
                        <div className="text-xs text-black text-right">To</div>
                        <div></div>
                        <div></div>
                        {days.map((day) => {
                            const enabled = mergedValue[day]?.enabled ?? false;
                            return (
                                <React.Fragment key={day}>
                                    {/* Toggle Switch */}
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            aria-label={`Toggle ${day}`}
                                            className={`relative w-10 h-6 focus:outline-none rounded-full transition ${enabled ? "bg-black" : "bg-white border border-black"}`}
                                            style={enabled ? { backgroundColor: "#000" } : { backgroundColor: "#fff", border: "2px solid #000" }}
                                            onClick={() => handleToggle(day)}
                                        >
                                            <span
                                                className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${enabled ? "translate-x-4" : ""}`}
                                                style={{ border: "2px solid #000" }}
                                            />
                                        </button>
                                    </div>
                                    <div className={`flex items-center font-medium text-base min-w-[90px] ${enabled ? "text-black" : "text-slate-400"}`}>{day}</div>
                                    {/* From label */}
                                    <div className="flex items-center justify-end text-xs text-black">{enabled ? "From" : ""}</div>
                                    {/* From input or closed */}
                                    <div className="flex items-center">
                                        {enabled ? (
                                            <input
                                                type="time"
                                                value={mergedValue[day]?.from || "09:00"}
                                                onChange={e => handleTimeChange(day, "from", e.target.value)}
                                                className="bg-white border border-black rounded px-3 py-1 text-sm text-black focus:border-black w-full"
                                                style={{ borderColor: "#000", color: "#000" }}
                                            />
                                        ) : null}
                                    </div>
                                    {/* To label */}
                                    <div className="flex items-center justify-end text-xs text-black">{enabled ? "To" : ""}</div>
                                    {/* To input or closed */}
                                    <div className="flex items-center">
                                        {enabled ? (
                                            <input
                                                type="time"
                                                value={mergedValue[day]?.to || "17:30"}
                                                onChange={e => handleTimeChange(day, "to", e.target.value)}
                                                className="bg-white border border-black rounded px-3 py-1 text-sm text-black focus:border-black w-full"
                                                style={{ borderColor: "#000", color: "#000" }}
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2 text-black">
                                                <span className="text-lg">&#x2715;</span>
                                                <span>Closed</span>
                                            </div>
                                        )}
                                    </div>
                                    <div></div>
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
