import React, { useEffect } from 'react';
import { Form, Input, Select, DatePicker, Button, Row, Col, Divider, Space, notification } from 'antd';
import { UserOutlined, IdcardOutlined, PhoneOutlined, MailOutlined, HomeOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { usePatients } from '../../patients/hook/patientsHook';
import dayjs from 'dayjs';

const { Option } = Select;

export default function GhlPatientForm({ ghlInitialValues, onSubmit, onCancel }) {
  const [form] = Form.useForm();
  const { submitNewPatient, loading } = usePatients();

  // Pre-cargar datos de GHL al iniciar
  useEffect(() => {
    if (ghlInitialValues) {
      form.setFieldsValue({
        name: ghlInitialValues.firstName || '',
        paternal_lastname: ghlInitialValues.lastName || '',
        primary_phone: ghlInitialValues.phone || '',
        email: ghlInitialValues.email || '',
        document_type_id: 1, // DNI por defecto
      });
    }
  }, [ghlInitialValues, form]);

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
    };

    try {
      const response = await submitNewPatient(formattedValues);
      if (response && response.id) {
        notification.success({ message: 'Paciente registrado', description: 'Se ha vinculado correctamente desde la web.' });
        onSubmit(response);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '0 10px' }}>
      {/* BANNER DE DATOS WEB (Súper Minimalista) */}
      <div style={{ 
        marginBottom: '20px', 
        padding: '12px', 
        background: '#F8FAFC', 
        borderRadius: '8px', 
        border: '1px dashed #CBD5E1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <InfoCircleOutlined style={{ color: '#64748B', fontSize: '12px' }} />
          <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Prospecto de GoHighLevel</span>
        </div>
        <span style={{ fontSize: '11px', color: '#475569' }}>
          Interés en: <strong style={{ color: '#2563EB' }}>{ghlInitialValues?.service || 'Consulta General'}</strong>
        </span>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        initialValues={{ document_type_id: 1 }}
      >
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              name="document_type_id"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Tipo</span>}
              rules={[{ required: true }]}
            >
              <Select dropdownStyle={{ borderRadius: '8px' }}>
                <Option value={1}>DNI</Option>
                <Option value={2}>C. Extranjería</Option>
                <Option value={3}>Pasaporte</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              name="document_number"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Número de Documento</span>}
              rules={[{ required: true, message: 'Ingrese DNI' }]}
            >
              <Input 
                prefix={<IdcardOutlined style={{ color: '#94A3B8' }} />} 
                placeholder="Ej: 712233..."
                suffix={<Button type="text" icon={<SearchOutlined />} style={{ padding: 0 }} />}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="name"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Nombre</span>}
              rules={[{ required: true }]}
            >
              <Input placeholder="Nombre" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="paternal_lastname"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Ap. Paterno</span>}
              rules={[{ required: true }]}
            >
              <Input placeholder="Apellido" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="maternal_lastname"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Ap. Materno</span>}
            >
              <Input placeholder="Apellido" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="birth_date"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Nacimiento</span>}
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: '100%' }} placeholder="Fecha" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="sex"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Sexo</span>}
              rules={[{ required: true }]}
            >
              <Select placeholder="Seleccione">
                <Option value="M">Masculino</Option>
                <Option value="F">Femenino</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="occupation"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Ocupación</span>}
            >
              <Input placeholder="Trabajo" />
            </Form.Item>
          </Col>
        </Row>

        <Divider style={{ margin: '15px 0' }} />

        <Row gutter={16}>
          <Col span={10}>
            <Form.Item
              name="primary_phone"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Teléfono</span>}
              rules={[{ required: true }]}
            >
              <Input prefix={<PhoneOutlined style={{ color: '#94A3B8' }} />} placeholder="999..." />
            </Form.Item>
          </Col>
          <Col span={14}>
            <Form.Item
              name="email"
              label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Correo</span>}
            >
              <Input prefix={<MailOutlined style={{ color: '#94A3B8' }} />} placeholder="ejemplo@correo.com" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label={<span style={{ fontSize: '12px', fontWeight: 600 }}>Dirección</span>}
        >
          <Input prefix={<HomeOutlined style={{ color: '#94A3B8' }} />} placeholder="Ciudad, Distrito, Calle..." />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <Button onClick={onCancel} style={{ borderRadius: '6px' }}>
            Cancelar
          </Button>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            style={{ 
              borderRadius: '6px', 
              background: '#059669', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgba(5,150,105,0.2)' 
            }}
          >
            Completar Registro
          </Button>
        </div>
      </Form>
    </div>
  );
}
