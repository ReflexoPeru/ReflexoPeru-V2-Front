import { notification } from 'antd';
import FormGenerator from '../../../../components/Form/Form';
import { usePatients } from '../../hook/patientsHook';
import { useNavigate } from 'react-router';

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
        rules: [
          {
            required: true,
            message: 'Por favor ingrese su número telefónico',
          },
          () => ({
            validator(_, value) {
              if (!value) {
                return Promise.reject(
                  new Error('Por favor ingrese su teléfono'),
                );
              }
              return Promise();
            },
          }),
        ],
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
    required: true,
  },
];

const NewPatient = ({ onSubmit, onCancel, isModal = false }) => {
  const { submitNewPatient } = usePatients();
  const navigate = useNavigate();

  // Filtrar el título cuando se usa en modal
  const getFields = () => {
    if (isModal) {
      // Remover el primer campo que es el título "REGISTRAR PACIENTE"
      return fields.slice(1);
    }
    return fields;
  };

  const handleSubmit = async (formData) => {
    try {
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
      
      // Solo navegar si no es un modal
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

        notification.error({
          message: 'Error de validación',
          description: errorMessages,
          duration: 0,
        });
      } else {
        notification.error({
          message: 'Error',
          description: error.message || 'Error al crear el paciente',
        });
      }

      throw error;
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    // Solo navegar si no es un modal
    if (!isModal) {
      navigate('/Inicio/pacientes');
    }
  };

  return (
    <FormGenerator
      fields={getFields()}
      onCancel={handleCancel}
      mode="create"
      onSubmit={handleSubmit}
      initialValues={{
        document_type_id: "1", // DNI por defecto (string)
        country_id: 1,
        ubicacion: {
          region_id: 15, // Lima
          province_id: 1501, // Lima
          district_id: null, // El usuario seleccionará el distrito
        },
      }}
    />
  );
};

export default NewPatient;
