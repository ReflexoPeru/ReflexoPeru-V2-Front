import React, { useEffect, useState } from 'react';
import { Calendar, TrendUp, TrendUp as TrendingUp, TrendDown } from 'phosphor-react';
import { useCounterAnimation } from '../../hooks/usePageAnimation';

interface ChartSummaryProps {
  /** Etiqueta del rango de tiempo (ej. "Últimas 4 semanas") */
  rangeLabel: string;
  /** Valor promedio */
  average: number;
  /** Valor máximo */
  max: number;
  /** Valor mínimo */
  min: number;
  /** Modo oscuro activado */
  isDarkMode?: boolean;
}

/**
 * Componente de resumen visual con tarjetas para estadísticas del gráfico
 * Estilo premium con fondo oscuro y colores vibrantes
 */
const ChartSummary: React.FC<ChartSummaryProps> = ({
  rangeLabel,
  average,
  max,
  min,
  isDarkMode = true
}) => {
  // Animaciones de contador
  const animatedAverage = useCounterAnimation(average, 1500, true);
  const animatedMax = useCounterAnimation(max, 1800, true);
  const animatedMin = useCounterAnimation(min, 2000, true);
  // Colores del tema
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    cardBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: isDarkMode ? '#a0a0a0' : '#666666',
    primary: isDarkMode ? '#ffffff' : '#1a1a1a',
    border: isDarkMode ? '#333333' : '#e0e0e0',
    shadow: isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'
  };

  return (
    <div className="mb-6 animate-slide-up">
      {/* Container de tarjetas en fila horizontal */}
      <div 
        className="flex gap-4"
        style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: '16px',
          width: '100%',
          justifyContent: 'flex-end'
        }}
      >
        {/* Tarjeta del Rango */}
        <div 
          className="px-4 py-3 rounded-lg border transition-all duration-200"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: '8px',
            minWidth: '160px',
            flexShrink: 0
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0'
              }}
            >
              <Calendar 
                size={20} 
                weight="bold" 
                color="#666666"
              />
            </div>
            <div>
              <div 
                className="text-xs font-medium"
                style={{ color: colors.text }}
              >
                Período
              </div>
              <div 
                className="text-sm font-bold mt-1"
                style={{ 
                  color: colors.text
                }}
              >
                {rangeLabel}
              </div>
            </div>
          </div>
        </div>

            {/* Tarjeta del Promedio */}
            <div 
              className="px-4 py-3 rounded-lg border transition-all duration-200"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: '8px',
            minWidth: '120px',
            flexShrink: 0
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0'
              }}
            >
              <TrendUp 
                size={20} 
                weight="bold" 
                color="#666666"
              />
            </div>
            <div>
              <div 
                className="text-xs font-medium"
                style={{ color: colors.text }}
              >
                Promedio
              </div>
                  <div 
                    className="text-lg font-bold mt-1"
                    style={{ 
                      color: colors.text
                    }}
                  >
                    {animatedAverage.toFixed(1)}
                  </div>
            </div>
          </div>
        </div>

            {/* Tarjeta del Máximo */}
            <div 
              className="px-4 py-3 rounded-lg border transition-all duration-200"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: '8px',
            minWidth: '120px',
            flexShrink: 0
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0'
              }}
            >
              <TrendingUp 
                size={20} 
                weight="bold" 
                color="#666666"
              />
            </div>
            <div>
              <div 
                className="text-xs font-medium"
                style={{ color: colors.text }}
              >
                Máximo
              </div>
                  <div 
                    className="text-lg font-bold mt-1"
                    style={{ 
                      color: colors.text
                    }}
                  >
                    {animatedMax}
                  </div>
            </div>
          </div>
        </div>

            {/* Tarjeta del Mínimo */}
            <div 
              className="px-4 py-3 rounded-lg border transition-all duration-200"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.border,
            borderRadius: '8px',
            minWidth: '120px',
            flexShrink: 0
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded"
              style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0'
              }}
            >
              <TrendDown 
                size={20} 
                weight="bold" 
                color="#666666"
              />
            </div>
            <div>
              <div 
                className="text-xs font-medium"
                style={{ color: colors.text }}
              >
                Mínimo
              </div>
                  <div 
                    className="text-lg font-bold mt-1"
                    style={{ 
                      color: colors.text
                    }}
                  >
                    {animatedMin || 0}
                  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSummary;
