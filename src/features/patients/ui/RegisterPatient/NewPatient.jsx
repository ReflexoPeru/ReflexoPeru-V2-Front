import FormGenerator from '../../../../components/Form/Form';
import { usePatient } from '../../hook/patientHook';

const fields = [
  { type: 'title', label: 'Nuevo paciente' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'document_type',
        label: 'Tipo de Documento',
        type: 'select',
        options: [{ value: 2, label: 'DNI' }],
        span: 8,
      },
      {
        name: 'document_number',
        label: 'N° Documento',
        type: 'text',
        required: true,
        span: 8,
      },
    ],
  },
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
  { name: 'name', label: 'Nombre', type: 'text', required: true, span: 8 },
  { name: 'birth_date', label: 'Fecha de Nacimiento', type: 'date', span: 8 },
  {
    name: 'sex',
    label: 'Sexo',
    type: 'select',
    options: [
      { value: 'M', label: 'Masculino' },
      { value: 'F', label: 'Femenino' },
    ],
    span: 8,
  },
  { name: 'occupation', label: 'Ocupación', type: 'text', span: 8 },
  { type: 'title', label: 'Información de contacto' },
  {
    name: 'primary_phone',
    label: 'Teléfono',
    type: 'text',
    required: true,
    span: 8,
  },
  { name: 'email', label: 'Correo Electrónico', type: 'email', span: 16 },
  { name: 'address', label: 'Dirección de Domicilio', type: 'text', span: 24 },
  {
    name: 'region_id',
    label: 'Departamento',
    type: 'select',
    options: [],
    span: 8,
  },
  {
    name: 'province_id',
    label: 'Provincia',
    type: 'select',
    options: [],
    span: 8,
  },
  {
    name: 'district_id',
    label: 'Distrito',
    type: 'select',
    options: [],
    span: 8,
  },
];

const NewPatient = () => {
  const { submitNewPatient } = usePatient();

  const handleSubmit = async (data) => {
    try {
      const response = await submitNewPatient(data);
      console.log('Paciente creado exitosamente:', response);
    } catch (error) {
      console.error('Error al crear paciente:', error);
    }
  };

  return (
    <FormGenerator fields={fields} mode="create" onSubmit={handleSubmit} />
  );
};

export default NewPatient;
