import { useEffect, useState, useCallback, useRef } from 'react';
import { getSystemInfo } from "../services/systemServices";

export const useSystemHook = () => {
    const [systemInfo, setSystemInfo] = useState({
        data: {
            company_name: '',
            logo_url: '',
            has_logo: false
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const fetchSystemInfo = useCallback(async () => {
        if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        setLoading(true);
        setError(null);

        try {
        const data = await getSystemInfo(signal);
        setSystemInfo(data);
        } catch (err) {
        setError(err);
        console.error('Error fetching system info:', err);
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSystemInfo();
    }, [fetchSystemInfo]);

    return { systemInfo, loading, error, refetch: fetchSystemInfo };
}