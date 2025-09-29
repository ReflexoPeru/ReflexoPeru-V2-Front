import { get } from '../../../services/api/Axios/MethodsGeneral';
import { mockData } from '../../../mock/mockData';

export const fetchStatisticData = async (start, end) => {
  try {
    const ts = Date.now(); // evitar respuestas de caché del navegador/CDN
    const response = await get(
      `report/statistics?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}&_ts=${ts}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return mockData;
  }
};
