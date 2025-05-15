import FormGenerator from '../../components/Form/Form';

const fields = [
  { type: 'title', label: 'Nuevo Terapeuta' },
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
      { name: 'lastName', label: 'Apellido Paterno', type: 'text', required: true, span: 8 },
      { name: 'motherLastName', label: 'Apellido Materno', type: 'text', span: 8 },
      { name: 'name', label: 'Nombre', type: 'text', required: true, span: 8 },
    ],
  },
  {
    type: 'customRow',
    fields: [
      { name: 'apellidoPaterno2', label: 'Apellido Paterno', type: 'text', span: 8 },
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
    ],
  },
  { type: 'title', label: 'Información de contacto' },
  {
    type: 'customRow',
    fields: [
      { name: 'phone', label: 'Teléfono', type: 'text', required: true, span: 8 },
      { name: 'email', label: 'Correo Electrónico', type: 'email', span: 16 },
    ],
  },
  {
    name: 'address',
    label: 'Dirección de Domicilio',
    type: 'text',
    span: 24,
  },
  {
    type: 'customRow',
    fields: [
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
      {
        name: 'distrito',
        label: 'Distrito',
        type: 'select',
        options: [],
        span: 8,
      },
    ],
  },
];

const NewTherapist = () => {
  return <FormGenerator fields={fields} mode="create" />;
};

export default NewTherapist;
