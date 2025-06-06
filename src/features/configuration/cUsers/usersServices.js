import axios from 'axios';
import { get } from '../../../services/api/Axios/MethodsGeneral';

export const getUsers = async () => {
    try {
        const res = await get(`users`);
        console.log('Respuesta de la API:', res.data); // Ver estructura real
        return res.data.data;
    } catch (error) {
        console.error('Error en getUsers:', error);
        throw error;
    }
};