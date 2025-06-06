import React from 'react';
import { Upload, Input, Button, Spin } from 'antd';
import { UploadSimple } from '@phosphor-icons/react';
import styles from './System.module.css';
import { useSystemHook } from './hook/systemHook';
import { useState } from 'react';

// Asegúrate de que la ruta sea correcta
const System = () => {
  const { systemInfo, loading, error } = useSystemHook();
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Actualizar los estados locales cuando systemInfo cambie
  React.useEffect(() => {
    if (systemInfo.data) {
      setCompanyName(systemInfo.data.company_name);
      setLogoUrl(`${process.env.REACT_APP_API_BASE_URL || ''}${systemInfo.data.logo_url}` || '/src/assets/Img/MiniLogoReflexo.webp');
    }
  }, [systemInfo]);

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

  if (loading) {
    return (
      <div className={styles.layout}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.layout}>
        <p>Error al cargar la información de la empresa: {error.message}</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        <section className={styles.container}>
          <div className={styles.box}>
            {/* Logo section */}
            <div className={styles.section}>
              <label className={styles.label}>Logo de la empresa:</label>
              <div className={styles.logoRow}>
                <div className={styles.logoBlock}>
                  <span className={styles.logoTitle}>Actual</span>
                  {systemInfo.data?.has_logo ? (
                    <img
                      src={logoUrl}
                      alt={`Logo de ${companyName}`}
                      className={styles.logoImage}
                      onError={(e) => {
                        e.target.src = '/src/assets/Img/MiniLogoReflexo.webp';
                      }}
                    />
                  ) : (
                    <div className={styles.noLogo}>No hay logo disponible</div>
                  )}
                </div>

                <div className={styles.logoBlock}>
                  <span className={styles.logoTitle}>Subir nuevo</span>
                  <Upload
                    showUploadList={false}
                    beforeUpload={() => false}
                    accept="image/*"
                    onChange={handleLogoChange}
                  >
                    <button type="button" className={styles.uploadBtn}>
                      <UploadSimple size={32} weight="bold" />
                      <span className={styles.uploadText}>Upload</span>
                    </button>
                  </Upload>
                </div>
              </div>
            </div>

            {/* Company name section */}
            <div className={styles.section}>
              <label className={styles.label} htmlFor="companyNameInput">
                Nombre de la empresa:
              </label>
              <div className={styles.nameRow}>
                <Input
                  id="companyNameInput"
                  className={styles.input}
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ingresa el nombre de la empresa"
                />
                <Button type="primary" className={styles.changeBtn}>
                  Cambiar
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default System;