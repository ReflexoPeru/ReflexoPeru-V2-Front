import { CheckCircleFilled } from '@ant-design/icons';
import { Button, Checkbox, DatePicker, Form, Input, InputNumber, Select, TimePicker } from 'antd';
import { useEffect } from 'react';
import styles from '../Input/Input.module.css';

// Importaciones corregidas
import { SelectTypeOfDocument } from '../Select/SelctTypeOfDocument';
import { SelectCountries } from '../Select/SelectCountry';
import { SelectDepartament } from '../Select/SelectDepartament';
import { SelectDiagnoses } from '../Select/SelectDiagnoses';
import { SelectDistrit } from '../Select/SelectDistrit';
import { SelectPaymentStatus } from '../Select/SelectPaymentStatus';
import { SelectProvince } from '../Select/SelectProvince';
import SelectUbigeoCascader from '../Select/SelectUbigeoCascader';

// ... importar los demás componentes Select
const { Option } = Select;

// Componente principal
const InputField = ({
  type,
  form,
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
    case 'selestCountry':
      return <SelectCountries />;

    case 'ubigeo':
      return <SelectUbigeoCascader onChange={rest.onChange} />;

//================================================
    case 'departament':
      return (
        <SelectDepartament
          value={rest.value}
          onChange={(departamentoId) => {
            // Guardar el valor y limpiar dependientes
            if (rest.onChange) rest.onChange(departamentoId);
            if (rest.form) {
              rest.form.setFieldsValue({
                provincia: undefined,
                distrito: undefined
              });
            }
          }}
        />
      );
      
    case 'province':
      return (
        <SelectProvince
          key={`province-${rest.form?.getFieldValue('departamento')}`} // Forzar re-render al cambiar departamento
          departamentId={rest.form?.getFieldValue('departamento')}
          value={rest.value}
          onChange={(provinciaId) => {
            if (rest.onChange) rest.onChange(provinciaId);
            if (rest.form) {
              rest.form.setFieldsValue({ distrito: undefined });
            }
          }}
        />
      );
      
    case 'distrit':
      return (
        <SelectDistrit
          key={`distrit-${rest.form?.getFieldValue('provincia')}`} // Forzar re-render al cambiar provincia
          provinceId={rest.form?.getFieldValue('provincia')}
          value={rest.value}
          onChange={rest.onChange}
        />
      );
//================================================
        
    case 'diagnoses':
      return <SelectDiagnoses />;
        
    case 'paymentStatus':
      return <SelectPaymentStatus />;
        
    case 'typeOfDocument':
      return <SelectTypeOfDocument />;

    case 'select': // genérico
      return (
        <Select
          className={styles.inputStyle}
          popupStyle={{ backgroundColor: '#4B4B4B', color: '#FFFFFF' }}
          {...rest}
        >
          {options.map((opt) => (
            <Option key={opt.value} value={opt.value} style={{ color: '#fff' }}>
              {opt.label}
            </Option>
          ))}
        </Select>
      );

    case 'date':
      inputComponent = <DatePicker {...inputProps}  style={{ width: '100%' }}/>;
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
const DateField = ({ form }) => (
  <Form.Item
    label="Fecha de cita"
    name="fechaCita"
    rules={[{ required: true, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <DatePicker className={styles.datePicker} style={{ width: '100%' }} />
  </Form.Item>
);

const PatientField = ({ form, patientType, onPatientTypeChange, patientTypeOptions }) => (
  <div className={styles.patientRow}>
    <div className={styles.patientContainer}>
      {/* Input de paciente */}
      <div className={styles.patientInputContainer}>
        <Form.Item
          label="Paciente"
          name="paciente"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
          className={styles.formItem}
          style={{ marginBottom: 0 }}
        >
          <Input className={styles.inputStyle} />
        </Form.Item>
      </div>

      {/* Botón Crear/Elegir */}
      <div className={styles.patientButtonContainer}>
        <Button 
          type="primary" 
          className={styles.patientButton}
        >
          {patientType === 'nuevo' ? 'Crear' : 'Elegir'}
        </Button>
      </div>

      {/* Checkboxes en columna */}
      <div className={styles.checkboxColumn}>
        {patientTypeOptions.map(option => (
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
const PaymentOptionsField = ({ form, isPaymentRequired, paymentOptions, onPaymentOptionChange }) => (
  <Form.Item
    label="Opciones de pago"
    name="opcionesPago"
    rules={[{ required: isPaymentRequired, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <Select 
      onChange={onPaymentOptionChange} 
      placeholder="Seleccione una opción"
      style={{ width: '100%' }}
      dropdownClassName={styles.selectDropdown} // Añade esta clase
    >
      {paymentOptions.map(option => (
        <Option 
          key={option.value} 
          value={option.value}
          className={styles.selectOption} // Añade esta clase
        >
          {option.label}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

const PaymentMethodField = ({ form, isPaymentRequired, paymentMethods }) => (
  <Form.Item
    label="Método de pago"
    name="metodoPago"
    rules={[{ required: isPaymentRequired, message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <Select placeholder="Seleccione un método" style={{ width: '100%' }}>
      {paymentMethods.map(method => (
        <Option key={method.value} value={method.value}>
          {method.label}
        </Option>
      ))}
    </Select>
  </Form.Item>
);

const AmountField = ({ 
  form, 
  isPaymentRequired, 
  customAmount, 
  paymentOption, 
  paymentOptions 
}) => {
  useEffect(() => {
    if (!paymentOption) return;
    
    const selectedOption = paymentOptions?.find(opt => opt.value === paymentOption);
    
    // Modificación aquí: verificar explícitamente si amount es 0 o no es undefined
    if (selectedOption && !customAmount && (selectedOption.amount === 0 || selectedOption.amount)) {
      form.setFieldsValue({ montoPago: selectedOption.amount });
    } else if (paymentOption === 'custom') {
      form.setFieldsValue({ montoPago: undefined });
    }
  }, [paymentOption, customAmount, form, paymentOptions]);

  return (
    <Form.Item
      label="Monto a pagar"
      name="montoPago"
      rules={[{ 
        required: isPaymentRequired, 
        message: 'Este campo es requerido'
      }]}
      className={styles.formItem}
    >
      <InputNumber 
        className={styles.inputNumber}
        disabled={!customAmount}
        min={0}
        step={10}
        formatter={value => `S/ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={value => value.replace(/S\/\s?|(,*)/g, '')}
        style={{ width: '100%' }}
      />
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
    <TimePicker format="HH:mm" className={styles.datePicker} style={{ width: '100%' }} />
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