import React, { useState, useEffect } from 'react';
import logoReflexo from '../../assets/Img/images__1_-removebg-preview.png';
import { message, Popconfirm, Tooltip, Spin } from 'antd';
import {
  SyncOutlined, MailOutlined, PhoneOutlined,
  DeleteOutlined, ArrowRightOutlined, CalendarOutlined,
  FireOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import axios from '../../services/api/Axios/baseConfig';

dayjs.locale('es');

/* ═══════════════════════════════════════════
   PALETA DISEÑADA A MANO — "Reflexo Corporate"
   ═══════════════════════════════════════════ */
const C = {
  navy: '#0D1B2A',
  navyMid: '#1E3A5F',
  navyLight: '#2563EB',
  slate: '#64748B',
  slateLight: '#94A3B8',
  border: '#E8EDF5',
  card: '#FAFBFF',
  white: '#FFFFFF',
  accent: '#3B82F6',
  accentBg: '#EFF6FF',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  success: '#10B981',
  successBg: '#ECFDF5',
  warn: '#F59E0B',
};

/* ═══════════════════
   ESTILOS ARTESANALES
   ═══════════════════ */
const S = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: C.white,
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },

  /* ── HEADER ── */
  header: {
    background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 100%)`,
    padding: '28px 32px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  headerTitle: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 800,
    color: C.white,
    letterSpacing: '-0.3px',
    lineHeight: 1.2,
  },
  headerSub: {
    margin: '6px 0 0',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.55)',
    fontWeight: 400,
  },
  syncBtn: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '9px 18px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.85)',
    fontSize: '13px',
    fontWeight: 600,
    backdropFilter: 'blur(8px)',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },

  /* ── STATS BAR ── */
  statsBar: {
    display: 'flex',
    gap: '1px',
    background: C.border,
    borderBottom: `1px solid ${C.border}`,
    flexShrink: 0,
  },
  statCell: {
    flex: 1,
    padding: '14px 20px',
    background: C.white,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statNumber: {
    fontSize: '20px',
    fontWeight: 800,
    color: C.navy,
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: C.slateLight,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  /* ── BODY ── */
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  /* ── LEAD CARD ── */
  card: {
    background: C.white,
    border: `1.5px solid ${C.border}`,
    borderRadius: '16px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    transition: 'box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
    cursor: 'default',
  },

  /* ── AVATAR ── */
  avatar: (isPatient) => ({
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    background: isPatient
      ? `linear-gradient(135deg, ${C.successBg}, #D1FAE5)`
      : `linear-gradient(135deg, ${C.accentBg}, #DBEAFE)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 800,
    color: isPatient ? C.success : C.navyLight,
    flexShrink: 0,
    border: `1.5px solid ${isPatient ? '#A7F3D0' : '#BFDBFE'}`,
  }),

  /* ── BADGE ── */
  badge: (isPatient) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.04em',
    background: isPatient ? C.successBg : C.accentBg,
    color: isPatient ? C.success : C.navyLight,
    border: `1px solid ${isPatient ? '#A7F3D0' : '#BFDBFE'}`,
  }),

  /* ── DATE CHIP ── */
  dateChip: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    minWidth: '90px',
    padding: '8px 16px',
    borderRadius: '12px',
    background: C.card,
    border: `1px solid ${C.border}`,
    flexShrink: 0,
  },

  /* ── ACTION BUTTONS ── */
  btnSchedule: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 22px',
    borderRadius: '12px',
    border: 'none',
    background: `linear-gradient(135deg, ${C.navyMid}, ${C.navy})`,
    color: C.white,
    fontSize: '13px',
    fontWeight: 700,
    transition: 'all 0.2s ease',
    boxShadow: `0 4px 14px rgba(30,58,95,0.3)`,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  btnDelete: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '38px',
    height: '38px',
    borderRadius: '10px',
    border: `1.5px solid ${C.border}`,
    background: C.white,
    color: C.slateLight,
    fontSize: '15px',
    transition: 'all 0.2s ease',
    flexShrink: 0,
  },

  /* ── EMPTY STATE ── */
  empty: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    gap: '12px',
    opacity: 0.4,
  },

  /* ── FOOTER ── */
  footer: {
    padding: '16px 24px',
    borderTop: `1px solid ${C.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexShrink: 0,
    background: C.card,
  },
};


/* ═══════════════════
   COMPONENTE PRINCIPAL
   ═══════════════════ */
