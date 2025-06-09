import React from 'react';
import ModeloTable from '../../../components/Table/Tabla';
import styles from './Payments.module.css';
import { usePaymentTypes, usePrices } from './paymentsHook';
import { Button, Space } from 'antd';

// Renderiza el estado con color simple
const renderStatus = (status) => {
  if (status === 'Habilitado') {
    return <span className={styles.statusEnabled}>{status}</span>;
  }
  return <span style={{ color: 'red' }}>{status}</span>;
};

const Payments = () => {                                                            
  const { paymentTypes, loading: loadingPayments } = usePaymentTypes();
  const { prices, loading: loadingPrices } = usePrices();

  const handleAction = (action, record) => {
    console.log(`${action} action for:`, record);
  };

  const paymentTypeColumns = [
    {
      title: 'Tipo de pago',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
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
            onClick={() => handleAction('edit', record)}>Editar</Button>
          <Button 
            style={{ backgroundColor: '#FFAA00', color: '#fff', border: 'none' }}
            onClick={() => handleAction('deactivate', record)}>Desactivar</Button>
          <Button
            style={{ backgroundColor: '#FF3333', color: '#fff', border: 'none' }} 
            onClick={() => handleAction('delete', record)}>Eliminar</Button>
        </Space>
      ),
    },
  ];

  const priceColumns = [
    {
      title: 'Tipo',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Costo',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
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
          onClick={() => handleAction('edit', record)}>Editar</Button>
          <Button 
          style={{ backgroundColor: '#FFAA00', color: '#fff', border: 'none' }}
          onClick={() => handleAction('deactivate', record)}>Desactivar</Button>
          <Button
          style={{ backgroundColor: '#FF3333', color: '#fff', border: 'none' }} 
          onClick={() => handleAction('delete', record)}>Eliminar</Button>
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
      {/* Tipos de Pago */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>Tipos de pago</h2>
          <Button type="primary">Agregar</Button>
        </div>
        <ModeloTable
          columns={paymentTypeColumns}
          data={paymentTypes}
          loading={loadingPayments}
        />
      </div>

      {/* Precios */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <h2 style={{ margin: 0 }}>Precios</h2>
          <Button type="primary">Agregar</Button>
        </div>
        <ModeloTable
          columns={priceColumns}
          data={prices}
          loading={loadingPrices}
        />
      </div>
    </div>
  );
};

export default Payments;
