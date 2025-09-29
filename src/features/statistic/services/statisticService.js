import { get } from '../../../services/api/Axios/MethodsGeneral';
import { mockData } from '../../../mock/mockData';

export const fetchStatisticData = async (start, end) => {
  try {
    const ts = Date.now();
    console.log('🌐 Debug - Llamando API con fechas:', {
      start: start.format('YYYY-MM-DD'),
      end: end.format('YYYY-MM-DD')
    });
    const response = await get(
      `report/statistics?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}&_ts=${ts}`,
    );
    console.log('🌐 Debug - Respuesta de API:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    console.log('🌐 Debug - Usando datos mock');
    return mockData;
  }
};
