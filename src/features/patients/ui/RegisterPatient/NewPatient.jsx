import { notification } from 'antd';
import FormGenerator from '../../../../components/Form/Form';
import { usePatients } from '../../hook/patientsHook';
import { useNavigate } from 'react-router';

const fields = [
  { type: 'title', label: 'NUEVO PACIENTE' },
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
          {
            pattern: /^\d{8,9}$/,
            message: 'El documento debe tener 8 dígitos',
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
      },
    ],
  },
  { type: 'title', label: 'INFORMACION DE CONTACTO' },
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
              if (value.length < 9) {
                return Promise.reject(
                  new Error('El teléfono debe tener 9 dígitos'),
                );
              }
              if (value.length > 9) {
                return Promise.reject(
                  new Error('El teléfono debe tener exactamente 9 dígitos'),
                );
              }
              return Promise.resolve();
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
    name: 'address',
    label: 'Dirección de Domicilio',
    type: 'text',
    span: 24,
    required: true,
  },
  {
    type: 'customRow',
    fields: [
      {
        name: 'department',
        label: 'Departamento',
        type: 'select',
        span: 8,
        options: [
          { value: 'amazonas', label: 'Amazonas' },
          { value: 'ancash', label: 'Áncash' },
          { value: 'apurimac', label: 'Apurímac' },
          { value: 'arequipa', label: 'Arequipa' },
          { value: 'ayacucho', label: 'Ayacucho' },
          { value: 'cajamarca', label: 'Cajamarca' },
          { value: 'callao', label: 'Callao' },
          { value: 'cusco', label: 'Cusco' },
          { value: 'huancavelica', label: 'Huancavelica' },
          { value: 'huanuco', label: 'Huánuco' },
          { value: 'ica', label: 'Ica' },
          { value: 'junin', label: 'Junín' },
          { value: 'la_libertad', label: 'La Libertad' },
          { value: 'lambayeque', label: 'Lambayeque' },
          { value: 'lima', label: 'Lima' },
          { value: 'loreto', label: 'Loreto' },
          { value: 'madre_de_dios', label: 'Madre de Dios' },
          { value: 'moquegua', label: 'Moquegua' },
          { value: 'pasco', label: 'Pasco' },
          { value: 'piura', label: 'Piura' },
          { value: 'puno', label: 'Puno' },
          { value: 'san_martin', label: 'San Martín' },
          { value: 'tacna', label: 'Tacna' },
          { value: 'tumbes', label: 'Tumbes' },
          { value: 'ucayali', label: 'Ucayali' },
        ],
      },
      {
        name: 'province',
        label: 'Provincia',
        type: 'select',
        span: 8,
        options: [
          { value: 'lima', label: 'Lima' },
          { value: 'barranca', label: 'Barranca' },
          { value: 'cajatambo', label: 'Cajatambo' },
          { value: 'canta', label: 'Canta' },
          { value: 'canete', label: 'Cañete' },
          { value: 'huaral', label: 'Huaral' },
          { value: 'huarochiri', label: 'Huarochirí' },
          { value: 'huaura', label: 'Huaura' },
          { value: 'oyon', label: 'Oyón' },
          { value: 'yauyos', label: 'Yauyos' },
          { value: 'callao', label: 'Callao' },
          { value: 'arequipa', label: 'Arequipa' },
          { value: 'camana', label: 'Camaná' },
          { value: 'caraveli', label: 'Caravelí' },
          { value: 'castilla', label: 'Castilla' },
          { value: 'caylloma', label: 'Caylloma' },
          { value: 'condesuyos', label: 'Condesuyos' },
          { value: 'islay', label: 'Islay' },
          { value: 'la_union', label: 'La Unión' },
        ],
      },
      {
        name: 'district',
        label: 'Distrito',
        type: 'select',
        span: 8,
        options: [
          { value: 'lima', label: 'Lima' },
          { value: 'ancon', label: 'Ancón' },
          { value: 'ate', label: 'Ate' },
          { value: 'barranco', label: 'Barranco' },
          { value: 'breña', label: 'Breña' },
          { value: 'carabayllo', label: 'Carabayllo' },
          { value: 'chaclacayo', label: 'Chaclacayo' },
          { value: 'chorrillos', label: 'Chorrillos' },
          { value: 'cieneguilla', label: 'Cieneguilla' },
          { value: 'comas', label: 'Comas' },
          { value: 'el_agustino', label: 'El Agustino' },
          { value: 'independencia', label: 'Independencia' },
          { value: 'jesus_maria', label: 'Jesús María' },
          { value: 'la_molina', label: 'La Molina' },
          { value: 'la_victoria', label: 'La Victoria' },
          { value: 'lince', label: 'Lince' },
          { value: 'los_olivos', label: 'Los Olivos' },
          { value: 'lurigancho', label: 'Lurigancho' },
          { value: 'lurin', label: 'Lurín' },
          { value: 'magdalena_del_mar', label: 'Magdalena del Mar' },
          { value: 'miraflores', label: 'Miraflores' },
          { value: 'pachacamac', label: 'Pachacamac' },
          { value: 'pucusana', label: 'Pucusana' },
          { value: 'pueblo_libre', label: 'Pueblo Libre' },
          { value: 'puente_piedra', label: 'Puente Piedra' },
          { value: 'punta_hermosa', label: 'Punta Hermosa' },
          { value: 'punta_negra', label: 'Punta Negra' },
          { value: 'rimac', label: 'Rímac' },
          { value: 'san_bartolo', label: 'San Bartolo' },
          { value: 'san_borja', label: 'San Borja' },
          { value: 'san_isidro', label: 'San Isidro' },
          { value: 'san_juan_de_lurigancho', label: 'San Juan de Lurigancho' },
          { value: 'san_juan_de_miraflores', label: 'San Juan de Miraflores' },
          { value: 'san_luis', label: 'San Luis' },
          { value: 'san_martin_de_porres', label: 'San Martín de Porres' },
          { value: 'san_miguel', label: 'San Miguel' },
          { value: 'santa_anita', label: 'Santa Anita' },
          { value: 'santa_maria_del_mar', label: 'Santa María del Mar' },
          { value: 'santa_rosa', label: 'Santa Rosa' },
          { value: 'santiago_de_surco', label: 'Santiago de Surco' },
          { value: 'surquillo', label: 'Surquillo' },
          { value: 'villa_el_salvador', label: 'Villa El Salvador' },
          { value: 'villa_maria_del_triunfo', label: 'Villa María del Triunfo' },
        ],
      },
    ],
  },
];

const NewPatient = ({ onSubmit, onCancel }) => {
  const { submitNewPatient } = usePatients();
  const navigate = useNavigate();

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
      navigate('/Inicio/pacientes');

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
    navigate('/Inicio/pacientes');
  };

  return (
    <FormGenerator
      fields={fields}
      onCancel={handleCancel}
      mode="create"
      onSubmit={handleSubmit}
      initialValues={{
        document_type_id: 1,
        country_id: 1,
      }}
    />
  );
};

export default NewPatient;
