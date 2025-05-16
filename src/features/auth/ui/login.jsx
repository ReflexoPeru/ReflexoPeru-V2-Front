import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider, message } from 'antd';
import styles from './Login.module.css';
import logo from '../../../assets/Img/Dashboard/MiniLogoReflexo.webp';
import { User, Eye, EyeSlash } from '@phosphor-icons/react';
import { initializeParticles } from '../hook/loginpacticles';
import { useNavigate } from 'react-router';
import { users } from '../../../mock/Loginuser';

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const onForgotPassword = () => {
    navigate('/contraseñaolvidada');
  };

  useEffect(() => {
    const cleanup = initializeParticles();

    return cleanup;
  }, []);

  const onFinish = (values) => {
    const { username, password } = values;

    // Validar las credenciales
    const user = users.find(
      (user) => user.username === username && user.password === password,
    );

    if (user) {
      navigate('/Inicio');
    } else {
    }
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
            fontSize: 'clamp(1rem, 2.5vw, 1.1rem)',
          },
          Button: {
            colorPrimary: '#1b7b46',
            colorPrimaryHover: '#16623a',
            colorPrimaryActive: '#144e30',
            colorTextLightSolid: '#fff',
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

              <a className={styles.forgot} onClick={onForgotPassword}>
                Olvide mi Contraseña
              </a>
              <Form.Item className={styles.buttoncontainer}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ hoverBg: '#1a3928' }}
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
