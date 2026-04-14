import { useState, useEffect, useRef } from 'react';
import { Table, ConfigProvider, theme } from 'antd';
import estilos from './Tabla.module.css';
import ModeloPagination from './Pagination/Pagination.jsx';
import EmptyState from '../Empty/EmptyState';
import ConsistentSpinner from '../Loading/ConsistentSpinner';
import { useTheme } from '../../context/ThemeContext';

const ModeloTable = ({
  columns,
  data,
  loading = false,
  pagination = {},
  maxHeight = '65vh',
}) => {
  const { isDarkMode } = useTheme();
  const currentPage = pagination?.current || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = pagination?.total || data?.length || 0;
  const onPageChange = pagination?.onChange || (() => {});

  const containerRef = useRef(null);
  const [tableHeight, setTableHeight] = useState('auto');

  // Transformar columnas
  const centeredColumns = columns.map((column, index, arr) => {
    const isLast = index === arr.length - 1;

    return {
      ...column,
      align: 'center',
      onCell: () => ({
        style: {
          textAlign: 'center',
          background: 'inherit',
          borderRight: isLast || isDarkMode ? 'none' : '1px solid #f0f0f0',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #f0f0f0',
        },
      }),
      onHeaderCell: () => ({
        style: {
          textAlign: 'center',
          backgroundColor: isDarkMode ? 'rgba(26, 46, 35, 0.8)' : 'rgba(209, 250, 229, 0.6)', // Película verde transparente
          backdropFilter: 'blur(8px)',
          color: isDarkMode ? '#86efac' : '#065f46',
          borderRight: isLast ? 'none' : '1px solid rgba(0,0,0,0.05)',
          borderBottom: `2px solid ${isDarkMode ? 'rgba(134, 239, 172, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          fontSize: '11px',
          fontWeight: '700',
          padding: '14px 8px',
        },
      }),
    };
  });

  useEffect(() => {
    if (maxHeight === 'auto') {
      setTableHeight('auto');
      return;
    }

    const    calculateHeight = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceFromTop = containerRect.top;
      const marginBottom = 48; // Espacio ajustado para paginación y sombra inferior

      const calculatedHeight = windowHeight - spaceFromTop - marginBottom;
      const finalHeight =
        typeof maxHeight === 'string' && maxHeight.endsWith('vh')
          ? Math.min(calculatedHeight, (windowHeight * parseInt(maxHeight)) / 103)
          : Math.min(calculatedHeight, maxHeight);

      setTableHeight(`${finalHeight}px`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [maxHeight]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          borderRadius: 12,
          fontFamily: "'Inter', sans-serif",
          colorBgContainer: isDarkMode ? '#1a1a1a' : '#ffffff',
        },
        components: {
          Table: {
            headerBg: isDarkMode ? 'rgba(26, 46, 35, 0.8)' : 'rgba(209, 250, 229, 0.6)',
            headerColor: isDarkMode ? '#86efac' : '#065f46',
            headerBorderRadius: 10,
            rowHoverBg: isDarkMode ? '#2d2d2d' : '#f1f5f9',
            cellFontSize: 13,
            cellPaddingBlock: 8,
            headerSplitColor: 'rgba(0,0,0,0.05)',
          },
        },
      }}
       renderEmpty={() => (
         <EmptyState
           icon="package"
           title="No hay datos disponibles"
           description="Los datos aparecerán aquí cuando estén disponibles"
           style={{ margin: '16px', minHeight: '200px' }}
         />
       )}
    >
      <div
        ref={containerRef}
        style={{
          minHeight: maxHeight === 'auto' ? 'auto' : '200px',
          marginTop: '8px',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          borderRadius: '16px',
          padding: '2px 4px',
          boxShadow: isDarkMode 
            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
          border: isDarkMode ? '1px solid #333' : 'none',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          <Table
            className={`${estilos.tableCustom} ${maxHeight === 'auto' ? estilos.noScroll : ''}`}
            columns={centeredColumns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            scroll={maxHeight === 'auto' ? { x: 'max-content' } : { y: tableHeight, x: 'max-content' }}
            loading={{
              spinning: loading,
              indicator: <ConsistentSpinner size="large" tip="Cargando datos..." />,
            }}
          />
        </div>
        <div style={{ marginTop: '8px', padding: '0 8px' }}>
          <ModeloPagination
            total={total}
            current={currentPage}
            pageSize={pageSize}
            onChange={onPageChange}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ModeloTable;