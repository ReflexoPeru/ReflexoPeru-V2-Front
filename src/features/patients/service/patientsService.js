import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/patients';

export const PatientService = {
    getAll: async (page = 1, perPage = 100) => {
        const response = await axios.get(`${API_URL}?page=${page}&per_page=${perPage}`);
        return {
        data: response.data.data, 
        total: response.data.total, 
        };
    },
};