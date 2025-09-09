import React from 'react';
import { Package, Users, Calendar, FileText, Gear, ChartBar } from '@phosphor-icons/react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Componente para mostrar estados vacíos de manera consistente
 */
const EmptyState = ({ 
  icon = 'package',
  title = 'No hay datos disponibles',
  description = 'Los datos aparecerán aquí cuando estén disponibles',
  action = null,
  style = {},
  className = ''
}) => {
  const { isDarkMode } = useTheme();
  
  // Mapeo de iconos
  const iconMap = {
    package: Package,
    users: Users,
    calendar: Calendar,
    file: FileText,
    settings: Gear,
    chart: ChartBar
  };

  const IconComponent = iconMap[icon] || Package;

  // Estilos base que se combinan con los personalizados
  const baseStyles = {
    color: isDarkMode ? '#ffffff' : '#333333',
    padding: '48px 24px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    background: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    borderRadius: '16px',
    margin: '24px',
    border: `1px solid ${isDarkMode ? '#444444' : '#e0e0e0'}`,
    minHeight: '200px',
    justifyContent: 'center',
    fontFamily: 'var(--font-family)',
    boxShadow: isDarkMode 
      ? '0 4px 12px rgba(0, 0, 0, 0.2)' 
      : '0 4px 20px rgba(0, 0, 0, 0.08)',
    transition: 'all var(--transition-normal)',
    position: 'relative',
    overflow: 'hidden'
  };

  return (
    <div
      style={{
        ...baseStyles,
        ...style
      }}
      className={className}
    >
      <IconComponent 
        size={64} 
        color="#1CB54A" 
        style={{ 
          opacity: 0.8,
          filter: 'drop-shadow(0 2px 4px rgba(28, 181, 74, 0.2))',
          transition: 'all var(--transition-normal)'
        }} 
      />
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          margin: 0,
          color: isDarkMode ? '#ffffff' : '#333333',
          fontFamily: 'var(--font-family)',
          transition: 'color var(--transition-normal)'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          fontSize: '14px', 
          color: isDarkMode ? '#a0a0a0' : '#666666',
          margin: 0,
          lineHeight: '1.5',
          fontFamily: 'var(--font-family)',
          transition: 'color var(--transition-normal)'
        }}>
          {description}
        </p>
      </div>

      {action && (
        <div style={{ marginTop: '8px' }}>
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
