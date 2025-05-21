import { useState, useEffect } from 'react';
import { fetchStatisticData } from '../services/statisticService';

export const useStatistic = (startDate, endDate) => {
  const [chartSeries, setChartSeries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pieSeries, setPieSeries] = useState([]);
  const [pieOptions, setPieOptions] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [therapistPerformance, setTherapistPerformance] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [monthlySessions, setMonthlySessions] = useState([]);
  const [patientTypes, setPatientTypes] = useState([]);
  const [metricsSeries, setMetricsSeries] = useState([]);

  const loadData = async () => {
    const data = await fetchStatisticData(startDate, endDate);

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
        data: [Number(data.data.tipos_pacientes.c)],
      },
      {
        name: 'Continuador',
        data: [Number(data.data.tipos_pacientes.cc)],
      },
    ]);

    setPieOptions({
      labels: Object.keys(data.data.tipos_pacientes),
    });

    setMetricsSeries([
      {
        name: 'Ingresos',
        data: [Number(data.data.metricas.ttlganancias)],
      },
      {
        name: 'Sesiones',
        data: [Number(data.data.metricas.ttlpacientes)],
      },

      {
        name: 'Pacientes',
        data: [Number(data.data.metricas.ttlsesiones)],
      },
    ]);
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

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
    metricsSeries,
  };
};
