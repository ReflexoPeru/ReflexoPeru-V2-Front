import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';
import styles from './IncompleteDataModal.module.css';

function IncompleteDataModal({ 
  visible, 
  onCancel, 
  onGoToUpdate = null,
  entityType = "paciente",
  entityName = "",
  missingFields = [],
  loading = false
}) {
  // Mensajes personalizados según el tipo de entidad
  const getEntityMessages = (type) => {
    const messages = {
      paciente: {
        title: "Datos incompletos - Paciente",
        description: `El paciente ${entityName} tiene información incompleta en su registro.`,
        loading: "Actualizando datos..."
      },
      terapeuta: {
        title: "Datos incompletos - Terapeuta", 
        description: `El terapeuta ${entityName} tiene información incompleta en su registro.`,
        loading: "Actualizando datos..."
      }
    };
    return messages[type] || messages.paciente;
  };

  const getMissingFieldsText = () => {
    const fieldNames = {
      'document_type': 'Tipo de Documento',
      'document_number': 'Número de Documento',
      'birth_date': 'Fecha de Nacimiento',
      'paternal_lastname': 'Apellido Paterno',
      'maternal_lastname': 'Apellido Materno',
      'name': 'Nombres'
    };

    return missingFields.map(field => fieldNames[field] || field).join(', ');
  };

  const messages = getEntityMessages(entityType);
  const displayTitle = messages.title;
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
      className={styles.incompleteDataModal}
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
          
          {missingFields.length > 0 && (
            <div className={styles.missingFieldsBox}>
              <p className={styles.missingFieldsTitle}>Campos faltantes:</p>
              <p className={styles.missingFieldsText}>{getMissingFieldsText()}</p>
            </div>
          )}
          
          <p className={styles.recommendation}>
            Por favor, actualice la información faltante para continuar con el proceso de edición.
          </p>
        </div>

        <div className={styles.buttonGroup}>
            <button 
            className={styles.cancelBtn} 
            onClick={onCancel}
            disabled={loading}
          >
            Cerrar
          </button>
          
          {onGoToUpdate && (
            <button 
              className={styles.confirmBtn} 
              onClick={onGoToUpdate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  {loadingText}
                </>
              ) : 'Actualizar Registro'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default IncompleteDataModal;
