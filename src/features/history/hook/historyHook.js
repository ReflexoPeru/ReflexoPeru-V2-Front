import { useState, useEffect } from 'react';
import { getStaff, searchStaff, getPatientHistoryById, getAppointmentsByPatientId, updatePatientHistoryById } from '../service/historyService';
import { message } from 'antd';

//DATOS DEL PACIENTE -----------------------------
export const usePatientHistory = (patientId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
        if (!patientId) return;

        setLoading(true);
        try {
            const response = await getPatientHistoryById(patientId);
            setData(response);
        } catch (err) {
            setError(err);
            message.error('Error al cargar el historial del paciente');
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [patientId]);

    return { data, loading, error };
};

//ACTUALIZAR DATOS DE HISTORIA DEL PACIENTE
export const useUpdatePatientHistory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const updateHistory = async (historyId, data) => {
        setLoading(true);
        try {
            await updatePatientHistoryById(historyId, data);
            messageApi.success('Historial actualizado correctamente');
            setError(null);
        } catch (err) {
            console.error('Error actualizando historial:', err);
            setError(err);
            messageApi.error('Error al actualizar el historial');
        } finally {
            setLoading(false);
        }
    };

    return {
        updateHistory,
        loading,
        error,
        contextHolder
    };
};

//DATOS DEL PERSONAL PARA EL MODAL------------------------------
export const useStaff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [initialLoad, setInitialLoad] = useState(false);

    const loadStaff = async (page) => {
        if (loading) return;
        setLoading(true);
        try {
        const { data, total } = await getStaff(page);
        setStaff(data);
        setPagination({
            currentPage: page,
            totalItems: total,
        });
        } catch (error) {
        setError(error.message);
        console.error('Error loading staff:', error);
        } finally {
        setLoading(false);
        }
    };

    const searchStaffByTerm = async (term) => {
        if (loading) return;
        setLoading(true);
        try {
        const { data, total } = await searchStaff(term);
        setStaff(data);
        setPagination({
            currentPage: 1,
            totalItems: total,
        });
        } catch (error) {
        setError(error.message);
        console.error('Error searching staff:', error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialLoad) {
        loadStaff(1);
        setInitialLoad(true);
        }
    }, [initialLoad]);

    useEffect(() => {
        if (!initialLoad) return;

        const delayDebounce = setTimeout(() => {
        if (searchTerm.trim()) {
            searchStaffByTerm(searchTerm.trim());
        } else {
            loadStaff(1);
        }
        }, 1000);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, initialLoad]);

    return {
        staff,
        loading,
        error,
        pagination,
        setSearchTerm,
        handlePageChange: loadStaff,
    };
};

// DATOS DE LAS CITAS DEL PACIENTE -----------------------------
export const usePatientAppointments = (patientId) => {
    const [appointments, setAppointments] = useState([]);
    const [lastAppointment, setLastAppointment] = useState(null);
    const [loadingAppointments, setLoading] = useState(false);
    const [appointmentsError, setError] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        if (!patientId) return;

        const fetchAppointments = async () => {
            setLoading(true);
            try {
                const response = await getAppointmentsByPatientId(patientId);
                // Ordenar citas por fecha descendente
                const sortedAppointments = [...response].sort((a, b) => 
                    new Date(b.appointment_date) - new Date(a.appointment_date)
                );
                setAppointments(sortedAppointments);
                // Establecer la última cita (primera del array ordenado)
                setLastAppointment(sortedAppointments[0] || null);
                setError(null);
            } catch (error) {
                console.error('Error al cargar las citas del paciente:', error);
                setAppointments([]);
                setLastAppointment(null);
                setError(error);
                messageApi.error('Error al cargar las citas del paciente');
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [patientId]);

    return {
        appointments,
        lastAppointment,
        loadingAppointments,
        appointmentsError,
        contextHolder
    };
}