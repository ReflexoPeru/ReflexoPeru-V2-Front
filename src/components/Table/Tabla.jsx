import { useState, useLayoutEffect, useRef } from 'react';
import { Table, Button, Space, ConfigProvider, Spin } from 'antd';
import estilos from './Tabla.module.css';
import ModeloPagination from './Pagination/Pagination.jsx';
import { Package } from '@phosphor-icons/react';


const ModeloTable = ({ columns, data, customActions, loading = false, pagination }) => {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [pageSize, setPageSize] = useState(100);
  const currentPage = pagination?.current || 1;
  const pageSize = pagination?.pageSize || 100;
  const onPageChange = pagination?.onChange || (() => {});
  

  const [tableHeight, setTableHeight] = useState('100%');
  const containerRef = useRef(null);
  const paginationRef = useRef(null);

  // const handlePageChange = (page, size) => {
  //   setCurrentPage(page);
  //   setPageSize(size);
  // };

    useLayoutEffect(() => {
    function debounce(func, wait) {
      let timeout;
      function debounced(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
      }
      debounced.cancel = () => clearTimeout(timeout);
      return debounced;
    }

    const debouncedCalculate = debounce(() => {
      if (!containerRef.current || !paginationRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const paginationRect = paginationRef.current.getBoundingClientRect();

      // Calcula el espacio disponible real
      const availableHeight = window.innerHeight - containerRect.top - paginationRect.height - 40; // 40px de margen

      // Limita entre 30% y 80% del viewport
      const minHeight = window.innerHeight * 0.3;
      const maxHeight = window.innerHeight * 0.6;

      const newHeight = Math.max(
        minHeight,
        Math.min(availableHeight, maxHeight)
      );

      setTableHeight(newHeight);
    }, 100);

    debouncedCalculate();
    window.addEventListener('resize', debouncedCalculate);

    return () => {
      window.removeEventListener('resize', debouncedCalculate);
      debouncedCalculate.cancel && debouncedCalculate.cancel();
    };
  }, [containerRef, paginationRef]);


  const columnaArreglada = columns.map((col, index, arr) => {
    const NombreColumn = col.key === 'nombre' || col.dataIndex === 'nombre';
    const FechaCitaColumn =
      col.key === 'fechaCita' || col.dataIndex === 'fechaCita';
    const SalaColumn = col.key === 'sala' || col.dataIndex === 'sala';
    const TicketColumn = col.key === 'ticket' || col.dataIndex === 'ticket';
    const MetodoColumn =
      col.key === 'methodPago' || col.dataIndex === 'methodPago';
    const isLast = index === arr.length - 1;

    const baseColumn = {
      ...col,
      align: NombreColumn ? 'left' : 'center',
      title: <div style={{ textAlign: 'center' }}>{col.title}</div>,
      //width: '65px',
      onCell: () => ({
        style: {
          textAlign: NombreColumn ? 'left' : 'center',
          background: 'inherit',
          borderRight: isLast ? 'none' : '1px solid #444',
          borderBottom: 'none',
        },
      }),
      onHeaderCell: () => ({
        style: {
          textAlign: 'center',
          borderRight: isLast ? 'none' : '1px solid #444',
          background: '#272727',
          borderBottom: 'none',
          color: '#fff',
        },
      }),
    };

    return baseColumn;
  });

  const actionColumn = {
    title: <div style={{ textAlign: 'center' }}>Acciones</div>,
    key: 'acciones',
    width: '400px',
    fixed: 'right',
    render: (record) => {
      if (customActions) {
        return customActions(record);
      }

      return (
        <Space size="small">
          <Button style={{ backgroundColor: '#555555' }}>Editar</Button>
          <Button style={{ backgroundColor: '#0066FF' }}>Imprimir</Button>
          <Button style={{ backgroundColor: '#69276F' }}>Boleta</Button>
          <Button style={{ backgroundColor: '#00AA55' }}>Historia</Button>
          <Button style={{ backgroundColor: '#FF3333' }}>Eliminar</Button>
        </Space>
      );
    },
    onCell: () => ({
      style: {
        background: 'inherit',
        border: 'none',
        borderBottom: 'none',
        borderLeft: '1px solid #444',
        textAlign: 'center',
      },
    }),
    onHeaderCell: () => ({
      style: {
        textAlign: 'center',
        borderRight: 'none',
        borderBottom: 'none',
        borderLeft: '1px solid #444',
        backgroundColor: '#272727',
      },
    }),
  };

  // const paginationData = data.slice(
  //   (currentPage - 1) * pageSize,
  //   currentPage * pageSize,
  // );

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
            cellFontFamily: 'Arial, Helvetica, sans-serif',
          },
          Button: {
            defaultBorderColor: 'none',
            defaultColor: '#ffffff',
            defaultHoverColor: '#ffffff',
            defaultHoverBorderColor: '#ffffff',
            defaultActiveBorderColor: '#ffffff',
            defaultActiveColor: '#ffffff',
          },
        },
      }}
      renderEmpty={() => {
        if (loading) return <div style={{ display: 'none' }}></div>;
        return (
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
        );
      }}
    >
      <div
        ref={containerRef}
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          justifyContent: 'center',
          marginTop: '15px',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <Table
            style={{ maxHeight: 'none' }}
            columns={[...columnaArreglada, actionColumn]}
            dataSource={data}
            rowKey="id"
            pagination={false}
            scroll={{ y: tableHeight }}
            rowClassName={(__, index) =>
              index % 2 === 0 ? estilos.zebraRow : ''
            }
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
          />
        </div>
        <div ref={paginationRef}>
          <ModeloPagination
            total={pagination?.total}
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
