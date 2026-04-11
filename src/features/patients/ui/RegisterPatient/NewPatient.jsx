import { notification, Form, Modal, Button as AntdButton, Alert } from 'antd';
import { UndoOutlined, InfoCircleOutlined } from '@ant-design/icons';
import FormGenerator from '../../../../components/Form/Form';
import DNISearchResults from '../../../../components/DNISearchResults/DNISearchResults';
import { usePatients } from '../../hook/patientsHook';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { checkTrashedByDNI, restorePatient } from '../../service/patientsService';

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
        rules: [{ required: true, message: 'El tipo de documento es requerido' }],
      },
      {
        name: 'document_number',
        label: 'Nro Documento',
        type: 'dniSearch',
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
        rules: [{ required: true, message: 'El apellido paterno es requerido' }],
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
        rules: [{ required: true, message: 'el nombre es requerido' }],
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
        required: true,
        rules: [{ required: true, message: 'La fecha de nacimiento es requerida' }],
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
        rules: [{ required: true, message: 'El sexo es requerido' }],
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
    type: 'customRow',
    fields: [
      {
        name: 'ubigeo',
        label: 'Departamento / Provincia / Distrito',
        type: 'ubigeo',
        span: 12,
      },
      {
        name: 'address',
        label: 'Dirección de Domicilio',
        type: 'text',
        span: 12,
        capitalize: 'first',
      },
    ],
  },
];

export default function NewPatient({ isModal = false, ghlInitialValues = null, onCancel = null, onSubmit = null }) {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { submitNewPatient, loading } = usePatients();
  
  // Función para manejar la cancelación
  const handleCancel = onCancel || (() => navigate('/Inicio/pacientes'));

  // Filtrar títulos si es modal para un look minimalista
  const filteredFields = isModal ? fields.filter(f => f.type !== 'title') : fields;

  const onFinish = async (values) => {
    try {
      const response = await submitNewPatient(values);
      if (response && response.id) {
        if (onSubmit) {
          onSubmit(response);
        } else {
          notification.success({
            message: 'Éxito',
            description: 'Paciente registrado correctamente',
          });
          navigate('/Inicio/pacientes');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Pre-llenado de GHL si aplica
  useState(() => {
    if (isModal && ghlInitialValues) {
      form.setFieldsValue({
        name: ghlInitialValues.firstName || '',
        paternal_lastname: ghlInitialValues.lastName || '',
        primary_phone: ghlInitialValues.phone || '',
        email: ghlInitialValues.email || '',
        document_type_id: 1 // DNI por defecto
      });
    }
  });

  return (
    <div style={{ padding: isModal ? '0px' : '20px' }}>
      <FormGenerator
        form={form}
        fields={filteredFields}
        onSubmit={onFinish}
        loading={loading}
        columns={3}
        isModal={isModal}
        onCancel={handleCancel}
        showSubmitButton={true}
        submitText="Registrar"
        cancelText="Cancelar"
      />
    </div>
  );
}
