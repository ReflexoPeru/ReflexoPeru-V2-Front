import FormGenerator from '../../../../components/Form/Form';
import { useStaff } from '../../hook/staffHook';
import { notification } from 'antd';
import { useToast } from '../../../../services/toastify/ToastContext';

const { showToast } = useToast();

const fields = [
  { type: 'title', label: 'Nuevo Terapista' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'document_type_id',
        label: 'Tipo de Documento',
        type: 'typeOfDocument',
        span: 8,
        required: true,
      },
      {
        name: 'document_number',
        label: 'Nro Documento',
        type: 'text',
        required: true,
        span: 8,
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
      },
      {
        name: 'personal_reference',
        label: 'Referencia Personal',
        type: 'text',
        span: 8,
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
        type: 'text',
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
    label: 'Ubicación',
    type: 'ubigeo',
    span: 12,
  },
  {
    name: 'address',
    label: 'Dirección de Domicilio',
    type: 'text',
    span: 12,
  },
];

const NewTherapist = () => {
  const { submitNewTherapist } = useStaff();

  const handleSubmit = async (formData) => {
    console.log('📝 Formulario enviado:', formData);

    try {
      // Validación básica de campos requeridos
      if (
        !formData.document_number ||
        !formData.name ||
        !formData.primary_phone
      ) {
        notification.error({
          message: 'Error',
          description: 'Documento, nombre y teléfono son campos obligatorios',
        });
        return;
      }

      const result = await submitNewTherapist(formData);
      console.log('🎉 Terapeuta creado con éxito:', result);
      return result;
    } catch (error) {
      console.error('❌ Error al crear terapeuta:', error);
      throw error;
    }
  };

  return (
    <FormGenerator
      fields={fields}
      mode="create"
      onSubmit={handleSubmit}
      initialValues={{
        document_type_id: 1, // Valor por defecto
      }}
    />
  );
};

export default NewTherapist;
