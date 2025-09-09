import React from'react';
import { Button } from 'antd';
import { useTheme } from '../../context/ThemeContext';

const CustomButton = ({
  text, 
  onClick, 
  size = 'md', 
  type = 'primary', 
  disabled = false,
  icon = null,
  style = {},
  ...props
}) => {
  const { isDarkMode } = useTheme();
  
  // Dimensiones estándar según el tamaño
  const sizeStyles = {
    sm: {
      height: 'var(--button-height-sm)',
      padding: 'var(--button-padding-sm)',
      fontSize: 'var(--button-font-size-sm)',
    },
    md: {
      height: 'var(--button-height-md)',
      padding: 'var(--button-padding-md)',
      fontSize: 'var(--button-font-size-md)',
    },
    lg: {
      height: 'var(--button-height-lg)',
      padding: 'var(--button-padding-lg)',
      fontSize: 'var(--button-font-size-lg)',
    },
    xl: {
      height: 'var(--button-height-xl)',
      padding: 'var(--button-padding-xl)',
      fontSize: 'var(--button-font-size-xl)',
    }
  };

  const currentSizeStyle = sizeStyles[size] || sizeStyles.md;

  return(
    <Button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      icon={icon}
      style={{
        ...currentSizeStyle,
        fontFamily: 'var(--font-family)',
        fontWeight: 'var(--font-weight-medium)',
        borderRadius: '6px',
        border: 'none',
        boxShadow: disabled 
          ? 'none' 
          : '0 2px 8px rgba(28, 181, 74, 0.2)',
        transition: 'all var(--transition-fast)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...style
      }}
      {...props}
    >
      {text}
    </Button>
  );
};

export default CustomButton;