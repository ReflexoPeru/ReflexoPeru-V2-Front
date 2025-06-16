import { useEffect, useState, useCallback, useRef } from 'react';
import { getSystemInfo, getCompanyLogo } from "../services/systemServices";

export const useSystemHook = () => {
    const [companyInfo, setCompanyInfo] = useState(null);
    const [logoInfo, setLogoInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const fetchData = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        setError(null);

        try {
            const [infoResponse, logoResponse] = await Promise.all([
                getSystemInfo(signal),
                getCompanyLogo(signal)
            ]);

            setCompanyInfo(infoResponse.data);
            setLogoInfo(logoResponse.data);
        } catch (err) {
            setError(err);
            console.error('Error fetching company data:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { 
        companyInfo,
        logoInfo,
        loading, 
        error, 
        refetch: fetchData 
    };
};