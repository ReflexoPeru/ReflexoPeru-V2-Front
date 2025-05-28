import axios from 'axios';
import { get } from '../../../services/api/Axios/MethodsGeneral'

export const getAppointments = async (page = 1, perPage = 100) => {
    try {
        const response = await get(`appointments?page=${page}&per_page=${perPage}`);

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

export const searchAppointments = async (term) => {
    try {
        const res = await get(`appointments/search?search=${term}&per_page=100`);
        console.log("🔍 Resultado de búsqueda:", res.data);

        const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [];
        const total = res.data.total || data.length;

        return { data, total };
    } catch (error) {
        console.error("❌ Error en searchAppointments:", error);
        throw error;
    }
};

export const getPaginatedAppointmentsByDate = async (date,  perPage = 100) => {
    try {
        const res = await get(`appointments/paginated?per_page=${perPage}&date=${date}`);
        const data = Array.isArray(res.data) ? res.data : res.data.items || res.data.data || []; 
        const total = res.data.total || data.length;

        return { data, total };
    } catch (error) {
        console.error("❌ Error al obtener citas completadas:", error);
        throw error
    }
}