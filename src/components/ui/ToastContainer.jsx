import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer({ toasts, onClose }) {
    if (toasts.length === 0) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-600" />;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'info':
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200 ${getStyles(toast.type)}`}
                >
                    {getIcon(toast.type)}
                    <span className="text-sm font-medium flex-1 max-w-xs">{toast.message}</span>
                    <button
                        onClick={() => onClose(toast.id)}
                        className="ml-2 hover:opacity-70 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}
