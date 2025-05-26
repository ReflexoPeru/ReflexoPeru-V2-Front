import React from 'react';
import ModeloTable from '../../../components/Table/Tabla';
import styles from './Users.module.css';

// Sample data for Users table
const users = [
  {
    id: 1,
    nombre: 'Juan Pérez',
    rol: 'Administrador',
    estado: 'Habilitado',
    fechaRegistro: '13/05/2025',
  },
  {
    id: 2,
    nombre: 'María García',
    rol: 'Editor',
    estado: 'Deshabilitado',
    fechaRegistro: '10/05/2025',
  },
  {
    id: 3,
    nombre: 'Carlos López',
    rol: 'Invitado',
    estado: 'Habilitado',
    fechaRegistro: '05/05/2025',
  },
];

// Reusable function for status style
const renderStatus = (status) => (
  <span
    className={
      status === 'Habilitado' ? styles.statusEnabled : styles.statusDisabled
    }
  >
    {status}
  </span>
);

// Columns for Users table
const userColumns = [
  {
    title: 'Nombre',
    dataIndex: 'nombre',
    key: 'nombre',
    width: 150,
    align: 'left',
  },
  {
    title: 'Correo',
    dataIndex: 'correo',
    key: 'correo',
    width: 150,
    align: 'left',
  },
  {
    title: 'Rol',
    dataIndex: 'rol',
    key: 'rol',
    width: 150,
  },
  {
    title: 'Estado',
    dataIndex: 'estado',
    key: 'estado',
    width: 150,
    render: renderStatus,
  },
];

// Custom actions for users
const userActions = (record) => (
  <div className={styles.actions}>
    <button className={`${styles.button} ${styles.edit}`}>Editar</button>
    <button className={`${styles.button} ${styles.delete}`}>Eliminar</button>
  </div>
);

const Users = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.section}>
            <div className={styles.card}>
              {/* Users Table */}
              <div className={styles.tableContainer}>
                <h2 className={styles.title}>Usuarios</h2>
                <div className={styles.titleContainer}>
                  <button className={`${styles.button} ${styles.add}`}>
                    Agregar Usuario
                  </button>
                </div>
                <div className={styles.tableWrapper}>
                  <ModeloTable
                    columns={userColumns}
                    data={users}
                    customActions={userActions}
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

export default Users;
