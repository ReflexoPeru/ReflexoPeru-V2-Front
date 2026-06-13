import React, { useEffect, useState } from 'react';
import estilo from './appointmentsComplete.module.css';
import ModeloTable from '../../../components/Table/Tabla';
import CustomSearch from '../../../components/Search/CustomSearch';
import CustomTimeFilter from '../../../components/DateSearch/CustomTimeFilter';
import { useNavigate } from 'react-router';
import { useAppointmentsComplete } from '../hook/appointmentsCompleteHook';
import dayjs from '../../../utils/dayjsConfig';
import { Space, Button } from 'antd';
import { HistoryOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

export default function AppointmentsComplete() {
  const navigate = useNavigate();
  const {
    appointmentsComplete,
    loading,
    error,
    pagination,
    handlePageChange,
    searchTerm,
    setSearchTerm,
    loadPaginatedAppointmentsCompleteByDate,
  } = useAppointmentsComplete();

  const [selectDate, setSelectDate] = useState(dayjs());
  const [showAllSearched, setShowAllSearched] = useState(false);

  useEffect(() => {
    setShowAllSearched(false);
  }, [searchTerm]);

  useEffect(() => {
    loadPaginatedAppointmentsCompleteByDate(selectDate.format('YYYY-MM-DD'));
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
      width: '160px',
      render: (text, record) => {
        if (!record || !record.patient) return 'Sin paciente';
        const paternal = record.patient.paternal_lastname || '';
        const maternal = record.patient.maternal_lastname || '';
        const name = record.patient.name || '';
        return `${paternal} ${maternal} ${name}`.trim();
      },
    },
    {
      title: 'Terapeuta',
      key: 'therapist_id',
      width: '160px',
      render: (text, record) => {
        if (!record.therapist) return 'Sin asignar';
        return `${record.therapist.name} ${record.therapist.paternal_lastname} ${record.therapist.maternal_lastname}`;
      },
    },
    {
      title: 'Sala',
      dataIndex: 'room',
      key: 'room',
      width: '60px',
    },
    {
      title: 'Fecha cita',
      dataIndex: 'appointment_date',
      key: 'appointment_date',
      width: '70px',
      render: (date) => {
        if (!date) return '-';
        return dayjs(date).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Hora',
      dataIndex: 'appointment_hour',
      key: 'appointment_hour',
      width: '60px',
    },
    
    {
      title: 'Acciones',
      key: 'actions',
      width: '100px',
      render: (_, record) => (
        <Space size="small">
          <Button
            style={{
              backgroundColor: '#00AA55',
              color: '#fff',
              border: 'none',
            }}
            onClick={() => handleAction('history', record)}
          >
            Editar Historia
          </Button>
        </Space>
      ),
    },
  ];

  const handleAction = (action, record) => {
    switch (action) {
      case 'history':
        if (!record || !record.patient || !record.patient.id) return;
        navigate(`/Inicio/pacientes/historia/${record.patient.id}` , {
          state: { 
            appointment: record,
            from: '/Inicio/citasCompletas'
          },
        });
        break;
      default:
        break;
    }
  };

  const handleButton = () => {
    navigate('registrar');
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const todayStr = dayjs().format('YYYY-MM-DD');
  const isSearchMode = (searchTerm || '').trim().length > 0;
  let visibleAppointments = appointmentsComplete;
  let hasTodayAppointment = false;
  let todayAppointments = [];

  if (isSearchMode && appointmentsComplete.length > 0) {
    todayAppointments = appointmentsComplete.filter(
      (app) => app.appointment_date && app.appointment_date.substring(0, 10) === todayStr
    );
    hasTodayAppointment = todayAppointments.length > 0;
    if (!showAllSearched && hasTodayAppointment) {
      visibleAppointments = todayAppointments;
    }
  }

  return (
    <div
      style={{
        height: '100%',
        paddingTop: '2.5%',
        width: '100%',
        paddingLeft: '35px',
        paddingRight: '35px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <CustomSearch
          placeholder="Buscar por Apellido/Nombre o DNI..."
          onSearch={handleSearch}
          width="100%"
        />

        <CustomTimeFilter
          onDateChange={setSelectDate}
          value={selectDate}
          width="250px"
          showTime={false}
          format="DD-MM-YYYY"
        />
      </div>

      <div
        style={{
          width: '100%',
          margin: '0 auto',
          marginTop: '20px',
        }}
      >
        {isSearchMode && appointmentsComplete.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            {hasTodayAppointment ? (
              !showAllSearched ? (
                /* ── BANNER 1: Cita completada de hoy encontrada ── */
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: '#e0f3ff', padding: '12px 20px', borderRadius: '10px',
                  border: '1px solid #a8d8f0', borderLeft: '4px solid #3aabde',
                  boxShadow: '0 2px 8px rgba(58, 171, 222, 0.12)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <InfoCircleOutlined style={{ color: '#3aabde', fontSize: '18px', flexShrink: 0 }} />
                    <div>
                      <span style={{ color: '#111111', fontWeight: 700, fontSize: '15px', fontFamily: 'var(--font-family)', display: 'block' }}>
                        Cita completada de hoy encontrada
                      </span>
                      <span style={{ color: '#333333', fontWeight: 400, fontSize: '13px', fontFamily: 'var(--font-family)' }}>
                        Mostrando la cita completada programada para el día de hoy
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllSearched(true)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      backgroundColor: '#3aabde', border: 'none', borderRadius: '8px',
                      color: '#fff', fontSize: '12px', fontFamily: 'var(--font-family)',
                      fontWeight: 600, padding: '7px 16px', cursor: 'pointer',
                      whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(58, 171, 222, 0.4)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2490c4'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#3aabde'; }}
                  >
                    <HistoryOutlined />
                    Ver historial ({appointmentsComplete.length - visibleAppointments.length} más)
                  </button>
                </div>
              ) : (
                /* ── BANNER 2: Historial completo ── */
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  backgroundColor: '#e0f3ff', padding: '12px 20px', borderRadius: '10px',
                  border: '1px solid #a8d8f0', borderLeft: '4px solid #3aabde',
                  boxShadow: '0 2px 8px rgba(58, 171, 222, 0.12)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HistoryOutlined style={{ color: '#3aabde', fontSize: '18px', flexShrink: 0 }} />
                    <div>
                      <span style={{ color: '#111111', fontWeight: 700, fontSize: '15px', fontFamily: 'var(--font-family)', display: 'block' }}>
                        Historial completo
                      </span>
                      <span style={{ color: '#333333', fontWeight: 400, fontSize: '13px', fontFamily: 'var(--font-family)' }}>
                        Mostrando todas las citas completadas del paciente ({appointmentsComplete.length} en total)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllSearched(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      backgroundColor: 'transparent', border: '1.5px solid #3aabde',
                      borderRadius: '8px', color: '#3aabde', fontSize: '12px',
                      fontFamily: 'var(--font-family)', fontWeight: 600, padding: '6px 16px',
                      cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#3aabde'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#3aabde'; }}
                  >
                    <InfoCircleOutlined />
                    Ver solo cita de hoy
                  </button>
                </div>
              )
            ) : (
              /* ── BANNER 3: Sin cita completada para hoy ── */
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: '#fff8e0', padding: '12px 20px', borderRadius: '10px',
                border: '1px solid #f0d98a', borderLeft: '4px solid #e6b800',
                boxShadow: '0 2px 8px rgba(230, 184, 0, 0.12)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ClockCircleOutlined style={{ color: '#e6b800', fontSize: '18px', flexShrink: 0 }} />
                  <div>
                    <span style={{ color: '#111111', fontWeight: 700, fontSize: '15px', fontFamily: 'var(--font-family)', display: 'block' }}>
                      Sin cita completada para hoy
                    </span>
                    <span style={{ color: '#333333', fontWeight: 400, fontSize: '13px', fontFamily: 'var(--font-family)' }}>
                      Mostrando el historial completo del paciente
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <ModeloTable
          columns={columns}
          data={visibleAppointments}
          loading={loading}
          pagination={{
            current: pagination.currentPage,
            total: pagination.totalItems,
            pageSize: pagination.pageSize,
            onChange: handlePageChange,
            showSizeChanger: false,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} de ${total} citas`,
          }}
        />
      </div>
    </div>
  );
}
