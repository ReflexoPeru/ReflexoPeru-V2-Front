import FormGenerator from '../../../../components/Form/Form';
import { submitTherapist } from '../../hook/staffHook';

const fields = [
  { type: 'title', label: 'Nuevo Terapista' },
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
      {
        name: 'lastName',
        label: 'Apellido Paterno',
        type: 'text',
        required: true,
        span: 8,
      },
      {
        name: 'motherLastName',
        label: 'Apellido Materno',
        type: 'text',
        span: 8,
      },
      { name: 'name', label: 'Nombre', type: 'text', required: true, span: 8 },
    ],
  },
  { name: 'birthDate', label: 'Fecha de Nacimiento', type: 'date', span: 8 },
  {
    type: 'customRow',
    fields: [
      {
        name: 'apellidoPaterno2',
        label: 'Apellido Paterno',
        type: 'text',
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
      },
      { name: 'personal_reference', label: 'Ocupación', type: 'text', span: 8 },
    ],
  },
  { type: 'title', label: 'Información de contacto' },
  {
    type: 'customRow',
    fields: [
      {
        name: 'phone',
        label: 'Teléfono',
        type: 'text',
        required: true,
        span: 8,
      },
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
  const handleSubmit = async (formData) => {
    try {
      const response = await submitTherapist(formData);
      console.log('Terapeuta creado:', response);
      // agregar toast
    } catch (error) {
      console.error('Error al crear terapeuta:', error);
    }
  };

  return (
    <FormGenerator fields={fields} mode="create" onSubmit={handleSubmit} />
  );
};

export default NewTherapist;
