import React from 'react';
import { Package, Users, Calendar, FileText, Gear, ChartBar } from '@phosphor-icons/react';

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

  return (
    <div
      style={{
        color: '#ffffff',
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
        background: '#1e1e1e',
        borderRadius: '12px',
        margin: '24px',
        border: '1px solid #444',
        minHeight: '200px',
        justifyContent: 'center',
        fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
        ...style
      }}
      className={className}
    >
      <IconComponent 
        size={64} 
        color="#22c55e" 
        style={{ 
          opacity: 0.8,
          filter: 'drop-shadow(0 2px 4px rgba(34, 197, 94, 0.2))'
        }} 
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '600', 
          margin: 0,
          color: '#ffffff'
        }}>
          {title}
        </h3>
        
        <p style={{ 
          fontSize: '14px', 
          color: '#a0a0a0',
          margin: 0,
          lineHeight: '1.5'
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
