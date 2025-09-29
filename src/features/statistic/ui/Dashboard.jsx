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
import SkeletonLoading from './SkeletonLoading';
import ChartSkeleton from './ChartSkeleton';
import SessionsLineChart from '../../../components/charts/SessionsLineChart';
import { ChartRange } from '../../../constants/chartRanges';
import { Spin } from 'antd';
import { useTheme } from '../../../context/ThemeContext';

export default function PerformanceDashboard() {
  const { isDarkMode } = useTheme();
  const [timeFilter, setTimeFilter] = useState('7días');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState(() => {
    const today = dayjs();
    const monday = today.startOf('week').startOf('day');
    const saturday = monday.add(5, 'day').endOf('day');
    return [monday, saturday];
  });
  
  const { isVisible, animationClass } = usePageAnimation('fade', 50);

  const {
    pieSeries,
    pieOptions,
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

  // Debug logs
  console.log('📊 Dashboard Debug:', {
    loading,
    hasRawData: !!rawData,
    rawDataKeys: rawData ? Object.keys(rawData) : [],
    rawDataStructure: rawData,
    totalSessions,
    totalPatients,
    totalEarnings
  });

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
    const monday = today.startOf('week').startOf('day');
    const saturday = monday.add(5, 'day').endOf('day');
    let startDate = monday;
    let endDate = saturday;
    switch (value) {
      case '24horas':
        startDate = today.subtract(1, 'day').startOf('day');
        endDate = today.endOf('day');
        break;
      case '7días':
        startDate = monday;
        endDate = saturday;
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
  const getRatingColor = (rating) => {
    if (rating >= 4) return '#52c41a';
    if (rating >= 2.5) return '#faad14';
    return '#EF4444';
  };

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
        colors: ['#333333'],
      },
      offsetX: 10,
    },
    colors: ['#1CB54A', '#52c41a', '#1890ff', '#faad14'],
    xaxis: {
      categories: paymentTypes.map((payment) => payment.name),
      labels: {
        style: {
          colors: ['#666666'],
          fontSize: '11px',
        },
        formatter: (val) => val,
      },
      max: 100,
    },
    yaxis: {
      labels: {
        style: {
          colors: ['#333333'],
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    grid: {
      borderColor: '#e0e0e0',
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
        <DashboardMetrics
          totalSessions={totalSessions}
          totalPatients={totalPatients}
          totalEarnings={totalEarnings}
          formatCurrency={formatCurrency}
          Style={Style}
          dateRangeSubtitle={getDateRangeSubtitle()}
        />
        
        {loading ? (
          <ChartSkeleton />
        ) : (
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
        )}
        
        {loading ? (
          <SkeletonLoading />
        ) : (
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
        )}
      </div>
  );
}
