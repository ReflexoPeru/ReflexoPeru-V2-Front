import React from 'react';
import { Modal, Button, Form, Input } from 'antd';
import {
  Envelope,
  ShieldCheck,
  ArrowLeft,
  CheckCircle,
} from '@phosphor-icons/react';
import styles from './BaseModalProfile.module.css';

const ModalBase = ({
  isOpen,
  onClose,
  title,
  description,
  type, // 'email' | 'code' | 'currentPassword' | 'newPassword'
  onSubmit,
  loading,
  email,
  countdown,
  onResend,
}) => {
  const [form] = Form.useForm();

  // Efecto para resetear el formulario cuando se abre/cierra
  React.useEffect(() => {
    if (isOpen) {
      form.resetFields();
    }
  }, [isOpen, form]);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = (values) => {
    onSubmit(values);
    // Limpiamos el formulario después de un submit exitoso
    if (type !== 'code') {
      form.resetFields();
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'email':
        return (
          <Form
            form={form}
            onFinish={handleSubmit}
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
          </Form>
        );

      case 'code':
        return (
          <>
            <div className={styles.codeDescription}>
              <p className={styles.modalDescription}>
                Enviado un código de verificación de 6 dígitos a:
              </p>
              <p className={styles.emailText}>{email}</p>
            </div>

            <Form
              form={form}
              onFinish={handleSubmit}
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
                    className={styles.otpInput}
                    inputClassName={styles.otpSingleInput}
                  />
                </div>
              </Form.Item>
            </Form>

            <div className={styles.modalFooter}>
              <p className={styles.footerText}>¿No recibiste el código?</p>
              <div className={styles.footerActions}>
                <Button
                  type="link"
                  onClick={onResend}
                  disabled={countdown > 0}
                  className={styles.resendButton}
                >
                  {countdown > 0
                    ? `Reenviar en ${countdown}s`
                    : 'Reenviar código'}
                </Button>
              </div>
            </div>
          </>
        );

      case 'currentPassword':
        return (
          <Form
            form={form}
            onFinish={handleSubmit}
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
              <Input.Password
                size="large"
                placeholder="Ingresa tu contraseña actual"
              />
            </Form.Item>
          </Form>
        );

      case 'newPassword':
        return (
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className={styles.modalForm}
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
              <Input.Password
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
              <Input.Password
                size="large"
                placeholder="Confirma tu nueva contraseña"
              />
            </Form.Item>
          </Form>
        );

      default:
        return null;
    }
  };

  const renderIcon = () => {
    if (type === 'code' || type === 'newPassword') {
      return <CheckCircle size={48} color="#4CAF50" weight="fill" />;
    }
    return (
      <img
        src="/src/assets/Img/MiniLogoReflexo.webp"
        alt="Logo"
        className={styles.modalLogo}
      />
    );
  };

  const renderSubmitButton = () => {
    const buttonTexts = {
      email: 'Enviar código de verificación',
      code: 'Verificar código',
      currentPassword: 'Verificar contraseña',
      newPassword: 'Actualizar contraseña',
    };

    return (
      <Button
        type="primary"
        htmlType="submit"
        size="large"
        block
        loading={loading}
        className={styles.modalSubmitButton}
        onClick={() => form.submit()}
      >
        {buttonTexts[type]}
      </Button>
    );
  };

  return (
    <Modal
      title={null}
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={520}
      closable={false}
      className={styles.modalContainer}
      destroyOnClose // Esto asegura que el componente se destruya al cerrar
      forceRender // Fuerza el renderizado del contenido al abrir el modal
    >
      <div className={styles.modalHeader}>
        <Button
          type="text"
          icon={<ArrowLeft size={20} />}
          onClick={handleClose}
          className={styles.backButton}
        />
        <div className={styles.modalLogoContainer}>{renderIcon()}</div>
      </div>

      <div className={styles.modalContent}>
        <h3 className={styles.modalTitle}>{title}</h3>
        {description && (
          <p className={styles.modalDescription}>{description}</p>
        )}

        {renderContent()}

        {type !== 'code' && renderSubmitButton()}
      </div>
    </Modal>
  );
};

export default ModalBase;
