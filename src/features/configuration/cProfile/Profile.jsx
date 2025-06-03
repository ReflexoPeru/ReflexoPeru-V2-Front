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
} from 'antd';
import {
  Envelope,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
} from '@phosphor-icons/react';
import styles from './Profile.module.css';
import { useSendVerifyCode , useProfile, useUpdateProfile } from './hook/profileHook';

const Profile = () => {
  const [avatar, setAvatar] = useState('/src/assets/Img/MiniLogoReflexo.webp');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Estados para los modales de correo
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Forms refs
  const [emailForm] = Form.useForm();
  const [codeForm] = Form.useForm();

  // Hook personalizado para enviar código
  const { sendCode, verify, updateEmail, loading, error } = useSendVerifyCode();
  // Hook personalizado para obtener el perfil
  const { profile } = useProfile();
  // Hook personalizado para actualizar el perfil
  const { updateProfile, isUpdating } = useUpdateProfile();


  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    if (
      file &&
      (info.file.status === 'done' || info.file.status === 'uploading')
    ) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

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
    } catch {
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
      // 1. Verificar el código primero
      await verify(values.code);

      // 2. Si la verificación es exitosa, actualizar el correo
      await updateEmail(newEmail);

      // 3. Actualizar el estado local
      setCorreo(newEmail);
      setShowCodeModal(false);
      setCode('');
      setNewEmail('');
      setCountdown(0);
      codeForm.resetFields();
      message.success('¡Correo actualizado exitosamente!');
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          'Error al actualizar el correo. Intenta de nuevo.',
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

  useEffect(() => {
    if (profile) {
      setNombre(profile.name || '');
      setApellidoPaterno(profile.paternal_lastname || '');
      setApellidoMaterno(profile.maternal_lastname || '');
      setCorreo(profile.email || '');
    }
  }, [profile]);

  // Función para manejar el guardado
  const handleSaveChanges = async () => {
    try {
      const updateData = {
        name: nombre,
        paternal_lastname: apellidoPaterno,
        maternal_lastname: apellidoMaterno,
      };

      await updateProfile(updateData);
      message.success('Cambios guardados exitosamente');

      // Recargar la página
      window.location.reload();
      refetch();
    } catch (error) {
      message.error('Error al actualzilar el perfil:' + (error.response?.data?.message || error.message));
    }
  };

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
      InputNumber: {
        colorBgContainer: '#2a2a2a',
      },
      Select: {
        optionSelectedBg: '#333',
        optionActiveBg: '#3a3a3a',
      },
      Form: {
        itemMarginBottom: 16,
      },
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.body}>
        <div className={styles.layout}>
          <main className={styles.mainContent}>
            <div className={styles.container}>
              <div className={styles.card}>
                <h2 className={styles.title}>PERFIL</h2>

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
                  <label className={styles.label}>Género:</label>
                  <Select
                    className={styles.select}
                    value={genero}
                    onChange={(value) => setGenero(value)}
                    placeholder="Selecciona tu género"
                    options={[
                      { value: 'masculino', label: 'Masculino' },
                      { value: 'femenino', label: 'Femenino' },
                      { value: 'otro', label: 'Otro' },
                    ]}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Contraseña:</label>
                  <div className={styles.passwordContainer}>
                    {/* <Input.Password
                      className={styles.passwordInput}
                      value={contrasena}
                      onChange={(e) => setContrasena(e.target.value)}
                      placeholder="••••••••"
                    /> */}
                    <Button
                      className={styles.cambiarBtn}
                      icon={<ShieldCheck size={16} />}
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
            </div>
          </main>
        </div>

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
                  className={styles.modalInput}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  className={styles.modalSubmitButton}
                >
                  Enviar código de verificación
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Modal>

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
      </div>
    </ConfigProvider>
  );
};

export default Profile;
