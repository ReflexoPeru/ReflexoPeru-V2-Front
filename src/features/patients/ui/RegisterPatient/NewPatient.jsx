import FormGenerator from '../../../../components/Form/Form';
import { usePatient } from '../../hook/patientHook';

const fields = [
  { type: 'title', label: 'Nuevo paciente' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'documentType',
        label: 'Tipo de Documento',
        type: 'select',
        options: [{ value: 'dni', label: 'DNI' }],
        span: 8,
      },
      {
        name: 'documentNumber',
        label: 'N° Documento',
        type: 'text',
        required: true,
        span: 8,
      },
    ],
  },
  {
    name: 'lastName',
    label: 'Apellido Paterno',
    type: 'text',
    required: true,
    span: 8,
  },
  { name: 'motherLastName', label: 'Apellido Materno', type: 'text', span: 8 },
  { name: 'name', label: 'Nombre', type: 'text', required: true, span: 8 },
  {
    name: 'apellidoPaterno2',
    label: 'Apellido Paterno',
    type: 'text',
    span: 8,
  },
  {
    name: 'gender',
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
  { name: 'phone', label: 'Teléfono', type: 'text', required: true, span: 8 },
  { name: 'email', label: 'Correo Electrónico', type: 'email', span: 16 },
  { name: 'address', label: 'Dirección de Domicilio', type: 'text', span: 24 },
  {
    name: 'departamento',
    label: 'Departamento',
    type: 'select',
    options: [],
    span: 8,
  },
  {
    name: 'provincia',
    label: 'Provincia',
    type: 'select',
    options: [],
    span: 8,
  },
  { name: 'distrito', label: 'Distrito', type: 'select', options: [], span: 8 },
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
