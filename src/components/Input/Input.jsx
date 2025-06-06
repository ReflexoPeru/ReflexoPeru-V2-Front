import { CheckCircleFilled } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  TimePicker,
  ConfigProvider,
} from 'antd';
import { useEffect } from 'react';
import styles from '../Input/Input.module.css';

const { Option } = Select;

// Componente principal
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

    case 'cita':
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

// Componentes específicos de citas
const CitaComponents = ({ componentType, form, ...props }) => {
  switch (componentType) {
    case 'dateField':
      return <DateField form={form} />;
    case 'patientField':
      return <PatientField form={form} {...props} />;
    case 'paymentOptions':
      return <PaymentOptionsField form={form} {...props} />;
    case 'paymentMethod':
      return <PaymentMethodField form={form} {...props} />;
    case 'amountField':
      return <AmountField form={form} {...props} />;
    case 'timeField':
      return <TimeField form={form} />;
    case 'hourCheckbox':
      return <HourCheckbox {...props} />;
    case 'paymentCheckbox':
      return <PaymentCheckbox {...props} />;
    default:
      return null;
  }
};

// Componentes individuales
// En Input.jsx
const DateField = ({ form }) => (
  <Form.Item
    label="Fecha de cita"
    name="fechaCita"
    rules={[{ required: true, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <ConfigProvider
      theme={{
        components: {
          DatePicker: {
            colorTextPlaceholder: "#AAAAAA",
            colorBgContainer: "#333333",
            colorText: "#FFFFFF",
            colorBorder: "#444444",
            hoverBorderColor: "#555555",
            activeBorderColor: "#00AA55",
            colorIcon: "#FFFFFF",
            colorIconHover:'#00AA55',
            colorBgElevated: '#121212',
            colorPrimary: '#00AA55',
            colorTextDisabled: '#333333',
            colorTextHeading:'#FFFFFF',
            cellHoverBg:'#00AA55',
            colorSplit:'#444444',
          }
        }
      }}
    >
      <DatePicker className={styles.datePicker} style={{ width: '100%' }} />
    </ConfigProvider>
  </Form.Item>
);

const PatientField = ({
  form,
  patientType,
  onPatientTypeChange,
  patientTypeOptions,
}) => (
  <div className={styles.patientRow}>
    <div className={styles.patientContainer}>
      {/* Input de paciente */}
      <div className={styles.patientInputContainer}>
        <Form.Item
          label="Paciente"
          name="pacienteId"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
          className={styles.formItem}
          style={{ marginBottom: 0 }}
        >
          <Input className={styles.inputStyle} disabled />
        </Form.Item>
      </div>

      {/* Botón Crear/Elegir */}
      <div className={styles.patientButtonContainer}>
        <Button type="primary" className={styles.patientButton}>
          {patientType === 'nuevo' ? 'Crear' : 'Elegir'}
        </Button>
      </div>

      {/* Checkboxes en columna */}
      <div className={styles.checkboxColumn}>
        {patientTypeOptions.map((option) => (
          <Checkbox
            key={option.value}
            checked={patientType === option.value}
            onChange={() => onPatientTypeChange(option.value)}
            className={`${styles.checkbox} ${styles.checkboxItem}`}
          >
            {option.label}
          </Checkbox>
        ))}
      </div>
    </div>
  </div>
);
// En el PaymentOptionsField
const PaymentOptionsField = ({
  form,
  isPaymentRequired,
  paymentOptions,
  onPaymentOptionChange,
}) => (
  <Form.Item
    label="Opciones de pago"
    name="opcionesPago"
    rules={[
      { required: isPaymentRequired, message: 'Este campo es requerido' },
    ]}
    className={styles.formItem}
  >
    <ConfigProvider
      theme={{
        components: {
          Select: {
            activeBorderColor: '#1cb54a',
            hoverBorderColor: '#1cb54a',
            colorBgContainer: '#333333',
            colorText: '#ffffff',
            colorBgElevated: '#121212',
            optionSelectedBg: '#1cb54a',
            colorTextPlaceholder: '#AAAAAA',
            optionActiveBg: '#333333',
            colorTextQuaternary: '#AAAAAA',
          }
        }
      }}
    >
      <Select
        onChange={onPaymentOptionChange}
        placeholder="Seleccione una opción"
        style={{ width: '100%' }}
        dropdownClassName={styles.selectDropdown}
      >
        {paymentOptions.map((option) => (
          <Option
            key={option.value}
            value={option.value}
            className={styles.selectOption}
          >
            {option.label}
          </Option>
        ))}
      </Select>
    </ConfigProvider>
  </Form.Item>
);

const PaymentMethodField = ({ form, isPaymentRequired, paymentMethods }) => (
  <Form.Item
    label="Método de pago"
    name="metodoPago"
    rules={[
      { required: isPaymentRequired, message: 'Este campo es requerido' },
    ]}
    className={styles.formItem}
  >
    <ConfigProvider
      theme={{
        components: {
          Select: {
            activeBorderColor: '#1cb54a',
            hoverBorderColor: '#1cb54a',
            colorBgContainer: '#333333',
            colorText: '#ffffff',
            colorBgElevated: '#121212',
            optionSelectedBg: '#1cb54a',
            colorTextPlaceholder: '#AAAAAA',
            optionActiveBg: '#333333',
            colorTextQuaternary: '#AAAAAA',
          }
        }
      }}
    >
      <Select 
        placeholder="Seleccione un método" 
        style={{ width: '100%' }}
      >
        {paymentMethods.map((method) => (
          <Option key={method.value} value={method.value}>
            {method.label}
          </Option>
        ))}
      </Select>
    </ConfigProvider>
  </Form.Item>
);

const AmountField = ({
  form,
  isPaymentRequired,
  customAmount,
  paymentOption,
  paymentOptions,
}) => {
  useEffect(() => {
    if (!paymentOption) return;

    const selectedOption = paymentOptions?.find(
      (opt) => opt.value === paymentOption,
    );

    if (
      selectedOption &&
      !customAmount &&
      (selectedOption.amount === 0 || selectedOption.amount)
    ) {
      form.setFieldsValue({ montoPago: selectedOption.amount });
    } else if (paymentOption === 'custom') {
      form.setFieldsValue({ montoPago: undefined });
    }
  }, [paymentOption, customAmount, form, paymentOptions]);

  return (
    <Form.Item
      label="Monto a pagar"
      name="montoPago"
      rules={[
        {
          required: isPaymentRequired,
          message: 'Este campo es requerido',
        },
      ]}
      className={styles.formItem}
    >
      <ConfigProvider
        theme={{
          components: {
            InputNumber: {
              colorPrimary: '#1cb54a',
              colorText: '#ffffff',
              colorBgContainer: '#333333',
              colorBorder: '#555555',
              colorPrimaryHover: '#1cb54a',
              colorPrimaryActive: '#1cb54a',
              colorIcon: '#AAAAAA',
            }
          }
        }}
      >
        <InputNumber
          className={styles.inputNumber}
          disabled={!customAmount}
          min={0}
          step={10}
          formatter={(value) =>
            `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }
          parser={(value) => value.replace(/S\/\s?|(,*)/g, '')}
          style={{ width: '100%' }}
        />
      </ConfigProvider>
    </Form.Item>
  );
};

const TimeField = ({ form }) => (
  <Form.Item
    label="Hora de cita"
    name="horaCita"
    rules={[{ required: true, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <ConfigProvider
      theme={{
        components: {
          TimePicker: {
            colorTextPlaceholder: "#AAAAAA",
            colorBgContainer: "#333333",
            colorText: "#FFFFFF",
            colorBorder: "#444444",
            borderRadius: 4,
            hoverBorderColor: "#555555",
            activeBorderColor: "#00AA55",
            colorIcon: "#FFFFFF",
            colorIconHover:'#00AA55',
            colorBgElevated: '#121212',
            colorPrimary: '#00AA55',
            colorTextDisabled: '#333333',
            colorTextHeading:'#FFFFFF',
            cellHoverBg:'#00AA55',
            colorSplit:'#444444',
          },
          // Personalización adicional para el panel de tiempo
          TimePanel: {
            cellHoverBg: '#444444',
            cellActiveBg: '#1a3a1a',
            cellHeight: 32,
            cellWidth: 56,
          }
        }
      }}
    >
      <TimePicker
        format="HH:mm"
        className={styles.datePicker}
        style={{ width: '100%' }}
      />
    </ConfigProvider>
  </Form.Item>
);

const HourCheckbox = ({ showHourField, onShowHourFieldChange }) => (
  <Checkbox
    checked={showHourField}
    onChange={onShowHourFieldChange}
    className={styles.checkbox}
  >
    Hora cita
  </Checkbox>
);

const PaymentCheckbox = ({ isPaymentRequired, onPaymentRequiredChange }) => (
  <Checkbox
    checked={!isPaymentRequired}
    onChange={(e) => onPaymentRequiredChange(e)}
    className={styles.checkbox}
  >
    Cita
  </Checkbox>
);

export default InputField;
