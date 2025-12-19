import { useState, useCallback, useEffect } from 'react';
import {
    getMyReports,
    getAllReportsAdmin,
    createHelpReport,
    updateHelpReport,
    resolveReport
} from '../service/helpService';
import { useAuth } from '../../../../routes/AuthContext';

export const useHelpReports = () => {
    const { userRole } = useAuth();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isAdmin = userRole === 1;

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = isAdmin ? await getAllReportsAdmin() : await getMyReports();
            setReports(data || []);
        } catch (err) {
            console.error('Error loading reports:', err);
            setError(err?.response?.data?.message || 'Error al cargar los reportes');
        } finally {
            setLoading(false);
        }
    }, [isAdmin]);

    useEffect(() => {
        loadReports();
    }, [loadReports]);

    const handleCreate = async (formData) => {
        setLoading(true);
        try {
            const res = await createHelpReport(formData);
            await loadReports();
            return res;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, formData) => {
        setLoading(true);
        try {
            const res = await updateHelpReport(id, formData);
            await loadReports();
            return res;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id, resolveData) => {
        setLoading(true);
        try {
            const res = await resolveReport(id, resolveData);
            await loadReports();
            return res;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        reports,
        loading,
        error,
        isAdmin,
        loadReports,
        handleCreate,
        handleUpdate,
        handleResolve
    };
};