const GhlLeadsList = ({ onSchedule }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/ghl-bookings');
      setLeads(data);
    } catch {
      message.error('No se pudo sincronizar con GoHighLevel');
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/ghl-bookings/${id}`);
      message.success('Prospecto descartado correctamente');
      fetchLeads();
    } catch {
      message.error('Error al eliminar el registro');
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const pendientes = leads.filter(l => !l.patient_id).length;
  const pacientes = leads.filter(l => l.patient_id).length;

  return (
    <div style={S.wrapper}>

      {/* ── HEADER ── */}
      <header style={S.header}>
        <div>
          <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Citas Externas
          </p>
          <h2 style={S.headerTitle}>Solicitudes de Cita</h2>
          <p style={S.headerSub}>Personas que pidieron cita desde internet</p>
        </div>

        <img 
          src={logoReflexo} 
          alt="Reflexo Perú" 
          style={{ 
            height: '52px', 
            objectFit: 'contain',
            filter: 'brightness(0) invert(1)',
            opacity: 0.9,
            flexShrink: 0
          }} 
        />
        <Tooltip title="Sincronizar con GoHighLevel ahora" placement="left">
          <button
            style={S.syncBtn}
            onClick={fetchLeads}
            onMouseEnter={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.3)' })}
            onMouseLeave={e => Object.assign(e.currentTarget.style, { background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.15)' })}
          >
            <SyncOutlined spin={loading} style={{ fontSize: '14px' }} />
            Actualizar
          </button>
        </Tooltip>
      </header>

      {/* ── STATS BAR ── */}
      <div style={S.statsBar}>
        <div style={S.statCell}>
          <span style={S.statNumber}>{leads.length}</span>
          <span style={S.statLabel}>Total Solicitudes</span>
        </div>
        <div style={S.statCell}>
          <span style={{ ...S.statNumber, color: C.navyLight }}>{pendientes}</span>
          <span style={S.statLabel}>Por Atender</span>
        </div>
        <div style={S.statCell}>
          <span style={{ ...S.statNumber, color: C.success }}>{pacientes}</span>
          <span style={S.statLabel}>Ya son Pacientes</span>
        </div>
        <div style={{ ...S.statCell, borderLeft: `2px solid ${C.border}` }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: C.slateLight }}>Última sincronización</span>
          <span style={{ fontSize: '13px', fontWeight: 700, color: C.navy }}>{dayjs().format('HH:mm')}</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <Spin spinning={loading} tip="Cargando registros...">
        <div style={S.body}>
          {leads.length === 0 && !loading ? (
            <div style={S.empty}>
              <FireOutlined style={{ fontSize: '48px', color: C.slateLight }} />
              <p style={{ margin: 0, fontWeight: 700, color: C.slate, fontSize: '15px' }}>Todo al día</p>
              <p style={{ margin: 0, fontSize: '13px', color: C.slateLight }}>No hay solicitudes de cita pendientes por revisar.</p>
            </div>
          ) : (
            leads.map((item) => {
              const fecha = dayjs(item.start_time);
              const isPatient = !!item.patient_id;
              return (
                <div
                  key={item.id}
                  style={S.card}
                  onMouseEnter={e => Object.assign(e.currentTarget.style, { boxShadow: '0 8px 24px rgba(13,27,42,0.08)', borderColor: '#C7D5F0', transform: 'translateY(-1px)' })}
                  onMouseLeave={e => Object.assign(e.currentTarget.style, { boxShadow: 'none', borderColor: C.border, transform: 'translateY(0)' })}
                >
                  {/* Avatar */}
                  <div style={S.avatar(isPatient)}>
                    {item.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info principal */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: C.navy, whiteSpace: 'nowrap' }}>{item.name}</span>
                      <span style={S.badge(isPatient)}>
                        {isPatient ? <><SafetyCertificateOutlined /> PACIENTE REGISTRADO</> : <><FireOutlined /> SOLICITUD NUEVA</>}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '12px', color: C.slateLight, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <MailOutlined style={{ fontSize: '11px' }} />
                        <span style={{ maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.email || '—'}
                        </span>
                      </span>
                      <span style={{ fontSize: '12px', color: C.slateLight, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <PhoneOutlined style={{ fontSize: '11px' }} />
                        {item.phone || '—'}
                      </span>
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: C.slate, background: C.card, border: `1px solid ${C.border}`, padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        {item.service || 'Consulta General'}
                      </span>
                    </div>
                  </div>

                  {/* Fecha */}
                  <Tooltip title={fecha.isValid() ? fecha.format('dddd, D [de] MMMM YYYY') : 'Fecha por definir'}>
                    <div style={S.dateChip}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: C.navy }}>
                        {fecha.isValid() ? fecha.format('DD MMM') : '—'}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: C.slateLight }}>
                        {fecha.isValid() ? fecha.format('hh:mm A') : '—'}
                      </span>
                    </div>
                  </Tooltip>

                  {/* Acciones */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <Popconfirm
                      title="¿Eliminar este prospecto?"
                      description="No podrás recuperar este registro."
                      onConfirm={() => handleDelete(item.id)}
                      okText="Eliminar"
                      cancelText="Cancelar"
                      okButtonProps={{ danger: true }}
                    >
                      <Tooltip title="Descartar esta solicitud" placement="top">
                        <button
                          style={S.btnDelete}
                          onMouseEnter={e => Object.assign(e.currentTarget.style, { background: C.dangerBg, borderColor: '#FECACA', color: C.danger })}
                          onMouseLeave={e => Object.assign(e.currentTarget.style, { background: C.white, borderColor: C.border, color: C.slateLight })}
                        >
                          <DeleteOutlined />
                        </button>
                      </Tooltip>
                    </Popconfirm>

                    <Tooltip title="Registrar como cita en el sistema" placement="top">
                      <button
                        style={S.btnSchedule}
                        onClick={() => {
                          if (onSchedule) {
                            onSchedule(item);
                          } else {
                            message.info(`Iniciando registro para ${item.name}...`);
                          }
                        }}
                        onMouseEnter={e => Object.assign(e.currentTarget.style, { transform: 'translateY(-1px)', boxShadow: `0 8px 20px rgba(30,58,95,0.4)` })}
                        onMouseLeave={e => Object.assign(e.currentTarget.style, { transform: 'translateY(0)', boxShadow: `0 4px 14px rgba(30,58,95,0.3)` })}
                      >
                        Agendar <ArrowRightOutlined />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Spin>

      {/* ── FOOTER ── */}
      <footer style={S.footer}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.success, boxShadow: `0 0 6px ${C.success}` }} />
        <span style={{ fontSize: '11px', fontWeight: 600, color: C.slateLight, letterSpacing: '0.05em' }}>
          SOLICITUDES RECIBIDAS AUTOMÁTICAMENTE · REFLEXO PERÚ
        </span>
      </footer>

    </div>
  );
};

export default GhlLeadsList;
