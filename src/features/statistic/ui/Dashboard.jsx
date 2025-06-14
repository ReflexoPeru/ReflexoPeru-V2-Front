import React, { useState } from 'react';
import { Radio, Button, DatePicker, ConfigProvider, Spin } from 'antd';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import Style from './Statistic.module.css';
import { useStatistic } from '../hook/useStatistic';

const { RangePicker } = DatePicker;

// Configuración del tema
const themeConfig = {
  token: {
    colorPrimary: '#1DB954',
    colorBgBase: '#121212',
    colorTextBase: '#f1f1f1',
    colorBorder: '#393939',
    colorBgContainer: '#1a1a1a',
    colorText: '#f1f1f1',
    colorTextSecondary: '#9CA3AF',
    borderRadius: 8,
    controlHeight: 40,
    fontSize: 14,
  },
  components: {
    Radio: {
      buttonBg: '#2a2a2a',
      buttonColor: '#f1f1f1',
      buttonCheckedBg: '#1DB954',
      buttonCheckedColor: '#121212',
      colorBorder: '#393939',
      buttonPaddingInline: 16,
      fontWeight: 500,
    },
    Button: {
      defaultBg: '#2a2a2a',
      defaultColor: '#f1f1f1',
      defaultBorderColor: '#393939',
      primaryBg: '#1DB954',
      primaryColor: '#121212',
      borderRadius: 8,
      fontWeight: 500,
      paddingInline: 16,
    },
    DatePicker: {
      colorBgContainer: '#2a2a2a',
      colorBorder: '#393939',
      colorText: '#f1f1f1',
      colorTextPlaceholder: '#9CA3AF',
      colorBgElevated: '#1a1a1a',
      colorTextDisabled: '#666666',
      colorBorderSecondary: '#393939',
      controlItemBgHover: '#333333',
      controlItemBgActive: '#1DB954',
      controlItemBgActiveHover: '#1DB954',
      colorPrimary: '#1DB954',
      colorPrimaryHover: '#1ed760',
      colorPrimaryActive: '#1aa34a',
      colorTextHeading: '#f1f1f1',
      colorIcon: '#9CA3AF',
      colorIconHover: '#f1f1f1',
      borderRadius: 8,
      borderRadiusOuter: 8,
      controlHeightLG: 40,
      paddingInline: 12,
    },
    Picker: {
      colorBgContainer: '#2a2a2a',
      colorBorder: '#393939',
      colorText: '#f1f1f1',
      colorTextPlaceholder: '#9CA3AF',
      colorBgElevated: '#1a1a1a',
      colorPrimary: '#1DB954',
      colorPrimaryHover: '#1ed760',
      controlItemBgHover: '#333333',
      controlItemBgActive: '#1DB954',
      colorTextHeading: '#f1f1f1',
      colorIcon: '#9CA3AF',
      colorIconHover: '#f1f1f1',
    },
  },
};

