import React from 'react';
import { Spin, ConfigProvider } from 'antd';

/**
 * Componente de spinner consistente con color verde
 * y tipografía uniforme en toda la aplicación
 */
const ConsistentSpinner = ({ 
  size = 'large', 
  tip = 'Cargando...', 
  style = {},
  className = '',
  ...props 
}) => {
  return (
    <ConfigProvider 
      theme={{ 
        token: { 
          colorPrimary: '#22c55e' // Verde consistente
        } 
      }}
    >
      <Spin
        size={size}
        tip={tip}
        style={{
          color: '#22c55e',
          fontSize: '16px',
          fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
          ...style
        }}
        className={className}
        {...props}
      />
    </ConfigProvider>
  );
};

export default ConsistentSpinner;
