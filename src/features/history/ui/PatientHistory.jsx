import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Typography,
  ConfigProvider,
} from 'antd';
import styles from './PatientHistory.module.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams, useNavigate } from 'react-router-dom';


const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const theme = {
  token: {
    colorPrimary: '#4caf50',
    colorBgContainer: '#222',
    colorText: '#eee',
    colorBorder: '#333',
    colorBgElevated: '#222',
    colorTextHeading: '#4caf50',
    colorTextLabel: '#4caf50',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: 'Arial, sans-serif',
    colorTextLightSolid: '#111',
  },
  components: {
    Button: {
      colorPrimary: '#4caf50',
      colorPrimaryHover: '#388e3c',
      colorPrimaryActive: '#2e7d32',
      defaultBorderColor: '#333',
      defaultColor: '#eee',
      defaultBg: '#333',
      dangerBorderColor: '#f44336',
      dangerColor: '#eee',
      dangerBg: '#f44336',
    },
    Input: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      colorTextDisabled: '#eee',
      activeBorderColor: '#4caf50',
      hoverBorderColor: '#4caf50',
    },
    Select: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      optionSelectedBg: '#2e7d32',
      optionSelectedColor: '#111',
      optionActiveBg: '#333',
    },
    DatePicker: {
      colorBgContainer: '#222',
      colorBorder: '#333',
      colorText: '#eee',
      cellActiveWithRangeBg: '#2e7d32',
      cellHoverBg: '#333',
      panelBg: '#222',
      panelInputBg: '#222',
      colorTextHeading: '#eee',
      colorTextDescription: '#eee',
      colorIcon: '#eee',
      colorIconHover: '#4caf50',
      cellBg: '#222',
      cellColor: '#eee',
      cellActiveBg: '#2e7d32',
      timeColumnBg: '#222',
    },
    Card: {
      colorBgContainer: '#111',
      colorBorderSecondary: '#2e7d32',
    },
    Form: {
      labelColor: '#4caf50',
      itemMarginBottom: 16,
    },
  },
};

