import axios from 'axios';
import { mockData } from '../../../mock/mockData';

export const fetchStatisticData = async (size) => {
  try {
    const response = await axios.get(
      `https://api.example.com/statistics?size=${size}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return mockData[size];
  }
};
