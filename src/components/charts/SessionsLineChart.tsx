import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import dayjs from 'dayjs';
import { ChartRange, ChartRangeType } from '../../constants/chartRanges';
import { 
  transformSessionDataForRange, 
  getChartColors, 
  formatSessionCount, 
  calculateTrend,
  BackendData,
  ChartDataPoint 
} from '../../lib/chartUtils';
import ChartSummary from './ChartSummary';

/**
 * Props para el componente SessionsLineChart
 */
interface SessionsLineChartProps {
  /** Datos del backend con información de sesiones */
  data: BackendData;
  /** Rango de tiempo seleccionado */
  range: ChartRangeType;
  /** Fecha de inicio para rangos personalizados */
  startDate?: dayjs.Dayjs;
  /** Fecha de fin para rangos personalizados */
  endDate?: dayjs.Dayjs;
  /** Título del gráfico */
  title?: string;
  /** Subtítulo del gráfico */
  subtitle?: string;
  /** Modo oscuro activado */
  isDarkMode?: boolean;
  /** Altura del gráfico */
  height?: number;
  /** Ancho del gráfico */
  width?: string | number;
}

/**
 * Componente premium de gráfico de líneas para sesiones usando Tremor
 * Estilo Google Analytics con fondo oscuro y colores vibrantes
 */
const SessionsLineChart: React.FC<SessionsLineChartProps> = ({
  data,
  range,
  startDate,
  endDate,
  title = 'Sesiones por Período',
  subtitle,
  isDarkMode = true,
  height = 400,
  width = '100%'
}) => {
  // Obtener colores del tema
  const colors = useMemo(() => getChartColors(isDarkMode), [isDarkMode]);
  
  // Transformar datos según el rango seleccionado
  const chartData = useMemo(() => {
    if (!data || !data.sesiones) {
      return [];
    }
    
    const transformed = transformSessionDataForRange(data, range, startDate, endDate);
    return transformed;
  }, [data, range, startDate, endDate]);
  
  // Calcular estadísticas del gráfico
  const stats = useMemo(() => {
    const sessions = chartData.map(d => d.sessions);
    const total = sessions.reduce((sum, val) => sum + val, 0);
    const average = total / sessions.length || 0;
    const max = Math.max(...sessions);
    const min = Math.min(...sessions.filter(s => s > 0));
    
    return { total, average, max, min };
  }, [chartData]);
  
  // Preparar datos para Recharts con índice único
  const tremorData = useMemo(() => {
    if (chartData.length === 0) {
      return [];
    }
    return chartData.map((item, index) => ({
      index: index, // Agregar índice único
      date: item.label,
      'Sesiones': item.sessions,
      sublabel: item.sublabel,
      fullDate: item.date // Guardar fecha completa
    }));
  }, [chartData]);

  // Mostrar mensaje si no hay datos
  if (!data || !data.sesiones || chartData.length === 0) {
    return (
      <div 
        className="rounded-xl p-6 shadow-2xl flex items-center justify-center"
        style={{
          backgroundColor: colors.background,
          border: `1px solid ${colors.grid}`,
          minHeight: height
        }}
      >
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 
            className="text-lg font-semibold mb-2"
            style={{ color: colors.text }}
          >
            No hay datos disponibles
          </h3>
          <p 
            className="text-sm opacity-75"
            style={{ color: colors.textSecondary }}
          >
            Los datos de sesiones se cargarán pronto
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="rounded-2xl p-6 shadow-2xl"
      style={{
        backgroundColor: colors.background,
        border: `2px solid ${colors.primary}20`,
        borderRadius: '20px',
        boxShadow: `0 10px 40px rgba(0,0,0,0.1), 0 4px 12px ${colors.primary}15`
      }}
    >
      {/* Título del gráfico */}
      <div className="mb-4">
        <h3 
          className="text-lg font-bold truncate"
          style={{ 
            color: colors.text,
            textAlign: 'left',
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </h3>
      </div>

      {/* Resumen con tarjetas visuales */}
      <ChartSummary
        rangeLabel={subtitle || 'Período seleccionado'}
        average={stats.average}
        max={stats.max}
        min={stats.min}
        isDarkMode={isDarkMode}
      />
      
      {/* Gráfico Recharts */}
      <div 
        className="rounded-xl"
        style={{ 
          height: height, 
          width: width,
          backgroundColor: colors.background,
          borderRadius: '12px',
          padding: '16px',
          border: `1px solid ${colors.primary}10`
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={tremorData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid 
              strokeDasharray="2 6" 
              stroke={isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: colors.textSecondary,
                fontSize: 11,
                fontWeight: 600
              }}
              angle={range === ChartRange.YEAR ? -45 : 0}
              textAnchor={range === ChartRange.YEAR ? 'end' : 'middle'}
              height={range === ChartRange.YEAR ? 80 : 60}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: colors.textSecondary,
                fontSize: 11,
                fontWeight: 600
              }}
              width={50}
              tickCount={6}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: isDarkMode ? 'rgba(26,26,26,0.95)' : 'rgba(255,255,255,0.95)',
                borderColor: colors.primary + '40',
                borderRadius: '12px',
                color: colors.text,
                backdropFilter: 'blur(10px)',
                boxShadow: `0 8px 32px rgba(0,0,0,0.2), 0 4px 12px ${colors.primary}20`,
                border: `2px solid ${colors.primary}30`
              }}
              formatter={(value, name, props) => {
                const data = props.payload;
                if (!data) return [value, name];
                
                // Usar el índice único del payload
                const payloadIndex = data.index;
                const dateInfo = payloadIndex !== undefined ? chartData[payloadIndex] : null;
                
                const dateStr = dateInfo ? dateInfo.date : data.fullDate || '';
                const sublabel = dateInfo ? dateInfo.sublabel : data.sublabel || '';
                
                // Formatear fecha completa
                const fullDate = dateStr ? dayjs(dateStr).format('dddd, DD [de] MMMM [de] YYYY') : '';
                
                return [
                  <div key="tooltip-content" style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '6px', color: colors.text, fontSize: '14px' }}>
                      {data.date} {sublabel && `• ${sublabel}`}
                    </div>
                    <div style={{ color: colors.primary, fontSize: '18px', fontWeight: 'bold' }}>
                      {value} sesiones
                    </div>
                    {fullDate && (
                      <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '6px', color: colors.textSecondary }}>
                        {fullDate}
                      </div>
                    )}
                  </div>,
                  ''
                ];
              }}
              labelFormatter={(label) => {
                // Encontrar la fecha correspondiente al label
                const dataPoint = chartData.find(d => d.label === label);
                return dataPoint ? `${label} • ${dataPoint.sublabel}` : label;
              }}
            />
            <Line
              type="monotone"
              dataKey="Sesiones"
              stroke={colors.primary}
              strokeWidth={4}
              dot={{
                fill: colors.primary,
                strokeWidth: 3,
                stroke: colors.background,
                r: 7,
                filter: `drop-shadow(0 2px 8px ${colors.primary}50)`
              }}
              activeDot={{
                r: 10,
                stroke: colors.primary,
                strokeWidth: 3,
                fill: colors.background,
                style: {
                  filter: `drop-shadow(0 0 12px ${colors.primary}60)`
                }
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default SessionsLineChart;
