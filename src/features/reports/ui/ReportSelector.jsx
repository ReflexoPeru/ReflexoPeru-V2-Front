import React from 'react';
import { Card, Select, Button } from 'antd';
import { FilePlus } from '@phosphor-icons/react';
import styles from './reports.module.css';

const { Option } = Select;

const ReportSelector = ({
  reportType,
  setReportType,
  date,
  setDate,
  range,
  setRange,
  generating,
  handleGenerate,
  renderDateInputs,
}) => (
  <div className={styles.mainContainer}>
    <Card className={styles.card}>
      <h2 className={styles.title}>Generador de Reportes</h2>
      <Select
        placeholder="Seleccione un tipo de reporte"
        className={styles.select}
        onChange={(value) => {
          setReportType(value);
          setDate && setDate();
          setRange && setRange(null);
        }}
        value={reportType}
      >
        <Option value="diariaTerapeuta">Atención Diaria x Terapeuta</Option>
        <Option value="pacientesTerapeuta">
          Reporte de pacientes por Terapeutas
        </Option>
        <Option value="reporteCaja">Reporte Caja</Option>
        <Option value="rangoCitas">Reporte Rango de citas</Option>
      </Select>
      {renderDateInputs()}
      {reportType && (
        <Button
          type="primary"
          icon={<FilePlus size={20} weight="bold" />}
          onClick={handleGenerate}
          block
          loading={generating}
          className={styles.generateBtn}
        >
          {generating ? 'Generando...' : 'Generar Reporte'}
        </Button>
      )}
    </Card>
  </div>
);

export default ReportSelector;
