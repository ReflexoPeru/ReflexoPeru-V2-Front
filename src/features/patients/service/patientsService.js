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
    throw error;
  }
};

export const updatePatient = async (patientId, patientData) => {
  try {
    const response = await patch(`patients/${patientId}`, patientData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

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
    throw error;
  }
};

export const createPatient = async (data) => {
  try {
    const response = await post('patients', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deletePatient = async (patientId) => {
  try {
    const response = await del(`patients/${patientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatientById = async (patientId) => {
  try {
    const response = await get(`patients/${patientId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchPatientByDNI = async (dni) => {
  try {
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6Imx1Znl5c29tYnJlcm85QGdtYWlsLmNvbSJ9.cgLa5kyCUjAqATyDiaPemz7uc615fFmK2aiWXymrwNc';
    const response = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`);
    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        data: {
          dni: dni,
          name: data.nombres || '',
          paternal_lastname: data.apellidoPaterno || '',
          maternal_lastname: data.apellidoMaterno || '',
        }
      };
    } else {
      return {
        success: false,
        message: data.message || 'No se encontraron datos para este DNI'
      };
    }
  } catch (error) {
    console.error('Error en búsqueda DNI:', error);
    return {
      success: false,
      message: 'Error al consultar el DNI. Intente nuevamente.'
    };
  }
};
