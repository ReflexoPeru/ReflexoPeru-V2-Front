import { get, post } from "../../../../services/api/Axios/MethodsGeneral";
import instance from '../../../../services/api/Axios/baseConfig';

// Obtener información general de la empresa
export const getSystemInfo = async () => {
    try {
        const response = await get(`company`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

// Actualizar datos de la empresa
export const updateSystemaInfo = async (data) => {
    try {
        const response = await post(`company`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

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
        throw error;
    }
};

// Actualizar el logo de la empresa
export const updateCompanyLogo = async (file) => {
    try {       
        const formData = new FormData();
        formData.append('logo', file);
        const response = await instance.post('company/logo', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}