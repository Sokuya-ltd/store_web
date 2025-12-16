import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import OperatingHoursEditor from "../../components/ui/OperatingHoursEditor";
import Button from "../../components/ui/Button";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";

export default function SettingsForm({ form, updateForm, onSubmit, submitting, submitError, submitSuccess }) {
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Full Name"
                    type="text"
                    value={form.name}
                    onChange={e => updateForm({ ...form, name: e.target.value })}
                    readOnly
                />
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={e => updateForm({ ...form, email: e.target.value })}
                    readOnly
                />
                <Input
                    label="Phone"
                    type="text"
                    value={form.phone}
                    onChange={e => updateForm({ ...form, phone: e.target.value })}
                    required
                />
            </div>
            <h2 className="text-lg font-semibold mb-2">Store Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Store Name"
                    type="text"
                    value={form.store_name}
                    onChange={e => updateForm({ ...form, store_name: e.target.value })}
                    required
                />
                <Input
                    label="Store Address"
                    type="text"
                    value={form.store_address}
                    onChange={e => updateForm({ ...form, store_address: e.target.value })}
                    required
                />
                <Input
                    label="Store City"
                    type="text"
                    value={form.store_city}
                    onChange={e => updateForm({ ...form, store_city: e.target.value })}
                    required
                />
                <Input
                    label="Store State"
                    type="text"
                    value={form.store_state}
                    onChange={e => updateForm({ ...form, store_state: e.target.value })}
                    required
                />
                <Input
                    label="Postal Code"
                    type="text"
                    value={form.store_postal_code}
                    onChange={e => updateForm({ ...form, store_postal_code: e.target.value })}
                    required
                />
                <Input
                    label="Latitude"
                    type="text"
                    value={form.store_latitude}
                    onChange={e => updateForm({ ...form, store_latitude: e.target.value })}
                />
                <Input
                    label="Longitude"
                    type="text"
                    value={form.store_longitude}
                    onChange={e => updateForm({ ...form, store_longitude: e.target.value })}
                />
                <Input
                    label="Delivery Radius (km)"
                    type="number"
                    step="0.01"
                    value={form.delivery_radius}
                    onChange={e => updateForm({ ...form, delivery_radius: e.target.value })}
                />
                <div className="flex flex-col justify-end">
                    <label className="mb-1 font-medium">Accepts Orders</label>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Input
                    label="Commission Rate (%)"
                    type="number"
                    step="0.01"
                    value={form.commission_rate}
                    onChange={e => updateForm({ ...form, commission_rate: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 flex flex-col">
                    <Textarea
                        label="Store Description"
                        rows={18}
                        value={form.store_description}
                        onChange={content => updateForm({ ...form, store_description: content })}
                        className="flex-1"
                    />
                </div>
                <div className="md:col-span-1 flex flex-col">
                    <OperatingHoursEditor
                        value={form.operating_hours}
                        onChange={val => updateForm({ ...form, operating_hours: val })}
                        themeColor="#FF6B1A"
                        className="w-full"
                    />
                </div>
            </div>
            <div className="flex items-center justify-end">
                <Button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 py-2 px-4 bg-[#000000] text-white font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
