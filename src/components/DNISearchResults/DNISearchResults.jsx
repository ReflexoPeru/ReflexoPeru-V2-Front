import React from 'react';
import { Card, Typography, Button, Divider, Tag, Empty } from 'antd';
import { CheckCircleOutlined, UserOutlined, CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './DNISearchResults.module.css';

const { Title, Text } = Typography;

const DNISearchResults = ({ 
  visible, 
  patientData, 
  onConfirm, 
  onClose, 
  loading = false,
  noResults = false 
}) => {
  if (!visible) return null;

  const handleConfirm = () => {
    onConfirm && onConfirm(patientData);
  };

  return (
    <div className={styles.resultsPanel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerContent}>
          {noResults ? (
            <ExclamationCircleOutlined className={styles.headerIcon} />
          ) : (
            <UserOutlined className={styles.headerIcon} />
          )}
          <Title level={5} className={styles.headerTitle}>
            {noResults ? 'Sin Resultados' : 'Datos Encontrados'}
          </Title>
        </div>
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
          className={styles.closeButton}
        />
      </div>

      <div className={styles.panelContent}>
        {noResults ? (
          <div className={styles.noResultsSection}>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className={styles.noResultsContent}>
                  <Text className={styles.noResultsTitle}>
                    No se encontraron datos
                  </Text>
                  <Text className={styles.noResultsSubtext}>
                    El DNI ingresado no existe en la base de datos
                  </Text>
                </div>
              }
            />
          </div>
        ) : (
          <>
            <div className={styles.patientInfo}>
              <div className={styles.patientName}>
                <Text strong className={styles.nameText}>
                  {patientData.name} {patientData.paternal_lastname} {patientData.maternal_lastname}
                </Text>
              </div>
              
              <div className={styles.dniTag}>
                <Tag color="blue" className={styles.dniTagContent}>
                  DNI: {patientData.dni}
                </Tag>
              </div>
            </div>

            <Divider className={styles.divider} />

            <div className={styles.dataSection}>
              <div className={styles.dataItem}>
                <Text className={styles.dataLabel}>Nombres:</Text>
                <Text strong className={styles.dataValue}>{patientData.name}</Text>
              </div>
              
              <div className={styles.dataItem}>
                <Text className={styles.dataLabel}>Apellido Paterno:</Text>
                <Text strong className={styles.dataValue}>{patientData.paternal_lastname}</Text>
              </div>
              
              <div className={styles.dataItem}>
                <Text className={styles.dataLabel}>Apellido Materno:</Text>
                <Text strong className={styles.dataValue}>{patientData.maternal_lastname || 'No especificado'}</Text>
              </div>
            </div>

            <Divider className={styles.divider} />

            <div className={styles.confirmationSection}>
              <div className={styles.confirmationBox}>
                <CheckCircleOutlined className={styles.confirmationIcon} />
                <div className={styles.confirmationText}>
                  <Text strong className={styles.confirmationTitle}>
                    ¿Usar estos datos?
                  </Text>
                  <Text className={styles.confirmationSubtext}>
                    Se completarán automáticamente los campos del formulario
                  </Text>
                </div>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <Button
                type="default"
                onClick={onClose}
                className={styles.cancelButton}
              >
                Cancelar
              </Button>
              <Button
                type="primary"
                onClick={handleConfirm}
                loading={loading}
                icon={<CheckCircleOutlined />}
                className={styles.confirmButton}
              >
                Usar Datos
              </Button>
            </div>
          </>
        )}

        {noResults && (
          <div className={styles.actionButtons}>
            <Button
              type="primary"
              onClick={onClose}
              className={styles.confirmButton}
            >
              Entendido
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DNISearchResults;
