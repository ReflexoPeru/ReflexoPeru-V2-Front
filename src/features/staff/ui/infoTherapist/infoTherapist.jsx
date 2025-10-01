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

const InfoTherapist = ({ therapist, open, onClose }) => {
  const { isDarkMode } = useTheme();
  
  if (!therapist) return null;

  // Construir nombre completo
  const fullName =
    therapist.full_name ||
    `${therapist.paternal_lastname || ''} ${therapist.maternal_lastname || ''} ${therapist.name || ''}`.trim();

  // Debug temporal
  console.log('InfoTherapist - therapist data:', therapist);
  console.log('InfoTherapist - fullName:', fullName);
  console.log('InfoTherapist - document:', therapist.document_type?.name, therapist.document_number);

  // Avatar: usar foto si hay, si no, icono. Evitar deformación del icono.
  const avatarUrl = therapist.photo_url || null;
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
        therapist.region ||
        therapist.region_id ||
        therapist.departamento_id ||
        therapist.province ||
        therapist.province_id ||
        therapist.provincia_id ||
        therapist.district ||
        therapist.district_id ||
        therapist.distrito_id
      ) {
        const region_id =
          therapist.region || therapist.region_id || therapist.departamento_id;
        const province_id =
          therapist.province || therapist.province_id || therapist.provincia_id;
        const district_id =
          therapist.district || therapist.district_id || therapist.distrito_id;
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
  }, [open, therapist]);

  return (
    <UniversalModal
      title="Información del Terapeuta"
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
      className="info-therapist-modal modal-themed"
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
            {therapist.document_type?.name || 'Documento'}:{' '}
            {therapist.document_number || '-'}
          </div>
          {therapist.code && (
            <div style={{ 
              color: 'var(--color-text-secondary)', 
              fontSize: 16,
              fontFamily: 'var(--font-family)',
              marginTop: 4
            }}>
              Código Terapeuta: {therapist.code}
            </div>
          )}
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
          {therapist.email || 'No registrado'}
        </Descriptions.Item>
        <Descriptions.Item label="Teléfono">
          {therapist.primary_phone ||
            therapist.phone ||
            therapist.phone1 ||
            'No registrado'}
        </Descriptions.Item>
        <Descriptions.Item label="Sexo">
          {therapist.sex === 'M'
            ? 'Masculino'
            : therapist.sex === 'F'
              ? 'Femenino'
              : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de nacimiento">
          {therapist.birth_date || therapist.dateBith || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Dirección">
          {therapist.address || '-'}
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
        <Descriptions.Item label="Referencia personal">
          {therapist.personal_reference || '-'}
        </Descriptions.Item>
      </Descriptions>
    </UniversalModal>
  );
};

export default InfoTherapist;
