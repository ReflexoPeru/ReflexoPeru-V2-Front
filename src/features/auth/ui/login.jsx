import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import styles from './Login.module.css';
import logo from '../../../assets/Img/Dashboard/MiniLogoReflexo.webp';
import { User, Eye, EyeSlash } from '@phosphor-icons/react';
import { initializeParticles } from '../hook/loginpacticles'; // Import the function

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const cleanup = initializeParticles(); // Use the function

    return cleanup;
  }, []);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBg: 'transparent',
            hoverBorderColor: 'transparent',
            activeBorderColor: 'transparent',
            activeBg: 'transparent',
            addonBg: 'transparent',
          },
        },
      }}
    >
      <div>
        <div id="particles-js" className={styles.particlesJs}></div>
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            <img src={logo} className={styles.logo} alt="Logo de la empresa" />
            <h2>Bienvenido al Sistema del Centro de Reflexoterapia</h2>
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Por favor ingresa tu usuario!' },
                ]}
              >
                <div className={styles.inputContainer}>
                  <User size={24} weight="bold" />
                  <Input placeholder="Usuario" />
                </div>
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingresa tu contraseña!',
                  },
                ]}
              >
                <div className={styles.inputContainer}>
                  {passwordVisible ? (
                    <EyeSlash
                      size={24}
                      weight="bold"
                      onClick={togglePasswordVisibility}
                    />
                  ) : (
                    <Eye
                      size={24}
                      weight="bold"
                      onClick={togglePasswordVisibility}
                    />
                  )}
                  <Input
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Contraseña"
                  />
                </div>
              </Form.Item>

              <a className="login-form-forgot" href="">
                Olvide mi Contraseña
              </a>
              <Form.Item className={styles.buttoncontainer}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Entrar
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
        <div className={styles.footer}>
          © 2025 Centro de Reflexoterapia - Todos los derechos reservados
        </div>
      </div>
    </ConfigProvider>
  );
}

export default Login;
