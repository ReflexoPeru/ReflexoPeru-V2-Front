import { get, patch, post } from '../../../services/api/Axios/MethodsGeneral';

export const getPatientHistoryById = async (patientId) => {
    try {
        const response = await get(`histories/patient/${patientId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getHistoryById = async (historyId) => {
    try {
        const response = await get(`histories/${historyId}`);
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
        let total = 0;
        
        if (response.data) {
            if (response.data.data && Array.isArray(response.data.data)) {
                data = response.data.data;
                total = response.data.total || 0;
            } else if (Array.isArray(response.data)) {
                data = response.data;
                total = data.length;
            } else if (Array.isArray(response.data.items)) {
                data = response.data.items;
                total = response.data.total || data.length;
            }
        }

        return { data, total };
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


export const searchStaff = async (term, page = 1, perPage = 10) => {
    try {
        const res = await get(`therapists/search?search=${term}&page=${page}&per_page=${perPage}`);
        
        let data = [];
        let total = 0;
        
        if (res.data) {
            if (res.data.data && Array.isArray(res.data.data)) {
                data = res.data.data;
                total = res.data.total || 0;
            } else if (Array.isArray(res.data)) {
                data = res.data;
                total = data.length;
            } else if (Array.isArray(res.data.items)) {
                data = res.data.items;
                total = res.data.total || data.length;
            }
        }
        
        return { data, total };
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