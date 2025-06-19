import { useEffect, useState, useCallback, useRef } from 'react';
import { getSystemInfo, getCompanyLogo, updateSystemaInfo, updateCompanyLogo } from "../services/systemServices";

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

//ACTUALIZA EL LOGO
export const useUploadCompanyLogo = () => {
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    const uploadLogo = async (file) => {
        setUploadingLogo(true);
        setUploadError(null);
        setUploadSuccess(false);

        try {
        await updateCompanyLogo(file);
        setUploadSuccess(true);
        } catch (err) {
        setUploadError(err);
        } finally {
        setUploadingLogo(false);
        }
    };

    return { uploadLogo, uploadingLogo, uploadError, uploadSuccess };
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

//ACTUALIZA LOS DATOS DE LA EMPRESA
export const useUpdateCompanyInfo = () => {
    const [updating, setUpdating] = useState(false); 
    const [updateError, setUpdateError] = useState(null);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const updateCompany = async (newData) => {
        setUpdating(true);
        setUpdateError(null);
        setUpdateSuccess(false);

        try {
            await updateSystemaInfo(newData);
            setUpdateSuccess(true);
        } catch (error) {
            setUpdateError(error);
        } finally {
            setUpdating(false);
        }
    };

    return {
        updateCompany,       // función para llamar desde tu componente
        updating,            // estado booleano mientras actualiza
        updateError,         // error si falla
        updateSuccess        // booleano si fue exitoso
    };
}