import { createContext, useContext, useState } from 'react';

/**
 * Global toast context for managing notifications across the entire app
 */
const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success', duration = 5000) => {
        const id = Date.now();
        const toast = { id, message, type };
        
        setToasts(prev => [...prev, toast]);
        
        // Auto-dismiss after duration (default 5 seconds for better visibility)
        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
        
        return id;
    };

    const hideToast = (id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    const success = (message, duration) => showToast(message, 'success', duration);
    const error = (message, duration) => showToast(message, 'error', duration);
    const info = (message, duration) => showToast(message, 'info', duration);
    const warning = (message, duration) => showToast(message, 'warning', duration);

    return (
        <ToastContext.Provider
            value={{
                toasts,
                showToast,
                hideToast,
                success,
                error,
                info,
                warning
            }}
        >
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
