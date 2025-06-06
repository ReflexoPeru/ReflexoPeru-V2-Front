import React from 'react';
import ModeloTable from '../../../components/Table/Tabla';
import { useUsers } from './usersHook';
import { Button, Space } from 'antd';
import styles from './Users.module.css'; // Solo se usará para statusEnabled

// Render del estado con diseño especial para "Habilitado"
const renderStatus = (status) => {
  return status === 'Habilitado'
    ? <span className={styles.statusEnabled}>{status}</span>
    : <span style={{ color: 'red' }}>{status}</span>;
};

const Users = () => {
  const { users, loading } = useUsers();

  const handleAction = (action, record) => {
    console.log(`${action} action for:`, record);
  };

  const handleAddUser = () => {
    console.log("Agregar nuevo usuario");
  };

  const userColumns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Estado',
      dataIndex: 'account_statement',
      key: 'account_statement',
      render: renderStatus,
    },
    {
      title: 'Acciones',
      key: 'actions',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            style={{ backgroundColor: '#0066FF', color: '#fff', border: 'none' }}
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          <Button 
            style={{ backgroundColor: '#FFAA00', color: '#fff', border: 'none' }}
            onClick={() => handleAction('deactivate', record)}
          >
            Desactivar
          </Button>
          <Button 
            style={{ backgroundColor: '#FF3333', color: '#fff', border: 'none' }} 
            onClick={() => handleAction('delete', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div
      style={{
        height: '100%',
        paddingTop: '20px',
        maxWidth: 'calc(100% - 200px)',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ margin: 0 }}>Usuarios</h2>
        <Button type="primary" onClick={handleAddUser}>
          Agregar Usuario
        </Button>
      </div>

      <ModeloTable
        columns={userColumns}
        data={users}
        loading={loading}
      />
    </div>
  );
};

export default Users;
