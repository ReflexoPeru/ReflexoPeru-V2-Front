import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import styles from './ChangesPassword.module.css';
import logo from '../../../../assets/Img/Dashboard/MiniLogoReflexo.webp';
import { User, Eye, EyeSlash } from '@phosphor-icons/react';
import { initializeParticles } from '../../hook/loginpacticles'; // Import the function

function ChangesPassword() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisible2, setPasswordVisible2] = useState(false);

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

  const togglePasswordVisibility2 = () => {
    setPasswordVisible2(!passwordVisible2);
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
            <h2>
              Por motivos de seguridad necesitamos que cambies tu contraseña
            </h2>
            <Form
              className={styles.form}
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                className={styles.divContainerone}
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

              <Form.Item
                className={styles.divContainertwo}
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Por favor ingresa tu contraseña!',
                  },
                ]}
              >
                <div className={styles.inputContainer}>
                  {passwordVisible2 ? (
                    <EyeSlash
                      size={24}
                      weight="bold"
                      onClick={togglePasswordVisibility2}
                    />
                  ) : (
                    <Eye
                      size={24}
                      weight="bold"
                      onClick={togglePasswordVisibility2}
                    />
                  )}
                  <Input
                    type={passwordVisible2 ? 'text' : 'password'}
                    placeholder="Contraseña"
                  />
                </div>
              </Form.Item>

              <Form.Item className={styles.buttoncontainer}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Verificar
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

export default ChangesPassword;
