import { useState, useEffect } from 'react';
import { PatientService } from '../service/patientsService';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 100; // Define el mismo valor que en tu tabla

    const loadData = async (page = 1) => {
        setLoading(true);
        try {
        const { data, total } = await PatientService.getAll(page, pageSize);
        setPatients(data);
        setTotalItems(total);
        } catch (error) {
        console.error('Error al cargar pacientes:', error);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        loadData(page);
    };

    return {
        patients,
        loading,
        totalItems,
        currentPage,
        pageSize,
        handlePageChange,
    };
};