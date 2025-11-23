import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import Checkbox from "../../components/ui/Checkbox";
import ToggleButtonGroup from "../../components/ui/ToggleButtonGroup";

export default function SettingsForm({ form, updateForm }) {
    const navigate = useNavigate();

    const handleNext = (e) => {
        e.preventDefault();
        // basic validation
        if (!form.name || !form.email || !form.password || !form.phone) {
            alert("Please fill in all required fields");
            return;
        }
        navigate("/onboarding/store");
    };
    return (
        <form className="space-y-6" onSubmit={handleNext}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Full Name"
                    type="text"
                    value={form.name}
                    onChange={e => updateForm({ name: e.target.value })}
                    required
                />
                <Input
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={e => updateForm({ email: e.target.value })}
                />
                <Input
                    label="Phone"
                    type="text"
                    value={form.phone}
                    onChange={e => updateForm({ phone: e.target.value })}
                />
            </div>
            <h2 className="text-lg font-semibold mb-2">Store Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                    label="Store Name"
                    type="text"
                    value={form.store_name}
                    onChange={e => updateForm({ store_name: e.target.value })}
                    required
                />
                <Input
                    label="Store Address"
                    type="text"
                    value={form.store_address}
                    onChange={e => updateForm({ store_address: e.target.value })}
                    required
                />
                <Input
                    label="Store City"
                    type="text"
                    value={form.store_city}
                    onChange={e => updateForm({ store_city: e.target.value })}
                    required
                />
                <Input
                    label="Store State"
                    type="text"
                    value={form.store_state}
                    onChange={e => updateForm({ store_state: e.target.value })}
                    required
                />
                <Input
                    label="Postal Code"
                    type="text"
                    value={form.store_postal_code}
                    onChange={e => updateForm({ store_postal_code: e.target.value })}
                    required
                />
                <Input
                    label="Latitude"
                    type="text"
                    value={form.store_latitude}
                    onChange={e => updateForm({ store_latitude: e.target.value })}
                />
                <Input
                    label="Longitude"
                    type="text"
                    value={form.store_longitude}
                    onChange={e => updateForm({ store_longitude: e.target.value })}
                />
                <Input
                    label="Delivery Radius (km)"
                    type="number"
                    step="0.01"
                    value={form.delivery_radius}
                    onChange={e => updateForm({ delivery_radius: e.target.value })}
                />
                {/* Accepts Orders radio group */}
                <div className="flex flex-col justify-end">
                    <label className="mb-1 font-medium">Accepts Orders</label>
                    <ToggleButtonGroup
                        options={[
                            { label: "Enable", value: true },
                            { label: "Disable", value: false }
                        ]}
                        value={form.accepts_orders}
                        onChange={val => updateForm({ accepts_orders: val })}
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
                    onChange={e => updateForm({ minimum_order_amount: e.target.value })}
                />
                <Input
                    label="Delivery Fee"
                    type="number"
                    step="0.01"
                    value={form.delivery_fee}
                    onChange={e => updateForm({ delivery_fee: e.target.value })}
                />
                <Input
                    label="Commission Rate (%)"
                    type="number"
                    step="0.01"
                    value={form.commission_rate}
                    onChange={e => updateForm({ commission_rate: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea
                    label="Store Description"
                    rows={10}
                    value={form.store_description}
                    onChange={e => updateForm({ store_description: e.target.value })}
                />
                <Textarea
                    label="Operating Hours (JSON)"
                    rows={10}
                    value={form.operating_hours}
                    onChange={e => updateForm({ operating_hours: e.target.value })}
                />
            </div>
            <Button type="submit" className="mt-6 w-full py-2 px-4 bg-orange-500 text-white font-semibold rounded-lg shadow">
                Save Settings
            </Button>
        </form>
    );
}
