import React from 'react';
import { Spin } from 'antd';

/**
 * Componente de spinner consistente que usa el tema global
 */
const ConsistentSpinner = ({ 
  size = 'large', 
  tip = 'Cargando...', 
  style = {},
  className = '',
  ...props 
}) => {
  return (
    <Spin
      size={size}
      tip={tip}
      style={{
        color: 'var(--color-primary)',
        fontSize: '16px',
        fontFamily: 'var(--font-family)',
        ...style
      }}
      className={className}
      {...props}
    />
  );
};

export default ConsistentSpinner;
