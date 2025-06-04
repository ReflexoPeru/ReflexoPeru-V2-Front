import FormGenerator from '../../../../components/Form/Form';
import { usePatients } from '../../hook/patientsHook';
import { notification } from 'antd';

const fields = [
  { type: 'title', label: 'Nuevo Paciente' },
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
        type: 'text', 
        required: true, 
        span: 8 
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

const NewPatient = () => {
  const { submitNewPatient } = usePatients();

  const handleSubmit = async (formData) => {
    try {
      // Validación básica de campos requeridos
      if (!formData.document_number || !formData.name || !formData.primary_phone) {
        notification.error({
          message: 'Error',
          description: 'Documento, nombre y teléfono son campos obligatorios'
        });
        return;
      }

      // Transformación de datos para el API
      const apiData = {
        ...formData,
        // Asegurar nombres de campos consistentes
        paternal_lastname: formData.paternal_lastname,
        maternal_lastname: formData.maternal_lastname,
        // Extraer ubicación si existe
        ...(formData.ubicacion && {
          region_id: formData.ubicacion.region_id,
          province_id: formData.ubicacion.province_id,
          district_id: formData.ubicacion.district_id
        })
      };

      console.log('Datos a enviar:', apiData); // Para depuración

      const result = await submitNewPatient(apiData);
      
      notification.success({
        message: 'Éxito',
        description: 'Paciente creado correctamente'
      });
      
      return result;
    } catch (error) {
      console.error('Error completo:', error);
      
      // Mostrar errores de validación del API si existen
      if (error.response?.data?.errors) {
        const errorMessages = Object.entries(error.response.data.errors)
          .map(([field, errors]) => `${field}: ${errors.join(', ')}`)
          .join('\n');
        
        notification.error({
          message: 'Error de validación',
          description: errorMessages,
          duration: 0 // Permite que el mensaje permanezca hasta que el usuario lo cierre
        });
      } else {
        notification.error({
          message: 'Error',
          description: error.message || 'Error al crear el paciente'
        });
      }
      
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
        country_id: 1 // Valor por defecto
      }}
    />
  );
};

export default NewPatient;