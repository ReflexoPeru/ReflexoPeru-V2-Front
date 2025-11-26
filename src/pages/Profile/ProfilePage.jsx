import React, { useState, useEffect } from 'react';
import {
  Card,
  Avatar,
  Button,
  Form,
  Input,
  Select,
  Upload,
  Image,
  Divider,
  Space,
  Typography,
  Row,
  Col,
  message,
  Spin,
} from 'antd';
import {
  User,
  Envelope,
  Phone,
  Calendar,
  MapPin,
  ShieldCheck,
  Camera,
  CheckCircle,
  XCircle,
  Edit,
  Save,
  Lock,
} from '@phosphor-icons/react';
import { UserCircle } from '@phosphor-icons/react';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import { useUser } from '../../context/UserContext';
import { useTheme } from '../../context/ThemeContext';
import {
  useUpdateProfile,
  useUploadUserAvatar,
} from '../../features/configuration/cProfile/hook/profileHook';
import ModalBase from '../../components/Modal/BaseModalProfile/BaseModalProfile';
import { useToast } from '../../services/toastify/ToastContext';
import dayjs from '../../utils/dayjsConfig';
import styles from './ProfilePage.module.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { Password } = Input;

const ProfilePage = () => {
  const {
    profile,
    photoUrl,
    refetchProfile,
    refetchPhoto,
    loading: profileLoading,
  } = useUser();
  const { antdTheme } = useTheme();
  const { showToast } = useToast();
  const [form] = Form.useForm();

  // Estados
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(photoUrl || null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Hooks
  const { updateProfile, isUpdating, validateCurrentPassword, updatePassword } =
    useUpdateProfile();
  const { uploadAvatar, uploading } = useUploadUserAvatar();

  // Cargar datos del perfil en el formulario
  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name || '',
        paternal_lastname: profile.paternal_lastname || '',
        maternal_lastname: profile.maternal_lastname || '',
        email: profile.email || '',
        phone: profile.phone || '',
        sex: profile.sex || null,
        birth_date: profile.birth_date ? dayjs(profile.birth_date) : null,
      });
    }
  }, [profile, form]);

  useEffect(() => {
    if (photoUrl) {
      setAvatar(photoUrl);
    }
  }, [photoUrl]);

  // Manejo de avatar
  const handleAvatarChange = ({ file }) => {
    if (file.status !== 'done') return;

    const newFile = file.originFileObj;
    if (!newFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewAvatar(e.target.result);
      setSelectedFile(newFile);
      setShowConfirmButton(true);
    };
    reader.readAsDataURL(newFile);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadAvatar(selectedFile);
      setAvatar(previewAvatar);
      setPreviewAvatar(null);
      setSelectedFile(null);
      setShowConfirmButton(false);
      refetchPhoto();
      showToast('success', 'Avatar actualizado correctamente');
    } catch (err) {
      showToast('error', 'Error al subir el avatar');
    }
  };

  const handleCancelUpload = () => {
    setPreviewAvatar(null);
    setSelectedFile(null);
    setShowConfirmButton(false);
  };

  // Guardar cambios del perfil
  const handleSave = async (values) => {
    try {
      await updateProfile({
        name: values.name,
        paternal_lastname: values.paternal_lastname,
        maternal_lastname: values.maternal_lastname,
        phone: values.phone,
        sex: values.sex,
        birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
      });
      refetchProfile();
      setIsEditing(false);
      showToast('success', 'Perfil actualizado correctamente');
    } catch (error) {
      showToast('error', 'Error al actualizar el perfil');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsEditing(false);
  };

  if (profileLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        {/* Header con Avatar */}
        <Card className={styles.headerCard}>
          <div className={styles.headerContent}>
            <div className={styles.avatarSection}>
              {avatar || previewAvatar ? (
                <Image
                  src={previewAvatar || avatar}
                  alt="Avatar"
                  preview={false}
                  className={styles.avatar}
                  onError={() => setAvatar(null)}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <UserCircle size={120} weight="duotone" />
                </div>
              )}
              <Upload
                showUploadList={false}
                beforeUpload={() => false}
                onChange={handleAvatarChange}
                accept="image/*"
                className={styles.uploadButton}
              >
                <Button
                  icon={<Camera size={20} />}
                  className={styles.cameraButton}
                  shape="circle"
                >
                  Cambiar foto
                </Button>
              </Upload>
              {showConfirmButton && (
                <div className={styles.confirmButtons}>
                  <Button
                    type="primary"
                    icon={<CheckCircle size={18} />}
                    onClick={handleConfirmUpload}
                    loading={uploading}
                    size="small"
                  >
                    Confirmar
                  </Button>
                  <Button
                    icon={<XCircle size={18} />}
                    onClick={handleCancelUpload}
                    size="small"
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>

            <div className={styles.userInfo}>
              <Title level={2} className={styles.userName}>
                {profile?.full_name || `${profile?.paternal_lastname || ''} ${profile?.maternal_lastname || ''} ${profile?.name || ''}`.trim() || 'Usuario'}
              </Title>
              <Text type="secondary" className={styles.userEmail}>
                <Envelope size={16} /> {profile?.email || 'Sin email'}
              </Text>
              {profile?.phone && (
                <Text type="secondary" className={styles.userPhone}>
                  <Phone size={16} /> {profile.phone}
                </Text>
              )}
            </div>
          </div>
        </Card>

        {/* Información Personal */}
        <Card
          title={
            <Space>
              <User size={24} />
              <span>Información Personal</span>
            </Space>
          }
          className={styles.infoCard}
          extra={
            !isEditing ? (
              <Button
                type="primary"
                icon={<Edit size={18} />}
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
            ) : (
              <Space>
                <Button onClick={handleCancel}>Cancelar</Button>
                <Button
                  type="primary"
                  icon={<Save size={18} />}
                  onClick={() => form.submit()}
                  loading={isUpdating}
                >
                  Guardar
                </Button>
              </Space>
            )
          }
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            disabled={!isEditing}
          >
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Nombres"
                  name="name"
                  rules={[{ required: true, message: 'Ingrese los nombres' }]}
                >
                  <Input prefix={<User size={16} />} placeholder="Nombres" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="Apellido Paterno"
                  name="paternal_lastname"
                  rules={[
                    { required: true, message: 'Ingrese el apellido paterno' },
                  ]}
                >
                  <Input placeholder="Apellido Paterno" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Apellido Materno" name="maternal_lastname">
                  <Input placeholder="Apellido Materno" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Sexo" name="sex">
                  <Select placeholder="Seleccione el sexo">
                    <Option value="M">Masculino</Option>
                    <Option value="F">Femenino</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Teléfono" name="phone">
                  <Input prefix={<Phone size={16} />} placeholder="Teléfono" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item label="Fecha de Nacimiento" name="birth_date">
                  <Input
                    prefix={<Calendar size={16} />}
                    placeholder="YYYY-MM-DD"
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* Seguridad */}
        <Card
          title={
            <Space>
              <ShieldCheck size={24} />
              <span>Seguridad</span>
            </Space>
          }
          className={styles.securityCard}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div className={styles.securityItem}>
              <div className={styles.securityInfo}>
                <Envelope size={20} />
                <div>
                  <Text strong>Correo Electrónico</Text>
                  <br />
                  <Text type="secondary">{profile?.email || 'No configurado'}</Text>
                </div>
              </div>
              <Button
                type="primary"
                icon={<Edit size={18} />}
                onClick={() => setShowEmailModal(true)}
              >
                Cambiar Email
              </Button>
            </div>

            <Divider />

            <div className={styles.securityItem}>
              <div className={styles.securityInfo}>
                <Lock size={20} />
                <div>
                  <Text strong>Contraseña</Text>
                  <br />
                  <Text type="secondary">Última actualización: No disponible</Text>
                </div>
              </div>
              <Button
                type="primary"
                icon={<ShieldCheck size={18} />}
                onClick={() => setShowPasswordModal(true)}
              >
                Cambiar Contraseña
              </Button>
            </div>
          </Space>
        </Card>

        {/* Información Adicional */}
        {profile && (
          <Card
            title={
              <Space>
                <MapPin size={24} />
                <span>Información Adicional</span>
              </Space>
            }
            className={styles.additionalCard}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <div className={styles.infoRow}>
                  <Text strong>ID de Usuario:</Text>
                  <Text>{profile.id || 'N/A'}</Text>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div className={styles.infoRow}>
                  <Text strong>Rol:</Text>
                  <Text>{profile.role_name || 'N/A'}</Text>
                </div>
              </Col>
              {profile.created_at && (
                <Col xs={24} sm={12}>
                  <div className={styles.infoRow}>
                    <Text strong>Fecha de Registro:</Text>
                    <Text>
                      {dayjs(profile.created_at).format('DD/MM/YYYY')}
                    </Text>
                  </div>
                </Col>
              )}
            </Row>
          </Card>
        )}
      </div>

      {/* Modales */}
      <ModalBase
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        mode="email"
      />

      <ModalBase
        visible={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        mode="password"
      />
    </div>
  );
};

export default ProfilePage;


