import { get, put, post, patch } from '../../../../services/api/Axios/MethodsGeneral';

export const createPatient = async (data) => {
  try {
    const response = await post('sendVerifyCode', data);
    return response.data;
  } catch (error) {
    console.error('Error en enviar correo:', error);
    throw error;
  }
};

export const verifyCode = async (code) => {
  try {
    const response = await post('verification', { code });
    return response.data;
  } catch (error) {
    console.error('Error en verificación de código:', error);
    throw error;
  }
};

export const updateProfileEmail = async (email) => {
  try {
    const response = await patch('profile', { email });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el correo:', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const res = await get(`profile`);
    return res.data;
  } catch (error) {
    console.error('Error in getProfile:', error);
    throw error;
  }
};

export const updateAllProfile = async (data) => {
  try {
    const res = await put(`profile`, data);
    return res.data;
  } catch (error) {
    console.error('Error in updateAllProfile:', error);
    throw error;
  }
}