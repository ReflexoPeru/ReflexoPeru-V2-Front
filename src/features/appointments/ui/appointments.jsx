import React, { useEffect, useState } from 'react';
import estilo from './appointments.module.css';
import ModeloTable from '../../../components/Table/Tabla';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';
import AppointmentsMock from '../../../mock/Appointments';
import { useNavigate } from 'react-router';
import { useAppointments } from '../hook/appointmentsHook'; 
import dayjs from 'dayjs';

export default function Appointments() {
  const navigate = useNavigate();
  const { appointments, loading, error, pagination, handlePageChange, setSearchTerm, loadPaginatedAppointmentsByDate } = useAppointments();

  // Debug (verifica en consola)
  console.log("Datos de citas:", {
    appointments,
    loading,
    error,
    pagination
  });

  const [selectDate, setSelectDate] = useState(dayjs().format('DD/MM/YYYY'));
  useEffect(() => {
    loadPaginatedAppointmentsByDate(selectDate);
  } , [selectDate]);



  const columns = [
    {
      title: 'Nro Ticket',
      dataIndex: 'ticket_number',
      key: 'ticket_number',
      width: '70px',
    },
    {
      title: 'Paciente',
      dataIndex: 'patient_id',
      key: 'patient_id',
      width: '140px',
      // render: (text, record) => {
      //   return `${record.paciente_lastnamePaternal} ${record.paciente_lastnameMaternal} ${record.paciente_name}`;
      // },
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
      width: '60px',
    },
    {
      title: 'Pago',
      dataIndex: 'payment',
      key: 'payment',
      width: '60px',
    },
    {
      title: 'Metodo Pago',
      dataIndex: 'payment_type_id',
      key: 'payment_type_id',
      width: '75px',
    },
  ];

  // const appointmentsData = AppointmentsMock[0].items;

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    // Aquí puedes implementar la lógica de filtrado
    setSearchTerm(value);
  };

  // const handleTimeRangeChange = (dates, dateStrings) => {
  //   // Filtrar datos según el rango de fechas (si aplica)
  //   const selectedDate = dayjs(dateStrings[0], 'DD/MM/YYYY').format('YYYY-MM-DD');
  //   console.log('📅 Fecha seleccionada (formateada):', selectedDate);
  //   loadPaginatedAppointmentsByDate(selectedDate);
  // };

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
          pageSize: 100,
          onChange: handlePageChange,
        }}
      />
    </div>
  );
}
