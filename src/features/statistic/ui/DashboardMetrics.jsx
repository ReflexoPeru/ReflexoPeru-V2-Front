import React from 'react';
import { Calendar, Users, Bank } from 'phosphor-react';

const DashboardMetrics = ({
  totalSessions,
  totalPatients,
  totalEarnings,
  formatCurrency,
  Style,
  dateRangeSubtitle,
}) => (
  <div className={Style.compactMetricsSection}>
    <div className={Style.smallMetricCard}>
      <div className={Style.iconContainer}>
        <Calendar size={20} weight="bold" />
      </div>
      <div className={Style.metricContent}>
        <h3 className={Style.metricTitle}>SESIONES TOTALES</h3>
        <div className={Style.metricValue}>{totalSessions.toLocaleString()}</div>
      </div>
    </div>
    <div className={Style.smallMetricCard}>
      <div className={Style.iconContainer}>
        <Users size={20} weight="bold" />
      </div>
      <div className={Style.metricContent}>
        <h3 className={Style.metricTitle}>PACIENTES TOTALES</h3>
        <div className={Style.metricValue}>{totalPatients.toLocaleString()}</div>
      </div>
    </div>
    <div className={Style.earningsCard}>
      <div className={Style.earningsIconContainer}>
        <Bank size={24} weight="bold" />
      </div>
      <div className={Style.earningsContent}>
        <h3 className={Style.metricTitle}>GANANCIA TOTAL</h3>
        <div className={Style.earningsValue}>{formatCurrency(totalEarnings)}</div>
        <p className={Style.earningsSubtitle}>
          {dateRangeSubtitle || 'Acumulado en el período seleccionado'}
        </p>
      </div>
    </div>
  </div>
);

export default DashboardMetrics;
