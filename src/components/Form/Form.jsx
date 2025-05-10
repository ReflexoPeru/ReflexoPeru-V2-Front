import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Col, ConfigProvider, Form, Row } from 'antd';
import { useState } from 'react';
import InputField from '../Input/Input';

const FormGenerator = ({ fields = [] }) => {
  const [form] = Form.useForm();
  const [isPhoneRequired, setIsPhoneRequired] = useState(true);

  const handleFinish = (values) => {
    console.log('Datos del formulario:', values);
  };

  const togglePhoneRequired = () => {
    setIsPhoneRequired((prev) => !prev);
    form.validateFields(['phone']);
  };

  const renderPhoneField = (field, index) => (
    <Col span={field.span || 8} key={index}>
      <Form.Item
        name={field.name}
        label={<span style={{ color: 'white' }}>{field.label}</span>}
        style={{ margin: '25px 25px 10px' }}
        rules={isPhoneRequired ? [{ required: true, message: `Por favor complete el campo ${field.label}` }] : []}
      >
        <div style={{ display: 'flex', marginRight: '-30px', alignItems: 'center' }}>
          <InputField type={field.type} label={field.label} options={field.options || []} style={{ width: '100%' }} />
          <CheckCircleFilled
            onClick={togglePhoneRequired}
            title={isPhoneRequired ? 'Teléfono obligatorio (clic para hacerlo opcional)' : 'Teléfono opcional (clic para hacerlo obligatorio)'}
            style={{ fontSize: 20, color: isPhoneRequired ? '#FFF' : '#aaa', cursor: 'pointer', marginLeft: 8 }}
          />
        </div>
      </Form.Item>
    </Col>
  );

  const renderDefaultField = (field, index) => (
    <Col span={field.span || 8} key={index}>
      <Form.Item
        name={field.name}
        label={<span style={{ color: 'white' }}>{field.label}</span>}
        style={{ margin: '25px 25px 10px' }}
        rules={field.required ? [{ required: true, message: `Por favor complete el campo ${field.label}` }] : []}
      >
        <InputField type={field.type} label={field.label} options={field.options || []} />
      </Form.Item>
    </Col>
  );

  const renderField = (field, index) => {
    if (field.name === 'phone') return renderPhoneField(field, index);
    return renderDefaultField(field, index);
  };

  return (
    <ConfigProvider
      theme={{
        token: {colorPrimary: '#FFFFFFFF', colorBgContainer: '#444444', colorText: '#FFFFFFFF', colorBorder: '#444', controlOutline: 'none', fontFamily: 'sans-serif',}}}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        style={{ backgroundColor: '#1e1e1e', padding: 24, borderRadius: 12, color: 'white' }}
      >
        <Row gutter={[25, 0]}>
          {fields.map((field, index) => {
            if (field.type === 'title') {
              return (
                <Col span={24} key={index}>
                  <h2 style={{ color: 'white', marginTop: index !== 0 ? 24 : 0, fontSize: '28px', fontWeight: 'bold' }}>
                    {field.label}
                  </h2>
                </Col>
              );
            }

            if (field.type === 'customRow') {
              return (
                <Col span={24} key={index}>
                  <Row gutter={[25, 0]}>
                    {field.fields.map((subField, subIndex) =>
                      renderField(subField, `${index}-${subIndex}`)
                    )}
                  </Row>
                </Col>
              );
            }

            return renderField(field, index);
          })}
        </Row>

        <Form.Item style={{ marginTop: 20, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button htmlType="button" style={{ marginRight: 10, backgroundColor: '#1677ff', color: 'white', border: 'none' }}>
              Cancelar
            </Button>
            <Button htmlType="submit" style={{ backgroundColor: '#00b96b', color: 'white', border: 'none' }}>
              Registrar
            </Button>
          </div>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default FormGenerator;
