import { useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import OperatingHoursEditor from "../../components/ui/OperatingHoursEditor";
import Button from "../../components/ui/Button";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";
import SettingsCard from "../../components/ui/SettingsCard";

function SectionLabel({ children }) {
    return (
        <p className="text-xs font-semibold text-orange-400 uppercase tracking-widest mb-3">
            {children}
        </p>
    );
}

function Divider() {
    return <div className="border-t border-white/10 my-6" />;
}

export default function SettingsForm({ form, updateForm, onSubmit, submitting, submitError, submitSuccess }) {
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState(null);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setGeoError("Geolocation is not supported by your browser");
            return;
        }

        setGeoLoading(true);
        setGeoError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                updateForm({
                    ...form,
                    store_latitude: position.coords.latitude.toFixed(8),
                    store_longitude: position.coords.longitude.toFixed(8)
                });
                setGeoLoading(false);
            },
            (error) => {
                setGeoLoading(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setGeoError("Location permission denied. Please enable it in your browser settings.");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setGeoError("Location information unavailable.");
                        break;
                    case error.TIMEOUT:
                        setGeoError("Location request timed out.");
                        break;
                    default:
                        setGeoError("An unknown error occurred.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    return (
        <form className="space-y-0" onSubmit={onSubmit} autoComplete="off">
            {/* Success Message */}
            {submitSuccess && (
                <div className="bg-green-400/10 border border-green-400/30 text-green-300 px-4 py-3 rounded mb-5 text-sm">
                    Profile updated successfully!
                </div>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="bg-red-400/10 border border-red-400/30 text-red-300 px-4 py-3 rounded mb-5">
                    <p className="font-medium text-sm">Failed to update profile</p>
                    {typeof submitError === 'object' ? (
                        <ul className="text-xs list-disc list-inside mt-1">
                            {Object.entries(submitError).map(([field, messages]) => (
                                <li key={field}>{field}: {Array.isArray(messages) ? messages.join(', ') : messages}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs mt-1">{submitError}</p>
                    )}
                </div>
            )}

            {/* Section 1: Basic Details */}
            <SectionLabel>Basic details</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

                {/* General Information Card */}
                <SettingsCard className="p-4 md:p-5">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-white mb-0.5">General Information</h3>
                            <p className="text-xs text-neutral-500">Store name, contact details, and description.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Store Name"
                                type="text"
                                value={form.store_name}
                                onChange={e => updateForm({ ...form, store_name: e.target.value })}
                                required
                            />
                            <Input
                                label="Phone Number"
                                type="tel"
                                value={form.phone}
                                onChange={e => updateForm({ ...form, phone: e.target.value })}
                                required
                            />
                        </div>

                        <Input
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={e => updateForm({ ...form, email: e.target.value })}
                            readOnly
                        />

                        <Textarea
                            label="Description"
                            rows={5}
                            value={form.store_description}
                            onChange={content => updateForm({ ...form, store_description: content })}
                            placeholder="Tell customers about your store..."
                        />
                    </div>
                </SettingsCard>

                {/* Address & Location Card */}
                <SettingsCard className="p-4 md:p-5">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-white mb-0.5">Address &amp; Location</h3>
                            <p className="text-xs text-neutral-500">Delivery area, coordinates, and map preview.</p>
                        </div>

                        <Input
                            label="Store Address"
                            type="text"
                            value={form.store_address}
                            onChange={e => updateForm({ ...form, store_address: e.target.value })}
                            required
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="City"
                                type="text"
                                value={form.store_city}
                                onChange={e => updateForm({ ...form, store_city: e.target.value })}
                                required
                            />
                            <Input
                                label="State / Region"
                                type="text"
                                value={form.store_state}
                                onChange={e => updateForm({ ...form, store_state: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Postal Code"
                                type="text"
                                value={form.store_postal_code}
                                onChange={e => updateForm({ ...form, store_postal_code: e.target.value })}
                                required
                            />
                            <Input
                                label="Delivery Radius (km)"
                                type="number"
                                step="0.01"
                                value={form.delivery_radius}
                                onChange={e => updateForm({ ...form, delivery_radius: e.target.value })}
                            />
                        </div>

                        {/* Coordinates — single button fills both */}
                        <div>
                            <p className="text-xs text-neutral-400 mb-2">
                                Coordinates{" "}
                                <span className="text-neutral-600">— click button to auto-fill both</span>
                            </p>
                            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-end">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-neutral-400">Latitude</label>
                                    <input
                                        type="text"
                                        value={form.store_latitude}
                                        onChange={e => updateForm({ ...form, store_latitude: e.target.value })}
                                        placeholder="—"
                                        className="bg-white/10 border border-white/20 text-white placeholder-neutral-600 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs text-neutral-400">Longitude</label>
                                    <input
                                        type="text"
                                        value={form.store_longitude}
                                        onChange={e => updateForm({ ...form, store_longitude: e.target.value })}
                                        placeholder="—"
                                        className="bg-white/10 border border-white/20 text-white placeholder-neutral-600 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-400 text-sm"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGetLocation}
                                    disabled={geoLoading}
                                    title="Use my current location"
                                    className="flex items-center gap-1.5 px-3 py-2 bg-orange-400 hover:bg-orange-500 text-white text-xs rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap h-9"
                                >
                                    {geoLoading ? (
                                        <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white inline-block" />
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                    Use my location
                                </button>
                            </div>
                            {geoError && (
                                <p className="text-xs text-red-400 mt-2">{geoError}</p>
                            )}
                        </div>

                        {/* Map Preview */}
                        {form.store_latitude && form.store_longitude && (
                            <div>
                                <label className="block text-xs text-neutral-400 mb-2">Location Preview</label>
                                <div className="w-full rounded-md overflow-hidden relative" style={{ paddingBottom: '60%' }}>
                                    <iframe
                                        title="Map preview"
                                        style={{ border: 0, borderRadius: '0.375rem', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                        loading="lazy"
                                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${form.store_latitude},${form.store_longitude}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </SettingsCard>
            </div>

            <Divider />

            {/* Section 2: Operations */}
            <SectionLabel>Operations</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">

                {/* Operating Hours Card */}
                <SettingsCard className="p-4 md:p-5">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-white mb-0.5">Operating Hours</h3>
                            <p className="text-xs text-neutral-500">Set your store's open and close times per day.</p>
                        </div>
                        <OperatingHoursEditor
                            value={form.operating_hours}
                            onChange={val => updateForm({ ...form, operating_hours: val })}
                            themeColor="#FF6B1A"
                            className="w-full"
                        />
                    </div>
                </SettingsCard>

                {/* Finance & Orders Card */}
                <SettingsCard className="p-4 md:p-5">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-white mb-0.5">Finance &amp; Orders</h3>
                            <p className="text-xs text-neutral-500">Pricing, fees, and order acceptance.</p>
                        </div>

                        <Input
                            label="Minimum Order Amount"
                            type="number"
                            step="0.01"
                            value={form.minimum_order_amount}
                            onChange={e => updateForm({ ...form, minimum_order_amount: e.target.value })}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Delivery Fee"
                                type="number"
                                step="0.01"
                                value={form.delivery_fee}
                                placeholder="0.00"
                                onChange={e => updateForm({ ...form, delivery_fee: e.target.value })}
                            />
                            <Input
                                label="Commission Rate (%)"
                                type="number"
                                step="0.01"
                                value={form.commission_rate || ""}
                                placeholder="0.00"
                                onChange={e => updateForm({ ...form, commission_rate: e.target.value })}
                            />
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <label className="block text-xs text-neutral-400 mb-1.5">Accepts Orders</label>
                            <ToggleButtonGroup
                                options={[
                                    { label: "Yes", value: true },
                                    { label: "No", value: false }
                                ]}
                                value={form.accepts_orders}
                                onChange={val => updateForm({ ...form, accepts_orders: val })}
                                name="accepts_orders"
                            />
                            <p className="text-xs text-neutral-600 mt-2">
                                When disabled, your store will stop receiving new orders.
                            </p>
                        </div>
                    </div>
                </SettingsCard>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end mt-6">
                <Button
                    type="submit"
                    disabled={submitting}
                    className="py-2 px-6 bg-orange-400 hover:bg-orange-500 text-white font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
                            Updating...
                        </span>
                    ) : (
                        'Update Settings'
                    )}
                </Button>
            </div>
        </form>
    );
}
