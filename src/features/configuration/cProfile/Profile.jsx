import React, { useState } from 'react';
import { Upload, Select, Button, Input, Modal, message, Form } from 'antd';
import {
  Envelope,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
} from '@phosphor-icons/react';
import styles from './Profile.module.css';

const Profile = () => {
  const [avatar, setAvatar] = useState('/src/assets/Img/MiniLogoReflexo.webp');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState('');
  const [contrasena, setContrasena] = useState('');

  // Estados para los modales de correo
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Forms refs
  const [emailForm] = Form.useForm();
  const [codeForm] = Form.useForm();

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

  // Función para abrir el modal de nuevo correo
  const handleOpenEmailModal = () => {
    setShowEmailModal(true);
    emailForm.resetFields();
  };

  // Función para cerrar el modal de nuevo correo
  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    setNewEmail('');
    emailForm.resetFields();
  };

  // Función para enviar el nuevo correo y abrir el modal de código
  const handleSubmitNewEmail = async (values) => {
    setLoading(true);
    setNewEmail(values.email);

    // Simular envío de código
    setTimeout(() => {
      setLoading(false);
      setShowEmailModal(false);
      setShowCodeModal(true);
      startCountdown();
      message.success('Código de verificación enviado');
    }, 2000);
  };

  // Función para cerrar el modal de código
  const handleCloseCodeModal = () => {
    setShowCodeModal(false);
    setCode('');
    setNewEmail('');
    setCountdown(0);
    codeForm.resetFields();
  };

  // Función para verificar el código
  const handleVerifyCode = async (values) => {
    setLoading(true);

    // Simular verificación del código
    setTimeout(() => {
      setLoading(false);
      setCorreo(newEmail);
      setShowCodeModal(false);
      setCode('');
      setNewEmail('');
      setCountdown(0);
      codeForm.resetFields();
      message.success('¡Correo actualizado exitosamente!');
    }, 1500);
  };

  // Función para reenviar código
  const handleResendCode = () => {
    if (countdown > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      startCountdown();
      message.success('Código reenviado');
    }, 1000);
  };

  // Countdown para reenvío
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

  return (
    <div className={styles.body}>
      <div className={styles.layout}>
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.card}>
              <h2 className={styles.title}>PERFIL</h2>

              {/* Avatar section */}
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

              {/* Divider line */}
              <div className={styles.divider}></div>

              {/* Form fields */}
              <div className={styles.formField}>
                <label className={styles.label}>Nombre:</label>
                <Input
                  className={styles.input}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ingresa tu nombre"
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Correo:</label>
                <Input
                  className={styles.input}
                  value={correo}
                  readOnly
                  placeholder="tu@correo.com"
                />
                <Button
                  className={styles.cambiarBtn}
                  onClick={handleOpenEmailModal}
                  icon={<Envelope size={16} />}
                >
                  Cambiar
                </Button>
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
                  <Input.Password
                    className={styles.passwordInput}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    placeholder="••••••••"
                  />
                  <Button
                    className={styles.cambiarBtn}
                    icon={<ShieldCheck size={16} />}
                  >
                    Cambiar
                  </Button>
                </div>
              </div>

              {/* Save button */}
              <div className={styles.saveButtonContainer}>
                <Button
                  type="primary"
                  className={styles.saveButton}
                  size="large"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* MODAL 1: Para agregar nuevo correo */}
      <Modal
        title={null}
        open={showEmailModal}
        onCancel={handleCloseEmailModal}
        footer={null}
        centered
        width={520}
        closable={false}
        className={styles.customModal}
        styles={{
          content: { padding: 0, borderRadius: '16px', overflow: 'hidden' },
        }}
      >
        <div className={styles.modalBody}>
          {/* Header con botón de regreso */}
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

          {/* Contenido */}
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Cambiar correo electrónico</h3>
            <p className={styles.modalMessage}>
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
                  className={styles.modalButton}
                >
                  Enviar código de verificación
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>

      {/* MODAL 2: Para ingresar código de verificación */}
      <Modal
        title={null}
        open={showCodeModal}
        onCancel={handleCloseCodeModal}
        footer={null}
        centered
        width={520}
        closable={false}
        className={styles.customModal}
        styles={{
          content: { padding: 0, borderRadius: '16px', overflow: 'hidden' },
        }}
      >
        <div className={styles.modalBody}>
          {/* Header con botón de regreso */}
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

          {/* Contenido */}
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>Verificar tu identidad</h3>
            <div className={styles.codeVerificationInfo}>
              <p className={styles.modalSubtitle}>
                Enviado un código de verificación de 6 dígitos a:
              </p>
              <p className={styles.modalEmail}>{newEmail}</p>
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
                    placeholder="•"
                    className={styles.otpInput}
                    onChange={(text) => setCode(text)}
                  />
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={loading}
                  disabled={code.length !== 6}
                  className={styles.modalButton}
                >
                  Verificar código
                </Button>
              </Form.Item>
            </Form>

            {/* Opciones adicionales */}
            <div className={styles.modalFooter}>
              <p className={styles.modalFooterText}>¿No recibiste el código?</p>
              <div className={styles.modalFooterActions}>
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
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
