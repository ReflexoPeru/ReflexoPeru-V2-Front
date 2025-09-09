import { Modal } from 'antd';
import { useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
// components/Modal/EditModal.jsx

const EditModal = ({
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
}) => {
  const { isDarkMode } = useTheme();
  
  // Manejar eventos de teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!open) return;

      if (event.key === 'Enter') {
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
          fontSize: '16px'
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
      okButtonProps={{ loading }}
      className="edit-modal-themed"
      styles={{
        header: {
          backgroundColor: 'var(--color-background-primary)',
          borderBottom: '1px solid var(--color-border-primary)',
          padding: '16px 24px',
        },
        body: {
          backgroundColor: 'var(--color-background-primary)',
          padding: '20px 24px',
          color: 'var(--color-text-primary)',
        },
        footer: {
          backgroundColor: 'var(--color-background-primary)',
          borderTop: '1px solid var(--color-border-primary)',
          padding: '16px 24px',
        },
        content: {
          backgroundColor: 'var(--color-background-primary)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-primary)',
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
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

export default EditModal;
