// Dashboard.js
import React from 'react';
import Chart from 'react-apexcharts';
import Style from './Statistic.module.css';
import { useStatistic } from '../hook/useStatistic';

export default function Dashboard() {
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
  } = useStatistic();

  // Options for the pie chart
  const pieChartOptions = {
    chart: {
      type: 'pie',
      foreColor: '#ccc',
    },
    labels: pieOptions.labels,
    legend: {
      position: 'bottom',
    },
    tooltip: {
      theme: 'dark',
    },
    plotOptions: {
      pie: {
        expandOnClick: false, // Opcional: desactiva la expansión al hacer clic
        donut: {
          labels: {
            show: false, // Opcional: oculta las etiquetas dentro del gráfico
          },
        },
      },
    },
    dataLabels: {
      enabled: false, // Desactiva las etiquetas de datos para evitar solapamientos
    },

    stroke: {
      show: false, // Elimina el borde entre las particiones
    },
  };

  // Options for the bar chart
  const barChartOptions = {
    chart: {
      type: 'bar',
      height: '100%',
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
    xaxis: {
      categories: categories,
    },
    yaxis: {
      labels: {},

      axisTicks: {
        show: false, // Oculta las marcas del eje X
      },
    },
    xaxis: {
      labels: {
        show: true, // Muestra las etiquetas del eje X
      },
    },
    fill: {
      opacity: 1,
    },
    grid: {
      show: false, // Oculta la cuadrícula
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + ' sesiones';
        },
      },
    },
  };

  const barChartHorizontalOptions = {
    chart: {
      type: 'bar',
      height: '100%',
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
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
        show: false, // Oculta las etiquetas del eje X
      },
      axisBorder: {
        show: false, // Oculta el borde del eje X
      },
      axisTicks: {
        show: false, // Oculta las marcas del eje X
      },
    },
    yaxis: {
      labels: {
        show: false, // Oculta las etiquetas del eje Y
      },
      axisBorder: {
        show: false, // Oculta el borde del eje Y
      },
      axisTicks: {
        show: false, // Oculta las marcas del eje Y
      },
    },
    grid: {
      show: false, // Oculta la cuadrícula
    },
    fill: {
      opacity: 1,
    },
  };

  // Options for the line chart
  const lineChartOptions = {
    chart: {
      type: 'line',
      height: '100%',
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY'],
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return 'S/' + val;
        },
      },
    },
    grid: {
      show: false, // Oculta la cuadrícula
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return 'S/' + val;
        },
      },
    },
  };

  return (
    <div className={Style.container}>
      <div className={Style.dynamicContent}>
        <div className={Style.groupone}>
          <div className={Style.contgraph}>
            <h3>Tipos de Pacientes</h3>
            <div className={Style.graph}>
              <Chart
                options={pieChartOptions}
                series={pieSeries}
                type="pie"
                height="100%"
              />
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
              />
            </div>
          </div>
        </div>
        <div className={Style.grouptwo}>
          <div className={Style.contgraph}>
            <div className={Style.contgraphbig}>
              <h3>Rendimiento de Terapeutas</h3>
              <div className={Style.graph}>
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
                        <td>{therapist.name}</td>
                        <td>{therapist.data[0]}</td>
                        <td>S/ {therapist.data[0] * 60}</td>
                        <td>{(Math.random() * (5 - 4) + 4).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className={Style.groupthree}>
            <div className={Style.contgraph}>
              <h3>Métricas Principales</h3>
              <div className={Style.graph}>
                <div>
                  <div className={Style.metrics}>
                    <p>Total Pacientes: 124</p>
                  </div>
                  <div>
                    <p>Sesiones del Mes: 87</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={Style.contgraph}>
              <h3>Métodos de Pago</h3>
              <div className={Style.graph}>
                <Chart
                  options={barChartHorizontalOptions}
                  series={[{ data: Object.values(paymentTypes) }]}
                  type="bar"
                  height="100%"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
