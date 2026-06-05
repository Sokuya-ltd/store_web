// Authentication service for managing user sessions and tokens

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const STORE_KEY = "auth_store";
const TOKEN_EXPIRY_KEY = "auth_token_expiry";

// Refresh the token when less than 5 minutes remain
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

/**
 * Store authentication data after successful login
 */
export function setAuthData(response) {
    const { token, store_owner, store_info, expires_in } = response;

    // Store token
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    // Store user/store owner data
    if (store_owner) {
        localStorage.setItem(USER_KEY, JSON.stringify(store_owner));
    }

    // Store store info
    if (store_info) {
        localStorage.setItem(STORE_KEY, JSON.stringify(store_info));
    }

    // Store token expiry time
    if (expires_in) {
        const expiryTime = Date.now() + expires_in * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
}

/**
 * Get the stored auth token
 */
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the current user/store owner data
 */
export function getUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
}

/**
 * Get the store info
 */
export function getStoreInfo() {
    const storeData = localStorage.getItem(STORE_KEY);
    return storeData ? JSON.parse(storeData) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    const token = getToken();
    if (!token) return false;

    // Check if token has expired
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (expiryTime && Date.now() > parseInt(expiryTime)) {
        // Token expired, clear auth data
        clearAuthData();
        return false;
    }

    return true;
}

/**
 * Update stored token and expiry after a refresh
 */
export function updateToken(token, expiresIn) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (expiresIn) {
        const expiryTime = Date.now() + expiresIn * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
    }
}

/**
 * Returns true when the token exists and will expire within REFRESH_BUFFER_MS
 */
export function isTokenExpiringSoon() {
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return false;
    return Date.now() > parseInt(expiryTime) - REFRESH_BUFFER_MS;
}

/**
 * Check if user is verified
 */
export function isVerified() {
    const user = getUser();
    return user?.is_verified === true;
}

/**
 * Check if store is active
 */
export function isStoreActive() {
    const user = getUser();
    return user?.is_active === true;
}

/**
 * Clear all authentication data (logout)
 */
export function clearAuthData() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
}

/**
 * Logout - clear data and optionally call API
 */
export async function logout(api = null) {
    try {
        // Optionally call logout API to invalidate token on server
        if (api) {
            await api.post("/store/logout");
        }
    } catch (error) {
        // Logout error silently handled
    } finally {
        clearAuthData();
    }
}

/**
 * Update user data in storage
 */
export function updateUser(updates) {
    const currentUser = getUser();
    if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
        return updatedUser;
    }
    return null;
}

/**
 * Update store info in storage
 */
export function updateStoreInfo(updates) {
    const currentStore = getStoreInfo();
    if (currentStore) {
        const updatedStore = { ...currentStore, ...updates };
        localStorage.setItem(STORE_KEY, JSON.stringify(updatedStore));
        return updatedStore;
    }
    return null;
}

export default {
    setAuthData,
    getToken,
    getUser,
    getStoreInfo,
    isAuthenticated,
    isTokenExpiringSoon,
    updateToken,
    isVerified,
    isStoreActive,
    clearAuthData,
    logout,
    updateUser,
    updateStoreInfo,
};
