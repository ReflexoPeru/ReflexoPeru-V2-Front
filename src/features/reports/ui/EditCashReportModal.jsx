import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Button,
  Typography,
  Divider,
} from 'antd';
import { PencilSimple, FloppyDisk, X } from '@phosphor-icons/react';
import { useTheme } from '../../../context/ThemeContext';
import styles from './reports.module.css';

const { Text } = Typography;

const EditCashReportModal = ({ visible, onCancel, onSave, data, date }) => {
  const { isDarkMode } = useTheme();
  
  const customTheme = {
    token: {
      colorPrimary: '#1CB54A',
      colorBgContainer: isDarkMode ? '#232323' : '#ffffff',
      colorText: isDarkMode ? '#fff' : '#333333',
      borderRadius: 12,
      colorBorder: '#1CB54A',
      colorTextPlaceholder: isDarkMode ? '#bbb' : '#999999',
    },
    components: {
      Button: {
        colorPrimary: '#1CB54A',
        colorText: '#fff',
        colorPrimaryHover: '#148235',
        colorPrimaryActive: '#0e5c28',
        borderRadius: 10,
      },
      Input: {
        colorBgContainer: isDarkMode ? '#232323' : '#ffffff',
        colorText: isDarkMode ? '#fff' : '#333333',
        colorBorder: '#1CB54A',
        borderRadius: 10,
      },
      Modal: {
        colorBgElevated: isDarkMode ? '#181818' : '#ffffff',
        colorText: isDarkMode ? '#fff' : '#333333',
        borderRadius: 18,
      },
    },
  };

  const labelStyle = { 
    color: isDarkMode ? '#bbb' : '#666', 
    fontSize: 13, 
    fontWeight: 500 
  };
  
  const inputStyle = {
    width: '100%',
    height: 40,
    fontSize: 15,
    borderRadius: 10,
    background: isDarkMode ? '#232323' : '#ffffff',
    color: isDarkMode ? '#fff' : '#333333',
    border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
  };
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && data) {
      const initialData = {};
      Object.keys(data).forEach((key) => {
        const row = data[key];
        initialData[key] = {
          countAppointment: row.countAppointment || 0,
          payment: row.payment || 0,
        };
      });
      form.setFieldsValue(initialData);
    }
  }, [visible, data, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const updatedData = {};
      Object.keys(data).forEach((key) => {
        const originalRow = data[key];
        const editedValues = values[key];

        updatedData[key] = {
          ...originalRow,
          countAppointment: editedValues.countAppointment,
          payment: editedValues.payment,
          total: editedValues.countAppointment * editedValues.payment,
        };
      });

      onSave(updatedData);
      onCancel();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
        title={
          <div style={{ paddingBottom: 8 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: 20,
              }}
            >
              <PencilSimple size={20} color="#4CAF50" />
              <span style={{ color: '#fff', fontWeight: 600 }}>
                Editar Caja
              </span>
            </div>
          </div>
        }
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={500}
        className={styles.editModal}
        style={{ top: 60, padding: 0, background: '#181818', borderRadius: 18 }}
        destroyOnClose
      >
        <div style={{ marginBottom: 10, marginTop: 2 }}>
          <Text strong style={{ color: '#4CAF50', fontSize: 14 }}>
            {date?.format('DD/MM/YYYY')}
          </Text>
          <Text
            type="secondary"
            style={{
              display: 'block',
              marginTop: 2,
              fontSize: 12,
              color: '#bbb',
            }}
          >
            Modifica los valores para simular diferentes escenarios
          </Text>
        </div>
        <Form form={form} layout="vertical" style={{ margin: 0, padding: 0 }}>
          {data &&
            Object.keys(data).map((key, idx) => {
              const row = data[key];
              return (
                <div key={key} style={{ marginBottom: 18 }}>
                  <Divider
                    orientation="left"
                    style={{
                      margin: '10px 0 18px 0',
                      color: '#1CB54A',
                      fontSize: 15,
                      borderColor: isDarkMode ? '#333' : '#e0e0e0',
                    }}
                  >
                    <Text
                      strong
                      style={{
                        color: '#4CAF50',
                        fontSize: 15,
                        letterSpacing: 1,
                      }}
                    >
                      {row.name}
                    </Text>
                  </Divider>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <Form.Item
                      label={<span style={labelStyle}>Citas</span>}
                      name={[key, 'countAppointment']}
                      rules={[
                        { required: true, message: 'Campo requerido' },
                        {
                          type: 'number',
                          min: 0,
                          message: 'Debe ser mayor o igual a 0',
                        },
                      ]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <InputNumber style={inputStyle} min={0} />
                    </Form.Item>
                    <Form.Item
                      label={<span style={labelStyle}>Precio (S/)</span>}
                      name={[key, 'payment']}
                      rules={[
                        { required: true, message: 'Campo requerido' },
                        {
                          type: 'number',
                          min: 0,
                          message: 'Debe ser mayor o igual a 0',
                        },
                      ]}
                      style={{ marginBottom: 0, flex: 1 }}
                    >
                      <InputNumber
                        style={inputStyle}
                        min={0}
                        step={0.01}
                        precision={2}
                      />
                    </Form.Item>
                  </div>
                </div>
              );
            })}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 18,
              marginTop: 18,
            }}
          >
            <Button
              type="primary"
              icon={<FloppyDisk size={20} />}
              onClick={handleSave}
              loading={loading}
              size="large"
              style={{
                marginTop: 10,
                backgroundColor: '#4CAF50',
                borderColor: '#4CAF50',
                borderRadius: 7,
                fontSize: 16,
                height: 37,
                padding: '0 28px',
                boxShadow: '0 2px 8px 0 #0002',
                fontWeight: 500,
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = '#43a047')
              }
              onMouseOut={(e) => (e.currentTarget.style.background = '#4CAF50')}
            >
              Aplicar
            </Button>
          </div>
        </Form>
      </Modal>
  );
};

export default EditCashReportModal;
