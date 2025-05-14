// components/Form/Form.jsx
import { Button, Col, ConfigProvider, Form, Row } from 'antd';
import { useState } from 'react';
import InputField from '../Input/Input';
import styles from './Form.module.css';

const FormGenerator = ({ fields = [], mode = 'create' }) => {
  const [form] = Form.useForm();
  const [isPhoneRequired, setIsPhoneRequired] = useState(true);

  const handleFinish = (values) => {
    console.log('Datos del formulario:', values);
  };

  const togglePhoneRequired = () => {
    setIsPhoneRequired((prev) => !prev);
    form.validateFields(['phone']);
  };

  const renderField = (field, index) => {
    const isPhoneField = field.name === 'phone';
    return (
      <Col span={field.span || 8} key={index}>
        <Form.Item
          name={field.name}
          label={<span className={styles.label}>{field.label}</span>}
          className={styles.formItem}
          rules={
            isPhoneField
              ? isPhoneRequired
                ? [{ required: true, message: `Por favor complete el campo ${field.label}` }]
                : []
              : field.required
              ? [{ required: true, message: `Por favor complete el campo ${field.label}` }]
              : []
          }
        >
          <InputField
            type={field.type}
            label={field.label}
            options={field.options || []}
            isPhoneField={isPhoneField}
            isPhoneRequired={isPhoneRequired}
            togglePhoneRequired={togglePhoneRequired}
          />
        </Form.Item>
      </Col>
    );
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#FFFFFFFF',
          colorBgContainer: '#444444',
          colorText: '#FFFFFFFF',
          colorBorder: '#444',
          controlOutline: 'none',
          fontFamily: 'sans-serif',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className={styles.formContainer}
      >
        <Row gutter={[25, 0]}>
          {fields.map((field, index) => {
            if (field.type === 'title') {
              return (
                <Col span={24} key={index}>
                  <h2 className={styles.title}>{field.label}</h2>
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

        <Form.Item className={styles.buttonGroup}>
          <div className={styles.buttonWrapper}>
            <Button htmlType="button" className={styles.buttonCancel}>
              Cancelar
            </Button>
            <Button htmlType="submit" className={styles.buttonSubmit}>
              {mode === 'edit' ? 'Actualizar' : 'Registrar'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default FormGenerator;
