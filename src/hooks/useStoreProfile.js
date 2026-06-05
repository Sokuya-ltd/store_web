import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useStoreProfile() {
    const [profile, setProfile] = useState(null);
    const [profileCompletion, setProfileCompletion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get("/store/profile");
            setProfile(response.store_owner);
            if (response.profile_completion) {
                setProfileCompletion(response.profile_completion);
            }
        } catch (err) {
            setError(err.message || "Failed to fetch profile");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, profileCompletion, loading, error, refetch: fetchProfile };
}

export default useStoreProfile;
