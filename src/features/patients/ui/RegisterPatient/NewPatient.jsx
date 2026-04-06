import { notification, Form, Modal, Button as AntdButton, Alert } from 'antd';
import { UndoOutlined, InfoCircleOutlined } from '@ant-design/icons';
import FormGenerator from '../../../../components/Form/Form';
import DNISearchResults from '../../../../components/DNISearchResults/DNISearchResults';
import { usePatients } from '../../hook/patientsHook';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { checkTrashedByDNI, restorePatient } from '../../service/patientsService';

const fields = [
  {
    type: 'title',
    label: 'REGISTRAR PACIENTE',
  },
  {
    type: 'customRow',
    fields: [
      {
        name: 'document_type_id',
        label: 'Tipo de Documento',
        type: 'typeOfDocument',
        span: 8,
        required: true,
        rules: [{ required: true, message: 'El tipo de documento es requerido' }],
      },
      {
        name: 'document_number',
        label: 'Nro Documento',
        type: 'dniSearch',
        required: true,
        span: 8,
        rules: [
          {
            required: true,
            message: 'Por favor ingrese el número de documento',
          },
        ],
      },
    ],
  },
  {
    type: 'customRow',
    fields: [
      {
        name: 'paternal_lastname',
        label: 'Apellido Paterno',
        type: 'text',
        required: true,
        span: 8,
        rules: [{ required: true, message: 'El apellido paterno es requerido' }],
      },
      {
        name: 'maternal_lastname',
        label: 'Apellido Materno',
        type: 'text',
        span: 8,
      },
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        required: true,
        span: 8,
        rules: [{ required: true, message: 'el nombre es requerido' }],
      },
    ],
  },
  {
    type: 'customRow',
    fields: [
      {
        name: 'birth_date',
        label: 'Fecha de Nacimiento',
        type: 'date',
        span: 8,
        required: true,
        rules: [{ required: true, message: 'La fecha de nacimiento es requerida' }],
      },
      {
        name: 'sex',
        label: 'Sexo',
        type: 'select',
        options: [
          { value: 'M', label: 'Masculino' },
          { value: 'F', label: 'Femenino' },
        ],
        span: 8,
        required: true,
        rules: [{ required: true, message: 'El sexo es requerido' }],
      },
      {
        name: 'occupation',
        label: 'Ocupación',
        type: 'text',
        span: 8,
        capitalize: 'first',
      },
    ],
  },
  { type: 'title', label: 'Información de contacto' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'primary_phone',
        label: 'Teléfono',
        type: 'phoneNumber',
        required: true,
        span: 8,
      },
      {
        name: 'email',
        label: 'Correo Electrónico',
        type: 'email',
        span: 16,
      },
    ],
  },
  {
    name: 'ubicacion',
    label: 'Departamento / Provincia / Distrito',
    type: 'ubigeo',
    span: 12,
  },
  {
    name: 'address',
    label: 'Dirección de Domicilio',
    type: 'text',
    span: 12,
    required: false,
  },
];

