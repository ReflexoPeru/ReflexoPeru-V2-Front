import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarOverrides.css';
import styles from './Calendar.module.css';
import { Modal, Spin, Flex } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { CaretLeft, CaretRight, Plus, List } from '@phosphor-icons/react';
import dayjs from '../../../utils/dayjsConfig';
import { useCalendar } from '../hook/calendarHook';
import MiniCalendar from './MiniCalendar';
import CalendarList from './CalendarList';
import NewAppointment from '../../appointments/ui/RegisterAppointment/NewAppointment';
import EmptyState from '../../../components/Empty/EmptyState';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { es }
});

// AgendaView component moved from separate file
const AgendaView = ({ events, date, localizer, onNavigate, onView, view, sidebarVisible, setSidebarVisible, onSelectEvent, setNewAppointmentModalVisible }) => {
  // Filtrar eventos para el rango de fechas visible
  const startOfWeek = dayjs(date).startOf('week');
  const endOfWeek = dayjs(date).endOf('week');
  
  const filteredEvents = events.filter(event => {
    const eventDate = dayjs(event.start);
    return eventDate.isAfter(startOfWeek.subtract(1, 'day')) && 
           eventDate.isBefore(endOfWeek.add(1, 'day'));
  });

  // Agrupar eventos por fecha
  const eventsByDate = filteredEvents.reduce((acc, event) => {
    const dateKey = dayjs(event.start).format('YYYY-MM-DD');
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event);
    return acc;
  }, {});

  const getEventType = (event) => {
    const status = event.resource || event.details?.appointment_status_id;
    if (status === 'PENDIENTE') return 'pending';
    if (status === 'COMPLETADO') return 'completed';
    return 'pending';
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completado',
      cancelled: 'Cancelada'
    };
    return labels[type] || 'Pendiente';
  };

  // CustomToolbar component para AgendaView
  const CustomToolbar = () => {
    const viewLabels = {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda'
    };

    const handleViewChange = (newView) => {
      onView(newView);
    };

    // Generar el label de fecha para la agenda
    const startOfWeek = dayjs(date).startOf('week');
    const endOfWeek = dayjs(date).endOf('week');
    const label = `${startOfWeek.format('DD')} - ${endOfWeek.format('DD')} de ${startOfWeek.format('MMMM YYYY')}`;

    // Estilos para los botones de navegación
    const navigationButtonStyle = {
      background: 'var(--color-background-quaternary)',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '6px',
      color: 'var(--color-text-primary)',
      transition: 'all 0.3s ease',
      minWidth: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const todayButtonStyle = {
      ...navigationButtonStyle,
      padding: '8px 16px',
      fontWeight: '500',
      minWidth: '60px'
    };

    // Función para manejar el hover
    const handleMouseEnter = (e) => {
      e.target.style.background = 'var(--color-primary)';
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
    };

    const handleMouseLeave = (e) => {
      e.target.style.background = 'var(--color-background-quaternary)';
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = 'none';
    };

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '16px 20px',
        background: 'var(--color-background-tertiary)',
        borderRadius: '12px',
        border: '1px solid var(--color-border-primary)'
      }}>
        {/* Navegación izquierda */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'var(--color-background-quaternary)',
            borderRadius: '8px',
            padding: '4px',
            gap: '2px'
          }}>
          <button
            onClick={() => onNavigate('PREV')}
            style={{
              ...navigationButtonStyle,
              background: 'transparent',
              borderRadius: '4px'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <CaretLeft size={16} />
          </button>
          
          <button
            onClick={() => onNavigate('TODAY')}
            style={{
              ...todayButtonStyle,
              background: 'transparent',
              borderRadius: '4px'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Hoy
          </button>
          
          <button
            onClick={() => onNavigate('NEXT')}
            style={{
              ...navigationButtonStyle,
              background: 'transparent',
              borderRadius: '4px'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <CaretRight size={16} />
          </button>
          </div>
        </div>

        {/* Título del calendario centrado */}
        <div style={{
          fontSize: '22px',
          fontWeight: '600',
          color: 'var(--color-primary)',
          textAlign: 'center',
          flex: 1
        }}>
          {label}
        </div>

        {/* Controles derechos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Botones de vista */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'var(--color-background-quaternary)',
            borderRadius: '8px',
            padding: '4px',
            gap: '2px',
            height: '44px'
          }}>
            {Object.entries(viewLabels).map(([viewKey, label]) => (
              <button
                key={viewKey}
                onClick={() => onView(viewKey)}
                style={{
                  background: view === viewKey ? 'var(--color-primary)' : 'transparent',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  padding: '0 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: view === viewKey ? '600' : '400',
                  transition: 'all 0.3s ease',
                  minWidth: '60px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (view !== viewKey) {
                    e.target.style.background = 'var(--color-primary)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (view !== viewKey) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Botón New separado */}
          <button
            onClick={() => {
              setNewAppointmentModalVisible(true);
            }}
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-text-primary)',
              border: 'none',
              padding: '0 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              minWidth: '60px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#45a049';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-primary)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Plus size={16} style={{ marginRight: '6px' }} />
            New
          </button>

          {/* Botón de hamburguesa para ocultar/mostrar sidebar */}
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            style={{
              background: 'var(--color-background-quaternary)',
              color: 'var(--color-text-primary)',
              border: '1px solid #555',
              padding: '10px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              height: '44px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-primary)';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-background-quaternary)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.agendaViewContainer}>
      <CustomToolbar />
      
      <div className={styles.agendaContent}>
        {Object.keys(eventsByDate).length === 0 ? (
          <EmptyState
            icon="package"
            title="No hay eventos programados"
            description="No se encontraron eventos para este período. Los eventos aparecerán aquí cuando estén disponibles."
            style={{
              background: 'transparent',
              border: 'none',
              margin: '0',
              padding: '40px 20px',
              minHeight: '400px',
              boxShadow: 'none'
            }}
          />
        ) : (
          <div className={styles.agendaCardsGrid}>
            {Object.entries(eventsByDate)
              .sort(([dateA], [dateB]) => dayjs(dateA).diff(dayjs(dateB)))
              .flatMap(([date, dayEvents]) =>
                dayEvents
                  .sort((a, b) => dayjs(a.start).diff(dayjs(b.start)))
                  .map((event, index) => {
                    const eventType = getEventType(event);
                    return (
                      <div 
                        key={`${event.id}-${index}`} 
                        className={`${styles.agendaEventCard} ${styles[eventType]}`}
                        onClick={() => onSelectEvent(event)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.eventCardHeader}>
                          <div className={styles.eventTime}>
                            <span className={styles.startTime}>
                              {dayjs(event.start).format('HH:mm')}
                            </span>
                            <span className={styles.timeSeparator}>-</span>
                            <span className={styles.endTime}>
                              {dayjs(event.end).format('HH:mm')}
                            </span>
                          </div>
                          <div className={`${styles.eventStatus} ${styles[eventType]}`}>
                            {getEventTypeLabel(eventType)}
                          </div>
                        </div>
                        
                        <div className={styles.eventCardBody}>
                          <h4 className={styles.eventTitle}>{event.title}</h4>
                          
                          <div className={styles.eventDetails}>
                            <div className={styles.detailRow}>
                              <span className={styles.detailLabel}>Paciente:</span>
                              <span className={styles.detailValue}>
                                {event.details?.patient_full_name || 'No especificado'}
                              </span>
                            </div>
                            
                            <div className={styles.detailRow}>
                              <span className={styles.detailLabel}>Terapeuta:</span>
                              <span className={styles.detailValue}>
                                {event.details?.therapist_full_name || 'No especificado'}
                              </span>
                            </div>
                          </div>
                          
                          {(event.details?.diagnosis || event.details?.payment_type_name || event.details?.ticket_number) && (
                            <div className={styles.eventSecondaryDetails}>
                              {event.details?.diagnosis && (
                                <div className={styles.detailRow}>
                                  <span className={styles.detailLabel}>Diagnóstico:</span>
                                  <span className={styles.detailValue}>{event.details.diagnosis}</span>
                                </div>
                              )}
                              
                              {event.details?.payment_type_name && (
                                <div className={styles.detailRow}>
                                  <span className={styles.detailLabel}>Pago:</span>
                                  <span className={styles.detailValue}>{event.details.payment_type_name}</span>
                                </div>
                              )}
                              
                              {event.details?.ticket_number && (
                                <div className={styles.detailRow}>
                                  <span className={styles.detailLabel}>Ticket:</span>
                                  <span className={styles.detailValue}>#{event.details.ticket_number}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className={styles.eventCardFooter}>
                          {event.details?.observation && (
                            <div className={styles.eventObservation}>
                              <span className={styles.observationLabel}>Observaciones:</span>
                              <p className={styles.observationText}>{event.details.observation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
              )}
          </div>
        )}
      </div>
    </div>
  );
};

const Calendario = () => {
  const [date, setDate] = React.useState(new Date());
  const [view, setView] = React.useState('month');
  const { events, loading, error } = useCalendar(date, view);
  
  
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [sidebarVisible, setSidebarVisible] = React.useState(true);
  const [newAppointmentModalVisible, setNewAppointmentModalVisible] = React.useState(false);
  const [selectedCalendarFilter, setSelectedCalendarFilter] = React.useState('all');

  const filteredEvents = React.useMemo(() => {
    if (selectedCalendarFilter === 'all') {
      return events;
    }
    
    return events.filter(event => {
      const status = event.resource || event.details?.appointment_status_id;
      return status === selectedCalendarFilter;
    });
  }, [events, selectedCalendarFilter]);
  

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleNavigate = (action, newDate) => {
    if (typeof action === 'string') {
      // Manejar acciones de navegación (PREV, NEXT, TODAY)
      let targetDate = new Date(date);
      
      switch (action) {
        case 'PREV':
          if (view === 'agenda') {
            targetDate.setDate(targetDate.getDate() - 7); // Semana anterior
          } else if (view === 'month') {
            targetDate.setMonth(targetDate.getMonth() - 1);
          } else if (view === 'week') {
            targetDate.setDate(targetDate.getDate() - 7);
          } else if (view === 'day') {
            targetDate.setDate(targetDate.getDate() - 1);
          }
          break;
        case 'NEXT':
          if (view === 'agenda') {
            targetDate.setDate(targetDate.getDate() + 7); // Semana siguiente
          } else if (view === 'month') {
            targetDate.setMonth(targetDate.getMonth() + 1);
          } else if (view === 'week') {
            targetDate.setDate(targetDate.getDate() + 7);
          } else if (view === 'day') {
            targetDate.setDate(targetDate.getDate() + 1);
          }
          break;
        case 'TODAY':
          targetDate = new Date();
          break;
        default:
          return;
      }
      setDate(targetDate);
    } else {
      // Manejar fecha directa (desde react-big-calendar)
      setDate(action || newDate);
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const getEventColor = (statusId) => {
    switch (statusId) {
      case 1:
        return '#FFA500';
      case 2:
        return 'var(--color-primary)';
      default:
        return '#888';
    }
  };

  const eventPropGetter = (event) => {
    const style = {};
    const className = [];
    const status = event.resource || event.details?.appointment_status_id;
    
    if (event.color) {
      style.backgroundColor = event.color;
      style.borderColor = event.color;
    } else {
      if (status === 'PENDIENTE') {
        style.backgroundColor = '#f59e0b';
        style.borderLeftColor = '#d97706';
        style.color = '#fff';
      } else if (status === 'COMPLETADO') {
        style.backgroundColor = '#1DB44A';
        style.borderLeftColor = '#17a041';
        style.color = '#fff';
      } else {
        style.backgroundColor = '#6b7280';
        style.borderLeftColor = 'rgba(0, 0, 0, 0.4)';
        style.color = '#fff';
      }
    }
    
    return { 
      style,
      className: className.join(' '),
      'data-status': status
    };
  };

  const EventContent = ({ event }) => {
    // Usar el título personalizado si está disponible, sino usar el sistema anterior
    if (event.title) {
      return (
        <span
          style={{
            fontWeight: 'bold',
            fontSize: '0.95em',
            color: 'var(--color-text-primary)'
          }}
        >
          {event.title}
        </span>
      );
    }
    
    // Fallback al sistema anterior
    const status = event.details.appointment_status_id;
    let prefix = '';
    if (status === 1) prefix = '[PENDIENTE]';
    if (status === 2) prefix = '[CONFIRMADA]';
    return (
      <span
        style={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: '0.95em',
          color: 'var(--color-text-primary)'
        }}
      >
        {prefix}
        {event.details.patient_first_name
          ? ` - ${event.details.patient_first_name}`
          : ''}
      </span>
    );
  };

  const getAppointmentStatus = (statusId) => {
    switch (statusId) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Confirmada';
      case 3:
        return 'Completada';
      case 4:
        return 'Cancelada';
      default:
        return 'Desconocido';
    }
  };

  const getPaymentType = (typeId) => {
    switch (typeId) {
      case 1:
        return 'Efectivo';
      case 2:
        return 'Tarjeta';
      case 3:
        return 'Transferencia';
      default:
        return 'Desconocido';
    }
  };

  const CustomToolbar = ({ onNavigate, onView, view: currentView, date, label }) => {
    const viewLabels = {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda'
    };

    const handleViewChange = (newView) => {
      onView(newView);
    };

    // Estilos para los botones de navegación
    const navigationButtonStyle = {
      background: 'var(--color-background-quaternary)',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: '6px',
      color: 'var(--color-text-primary)',
      transition: 'all 0.3s ease',
      minWidth: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    const todayButtonStyle = {
      ...navigationButtonStyle,
      padding: '8px 16px',
      fontWeight: '500',
      minWidth: '60px'
    };

    // Función para manejar el hover
    const handleMouseEnter = (e) => {
      e.target.style.background = 'var(--color-primary)';
      e.target.style.transform = 'scale(1.05)';
      e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
    };

    const handleMouseLeave = (e) => {
      e.target.style.background = 'var(--color-background-quaternary)';
      e.target.style.transform = 'scale(1)';
      e.target.style.boxShadow = 'none';
    };

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px',
        padding: '16px 20px',
        background: 'var(--color-background-tertiary)',
        borderRadius: '12px',
        border: '1px solid var(--color-border-primary)'
      }}>
        {/* Navegación izquierda */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'var(--color-background-quaternary)',
            borderRadius: '8px',
            padding: '4px',
            gap: '2px'
          }}>
            <button
              onClick={() => onNavigate('PREV')}
              style={{
                ...navigationButtonStyle,
                background: 'transparent',
                borderRadius: '4px'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              &lt;
            </button>
            
            <button
              onClick={() => onNavigate('TODAY')}
              style={{
                ...todayButtonStyle,
                background: 'transparent',
                borderRadius: '4px'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              Hoy
            </button>
            
            <button
              onClick={() => onNavigate('NEXT')}
              style={{
                ...navigationButtonStyle,
                background: 'transparent',
                borderRadius: '4px'
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            >
              &gt;
            </button>
          </div>
        </div>

        {/* Título del calendario centrado */}
          <div style={{
            fontSize: '22px',
            fontWeight: '600',
            color: 'var(--color-primary)',
            textAlign: 'center',
            flex: 1
          }}>
          {label}
        </div>

        {/* Controles derechos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Botones de vista */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            background: 'var(--color-background-quaternary)',
            borderRadius: '8px',
            padding: '4px',
            gap: '2px',
            height: '44px'
          }}>
            {Object.entries(viewLabels).map(([viewKey, label]) => (
              <button
                key={viewKey}
                onClick={() => onView(viewKey)}
                style={{
                  background: currentView === viewKey ? 'var(--color-primary)' : 'transparent',
                  color: 'var(--color-text-primary)',
                  border: 'none',
                  padding: '0 16px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: currentView === viewKey ? '600' : '400',
                  transition: 'all 0.3s ease',
                  minWidth: '60px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  if (currentView !== viewKey) {
                    e.target.style.background = 'var(--color-primary)';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentView !== viewKey) {
                    e.target.style.background = 'transparent';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Botón New separado */}
          <button
            onClick={() => {
              setNewAppointmentModalVisible(true);
            }}
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-text-primary)',
              border: 'none',
              padding: '0 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              minWidth: '60px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#45a049';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-primary)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Plus size={16} style={{ marginRight: '6px' }} />
            New
          </button>

          {/* Botón de hamburguesa para ocultar/mostrar sidebar */}
          <button
            onClick={() => setSidebarVisible(!sidebarVisible)}
            style={{
              background: 'var(--color-background-quaternary)',
              color: 'var(--color-text-primary)',
              border: '1px solid #555',
              padding: '10px 12px',
              borderRadius: '12px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '44px',
              height: '44px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-primary)';
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 0 15px rgba(76, 175, 80, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-background-quaternary)';
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <List size={16} />
          </button>
        </div>
      </div>
    );
  };

  const handleMiniCalendarDateChange = (newDate) => {
    setDate(newDate);
  };

  if (error) {
    return <p>Error al cargar eventos: {error.message}</p>;
  }

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.mainContent}>
        <div className={styles.calendarWrapper}>
          {view === 'agenda' ? (
          <AgendaView 
            events={filteredEvents}
            date={date}
            localizer={localizer}
            onNavigate={handleNavigate}
            onView={handleViewChange}
            view={view}
            sidebarVisible={sidebarVisible}
            setSidebarVisible={setSidebarVisible}
            onSelectEvent={handleSelectEvent}
            setNewAppointmentModalVisible={setNewAppointmentModalVisible}
          />
        ) : (
          <Calendar
            localizer={localizer}
            events={filteredEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventPropGetter}
            components={{ 
              event: EventContent,
              toolbar: CustomToolbar
            }}
            date={date}
            onNavigate={handleNavigate}
            view={view}
            onView={handleViewChange}
            min={new Date(2024, 0, 1, 7, 0, 0)}
            max={new Date(2024, 0, 1, 13, 0, 0)}
            messages={{
              today: 'Hoy',
              previous: 'Anterior',
              next: 'Siguiente',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
              agenda: 'Agenda',
              date: 'Fecha',
              time: 'Hora',
              event: 'Evento',
              noEventsInRange: 'No hay citas en este rango de fechas.',
            }}
            defaultView="month"
            views={['month', 'week', 'day', 'agenda']}
          />
        )}
        </div>
      </div>

      {sidebarVisible && (
        <div className={styles.sidebar}>
          <MiniCalendar 
            selectedDate={date}
            onDateChange={handleMiniCalendarDateChange}
          />
          <CalendarList 
            selectedFilter={selectedCalendarFilter}
            onCalendarToggle={setSelectedCalendarFilter}
          />
        </div>
      )}

      <Modal
        title="Detalles de la Cita"
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        maskClosable={true}
        width={600}
      >
        {selectedEvent && (
          <div style={{ color: 'black' }}>
            <p>
              <strong>Paciente:</strong>{' '}
              {selectedEvent.details.patient_full_name}
            </p>
            <p>
              <strong>Terapeuta:</strong>{' '}
              {selectedEvent.details.therapist_full_name}
            </p>
            <p>
              <strong>Tipo de cita:</strong> {selectedEvent.title}
            </p>
            <p>
              <strong>Fecha:</strong>{' '}
              {dayjs(selectedEvent.start).format('DD/MM/YYYY')}
            </p>
            <p>
              <strong>Hora:</strong>{' '}
              {dayjs(selectedEvent.start).format('HH:mm')} -{' '}
              {dayjs(selectedEvent.end).format('HH:mm')}
            </p>
            <p>
              <strong>Diagnóstico:</strong>{' '}
              {selectedEvent.details.diagnosis || 'No especificado'}
            </p>
            <p>
              <strong>Malestar:</strong>{' '}
              {selectedEvent.details.ailments || 'No especificado'}
            </p>
            <p>
              <strong>Observaciones:</strong>{' '}
              {selectedEvent.details.observation || 'Ninguna'}
            </p>
            <p>
              <strong>Tipo de pago:</strong>{' '}
              {selectedEvent.details.payment_type_name}
            </p>
            <p>
              <strong>Ticket:</strong> {selectedEvent.details.ticket_number}
            </p>
          </div>
        )}
      </Modal>

      {/* Modal para crear nueva cita */}
      <Modal
        open={newAppointmentModalVisible}
        onCancel={() => setNewAppointmentModalVisible(false)}
        footer={null}
        closable={true}
        width="auto"
        style={{ 
          maxWidth: '600px',
          padding: '0',
          margin: '0'
        }}
        bodyStyle={{ 
          padding: '0',
          margin: '0',
          height: 'auto',
          overflowY: 'visible'
        }}
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        centered
      >
        <div style={{
          margin: '0',
          padding: '0',
          borderRadius: '0',
          boxShadow: 'none',
          border: 'none',
          backgroundColor: 'transparent',
          width: '100%',
          height: '100%'
        }}>
          <NewAppointment />
        </div>
        
        <style dangerouslySetInnerHTML={{
          __html: `
            .ant-modal-body div[class*="container"] {
              margin: 0 !important;
              padding: 0 !important;
              border-radius: 0 !important;
              box-shadow: none !important;
              border: none !important;
              background-color: transparent !important;
              max-width: none !important;
            }
            
            .agendaContent [class*="EmptyState"] div {
              margin: 0 !important;
              padding: 0 !important;
              border: none !important;
              background: transparent !important;
              box-shadow: none !important;
            }
            
            .agendaContent [class*="EmptyState"] > div:first-child {
              gap: 16px !important;
              padding: 40px 20px !important;
            }
          `
        }} />
      </Modal>
    </div>
  );
};

export default Calendario;
