import { useState, useEffect } from 'react';
import { Upload, Input, Button, Spin, Image } from 'antd';
import { UploadSimple } from '@phosphor-icons/react';
import styles from './System.module.css';
import { useSystemHook, useCompanyInfo } from './hook/systemHook';

const System = () => {
  const { logoInfo, loading, error } = useSystemHook();
  const { companyInfo, loadingInfo, errorInfo } = useCompanyInfo();
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoError, setLogoError] = useState(false);

  // Manejo de datos de la API
  useEffect(() => {
    let objectUrl; 

    if (companyInfo?.company_name) setCompanyName(companyInfo.company_name);

    if (logoInfo instanceof Blob) {
      objectUrl = URL.createObjectURL(logoInfo);
      setLogoUrl(objectUrl); // 👈 Cache-busting
      setLogoError(false);
    }

    return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl); // 👈 Limpieza
    }
  };
  }, [companyInfo, logoInfo]);

  const handleLogoChange = ({ file }) => {
    const f = file.originFileObj;
    if (f) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target.result);
      reader.readAsDataURL(f);
      setLogoError(false);
    }
  };

  if (loading) return <div className={styles.layout}><Spin size="large" /></div>;
  if (error) return <div className={styles.layout}><p>Error: {error.message}</p></div>;


  // if (!companyInfo || !logoInfo) {
  //   return (
  //     <div className={styles.layout}>
  //       <p>No se encontraron datos de la empresa</p>
  //     </div>
  //   );
  // }

  return (
    <div className={styles.layout}>
      <main className={styles.mainContent}>
        <section className={styles.container}>
          <div className={styles.box}>

            {/* Logo */}
            <div className={styles.section}>
              <label className={styles.label}>Logo de la empresa:</label>
              <div className={styles.logoRow}>
                <div className={styles.logoBlock}>
                  <span className={styles.logoTitle}>Actual</span>
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={`Logo de ${companyName}`}
                      preview={false}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #4CAF50',
                        padding: '3px',
                        backgroundColor: '#000'
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

            {/* Nombre */}
            <div className={styles.section}>
              <label className={styles.label} htmlFor="companyNameInput">Nombre de la empresa:</label>
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