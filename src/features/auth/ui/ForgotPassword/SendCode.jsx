import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Envelope } from '@phosphor-icons/react';
import styles from './ForgotPassword.module.css';
import logo from '../../../../assets/Img/Dashboard/MiniLogoReflexo.webp';

function SendCode({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit(email);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <img src={logo} className={styles.logo} alt="Logo" />
      <h2>¿Olvidaste tu contraseña?</h2>
      <p className={styles.subtitle}>
        Ingresa tu correo electrónico y te enviaremos un código de verificación de 6 dígitos
      </p>
      <Form
        name="send-code"
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Por favor ingresa tu correo!' },
            { type: 'email', message: 'Ingresa un correo válido!' },
          ]}
        >
          <div className={styles.inputContainer}>
            <Envelope size={24} weight="bold" />
            <Input
              placeholder="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
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
            {loading ? 'Enviando...' : 'Enviar Código'}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default SendCode;


