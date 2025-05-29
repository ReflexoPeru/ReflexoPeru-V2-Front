import axios from 'axios';
import { get } from '../../../services/api/Axios/MethodsGeneral';

export const getUsers = async () => {
    try {
        const res = await get(`users`);
        return res.data;
    } catch (error) {
        console.error('Error en getUsers:', error);
        throw error;
    }
};