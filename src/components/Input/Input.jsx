import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, TimePicker } from 'antd';
import styles from '../Input/Input.module.css'; // Asegúrate de que esta ruta sea correcta

const { Option } = Select;

// Componente InputField principal (original)
const InputField = ({
  type,
  label,
  options = [],
  isPhoneField = false,
  isPhoneRequired,
  togglePhoneRequired,
  ...rest
}) => {
  let inputComponent;

  const inputProps = {
    className: styles.inputStyle,
    ...rest,
  };

  switch (type) {
    case 'select':
      inputComponent = (
        <Select
          {...inputProps}
          dropdownStyle={{ backgroundColor: '#444444', color: '#FFFFFF' }}
        >
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value} style={{ color: '#fff' }}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );
      break;

    case 'date':
      inputComponent = <DatePicker {...inputProps} />;
      break;

    case 'textarea':
      inputComponent = <Input.TextArea rows={4} {...inputProps} />;
      break;

    case 'number':
      inputComponent = <Input type="number" {...inputProps} />;
      break;

    case 'email':
      inputComponent = <Input type="email" {...inputProps} />;
      break;

    case 'password':
      inputComponent = <Input.Password {...inputProps} />;
      break;

    case 'cita': // Nuevo caso para componentes específicos de citas
      return <CitaComponents {...rest} />;

    default:
      inputComponent = <Input {...inputProps} />;
      break;
  }

  if (isPhoneField) {
    return (
      <div className={styles.inputWrapper}>
        {inputComponent}
        <CheckCircleFilled
          onClick={togglePhoneRequired}
          title={
            isPhoneRequired
              ? 'Teléfono obligatorio (clic para hacerlo opcional)'
              : 'Teléfono opcional (clic para hacerlo obligatorio)'
          }
          className={styles.icon}
          style={{ color: isPhoneRequired ? '#FFF' : '#aaa' }}
        />
      </div>
    );
  }

  return inputComponent;
};

// Componentes específicos de citas (de ipt.jsx)
const CitaComponents = ({ componentType, ...props }) => {
  switch (componentType) {
    case 'dateField':
      return <DateField {...props} />;
    case 'patientField':
      return <PatientField {...props} />;
    case 'paymentOptions':
      return <PaymentOptionsField {...props} />;
    case 'paymentMethod':
      return <PaymentMethodField {...props} />;
    case 'amountField':
      return <AmountField {...props} />;
    case 'timeField':
      return <TimeField {...props} />;
    default:
      return null;
  }
};

// Definición de los componentes de citas (copiados de ipt.jsx)
const DateField = ({ form }) => (
  <Form.Item
    label="Fecha de cita"
    name="fechaCita"
    rules={[{ required: true, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <DatePicker className={styles.datePicker} />
  </Form.Item>
);

const PatientField = ({ form, patientType, onPatientTypeChange }) => (
  <div className={styles.patientRow}>
    <div className={styles.patientInputContainer}>
      <Form.Item
        label="Paciente"
        name="paciente"
        rules={[{ required: true, message: 'Este campo es requerido' }]}
        className={styles.patientInput}
      >
        <Input />
      </Form.Item>
    </div>

    {patientType && (
      <div className={styles.patientButtonContainer}>
        <Button type="primary" className={styles.patientButton}>
          {patientType === 'nuevo' ? 'Crear' : 'Elegir'}
        </Button>
      </div>
    )}

    <div className={styles.checkboxColumn}>
      {patientTypeOptions.map(option => (
        <Checkbox
          key={option.value}
          checked={patientType === option.value}
          onChange={() => onPatientTypeChange(option.value)}
          className={styles.checkbox}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  </div>
);

const PaymentOptionsField = ({ isPaymentRequired, paymentOptions, onPaymentOptionChange }) => (
  <Form.Item
    label="Opciones de pago"
    name="opcionesPago"
    rules={[{ required: isPaymentRequired, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <Select onChange={onPaymentOptionChange} placeholder="Seleccione una opción">
      {paymentOptions.map(option => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

const PaymentMethodField = ({ isPaymentRequired, paymentMethods }) => (
  <Form.Item
    label="Método de pago"
    name="metodoPago"
    rules={[{ required: isPaymentRequired, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <Select placeholder="Seleccione un método">
      {paymentMethods.map(method => (
        <Option key={method.value} value={method.value}>
          {method.label}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

const AmountField = ({ isPaymentRequired, customAmount }) => (
  <Form.Item
    label="Monto a pagar"
    name="montoPago"
    rules={[{ required: isPaymentRequired, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <InputNumber 
      className={styles.inputNumber} 
      disabled={!customAmount}
      formatter={value => `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      parser={value => value.replace(/S\/\s?|(,*)/g, '')}
    />
  </Form.Item>
);

const TimeField = () => (
  <Form.Item
    label="Hora de cita"
    name="horaCita"
    rules={[{ required: true, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <TimePicker format="HH:mm" className={styles.timePicker} />
  </Form.Item>
);

// Opciones de tipo de paciente
const patientTypeOptions = [
  { label: 'Nuevo', value: 'nuevo' },
  { label: 'Continuador', value: 'continuador' },
];

// Opciones de pago
const paymentOptions = [
  { label: 'Consulta general', value: 'general' },
  { label: 'Control', value: 'control' },
  { label: 'Personalizado', value: 'custom' },
];

// Métodos de pago
const paymentMethods = [
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta', value: 'tarjeta' },
  { label: 'Yape', value: 'yape' },
];


// Exportaciones
export default InputField;
export {
  AmountField, DateField,
  PatientField, patientTypeOptions, PaymentMethodField, paymentMethods, paymentOptions, PaymentOptionsField, TimeField
};

