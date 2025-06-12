import { CheckCircleFilled } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Form,
  Input,
  Select,
  TimePicker,
  theme
} from 'antd';
import { useEffect } from 'react'; // 👈 Añadir esta importación
import styles from '../Input/Input.module.css';

// Importaciones corregidas
import { SelectTypeOfDocument } from '../Select/SelctTypeOfDocument';
import { SelectCountries } from '../Select/SelectCountry';
import { SelectDiagnoses } from '../Select/SelectDiagnoses';
import { SelectPaymentStatus } from '../Select/SelectPaymentStatus';
import SelectPrices from '../Select/SelectPrices'; // Ajusta la ruta según donde esté
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
      return <Form.Item
      label="Metodos de Pago:"
      name="paymentstatus"
      rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <SelectPaymentStatus />
        </Form.Item>

    case 'typeOfDocument':
      return <SelectTypeOfDocument onChange={rest.onChange} />;

    case 'selectPrices':
      return <Form.Item
      label="Opciones de Pago:"
      name="prices"
      rules={[{ required: true, message: 'Este campo es requerido' }]}
      >
        <SelectPrices {...rest} />
        </Form.Item>

    case 'select': // genérico
      return (
        <ConfigProvider
          theme={{
            components: {
              Select: {
                colorPrimary: '#1677ff',
                optionSelectedBg: '#333333',
                colorText: '#fff',
                colorBgElevated: '#444444', // fondo del dropdown
                colorTextPlaceholder: '#aaa',
                controlItemBgHover: '#444444',
                selectorBg: '#444444', // fondo del input
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
          theme={{
            components: {
              DatePicker: {
                panelColor: '#FFFFFFFF', // texto dentro del dropdown (se pone negro en tu pedido)
                colorText: '#FFFFFFFF', // texto del input seleccionado (blanco)
                colorBgElevated: '#444444', // fondo del input seleccionado (oscuro)
                arrowColor: '#FFFFFFFF', // Esto depende de la versión de antd
              },
            },
          }}
        >
          <DatePicker
            {...inputProps}
            style={{ width: '100%', color: '#fff', backgroundColor: '#444444' }}
            dropdownStyle={{ backgroundColor: '#000', color: '#444444' }} // opcional, para asegurar
          />
        </ConfigProvider>
      );
      break;

    case 'cita':
      return <CitaComponents {...rest} />;

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
    rules={[{ message: 'Este campo es requerido' }]}
    className={styles.formItem}
  >
    <ConfigProvider
          theme={{
            components: {
              DatePicker: {
                panelColor: '#FFFFFFFF', // texto dentro del dropdown (se pone negro en tu pedido)
                colorText: '#FFFFFFFF', // texto del input seleccionado (blanco)
                colorBgElevated: '#444444', // fondo del input seleccionado (oscuro)
                arrowColor: '#FFFFFFFF', // Esto depende de la versión de antd
              },
            },
          }}
        >
          <DatePicker
            style={{ width: '100%', color: '#fff', backgroundColor: '#444444' }}
            dropdownStyle={{ backgroundColor: '#000', color: '#444444' }} // opcional, para asegurar
          />
        </ConfigProvider>
  </Form.Item>
);

const PatientField = ({
  form,
  patientType,
  onPatientTypeChange,
  patientTypeOptions,
  onOpenCreateModal,
  onOpenSelectModal,
  selectedPatient,
}) => {
  // Usa useFormInstance como fallback si form no está disponible
  const formInstance = form || Form.useFormInstance();
  
  // Actualizar el valor del campo cuando cambia el paciente seleccionado
  useEffect(() => {
    if (formInstance && selectedPatient) {
      formInstance.setFieldsValue({
        pacienteId: selectedPatient.full_name,
        patient_id: selectedPatient.id
      });
    }
  }, [selectedPatient, formInstance]);

  return (
    <div className={styles.patientRow}>
      <div className={styles.patientContainer}>
        {/* Input de paciente */}
        <div className={styles.patientInputContainer}>
          <Form.Item
            label="Paciente"
            name="pacienteId"
            rules={[{ required: true, message: 'Este campo es requerido' }]}
            className={styles.formItem}
            style={{ marginBottom: '-30px', marginTop: '-10px' }}
          >
            <Input 
              className={styles.inputStyle} 
              value={selectedPatient ? selectedPatient.full_name : ''}
              readOnly 
            />
          </Form.Item>
          {/* Campo oculto para el ID del paciente */}
          <Form.Item name="patient_id" hidden>
            <Input />
          </Form.Item>
        </div>

        {/* Botón Crear/Elegir */}
        <div className={styles.patientButtonContainer}>
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
};

const TimeField = ({ form }) => (
  <Form.Item
    label="Hora de cita"
    name="horaCita"
    rules={[{  message: 'Este campo es requerido' }]}
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
