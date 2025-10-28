import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './DeleteConfirmModal.module.css';

function DeleteConfirmModal({ 
  visible, 
  onConfirm, 
  onCancel, 
  entityType = "elemento", // "paciente", "cita", "terapeuta", "usuario"
  title = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  loading = false
}) {
  // Mensajes personalizados según el tipo de entidad
  const getEntityMessages = (type) => {
    const messages = {
      paciente: {
        title: "Eliminar paciente",
        description: "Se eliminarán todos los datos del paciente incluyendo su historial médico. Esta acción no se puede deshacer.",
        loading: "Eliminando paciente..."
      },
      cita: {
        title: "Eliminar cita",
        description: "Esta acción eliminará la cita de forma permanente. El historial médico del paciente no se verá afectado.",
        loading: "Eliminando cita..."
      },
      terapeuta: {
        title: "Eliminar terapeuta",
        description: "Se eliminará el registro del terapeuta. Las citas asociadas quedarán sin asignación.",
        loading: "Eliminando terapeuta..."
      },
      usuario: {
        title: "Eliminar usuario",
        description: "Se eliminará la cuenta de usuario y se revocarán todos los accesos. Esta acción no se puede deshacer.",
        loading: "Eliminando usuario..."
      },
      elemento: {
        title: "Confirmar eliminación",
        description: "¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.",
        loading: "Eliminando..."
      }
    };
    return messages[type] || messages.elemento;
  };

  const messages = getEntityMessages(entityType);
  const displayTitle = title || messages.title;
  const displayDescription = messages.description;
  const loadingText = messages.loading;

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={420}
      centered
      closable={false}
      className={styles.deleteModal}
      maskClosable={true}
    >
      <div className={styles.modalContent}>
        <div className={styles.iconWrapper}>
          <div className={styles.iconCircle}>
            <ExclamationCircleFilled className={styles.warningIcon} />
          </div>
        </div>
        
        <div className={styles.textSection}>
          <h3 className={styles.title}>{displayTitle}</h3>
          <p className={styles.message}>{displayDescription}</p>
        </div>

        <div className={styles.buttonGroup}>
          <button 
            className={styles.cancelBtn} 
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button 
            className={styles.confirmBtn} 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className={styles.spinner}></span>
                {loadingText}
              </>
            ) : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default DeleteConfirmModal;

