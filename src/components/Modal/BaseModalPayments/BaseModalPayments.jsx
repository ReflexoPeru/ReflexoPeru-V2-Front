import React from 'react';
import {
  Modal,
  Form,
  Input,
  Switch,
  Button,
  Space,
} from 'antd';
import { useTheme } from '../../../context/ThemeContext';

const BaseModal = ({
  visible,
  onCancel,
  onOk,
  title,
  children,
  confirmLoading = false,
  okText = 'Guardar',
  cancelText = 'Cancelar',
  width = 520,
  initialValues,
  form,
}) => {
  const { isDarkMode } = useTheme();

  React.useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleOk = React.useCallback(async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  }, [form, onOk]);

  // Manejar eventos de teclado
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (!visible) return;

      if (event.key === 'Enter') {
        event.preventDefault();
        handleOk();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
      }
    };

    if (visible) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, onCancel, handleOk]);

  return (
    <Modal
      title={
        <span style={{ 
          color: isDarkMode ? '#ffffff' : '#333333',
          fontFamily: 'var(--font-family)',
          fontWeight: 600
        }}>
          {title}
        </span>
      }
      visible={visible}
      onCancel={onCancel}
      footer={
        <Space size={8}>
          <Button
            onClick={onCancel}
            disabled={confirmLoading}
            style={{
              padding: '6px 16px',
              height: 32,
              borderRadius: 6,
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: 'transparent',
            }}
            className="modal-cancel-btn modal-themed"
          >
            {cancelText}
          </Button>
          <Button
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
            style={{
              padding: '6px 16px',
              height: 32,
              borderRadius: 6,
              fontWeight: 500,
              backgroundColor: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
            }}
            className="modal-ok-btn modal-themed"
          >
            {okText}
          </Button>
        </Space>
      }
      width={width}
      centered
      destroyOnClose
      className="modal-themed"
      styles={{
        header: {
          borderBottom: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
          padding: '8px 12px',
          marginBottom: 8,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        },
        body: {
          padding: '0 12px 8px',
          backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        },
        footer: {
          borderTop: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
          padding: '8px 15px',
          marginTop: 8,
          backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        },
        content: {
          backgroundColor: isDarkMode ? '#2a2a2a' : '#ffffff',
        },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        size="small"
      >
        {children}
      </Form>
    </Modal>
  );
};

export default BaseModal;