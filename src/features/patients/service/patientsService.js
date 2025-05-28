import axios from 'axios';
import { get } from '../../../services/api/Axios/MethodsGeneral'

export const getPatients = async (page = 1, perPage = 100) => {
    try {
        const response = await get(`patients?page=${page}&per_page=${perPage}`);

        const data = Array.isArray(response.data.data) ? response.data.data : [];

        return {
            data,
            total: response.data.total || data.length || 0,
            status: response.status,
        };
    } catch (error) {
        throw error;
    }
};

export const searchPatients = async (term) => {
    try {
        const res = await get(`patients/search?search=${term}&per_page=100`);
        console.log("🔍 Resultado de búsqueda:", res.data);

        const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [];
        const total = res.data.total || data.length;

        return { data, total };
    } catch (error) {
        console.error("❌ Error en searchPatients:", error);
        throw error;
    }
};