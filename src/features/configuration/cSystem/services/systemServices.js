import { get, put } from "../../../../services/api/Axios/MethodsGeneral";

export const getSystemInfo = async () => {
    try {
        const response = await get(`company`);
        return response.data;
    } catch (error) {
        console.error("Error fetching system info:", error);
        throw error;
    }
}