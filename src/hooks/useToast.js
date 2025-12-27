import { useState } from 'react';

/**
 * Global toast notification hook
 * Displays toast messages in the top-right corner
 */
export function useToast() {
    const [toasts, setToasts] = useState([]);

    const showToast = (message, type = 'success', duration = 3000) => {
        const id = Date.now();
        const toast = { id, message, type };
        
        setToasts(prev => [...prev, toast]);
        
        // Auto-dismiss after duration
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

    return {
        toasts,
        showToast,
        hideToast,
        success,
        error,
        info,
        warning
    };
}
