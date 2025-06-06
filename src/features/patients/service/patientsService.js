import { get, post } from '../../../services/api/Axios/MethodsGeneral';

export const getPatients = async (page = 1, perPage = 100) => {
  try {
    const response = await get(`patients?page=${page}&per_page=${perPage}`);

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
    console.error('Error al obtener pacientes');
    throw error;
  }
};

export const searchPatients = async (term) => {
  try {
    const res = await get(`patients/search?search=${term}&per_page=100`);
    return { 
      data: Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [],
      total: res.data.total || data.length 
    };
  } catch (error) {
    console.error('Error al buscar pacientes');
    throw error;
  }
};

export const createPatient = async (data) => {
  try {
    console.log('Datos enviados para crear paciente:');
    const response = await post('patients', data);
    console.log('Paciente creado exitosamente');
    return response.data;
  } catch (error) {
    console.error('Error al crear paciente');
    throw error;
  }
};