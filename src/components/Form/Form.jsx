import { Button, Col, ConfigProvider, Form, Row } from 'antd';
import { useState } from 'react';
import styles from '../Form/Form.module.css';
import InputField from '../Input/Input';

const { useForm } = Form;

const FormComponent = ({
  fields = [],
  mode = 'create',
  showHourField = false,
  isPaymentRequired = true,
  patientType = '',
  paymentOption = '',
  customAmount = '',
  xd,
  onPaymentOptionChange = () => {},
  onPatientTypeChange = () => {},
  onShowHourFieldChange = () => {},
  onPaymentRequiredChange = () => {},
  onSubmit = () => {},
  onOpenCreateModal = () => {}, // Nueva prop para abrir modal de creación
  onOpenSelectModal = () => {}, // Nueva prop para abrir modal de selección
  form: externalForm,
}) => {
  const [internalForm] = useForm();
  const form = externalForm || internalForm;
  const [loading, setLoading] = useState(false);
  const [isPhoneRequired, setIsPhoneRequired] = useState(true);

  const togglePhoneRequired = () => {
    setIsPhoneRequired((prev) => !prev);
    form.validateFields(['primary_phone']);
  };

  const renderField = (field, index) => {
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
              renderField(subField, `${index}-${subIndex}`),
            )}
          </Row>
        </Col>
      );
    }

    if (field.type === 'customComponent') {
      if (field.show === 'showHourField' && !showHourField) return null;

      return (
        <Col span={field.span || 24} key={index}>
          <InputField
            type="cita"
            componentType={field.componentType}
            form={form}
            {...field.props}
            showHourField={showHourField}
            isPaymentRequired={isPaymentRequired}
            patientType={patientType}
            paymentOption={paymentOption}
            customAmount={customAmount}
            paymentOptions={field.props?.paymentOptions}
            onPatientTypeChange={onPatientTypeChange}
            onPaymentOptionChange={onPaymentOptionChange}
            onShowHourFieldChange={onShowHourFieldChange}
            onPaymentRequiredChange={onPaymentRequiredChange}
            // Usamos las nuevas props para abrir modales
            onOpenCreateModal={onOpenCreateModal}
            onOpenSelectModal={onOpenSelectModal}
          />
        </Col>
      );
    }

    const isPhoneField = field.name === 'primary_phone';
    return (
      <Col span={field.span || 8} key={index}>
        <Form.Item
          name={field.name}
          label={<span className={styles.label}>{field.label}</span>}
          className={styles.formItem}
          rules={
            isPhoneField
              ? [
                  ...(isPhoneRequired
                    ? [
                        {
                          required: true,
                          message: 'Por favor ingrese su teléfono',
                        },
                      ]
                    : []),
                  () => ({
                    validator(_, value) {
                      if (!value || (value && value.length === 9)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('El teléfono debe tener 9 dígitos'),
                      );
                    },
                  }),
                ]
              : field.rules
          }
        >
          <InputField
            type={isPhoneField ? 'phoneNumber' : field.type}
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
        <Form
          form={form}
          layout="vertical"
          onFinish={xd}
          className={styles.formContainer}
        >
          <Row gutter={[20, 0]}>
            {fields.map((field, index) => renderField(field, index))}
          </Row>

          <Form.Item className={styles.buttonGroup}>
            <div className={styles.buttonWrapper}>
              <Button htmlType="button" className={styles.buttonCancel}>
                Cancelar
              </Button>
              <Button
                htmlType="submit"
                className={styles.buttonSubmit}
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