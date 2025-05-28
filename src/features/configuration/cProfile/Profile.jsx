import React, { useState } from 'react';
import { Upload, Select, Button, Input } from 'antd';
import styles from './Profile.module.css';

const Profile = () => {
  const [avatar, setAvatar] = useState('/src/assets/Img/MiniLogoReflexo.webp');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [genero, setGenero] = useState('');
  const [contrasena, setContrasena] = useState('');

  const handleAvatarChange = (info) => {
    const file = info.file.originFileObj;
    if (
      file &&
      (info.file.status === 'done' || info.file.status === 'uploading')
    ) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.layout}>
        <main className={styles.mainContent}>
          <div className={styles.container}>
            <div className={styles.card}>
              <h2 className={styles.title}>PERFIL</h2>

              {/* Avatar section */}
              <div className={styles.formRow}>
                <label className={styles.label}>Avatar :</label>
                <div className={styles.avatarContainer}>
                  <div className={styles.avatarBlock}>
                    <span className={styles.avatarTitle}>Actual</span>
                    <img
                      src={avatar}
                      alt="Avatar actual"
                      className={styles.avatarImage}
                    />
                  </div>
                  <div className={styles.avatarBlock}>
                    <span className={styles.avatarTitle}>Subir</span>
                    <Upload
                      showUploadList={false}
                      beforeUpload={() => false}
                      onChange={handleAvatarChange}
                    >
                      <button type="button" className={styles.uploadButton}>
                        <span className={styles.uploadText}>Upload</span>
                      </button>
                    </Upload>
                  </div>
                </div>
              </div>

              {/* Divider line */}
              <div className={styles.divider}></div>

              {/* Form fields */}
              <div className={styles.formField}>
                <label className={styles.label}>Nombre :</label>
                <Input
                  className={styles.input}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Correo :</label>
                <Input
                  className={styles.input}
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Genero :</label>
                <Select
                  className={styles.select}
                  value={genero}
                  onChange={(value) => setGenero(value)}
                  options={[
                    { value: 'masculino', label: 'Masculino' },
                    { value: 'femenino', label: 'Femenino' },
                    { value: 'otro', label: 'Otro' },
                  ]}
                />
              </div>

              <div className={styles.formField}>
                <label className={styles.label}>Contraseña:</label>
                <div className={styles.passwordContainer}>
                  <Input.Password
                    className={styles.passwordInput}
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                  />
                  <Button className={styles.cambiarBtn}>Cambiar</Button>
                </div>
              </div>

              {/* Save button */}
              <div className={styles.saveButtonContainer}>
                <Button type="primary" className={styles.saveButton}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
