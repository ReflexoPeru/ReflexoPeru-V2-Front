import React, { useState, useEffect } from 'react';
import {
  Form,
  InputNumber,
  Button,
  Typography,
  Divider,
  Space,
} from 'antd';
import { PencilSimple, FloppyDisk } from '@phosphor-icons/react';
import { useTheme } from '../../../context/ThemeContext';
import UniversalModal from '../../../components/Modal/UniversalModal';

const { Text } = Typography;

const EditCashReportModal = ({ visible, onCancel, onSave, data, date }) => {
  const { isDarkMode } = useTheme();

  const labelStyle = { 
    color: 'var(--color-text-secondary)', 
    fontSize: 13, 
    fontWeight: 500 
  };
  
  const inputStyle = {
    width: '100%',
    height: 40,
    fontSize: 15,
    borderRadius: 10,
    background: 'var(--color-background-secondary)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border-primary)',
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
    <UniversalModal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PencilSimple size={20} color="var(--color-primary)" />
          <span>Editar Caja</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={500}
      footer={null}
      destroyOnClose
    >
        <div style={{ marginBottom: 10, marginTop: 2 }}>
          <Text strong style={{ color: 'var(--color-primary)', fontSize: 14 }}>
            {date?.format('DD/MM/YYYY')}
          </Text>
          <Text
            type="secondary"
            style={{
              display: 'block',
              marginTop: 2,
              fontSize: 12,
              color: 'var(--color-text-secondary)',
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
                      color: 'var(--color-primary)',
                      fontSize: 15,
                      borderColor: 'var(--color-border-primary)',
                    }}
                  >
                    <Text
                      strong
                      style={{
                        color: 'var(--color-primary)',
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
            <Space>
              <Button
                onClick={handleCancel}
                style={{
                  padding: '6px 16px',
                  height: 37,
                  borderRadius: 7,
                  border: '1px solid var(--color-primary)',
                  color: 'var(--color-primary)',
                  backgroundColor: 'transparent',
                  fontSize: 16,
                  fontWeight: 500,
                }}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                icon={<FloppyDisk size={20} />}
                onClick={handleSave}
                loading={loading}
                size="large"
                style={{
                  marginTop: 10,
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  borderRadius: 7,
                  fontSize: 16,
                  height: 37,
                  padding: '0 28px',
                  boxShadow: '0 2px 8px 0 rgba(0,0,0,0.1)',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                }}
              >
                Aplicar
              </Button>
            </Space>
          </div>
        </Form>
    </UniversalModal>
  );
};

export default EditCashReportModal;
