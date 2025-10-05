import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  TimePicker,
  Row,
  Col,
  Tooltip,
} from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from '../../utils/dayjsConfig';
import styles from '../Input/Input.module.css';
import DNISearchInput from './DNISearchInput';

// Importaciones corregidas
import SelectTypeOfDocument from '../Select/SelctTypeOfDocument';
import { SelectCountries } from '../Select/SelectCountry';
import { SelectDiagnoses } from '../Select/SelectDiagnoses';
import { SelectPaymentStatus } from '../Select/SelectPaymentStatus';
import SelectPrices from '../Select/SelectPrices';
import SelectUbigeoCascader from '../Select/SelectUbigeoCascader';

// dayjs ya está configurado globalmente

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
  capitalize = true,
  name,
  searchType = 'patient',
  ...rest
}) => {
  let inputComponent;
  
  // Obtener el valor del formulario si no se pasa explícitamente
  const fieldValue = rest.value !== undefined ? rest.value : (form && name ? form.getFieldValue(name) : undefined);

  const inputProps = {
    className: styles.inputStyle,
    ...rest,
  };

  switch (type) {
    case 'selestCountry':
      return <SelectCountries />;

    case 'ubigeo':
      return (
        <Form.Item
          name="ubicacion"
          rules={[
            { required: true, message: 'Por favor seleccione la ubicación' },
          ]}
        >
          <SelectUbigeoCascader value={fieldValue} onChange={rest.onChange} />
        </Form.Item>
      );

    case 'documentNumber':
      inputComponent = (
        <Input
          {...inputProps}
          onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          onChange={(e) => {
            const cleanValue = e.target.value.replace(/\D/g, '');
            e.target.value = cleanValue;
            if (rest.onChange) rest.onChange(cleanValue);
          }}
          maxLength={9}
        />
      );
      break;

    case 'dniSearch':
      inputComponent = (
        <DNISearchInput
          {...inputProps}
          value={fieldValue}
          onChange={rest.onChange}
          onDataFound={rest.onDataFound}
          placeholder={rest.placeholder || "Ingrese el DNI (8 dígitos)"}
          disabled={rest.disabled}
          searchType={searchType}
        />
      );
      break;

    case 'phoneNumber':
      inputComponent = (
        <Input
          {...inputProps}
          onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          onChange={(e) => {
            const cleanValue = e.target.value.replace(/\D/g, '');
            e.target.value = cleanValue;
            if (rest.onChange) rest.onChange(cleanValue);
          }}
        />
      );
      break;

    case 'diagnoses':
      return <SelectDiagnoses />;

    case 'paymentStatus':
      return (
        <Form.Item
          label="Metodos de Pago:"
          name="payment"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <SelectPaymentStatus />
        </Form.Item>
      );

    case 'typeOfDocument':
      return (
        <SelectTypeOfDocument value={fieldValue} onChange={rest.onChange} />
      );

    case 'selectPrices':
      return (
        <Form.Item
          label="Opciones de Pago:"
          name="payment_type_id"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
        >
          <SelectPrices hidePriceInput={rest.hidePriceInput} {...rest} />
        </Form.Item>
      );

    case 'email':
      inputComponent = (
        <Input
          {...inputProps}
          type="email"
          onChange={(e) => {
            const value = e.target.value;
            if (rest.onChange) rest.onChange(value);
          }}
        />
      );
      break;

    case 'text':
      if (rest.name === 'payment' && rest.hidePaymentInput) {
        return <input type="hidden" name="payment" value={rest.value || ''} />;
      }
      inputComponent = (
        <Input
          {...inputProps}
          onChange={(e) => {
            let value = e.target.value;
            if (capitalize === true) {
              value = value.toUpperCase();
            } else if (capitalize === 'first') {
              value =
                value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
            }
            if (rest.onChange) rest.onChange(value);
            if (
              form &&
              rest.name &&
              typeof form.setFieldsValue === 'function'
            ) {
              form.setFieldsValue({ [rest.name]: value });
            }
          }}
        />
      );
      break;

    case 'select':
      return (
        <Select
          className={styles.inputStyle}
          {...rest}
        >
          {options.map((opt) => (
            <Option
              key={opt.value}
              value={opt.value}
            >
              {opt.label}
            </Option>
          ))}
        </Select>
      );

    case 'date':
      inputComponent = (
        <DatePicker
          {...inputProps}
          format="DD-MM-YYYY"
          style={{
            width: '100%',
          }}
        />
      );
      break;

    case 'cita':
      return <CitaComponents {...rest} />;

    case 'manualPayment':
      return (
        <Form.Item
          name={rest.name}
          label="Monto"
          rules={[{ required: true, message: 'El monto es requerido' }]}
        >
          <Input
            value={rest.value}
            onChange={(e) =>
              rest.form.setFieldsValue({ [rest.name]: e.target.value })
            }
            prefix="S/"
            placeholder="S/ 0.00"
          />
        </Form.Item>
      );

    case 'paymentMethod':
      return (
        <Form.Item
          name={rest.name}
          label="Método de Pago"
          rules={[
            { required: true, message: 'El método de pago es requerido' },
          ]}
          style={{ marginTop: 8, marginBottom: 8 }}
        >
          <SelectPaymentStatus
            value={rest.value}
            onChange={(value) =>
              rest.form.setFieldsValue({ [rest.name]: value })
            }
            placeholder="Selecciona método de pago"
          />
        </Form.Item>
      );

    case 'hidden':
      return <input type="hidden" name={rest.name} value={rest.value || ''} />;

    default:
      inputComponent = <Input {...inputProps} />;
      break;
  }

  if (isPhoneField) {
    const phoneInput = (
      <Input
        {...inputProps}
        onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
        onChange={(e) => {
          const cleanValue = e.target.value.replace(/\D/g, '');
          e.target.value = cleanValue;
          if (rest.onChange) rest.onChange(cleanValue);
        }}
        maxLength={9}
      />
    );

    return (
      <div className={styles.inputWrapper}>
        {phoneInput}
        {isPhoneRequired ? (
          <Tooltip 
            title="Teléfono obligatorio (clic para hacerlo opcional)" 
            placement="top"
            color="#333333"
            overlayInnerStyle={{
              color: '#ffffff',
              backgroundColor: '#333333',
              border: '1px solid #555555'
            }}
          >
            <CheckCircleFilled
              onClick={togglePhoneRequired}
              className={styles.icon}
              style={{ 
                color: 'var(--color-primary)',
                backgroundColor: 'var(--color-primary-light)'
              }}
            />
          </Tooltip>
        ) : (
          <Tooltip 
            title="Teléfono opcional (clic para hacerlo obligatorio)" 
            placement="top"
            color="#333333"
            overlayInnerStyle={{
              color: '#ffffff',
              backgroundColor: '#333333',
              border: '1px solid #555555'
            }}
          >
            <CloseCircleFilled
              onClick={togglePhoneRequired}
              className={styles.icon}
              style={{ 
                color: 'var(--color-text-tertiary)',
                backgroundColor: 'var(--color-background-tertiary)'
              }}
            />
          </Tooltip>
        )}
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
    case 'timeField':
      return <TimeField form={form} />;
    case 'hourCheckbox':
      return <HourCheckbox {...props} />;
    case 'paymentCheckbox':
      return <PaymentCheckbox {...props} />;
    case 'paymentMethodField':
      // Renderiza el componente personalizado pasado por props
      const PaymentComponent = props.component;
      return (
        <Form.Item
          label="Método de Pago"
          name="payment_method_id"
          rules={[{ required: true, message: 'Este campo es requerido' }]}
          style={{ marginTop: 8, marginBottom: 8 }}
        >
          <PaymentComponent />
        </Form.Item>
      );
    case 'spacer':
      // Espacio visual en blanco
      return <div style={{ height: props.height || 32 }} />;
    default:
      return null;
  }
};

// Componentes individuales
const PatientField = ({
  form,
  patientType,
  onPatientTypeChange,
  patientTypeOptions,
  onOpenCreateModal,
  selectedPatient,
  changeSelectedPatient,
  onOpenSelectModal,
  required = false,
}) => {
  const formInstance = form || Form.useFormInstance();

  return (
    <div className={styles.patientRow}>
      {/* Subtítulo y opciones de Tipo de Paciente */}
      <div
        style={{
          margin: '0 0 6px 0',
          fontSize: 14,
          fontWeight: 600,
          color: '#ffffff',
        }}
      >
        Tipos de pacientes
      </div>
      <Row gutter={16} align="bottom" style={{ marginBottom: 12 }}>
        <Col span={12}>
          <Radio.Group
            value={patientType}
            onChange={(e) => onPatientTypeChange(e.target.value)}
            style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
          >
            <Radio value="nuevo">
              Nuevo
            </Radio>
            <Radio value="continuador">
              Continuador
            </Radio>
          </Radio.Group>
        </Col>
        <Col span={12}>
          <Button
            type="primary"
            className={styles.patientButton}
            onClick={() => {
              if (patientType === 'nuevo') {
                onOpenCreateModal();
              } else {
                onOpenSelectModal();
              }
            }}
          >
            {patientType === 'nuevo'
              ? 'Crear Paciente'
              : 'Seleccionar Paciente'}
          </Button>
        </Col>
      </Row>

      {/* Campo Paciente debajo de los checkboxes */}
      <Row gutter={16} align="bottom">
        <Col span={24}>
          <Form.Item
            label="Paciente"
            rules={[{ required: required, message: 'Este campo es requerido' }]}
            required={required}
            className={styles.formItem}
            style={{ marginBottom: 8 }}
          >
            <InputField
              readonly={true}
              type="text"
              value={
                selectedPatient?.concatenatedName ||
                selectedPatient?.full_name ||
                ''
              }
              onChange={(e) => changeSelectedPatient(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="patient_id" hidden>
            <Input />
          </Form.Item>
        </Col>
      </Row>
    </div>
  );
};

const DateField = ({ form }) => {
  const formInstance = form || Form.useFormInstance();

  const handleDateChange = (date, dateString) => {
    console.log('Fecha seleccionada:', dateString);
    formInstance.setFieldsValue({
      appointment_date: date || null,
    });
  };

  // No controlar el componente: usaremos defaultValue del DatePicker

  return (
    <Form.Item
      label="Fecha de cita"
      name="appointment_date"
      rules={[{ required: true, message: 'Este campo es requerido' }]}
      className={styles.formItem}
      style={{ marginBottom: 0 }}
    >
      <DatePicker
        format="DD/MM/YYYY"
        style={{
          width: '100%',
        }}
        placeholder="Seleccione una fecha"
        onChange={handleDateChange}
        defaultValue={dayjs()}
      />
    </Form.Item>
  );
};

const TimeField = ({ form }) => {
  const formInstance = form || Form.useFormInstance();

  const handleTimeChange = (time, timeString) => {
    formInstance.setFieldsValue({
      appointment_hour: timeString,
    });
  };

  return (
    <Form.Item
      label="Hora de cita"
      name="appointment_hour"
      rules={[{ required: true, message: 'Este campo es requerido' }]}
      className={styles.formItem}
    >
      <TimePicker
        format="HH:mm"
        style={{ width: '100%' }}
        onChange={handleTimeChange}
      />
    </Form.Item>
  );
};

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
