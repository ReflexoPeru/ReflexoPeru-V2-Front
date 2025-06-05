import React, { useState, useEffect } from 'react';
import {
  Upload,
  Select,
  Button,
  Input,
  Modal,
  message,
  Form,
  ConfigProvider,
  Input as AntdInput,
} from 'antd';
import {
  Envelope,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
} from '@phosphor-icons/react';
import styles from './Profile.module.css';
import {
  useSendVerifyCode,
  useProfile,
  useUpdateProfile,
} from './hook/profileHook';
import { useToast } from '../../../services/toastify/ToastContext';

const { Password } = AntdInput;

const Profile = () => {
  // Estados del perfil
  const [avatar, setAvatar] = useState('/src/assets/Img/MiniLogoReflexo.webp');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState(null);
  const [telefono, setTelefono] = useState('');

  // Estados para los modales
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showCurrentPasswordModal, setShowCurrentPasswordModal] =
    useState(false);
  const [showNewPasswordModal, setShowNewPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados para loading de contraseña
  const [currentPasswordLoading, setCurrentPasswordLoading] = useState(false);
  const [newPasswordLoading, setNewPasswordLoading] = useState(false);
  // Forms refs
  const [emailForm] = Form.useForm();
  const [codeForm] = Form.useForm();
  const [currentPasswordForm] = Form.useForm();
  const [newPasswordForm] = Form.useForm();

  // Hooks personalizados
  const {
    sendCode,
    verify,
    updateEmail,
    loading: codeLoading,
    error: codeError,
  } = useSendVerifyCode();
  const { profile, loading: profileLoading, refetch } = useProfile();
  const {
    updateProfile,
    isUpdating,
    validateCurrentPassword,
    updatePassword,
    uploadProfilePhoto,
  } = useUpdateProfile();
  const { showToast } = useToast();
  // Efecto para cargar los datos del perfil
  useEffect(() => {
    if (profile) {
      setNombre(profile.name || '');
      setApellidoPaterno(profile.paternal_lastname || '');
      setApellidoMaterno(profile.maternal_lastname || '');
      setCorreo(profile.email || '');
      setGenero(profile.sex || null);
      setTelefono(profile.phone || '');
    }
  }, [profile]);

  // Función para manejar el cambio de avatar
  const handleAvatarChange = async (info) => {
    const file = info.file.originFileObj;
    if (file) {
      try {
        const formData = new FormData();
        formData.append('photo', file);
        await uploadProfilePhoto(formData);
        message.success('Avatar actualizado correctamente');
        // Actualizar la imagen mostrada
        const reader = new FileReader();
        reader.onload = (e) => setAvatar(e.target.result);
        reader.readAsDataURL(file);
      } catch (error) {
        message.error('Error al actualizar el avatar');
      }
    }
  };

  // Funciones para el manejo del correo
  const handleOpenEmailModal = () => {
    setShowEmailModal(true);
    emailForm.resetFields();
  };

  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setNewEmail('');
    emailForm.resetFields();
  };

  const handleSubmitNewEmail = async (values) => {
    try {
      setNewEmail(values.email);
      await sendCode(values.email);
      message.success('Código de verificación enviado');
      setShowEmailModal(false);
      setShowCodeModal(true);
      startCountdown();
    } catch (err) {
      message.error('Error al enviar el código. Intenta de nuevo.');
    }
  };

  const handleCloseCodeModal = () => {
    setShowCodeModal(false);
    setCode('');
    setNewEmail('');
    setCountdown(0);
    codeForm.resetFields();
  };

  const handleVerifyCode = async (values) => {
    setVerifyLoading(true);
    try {
      await verify(values.code);
      await updateEmail(newEmail);
      setCorreo(newEmail);
      setShowCodeModal(false);
      message.success('¡Correo actualizado exitosamente!');
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Error al actualizar el correo',
      );
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    try {
      await sendCode(newEmail);
      message.success('Código reenviado');
      startCountdown();
    } catch {
      message.error('Error al reenviar el código');
    }
  };

  // Funciones para el manejo de contraseña
  const handleOpenPasswordModal = () => {
    setShowCurrentPasswordModal(true);
    currentPasswordForm.resetFields();
  };

  const handleCloseCurrentPasswordModal = () => {
    setShowCurrentPasswordModal(false);
    setCurrentPassword('');
    currentPasswordForm.resetFields();
  };

  const handleSubmitCurrentPassword = async (values) => {
    setCurrentPasswordLoading(true);
    try {
      await validateCurrentPassword(values.currentPassword);
      setCurrentPassword(values.currentPassword);
      setShowCurrentPasswordModal(false);
      setShowNewPasswordModal(true);
      message.success('Contraseña actual verificada');
    } catch (error) {
      message.error('Contraseña actual incorrecta');
    } finally {
      setCurrentPasswordLoading(false);
    }
  };

  const handleCloseNewPasswordModal = () => {
    setShowNewPasswordModal(false);
    setNewPassword('');
    setConfirmPassword('');
    newPasswordForm.resetFields();
  };

  const handleSubmitNewPassword = async (values) => {
    setNewPasswordLoading(true);
    try {
      await updatePassword(values.newPassword);
      setShowNewPasswordModal(false);
      message.success('¡Contraseña actualizada exitosamente!');
    } catch (error) {
      message.error('Error al actualizar la contraseña');
    } finally {
      setNewPasswordLoading(false);
    }
  };

  // Función para el contador de reenvío de código
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Función para guardar los cambios del perfil
  const handleSaveChanges = async () => {
    try {
      const updateData = {
        name: nombre,
        paternal_lastname: apellidoPaterno,
        maternal_lastname: apellidoMaterno,
        sex: genero,
        phone: telefono,
      };

      await updateProfile(updateData);
      message.success('Cambios guardados exitosamente');
      refetch();
    } catch (error) {
      message.error(
        'Error al actualizar el perfil: ' +
          (error.response?.data?.message || error.message),
      );
    }
  };

  // Configuración del tema de Ant Design
  const theme = {
    token: {
      colorPrimary: '#4CAF50',
      colorBgContainer: '#1e1e1e',
      colorText: 'white',
      colorTextPlaceholder: '#666',
      colorBorder: '#444',
      colorBgElevated: '#2a2a2a',
      colorError: '#ff4d4f',
    },
    components: {
      Modal: {
        contentBg: 'linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%)',
        headerBg: 'transparent',
        titleColor: 'white',
        colorText: '#b0b0b0',
        borderRadiusLG: 16,
        paddingContentHorizontal: 0,
        paddingMD: 0,
      },
      Button: {
        defaultHoverBg: 'rgba(255, 255, 255, 0.08)',
        defaultHoverColor: 'white',
      },
      Input: {
        colorBgContainer: '#2a2a2a',
        activeBorderColor: '#4CAF50',
        hoverBorderColor: '#4CAF50',
        activeShadow: '0 0 0 2px rgba(76, 175, 80, 0.2)',
      },
      Select: {
        optionSelectedBg: '#333',
        optionActiveBg: '#3a3a3a',
      },
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.body}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>{/* Sidebar content */}</aside>

          <main className={styles.mainContent}>
            <header className={styles.header}>{/* Header content */}</header>

            <section className={styles.container}>
              <div className={styles.card}>
                <h2 className={styles.title}>PERFIL</h2>

                {/* Sección de Avatar */}
                <div className={styles.formRow}>
                  <label className={styles.label}>Avatar:</label>
                  <div className={styles.avatarContainer}>
                    <div className={styles.avatarBlock}>
                      <span className={styles.avatarTitle}>Actual</span>
                      <img
                        src={avatar}
                        alt="Avatar actual"
                        className={styles.avatarImage}
                      />
                    </div>
                    <div className={styles.avatarBlock}>
                      <span className={styles.avatarTitle}>Subir</span>
                      <Upload
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleAvatarChange}
                        accept="image/*"
                      >
                        <button type="button" className={styles.uploadButton}>
                          <span className={styles.uploadText}>Upload</span>
                        </button>
                      </Upload>
                    </div>
                  </div>
                </div>

                <div className={styles.divider}></div>

                {/* Campos del formulario */}
                <div className={styles.formField}>
                  <label className={styles.label}>Nombre:</label>
                  <Input
                    className={styles.input}
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Apellido Paterno:</label>
                  <Input
                    className={styles.input}
                    value={apellidoPaterno}
                    onChange={(e) => setApellidoPaterno(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Apellido Materno:</label>
                  <Input
                    className={styles.input}
                    value={apellidoMaterno}
                    onChange={(e) => setApellidoMaterno(e.target.value)}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Género:</label>
                  <Select
                    className={styles.select}
                    value={genero}
                    onChange={setGenero}
                    allowClear
                    options={[
                      { value: 'M', label: 'Masculino' },
                      { value: 'F', label: 'Femenino' },
                    ]}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Correo:</label>
                  <div className={styles.emailContainer}>
                    <Input className={styles.input} value={correo} readOnly />
                    <Button
                      className={styles.cambiarBtn}
                      onClick={handleOpenEmailModal}
                      icon={<Envelope size={16} />}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Contraseña:</label>
                  <div className={styles.passwordContainer}>
                    <Button
                      className={styles.cambiarBtn}
                      icon={<ShieldCheck size={16} />}
                      onClick={handleOpenPasswordModal}
                    >
                      Cambiar
                    </Button>
                  </div>
                </div>

                <div className={styles.saveButtonContainer}>
                  <Button
                    type="primary"
                    className={styles.saveButton}
                    size="large"
                    onClick={handleSaveChanges}
                    loading={isUpdating}
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </div>
            </section>
          </main>
        </div>

        {/* ========================================*/}
        {/* Modal para cambiar correo (primer paso) */}
        {/* ========================================*/}
        <Modal
          title={null}
          open={showEmailModal}
          onCancel={handleCloseEmailModal}
          footer={null}
          centered
          width={520}
          closable={false}
          className={styles.modalContainer}
        >
          <div className={styles.modalHeader}>
            <Button
              type="text"
              icon={<ArrowLeft size={20} />}
              onClick={handleCloseEmailModal}
              className={styles.backButton}
            />
            <div className={styles.modalLogoContainer}>
              <img
                src="/src/assets/Img/MiniLogoReflexo.webp"
                alt="Logo"
                className={styles.modalLogo}
              />
            </div>
          </div>

          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Cambiar correo electrónico</h3>
            <p className={styles.modalDescription}>
              Para actualizar tu correo electrónico, ingresa tu nuevo correo y
              te enviaremos un código de verificación.
            </p>
            <Form
              form={emailForm}
              onFinish={handleSubmitNewEmail}
              layout="vertical"
              className={styles.modalForm}
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Por favor ingresa tu correo' },
                  { type: 'email', message: 'Ingresa un correo válido' },
                ]}
              >
                <Input
                  size="large"
                  prefix={<Envelope size={18} color="#666" />}
                  placeholder="Ingresa tu nuevo correo"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={codeLoading}
                  className={styles.modalSubmitButton}
                >
                  Enviar código de verificación
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* =====================================================*/}
        {/* Modal para verificar código de correo (segundo paso) */}
        {/* =====================================================*/}
        <Modal
          title={null}
          open={showCodeModal}
          onCancel={handleCloseCodeModal}
          footer={null}
          centered
          width={520}
          closable={false}
          className={styles.modalContainer}
        >
          <div className={styles.modalHeader}>
            <Button
              type="text"
              icon={<ArrowLeft size={20} />}
              onClick={handleCloseCodeModal}
              className={styles.backButton}
            />
            <div className={styles.modalLogoContainer}>
              <CheckCircle size={48} color="#4CAF50" weight="fill" />
            </div>
          </div>

          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Verificar tu identidad</h3>
            <div className={styles.codeDescription}>
              <p className={styles.modalDescription}>
                Enviado un código de verificación de 6 dígitos a:
              </p>
              <p className={styles.emailText}>{newEmail}</p>
            </div>

            <Form
              form={codeForm}
              onFinish={handleVerifyCode}
              layout="vertical"
              className={styles.modalForm}
            >
              <Form.Item
                name="code"
                rules={[
                  { required: true, message: 'Por favor ingresa el código' },
                  { len: 6, message: 'El código debe tener 6 dígitos' },
                ]}
              >
                <div className={styles.otpContainer}>
                  <Input.OTP
                    size="large"
                    length={6}
                    onChange={setCode}
                    className={styles.otpInput}
                    inputClassName={styles.otpSingleInput}
                  />
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={verifyLoading}
                  disabled={code.length !== 6}
                  className={styles.modalSubmitButton}
                >
                  Verificar código
                </Button>
              </Form.Item>
            </Form>

            <div className={styles.modalFooter}>
              <p className={styles.footerText}>¿No recibiste el código?</p>
              <div className={styles.footerActions}>
                <Button
                  type="link"
                  onClick={handleResendCode}
                  disabled={countdown > 0}
                  className={styles.resendButton}
                >
                  {countdown > 0
                    ? `Reenviar en ${countdown}s`
                    : 'Reenviar código'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>

        {/* ===========================================*/}
        {/* Modal para contraseña actual (primer paso) */}
        {/* ===========================================*/}
        <Modal
          title={null}
          open={showCurrentPasswordModal}
          onCancel={handleCloseCurrentPasswordModal}
          footer={null}
          centered
          width={520}
          closable={false}
        >
          <div className={styles.modalHeader}>
            <Button
              type="text"
              icon={<ArrowLeft size={20} />}
              onClick={handleCloseCurrentPasswordModal}
              className={styles.backButton}
            />
            <div className={styles.modalLogoContainer}>
              <img
                src="/src/assets/Img/MiniLogoReflexo.webp"
                alt="Logo"
                className={styles.modalLogo}
              />
            </div>
          </div>

          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Cambiar contraseña</h3>
            <p className={styles.modalDescription}>
              Para actualizar tu contraseña, primero ingresa tu contraseña
              actual para verificar tu identidad.
            </p>
            <Form
              form={currentPasswordForm}
              onFinish={handleSubmitCurrentPassword}
              layout="vertical"
              className={styles.modalForm}
            >
              <Form.Item
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingresa tu contraseña actual',
                  },
                ]}
              >
                <Password
                  size="large"
                  placeholder="Ingresa tu contraseña actual"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={currentPasswordLoading}
                  className={styles.modalSubmitButton}
                >
                  Verificar contraseña
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

        {/* ===========================================*/}
        {/* Modal para nueva contraseña (segundo paso) */}
        {/* ===========================================*/}
        <Modal
          title={null}
          open={showNewPasswordModal}
          onCancel={handleCloseNewPasswordModal}
          footer={null}
          centered
          width={520}
          closable={false}
          className={styles.modalContainer}
        >
          <div className={styles.modalHeader}>
            <Button
              type="text"
              icon={<ArrowLeft size={20} />}
              onClick={handleCloseNewPasswordModal}
              className={styles.backButton}
            />
            <div className={styles.modalLogoContainer}>
              <CheckCircle size={48} color="#4CAF50" weight="fill" />
            </div>
          </div>

          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Crear nueva contraseña</h3>
            <p className={styles.modalDescription}>
              Ingresa tu nueva contraseña y confírmala para completar el
              proceso.
            </p>
            <Form
              form={newPasswordForm}
              onFinish={handleSubmitNewPassword}
              layout="vertical"
            >
              <Form.Item
                name="newPassword"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingresa tu nueva contraseña',
                  },
                  {
                    min: 8,
                    message: 'La contraseña debe tener al menos 8 caracteres',
                  },
                ]}
              >
                <Password
                  size="large"
                  placeholder="Ingresa tu nueva contraseña"
                />
              </Form.Item>

              <Form.Item
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  {
                    required: true,
                    message: 'Por favor confirma tu nueva contraseña',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Las contraseñas no coinciden'),
                      );
                    },
                  }),
                ]}
              >
                <Password
                  size="large"
                  placeholder="Confirma tu nueva contraseña"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={newPasswordLoading}
                  className={styles.modalSubmitButton}
                >
                  Actualizar contraseña
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Profile;
