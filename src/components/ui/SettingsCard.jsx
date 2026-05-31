import Card from "./Card";

export default function SettingsCard({ children, className = "" }) {
    return (
        <Card transparent className={`border-white/20 rounded-lg ${className}`}>
            {children}
        </Card>
    );
}
