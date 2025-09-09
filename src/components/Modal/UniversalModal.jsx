import React from 'react';
import { Modal } from 'antd';
import { useTheme } from '../../context/ThemeContext';
import styles from './UniversalModal.module.css';

/**
 * Modal universal que se adapta automáticamente al tema global
 * Reemplaza todos los modales personalizados para garantizar consistencia
 */
const UniversalModal = ({
  title,
  open,
  onCancel,
  onOk,
  children,
  width = '80%',
  okText = 'Guardar',
  cancelText = 'Cancelar',
  loading = false,
  destroyOnClose = true,
  centered = true,
  footer = undefined, // Si es null, no muestra footer
  className = '',
  ...otherProps
}) => {
  const { isDarkMode } = useTheme();

  // Manejar eventos de teclado
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (!open) return;

      if (event.key === 'Enter' && onOk) {
        event.preventDefault();
        onOk();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOk, onCancel]);

  return (
    <Modal
      title={
        <span style={{ 
          color: 'var(--color-text-primary)',
          fontFamily: 'var(--font-family)',
          fontWeight: 600,
          fontSize: '18px'
        }}>
          {title}
        </span>
      }
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={width}
      okText={okText}
      cancelText={cancelText}
      destroyOnClose={destroyOnClose}
      centered={centered}
      footer={footer}
      className={`${styles.universalModal} universal-modal ${className}`}
      okButtonProps={{ loading }}
      styles={{
        header: {
          backgroundColor: 'var(--color-background-primary) !important',
          borderBottom: '1px solid var(--color-border-primary) !important',
          padding: '16px 24px !important',
        },
        body: {
          backgroundColor: 'var(--color-background-primary) !important',
          padding: '20px 24px !important',
          color: 'var(--color-text-primary) !important',
        },
        footer: {
          backgroundColor: 'var(--color-background-primary) !important',
          borderTop: '1px solid var(--color-border-primary) !important',
          padding: '16px 24px !important',
        },
        content: {
          backgroundColor: 'var(--color-background-primary) !important',
          borderRadius: 'var(--radius-lg) !important',
          border: '1px solid var(--color-border-primary) !important',
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
      {...otherProps}
    >
      <div style={{
        backgroundColor: 'var(--color-background-primary)',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-family)',
      }}>
        {children}
      </div>
    </Modal>
  );
};

export default UniversalModal;
