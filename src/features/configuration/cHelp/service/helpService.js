import {
    get,
    post,
    patch,
} from '../../../../services/api/Axios/MethodsGeneral';

export const createHelpReport = async (formData) => {
    try {
        // Para multipart/form-data, pasamos el formData directamente
        const response = await post('help-reports', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMyReports = async () => {
    try {
        const response = await get('help-reports/my-reports');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllReportsAdmin = async () => {
    try {
        const response = await get('help-reports/admin/all');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getReportById = async (id) => {
    try {
        const response = await get(`help-reports/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateHelpReport = async (id, formData) => {
    try {
        // Laravel a veces necesita _method: PATCH en un POST para multipart
        const response = await post(`help-reports/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const resolveReport = async (id, data) => {
    try {
        const response = await patch(`help-reports/${id}/resolve`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
