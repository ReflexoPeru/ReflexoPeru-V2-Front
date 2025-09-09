import { useState, useEffect, useRef } from 'react';
import { Table, ConfigProvider, Spin } from 'antd';
import estilos from './Tabla.module.css';
import ModeloPagination from './Pagination/Pagination.jsx';
import EmptyState from '../Empty/EmptyState';
import ConsistentSpinner from '../Loading/ConsistentSpinner';

const ModeloTable = ({
  columns,
  data,
  loading = false,
  pagination = {},
  maxHeight = '60vh',
}) => {
  const currentPage = pagination?.current || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = pagination?.total || data?.length || 0;
  const onPageChange = pagination?.onChange || (() => {});

  const containerRef = useRef(null);
  const [tableHeight, setTableHeight] = useState('auto');

  // Transformar columnas para centrar contenido
  const centeredColumns = columns.map((column, index, arr) => {
    const isLast = index === arr.length - 1;

    return {
      ...column,
      align: 'center',
      onCell: () => ({
        style: {
          textAlign: 'center',
          background: 'inherit',
          borderRight: isLast ? 'none' : '1px solid #444', // Línea vertical derecha
          borderBottom: 'none',
        },
      }),
      onHeaderCell: () => ({
        style: {
          textAlign: 'center',
          background: '#3b3b3b',
          borderRight: isLast ? 'none' : '1px solid #444', // Línea vertical derecha en header
          borderBottom: 'none',
          color: '#fff',
        },
      }),
    };
  });

  //Calculo simplificado de altura
  useEffect(() => {
    // Si maxHeight es "auto", no calculamos altura fija
    if (maxHeight === 'auto') {
      setTableHeight('auto');
      return;
    }

    const calculateHeight = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceFromTop = containerRect.top;
      const marginBottom = 32; // Margen para paginación y espacio respiro

      // Altura calculada con límite máximo
      const calculatedHeight = windowHeight - spaceFromTop - marginBottom;

      // Aplicamos el mínimo entre la altura calculada y el máximo especificado
      const finalHeight =
        typeof maxHeight === 'string' && maxHeight.endsWith('vh')
          ? Math.min(
              calculatedHeight,
              (windowHeight * parseInt(maxHeight)) / 100,
            )
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
        components: {
          Table: {
            colorBgContainer: '#1e1e1e',
            colorFillAlter: '#2c2c2c',
            colorText: '#ffffff',
            borderColor: '#444',
            headerBg: '#272727',
            headerColor: '#ffffff',
            headerBorderRadius: 8,
            headerSplitColor: 'none',
            rowHoverBg: '#333',
            cellFontSize: 12,
            cellPaddingBlock: 12,
            cellPaddingInline: 16,
            cellFontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", sans-serif',
          },
        },
      }}
       renderEmpty={() => (
         <EmptyState
           icon="package"
           title="No hay datos disponibles"
           description="Los datos aparecerán aquí cuando estén disponibles"
           style={{
             margin: '16px',
             minHeight: '200px'
           }}
         />
       )}
    >
      <div
        ref={containerRef}
        style={{
          minHeight: maxHeight === 'auto' ? 'auto' : '300px',
          marginTop: '15px',
        }}
      >
        <div
          style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Table
            className={`${estilos.tableCustom} ${maxHeight === 'auto' ? estilos.noScroll : ''}`}
            columns={centeredColumns}
            dataSource={data}
            rowKey="id"
            pagination={false}
            scroll={maxHeight === 'auto' ? { x: 'max-content' } : { 
              y: tableHeight, 
              x: 'max-content' 
            }}
            rowClassName={(__, index) =>
              index % 2 === 0 ? estilos.zebraRow : ''
            }
            loading={{
              spinning: loading,
              indicator: (
                <ConsistentSpinner
                  size="large"
                  tip="Cargando datos..."
                />
              ),
            }}
          />
        </div>
        <div>
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
