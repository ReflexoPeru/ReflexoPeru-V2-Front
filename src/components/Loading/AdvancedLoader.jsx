import React from 'react';

/**
 * Props para el loader avanzado
 */
interface AdvancedLoaderProps {
  /** Tipo de loader */
  type?: 'spinner' | 'dots' | 'pulse' | 'skeleton' | 'progress' | 'wave';
  /** Tamaño del loader */
  size?: 'small' | 'medium' | 'large';
  /** Color del loader */
  color?: string;
  /** Si debe estar centrado */
  centered?: boolean;
  /** Texto de carga */
  text?: string;
  /** Si debe mostrar porcentaje */
  showPercentage?: boolean;
  /** Porcentaje actual (0-100) */
  percentage?: number;
  /** Si debe tener animación de fade */
  fadeIn?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** Estilo inline */
  style?: React.CSSProperties;
}

/**
 * Loader premium con múltiples variantes
 */
const AdvancedLoader: React.FC<AdvancedLoaderProps> = ({
  type = 'spinner',
  size = 'medium',
  color = '#1CB54A',
  centered = true,
  text,
  showPercentage = false,
  percentage = 0,
  fadeIn = true,
  className = '',
  style = {}
}) => {
  // Tamaños
  const sizes = {
    small: { width: '20px', height: '20px', fontSize: '12px' },
    medium: { width: '40px', height: '40px', fontSize: '14px' },
    large: { width: '60px', height: '60px', fontSize: '16px' }
  };

  // Generar clases
  const getClasses = () => {
    const baseClasses = 'advanced-loader';
    const typeClass = `loader-${type}`;
    const sizeClass = `loader-${size}`;
    const fadeClass = fadeIn ? 'animate-fade-in' : '';
    const centeredClass = centered ? 'centered' : '';
    
    return `${baseClasses} ${typeClass} ${sizeClass} ${fadeClass} ${centeredClass} ${className}`.trim();
  };

  // Estilos del contenedor
  const containerStyles = {
    display: centered ? 'flex' : 'inline-block',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column' as const,
    gap: '12px',
    ...style
  };

  // Renderizar spinner
  const renderSpinner = () => (
    <div 
      className="animate-spin"
      style={{
        width: sizes[size].width,
        height: sizes[size].height,
        border: `3px solid ${color}20`,
        borderTop: `3px solid ${color}`,
        borderRadius: '50%'
      }}
    />
  );

  // Renderizar dots
  const renderDots = () => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="animate-bounce"
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: color,
            borderRadius: '50%',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );

  // Renderizar pulse
  const renderPulse = () => (
    <div 
      className="animate-pulse"
      style={{
        width: sizes[size].width,
        height: sizes[size].height,
        backgroundColor: color,
        borderRadius: '50%',
        opacity: 0.7
      }}
    />
  );

  // Renderizar skeleton
  const renderSkeleton = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
      <div 
        className="animate-skeleton"
        style={{
          height: '12px',
          backgroundColor: color + '20',
          borderRadius: '4px',
          width: '100%'
        }}
      />
      <div 
        className="animate-skeleton"
        style={{
          height: '12px',
          backgroundColor: color + '20',
          borderRadius: '4px',
          width: '80%'
        }}
      />
      <div 
        className="animate-skeleton"
        style={{
          height: '12px',
          backgroundColor: color + '20',
          borderRadius: '4px',
          width: '60%'
        }}
      />
    </div>
  );

  // Renderizar progress
  const renderProgress = () => (
    <div style={{ width: '100%', maxWidth: '300px' }}>
      <div 
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: color + '20',
          borderRadius: '3px',
          overflow: 'hidden'
        }}
      >
        <div
          className="animate-progress"
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      {showPercentage && (
        <div 
          style={{
            textAlign: 'center',
            marginTop: '8px',
            fontSize: sizes[size].fontSize,
            color: color,
            fontWeight: '600'
          }}
        >
          {percentage}%
        </div>
      )}
    </div>
  );

  // Renderizar wave
  const renderWave = () => (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'end' }}>
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          style={{
            width: '4px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '2px',
            animation: 'wave 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );

  // Renderizar loader según tipo
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'skeleton':
        return renderSkeleton();
      case 'progress':
        return renderProgress();
      case 'wave':
        return renderWave();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={getClasses()} style={containerStyles}>
      {renderLoader()}
      {text && (
        <div 
          style={{
            fontSize: sizes[size].fontSize,
            color: color,
            fontWeight: '500',
            textAlign: 'center'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default AdvancedLoader;