const NewPatient = ({ onSubmit, onCancel, isModal = false }) => {
  const { submitNewPatient } = usePatients();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [showDNIResults, setShowDNIResults] = useState(false);
  const [dniSearchData, setDniSearchData] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [trashedPatientInfo, setTrashedPatientInfo] = useState(null);
  const [restoring, setRestoring] = useState(false);

  const getFields = () => {
    if (isModal) {
      return fields.slice(1);
    }
    return fields;
  };

  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    setRestoring(true);
    try {
      // Por defecto restauración completa en este flujo para no perder datos
      await restorePatient(trashedPatientInfo.id, true);
      notification.success({
        message: 'Paciente Restaurado',
        description: 'El paciente ha sido recuperado con éxito.'
      });
      if (onSubmit) onSubmit();
      if (!isModal) navigate('/Inicio/pacientes');
    } catch (e) {
      console.error(e);
      notification.error({ message: 'Error', description: 'No se pudo restaurar el paciente.' });
    } finally {
      setRestoring(false);
      setShowRestorePrompt(false);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      if (
        !formData.document_type_id ||
        !formData.document_number ||
        !formData.paternal_lastname ||
        !formData.name ||
        !formData.birth_date ||
        !formData.sex
      ) {
        notification.error({
          message: 'Error',
          description: 'Tipo de documento, número de documento, apellido paterno, nombre, fecha de nacimiento y sexo son campos obligatorios',
        });
        setLoading(false);
        return;
      }

      const apiData = {
        ...formData,
        paternal_lastname: formData.paternal_lastname,
        maternal_lastname: formData.maternal_lastname,
        ...(formData.ubicacion && {
          region_id: formData.ubicacion.region_id,
          province_id: formData.ubicacion.province_id,
          district_id: formData.ubicacion.district_id,
        }),
      };

      const result = await submitNewPatient(apiData);

      notification.success({
        message: 'Éxito',
        description: 'Paciente creado correctamente',
      });

      if (onSubmit) onSubmit(result);

      if (!isModal) {
        navigate('/Inicio/pacientes');
      }

      return result;
    } catch (error) {
      console.error('Error completo:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('\n');
        notification.error({ message: 'Error de validación', description: errorMessages, duration: 0 });
      } else {
        notification.error({ message: 'Error', description: error.message || 'Error al crear el paciente' });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDNIDataFound = async (data) => {
    const dniInput = form.getFieldValue('document_number');
    if (dniInput) {
      try {
        const trashCheck = await checkTrashedByDNI(dniInput);
        if (trashCheck.is_trashed) {
          setTrashedPatientInfo(trashCheck.patient);
          setShowRestorePrompt(true);
          return;
        }
      } catch (e) {
        console.error("Error al verificar papelera", e);
      }
    }

    if (data) {
      setDniSearchData(data);
      setNoResults(false);
      setShowDNIResults(true);
    } else {
      setDniSearchData(null);
      setNoResults(true);
      setShowDNIResults(true);
    }
  };

  const handleConfirmDNIData = (data) => {
    form.setFieldsValue({
      name: data.name,
      paternal_lastname: data.paternal_lastname,
      maternal_lastname: data.maternal_lastname,
    });
    setShowDNIResults(false);
    setDniSearchData(null);
    notification.success({ message: 'Datos cargados', description: 'Los datos del DNI se han completado automáticamente' });
  };

  const handleCloseDNIResults = () => {
    setShowDNIResults(false);
    setDniSearchData(null);
    setNoResults(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    if (!isModal) navigate('/Inicio/pacientes');
  };

  return (
    <>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {showRestorePrompt && (
          <div style={{ marginBottom: '20px' }}>
            <Alert
              message="Paciente encontrado en papelera"
              description={
                <div>
                  <p>El paciente <strong>{trashedPatientInfo?.full_name}</strong> ya existe pero fue eliminado anteriormente.</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                    <AntdButton 
                      type="primary" 
                      icon={<UndoOutlined />} 
                      onClick={handleRestore}
                      loading={restoring}
                      style={{ backgroundColor: '#059669', borderColor: '#059669' }}
                    >
                      Restaurar ahora
                    </AntdButton>
                    <AntdButton 
                      onClick={() => setShowRestorePrompt(false)}
                      style={{ borderRadius: '8px' }}
                    >
                      Continuar registro nuevo
                    </AntdButton>
                  </div>
                </div>
              }
              type="info"
              showIcon
              icon={<InfoCircleOutlined />}
              closable
              onClose={() => setShowRestorePrompt(false)}
            />
          </div>
        )}
        <FormGenerator
          fields={getFields()}
          onCancel={handleCancel}
          mode="create"
          onSubmit={handleSubmit}
          loading={loading}
          onDNIDataFound={handleDNIDataFound}
          form={form}
          initialValues={{
            document_type_id: "1",
            country_id: 1,
            ubicacion: {
              region_id: 15,
              province_id: 1501,
              district_id: null,
            },
          }}
        />
      </div>

      <DNISearchResults
        visible={showDNIResults}
        patientData={dniSearchData}
        onConfirm={handleConfirmDNIData}
        onClose={handleCloseDNIResults}
        noResults={noResults}
      />
    </>
  );
};

export default NewPatient;
