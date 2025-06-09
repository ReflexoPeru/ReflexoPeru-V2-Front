import { Button } from 'antd';
// pages/EditAppointment.jsx
import { useState } from 'react';
import EditModal from '../../../../components/Modal/EditModal';
import NewAppointment from '../RegisterAppointment/NewAppointment';

const EditAppointment = ({ initialData }) => {
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
        Editar Cita
      </Button>
      <EditModal
        title="Editar Cita"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        loading={loading}
        width="90%"
      >
        <NewAppointment initialData={initialData} />
      </EditModal>
    </>
  );
};

export default EditAppointment;