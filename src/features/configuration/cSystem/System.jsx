import React, { useState } from 'react';
import { Upload, Input, Button } from 'antd';
import { UploadSimple } from '@phosphor-icons/react';
import styles from './System.module.css';

const System = () => {
  const [companyName, setCompanyName] = useState('Centro de Reflexoterapia');
  const [logoUrl, setLogoUrl] = useState(
    '/src/assets/Img/MiniLogoReflexo.webp',
  );

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

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar} aria-label="Sidebar">
        {/* Sidebar content */}
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>{/* Header content */}</header>

        <section className={styles.container}>
          <div className={styles.box}>
            {/* Logo section */}
            <div className={styles.section}>
              <label className={styles.label}>Logo de la empresa:</label>
              <div className={styles.logoRow}>
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
