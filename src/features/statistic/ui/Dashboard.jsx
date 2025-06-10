import React, { useState } from 'react';
import { Radio, Button, DatePicker, ConfigProvider } from 'antd';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import Style from './Statistic.module.css';

const { RangePicker } = DatePicker;

// Configuración del tema premium mejorada
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
    dayjs().subtract(6, 'week'),
    dayjs(),
  ]);

  // Datos de ejemplo con picos pronunciados
  const metrics = {
    sessions: 324,
    patients: 262,
    payments: {
      total: 6324,
      yape: 4237,
      efectivo: 1582,
      transferencia: 505,
      cupon: 0,
    },
    therapists: [
      { name: 'LOPEZ MARILLO, JOSEL', sessions: 22, income: 1100, rating: 4.2 },
      {
        name: 'OLISPE GAMBOA, NICOLASA VILLA',
        sessions: 20,
        income: 1100,
        rating: 4.0,
      },
      { name: 'GUTIERREZ, MARIA', sessions: 18, income: 950, rating: 4.5 },
      { name: 'RODRIGUEZ, CARLOS', sessions: 15, income: 800, rating: 4.1 },
      { name: 'PEREZ, ANA', sessions: 12, income: 700, rating: 3.9 },
    ],
    // Datos con picos más pronunciados como en la imagen
    sessionData: [85, 88, 92, 89, 95, 40, 18],
  };

  // Configuración del gráfico con área y picos pronunciados
  const sessionChartOptions = {
    chart: {
      type: 'area',
      height: '100%',
      toolbar: { show: false },
      zoom: { enabled: false },
      background: 'transparent',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
      colors: ['#1DB954'],
    },
    markers: {
      size: 5,
      colors: ['#1DB954'],
      strokeWidth: 2,
      strokeColors: '#1DB954',
      hover: {
        size: 8,
        sizeOffset: 3,
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        type: 'vertical',
        opacityFrom: 0.8,
        opacityTo: 0.1,
        colorStops: [
          {
            offset: 0,
            color: '#1DB954',
            opacity: 0.8,
          },
          {
            offset: 50,
            color: '#1DB954',
            opacity: 0.4,
          },
          {
            offset: 100,
            color: '#1DB954',
            opacity: 0.1,
          },
        ],
      },
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px',
          fontWeight: 500,
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px',
        },
        formatter: (val) => Math.floor(val),
      },
      min: 0,
      max: 100,
    },
    colors: ['#1DB954'],
    grid: {
      borderColor: 'rgba(255, 255, 255, 0.08)',
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: {
        top: 10,
        bottom: 10,
        left: 10,
        right: 10,
      },
    },
    tooltip: {
      theme: 'dark',
      style: {
        fontSize: '12px',
      },
      x: {
        show: true,
      },
      y: {
        formatter: (val) => `${val} sesiones`,
      },
      marker: {
        show: true,
      },
    },
    dataLabels: { enabled: false },
  };

  // Configuración del gráfico de distribución de pagos con colores específicos
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
      formatter: (val) => `S/ ${val.toLocaleString()}`,
      style: {
        fontSize: '11px',
        fontWeight: 'bold',
        colors: ['#fff'],
      },
      offsetX: 10,
    },
    // Colores específicos: Yape (morado), Efectivo (verde), Transferencia (celeste), Cupón (naranja)
    colors: ['#8B5CF6', '#10B981', '#06B6D4', '#F97316'],
    xaxis: {
      categories: ['Yape', 'Efectivo', 'Transferencia', 'Cupón'],
      labels: {
        style: {
          colors: '#9CA3AF',
          fontSize: '11px',
        },
        formatter: (val) => `S/ ${val.toLocaleString()}`,
      },
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
        formatter: (val) => `S/ ${val.toLocaleString()}`,
      },
    },
    legend: { show: false },
  };

  const paymentDistributionSeries = [
    {
      name: 'Monto',
      data: [
        metrics.payments.yape,
        metrics.payments.efectivo,
        metrics.payments.transferencia,
        metrics.payments.cupon,
      ],
    },
  ];

  const handleTimeFilterChange = (e) => {
    const value = e.target.value;
    setTimeFilter(value);
    setShowDatePicker(false);

    const today = dayjs();
    let startDate = today;

    switch (value) {
      case '24horas':
        startDate = today.subtract(1, 'day');
        break;
      case '7días':
        startDate = today.subtract(7, 'day');
        break;
      case '28días':
        startDate = today.subtract(28, 'day');
        break;
      case '3meses':
        startDate = today.subtract(3, 'month');
        break;
      default:
        return;
    }

    setDateRange([startDate, today]);
  };

  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange(dates);
      setTimeFilter('personalizado');
    }
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
              allowClear={true}
              size="large"
            />
          )}
        </div>

        {/* Sección de métricas compactas - MÁS BAJAS */}
        <div className={Style.compactMetricsSection}>
          <div className={Style.smallMetricCard}>
            <h3 className={Style.metricTitle}>SESIONES TOTALES</h3>
            <div className={Style.metricValue}>{metrics.sessions}</div>
          </div>

          <div className={Style.smallMetricCard}>
            <h3 className={Style.metricTitle}>PACIENTES TOTALES</h3>
            <div className={Style.metricValue}>{metrics.patients}</div>
          </div>

          <div className={Style.earningsCard}>
            <h3 className={Style.metricTitle}>GANANCIA TOTAL</h3>
            <div className={Style.earningsValue}>
              S/ {metrics.payments.total.toLocaleString()}
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
            <span className={Style.chartSubtitle}>Últimas 6 semanas</span>
          </div>
          <div className={Style.chartContainer}>
            <Chart
              options={sessionChartOptions}
              series={[{ name: 'Sesiones', data: metrics.sessionData }]}
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
            <p className={Style.sectionSubtitle}>Por métodos de pago</p>

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
            <h3 className={Style.sectionTitle}>Rendimiento de Terapeutas</h3>
            <p className={Style.sectionSubtitle}>Top 5 terapeutas</p>

            <div
              className={Style.therapistsTableContainer}
              style={{ overflow: 'hidden' }}
            >
              <div className={Style.tableHeader}>
                <span
                  style={{
                    flex: '2',
                    minWidth: 0,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  Terapeuta
                </span>
                <span
                  style={{
                    flex: '0 0 80px',
                    textAlign: 'center',
                  }}
                >
                  Sesiones
                </span>
                <span
                  style={{
                    flex: '0 0 90px',
                    textAlign: 'center',
                  }}
                >
                  Ingresos
                </span>
                <span
                  style={{
                    flex: '0 0 70px',
                    textAlign: 'center',
                  }}
                >
                  Rating
                </span>
              </div>

              {metrics.therapists.map((therapist, index) => (
                <div
                  key={index}
                  className={`${Style.tableRow} ${index % 2 === 0 ? Style.evenRow : Style.oddRow}`}
                  style={{ overflow: 'hidden' }}
                >
                  <span
                    style={{
                      flex: '2',
                      minWidth: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      paddingRight: '8px',
                    }}
                  >
                    {therapist.name}
                  </span>
                  <span
                    style={{
                      flex: '0 0 80px',
                      textAlign: 'center',
                    }}
                  >
                    {therapist.sessions}
                  </span>
                  <span
                    style={{
                      flex: '0 0 90px',
                      textAlign: 'center',
                    }}
                  >
                    S/ {therapist.income.toFixed(2)}
                  </span>
                  <span
                    className={Style.rating}
                    style={{
                      flex: '0 0 70px',
                      textAlign: 'center',
                    }}
                  >
                    {therapist.rating.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
