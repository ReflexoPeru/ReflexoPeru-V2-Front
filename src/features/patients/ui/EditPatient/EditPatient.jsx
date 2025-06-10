import { Button } from 'antd';
// pages/EditPatient.jsx
import { useState } from 'react';
import EditModal from '../../../../components/Modal/EditModal';
import NewPatient from '../RegisterPatient/NewPatient';

const EditPatient = ({ initialData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    // Aquí iría la lógica para guardar los cambios
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
        Editar Paciente
      </Button>
      <EditModal
        title="Editar Paciente"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        loading={loading}
      >
        <NewPatient initialData={initialData} />
      </EditModal>
    </>
  );
};

export default EditPatient;