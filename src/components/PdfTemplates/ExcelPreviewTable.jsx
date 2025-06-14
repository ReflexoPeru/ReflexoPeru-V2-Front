import React from 'react';
import { Table } from 'antd';

const pastelGreen = '#95e472';
const darkGreen = '#2d5a3d';

const columns = [
  {
    title: 'ID Paciente',
    dataIndex: 'patient_id',
    key: 'patient_id',
    width: 110,
    align: 'center',
    fixed: 'left',
  },
  {
    title: 'Documento',
    dataIndex: 'document_number',
    key: 'document_number',
    width: 120,
    align: 'center',
    render: (text) => text || '-',
  },
  {
    title: 'Nombre Completo',
    key: 'full_name',
    width: 260,
    render: (_, record) =>
      `${record.name} ${record.paternal_lastname} ${record.maternal_lastname}`,
  },
  {
    title: 'Teléfono',
    dataIndex: 'primary_phone',
    key: 'primary_phone',
    width: 130,
    align: 'center',
    render: (text) => text || '-',
  },
  {
    title: 'Fecha',
    dataIndex: 'appointment_date',
    key: 'appointment_date',
    width: 120,
    align: 'center',
  },
  {
    title: 'Hora',
    dataIndex: 'appointment_hour',
    key: 'appointment_hour',
    width: 100,
    align: 'center',
    render: (text) => text || '-',
  },
];

const ExcelPreviewTable = ({ data }) => {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 12px #e0e0e0',
        padding: 24,
        marginTop: 16,
      }}
    >
      <Table
        columns={columns}
        dataSource={data?.appointments || []}
        rowKey="patient_id"
        pagination={{ pageSize: 20 }}
        scroll={{ x: 900, y: 500 }}
        bordered
        size="middle"
        style={{ fontFamily: 'Helvetica', fontSize: 15 }}
        rowClassName={(_, idx) => (idx % 2 === 0 ? 'row-even' : 'row-odd')}
      />
      <style>{`
        .row-even td { background: #f8f8f8 !important; }
        .row-odd td { background: #fff !important; }
        .ant-table-thead > tr > th { background: ${pastelGreen} !important; color: #222 !important; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default ExcelPreviewTable;
