import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import auth from "../services/auth";
import api, { refreshApiToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [storeInfo, setStoreInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = () => {
            if (auth.isAuthenticated()) {
                setUser(auth.getUser());
                setStoreInfo(auth.getStoreInfo());
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    // Proactive token refresh: runs every 60s while user is logged in.
    // Catches the case where the user is idle (no API calls) but the token
    // is about to expire (< 5 min remaining in the 60-min window).
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(async () => {
            if (!auth.isAuthenticated()) {
                // Token hard-expired with no refresh possible
                setUser(null);
                setStoreInfo(null);
                navigate("/login", { replace: true });
                return;
            }

            if (auth.isTokenExpiringSoon()) {
                try {
                    await refreshApiToken();
                } catch {
                    // refreshApiToken already redirected; sync React state
                    setUser(null);
                    setStoreInfo(null);
                }
            }
        }, 60_000); // check every minute

        return () => clearInterval(interval);
    }, [user, navigate]);

    // Login handler
    const login = useCallback((response) => {
        auth.setAuthData(response);
        setUser(response.store_owner);
        setStoreInfo(response.store_info);
    }, []);

    // Logout handler
    const logout = useCallback(async () => {
        await auth.logout(api);
        setUser(null);
        setStoreInfo(null);
        navigate("/login", { replace: true });
    }, [navigate]);

    // Update user data
    const updateUser = useCallback((updates) => {
        const updatedUser = auth.updateUser(updates);
        if (updatedUser) {
            setUser(updatedUser);
        }
    }, []);

    // Update store info
    const updateStore = useCallback((updates) => {
        const updatedStore = auth.updateStoreInfo(updates);
        if (updatedStore) {
            setStoreInfo(updatedStore);
        }
    }, []);

    // Check if authenticated
    const isAuthenticated = auth.isAuthenticated();

    const value = {
        user,
        storeInfo,
        isLoading,
        isAuthenticated,
        login,
        logout,
        updateUser,
        updateStore,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook to use auth context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

export default AuthContext;
