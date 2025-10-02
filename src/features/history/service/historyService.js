import { get, patch, post } from '../../../services/api/Axios/MethodsGeneral';

export const getPatientHistoryById = async (patientId) => {
    try {
        const response = await get(`histories/patient/${patientId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updatePatientHistoryById = async (historyId, data) => {
    try {
        const response = await patch(`histories/${historyId}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getStaff = async (page = 1, perPage = 10) => {
    try {
        const response = await get(`therapists?page=${page}&per_page=${perPage}`);

        let data = [];
        if (response.data) {
        if (Array.isArray(response.data)) {
            data = response.data;
        } else if (Array.isArray(response.data.data)) {
            data = response.data.data;
        } else if (Array.isArray(response.data.items)) {
            data = response.data.items;
        }
    }

    return {
        data,
        total: response.data?.total || data.length || 0,
    };
    } catch (error) {
        throw error;
    }
};

export const createPatientHistory = async (data) => {
    try {
        const response = await post('histories', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const searchStaff = async (term) => {
    try {
        const res = await get(`therapists/search?search=${term}&per_page=100`);
        return { 
        data: Array.isArray(res.data) ? res.data : res.data.items || res.data.data || [],
        total: res.data?.total || 0
        };
    } catch (error) {
        throw error;
    }
};


export const getAppointmentsByPatientId = async (patientId) => {
    try {
        const response = await get(`patients/appoiments/${patientId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateAppointmentById = async (appointmentId, payload) => {
    try {
        const response = await patch(`appointments/${appointmentId}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};