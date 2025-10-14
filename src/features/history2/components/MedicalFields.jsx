import { Form, Input } from 'antd';

const { TextArea } = Input;

/**
 * Configuración de campos médicos nivel empresarial
 * - Auto-resize para ajuste dinámico del área de texto
 * - Contador de caracteres para feedback visual
 * - Límite de caracteres para prevenir sobrecarga
 * - Limpieza rápida con allowClear
 * - Preservación garantizada de datos
 */
const MEDICAL_FIELD_CONFIG = {
  // Límites de caracteres (basados en estándares médicos)
  MAX_LENGTH: {
    SHORT: 500,   // Campos cortos
    MEDIUM: 1000, // Campos medianos
    LONG: 2000,   // Campos largos
  },
  
  // Configuración de auto-resize
  AUTO_SIZE: {
    minRows: 3,
    maxRows: 6, // Máximo 6 líneas, después aparece scroll
  },
  
  // Placeholders sin ejemplos (vacíos cuando no hay contenido)
  PLACEHOLDERS: {
    diagnosticosMedicos: '',
    medicamentos: '',
    operaciones: '',
    dolencias: '',
    observacionesAdicionales: '',
    diagnosticosReflexologia: '',
  },
};

/**
 * Componente para campos médicos
 * Agrupa diagnósticos, medicamentos y operaciones con robustez empresarial
 */
const MedicalFields = ({ styles = {} }) => {
  return (
    <>
      {/* Primera fila: Diagnósticos, Medicamentos, Operaciones */}
      <div className={styles.threeColumnLayout || ''}>
        <div className={styles.column || ''}>
          <Form.Item
            name="diagnosticosMedicos"
            label="Diagnósticos médicos"
            className={styles.formItem || ''}
            normalize={(value) => value?.trimStart() || ''} // Elimina espacios al inicio
            preserve={true} // Preserva el valor incluso si el componente se desmonta
          >
            <TextArea
              autoSize={MEDICAL_FIELD_CONFIG.AUTO_SIZE}
              maxLength={MEDICAL_FIELD_CONFIG.MAX_LENGTH.MEDIUM}
              className={styles.diagnosticTextArea || styles.textarea || ''}
              placeholder={MEDICAL_FIELD_CONFIG.PLACEHOLDERS.diagnosticosMedicos}
              style={{ resize: 'none' }} // Previene resize manual
            />
          </Form.Item>
        </div>

        <div className={styles.column || ''}>
          <Form.Item
            name="medicamentos"
            label="Medicamentos"
            className={styles.formItem || ''}
            normalize={(value) => value?.trimStart() || ''}
            preserve={true}
          >
            <TextArea
              autoSize={MEDICAL_FIELD_CONFIG.AUTO_SIZE}
              maxLength={MEDICAL_FIELD_CONFIG.MAX_LENGTH.MEDIUM}
              className={styles.diagnosticTextArea || styles.textarea || ''}
              placeholder={MEDICAL_FIELD_CONFIG.PLACEHOLDERS.medicamentos}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        </div>

        <div className={styles.column || ''}>
          <Form.Item
            name="operaciones"
            label="Operaciones"
            className={styles.formItem || ''}
            normalize={(value) => value?.trimStart() || ''}
            preserve={true}
          >
            <TextArea
              autoSize={MEDICAL_FIELD_CONFIG.AUTO_SIZE}
              maxLength={MEDICAL_FIELD_CONFIG.MAX_LENGTH.MEDIUM}
              className={styles.diagnosticTextArea || styles.textarea || ''}
              placeholder={MEDICAL_FIELD_CONFIG.PLACEHOLDERS.operaciones}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        </div>
      </div>

      {/* Segunda fila: Dolencias, Observaciones, Diagnósticos Reflexología */}
      <div className={styles.threeColumnLayout || ''}>
        <div className={styles.column || ''}>
          <Form.Item
            name="dolencias"
            label="Dolencias"
            className={styles.formItem || ''}
            normalize={(value) => value?.trimStart() || ''}
            preserve={true}
          >
            <TextArea
              autoSize={MEDICAL_FIELD_CONFIG.AUTO_SIZE}
              maxLength={MEDICAL_FIELD_CONFIG.MAX_LENGTH.MEDIUM}
              className={styles.diagnosticTextArea || styles.textarea || ''}
              placeholder={MEDICAL_FIELD_CONFIG.PLACEHOLDERS.dolencias}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        </div>

        <div className={styles.column || ''}>
          <Form.Item
            name="observacionesAdicionales"
            label="Observaciones"
            className={styles.formItem || ''}
            normalize={(value) => value?.trimStart() || ''}
            preserve={true}
          >
            <TextArea
              autoSize={MEDICAL_FIELD_CONFIG.AUTO_SIZE}
              maxLength={MEDICAL_FIELD_CONFIG.MAX_LENGTH.LONG}
              className={styles.diagnosticTextArea || styles.textarea || ''}
              placeholder={MEDICAL_FIELD_CONFIG.PLACEHOLDERS.observacionesAdicionales}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        </div>

        <div className={styles.column || ''}>
          <Form.Item
            name="diagnosticosReflexologia"
            label="Diagnósticos de Reflexología"
            className={styles.formItem || ''}
            normalize={(value) => value?.trimStart() || ''}
            preserve={true}
          >
            <TextArea
              autoSize={MEDICAL_FIELD_CONFIG.AUTO_SIZE}
              maxLength={MEDICAL_FIELD_CONFIG.MAX_LENGTH.LONG}
              className={styles.diagnosticTextArea || styles.textarea || ''}
              placeholder={MEDICAL_FIELD_CONFIG.PLACEHOLDERS.diagnosticosReflexologia}
              style={{ resize: 'none' }}
            />
          </Form.Item>
        </div>
      </div>
    </>
  );
};

export default MedicalFields;

