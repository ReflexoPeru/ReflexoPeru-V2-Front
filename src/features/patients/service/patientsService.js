import axios from 'axios';
import { get, post } from '../../../services/api/Axios/MethodsGeneral';

export const getPatients = async (page = 1, perPage = 100) => {
  try {
    const response = await get(`patients?page=${page}&per_page=${perPage}`);

    // Asegurar que siempre trabajamos con un array
    let data = [];
    if (response.data) {
      if (Array.isArray(response.data)) {
        data = response.data;
      } else if (Array.isArray(response.data.data)) {
        data = response.data.data;
      } else if (Array.isArray(response.data.items)) {
        data = response.data.items;
      }
    }

    return {
      data,
      total: response.data?.total || data.length || 0,
      status: response.status,
    };
  } catch (error) {
    console.error('Error en getPatients:', error);
    throw error;
  }
};

export const searchPatients = async (term) => {
  try {
    const res = await get(`patients/search?search=${term}&per_page=100`);
    console.log('🔍 Resultado de búsqueda:', res.data);

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.items || res.data.data || [];
    const total = res.data.total || data.length;

    return { data, total };
  } catch (error) {
    console.error('❌ Error en searchPatients:', error);
    throw error;
  }
};

export const createPatient = async (data) => {
  try {
    const response = await post('patients', data);
    return response.data;
  } catch (error) {
    console.error('Error en createPatient:', error);
    throw error;
  }
};
