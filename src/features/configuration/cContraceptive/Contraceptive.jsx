import React, { useState, useEffect } from 'react';
import { Button, Form, Input, Modal, message, Space, Popconfirm, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, LoadingOutlined } from '@ant-design/icons';
import ModeloTable from '../../../components/Table/Tabla';
import styles from './Contraceptive.module.css';
import { useContraceptiveMethods, useDiuTypes } from './hook/contraceptiveHook';
import { useToast } from '../../../services/toastify/ToastContext';
import { useTheme } from '../../../context/ThemeContext';

const Contraceptive = () => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('contraceptive');
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const { isDarkMode } = useTheme();

  const {
    data: contraceptiveMethods,
    loading: loadingMethods,
    refetch: refetchMethods,
    createMethod,
    updateMethod,
    deleteMethod,
  } = useContraceptiveMethods();

  const {
    data: diuTypes,
    loading: loadingTypes,
    refetch: refetchTypes,
    createType,
    updateType,
    deleteType,
  } = useDiuTypes();

  const contraceptiveColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('es-PE'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            className={`${styles.actionButton} ${styles.editButton}`}
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit('contraceptive', record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este método anticonceptivo?"
            onConfirm={() => handleDelete('contraceptive', record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const diuColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString('es-PE'),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            className={`${styles.actionButton} ${styles.editButton}`}
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit('diu', record)}
          />
          <Popconfirm
            title="¿Estás seguro de eliminar este tipo DIU?"
            onConfirm={() => handleDelete('diu', record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button
              className={`${styles.actionButton} ${styles.deleteButton}`}
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleCreate = (type) => {
    setModalType(type);
    setEditingItem(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    form.setFieldsValue({
      name: item.name,
    });
    setModalVisible(true);
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'contraceptive') {
        await deleteMethod(id);
        showToast('success', 'Método anticonceptivo eliminado correctamente');
        refetchMethods();
      } else {
        await deleteType(id);
        showToast('success', 'Tipo DIU eliminado correctamente');
        refetchTypes();
      }
    } catch (error) {
      showToast('error', 'Error al eliminar el elemento');
    }
  };

  const handleSubmit = async (values) => {
    console.log('handleSubmit llamado con valores:', values);
    console.log('modalType:', modalType);
    console.log('editingItem:', editingItem);
    
    setSubmitting(true);
    try {
      if (modalType === 'contraceptive') {
        if (editingItem) {
          console.log('Actualizando método anticonceptivo...');
          await updateMethod(editingItem.id, values);
          showToast('success', 'Método anticonceptivo actualizado correctamente');
          refetchMethods();
        } else {
          console.log('Creando método anticonceptivo...');
          await createMethod(values);
          showToast('success', 'Método anticonceptivo creado correctamente');
          refetchMethods();
        }
      } else {
        if (editingItem) {
          console.log('Actualizando tipo DIU...');
          await updateType(editingItem.id, values);
          showToast('success', 'Tipo DIU actualizado correctamente');
          refetchTypes();
        } else {
          console.log('Creando tipo DIU...');
          await createType(values);
          showToast('success', 'Tipo DIU creado correctamente');
          refetchTypes();
        }
      }
      setModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error en handleSubmit:', error);
      showToast('error', 'Error al guardar los cambios');
    } finally {
      setSubmitting(false);
    }
  };

  const getInitialValues = () => {
    if (editingItem) {
      return { name: editingItem.name };
    }
    return {};
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingItem(null);
    setSubmitting(false);
  };

  return (
    <div 
      className={styles.container}
      style={{
        width: '90%',
        margin: '0 auto',
        paddingLeft: '35px',
        paddingRight: '35px',
      }}
    >
      <div className={styles.sectionsContainer}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Métodos Anticonceptivos</h2>
            <Button
              type="primary"
              className={styles.addButton}
              icon={<PlusOutlined />}
              onClick={() => handleCreate('contraceptive')}
            >
              Agregar Método
            </Button>
          </div>
          <div className={styles.tableContainer}>
            <ModeloTable
              columns={contraceptiveColumns}
              data={contraceptiveMethods || []}
              loading={loadingMethods}
              pagination={false}
              maxHeight="auto"
            />
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Tipos DIU</h2>
            <Button
              type="primary"
              className={styles.addButton}
              icon={<PlusOutlined />}
              onClick={() => handleCreate('diu')}
            >
              Agregar Tipo DIU
            </Button>
          </div>
          <div className={styles.tableContainer}>
            <ModeloTable
              columns={diuColumns}
              data={diuTypes || []}
              loading={loadingTypes}
              pagination={false}
              maxHeight="auto"
            />
          </div>
        </div>
      </div>

      <Modal
        title={
          <span style={{ 
            color: isDarkMode ? '#ffffff' : '#333333',
            fontFamily: 'var(--font-family)',
            fontWeight: 600
          }}>
            {editingItem
              ? `Editar ${modalType === 'contraceptive' ? 'Método Anticonceptivo' : 'Tipo DIU'}`
              : `Agregar ${modalType === 'contraceptive' ? 'Método Anticonceptivo' : 'Tipo DIU'}`
            }
          </span>
        }
        visible={modalVisible}
        onCancel={handleCancel}
        confirmLoading={submitting}
        footer={
          <Space size={8}>
            <Button
              onClick={handleCancel}
              disabled={submitting}
              style={{
                padding: '6px 16px',
                height: 32,
                borderRadius: 6,
                border: '1px solid var(--color-primary)',
                color: 'var(--color-primary)',
                backgroundColor: 'transparent',
              }}
              className="modal-cancel-btn modal-themed"
            >
              Cancelar
            </Button>
            <Button
              type="primary"
              loading={submitting}
              disabled={submitting}
              onClick={() => {
                console.log('Botón clickeado - enviando formulario');
                form.submit();
              }}
              style={{
                padding: '6px 16px',
                height: 32,
                borderRadius: 6,
                fontWeight: 500,
                backgroundColor: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
              }}
              className="modal-ok-btn modal-themed"
            >
              {submitting ? 'Procesando...' : (editingItem ? 'Actualizar' : 'Crear')}
            </Button>
          </Space>
        }
        width={500}
        centered
        destroyOnClose
        className="modal-themed"
        styles={{
          header: {
            borderBottom: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
            padding: '8px 12px',
            marginBottom: 8,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
          },
          body: {
            padding: '0 12px 8px',
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            color: isDarkMode ? '#ffffff' : '#333333',
          },
          footer: {
            borderTop: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
            padding: '8px 15px',
            marginTop: 8,
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
          },
          content: {
            backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
            borderRadius: 'var(--radius-lg) !important',
            border: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
          },
          mask: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        <Form
          form={form}
          layout="vertical"
          size="small"
          initialValues={getInitialValues()}
          onFinish={handleSubmit}
          onFinishFailed={(errorInfo) => {
            console.log('Formulario falló validación:', errorInfo);
          }}
        >
          <Form.Item
            name="name"
            label="Nombre"
            rules={[
              { required: true, message: 'Por favor ingresa el nombre' },
              { min: 2, message: 'El nombre debe tener al menos 2 caracteres' },
            ]}
          >
            <Input
              placeholder={
                modalType === 'contraceptive'
                  ? 'Ej: Anticonceptivos orales'
                  : 'Ej: DIU de cobre'
              }
              style={{
                backgroundColor: 'var(--color-input-bg)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-input-text)',
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Contraceptive;
