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
import ModalBase from '../../../components/Modal/BaseModalProfile/BaseModalProfile';
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

        <ModalBase
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleSubmitNewEmail}
          title="Cambiar correo electrónico"
          description="Para actualizar tu correo electrónico, ingresa tu nuevo correo y te enviaremos un código de verificación."
          type="email"
          loading={codeLoading}
        />
        <ModalBase
          isOpen={showCodeModal}
          onClose={handleCloseCodeModal}
          onSubmit={handleVerifyCode}
          title="Verificar tu identidad"
          type="code"
          email={newEmail}
          countdown={countdown}
          onResend={handleResendCode}
          loading={verifyLoading}
        />
        <ModalBase
          isOpen={showCurrentPasswordModal}
          onClose={() => setShowCurrentPasswordModal(false)}
          onSubmit={handleSubmitCurrentPassword}
          title="Cambiar contraseña"
          description="Para actualizar tu contraseña, primero ingresa tu contraseña actual para verificar tu identidad."
          type="currentPassword"
          loading={currentPasswordLoading}
        />
        <ModalBase
          isOpen={showNewPasswordModal}
          onClose={handleCloseNewPasswordModal}
          onSubmit={handleSubmitNewPassword}
          title="Crear nueva contraseña"
          description="Ingresa tu nueva contraseña y confírmala para completar el proceso."
          type="newPassword"
          loading={newPasswordLoading}
        />
      </div>
    </ConfigProvider>
  );
};

export default Profile;
