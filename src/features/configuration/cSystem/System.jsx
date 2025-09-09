import { useState, useEffect } from 'react';
import { Upload, Input, Button, Spin, Image, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import MiniLogo from '../../../assets/Img/Dashboard/MiniLogoReflexo.png';
import styles from './System.module.css';
import { useUpdateCompanyInfo, useUploadCompanyLogo } from './hook/systemHook';
import { useCompany } from '../../../context/CompanyContext';

const System = () => {
  const {
    companyInfo,
    logoUrl,
    loading,
    refetchCompanyInfo,
    refetchCompanyLogo,
  } = useCompany();
  const { updateCompany, updating } = useUpdateCompanyInfo();
  const { uploadLogo, uploadingLogo, uploadError, uploadSuccess } =
    useUploadCompanyLogo();
  const [companyName, setCompanyName] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);

  //Establecer nombre de la empresa desde el contexto
  useEffect(() => {
    if (companyInfo?.company_name) {
      setCompanyName(companyInfo.company_name);
    }
  }, [companyInfo]);

  //Sincronizar vista previa del logo con lo que viene del contexto
  useEffect(() => {
    if (logoUrl) {
      setLogoPreview(logoUrl);
    }
  }, [logoUrl]);
  const img = MiniLogo;

  //MOSTRAR MENSAJES DE EXITO/ERROR
  useEffect(() => {
    if (uploadSuccess) {
      message.success('Logo actualizado correctamente');
    }
    if (uploadError) {
      message.error(`Error al subir logo: ${uploadError.message}`);
    }
  }, [uploadSuccess, uploadError]);

  //ACTUALIZA DATOS DE LA EMPRESA
  const handleNameChange = async () => {
    if (!companyName.trim()) return;
    try {
      await updateCompany({ company_name: companyName });
      await refetchCompanyInfo();
      message.success('Nombre de empresa actualizado');
    } catch (err) {
      message.error('Error al actualizar el nombre');
    }
  };

  //CAMBIAR EL LOGO
  const handleLogoChange = async (info) => {
    if (info.file.status === 'done') {
      const file = info.file.originFileObj;
      if (!file) return;

      // Vista previa local inmediata
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);

      await uploadLogo(file);
      try {
        await refetchCompanyLogo();
      } catch (err) {
        console.error('Error al refrescar datos de empresa', err);
      }
    }
  };

  if (loading)
    return (
      <div className={`${styles.layout} ${styles.loading}`}>
        <Spin size="large" />
      </div>
    );

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
                    <div className={styles.logoImageContainer}>
                      <Image
                        src={logoPreview || img}
                        alt={`Logo de ${companyName}`}
                        preview={false}
                        className={styles.logoImage}
                      />
                    </div>
                  ) : (
                    <div className={styles.noLogo}>No hay logo disponible</div>
                  )}
                </div>
                <div className={styles.logoBlock}>
                  <span className={styles.logoTitle}>Subir nuevo</span>
                  <Upload
                    name="logo"
                    listType="picture"
                    className={styles.uploadContainer}
                    showUploadList={false}
                    accept="image/*"
                    customRequest={({ file, onSuccess }) => {
                      setTimeout(() => {
                        onSuccess('ok');
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
                  >
                    <div className={styles.uploadContent}>
                      {uploadingLogo ? (
                        <>
                          <LoadingOutlined className={styles.uploadIcon} />
                          <div className={styles.uploadLabel}>Subiendo...</div>
                        </>
                      ) : (
                        <>
                          <UploadOutlined className={styles.uploadIcon} />
                          <div className={styles.uploadLabel}>Subir logo</div>
                        </>
                      )}
                    </div>
                  </Upload>
                </div>
              </div>
            </div>

            {/* Nombre */}
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default System;
