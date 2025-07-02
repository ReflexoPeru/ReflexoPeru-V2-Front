import { Modal, Descriptions, Avatar, Button } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const InfoTherapist = ({ therapist, open, onClose }) => {
  if (!therapist) return null;

  // Construir nombre completo
  const fullName =
    `${therapist.paternal_lastname || ''} ${therapist.maternal_lastname || ''} ${therapist.name || ''}`.trim();

  // Avatar: usar foto si hay, si no, icono
  const avatarUrl = therapist.photo_url || null;

  return (
    <Modal
      title={
        <span style={{ fontWeight: 600, fontSize: 20 }}>
          Información del Terapeuta
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="close"
          onClick={onClose}
          type="primary"
          style={{ background: '#4caf50', borderColor: '#4caf50' }}
        >
          Cerrar
        </Button>,
      ]}
      width={600}
      centered
      bodyStyle={{ background: '#1e1e1e', color: '#fff', borderRadius: 12 }}
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
          src={avatarUrl}
          icon={<UserOutlined />}
          style={{ background: '#4caf50', color: '#fff' }}
        />
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff' }}>
            {fullName}
          </div>
          <div style={{ color: '#aaa', fontSize: 16 }}>
            {therapist.document_type?.name || 'Documento'}:{' '}
            {therapist.document_number || '-'}
          </div>
        </div>
      </div>
      <Descriptions
        column={1}
        labelStyle={{ color: '#4caf50', fontWeight: 600, width: 180 }}
        contentStyle={{ color: '#fff', fontWeight: 400 }}
        bordered
        size="middle"
        style={{ background: '#232323', borderRadius: 8 }}
      >
        <Descriptions.Item label={<MailOutlined />}>
          {' '}
          {therapist.email || 'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<PhoneOutlined />}>
          {' '}
          {therapist.primary_phone || therapist.phone1 || 'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Sexo">
          {' '}
          {therapist.sex === 'M'
            ? 'Masculino'
            : therapist.sex === 'F'
              ? 'Femenino'
              : '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de nacimiento">
          {' '}
          {therapist.birth_date || therapist.dateBith || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<HomeOutlined />}>
          {' '}
          {therapist.address || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Departamento">
          {' '}
          {therapist.departamento_name || therapist.region_name || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Provincia">
          {' '}
          {therapist.provincia_name || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Distrito">
          {' '}
          {therapist.distrito_name || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Referencia personal">
          {' '}
          {therapist.personal_reference || '-'}{' '}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default InfoTherapist;
