// useStatistic.js
import { useState, useEffect } from 'react';
import { fetchStatisticData } from '../services/statisticService';

export const useStatistic = () => {
  const [size, setSize] = useState('large');
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);
  const [pieOptions, setPieOptions] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [therapistPerformance, setTherapistPerformance] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [monthlySessions, setMonthlySessions] = useState([]);
  const [patientTypes, setPatientTypes] = useState([]);

  const loadData = async () => {
    const data = await fetchStatisticData(size);
    setChartSeries(data.chartSeries);
    setCategories(data.categories);
    setPieSeries(data.pieSeries);
    setPieOptions(data.pieOptions);
    setChartOptions(data.chartOptions);
    setTherapistPerformance(data.therapistPerformance);
    setPaymentTypes(data.paymentTypes);
    setMonthlySessions(data.monthlySessions);
    setPatientTypes(data.patientTypes);
  };

  useEffect(() => {
    loadData();
  }, [size]);

  return {
    chartSeries,
    categories,
    pieSeries,
    pieOptions,
    chartOptions,
    size,
    setSize,
    therapistPerformance,
    paymentTypes,
    monthlySessions,
    patientTypes,
  };
};
