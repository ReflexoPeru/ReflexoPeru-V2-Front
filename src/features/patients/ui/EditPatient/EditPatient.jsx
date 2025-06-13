import { Form, Modal, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import FormGenerator from '../../../../components/Form/Form';
import { usePatients } from '../../hook/patientsHook';

// Reutilizamos los mismos campos del formulario de creación
const fields = [
  { type: 'title', label: 'Editar Paciente' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'document_type_id',
        label: 'Tipo de Documento',
        type: 'typeOfDocument',
        span: 8,
        required: true
      },
      {
        name: 'document_number',
        label: 'Nro Documento',
        type: 'documentNumber',
        required: true,
        span: 8,
        rules: [
          { 
            required: true, 
            message: 'Por favor ingrese el número de documento' 
          },
          {
            pattern: /^\d{8,9}$/,
            message: 'El documento debe tener 8 dígitos'
          }
        ]
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
        span: 8 
      },
      { 
        name: 'maternal_lastname', 
        label: 'Apellido Materno', 
        type: 'text', 
        span: 8 
      },
      { 
        name: 'name', 
        label: 'Nombre', 
        type: 'text', 
        required: true, 
        span: 8 
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
        span: 8 
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
        required: true
      },
      { 
        name: 'occupation', 
        label: 'Ocupación', 
        type: 'text', 
        span: 8 
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
        rules: [
          { 
            required: true, 
            message: 'Por favor ingrese su número telefónico' 
          },
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(new Error('Por favor ingrese su teléfono'));
              }
              if (value.length < 9) {
                return Promise.reject(new Error('El teléfono debe tener 9 dígitos'));
              }
              if (value.length > 9) {
                return Promise.reject(new Error('El teléfono debe tener exactamente 9 dígitos'));
              }
              return Promise.resolve();
            },
          }),
        ]
      },
      { 
        name: 'email', 
        label: 'Correo Electrónico', 
        type: 'email', 
        span: 16 
      },
    ],
  },
  {
    name: 'ubicacion',
    label: 'Ubicación',
    type: 'ubigeo',
    span: 12,
  },
  {
    name: 'address',
    label: 'Dirección de Domicilio',
    type: 'text',
    span: 12,
    required: true
  },
];

const EditPatient = ({ patientId, onClose }) => {
  const [form] = Form.useForm(); // Usa Form.useForm directamente de antd
  const { patients, handleUpdatePatient } = usePatients();
  const patientData = patients.find(p => p.id === patientId);

  useEffect(() => {
    if (patientData && form) {
      const formData = {
        ...patientData,
        birth_date: patientData.birth_date ? dayjs(patientData.birth_date) : null,
        occupation: patientData.ocupation,
        ubicacion: {
          region_id: patientData.region_id,
          province_id: patientData.province_id,
          district_id: patientData.district_id
        }
      };
      form.setFieldsValue(formData);
    }
  }, [patientData, form]);

  const handleSubmit = async (formData) => {
    try {
      await handleUpdatePatient(patientId, formData);
      notification.success({
        message: 'Éxito',
        description: 'Paciente actualizado correctamente'
      });
      onClose();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response?.data?.message || 'Error al actualizar el paciente'
      });
    }
  };

  if (!patientData) return null;

  return (
    <Modal
      title="Editar Paciente"
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <FormGenerator 
        form={form}  // Pasa la instancia del formulario
        fields={fields}
        mode="edit"
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default EditPatient;