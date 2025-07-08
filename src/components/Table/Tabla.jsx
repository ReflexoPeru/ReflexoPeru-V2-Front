import { Package } from '@phosphor-icons/react';
import { ConfigProvider, Spin, Table } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { themeTokensDark, themeTokensLight, useTheme } from '../../context/ThemeContext';
import ModeloPagination from './Pagination/Pagination.jsx';
import estilos from './Tabla.module.css';


const ModeloTable = ({ 
  columns, 
  data, 
  loading = false, 
  pagination = {} ,
  maxHeight = '60vh',
}) => {
  const currentPage = pagination?.current || 1;
  const pageSize = pagination?.pageSize || 10;
  const total = pagination?.total || data?.length || 0;
  const onPageChange = pagination?.onChange || (() => {});

  const containerRef = useRef(null);
  const [tableHeight, setTableHeight] = useState('auto');
  const { theme } = useTheme();
  const themeConfig = theme === 'dark'
    ? themeTokensDark
    : {
        ...themeTokensLight,
        token: {
          ...themeTokensLight.token,
          colorBgContainer: '#fff',
          colorText: '#1A1A1A',
          colorBorder: '#000',
          colorFillAlter: '#FAFAFA',
          headerBg: '#232323',
          headerColor: '#fff',
          rowHoverBg: '#C8F7D8',
        },
        components: {
          Table: {
            colorBgContainer: '#fff',
            colorFillAlter: '#FAFAFA',
            colorText: '#1A1A1A',
            borderColor: '#000',
            headerBg: '#232323',
            headerColor: '#fff',
            rowHoverBg: '#C8F7D8',
          },
        },
      };

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
        background: '#272727',
        borderRight: isLast ? 'none' : '1px solid #444', // Línea vertical derecha en header
        borderBottom: 'none',
        color: '#fff',
      },
    }),
  };
});

  //Calculo simplificado de altura
  useEffect(() => {
    const calculateHeight = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const spaceFromTop = containerRect.top;
      const marginBottom = 32; // Margen para paginación y espacio respiro
      
      // Altura calculada con límite máximo
      const calculatedHeight = windowHeight - spaceFromTop - marginBottom;
      
      // Aplicamos el mínimo entre la altura calculada y el máximo especificado
      const finalHeight = typeof maxHeight === 'string' && maxHeight.endsWith('vh') 
        ? Math.min(calculatedHeight, (windowHeight * parseInt(maxHeight)) / 100)
        : Math.min(calculatedHeight, maxHeight);
      
      setTableHeight(`${finalHeight}px`);
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);
    return () => window.removeEventListener('resize', calculateHeight);
  }, [maxHeight]);


  return (
    <ConfigProvider theme={themeConfig}
      renderEmpty={() => {
        <div style={{ 
          color: '#a0a0a0', 
          padding: '16px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <Package size={40} />
          <span>No hay datos disponibles</span>
        </div>
      }}
    >
      <div
        ref={containerRef}
        style={{
          minHeight: '300px',
          marginTop: '15px',
        }}
      >
        <div style={{ 
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            
          }}>
            <Table
              className={estilos.tableCustom}
              columns={centeredColumns}
              dataSource={data}
              rowKey="id"
              pagination={false}
              scroll={{ y: tableHeight, x: 'max-content' }}
              rowClassName={(record, index) => index % 2 === 0 ? 'row-light' : 'row-dark'}
              loading={{
                spinning: loading,
                indicator: (
                  <Spin 
                    size="large" 
                    style={{ color: '#ffffff' }} // Texto blanco
                    tip="Cargando..."
                  />
                )
              }}
              className="custom-table"
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
