import React from 'react';
import styles from './QuickAccess.module.css';
import { Table, FileDoc } from '@phosphor-icons/react';

const QuickAccess = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Accesos Rápidos</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <Table size={30} className={styles.icon} weight="fill" />
          <span>Tabla de Pacientes</span>
        </div>
        <div className={styles.card}>
          <Table size={30} className={styles.icon} weight="fill" />
          <span>Tabla de Citas</span>
        </div>
        <div className={styles.card}>
          <FileDoc size={30} className={styles.icon} weight="fill" />
          <span>Reportes</span>
        </div>
        <div className={styles.card}>
          <Table size={30} className={styles.icon} weight="fill" />
          <span>Tabla de Terapeutas</span>
        </div>
      </div>
    </div>
  );
};

export default QuickAccess;
