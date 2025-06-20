import { useState, useEffect } from 'react';
import { Upload, Input, Button, Spin, Image, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import styles from './System.module.css';
import { useSystemHook, useCompanyInfo, useUpdateCompanyInfo, useUploadCompanyLogo } from './hook/systemHook';

const System = () => {
  const { logoInfo, loading, error, refetch } = useSystemHook();
  const { companyInfo} = useCompanyInfo();
  const { updateCompany, updating } = useUpdateCompanyInfo();
  const { uploadLogo, uploadingLogo, uploadError, uploadSuccess } = useUploadCompanyLogo();
  const [companyName, setCompanyName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Manejo de datos de la API
  useEffect(() => {
    let objectUrl; 

    if (companyInfo?.company_name) setCompanyName(companyInfo.company_name);

    if (logoInfo instanceof Blob) {
      objectUrl = URL.createObjectURL(logoInfo);
      setLogoUrl(objectUrl); // 👈 Cache-busting
    }

    return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl); // 👈 Limpieza
    }
  };
  }, [companyInfo, logoInfo]);

  //MOSTRAR MENSAJES DE EXITO/ERROR
  useEffect(() => {
    if (uploadSuccess) {
      message.success('Logo actualizado correctamente');
    }
    if (uploadError) {
      message.error(`Error al subir logo: ${uploadError.message}`);
    }
  }, [uploadSuccess, uploadError]);

  //TRAER DATOS DE LA EMPRESA
  const handleNameChange = () => {
    if (!companyName.trim()) return;
    updateCompany({ company_name: companyName });
  };

  //CAMBIAR EL LOGO
  const handleLogoChange = async (info) => {

    if (info.file.status === 'done') {
      const file = info.file.originFileObj;
      if (!file) return;

      // Preview local
      const reader = new FileReader();
      reader.onload = (e) => setLogoUrl(e.target.result);
      reader.readAsDataURL(file);
      try {
        await uploadLogo(file);
      } catch (err) {
        console.error("Error al subir logo", err);
      }
    }
  };

  if (loading) return <div className={styles.layout}><Spin size="large" /></div>;
  if (error) return <div className={styles.layout}><p>Error: {error.message}</p></div>;

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
                    name="logo"
                    listType="picture-circle"
                    className="avatar-uploader"
                    showUploadList={false}
                    accept="image/*"
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess("ok");
                      }, 0);
                    }}
                    beforeUpload={(file) => {
                      const isImage = file.type.startsWith('image/');
                      if (!isImage) {
                        message.error('Solo puedes subir archivos de imagen!');
                      }
                      const isLt2M = file.size / 1024 / 1024 < 2;
                      if (!isLt2M) {
                        message.error('La imagen debe ser menor a 2MB!');
                      }
                      return isImage && isLt2M ? true : Upload.LIST_IGNORE;
                    }}
                    onChange={handleLogoChange}
                    style={{
                      borderRadius: '50%',
                      border: '2px dashed #4CAF50',
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#1a1a1a', // si estás en modo oscuro
                      cursor: 'pointer'
                      
                    }}
                  >
                    {uploadingLogo ? (
                      <div style={{ color: '#fff', textAlign: 'center' }}>
                        <LoadingOutlined />
                        <div style={{ marginTop: 8 }}>Subiendo...</div>
                      </div>
                    ) : (
                      <div style={{ color: '#fff', textAlign: 'center' }}>
                        <UploadOutlined />
                        <div style={{ marginTop: 8 }}>Subir logo</div>
                      </div>
                    )}
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
                <Button 
                  type="primary" 
                  className={styles.changeBtn}
                  onClick={handleNameChange}
                  loading={updating}
                >
                  Cambiar Nombre
                </Button>
              </div>

            </div>
            {/* {updateSuccess && <p className={styles.successMsg}>Nombre actualizado correctamente.</p>}
            {updateError && <p className={styles.errorMsg}>Error al actualizar: {updateError.message}</p>} */}
          </div>
        </section>
      </main>
    </div>
  );
};


export default System;