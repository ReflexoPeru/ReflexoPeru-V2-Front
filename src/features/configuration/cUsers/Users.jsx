import React, { useState } from 'react';
import ModeloTable from '../../../components/Table/Tabla';
import { useUsers } from './usersHook';
import { Button, Space, Form, Input, Switch, message } from 'antd';
import styles from './Users.module.css';
import BaseModal from '../../../components/Modal/BaseModalPayments/BaseModalPayments';

const renderStatus = (status) => {
  return status === 'Habilitado' ? (
    <span className={styles.statusEnabled}>{status}</span>
  ) : (
    <span className={styles.statusDisabled}>{status}</span>
  );
};

const Users = () => {
  const { users, loading } = useUsers();
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [action, setAction] = useState(''); // 'create' | 'edit'

  const handleAction = (action, record) => {
    setAction(action);
    setCurrentRecord(record);

    if (action === 'edit') {
      form.setFieldsValue({
        ...record,
        status: record.account_statement === 'Habilitado',
      });
      setModalVisible(true);
    } else if (action === 'delete') {
      message.error('Función de eliminar no implementada');
    } else if (action === 'deactivate') {
      message.warning('Función de desactivar no implementada');
    }
  };

  const handleAddUser = () => {
    setAction('create');
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      account_statement: values.status ? 'Habilitado' : 'Deshabilitado',
    };

    console.log('Datos enviados:', payload);
    message.success(
      action === 'create'
        ? 'Usuario creado exitosamente'
        : 'Usuario actualizado exitosamente',
    );
    setModalVisible(false);
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
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Usuarios</h2>
        <Button
          type="primary"
          className={styles.addButton}
          onClick={handleAddUser}
        >
          Agregar Usuario
        </Button>
      </div>

      <ModeloTable columns={userColumns} data={users} loading={loading} />

      {/* Modal para crear/editar usuarios */}
      <BaseModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSubmit}
        title={action === 'create' ? 'Agregar nuevo usuario' : 'Editar usuario'}
        form={form}
        okText={action === 'create' ? 'Crear' : 'Actualizar'}
      >
        <Form.Item
          name="name"
          label="Nombre"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <Input className={styles.inputField} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo electrónico"
          rules={[
            { required: true, message: 'Este campo es requerido' },
            { type: 'email', message: 'Ingrese un correo válido' },
          ]}
        >
          <Input className={styles.inputField} />
        </Form.Item>

        <Form.Item
          name="role"
          label="Rol"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <Input className={styles.inputField} />
        </Form.Item>

        <Form.Item name="status" label="Estado" valuePropName="checked">
          <Switch
            checkedChildren="Habilitado"
            unCheckedChildren="Deshabilitado"
            className={styles.statusSwitch}
          />
        </Form.Item>
      </BaseModal>
    </div>
  );
};

export default Users;
