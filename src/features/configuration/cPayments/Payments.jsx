import React, { useState } from 'react';
import ModeloTable from '../../../components/Table/Tabla';
import styles from './Payments.module.css';
import { usePaymentTypes, usePrices } from './paymentsHook';
import {
  Button,
  Space,
  Form,
  Input,
  Switch,
  message,
  ConfigProvider,
} from 'antd';
import BaseModal from '../../../components/Modal/BaseModalPayments/BaseModalPayments';

const renderStatus = (status) => {
  if (status === 'Habilitado') {
    return <span className={styles.statusEnabled}>{status}</span>;
  }
  return <span className={styles.statusDisabled}>{status}</span>;
};

const Payments = () => {
  const [form] = Form.useForm();
  const { paymentTypes, loading: loadingPayments } = usePaymentTypes();
  const { prices, loading: loadingPrices } = usePrices();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [modalType, setModalType] = useState(''); // 'payment' | 'price'
  const [action, setAction] = useState(''); // 'create' | 'edit'

  const handleAction = (action, record) => {
    setAction(action);
    setCurrentRecord(record);

    if (action === 'edit') {
      setModalType(record.price ? 'price' : 'payment');
      form.setFieldsValue({
        ...record,
        status: record.status === 'Habilitado',
      });
      setModalVisible(true);
    } else if (action === 'delete') {
      message.error('Función de eliminar no implementada');
    } else if (action === 'deactivate') {
      message.warning('Función de desactivar no implementada');
    }
  };

  const handleCreate = (type) => {
    setAction('create');
    setModalType(type);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      status: values.status ? 'Habilitado' : 'Deshabilitado',
    };

    console.log('Datos enviados:', payload);
    message.success(
      action === 'create'
        ? 'Registro creado exitosamente'
        : 'Registro actualizado exitosamente',
    );
    setModalVisible(false);
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
            className={styles.editButton}
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          <Button
            className={styles.deactivateButton}
            onClick={() => handleAction('deactivate', record)}
          >
            Desactivar
          </Button>
          <Button
            className={styles.deleteButton}
            onClick={() => handleAction('delete', record)}
          >
            Eliminar
          </Button>
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
      render: (price) => `S/${parseFloat(price).toFixed(2)}`,
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
            className={styles.editButton}
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          <Button
            className={styles.deactivateButton}
            onClick={() => handleAction('deactivate', record)}
          >
            Desactivar
          </Button>
          <Button
            className={styles.deleteButton}
            onClick={() => handleAction('delete', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0066FF',
          colorSuccess: '#52C41A',
          colorWarning: '#FAAD14',
          colorError: '#FF4D4F',
          borderRadius: 6,
          colorBgContainer: '#FFFFFF',
          colorText: '#333333',
        },
        components: {
          Button: {
            primaryShadow: 'none',
          },
          Table: {
            headerBg: '#FAFAFA',
            headerColor: '#333333',
          },
        },
      }}
    >
      <div className={styles.container}>
        {/* Tipos de Pago */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tipos de pago</h2>
            <Button
              type="primary"
              className={styles.addButton}
              onClick={() => handleCreate('payment')}
            >
              Agregar
            </Button>
          </div>
          <ModeloTable
            columns={paymentTypeColumns}
            data={paymentTypes}
            loading={loadingPayments}
            pagination={false}
          />
        </div>

        {/* Precios */}
        <div>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Precios</h2>
            <Button
              type="primary"
              className={styles.addButton}
              onClick={() => handleCreate('price')}
            >
              Agregar
            </Button>
          </div>
          <ModeloTable
            columns={priceColumns}
            data={prices}
            loading={loadingPrices}
            pagination={false}
          />
        </div>

        {/* Modal Reutilizable */}
        <BaseModal
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          onOk={handleSubmit}
          title={
            action === 'create'
              ? `Agregar nuevo ${modalType === 'payment' ? 'tipo de pago' : 'precio'}`
              : `Editar ${modalType === 'payment' ? 'tipo de pago' : 'precio'}`
          }
          form={form}
          okText={action === 'create' ? 'Crear' : 'Actualizar'}
        >
          <Form.Item
            name="name"
            label={
              modalType === 'payment'
                ? 'Nombre del tipo de pago'
                : 'Nombre del precio'
            }
            rules={[{ required: true, message: 'Este campo es requerido' }]}
          >
            <Input size="large" className={styles.inputField} />
          </Form.Item>

          {modalType === 'price' && (
            <Form.Item
              name="price"
              label="Costo"
              rules={[
                { required: true, message: 'Este campo es requerido' },
                {
                  pattern: /^\d+(\.\d{1,2})?$/,
                  message: 'Ingrese un valor válido',
                },
              ]}
            >
              <Input
                prefix="S/"
                type="number"
                step="0.01"
                size="large"
                className={styles.inputField}
              />
            </Form.Item>
          )}

          <Form.Item name="status" label="Estado" valuePropName="checked">
            <Switch
              checkedChildren="Habilitado"
              unCheckedChildren="Deshabilitado"
              className={styles.statusSwitch}
            />
          </Form.Item>
        </BaseModal>
      </div>
    </ConfigProvider>
  );
};

export default Payments;
