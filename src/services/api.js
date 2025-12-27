// API base URL from environment
import { getToken, clearAuthData } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_URL;

/**
 * Generic API request helper
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...options.headers,
        },
        ...options,
    };

    // Add auth token if available
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, config);

        // Handle 401 Unauthorized - don't auto-redirect, let components handle it
        if (response.status === 401) {
            clearAuthData();
            // Don't use window.location.href - let the component handle the error
            // This allows error messages and toasts to display properly
        }

        // Handle non-JSON responses
        const contentType = response.headers.get("content-type");
        const isJson = contentType && contentType.includes("application/json");
        const data = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            // Handle Laravel validation errors
            if (response.status === 422 && data.errors) {
                const error = new Error("Validation failed");
                error.status = 422;
                error.errors = data.errors;
                error.message = data.message || "Validation failed";
                throw error;
            }

            // Handle server errors (500) with more detail
            if (response.status === 500) {
                console.error("Server Error Details:", data);
                const error = new Error(data.message || "Server error. Please contact support.");
                error.status = 500;
                error.data = data;
                throw error;
            }

            const error = new Error(data.message || `HTTP error ${response.status}`);
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        // Re-throw if it's already a handled error
        if (error.status) throw error;

        // Network or other errors
        console.error("API request failed:", error);
        throw new Error("Network error. Please check your connection.");
    }
}

/**
 * API methods
 */
const api = {
    get: (endpoint, options = {}) =>
        request(endpoint, { method: "GET", ...options }),

    post: (endpoint, data, options = {}) =>
        request(endpoint, {
            method: "POST",
            body: JSON.stringify(data),
            ...options,
        }),

    put: (endpoint, data, options = {}) =>
        request(endpoint, {
            method: "PUT",
            body: JSON.stringify(data),
            ...options,
        }),

    patch: (endpoint, data, options = {}) =>
        request(endpoint, {
            method: "PATCH",
            body: JSON.stringify(data),
            ...options,
        }),

    delete: (endpoint, options = {}) =>
        request(endpoint, { method: "DELETE", ...options }),

    uploadFile: async (endpoint, formData, options = {}) => {
        const url = `${API_BASE_URL}${endpoint}`;

        const config = {
            method: "POST",
            ...options,
        };

        // Important: Don't set Content-Type header - let browser set it with boundary
        const token = getToken();
        if (token) {
            config.headers = {
                Authorization: `Bearer ${token}`,
                ...options.headers,
            };
        }

        try {
            const response = await fetch(url, { body: formData, ...config });

            if (response.status === 401) {
                clearAuthData();
                window.location.href = "/login";
                throw new Error("Session expired. Please log in again.");
            }

            const data = await response.json();

            if (!response.ok) {
                const error = new Error(data.message || `HTTP error ${response.status}`);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (error) {
            if (error.status) throw error;
            console.error("API upload failed:", error);
            throw new Error("Upload failed. Please check your connection.");
        }
    },
};

export async function uploadStoreFile(file, type) {
    // type should be: 'logo', 'banner', or 'document'
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return api.uploadFile('/store/upload', formData);
}

export async function retrieveStoreFiles(type) {
    // type should be: 'logo', 'banner', 'document', or 'all'
    const endpoint = type ? `/store/retrieve?type=${type}` : '/store/retrieve';
    return api.get(endpoint);
}

export default api;
