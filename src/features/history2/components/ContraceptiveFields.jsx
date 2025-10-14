import { Form, Radio } from 'antd';
import SelectContraceptiveMethod from '../../../components/Select/SelectContraceptiveMethod';
import SelectDiuType from '../../../components/Select/SelectDiuType';
import { CONTRACEPTIVE_METHOD_IDS } from '../constants';

/**
 * Componente para campos de métodos anticonceptivos
 * Solo visible para pacientes mujeres
 * Pregunta + Método + Tipo DIU en la misma fila
 */
const ContraceptiveFields = ({
  isFemale,
  useContraceptiveMethod,
  contraceptiveMethodId,
  diuTypeId,
  onContraceptiveMethodChange,
  onContraceptiveChange,
  onDiuTypeChange,
  form,
  styles = {},
}) => {
  if (!isFemale) {
    return null;
  }

  return (
    <div className={styles.contraceptiveRow || styles.physicalInfoRow || ''}>
      {/* ¿Usa método anticonceptivo? */}
      <Form.Item
        name="use_contraceptive_method"
        label="¿Usa método anticonceptivo?"
        className={styles.contraceptiveQuestion || styles.physicalInfoItem || ''}
      >
        <Radio.Group
          value={useContraceptiveMethod}
          onChange={(e) => {
            const val = e.target.value;
            onContraceptiveMethodChange(val);

            // Si selecciona "No", limpia los métodos
            if (!val) {
              form.setFieldsValue({
                contraceptive_method_id: null,
                diu_type_id: null,
              });
            }
          }}
        >
          <Radio value={true}>Sí</Radio>
          <Radio value={false}>No</Radio>
        </Radio.Group>
      </Form.Item>

      {/* Selector de método anticonceptivo */}
      {useContraceptiveMethod === true && (
        <Form.Item
          name="contraceptive_method_id"
          label="Método"
          className={`${styles.physicalInfoItem || ''} ${styles.methodItem || ''}`}
        >
          <SelectContraceptiveMethod
            className={styles.select || ''}
            value={contraceptiveMethodId}
            onChange={(value) => {
              const numericValue =
                value === undefined || value === null ? null : Number(value);
              onContraceptiveChange(numericValue);

              // Si cambia a un método que NO es DIU, limpia el tipo de DIU
              if (numericValue !== CONTRACEPTIVE_METHOD_IDS.DIU) {
                form.setFieldsValue({ diu_type_id: null });
              }
            }}
          />
        </Form.Item>
      )}

      {/* Selector de tipo de DIU */}
      {useContraceptiveMethod === true &&
        Number(contraceptiveMethodId) === CONTRACEPTIVE_METHOD_IDS.DIU && (
          <Form.Item
            name="diu_type_id"
            label="Tipo DIU"
            className={`${styles.physicalInfoItem || ''} ${styles.diuItem || ''}`}
          >
            <SelectDiuType
              className={styles.select || ''}
              value={diuTypeId}
              onChange={(value) => {
                const numericValue =
                  value === undefined || value === null ? null : Number(value);
                onDiuTypeChange(numericValue);
              }}
            />
          </Form.Item>
        )}
    </div>
  );
};

export default ContraceptiveFields;

