import { Modal } from 'antd';
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
  destroyOnClose = true
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      width={width}
      okText={okText}
      cancelText={cancelText}
      destroyOnClose={destroyOnClose}
      okButtonProps={{ loading }}
    >
      {children}
    </Modal>
  );
};

export default EditModal;