export default function PerformanceDashboard() {
  const [timeFilter, setTimeFilter] = useState('7días');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(6, 'day').startOf('day'),
    dayjs().endOf('day'),
  ]);

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
  } = useStatistic(dateRange[0], dateRange[1]);

  const handleTimeFilterChange = (e) => {
    const value = e.target.value;
    setTimeFilter(value);
    setShowDatePicker(false);

    const today = dayjs().endOf('day');
    let startDate = today;

    switch (value) {
      case '24horas':
        startDate = today.subtract(1, 'day');
        break;
      case '7días':
        startDate = today.subtract(6, 'day').startOf('day');
        break;
      case '28días':
        startDate = today.subtract(27, 'day').startOf('day');
        break;
      case '3meses':
        startDate = today.subtract(2, 'month').startOf('month');
        break;
      case '1año':
        startDate = today.subtract(11, 'month').startOf('month');
        break;
      default:
        return;
    }

    setDateRange([startDate, today]);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange([dates[0].startOf('day'), dates[1].endOf('day')]);
      setTimeFilter('personalizado');
    }
  };

  // Configuración del scroll personalizado
  const scrollbarStyles = {
    scrollbarWidth: 'thin',
    scrollbarColor: '#1DB954 #2a2a2a',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#2a2a2a',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#1DB954',
      borderRadius: '10px',
    },
  };

  // Función para obtener color según rating
  const getRatingColor = (rating) => {
    if (rating >= 4) return '#1DB954'; // Verde
    if (rating >= 2.5) return '#F97316'; // Naranja
    return '#EF4444'; // Rojo
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
        colors: ['#fff'],
      },
      offsetX: 10,
    },
    colors: ['#8B5CF6', '#10B981', '#06B6D4', '#F97316'],
    xaxis: {
      categories: paymentTypes.map((payment) => payment.name),
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px',
        },
        formatter: (val) => val,
      },
      max: 100,
    },
    yaxis: {
      labels: {
        style: {
          colors: '#f1f1f1',
          fontSize: '12px',
          fontWeight: 500,
        },
      },
    },
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      strokeDashArray: 2,
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val) =>
          `${val}% (${formatCurrency(
            paymentTypes.find((p) => p.percentage == val)?.value || 0,
          )})`,
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

  // Función para obtener el subtítulo del rango de fechas
  const getDateRangeSubtitle = () => {
    if (timeFilter === '24horas') return 'Últimas 24 horas';
    if (timeFilter === '7días') return 'Últimos 7 días';
    if (timeFilter === '28días') return 'Últimas 4 semanas';
    if (timeFilter === '3meses') return 'Últimos 3 meses';
    if (timeFilter === '1año') return 'Último año';
    
    // Para rangos personalizados
    const daysDiff = dateRange[1].diff(dateRange[0], 'day');
    if (daysDiff <= 1) return `Día: ${dateRange[0].format('DD MMM YYYY')}`;
    if (daysDiff <= 7) return `Semana: ${dateRange[0].format('DD MMM')} - ${dateRange[1].format('DD MMM YYYY')}`;
    if (daysDiff <= 30) return `Mes: ${dateRange[0].format('MMM')} - ${dateRange[1].format('MMM YYYY')}`;
    if (daysDiff <= 365) return `${dateRange[0].format('MMM YYYY')} - ${dateRange[1].format('MMM YYYY')}`;
    return `${dateRange[0].format('YYYY')} - ${dateRange[1].format('YYYY')}`;
  };

  return (
    <ConfigProvider theme={themeConfig}>
      <div className={Style.dashboardContainer}>
        {/* Filtros superiores */}
        <div className={Style.filterBar}>
          <Radio.Group
            value={timeFilter}
            onChange={handleTimeFilterChange}
            buttonStyle="solid"
            className={Style.timeFilters}
          >
            <Radio.Button value="24horas">24 HORAS</Radio.Button>
            <Radio.Button value="7días">7 DÍAS</Radio.Button>
            <Radio.Button value="28días">28 DÍAS</Radio.Button>
            <Radio.Button value="3meses">3 MESES</Radio.Button>
            <Radio.Button value="1año">1 AÑO</Radio.Button>
          </Radio.Group>

          <Button
            type={showDatePicker ? 'primary' : 'default'}
            onClick={() => setShowDatePicker(!showDatePicker)}
            className={Style.customDateButton}
          >
            Personalizado
          </Button>

          {showDatePicker && (
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              className={Style.datePicker}
              disabledDate={(current) =>
                current && current > dayjs().endOf('day')
              }
              placeholder={['Fecha inicio', 'Fecha fin']}
              format="DD/MM/YYYY"
              allowClear={false}
              size="large"
            />
          )}
        </div>

        {loading ? (
          <div className={Style.loadingContainer}>
            <Spin size="large" />
          </div>
        ) : (
          <>
            {/* Sección de métricas compactas */}
            <div className={Style.compactMetricsSection}>
              <div className={Style.smallMetricCard}>
                <h3 className={Style.metricTitle}>SESIONES TOTALES</h3>
                <div className={Style.metricValue}>
                  {totalSessions.toLocaleString()}
                </div>
              </div>

              <div className={Style.smallMetricCard}>
                <h3 className={Style.metricTitle}>PACIENTES TOTALES</h3>
                <div className={Style.metricValue}>
                  {totalPatients.toLocaleString()}
                </div>
              </div>

              <div className={Style.earningsCard}>
                <h3 className={Style.metricTitle}>GANANCIA TOTAL</h3>
                <div className={Style.earningsValue}>
                  {formatCurrency(totalEarnings)}
                </div>
                <p className={Style.earningsSubtitle}>
                  Acumulado en el período seleccionado
                </p>
              </div>
            </div>

            {/* Gráfico principal con picos */}
            <div className={Style.mainChartSection}>
              <div className={Style.chartHeader}>
                <h3 className={Style.chartTitle}>Indicación de Sesiones</h3>
                <span className={Style.chartSubtitle}>
                  {getDateRangeSubtitle()}
                </span>
              </div>
              <div className={Style.chartContainer}>
                <Chart
                  options={chartOptions}
                  series={chartSeries}
                  type="area"
                  height="100%"
                />
              </div>
            </div>

            {/* Sección inferior con dos columnas */}
            <div className={Style.bottomSection}>
              {/* Distribución de pagos */}
              <div className={Style.paymentSection}>
                <h3 className={Style.sectionTitle}>Distribución de Pagos</h3>
                <p className={Style.sectionSubtitle}>
                  Por métodos de pago (en porcentaje)
                </p>

                <div className={Style.paymentChartContainer}>
                  <Chart
                    options={paymentDistributionOptions}
                    series={paymentDistributionSeries}
                    type="bar"
                    height={280}
                  />
                </div>
              </div>

              {/* Rendimiento de terapeutas */}
              <div className={Style.therapistsSection}>
                <h3 className={Style.sectionTitle}>
                  Rendimiento de Terapeutas
                </h3>
                <p className={Style.sectionSubtitle}>
                  {therapistPerformance.length} terapeutas en el período
                </p>

                <div
                  className={Style.therapistsTableContainer}
                  style={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    ...scrollbarStyles,
                  }}
                >
                  <div className={Style.tableHeader}>
                    <span style={{ flex: '2', minWidth: 0 }}>Terapeuta</span>
                    <span style={{ flex: '0 0 80px', textAlign: 'center' }}>
                      Sesiones
                    </span>
                    <span style={{ flex: '0 0 90px', textAlign: 'center' }}>
                      Ingresos
                    </span>
                    <span style={{ flex: '0 0 70px', textAlign: 'center' }}>
                      Rating
                    </span>
                  </div>

                  {therapistPerformance.map((therapist, index) => (
                    <div
                      key={therapist.id}
                      className={`${Style.tableRow} ${
                        index % 2 === 0 ? Style.evenRow : Style.oddRow
                      }`}
                    >
                      <span
                        style={{
                          flex: '2',
                          minWidth: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        title={therapist.fullName}
                      >
                        {therapist.name}
                      </span>
                      <span
                        style={{
                          flex: '0 0 80px',
                          textAlign: 'center',
                        }}
                      >
                        {therapist.sessions.toLocaleString()}
                      </span>
                      <span
                        style={{
                          flex: '0 0 90px',
                          textAlign: 'center',
                        }}
                      >
                        {formatCurrency(therapist.income)}
                      </span>
                      <span
                        className={Style.rating}
                        style={{
                          flex: '0 0 70px',
                          textAlign: 'center',
                          color: getRatingColor(therapist.rating),
                        }}
                      >
                        {therapist.rating.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ConfigProvider>
  );
}