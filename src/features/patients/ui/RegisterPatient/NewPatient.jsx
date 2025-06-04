import FormGenerator from '../../../../components/Form/Form';

const fields = [
  { type: 'title', label: 'Nuevo Paciente' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'document_type_id',
        label: 'Tipo de Documento',
        type: 'typeOfDocument', // este va directo al switch
        span: 8,
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
      { name: 'paternal_lastname', label: 'Apellido Paterno', type: 'text', required: true, span: 8 },
      { name: 'maternal_lastname', label: 'Apellido Materno', type: 'text', span: 8 },
      { name: 'name', label: 'Nombre', type: 'text', required: true, span: 8 },
    ],
  },
  {
    type: 'customRow',
    fields: [
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
    ],
  },
  { type: 'title', label: 'Información de contacto' },
  {
    type: 'customRow',
    fields: [
      { name: 'primary_phone', label: 'Teléfono', type: 'text', required: true, span: 8 },
      { name: 'email', label: 'Correo Electrónico', type: 'email', span: 16 },
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

const NewPatient = () => {
  return <FormGenerator fields={fields} mode="create" />;
};

export default NewPatient;
