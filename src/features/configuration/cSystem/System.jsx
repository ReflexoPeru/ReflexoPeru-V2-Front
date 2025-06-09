import React, { useState, useEffect } from 'react';
import { Upload, Input, Button, Spin, Image } from 'antd';
import { UploadSimple } from '@phosphor-icons/react';
import styles from './System.module.css';
import { useSystemHook } from './hook/systemHook';

const System = () => {
  const { companyInfo, logoInfo, loading, error } = useSystemHook();
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoError, setLogoError] = useState(false);

  // Manejo de datos de la API
  useEffect(() => {
    if (companyInfo) {
      setCompanyName(companyInfo.company_name || '');
    }

    if (logoInfo?.logo_url) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const cleanLogoPath = logoInfo.logo_url.replace(/^\/+/, '');
      const fullLogoUrl = `${apiBaseUrl}/${cleanLogoPath}`;
      
      // Pre-cargar imagen para verificar si existe
      const testImage = new Image();
      testImage.src = fullLogoUrl;
      testImage.onload = () => {
        setLogoUrl(fullLogoUrl);
        setLogoError(false);
      };
      testImage.onerror = () => {
        console.error('Logo no encontrado en:', fullLogoUrl);
        setLogoError(true);
        setLogoUrl('/src/assets/Img/MiniLogoReflexo.webp');
      };
    }
  }, [companyInfo, logoInfo]);

  const handleLogoChange = (info) => {
    const file = info.file.originFileObj;
    if (file && (info.file.status === 'done' || info.file.status === 'uploading')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoUrl(e.target.result);
        setLogoError(false);
      };
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
        <p>Error al cargar la información: {error.message}</p>
      </div>
    );
  }

  if (!companyInfo || !logoInfo) {
    return (
      <div className={styles.layout}>
        <p>No se encontraron datos de la empresa</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        <section className={styles.container}>
          <div className={styles.box}>
            {/* Sección del Logo */}
            <div className={styles.section}>
              <label className={styles.label}>Logo de la empresa:</label>
              <div className={styles.logoRow}>
                <div className={styles.logoBlock}>
                  <span className={styles.logoTitle}>Actual</span>
                  {logoInfo.logo_url && !logoError ? (
                    <Image
                      src={logoUrl}
                      alt={`Logo de ${companyName}`}
                      className={styles.logoImage}
                      fallback="/src/assets/Img/MiniLogoReflexo.webp"
                      preview={false}
                    />
                  ) : (
                    <div className={styles.noLogo}>
                      {logoError ? 'Error al cargar el logo' : 'No hay logo disponible'}
                    </div>
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

            {/* Sección del Nombre */}
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