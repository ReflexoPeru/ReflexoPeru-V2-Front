import { Form, Input, Select } from 'antd';
import { physicalMetricsValidation } from '../utils/validators';
import { BINARY_OPTIONS } from '../constants';

const { Option } = Select;

/**
 * Componente para campos de peso, talla y datos reproductivos
 * Agrupa la lógica de medidas físicas
 */
const WeightFields = ({ styles = {}, isFemale = false }) => {
  return (
    <div className={styles.physicalInfoRow || ''}>
      <Form.Item
        name="talla"
        label="Talla (m)"
        className={styles.physicalInfoItem || ''}
        rules={physicalMetricsValidation.talla}
        tooltip="Ingrese la talla en metros (ej: 1.65)"
      >
        <Input
          className={`${styles.input || ''} ${styles.smallInput || ''}`}
          placeholder="Ingrese talla"
        />
      </Form.Item>

      <Form.Item
        name="pesoInicial"
        label="Peso Inicial (kg)"
        className={styles.physicalInfoItem || ''}
        rules={physicalMetricsValidation.peso}
        tooltip="Peso al iniciar tratamiento"
      >
        <Input
          className={`${styles.input || ''} ${styles.smallInput || ''}`}
          placeholder="Ingrese peso"
        />
      </Form.Item>

      <Form.Item
        name="ultimoPeso"
        label="Peso Anterior (kg)"
        className={styles.physicalInfoItem || ''}
        rules={physicalMetricsValidation.peso}
        tooltip="Peso de la sesión anterior"
      >
        <Input
          className={`${styles.input || ''} ${styles.smallInput || ''}`}
          placeholder="Ingrese peso"
        />
      </Form.Item>

      <Form.Item
        name="pesoHoy"
        label="Peso Hoy (kg)"
        className={styles.physicalInfoItem || ''}
        rules={physicalMetricsValidation.peso}
        tooltip="Peso actual en esta sesión"
      >
        <Input
          className={`${styles.input || ''} ${styles.smallInput || ''}`}
          placeholder="Ingrese peso"
        />
      </Form.Item>

      {/* Campos específicos para mujeres en la misma fila */}
      {isFemale && (
        <>
          <Form.Item
            name="menstruacion"
            label="Menstruación"
            className={styles.physicalInfoItem || ''}
          >
            <Select className={`${styles.select || ''} ${styles.smallInput || ''}`}>
              <Option value={BINARY_OPTIONS.YES}>{BINARY_OPTIONS.YES}</Option>
              <Option value={BINARY_OPTIONS.NO}>{BINARY_OPTIONS.NO}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="gestacion"
            label="Gestación"
            className={styles.physicalInfoItem || ''}
          >
            <Select className={`${styles.select || ''} ${styles.smallInput || ''}`}>
              <Option value={BINARY_OPTIONS.YES}>{BINARY_OPTIONS.YES}</Option>
              <Option value={BINARY_OPTIONS.NO}>{BINARY_OPTIONS.NO}</Option>
            </Select>
          </Form.Item>
        </>
      )}
    </div>
  );
};

export default WeightFields;

