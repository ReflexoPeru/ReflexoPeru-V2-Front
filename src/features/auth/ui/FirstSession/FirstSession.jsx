import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import styles from './FirstSession.module.css';
import logo from '../../../../assets/Img/Dashboard/MiniLogoReflexo.webp';
import { User, Eye, EyeSlash } from '@phosphor-icons/react';
import { initializeParticles } from '../../../../hooks/loginpacticles'; // Import the function
import { useAuth } from '../../hook/authHook';

function FirstSession() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [code, setCode] = useState('');

  const { validateCode } = useAuth();

  useEffect(() => {
    const cleanup = initializeParticles(); // Use the function

    return cleanup;
  }, []);

  const onSubmit = () => {
    const codeVerification = {
      code: code,
    };
    validateCode(codeVerification);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Input: {
            hoverBg: '#414141',
            colorErrorBg: '#666666',
            colorErrorText: '#fff',
            colorErrorBgHover: '#414141',
            hoverBorderColor: 'transparent',
            activeBorderColor: 'transparent',
            activeBg: '#666666',
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
              ¡Es tu primera vez! <br />
              Se te envio un codigo de verificación a tu correo
            </h2>
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onSubmit}
            >
              <Form.Item
                name="code"
                rules={[
                  { required: true, message: 'Por favor ingresa el codigo' },
                ]}
              >
                <div className={styles.inputContainer}>
                  <Input.OTP
                    variant="filled"
                    placeholder="######"
                    className={styles.input}
                    onChange={(text) => setCode(text)}
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

export default FirstSession;