const PatientHistory = () => {
  const [form] = Form.useForm();
  const [therapist, setTherapist] = useState(null);
  const [showTherapistDropdown, setShowTherapistDropdown] = useState(false);
  const [startDate, setStartDate] = useState(new Date('2023-08-14'));

  const therapists = [
    'Dr. Juan Pérez',
    'Dra. María González',
    'Dr. Carlos Sánchez',
    'Dra. Laura Martínez',
  ];

  const initialValues = {
    patientName: 'LOPEZ YAMUNAQUE MARIA NERY',
    observationPrivate: '---',
    diagnosticosMedicos: 'VESICULA',
    operaciones: 'Apéndice (2005)',
    medicamentos: 'Paracetamol 500mg\nOmeprazol 20mg',
    dolencias:
      'CABEZA, COLUMNA, ESPALDA, CINTURA, BAJO VIENTRE,PIES, DOLOR EN SACRO, DOLOR EN RODILLAS',
    diagnosticosReflexologia: 'Puntos reflejos activos en zona lumbar',
    observacionesAdicionales: 'Paciente reporta mejoría en dolores de cabeza',
    antecedentesFamiliares: 'Ninguno conocido',
    alergias: 'Ninguna conocida',
    talla: '1.700',
    pesoInicial: '81.000',
    ultimoPeso: '',
    testimonio: 'No',
    gestacion: 'No',
    menstruacion: 'No',
    tipoDIU: '',
  };

  const handleTherapistSelect = () => {
    setShowTherapistDropdown(!showTherapistDropdown);
  };

  const handleTherapistChoose = (selectedTherapist) => {
    setTherapist(selectedTherapist);
    setShowTherapistDropdown(false);
    form.setFieldsValue({ therapist: selectedTherapist });
  };

  const handleRemoveTherapist = () => {
    setTherapist(null);
    form.setFieldsValue({ therapist: '' });
  };

  const onFinish = (values) => {
    console.log('Valores del formulario:', values);
  };

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.container}>
        <Card className={styles.card}>
          <Title level={2} className={styles.title}>
            Detalles del Historial
          </Title>

          <Form
            form={form}
            initialValues={initialValues}
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            className={styles.form}
          >
            <Form.Item
              name="patientName"
              label="Paciente"
              className={styles.formItem}
            >
              <Input disabled className={styles.input} />
            </Form.Item>

            <Form.Item
              name="observationPrivate"
              label="Observación"
              className={styles.formItem}
            >
              <TextArea rows={2} className={styles.textarea} />
            </Form.Item>

            <Title level={3} className={styles.sectionTitle}>
              Citas
            </Title>

            <Form.Item label="Fecha de la Cita" className={styles.formItem}>
              <Input value="2025-01-31" disabled className={styles.input} />
            </Form.Item>

            <Form.Item
              name="therapist"
              label="Terapeuta"
              className={styles.formItem}
            >
              <div className={styles.therapistContainer}>
                <Input
                  disabled
                  value={therapist || 'No se ha seleccionado terapeuta'}
                  className={styles.input}
                />
                <div className={styles.therapistButtons}>
                  <Button
                    type="primary"
                    onClick={handleTherapistSelect}
                    className={styles.selectButton}
                  >
                    Seleccionar
                  </Button>
                  {therapist && (
                    <Button
                      danger
                      onClick={handleRemoveTherapist}
                      className={styles.removeButton}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
                {showTherapistDropdown && (
                  <div className={styles.therapistDropdown}>
                    {therapists.map((t) => (
                      <div
                        key={t}
                        className={styles.dropdownItem}
                        onClick={() => handleTherapistChoose(t)}
                      >
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Item>

            <div className={styles.threeColumnLayout}>
              <div className={styles.column}>
                <Form.Item
                  name="diagnosticosMedicos"
                  label="Diagnósticos médicos"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="dolencias"
                  label="Dolencias"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="medicamentos"
                  label="Medicamentos"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.threeColumnLayout}>
              <div className={styles.column}>
                <Form.Item
                  name="operaciones"
                  label="Operaciones"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="observacionesAdicionales"
                  label="Observaciones"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>

              <div className={styles.column}>
                <Form.Item
                  name="diagnosticosReflexologia"
                  label="Diagnósticos de Reflexología"
                  className={styles.formItem}
                >
                  <TextArea rows={3} className={styles.diagnosticTextArea} />
                </Form.Item>
              </div>
            </div>

            <div className={styles.physicalInfoRow}>
              <Form.Item
                name="talla"
                label="Talla"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="pesoInicial"
                label="Peso Inicial"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="ultimoPeso"
                label="Último Peso"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>

              <Form.Item
                name="testimonio"
                label="Testimonio"
                className={styles.physicalInfoItem}
              >
                <Select className={styles.select}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="gestacion"
                label="Gestación"
                className={styles.physicalInfoItem}
              >
                <Select className={styles.select}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="menstruacion"
                label="Menstruación"
                className={styles.physicalInfoItem}
              >
                <Select className={styles.select}>
                  <Option value="Sí">Sí</Option>
                  <Option value="No">No</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="tipoDIU"
                label="Tipo DIU"
                className={styles.physicalInfoItem}
              >
                <Input className={styles.input} />
              </Form.Item>
            </div>

            <div className={styles.bottomSection}>
              <Form.Item
                name="fechaInicio"
                label="Fecha de Inicio"
                className={styles.startDateSection}
              >
                <DatePicker
                  className={styles.datePicker}
                  value={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </Form.Item>

              <div className={styles.actionButtons}>
                <Button className={styles.printButton}>Imprimir Ticket</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  className={styles.saveButton}
                >
                  Guardar Cambios
                </Button>
                <Button className={styles.cancelButton}>Cancelar</Button>
              </div>
            </div>
          </Form>
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default PatientHistory;
