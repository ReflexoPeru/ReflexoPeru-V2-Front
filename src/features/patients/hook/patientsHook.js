import { useState, useEffect } from 'react';
import { getPatients, searchPatients } from '../service/patientsService';
import { createPatient } from '../service/patientsService';
import { format } from 'date-fns';

export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalItems: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [initialLoad, setInitialLoad] = useState(false);

  const loadPatients = async (page) => {
    if (loading) return; // Evitar llamadas duplicadas
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
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchPatientsByTerm = async (term) => {
    if (loading) return;
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
      console.error('Error searching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial solo una vez
  useEffect(() => {
    if (!initialLoad) {
      loadPatients(1);
      setInitialLoad(true);
    }
  }, [initialLoad]);

  // Búsqueda con debounce mejorado
  useEffect(() => {
    if (!initialLoad) return;

    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        searchPatientsByTerm(searchTerm.trim());
      } else {
        loadPatients(1);
      }
    }, 1200);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, initialLoad]);

  const submitNewPatient = async (formData) => {
    const payload = {
      document_number: formData.document_number,
      paternal_lastname: formData.paternal_lastname,
      maternal_lastname: formData.maternal_lastname,
      name: formData.name,
      personal_reference: null,
      birth_date: formData.birth_date
        ? format(new Date(formData.birth_date), 'yyyy-MM-dd')
        : null,
      sex: formData.sex,
      primary_phone: formData.primary_phone,
      secondary_phone: null,
      email: formData.email,
      ocupation: formData.occupation || null,
      health_condition: null,
      address: formData.address,
      document_type_id: formData.document_type,
      country_id: 1,
      region_id: formData.region_id,
      province_id: formData.province_id || null,
      district_id: formData.district_id || null,
    };

    try {
      const result = await createPatient(payload);
      return result;
    } catch (error) {
      console.error('Error al enviar datos del paciente:', error);
      throw error;
    }
  };
  return {
    patients,
    loading,
    submitNewPatient,
    error,
    pagination,
    handlePageChange: loadPatients,
    setSearchTerm,
  };
};
