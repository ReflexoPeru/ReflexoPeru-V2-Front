import { get, post, patch, del } from '../../../../services/api/Axios/MethodsGeneral';

// Servicios para métodos anticonceptivos
export const getContraceptiveMethods = async () => {
  try {
    const response = await get('contraceptive-methods');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error en getContraceptiveMethods:', error);
    throw error;
  }
};

export const createContraceptiveMethod = async (data) => {
  try {
    const response = await post('contraceptive-methods', data);
    return response.data;
  } catch (error) {
    console.error('Error en createContraceptiveMethod:', error);
    throw error;
  }
};

export const updateContraceptiveMethod = async (id, data) => {
  try {
    const response = await patch(`contraceptive-methods/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error en updateContraceptiveMethod:', error);
    throw error;
  }
};

export const deleteContraceptiveMethod = async (id) => {
  try {
    const response = await del(`contraceptive-methods/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en deleteContraceptiveMethod:', error);
    throw error;
  }
};

// Servicios para tipos DIU
export const getDiuTypes = async () => {
  try {
    const response = await get('diu-types');
    return response?.data?.data || [];
  } catch (error) {
    console.error('Error en getDiuTypes:', error);
    throw error;
  }
};

export const createDiuType = async (data) => {
  try {
    const response = await post('diu-types', data);
    return response.data;
  } catch (error) {
    console.error('Error en createDiuType:', error);
    throw error;
  }
};

export const updateDiuType = async (id, data) => {
  try {
    const response = await patch(`diu-types/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error en updateDiuType:', error);
    throw error;
  }
};

export const deleteDiuType = async (id) => {
  try {
    const response = await del(`diu-types/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error en deleteDiuType:', error);
    throw error;
  }
};
