import { useEffect, useState, useCallback, useRef } from 'react';
import { getSystemInfo, getCompanyLogo } from "../services/systemServices";

//CONSIGUE EL LOGO
export const useSystemHook = () => {
    const [logoInfo, setLogoInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const fetchLogo = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
        const logoBlob = await getCompanyLogo(controller.signal);
        setLogoInfo(logoBlob);
        } catch (err) {
        setError(err);
        } finally {
        setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogo();
        return () => abortControllerRef.current?.abort();
    }, [fetchLogo]);

    return { logoInfo, loading, error, refetch: fetchLogo };
};

//CONSIGUE LOS DATOS DE LA EMPRESA
export const useCompanyInfo = () => {
    const [companyInfo, setCompanyInfo] = useState(null);
    const [loadingInfo, setLoadingInfo] = useState(false);
    const [errorInfo, setErrorInfo] = useState(null);

    const fetchCompanyInfo = async () => {
        setLoadingInfo(true);
        setErrorInfo(null);

        try {
        const data = await getSystemInfo();
        setCompanyInfo(data?.data); // <- Asegura que tomas la propiedad `data`
        } catch (err) {
        setErrorInfo(err);
        } finally {
        setLoadingInfo(false);
        }
    };

    useEffect(() => {
        fetchCompanyInfo();
    }, []);

    return {
        companyInfo,
        loadingInfo,
        errorInfo,
        refetchCompanyInfo: fetchCompanyInfo
    };
};