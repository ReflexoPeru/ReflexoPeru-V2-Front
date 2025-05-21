// useStatistic.js
import { useState, useEffect } from 'react';
import { fetchStatisticData } from '../services/statisticService';

export const useStatistic = () => {
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
    const start = '2024-01-01';
    const end = '2024-12-01';

    const data = await fetchStatisticData(start, end);

    // Map the API response data to state variables
    setTherapistPerformance(
      data.data.terapeutas.map((therapist) => ({
        name: therapist.terapeuta,
        data: [therapist.sesiones, therapist.ingresos, therapist.raiting],
      })),
    );

    setPaymentTypes(Object.values(data.data.tipos_pago));

    setMonthlySessions([
      {
        name: 'Ingresos',
        data: Object.values(data.data.ingresos).map(Number),
      },
    ]);

    setChartSeries([
      {
        name: 'Sesiones',
        data: Object.values(data.data.sesiones).map(Number),
      },
    ]);

    setCategories(Object.keys(data.data.sesiones));

    setPieSeries([
      {
        name: 'Nuevo',
        data: [Number(data.data.tipos_pacientes.cc)],
      },
      {
        name: 'Continuador',
        data: [Number(data.data.tipos_pacientes.cc)],
      },
    ]);

    setPieOptions({
      labels: Object.keys(data.data.tipos_pacientes),
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  return {
    chartSeries,
    categories,
    pieSeries,
    pieOptions,
    chartOptions,
    therapistPerformance,
    paymentTypes,
    monthlySessions,
    patientTypes,
  };
};
