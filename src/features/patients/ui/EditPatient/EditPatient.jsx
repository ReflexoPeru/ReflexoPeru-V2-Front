import { Form, Modal, notification } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import FormGenerator from '../../../../components/Form/Form';
import { usePatients } from '../../hook/patientsHook';
import { getPatientById } from '../../service/patientsService';

// Reutilizamos los mismos campos del formulario de creación
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
        name: 'occupation',
        label: 'Ocupación',
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

const EditPatient = ({ patient, onClose }) => {
  const [form] = Form.useForm();
  const { handleUpdatePatient } = usePatients();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patient) {
      // Si no existen los campos individuales, los extraemos de full_name
      let name = patient.name || '';
      let paternal_lastname = patient.paternal_lastname || '';
      let maternal_lastname = patient.maternal_lastname || '';
      if (
        (!name || !paternal_lastname || !maternal_lastname) &&
        patient.full_name
      ) {
        const parts = patient.full_name.trim().split(' ');
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
      // Mapeo para el select en cascada: ids y nombres
      const ubicacion = {
        region_id: patient.region_id || null,
        province_id: patient.province_id || null,
        district_id: patient.district_id || null,
      };

      const formData = {
        name,
        paternal_lastname,
        maternal_lastname,
        document_type_id: patient.document_type_id || '',
        document_number: patient.document_number || '',
        personal_reference: patient.personal_reference || '',
        birth_date: patient.birth_date ? dayjs(patient.birth_date) : null,
        sex: patient.sex || '',
        primary_phone: patient.primary_phone || '',
        secondary_phone: patient.secondary_phone || '',
        email: patient.email || '',
        occupation: patient.ocupation || patient.occupation || '',
        address: patient.address || '',
        country_id: patient.country_id || '',
        ubicacion,
      };
      form.setFieldsValue(formData);
    }
  }, [patient, form]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await handleUpdatePatient(patient.id, formData);
      notification.success({
        message: 'Éxito',
        description: 'Paciente actualizado correctamente',
      });
      onClose();
    } catch (error) {
      notification.error({
        message: 'Error',
        description:
          error.response?.data?.message || 'Error al actualizar el paciente',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  // Mostrar el nombre completo en el título
  const modalTitle =
    patient.full_name ||
    `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();

  return (
    <Modal
      title={`Editar Paciente: ${modalTitle}`}
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

export default EditPatient;
