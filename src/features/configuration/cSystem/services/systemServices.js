import { get } from "../../../../services/api/Axios/MethodsGeneral";

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
export const getCompanyLogo = async () => {
    try {
        const response = await get(`company/logo`);
        return response.data;
    } catch (error) {
        console.error("Error fetching company logo:", error);
        throw error;
    }
}