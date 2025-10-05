import React, { useState } from 'react';
import { notification, Form } from 'antd';
import FormGenerator from '../../../../components/Form/Form';
import DNISearchResults from '../../../../components/DNISearchResults/DNISearchResults';
import { useStaff } from '../../hook/staffHook';
import { useNavigate } from 'react-router';

// Definir campos del formulario con estilos personalizados
const fields = [
  {
    type: 'title',
    label: 'REGISTRAR TERAPEUTA',
  },
  {

    type: 'separator',
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
      {
        name: 'therapist_card',
        label: 'Codigo de Terapeuta',
        type: 'text',
        span: 8,
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
        capitalize: 'first',
      },
    ],
  },
  {
    type: 'title',
    label: 'Información de Contacto',
  },
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
    type: 'customRow',
    fields: [
      {
        name: 'ubicacion',
        label: 'Departamento / Provincia / Distrito',
        type: 'ubigeo',
        span: 12,
      },
      {
        name: 'address',
        label: 'Dirección de Domicilio',
        type: 'text',
        span: 12,
      },
    ],
  },
];

const NewTherapist = () => {
  const { submitNewTherapist } = useStaff();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  
  const [showDNIResults, setShowDNIResults] = useState(false);
  const [dniSearchData, setDniSearchData] = useState(null);
  const [noResults, setNoResults] = useState(false);

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

      const result = await submitNewTherapist(formData);
      notification.success({
        message: 'Éxito',
        description: 'Terapeuta registrado correctamente',
      });
      navigate('/Inicio/terapeutas');
      return result;
    } catch (error) {
      console.error('❌ Error al crear terapeuta:', error);
      notification.error({
        message: 'Error',
        description: 'Ocurrió un error al registrar el terapeuta',
      });
      throw error;
    }
  };

  const handleCancel = () => {
    navigate('/Inicio/terapeutas');
  };

  const handleDNIDataFound = (data) => {
    if (data) {
      setDniSearchData(data);
      setNoResults(false);
      setShowDNIResults(true);
    } else {
      setDniSearchData(null);
      setNoResults(true);
      setShowDNIResults(true);
    }
  };

  const handleConfirmDNIData = (data) => {
    form.setFieldsValue({
      name: data.name,
      paternal_lastname: data.paternal_lastname,
      maternal_lastname: data.maternal_lastname,
    });
    
    setShowDNIResults(false);
    setDniSearchData(null);
    
    notification.success({
      message: 'Datos cargados',
      description: 'Los datos del DNI se han completado automáticamente',
    });
  };

  const handleCloseDNIResults = () => {
    setShowDNIResults(false);
    setDniSearchData(null);
    setNoResults(false);
  };

  return (
    <>
      <FormGenerator
        fields={fields}
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        onDNIDataFound={handleDNIDataFound}
        form={form}
        searchType="staff"
        initialValues={{
          document_type_id: "1", // DNI por defecto (string)
          ubicacion: {
            region_id: 15, // Lima
            province_id: 1501, // Lima
            district_id: null, // El usuario seleccionará el distrito
          },
        }}
      />
      
      <DNISearchResults
        visible={showDNIResults}
        patientData={dniSearchData}
        onConfirm={handleConfirmDNIData}
        onClose={handleCloseDNIResults}
        noResults={noResults}
      />
    </>
  );
};

export default NewTherapist;
