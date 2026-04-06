import { Form, Input, Select } from 'antd';
import { physicalMetricsValidation } from '../utils/validators';
import { BINARY_OPTIONS } from '../constants';

const { Option } = Select;

/**
 * Componente para campos de peso, talla y datos reproductivos
 * Agrupa la lógica de medidas físicas
 */
const WeightFields = ({ styles = {}, isFemale = false, weightData = {} }) => {
  const { pesoInicial, pesoAnterior, isFirstAppointment, isSecondAppointment } = weightData || {};

  return (
    <div className={styles.physicalInfoRow || ''} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
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

      {/* Peso Inicial: Visible de la SEGUNDA cita en adelante */}
      {!isFirstAppointment && (
        <Form.Item
          label="Peso Inicial (kg)"
          className={styles.physicalInfoItem || ''}
          tooltip="Peso registrado en la primera sesión del tratamiento (Lectura)"
        >
          <Input
            disabled
            value={pesoInicial || 'N/A'}
            className={`${styles.input || ''} ${styles.smallInput || ''}`}
            style={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 'bold' }}
          />
        </Form.Item>
      )}

      {/* Peso Anterior: Visible de la TERCERA cita en adelante */}
      {!isFirstAppointment && !isSecondAppointment && (
        <Form.Item
          label="Peso Anterior (kg)"
          className={styles.physicalInfoItem || ''}
          tooltip="Peso de la sesión cronológicamente anterior a la seleccionada"
        >
          <Input
            disabled
            value={pesoAnterior || 'N/A'}
            className={`${styles.input || ''} ${styles.smallInput || ''}`}
            style={{ backgroundColor: '#f8fafc', color: '#64748b' }}
          />
        </Form.Item>
      )}

      {/* Peso Hoy: Campo de entrada principal para CUALQUIER cita seleccionada */}
      <Form.Item
        name="pesoHoy"
        label="Peso Actual (kg)"
        className={styles.physicalInfoItem || ''}
        rules={physicalMetricsValidation.peso}
        tooltip="Ingrese el peso medido en esta sesión"
      >
        <Input
          className={`${styles.input || ''} ${styles.smallInput || ''}`}
          placeholder="0.0"
          style={{ borderColor: '#1CB54A', borderWidth: '1.5px' }}
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

