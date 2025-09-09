import { Descriptions, Avatar, Button } from 'antd';
import {
  UserOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  getDepartaments,
  getProvinces,
  getDistricts,
} from '../../../../components/Select/SelectsApi';
import UniversalModal from '../../../../components/Modal/UniversalModal';
import { useTheme } from '../../../../context/ThemeContext';

const InfoPatient = ({ patient, open, onClose }) => {
  const { isDarkMode } = useTheme();
  
  if (!patient) return null;

  // Construir nombre completo
  const fullName =
    patient.full_name ||
    `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();

  // Debug temporal
  console.log('InfoPatient - patient data:', patient);
  console.log('InfoPatient - fullName:', fullName);
  console.log('InfoPatient - document:', patient.document_type?.name, patient.document_number);

  // Avatar: usar foto si hay, si no, icono. Evitar deformación del icono.
  const avatarUrl = patient.photo_url || null;
  const avatarProps = avatarUrl
    ? { src: avatarUrl }
    : { icon: <UserOutlined style={{ fontSize: 38 }} /> };

  // Estado para ubigeo
  const [ubigeo, setUbigeo] = useState({
    departamento: '-',
    provincia: '-',
    distrito: '-',
  });

  useEffect(() => {
    async function fetchUbigeo() {
      if (
        patient.region ||
        patient.region_id ||
        patient.departamento_id ||
        patient.province ||
        patient.province_id ||
        patient.provincia_id ||
        patient.district ||
        patient.district_id ||
        patient.distrito_id
      ) {
        const region_id =
          patient.region || patient.region_id || patient.departamento_id;
        const province_id =
          patient.province || patient.province_id || patient.provincia_id;
        const district_id =
          patient.district || patient.district_id || patient.distrito_id;
        let departamento = '-';
        let provincia = '-';
        let distrito = '-';
        if (region_id) {
          const departamentos = await getDepartaments();
          const found = departamentos.find(
            (d) => String(d.id) === String(region_id),
          );
          if (found) departamento = found.name;
        }
        if (province_id) {
          const provincias = await getProvinces(region_id);
          const found = provincias.find(
            (p) => String(p.id) === String(province_id),
          );
          if (found) provincia = found.name;
        }
        if (district_id) {
          const distritos = await getDistricts(province_id);
          const found = distritos.find(
            (d) => String(d.id) === String(district_id),
          );
          if (found) distrito = found.name;
        }
        setUbigeo({ departamento, provincia, distrito });
      } else {
        setUbigeo({ departamento: '-', provincia: '-', distrito: '-' });
      }
    }
    if (open) fetchUbigeo();
  }, [open, patient]);

  return (
    <UniversalModal
      title="Información del Paciente"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          type="primary"
          style={{ 
            background: 'var(--color-primary)', 
            borderColor: 'var(--color-primary)',
            color: '#ffffff'
          }}
        >
          Cerrar
        </Button>,
      ]}
      width={600}
      className="info-patient-modal modal-themed"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          marginBottom: 24,
        }}
      >
        <Avatar
          size={80}
          {...avatarProps}
          style={{
            background: 'var(--color-primary)',
            color: '#ffffff',
            objectFit: 'cover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        />
        <div>
          <div style={{ 
            fontSize: 22, 
            fontWeight: 700, 
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-family)'
          }}>
            {fullName}
          </div>
          <div style={{ 
            color: 'var(--color-text-secondary)', 
            fontSize: 16,
            fontFamily: 'var(--font-family)'
          }}>
            {patient.document_type?.name || 'Documento'}:{' '}
            {patient.document_number || '-'}
          </div>
        </div>
      </div>
      <Descriptions
        column={1}
        labelStyle={{ 
          color: 'var(--color-primary)', 
          fontWeight: 600, 
          width: 200,
          fontFamily: 'var(--font-family)',
          minWidth: 200
        }}
        contentStyle={{ 
          color: 'var(--color-text-primary)', 
          fontWeight: 400,
          fontFamily: 'var(--font-family)'
        }}
        bordered
        size="middle"
        style={{ 
          background: 'var(--color-background-secondary)', 
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--color-border-primary)'
        }}
      >
        <Descriptions.Item label="Email">
          {patient.email || 'No registrado'}
        </Descriptions.Item>
        <Descriptions.Item label="Teléfono">
          {patient.primary_phone ||
            patient.phone ||
            patient.phone1 ||
            'No registrado'}
        </Descriptions.Item>
        <Descriptions.Item label="Sexo">
          {patient.sex === 'M'
            ? 'Masculino'
            : patient.sex === 'F'
              ? 'Femenino'
              : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de nacimiento">
          {patient.birth_date || patient.dateBirth || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección">
          {patient.address || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Departamento">
          {ubigeo.departamento}
        </Descriptions.Item>
        <Descriptions.Item label="Provincia">
          {ubigeo.provincia}
        </Descriptions.Item>
        <Descriptions.Item label="Distrito">
          {ubigeo.distrito}
        </Descriptions.Item>
        <Descriptions.Item label="Ocupación">
          {patient.ocupation || patient.occupation || '-'}
        </Descriptions.Item>
      </Descriptions>
    </UniversalModal>
  );
};

export default InfoPatient;
