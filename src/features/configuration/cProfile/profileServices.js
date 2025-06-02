import axios from 'axios';
import { get, put } from '../../../services/api/Axios/MethodsGeneral';

export const getProfile = async () => {
    try {
        const res = await get(`profile`);
        return res.data;
    } catch (error) {
        console.error('Error in getProfiles:', error);
        throw error;
    }
};

export const updateProfile = async (data) => {
    try {
        const res = await put(`profile`, data);
        return res.data;
    } catch (error) {
        console.error('Error in updateProfile:', error);
        throw error;
    }
};