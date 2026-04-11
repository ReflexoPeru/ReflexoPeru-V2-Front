import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, Typography, Empty, Spin } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const VitalsChart = ({ vitals = [], appointments = [], loading = false, selectedDate = '' }) => {
  if (loading) {
    return (
      <div style={{ height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin tip="Cargando historial de peso..." />
      </div>
    );
  }

  if (!vitals || vitals.length <= 1) {
    return (
      <Card style={{ marginBottom: '24px', borderRadius: '12px', border: '1px dashed #d9d9d9', background: '#fafafa' }}>
        <Empty 
          description="Evolución del peso (Se requiere más de 1 cita)" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ margin: '10px 0' }}
        />
      </Card>
    );
  }

  // Ordenamos todas las citas por fecha ASC para tener los índices reales
  const sortedAppointments = [...appointments].sort(
    (a, b) => dayjs(a.appointment_date).unix() - dayjs(b.appointment_date).unix()
  );

  // Preparamos los datos para el gráfico relacionándolos con las citas
  const data = vitals
    .map((vital) => {
      const fechaOriginal = dayjs(vital.measured_at);
      const dbDate = fechaOriginal.format('YYYY-MM-DD');
      
      // Buscamos el índice real de esta cita en el historial completo del paciente
      // Comparamos solo la fecha (YYYY-MM-DD) para mayor robustez
      const appointmentIndex = sortedAppointments.findIndex(appt => 
        dayjs(appt.appointment_date).format('YYYY-MM-DD') === dbDate
      );
      
      const sessionNumber = appointmentIndex !== -1 ? appointmentIndex + 1 : null;

      return {
        fechaOriginal,
        dbDate,
        peso: parseFloat(vital.weight),
        talla: parseFloat(vital.height),
        fullDate: fechaOriginal.format('DD MMMM, YYYY'),
        sessionNumber,
        sessionLabel: sessionNumber ? `Cita ${sessionNumber}` : `Cita (${dbDate})`,
        isCurrent: dbDate === selectedDate,
      };
    })
    .sort((a, b) => a.fechaOriginal.diff(b.fechaOriginal));

  // Calcular márgenes dinámicos
  const pesos = data.map(d => d.peso);
  const minWeight = Math.floor(Math.min(...pesos)) - 1;
  const maxWeight = Math.ceil(Math.max(...pesos)) + 1;

  // Custom Dot component para resaltar el punto actual
  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.isCurrent) {
      return (
        <circle cx={cx} cy={cy} r={7} fill="#1a3353" stroke="#fff" strokeWidth={3} filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.2))" />
      );
    }
    return (
      <circle cx={cx} cy={cy} r={4} fill="#3498db" stroke="#fff" strokeWidth={2} />
    );
  };

  return (
    <Card 
      style={{ 
        marginBottom: '24px', 
        borderRadius: '16px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid #eef2f6',
        background: '#fff'
      }}
      bodyStyle={{ padding: '16px' }}
    >
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Title level={5} style={{ margin: 0, color: '#1a3353', fontWeight: 600 }}>Evolución y Progreso del Peso</Title>
          <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {data.length} pesos registrados de {appointments.length} citas
          </Text>
        </div>
        <div style={{ textAlign: 'right' }}>
           <Text strong style={{ color: '#3498db', fontSize: '16px' }}>
              {data[data.length - 1].peso} kg
           </Text>
           <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#bdc3c7', fontWeight: 700 }}>Peso Hoy</div>
        </div>
      </div>

      <div style={{ width: '100%', height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3498db" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#3498db" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f2f2f2" />
            <XAxis 
              dataKey="sessionLabel" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#bdc3c7', fontSize: 10, fontWeight: 500 }}
              dy={8}
            />
            <YAxis 
              domain={[minWeight, maxWeight]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#bdc3c7', fontSize: 10 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 8px 24px rgba(149, 157, 165, 0.2)',
                padding: '8px 12px'
              }}
              labelStyle={{ color: '#7f8c8d', fontSize: '11px', marginBottom: '4px' }}
              itemStyle={{ color: '#3498db', fontSize: '13px', fontWeight: 'bold' }}
              labelFormatter={(label, payload) => {
                const item = payload[0]?.payload;
                return item 
                  ? `${item.sessionLabel} • ${item.fullDate} ${item.isCurrent ? '(Sesión Abierta)' : ''}` 
                  : label;
              }}
            />
            <Area
              name="Peso"
              type="monotone"
              dataKey="peso"
              stroke="#3498db"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPeso)"
              dot={<CustomizedDot />}
              activeDot={{ r: 8, strokeWidth: 0, fill: '#1a3353' }}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default VitalsChart;
