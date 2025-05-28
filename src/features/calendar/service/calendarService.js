import { get } from '../../../services/api/Axios/MethodsGeneral';

export const createPatient = async (data) => {
  try {
    const response = await get('calendar', data);
    return response.data;
  } catch (error) {
    console.error('Error en traer los datos:', error);
    throw error;
  }
};
