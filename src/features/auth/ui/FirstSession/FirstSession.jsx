import React, { useState, useEffect } from 'react';
import { Form, Input, Button, ConfigProvider } from 'antd';
import styles from './FirstSession.module.css';
import logo from '../../../../assets/Img/Dashboard/MiniLogoReflexo.webp';
import { User, Eye, EyeSlash } from '@phosphor-icons/react';
import { initializeParticles } from '../../hook/loginpacticles'; // Import the function

function FirstSession() {
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
            <h2>
              ¡Es tu primera vez! <br />
              Se te envio un codigo de verificación a tu correo
            </h2>
            <Form
              name="normal_login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Por favor ingresa el codigo' },
                ]}
              >
                <div className={styles.inputContainer}>
                  <Input placeholder="######" />
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
