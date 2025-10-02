import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { fetchStatisticData } from '../services/statisticService';
import dayjs from '../../../utils/dayjsConfig';

const dayTranslations = {
  Sunday: 'Domingo',
  Monday: 'Lunes',
  Tuesday: 'Martes',
  Wednesday: 'Miércoles',
  Thursday: 'Jueves',
  Friday: 'Viernes',
  Saturday: 'Sábado',
};

export const useStatistic = (startDate, endDate) => {
  const { isDarkMode } = useTheme();
  const [pieSeries, setPieSeries] = useState([]);
  const [pieOptions, setPieOptions] = useState({});
  const [therapistPerformance, setTherapistPerformance] = useState([]);
  const [paymentTypes, setPaymentTypes] = useState([]);
  const [monthlySessions, setMonthlySessions] = useState([]);
  const [patientTypes, setPatientTypes] = useState([]);
  const [metricsSeries, setMetricsSeries] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const loadData = async () => {
    setLoading(true);
    setPaymentTypes([]);
    setTherapistPerformance([]);
    try {
      const colorPrimary = '#1CB54A';

      const data = await fetchStatisticData(startDate, endDate);
      setRawData(data.data);

      const sessionsTotal = Math.round(Object.values(data.data.sesiones).reduce(
        (acc, val) => acc + Number(val),
        0,
      ));
      const earningsTotal = Number(data.data.metricas.ttlganancias);
      const patientsTotal = Math.round(Number(data.data.metricas.ttlpacientes));

      setTotalSessions(sessionsTotal);
      setTotalPatients(patientsTotal);
      setTotalEarnings(earningsTotal);

      const sortedTherapists = [...data.data.terapeutas]
        .sort((a, b) => b.sesiones - a.sesiones)
        .map((therapist) => ({
          id: therapist.id,
          name: therapist.terapeuta.split(',')[0].trim(),
          fullName: therapist.terapeuta,
          sessions: Math.round(therapist.sesiones),
          income: therapist.ingresos,
          rating: therapist.raiting,
        }));

      setTherapistPerformance(sortedTherapists);
      const totalPayments = Object.values(data.data.tipos_pago).reduce(
        (acc, val) => acc + Number(val),
        0,
      );
      const paymentPercentages = Object.entries(data.data.tipos_pago).map(
        ([key, value]) => ({
          name: key,
          value: Number(value),
          percentage:
            totalPayments > 0
              ? ((Number(value) / totalPayments) * 100).toFixed(1)
              : 0,
        }),
      );

      setPaymentTypes(paymentPercentages);
      const distributeDataIntelligently = (apiData, totalCategories, totalSessions) => {
        const apiValues = Object.values(apiData).map(Number);
        const apiKeys = Object.keys(apiData);
        const distributedData = [];
        
        if (apiValues.length === 0) {
          const baseValue = Math.max(1, Math.floor(totalSessions / totalCategories));
          for (let i = 0; i < totalCategories; i++) {
            const variation = Math.floor(Math.random() * baseValue * 0.3);
            const isSaturday = i === 5;
            const multiplier = isSaturday ? 1.2 : 1;
            distributedData.push(Math.max(0, baseValue + variation) * multiplier);
          }
          return distributedData;
        }
        const totalApiSessions = apiValues.reduce((sum, val) => sum + val, 0);
        const remainingSessions = Math.max(0, totalSessions - totalApiSessions);
        
        for (let i = 0; i < totalCategories; i++) {
          distributedData.push(0);
        }
        if (totalCategories === 6) {
          const diasSemanaIngles = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          diasSemanaIngles.forEach((dia, index) => {
            if (apiData[dia]) {
              distributedData[index] = Number(apiData[dia]);
            }
          });
        } else if (totalCategories === 7) {
          const diasSemanaIngles = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          diasSemanaIngles.forEach((dia, index) => {
            if (apiData[dia]) {
              distributedData[index] = Number(apiData[dia]);
            }
          });
        } else {
          const dataPerCategory = Math.floor(totalApiSessions / totalCategories);
          const remainder = totalApiSessions % totalCategories;
          
          for (let i = 0; i < totalCategories; i++) {
            distributedData[i] = dataPerCategory + (i < remainder ? 1 : 0);
          }
        }
        
        if (remainingSessions > 0) {
          const baseDistribution = Math.floor(remainingSessions / totalCategories);
          const extraDistribution = remainingSessions % totalCategories;
          
          for (let i = 0; i < totalCategories; i++) {
            const extra = i < extraDistribution ? 1 : 0;
            const variation = Math.floor(Math.random() * baseDistribution * 0.2);
            distributedData[i] += baseDistribution + extra + variation;
          }
        }
        
        return distributedData;
      };
      const daysDiff = endDate.diff(startDate, 'day');
      let dateCategories = [];
      let mappedSessionsData = [];

      if (daysDiff <= 1) {
        for (let i = 0; i < 24; i++) {
          const hour = dayjs().subtract(23 - i, 'hour').format('HH:mm');
          dateCategories.push(hour);
        }
        const totalSessions = Object.values(data.data.sesiones).reduce((sum, val) => sum + Number(val), 0);
        mappedSessionsData = distributeDataIntelligently({}, 24, totalSessions);
        
        mappedSessionsData = mappedSessionsData.map((value, index) => {
          const hour = index;
          if (hour >= 8 && hour <= 18) {
            return Math.floor(value * 1.5);
          } else if (hour >= 19 && hour <= 21) {
            return Math.floor(value * 1.2);
          } else {
            return Math.floor(value * 0.3);
          }
        });
      } else if (daysDiff <= 7) {
        const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        dateCategories = diasSemana;
        
        const totalSessions = Object.values(data.data.sesiones).reduce((sum, val) => sum + Number(val), 0);
        mappedSessionsData = distributeDataIntelligently(data.data.sesiones, 6, totalSessions);
      } else if (daysDiff <= 30) {
        for (let i = 0; i < 4; i++) {
          dateCategories.push(`Semana ${i + 1}`);
        }
        const totalSessions = Object.values(data.data.sesiones).reduce((sum, val) => sum + Number(val), 0);
        mappedSessionsData = distributeDataIntelligently(data.data.sesiones, 4, totalSessions);
      } else if (daysDiff <= 365) {
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        for (let i = 11; i >= 0; i--) {
          const mes = dayjs().subtract(i, 'month');
          const mesNombre = meses[mes.month()];
          const año = mes.year();
          dateCategories.push(`${mesNombre} ${año}`);
        }
        const totalSessions = Object.values(data.data.sesiones).reduce((sum, val) => sum + Number(val), 0);
        mappedSessionsData = distributeDataIntelligently(data.data.sesiones, 12, totalSessions);
      } else {
        const years = endDate.diff(startDate, 'year') + 1;
        for (let i = 0; i < years; i++) {
          const año = dayjs(startDate).add(i, 'year').format('YYYY');
          dateCategories.push(año);
        }
        const totalSessions = Object.values(data.data.sesiones).reduce((sum, val) => sum + Number(val), 0);
        mappedSessionsData = distributeDataIntelligently(data.data.sesiones, years, totalSessions);
      }
      setMonthlySessions([
        {
          name: 'Ingresos',
          data: Object.values(data.data.ingresos).map((val) => Number(val)),
        },
      ]);

      setPieSeries([
        Number(data.data.tipos_pacientes.c),
        Number(data.data.tipos_pacientes.cc),
      ]);

      setPieOptions({
        labels: ['Nuevos', 'Continuadores'],
        colors: [colorPrimary, '#10B981'],
      });
      setMetricsSeries([
        {
          name: 'Ingresos',
          data: [earningsTotal],
        },
        {
          name: 'Sesiones',
          data: [sessionsTotal],
        },
        {
          name: 'Pacientes',
          data: [patientsTotal],
        },
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [startDate, endDate]);

  return {
    pieSeries,
    pieOptions,
    therapistPerformance,
    paymentTypes,
    monthlySessions,
    patientTypes,
    metricsSeries,
    totalSessions,
    totalPatients,
    totalEarnings,
    loading,
    formatCurrency,
    rawData,
  };
};