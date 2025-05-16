import { useState, useLayoutEffect, useRef } from 'react';
import { Table, Button, Space, ConfigProvider } from 'antd';
import estilos from './Tabla.module.css';
import ModeloPagination from './Pagination/Pagination.jsx';

const ModeloTable = ({ columns, data, customActions }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [tableHeight, setTableHeight] = useState(0);
  const containerRef = useRef(null);
  const paginationRef = useRef(null);

  const handlePageChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  useLayoutEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current && paginationRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const paginationHeight = paginationRef.current.clientHeight;
        const newHeight = containerHeight - paginationHeight - 64;
        setTableHeight(newHeight);
      }
    };

    calculateHeight();
    window.addEventListener('resize', calculateHeight);

    return () => {
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

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

  const paginationData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
            columns={[...columnaArreglada, actionColumn]}
            dataSource={paginationData}
            rowKey="id"
            pagination={false}
            scroll={{ y: tableHeight }}
            rowClassName={(__, index) =>
              index % 2 === 0 ? estilos.zebraRow : ''
            }
          />
        </div>
        <div ref={paginationRef}>
          <ModeloPagination
            total={data.length}
            current={currentPage}
            pageSize={pageSize}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ModeloTable;
