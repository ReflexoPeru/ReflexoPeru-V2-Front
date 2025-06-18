import { get } from "../../../../services/api/Axios/MethodsGeneral";
import instance from '../../../../services/api/Axios/baseConfig';
import axios from 'axios'; 

// Obtener información general de la empresa
export const getSystemInfo = async () => {
    try {
        const response = await get(`company`);
        return response.data;
    } catch (error) {
        console.error("Error fetching system info:", error);
        throw error;
    }
}

// Obtener solo el logo de la empresa
export const getCompanyLogo = async (signal) => {
    try {
        const response = await instance.get('company/logo', {
            responseType: 'blob',
            headers: {
                'Cache-Control': 'no-cache' // ⛔ Evita caché del navegador
            },
            signal
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching company logo:", error);
        throw error;
    }
};