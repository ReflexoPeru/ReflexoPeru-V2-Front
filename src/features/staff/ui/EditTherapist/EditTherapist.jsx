import { Form, Modal, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import FormGenerator from '../../../../components/Form/Form';
import { updateTherapist } from '../../service/staffService';

// Reutiliza los mismos fields que para crear
const fields = [
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
        name: 'referencia',
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
    required: true,
  },
];

const EditTherapist = ({ therapist, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (therapist) {
      // Mapeo igual que en pacientes
      let name = therapist.name || '';
      let paternal_lastname = therapist.paternal_lastname || '';
      let maternal_lastname = therapist.maternal_lastname || '';
      if (
        (!name || !paternal_lastname || !maternal_lastname) &&
        therapist.full_name
      ) {
        const parts = therapist.full_name.trim().split(' ');
        if (parts.length >= 3) {
          paternal_lastname = paternal_lastname || parts[0];
          maternal_lastname = maternal_lastname || parts[1];
          name = name || parts.slice(2).join(' ');
        } else if (parts.length === 2) {
          paternal_lastname = paternal_lastname || parts[0];
          name = name || parts[1];
        } else if (parts.length === 1) {
          name = name || parts[0];
        }
      }
      const ubicacion = {
        region_id: therapist.region_id || null,
        province_id: therapist.province_id || null,
        district_id: therapist.district_id || null,
      };
      const formData = {
        name,
        paternal_lastname,
        maternal_lastname,
        document_type_id: therapist.document_type_id || '',
        document_number: therapist.document_number || '',
        referencia: therapist.personal_reference || '',
        birth_date: therapist.birth_date ? dayjs(therapist.birth_date) : null,
        sex: therapist.sex || '',
        primary_phone: therapist.primary_phone || '',
        secondary_phone: therapist.secondary_phone || '',
        email: therapist.email || '',
        address: therapist.address || '',
        country_id: therapist.country_id || '',
        ubicacion,
      };
      form.setFieldsValue(formData);
    }
  }, [therapist, form]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      // Mapear 'referencia' del formulario a 'personal_reference' para el API
      const payload = {
        ...formData,
        personal_reference: formData.referencia,
      };
      delete payload.referencia;
      await updateTherapist(therapist.id, payload);
      notification.success({
        message: 'Éxito',
        description: 'Terapeuta actualizado correctamente',
      });
      onClose();
    } catch (error) {
      notification.error({
        message: 'Error',
        description:
          error.response?.data?.message || 'Error al actualizar el terapeuta',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!therapist) return null;

  const modalTitle =
    therapist.full_name ||
    `${therapist.paternal_lastname || ''} ${therapist.maternal_lastname || ''} ${therapist.name || ''}`.trim();

  return (
    <Modal
      title={`Editar Terapeuta: ${modalTitle}`}
      open={true}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      destroyOnClose
    >
      <FormGenerator
        form={form}
        fields={fields}
        mode="edit"
        onSubmit={handleSubmit}
        onCancel={onClose}
        loading={loading}
      />
    </Modal>
  );
};

export default EditTherapist;
