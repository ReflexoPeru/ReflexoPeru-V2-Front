import { Button, Radio, Table } from 'antd';
import UniversalModal from '../../../components/Modal/UniversalModal';
import CustomSearch from '../../../components/Search/CustomSearch';
import { formatTherapistName } from '../api/therapistApi';
import { MODAL_WIDTHS } from '../constants';

/**
 * Modal para selección de terapeuta
 * Componente reutilizable y aislado
 */
const TherapistModal = ({
  visible,
  onCancel,
  onConfirm,
  therapists,
  loading,
  selectedTherapistId,
  onSelectTherapist,
  onSearch,
  pagination,
  onPageChange,
}) => {
  const columns = [
    {
      title: 'Seleccionar',
      dataIndex: 'id',
      align: 'center',
      render: (id) => (
        <Radio
          checked={selectedTherapistId === id}
          onChange={() => onSelectTherapist(id)}
        />
      ),
      width: 150,
    },
    {
      title: 'Apellido Paterno',
      dataIndex: 'paternal_lastname',
      key: 'paternal_lastname',
    },
    {
      title: 'Apellido Materno',
      dataIndex: 'maternal_lastname',
      key: 'maternal_lastname',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <UniversalModal
      title="Lista de Terapeutas"
      open={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      width={MODAL_WIDTHS.THERAPIST_LIST}
      className="therapist-list-modal modal-themed"
      destroyOnClose={true}
      centered={true}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={onConfirm}
          disabled={!selectedTherapistId}
        >
          Seleccionar
        </Button>,
      ]}
    >
      <CustomSearch
        placeholder="Buscar por Apellido/Nombre o DNI..."
        onSearch={onSearch}
        width="100%"
        style={{ marginBottom: 16 }}
      />
      <Table
        columns={columns}
        dataSource={therapists}
        rowKey="id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: pagination.pageSize,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} de ${total} terapeutas`,
          onChange: onPageChange,
          size: 'small',
          showLessItems: true,
          simple: false,
        }}
      />
    </UniversalModal>
  );
};

export default TherapistModal;

