import React from 'react';
import ModeloTable from '../../../components/Table/Tabla';
import styles from './Payments.module.css';

const paymentTypes = [
  { id: 1, paymentType: 'Efectivo', status: 'Habilitado' },
  { id: 2, paymentType: 'Yape', status: 'Habilitado' },
];

const prices = [
  { id: 1, amount: 'S/ 120', status: 'Habilitado' },
  { id: 2, amount: 'S/ 60', status: 'Habilitado' },
];

const renderStatus = (status) => (
  <span className={styles.statusEnabled}>{status}</span>
);

const paymentTypeColumns = [
  {
    title: 'Tipo de pago',
    dataIndex: 'paymentType',
    key: 'paymentType',
    width: 200,
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    render: renderStatus,
  },
];

const priceColumns = [
  {
    title: 'Monto',
    dataIndex: 'amount',
    key: 'amount',
    width: 200,
  },
  {
    title: 'Estado',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    render: renderStatus,
  },
];

const paymentTypeActions = (record) => (
  <div className={styles.actions}>
    <button className={`${styles.button} ${styles.deactivate}`}>
      Desactivar
    </button>
    <button className={`${styles.button} ${styles.delete}`}>Eliminar</button>
  </div>
);

const priceActions = (record) => (
  <div className={styles.actions}>
    <button className={`${styles.button} ${styles.deactivate}`}>
      Desactivar
    </button>
    <button className={`${styles.button} ${styles.edit}`}>Editar</button>
    <button className={`${styles.button} ${styles.delete}`}>Eliminar</button>
  </div>
);

const Payments = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.section}>
            <div className={styles.card}>
              {/* Payment Types Table */}
              <div className={styles.tableContainer}>
                <div className={styles.titleContainer}>
                  <h2 className={styles.title}>Tipos de pago</h2>
                  <button className={`${styles.button} ${styles.add}`}>
                    Agregar
                  </button>
                </div>
                <div className={styles.tableWrapper}>
                  <ModeloTable
                    columns={paymentTypeColumns}
                    data={paymentTypes}
                    customActions={paymentTypeActions}
                  />
                </div>
              </div>

              {/* Prices Table */}
              <div className={styles.tableContainer}>
                <div className={styles.titleContainer}>
                  <h2 className={styles.title}>Precios</h2>
                  <button className={`${styles.button} ${styles.add}`}>
                    Agregar
                  </button>
                </div>
                <div className={styles.tableWrapper}>
                  <ModeloTable
                    columns={priceColumns}
                    data={prices}
                    customActions={priceActions}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
