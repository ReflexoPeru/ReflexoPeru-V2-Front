import React from 'react';
import estilo from './appointments.module.css';
import ModeloTable from '../../../components/Table/Tabla';
import CustomButton from '../../../components/Button/CustomButtom';
import CustomSearch from '../../../components/Search/CustomSearch';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';
import AppointmentsMock from '../../../mock/Appointments';
import { Space, Button } from 'antd';
import { useNavigate } from 'react-router';

export default function Appointments() {
  const navigate = useNavigate();
  const columns = [
    {
      title: 'Nro Ticket',
      dataIndex: 'nro_ticket',
      key: 'nro_ticket',
      width: '70px',
    },
    {
      title: 'Paciente',
      key: 'paciente',
      width: '140px',
      render: (text, record) => {
        return `${record.paciente_lastnamePaternal} ${record.paciente_lastnameMaternal} ${record.paciente_name}`;
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
      dataIndex: 'hour',
      key: 'hour',
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
      dataIndex: 'paymentDetail',
      key: 'paymentDetail',
      width: '75px',
    },
  ];

  const appointmentsData = AppointmentsMock[0].items;

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    console.log('Búsqueda:', value);
    // Aquí puedes implementar la lógica de filtrado
  };

  const handleTimeRangeChange = (dates, dateStrings) => {
    console.log('Rango de fechas seleccionado:', dateStrings);
    // Filtrar datos según el rango de fechas (si aplica)
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
          onTimeRangeChange={handleTimeRangeChange}
          width="250px"
          showTime={false} // Ocultar hora si no es necesaria
          format="DD/MM/YYYY" // Formato día/mes/año
        />
      </div>

      <ModeloTable columns={columns} data={appointmentsData} />
    </div>
  );
}
