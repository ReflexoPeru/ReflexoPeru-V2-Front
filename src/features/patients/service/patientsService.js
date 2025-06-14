import {
  del,
  get,
  post,
  patch,
} from '../../../services/api/Axios/MethodsGeneral';

export const getPatients = async (page = 1, perPage = 50) => {
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
    };
  } catch (error) {
    console.error('Error obteniendo pacientes:', error);
    throw error;
  }
};

//==============================================================================
export const updatePatient = async (patientId, patientData) => {
  try {
    const response = await patch(`patients/${patientId}`, patientData);
    return response.data;
  } catch (error) {
    console.error('Error actualizando paciente:', error);
    throw error;
  }
};
//==============================================================================

export const searchPatients = async (term) => {
  try {
    const res = await get(`patients/search?search=${term}&per_page=100`);
    return {
      data: Array.isArray(res.data)
        ? res.data
        : res.data.items || res.data.data || [],
      total: res.data?.total || 0,
    };
  } catch (error) {
    console.error('Error buscando pacientes:', error);
    throw error;
  }
};

export const createPatient = async (data) => {
  try {
    const response = await post('patients', data);
    return response.data;
  } catch (error) {
    console.error('Error creando paciente:', error);
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await del(`patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error eliminando paciente:', error);
    throw error;
  }
};

export const getPatientById = async (patientId) => {
  try {
    const response = await get(`patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo paciente por ID:', error);
    throw error;
  }
};
