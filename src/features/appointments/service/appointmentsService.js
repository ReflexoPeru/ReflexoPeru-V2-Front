import { post } from '../../../services/api/Axios/MethodsGeneral';

export const createAppointment = async (data) => {
  try {
    const response = await post('appointments', data);
    return response.data;
  } catch (error) {
    console.error('Error en createAppointment:', error);
    throw error;
  }
};
