import {
  get,
  post,
  patch,
  del,
} from '../../../services/api/Axios/MethodsGeneral';

export const createAppointment = async (data) => {
  try {
    const response = await post('appointments', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAppointments = async (page = 1, perPage = 50) => {
  try {
    const response = await get(`appointments?page=${page}&per_page=${perPage}`);

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

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.items || res.data.data || [];
    const total = res.data.total || data.length;

    return { data, total };
  } catch (error) {
    throw error;
  }
};

export const getPaginatedAppointmentsByDate = async (date, perPage = 10, page = 1) => {
  try {
    const res = await get(
      `appointments/paginated?per_page=${perPage}&date=${date}&page=${page}`,
    );
    
    // El backend devuelve la estructura con current_page, data, total, etc.
    const data = res.data?.data || [];
    const total = res.data?.total || 0;
    const currentPage = res.data?.current_page || 1;
    const lastPage = res.data?.last_page || 1;

    return { 
      data, 
      total, 
      currentPage, 
      lastPage,
      perPage: res.data?.per_page || perPage
    };
  } catch (error) {
    throw error;
  }
};

export const getAppointmentById = async (id) => {
  try {
    const response = await get(`appointments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const updateAppointment = async (id, data) => {
  try {
    const response = await patch(`appointments/${id}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPatients = async (page = 1, perPage = 10) => {
  try {
    const response = await get(`patients?page=${page}&per_page=${perPage}`);

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
      status: response.status,
    };
  } catch (error) {
    throw error;
  }
};

export const searchPatients = async (term) => {
  try {
    const res = await get(`patients/search?search=${term}&per_page=50`);

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.items || res.data.data || [];
    const total = res.data.total || data.length;

    return { data, total };
  } catch (error) {
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await del(`appointments/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
