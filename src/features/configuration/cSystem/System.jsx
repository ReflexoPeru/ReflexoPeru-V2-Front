import React, { useState } from 'react';
import { Upload, Input, Button, ConfigProvider } from 'antd';
import { UploadSimple } from '@phosphor-icons/react';
import styles from './System.module.css';

const System = () => {
  const [companyName, setCompanyName] = useState('Centro de Reflexoterapia');
  const [logoUrl, setLogoUrl] = useState('/src/assets/Img/MiniLogoReflexo.webp');

  const handleLogoChange = (info) => {
    const file = info.file.originFileObj;
    if (
      file &&
      (info.file.status === 'done' || info.file.status === 'uploading')
    ) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target.result);
      reader.readAsDataURL(file);
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
    },
  };

  return (
    <ConfigProvider theme={theme}>
      <div className={styles.body}>
        <div className={styles.layout}>
          <main className={styles.mainContent}>
            <div className={styles.container}>
              <div className={styles.card}>
                <h2 className={styles.title}>CONFIGURACIÓN DEL SISTEMA</h2>

                {/* Logo Section */}
                <div className={styles.formRow}>
                  <label className={styles.label}>Logo de la empresa:</label>
                  <div className={styles.logoContainer}>
                    <div className={styles.logoBlock}>
                      <span className={styles.logoTitle}>Actual</span>
                      <img
                        src={logoUrl}
                        alt="Logo actual de la empresa"
                        className={styles.logoImage}
                      />
                    </div>
                    <div className={styles.logoBlock}>
                      <span className={styles.logoTitle}>Subir nuevo</span>
                      <Upload
                        showUploadList={false}
                        beforeUpload={() => false}
                        onChange={handleLogoChange}
                        accept="image/*"
                      >
                        <button type="button" className={styles.uploadButton}>
                          <UploadSimple size={24} weight="bold" color="#b0b0b0" />
                          <span className={styles.uploadText}>Upload</span>
                        </button>
                      </Upload>
                    </div>
                  </div>
                </div>

                <div className={styles.divider}></div>

                {/* Company Name Section */}
                <div className={styles.formField}>
                  <label className={styles.label} htmlFor="companyNameInput">
                    Nombre de la empresa:
                  </label>
                  <div className={styles.nameContainer}>
                    <Input
                      id="companyNameInput"
                      className={styles.input}
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Ingresa el nombre de la empresa"
                    />
                    <Button className={styles.cambiarBtn}>
                      Cambiar
                    </Button>
                  </div>
                </div>

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
      </div>
    </ConfigProvider>
  );
};

export default System;