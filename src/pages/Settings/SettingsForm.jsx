import { useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import OperatingHoursEditor from "../../components/ui/OperatingHoursEditor";
import Button from "../../components/ui/Button";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";
import Card from "../../components/ui/Card";
import { colors } from "../../lib/colors";

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
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    return (
        <form className="space-y-6" onSubmit={onSubmit} autoComplete="off">
            {/* Success Message */}
            {submitSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Profile updated successfully!
                </div>
            )}

            {/* Error Message */}
            {submitError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p className="font-medium">Failed to update profile</p>
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

            {/* General Information & Address Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* General Information Card */}
                <Card className="p-4 md:p-5">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 mb-1">General Information</h3>
                            <p className="text-sm text-slate-600">Update your store name, description, and contact details.</p>
                        </div>

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

                        <Input
                            label="Email Address"
                            type="email"
                            value={form.email}
                            onChange={e => updateForm({ ...form, email: e.target.value })}
                            readOnly
                        />

                        <Textarea
                            label="Description"
                            rows={10}
                            value={form.store_description}
                            onChange={content => updateForm({ ...form, store_description: content })}
                        />
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-base font-semibold text-slate-900 mb-1">Address & Location</h3>
                            <p className="text-sm text-slate-600">Set your store's address, city, state, postal code, and delivery radius.</p>
                        </div>
                        <div className="space-y-4">
                            <Input
                                label="Store Address"
                                type="text"
                                value={form.store_address}
                                onChange={e => updateForm({ ...form, store_address: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <Input
                                    label="City"
                                    type="text"
                                    value={form.store_city}
                                    onChange={e => updateForm({ ...form, store_city: e.target.value })}
                                    required
                                />
                                <Input
                                    label="State"
                                    type="text"
                                    value={form.store_state}
                                    onChange={e => updateForm({ ...form, store_state: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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

                            {/* Latitude & Longitude */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Latitude</label>
                                    <div className="flex gap-1 sm:gap-2">
                                        <input
                                            type="text"
                                            value={form.store_latitude}
                                            onChange={e => updateForm({ ...form, store_latitude: e.target.value })}
                                            placeholder="Auto-fill →"
                                            className="flex-1 px-2 sm:px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                                            style={{ outlineColor: colors.primary.main }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            disabled={geoLoading}
                                            title="Get current location"
                                            className="px-2 sm:px-3 py-2 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                            style={{ backgroundColor: colors.primary.main }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary.dark}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary.main}
                                        >
                                            {geoLoading ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block"></span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a 8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Longitude</label>
                                    <div className="flex gap-1 sm:gap-2">
                                        <input
                                            type="text"
                                            value={form.store_longitude}
                                            onChange={e => updateForm({ ...form, store_longitude: e.target.value })}
                                            placeholder="Auto-fill →"
                                            className="flex-1 px-2 sm:px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:border-transparent text-sm"
                                            style={{ outlineColor: colors.primary.main }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            disabled={geoLoading}
                                            title="Get current location"
                                            className="px-2 sm:px-3 py-2 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                            style={{ backgroundColor: colors.primary.main }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary.dark}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary.main}
                                        >
                                            {geoLoading ? (
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block"></span>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a 8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {form.store_latitude && form.store_longitude && (
                                <div className="mt-3 md:mt-4">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Location Preview</label>
                                    <div className="w-full overflow-hidden rounded-md" style={{paddingBottom: '66.67%', position: 'relative'}}>
                                        <iframe
                                            style={{ border: 0, borderRadius: '0.375rem', position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                            loading="lazy"
                                            allowFullScreen=""
                                            src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${form.store_latitude},${form.store_longitude}`}
                                        ></iframe>
                                    </div>
                                </div>
                            )}

                            {geoError && (
                                <p className="text-xs text-red-600">{geoError}</p>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Branding Card - REMOVED - Moved to separate BrandingForm */}
            </div>

            {/* Hours Section */}
            <Card className="p-4 md:p-5">
                <div className="space-y-6">


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Operating Hours */}
                        <div>
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1">Hours</h3>
                                <p className="text-sm text-slate-600">Set your store's operating hours.</p>
                            </div>
                            <OperatingHoursEditor
                                value={form.operating_hours}
                                onChange={val => updateForm({ ...form, operating_hours: val })}
                                themeColor="#FF6B1A"
                                className="w-full"
                            />
                        </div>

                        {/* Finance Information Section */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold text-slate-900 mb-1">Finance Information</h3>
                                <p className="text-sm text-slate-600">Manage your store's financial settings.</p>
                            </div>

                            <Input
                                label="Minimum Order Amount"
                                type="number"
                                step="0.01"
                                value={form.minimum_order_amount}
                                onChange={e => updateForm({ ...form, minimum_order_amount: e.target.value })}
                            />
                            <Input
                                label="Delivery Fee"
                                type="number"
                                step="0.01"
                                value={form.delivery_fee}
                                onChange={e => updateForm({ ...form, delivery_fee: e.target.value })}
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                                <Input
                                    label={`Commission Rate (%)`}
                                    type="number"
                                    step="0.01"
                                    value={form.commission_rate || ""}
                                    onChange={e => updateForm({ ...form, commission_rate: e.target.value })}
                                />
                                <div className="pt-2">
                                    <label className="flex items-center gap-2 font-medium text-slate-900">
                                        <span>Accepts Orders</span>
                                    </label>
                                    <ToggleButtonGroup
                                        options={[
                                            { label: "Yes", value: true },
                                            { label: "No", value: false }
                                        ]}
                                        value={form.accepts_orders}
                                        onChange={val => updateForm({ ...form, accepts_orders: val })}
                                        name="accepts_orders"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
                <Button
                    type="submit"
                    disabled={submitting}
                    style={{ backgroundColor: colors.primary.main }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary.dark}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary.main}
                    className="py-2 px-4 md:px-6 text-white font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
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
