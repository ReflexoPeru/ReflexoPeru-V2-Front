import React from 'react';
import { Button, Spin, Alert } from 'antd';
import { ArrowLeft } from '@phosphor-icons/react';
import styles from './reports.module.css';

const ReportPreview = ({
  showPreview,
  loading,
  generating,
  error,
  content,
  downloadBtn,
  handleCancel,
}) => (
  <div className={styles.previewContainer}>
    <div className={styles.topActions}>
      <div style={{ pointerEvents: 'auto' }}>
        <Button
          type="text"
          icon={<ArrowLeft size={28} weight="bold" />}
          onClick={handleCancel}
          className={styles.actionBtn}
        />
      </div>
      <div style={{ pointerEvents: 'auto' }}>{downloadBtn}</div>
    </div>
    {(loading || generating) && (
      <div className={styles.spinner}>
        <Spin
          size="large"
          tip="Generando reporte..."
          style={{ color: '#7ed957' }}
        />
      </div>
    )}
    {error && (
      <Alert
        message="Error al generar el reporte"
        description={error.message || 'Intenta nuevamente.'}
        type="error"
        showIcon
        className={styles.alert}
      />
    )}
    <div className={styles.previewContent}>
      {!loading && !generating && !error && content}
    </div>
  </div>
);

export default ReportPreview;
