import { useState, useEffect } from 'react';
import { getPatients, searchPatients, createPatient } from '../service/patientsService';
import dayjs from 'dayjs';
import { notification } from 'antd';

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
    if (loading) return;
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
      console.error('Error al cargar pacientes');
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
      console.error('Error al buscar pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialLoad) {
      loadPatients(1);
      setInitialLoad(true);
    }
  }, [initialLoad]);

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
      paternal_lastname: formData.paternal_lastname || formData.paternal_lastName,
      maternal_lastname: formData.maternal_lastname || formData.maternal_lastName,
      name: formData.name,
      personal_reference: formData.personal_reference || null,
      birth_date: formData.birth_date 
        ? dayjs(formData.birth_date).format('YYYY-MM-DD')
        : null,
      sex: formData.sex,
      primary_phone: formData.primary_phone,
      secondary_phone: formData.secondary_phone || null,
      email: formData.email || null,
      ocupation: formData.occupation || null,
      health_condition: null,
      address: formData.address,
      document_type_id: formData.document_type_id,
      country_id: 1,
      region_id: formData.region_id || formData.ubicacion?.region_id || null,
      province_id: formData.province_id || formData.ubicacion?.province_id || null,
      district_id: formData.district_id || formData.ubicacion?.district_id || null
    };

    console.log('Datos del paciente a registrar:', payload);

    try {
      const result = await createPatient(payload);
      notification.success({
        message: 'Éxito',
        description: 'Paciente creado correctamente'
      });
      return result;
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudo crear el paciente'
      });
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