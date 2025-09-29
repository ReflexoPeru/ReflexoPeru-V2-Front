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
  // Colores del tema con paleta verde elegante
  const colors = {
    background: isDarkMode ? '#0f1419' : '#ffffff',
    cardBackground: isDarkMode ? '#1a2332' : '#f8fffe',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: isDarkMode ? '#a0a0a0' : '#666666',
    primary: isDarkMode ? '#4ade80' : '#059669', // Verde elegante
    accent: isDarkMode ? '#22c55e' : '#10b981', // Verde más vibrante para acentos
    border: isDarkMode ? '#2d3748' : '#e5f3ef',
    shadow: isDarkMode ? 'rgba(0,0,0,0.4)' : 'rgba(5,150,105,0.1)',
    gradientStart: isDarkMode ? '#1e3a2f' : '#ecfdf5',
    gradientEnd: isDarkMode ? '#2d4a3e' : '#f0fdf4'
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
          className="px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
            borderColor: colors.border,
            borderRadius: '12px',
            minWidth: '160px',
            flexShrink: 0,
            boxShadow: `0 4px 12px ${colors.shadow}`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div 
              className="p-2 rounded-lg mb-2"
              style={{
                background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.primary}20 100%)`,
                border: `1px solid ${colors.accent}30`,
                borderRadius: '8px'
              }}
            >
              <Calendar 
                size={20} 
                weight="bold" 
                color={colors.accent}
              />
            </div>
            <div>
              <div 
                className="text-xs font-medium"
                style={{ color: colors.textSecondary }}
              >
                Período
              </div>
              <div 
                className="text-sm font-bold mt-1"
                style={{ 
                  color: colors.text,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {rangeLabel}
              </div>
            </div>
          </div>
        </div>

            {/* Tarjeta del Promedio */}
            <div 
              className="px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                borderColor: colors.border,
                borderRadius: '12px',
                minWidth: '120px',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${colors.shadow}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div 
                  className="p-2 rounded-lg mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.primary}20 100%)`,
                    border: `1px solid ${colors.accent}30`,
                    borderRadius: '8px'
                  }}
                >
                  <TrendUp 
                    size={20} 
                    weight="bold" 
                    color={colors.accent}
                  />
                </div>
                <div>
                  <div 
                    className="text-xs font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Promedio
                  </div>
                  <div 
                    className="text-lg font-bold mt-1"
                    style={{ 
                      color: colors.primary,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    {animatedAverage.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta del Máximo */}
            <div 
              className="px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                borderColor: colors.border,
                borderRadius: '12px',
                minWidth: '120px',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${colors.shadow}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div 
                  className="p-2 rounded-lg mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.primary}20 100%)`,
                    border: `1px solid ${colors.accent}30`,
                    borderRadius: '8px'
                  }}
                >
                  <TrendingUp 
                    size={20} 
                    weight="bold" 
                    color={colors.accent}
                  />
                </div>
                <div>
                  <div 
                    className="text-xs font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Máximo
                  </div>
                  <div 
                    className="text-lg font-bold mt-1"
                    style={{ 
                      color: colors.accent,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                  >
                    {animatedMax}
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta del Mínimo */}
            <div 
              className="px-4 py-3 rounded-xl border transition-all duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${colors.gradientStart} 0%, ${colors.gradientEnd} 100%)`,
                borderColor: colors.border,
                borderRadius: '12px',
                minWidth: '120px',
                flexShrink: 0,
                boxShadow: `0 4px 12px ${colors.shadow}`,
                backdropFilter: 'blur(10px)'
              }}
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div 
                  className="p-2 rounded-lg mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.accent}20 0%, ${colors.primary}20 100%)`,
                    border: `1px solid ${colors.accent}30`,
                    borderRadius: '8px'
                  }}
                >
                  <TrendDown 
                    size={20} 
                    weight="bold" 
                    color={colors.accent}
                  />
                </div>
                <div>
                  <div 
                    className="text-xs font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    Mínimo
                  </div>
                  <div 
                    className="text-lg font-bold mt-1"
                    style={{ 
                      color: colors.primary,
                      textShadow: '0 1px 2px rgba(0,0,0,0.1)'
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
