import React from 'react';
import { CheckCircle, ArrowLeft } from '@phosphor-icons/react';
import styles from './SuccessModal.module.css';

function SuccessModal({ onBackToLogin }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.iconContainer}>
          <CheckCircle className={styles.successIcon} weight="fill" />
        </div>
        <h2 className={styles.title}>Contraseña restablecida exitosamente</h2>
        <p className={styles.message}>
          Tu contraseña ha sido cambiada correctamente. Por razones de seguridad, 
          deberás iniciar sesión nuevamente con tu nueva contraseña.
        </p>
        <button 
          onClick={onBackToLogin}
          className={styles.backButton}
        >
          <ArrowLeft size={20} weight="bold" />
          <span>Volver al inicio de sesión</span>
        </button>
      </div>
    </div>
  );
}

export default SuccessModal;


