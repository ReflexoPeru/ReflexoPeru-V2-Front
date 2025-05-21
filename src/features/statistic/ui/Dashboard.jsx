import React, { useState } from 'react';
import { DatePicker, ConfigProvider, theme } from 'antd';
import dayjs from 'dayjs';
import Chart from 'react-apexcharts';
import Style from './Statistic.module.css';
import { useStatistic } from '../hook/useStatistic';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState([dayjs(), dayjs()]);

  const {
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
  } = useStatistic(
    dateRange[0].format('YYYY-MM-DD'),
    dateRange[1].format('YYYY-MM-DD'),
  );
  console.log(metricsSeries);
  // Opciones para el gráfico de barras apiladas
  const stackedBarOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '100%',
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ['#00008066'],
      },
    },
    stroke: {
      width: 1,
      colors: ['#00000066'],
    },
    xaxis: {
      categories: ['Pacientes'],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
      colors: ['#FF5733', '#33FF57'],
    },
    legend: {
      position: 'bottom',
    },
    grid: {
      show: false,
    },
  };

  // Opciones para el gráfico de barras
  const barChartOptions = {
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    colors: ['#1DB954'],
    xaxis: {
      categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
      labels: {
        show: true,
      },
    },
    yaxis: {
      labels: {},
      axisTicks: {
        show: false,
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' sesiones';
        },
      },
    },
  };

  // Opciones para el gráfico de líneas
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: '100%',
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    toolbar: {
      show: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return 'S/' + val;
        },
      },
    },
    colors: ['#1DB954'],
    grid: {
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'S/' + val;
        },
      },
    },
  };

  // Opciones para el gráfico de barras horizontales
  const barChartHorizontalOptions = {
    chart: {
      type: 'bar',
      height: '100%',
      width: '100%',
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        distributed: true,
      },
    },
    toolbar: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val;
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Yape', 'Efectivo', 'Cupon'],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'],
    yaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  };

  return (
    <div className={Style.container}>
      <div className={Style.dynamicContent}>
        <div className={Style.groupone}>
          <div
            style={{
              gap: '10px',
              justifyContent: 'space-between',
            }}
          >
            <div className={Style.contgraph}>
              <h3>Tipos de Pacientes</h3>
              <div className={Style.graph}>
                <Chart
                  options={stackedBarOptions}
                  series={pieSeries}
                  type="bar"
                  height="70%"
                  width="100%"
                />
              </div>
            </div>
            <div className={Style.contgraph}>
              <h3>Rango de Fecha</h3>
              <ConfigProvider
                theme={{
                  algorithm: theme.darkAlgorithm,
                }}
              >
                <DatePicker.RangePicker
                  value={dateRange}
                  style={{ width: '100%', marginBottom: 16 }}
                  onChange={(dates) => {
                    setDateRange(dates);
                  }}
                  format="YYYY-MM-DD"
                />
              </ConfigProvider>
            </div>
          </div>
          <div className={Style.contgraph}>
            <h3>Sesiones por Mes</h3>
            <div className={Style.graph}>
              <Chart
                options={barChartOptions}
                series={chartSeries}
                type="bar"
                height="100%"
                width="100%"
              />
            </div>
          </div>
          <div className={Style.contgraph}>
            <h3>Ingresos Mensuales</h3>
            <div className={Style.graph}>
              <Chart
                options={lineChartOptions}
                series={monthlySessions}
                type="line"
                height="100%"
                width="100%"
              />
            </div>
          </div>
        </div>
        <div className={Style.grouptwo}>
          <div className={Style.contgraph}>
            <div className={Style.contgraphbig}>
              <h3>Rendimiento de Terapeutas</h3>
              <div className={Style.graph}>
                <div className={Style.tableContainer}>
                  <table className={Style.table}>
                    <thead>
                      <tr>
                        <th>Terapeuta</th>
                        <th>Sesiones</th>
                        <th>Ingresos</th>
                        <th>Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {therapistPerformance.map((therapist, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: 'center' }}>
                            {therapist.name}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {therapist.data[0]}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            S/ {therapist.data[1]}
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            {therapist.data[2].toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className={Style.groupthree}>
            <div className={Style.contgraph}>
              <h3>Métricas Principales</h3>
              <div className={Style.graph}>
                <div className={Style.metricsContainer}>
                  <div className={Style.metricsRow}>
                    <div className={Style.metrics}>
                      <p>Pacientes:</p>
                      <h1 className={Style.number}>
                        {metricsSeries[1]?.data[0] || 0}
                      </h1>
                    </div>
                    <div className={Style.metrics}>
                      <p>Sesiones:</p>
                      <h1 className={Style.number}>
                        {metricsSeries[2]?.data[0] || 0}
                      </h1>
                    </div>
                  </div>

                  <div className={Style.bigmetrics}>
                    <p>Ingresos:</p>
                    <h1 className={Style.number}>
                      {metricsSeries[0]?.data[0] || 0}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
            <div className={Style.contgraph}>
              <h3>Métodos de Pago</h3>
              <div className={Style.graph}>
                <Chart
                  options={barChartHorizontalOptions}
                  series={[{ data: paymentTypes }]}
                  type="bar"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
