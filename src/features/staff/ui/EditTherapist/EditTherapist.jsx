import { Button } from 'antd';
// pages/EditTherapist.jsx
import { useState } from 'react';
import EditModal from '../../../../components/Modal/EditModal';
import NewTherapist from '../RegisterTherapist/NewTherapist';

const EditTherapist = ({ initialData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    // Lógica para guardar los cambios
    setTimeout(() => {
      setLoading(false);
      setIsModalOpen(false);
    }, 1000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Editar Terapeuta
      </Button>
      <EditModal
        title="Editar Terapeuta"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        loading={loading}
      >
        <NewTherapist initialData={initialData} />
      </EditModal>
    </>
  );
};

export default EditTherapist;