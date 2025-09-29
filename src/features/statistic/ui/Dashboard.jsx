import React, { useState } from 'react';
import { usePageAnimation } from '../../../hooks/usePageAnimation';
import dayjs from '../../../utils/dayjsConfig';
import Chart from 'react-apexcharts';
import Style from './Statistic.module.css';
import './StatisticOverrides.css';
import { useStatistic } from '../hook/useStatistic';
import DashboardFilters from './DashboardFilters';
import DashboardMetrics from './DashboardMetrics';
import DashboardBottomSection from './DashboardBottomSection';
import SessionsLineChart from '../../../components/charts/SessionsLineChart';
import { ChartRange } from '../../../constants/chartRanges';
import { Spin } from 'antd';
import { useTheme } from '../../../context/ThemeContext';

// Usar configuración de tema global y solo ajustar mínimos si hace falta

export default function PerformanceDashboard() {
  const { antdTheme, isDarkMode } = useTheme();

  // Utilidad para obtener variables CSS del tema actual
  const getCssVar = (name) =>
    typeof window !== 'undefined'
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : '';

  const colorPrimary = getCssVar('--color-primary') || '#1CB54A';
  const colorSuccess = getCssVar('--color-success') || '#52c41a';
  const colorWarning = getCssVar('--color-warning') || '#faad14';
  const colorInfo = getCssVar('--color-info') || '#1890ff';
  const colorTextPrimary = getCssVar('--color-text-primary') || '#333333';
  const colorTextSecondary = getCssVar('--color-text-secondary') || '#666666';
  const colorBorderPrimary = getCssVar('--color-border-primary') || '#e0e0e0';
  const colorBgSecondary = getCssVar('--color-background-secondary') || '#f8f9fa';
  const [timeFilter, setTimeFilter] = useState('7días');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const today = dayjs();
    const weekday = today.day(); // 0=Dom,1=Lun,...6=Sáb
    const monday = today.subtract((weekday + 6) % 7, 'day').startOf('day');
    const saturday = monday.add(5, 'day').endOf('day');
    return [monday, saturday];
  });
  
  // Animaciones
  const { isVisible, animationClass } = usePageAnimation('fade', 50);

  const {
    chartSeries,
    categories,
    pieSeries,
    pieOptions,
    chartOptions,
    therapistPerformance,
    paymentTypes,
    monthlySessions,
    totalSessions,
    totalPatients,
    totalEarnings,
    loading,
    formatCurrency,
    rawData
  } = useStatistic(dateRange[0], dateRange[1]);

  // Función para mapear filtros de tiempo a rangos de Tremor
  const mapTimeFilterToChartRange = (filter) => {
    switch (filter) {
      case '7días':
        return ChartRange.WEEK;
      case '28días':
        return ChartRange.MONTH;
      case '3meses':
        return ChartRange.THREE_MONTHS;
      case '1año':
        return ChartRange.YEAR;
      default:
        return ChartRange.CUSTOM;
    }
  };

  const handleTimeFilterChange = (e) => {
    const value = e.target.value;
    setTimeFilter(value);
    setShowDatePicker(false);
    const today = dayjs();
    const weekday = today.day(); // 0=Dom,1=Lun,...6=Sáb
    const monday = today.subtract((weekday + 6) % 7, 'day').startOf('day');
    const saturday = monday.add(5, 'day').endOf('day');
    let startDate = monday;
    let endDate = saturday;
    switch (value) {
      case '24horas':
        startDate = today.subtract(1, 'day').startOf('day');
        endDate = today.endOf('day');
        break;
      case '7días':
        // Lunes a Sábado de la semana actual
        startDate = startOfWeekMonday;
        endDate = endOfSaturday;
        break;
      case '28días':
        startDate = today.endOf('day').subtract(27, 'day').startOf('day');
        endDate = today.endOf('day');
        break;
      case '3meses':
        startDate = today.subtract(2, 'month').startOf('month');
        endDate = today.endOf('day');
        break;
      case '1año':
        startDate = today.subtract(11, 'month').startOf('month');
        endDate = today.endOf('day');
        break;
      default:
        return;
    }
    setDateRange([startDate, endDate]);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange([dates[0].startOf('day'), dates[1].endOf('day')]);
      setTimeFilter('personalizado');
    }
  };

  // Scrollbar personalizado usando clases CSS

  // Color según rating
  const getRatingColor = (rating) => {
    if (rating >= 4) return colorSuccess || colorPrimary;
    if (rating >= 2.5) return colorWarning;
    return '#EF4444';
  };

  // Configuración del gráfico de distribución de pagos
  const paymentDistributionOptions = {
    chart: {
      type: 'bar',
      height: 280,
      toolbar: { show: false },
      background: 'transparent',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 6,
        distributed: true,
        barHeight: '60%',
      },
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => `${val}%`,
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: [colorTextPrimary],
      },
      offsetX: 10,
    },
    colors: [colorPrimary, colorSuccess, colorInfo, colorWarning],
    xaxis: {
      categories: paymentTypes.map((payment) => payment.name),
      labels: {
        style: {
          colors: colorTextSecondary,
          fontSize: '11px',
        },
        formatter: (val) => val,
      },
      max: 100,
    },
    yaxis: {
      labels: {
        style: {
          colors: colorTextPrimary,
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    grid: {
      borderColor: colorBorderPrimary,
      strokeDashArray: 2,
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      y: {
        formatter: (val) =>
          `${val}% (${formatCurrency(paymentTypes.find((p) => p.percentage == val)?.value || 0)})`,
      },
    },
    legend: { show: false },
  };

  const paymentDistributionSeries = [
    {
      name: 'Porcentaje',
      data: paymentTypes.map((payment) => parseFloat(payment.percentage)),
    },
  ];

  // Subtítulo del rango de fechas
  const getDateRangeSubtitle = () => {
    if (timeFilter === '24horas') return 'Últimas 24 horas';
    if (timeFilter === '7días') return 'Últimos 7 días';
    if (timeFilter === '28días') return 'Últimas 4 semanas';
    if (timeFilter === '3meses') return 'Últimos 3 meses';
    if (timeFilter === '1año') return 'Último año';
    const daysDiff = dateRange[1].diff(dateRange[0], 'day');
    if (daysDiff <= 1) return `Día: ${dateRange[0].format('DD MMM YYYY')}`;
    if (daysDiff <= 7)
      return `Semana: ${dateRange[0].format('DD MMM')} - ${dateRange[1].format('DD MMM YYYY')}`;
    if (daysDiff <= 30)
      return `Mes: ${dateRange[0].format('MMM')} - ${dateRange[1].format('MMM YYYY')}`;
    if (daysDiff <= 365)
      return `${dateRange[0].format('MMM YYYY')} - ${dateRange[1].format('MMM YYYY')}`;
    return `${dateRange[0].format('YYYY')} - ${dateRange[1].format('YYYY')}`;
  };

  return (
    <div className={`${Style.dashboardContainer} animate-fade-in ${isVisible ? animationClass : ''}`}>
        <DashboardFilters
          timeFilter={timeFilter}
          handleTimeFilterChange={handleTimeFilterChange}
          showDatePicker={showDatePicker}
          setShowDatePicker={setShowDatePicker}
          dateRange={dateRange}
          handleDateRangeChange={handleDateRangeChange}
          Style={Style}
          dayjs={dayjs}
        />
        {loading ? (
          <div className={Style.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            <DashboardMetrics
              totalSessions={totalSessions}
              totalPatients={totalPatients}
              totalEarnings={totalEarnings}
              formatCurrency={formatCurrency}
              Style={Style}
            />
            
            <SessionsLineChart
              data={rawData}
              range={mapTimeFilterToChartRange(timeFilter)}
              startDate={dateRange[0]}
              endDate={dateRange[1]}
              title="Indicación de Sesiones"
              subtitle={getDateRangeSubtitle()}
              isDarkMode={isDarkMode}
              height={400}
            />
            <DashboardBottomSection
              key={`bottom-${dateRange[0].valueOf()}-${dateRange[1].valueOf()}`}
              Style={Style}
              paymentDistributionOptions={paymentDistributionOptions}
              paymentDistributionSeries={paymentDistributionSeries}
              Chart={Chart}
              therapistPerformance={therapistPerformance}
              formatCurrency={formatCurrency}
              getRatingColor={getRatingColor}
            />
          </>
        )}
      </div>
  );
}
