import { CheckCircleFilled } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Radio,
  Select,
  TimePicker,
  theme,
  Row,
  Col,
} from 'antd';
import esES from 'antd/locale/es_ES';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import styles from '../Input/Input.module.css';
import { useEffect } from 'react';

// Importaciones corregidas
import { SelectTypeOfDocument } from '../Select/SelctTypeOfDocument';
import { SelectCountries } from '../Select/SelectCountry';
import { SelectDiagnoses } from '../Select/SelectDiagnoses';
import { SelectPaymentStatus } from '../Select/SelectPaymentStatus';
import SelectPrices from '../Select/SelectPrices';
import SelectUbigeoCascader from '../Select/SelectUbigeoCascader';

// Fijar locale global en español para dayjs (utilizado por AntD DatePicker/TimePicker)
dayjs.locale('es');

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
      return (
        <Form.Item
          name="ubicacion"
          rules={[
            { required: true, message: 'Por favor seleccione la ubicación' },
          ]}
        >
          <SelectUbigeoCascader value={rest.value} onChange={rest.onChange} />
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
          maxLength={9}
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
        <SelectTypeOfDocument value={rest.value} onChange={rest.onChange} />
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
            const value = e.target.value.toUpperCase();
            if (rest.onChange) rest.onChange(value);
            if (form && rest.name) {
              form.setFieldValue(rest.name, value);
            }
          }}
        />
      );
      break;

    case 'select':
      return (
        <ConfigProvider
          theme={{
            components: {
              Select: {
                colorPrimary: '#1677ff',
                optionSelectedBg: '#333333',
                colorText: '#fff',
                colorBgElevated: '#444444',
                colorTextPlaceholder: '#aaa',
                controlItemBgHover: '#444444',
                selectorBg: '#444444',
              },
            },
            token: {
              colorTextBase: '#fff',
            },
          }}
        >
          <Select
            className={styles.inputStyle}
            dropdownStyle={{ backgroundColor: '#444444', color: '#fff' }}
            style={{ color: '#fff', backgroundColor: '#1a1a1a' }}
            {...rest}
          >
            {options.map((opt) => (
              <Option
                key={opt.value}
                value={opt.value}
                style={{ color: '#fff' }}
              >
                {opt.label}
              </Option>
            ))}
          </Select>
        </ConfigProvider>
      );

    case 'date':
      inputComponent = (
        <ConfigProvider
          locale={esES}
          theme={{
            components: {
              DatePicker: {
                colorBgElevated: '#3B3B3BFF',
                colorText: '#ffffff',
                colorTextHeading: '#ffffff',
                colorIcon: '#ffffff',
                colorPrimary: '#1cb54a',
                colorPrimaryHover: '#148235',
                cellHoverBg: '#333333',
              },
            },
          }}
        >
          <DatePicker
            {...inputProps}
            style={{
              width: '100%',
              color: '#ffffff',
              backgroundColor: '#424242FF',
              borderColor: '#444444',
            }}
            dropdownStyle={{
              backgroundColor: '#000000',
              color: '#ffffff',
            }}
          />
        </ConfigProvider>
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
      <div style={{
        margin: '0 0 6px 0',
        fontSize: 14,
        fontWeight: 600,
        color: '#ffffff'
      }}>
        Tipos de pacientes
      </div>
      <Row gutter={16} align="bottom" style={{ marginBottom: 12 }}>
        <Col span={12}>
          <ConfigProvider
            theme={{
              components: {
                Radio: {
                  colorPrimary: '#1677ff',
                },
              },
            }}
          >
            <Radio.Group
              value={patientType}
              onChange={(e) => onPatientTypeChange(e.target.value)}
              style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              <Radio value="nuevo" style={{ color: '#ffffff' }}>
                Nuevo
              </Radio>
              <Radio value="continuador" style={{ color: '#ffffff' }}>
                Continuador
              </Radio>
            </Radio.Group>
          </ConfigProvider>
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
            {patientType === 'nuevo' ? 'Crear Paciente' : 'Seleccionar Paciente'}
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
      <ConfigProvider
        locale={esES}
        theme={{
          components: {
            DatePicker: {
              colorBgElevated: '#222222FF',
              colorText: '#ffffff',
              colorTextHeading: '#ffffff',
              colorIcon: '#ffffff',
              colorPrimary: '#1cb54a',
              colorPrimaryHover: '#148235',
              cellHoverBg: '#333333',
            },
          },
        }}
      >
        <DatePicker
          style={{
            width: '100%',
            color: '#ffffff',
            backgroundColor: '#333333FF',
            borderColor: '#444444',
          }}
          format="DD/MM/YYYY"
          placeholder="Seleccione una fecha"
          onChange={handleDateChange}
          defaultValue={dayjs()}
          dropdownStyle={{
            backgroundColor: '#2C2C2CFF',
            color: '#ffffff',
          }}
        />
      </ConfigProvider>
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
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          components: {
            TimePicker: {
              colorTextPlaceholder: '#AAAAAA',
              colorBgContainer: '#333333',
              colorText: '#FFFFFF',
              colorBorder: '#444444',
              hoverBorderColor: '#555555',
              activeBorderColor: '#00AA55',
              colorIcon: '#FFFFFF',
              colorIconHover: '#00AA55',
              colorBgElevated: '#121212',
              colorPrimary: '#00AA55',
              colorTextDisabled: '#333333',
              colorTextHeading: '#FFFFFF',
            },
          },
        }}
      >
        <TimePicker
          format="HH:mm"
          style={{ width: '100%' }}
          onChange={handleTimeChange}
        />
      </ConfigProvider>
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
