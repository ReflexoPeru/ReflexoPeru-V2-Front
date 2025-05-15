// Form.jsx
import {
  Button,
  Checkbox,
  Col,
  ConfigProvider,
  Form,
  Row
} from 'antd';
import { useState } from 'react';
import styles from '../Form/Form.module.css';
import InputField from '../Input/Input';

const { useForm } = Form;

const FormComponent = ({
  fields = [],
  mode = 'create',
  showHourField = false,
  isPaymentRequired = false,
  patientType = '',
  paymentOption = '',
  customAmount = '',
  patientTypeOptions = [],
  paymentOptions = [],
  paymentMethods = [],
  onPaymentOptionChange = () => {},
  onPatientTypeChange = () => {},
  onShowHourFieldChange = () => {},
  onPaymentRequiredChange = () => {},
  onSubmit = () => {}
}) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [isPhoneRequired, setIsPhoneRequired] = useState(true);

  const handleFinish = async (values) => {
    try {
      setLoading(true);
      console.log('Datos del formulario:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(values);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    } finally {
      setLoading(false);
    }
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
      <div className={styles.container}>
        <h1 className={styles.title}>Nueva Cita</h1>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className={styles.formContainer}
        >
          {fields.length > 0 ? (
            <Row gutter={[20, 0]}>
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
          ) : (
            <>
              <InputField type="cita" componentType="dateField" form={form} />
              <InputField
                type="cita"
                componentType="patientField"
                form={form}
                patientType={patientType}
                onPatientTypeChange={onPatientTypeChange}
                patientTypeOptions={patientTypeOptions}
              />
              <InputField
                type="cita"
                componentType="paymentOptions"
                form={form}
                isPaymentRequired={isPaymentRequired}
                paymentOptions={paymentOptions}
                onPaymentOptionChange={onPaymentOptionChange}
              />
              <InputField
                type="cita"
                componentType="paymentMethod"
                form={form}
                isPaymentRequired={isPaymentRequired}
                paymentMethods={paymentMethods}
              />
              <InputField
                type="cita"
                componentType="amountField"
                form={form}
                isPaymentRequired={isPaymentRequired}
                customAmount={customAmount}
              />
              {showHourField && (
                <InputField type="cita" componentType="timeField" form={form} />
              )}
              <div className={styles.bottomCheckboxes}>
                <Checkbox
                  checked={showHourField}
                  onChange={onShowHourFieldChange}
                  className={styles.checkbox}
                >
                  Hora cita
                </Checkbox>
                <Checkbox
                  checked={isPaymentRequired}
                  onChange={onPaymentRequiredChange}
                  className={styles.checkbox}
                >
                  Cita
                </Checkbox>
              </div>
            </>
          )}

          <Form.Item className={styles.buttonGroup}>
            <div className={styles.buttonWrapper}>
              <Button
                htmlType="button"
                className={fields.length > 0 ? styles.buttonCancel : styles.cancelButton}
              >
                Cancelar
              </Button>
              <Button
                htmlType="submit"
                className={fields.length > 0 ? styles.buttonSubmit : styles.submitButton}
                loading={loading}
              >
                {mode === 'edit' ? 'Actualizar' : 'Registrar'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </ConfigProvider>
  );
};

export default FormComponent;
