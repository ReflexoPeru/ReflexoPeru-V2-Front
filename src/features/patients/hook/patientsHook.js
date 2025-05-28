import { useState, useEffect } from 'react';
import { getPatients, searchPatients } from '../service/patientsService';

export const usePatients = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
    });

    const [searchTerm, setSearchTerm] = useState('');

    const loadPatients = async (page) => {
    setLoading(true);
    try {
        const { data, total } = await getPatients(page);
        setPatients(data);
        setPagination({
            currentPage: page,
            totalItems: total,
        });
        } catch (error) {
        setError(error.message);
        console.error("Error loading patients:", error);
        } finally {
        setLoading(false);
        }
    };

    const searchPatientsByTerm = async (term) => {
        setLoading(true);
        try {
            const { data, total } = await searchPatients(term);
            setPatients(data);
            setPagination({
                currentPage: 1,
                totalItems: total,
            });
        } catch (error) {
            setError(error.message);
            console.error("Error searching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPatients(1);
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                searchPatientsByTerm(searchTerm.trim());
            } else {
                loadPatients(1); 
            }
        }, 500); 

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return {
        patients,
        loading,
        error,
        pagination,
        handlePageChange: loadPatients,
        setSearchTerm,
    };
};