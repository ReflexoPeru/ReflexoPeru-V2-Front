import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Eye, EyeSlash, Lock } from '@phosphor-icons/react';
import styles from './ForgotPassword.module.css';
import logo from '../../../../assets/Img/Dashboard/MiniLogoReflexo.webp';

function NewPassword({ onSubmit, email }) {
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(password, passwordConfirmation);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <>
      <img src={logo} className={styles.logo} alt="Logo" />
      <h2>Nueva Contraseña</h2>
      <p className={styles.subtitle}>
        Crea una nueva contraseña para tu cuenta
      </p>
      <Form
        name="new-password"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Por favor ingresa tu contraseña!' },
            { min: 8, message: 'La contraseña debe tener mínimo 8 caracteres!' },
          ]}
        >
          <div className={styles.inputContainer}>
            <Lock size={24} weight="bold" />
            <Input
              type={passwordVisible ? 'text' : 'password'}
              placeholder="Nueva contraseña (mínimo 8 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            {passwordVisible ? (
              <EyeSlash
                size={24}
                weight="bold"
                onClick={togglePasswordVisibility}
                className={styles.eyeIcon}
              />
            ) : (
              <Eye
                size={24}
                weight="bold"
                onClick={togglePasswordVisibility}
                className={styles.eyeIcon}
              />
            )}
          </div>
        </Form.Item>

        <Form.Item
          name="passwordConfirmation"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Por favor confirma tu contraseña!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Las contraseñas no coinciden!'));
              },
            }),
          ]}
        >
          <div className={styles.inputContainer}>
            <Lock size={24} weight="bold" />
            <Input
              type={confirmPasswordVisible ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={loading}
            />
            {confirmPasswordVisible ? (
              <EyeSlash
                size={24}
                weight="bold"
                onClick={toggleConfirmPasswordVisibility}
                className={styles.eyeIcon}
              />
            ) : (
              <Eye
                size={24}
                weight="bold"
                onClick={toggleConfirmPasswordVisibility}
                className={styles.eyeIcon}
              />
            )}
          </div>
        </Form.Item>

        <Form.Item className={styles.buttonContainer}>
          <Button
            type="primary"
            htmlType="submit"
            className={styles.submitButton}
            loading={loading}
            block
          >
            {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default NewPassword;


