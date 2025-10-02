import { get } from '../../../services/api/Axios/MethodsGeneral';

export const searchAppointmentsComplete = async (term) => {
  try {
    const res = await get(
      `appointments/completed/search?search=${term}&per_page=100`,
    );

    const data = Array.isArray(res.data)
      ? res.data
      : res.data.items || res.data.data || [];
    const total = res.data.total || data.length;

    return { data, total };
  } catch (error) {
    throw error;
  }
};

export const getPaginatedAppointmentsCompleteByDate = async (date, perPage = 10, page = 1) => {
  try {
    const res = await get(
      `appointments/completed?per_page=${perPage}&date=${date}&page=${page}`,
    );
    
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
