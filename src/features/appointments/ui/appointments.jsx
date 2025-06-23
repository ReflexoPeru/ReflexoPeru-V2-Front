import React, { useEffect, useState } from 'react';
import estilo from './appointments.module.css';
import ModeloTable from '../../../components/Table/Tabla';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';

import { useNavigate } from 'react-router';
import { useAppointments } from '../hook/appointmentsHook';
import { Space, Button } from 'antd';
import dayjs from 'dayjs';

export default function Appointments() {
  const navigate = useNavigate();
  const {
    appointments,
    loading,
    error,
    pagination,
    handlePageChange,
    setSearchTerm,
    loadPaginatedAppointmentsByDate,
  } = useAppointments();

  const [selectDate, setSelectDate] = useState(dayjs().format('YYYY-MM-DD'));
  useEffect(() => {
    loadPaginatedAppointmentsByDate(selectDate);
  }, [selectDate]);

  const columns = [
    {
      title: 'Nro Ticket',
      dataIndex: 'ticket_number',
      key: 'ticket_number',
      width: '70px',
    },
    {
      title: 'Paciente',
      key: 'patient_id',
      width: '155px',
      render: (_, record) => {
        const patient = record?.patient;
        if (!patient) return 'Paciente no disponible';
        return `${patient.paternal_lastname || ''} ${patient.maternal_lastname || ''} ${patient.name || ''}`.trim();
      },
    },

    {
      title: 'Sala',
      dataIndex: 'room',
      key: 'room',
      width: '60px',
    },
    {
      title: 'Hora',
      dataIndex: 'appointment_hour',
      key: 'appointment_hour',
      width: '70px',
    },
    {
      title: 'Pago',
      dataIndex: 'payment',
      key: 'payment',
      width: '70px',
    },
    {
      title: 'Metodo Pago',
      key: 'payment_type',
      width: '100px',
      render: (_, record) => record.payment_type?.name || 'Sin método',
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: '200px',
      render: (_, record) => (
        <Space size="small">
          <Button
            style={{
              backgroundColor: '#555555',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('edit', record)}
          >
            Editar
          </Button>
          <Button
            style={{
              backgroundColor: '#0066FF',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('imprimir', record)}
          >
            Imprimir
          </Button>
          <Button
            style={{
              backgroundColor: '#69276F',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('boleta', record)}
          >
            Boleta
          </Button>
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('history', record)}
          >
            Historia
          </Button>
          <Button
            style={{
              backgroundColor: '#FF3333',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('delete', record)}
          >
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  const handleAction = (action, record) => {
    // Implementa las acciones según el tipo
    console.log(`${action} action for:`, record);
    switch (action) {
      case 'edit':
        // Lógica para editar
        break;
      case 'imprimir':
        // Lógica para más info
        break;
      case 'boleta':
        // Lógica para historia
        break;
      case 'history':
        navigate(`/Inicio/pacientes/historia/${record.patient.id}`, {
          state: { appointment: record },
        });
        break;
      case 'delete':
        // Lógica para eliminar
        break;
      default:
        break;
    }
  };

  const handleButton = () => {
    // Aquí puedes implementar la lógica de registrar
    navigate('registrar');
  };

  const handleSearch = (value) => {
    // Aquí puedes implementar la lógica de filtrado
    setSearchTerm(value);
  };

  return (
    <div
      style={{
        height: '100%',
        paddingTop: '50px',
        maxWidth: 'calc(100% - 200px)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '0 auto',
        }}
      >
        <CustomButton text="Registrar Cita" onClick={handleButton} />

        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />

        <CustomTimeFilter
          onDateChange={setSelectDate}
          // onTimeRangeChange={handleTimeRangeChange}
          width="250px"
          showTime={false} // Ocultar hora si no es necesaria
          format="YYYY-MM-DD" // Formato día/mes/año
        />
      </div>

      <ModeloTable
        columns={columns}
        data={appointments}
        loading={loading}
        pagination={{
          current: pagination.currentPage,
          total: pagination.totalItems,
          pageSize: 50,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}
