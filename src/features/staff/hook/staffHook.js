import { useState, useEffect } from 'react';
import { getStaff, searchStaff } from '../service/staffService';

export const useStaff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalItems: 0,
    });

    const [searchTerm, setSearchTerm] = useState('');

    const loadStaff = async (page) => {
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
        console.error("Error loading patients:", error);
        } finally {
        setLoading(false);
        }
    };

    const searchStaffByTerm = async (term) => {
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
            console.error("Error searching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStaff(1);
    }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim()) {
                searchStaffByTerm(searchTerm.trim());
            } else {
                loadStaff(1); 
            }
        }, 500); 

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    return {
        staff,
        loading,
        error,
        pagination,
        handlePageChange: loadStaff,
        setSearchTerm,
    };
};