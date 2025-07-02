import { Modal, Descriptions, Avatar, Button } from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
} from '@ant-design/icons';

const InfoPatient = ({ patient, open, onClose }) => {
  if (!patient) return null;

  // Construir nombre completo
  const fullName =
    `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();

  // Avatar: usar foto si hay, si no, icono
  const avatarUrl = patient.photo_url || null;

  return (
    <Modal
      title={
        <span style={{ fontWeight: 600, fontSize: 20 }}>
          Información del Paciente
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
            {patient.document_type?.name || 'Documento'}:{' '}
            {patient.document_number || '-'}
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
          {patient.email || 'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<PhoneOutlined />}>
          {' '}
          {patient.phone || patient.phone1 || 'No registrado'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Sexo">
          {' '}
          {patient.sex === 'M'
            ? 'Masculino'
            : patient.sex === 'F'
              ? 'Femenino'
              : '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Fecha de nacimiento">
          {' '}
          {patient.birth_date || patient.dateBirth || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label={<HomeOutlined />}>
          {' '}
          {patient.address || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Departamento">
          {' '}
          {patient.departamento_name || patient.region_name || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Provincia">
          {' '}
          {patient.provincia_name || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Distrito">
          {' '}
          {patient.distrito_name || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Ocupación">
          {' '}
          {patient.ocupation || '-'}{' '}
        </Descriptions.Item>
        <Descriptions.Item label="Condición de salud">
          {' '}
          {patient.healthCondition || '-'}{' '}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default InfoPatient;
