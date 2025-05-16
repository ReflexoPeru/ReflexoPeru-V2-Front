import React, { useState } from 'react';
import { Card, Select, DatePicker, Button, ConfigProvider, theme } from 'antd';
import { FilePlus } from '@phosphor-icons/react';
import dayjs from 'dayjs';

const { Option } = Select;

const Reporte = () => {
  const [reportType, setReportType] = useState("diariaTerapeuta"); 
  const [date, setDate] = useState(dayjs()); 
  const [range, setRange] = useState(null);

  const handleGenerate = () => {
    console.log('Tipo:', reportType);
    if (reportType === 'rangoCitas') {
      console.log('Rango:', range);
    } else {
      console.log('Fecha:', date);
    }
  };

  const renderDateInputs = () => {
    if (reportType === 'rangoCitas') {
      return (
        <DatePicker.RangePicker
          style={{ width: '100%', marginBottom: 16 }}
          format="DD-MM-YYYY"
          onChange={(dates) => setRange(dates)}
        />
      );
    } else if (reportType && reportType !== 'reporteCaja') {
      return (
        <DatePicker
          style={{ width: '100%', marginBottom: 16 }}
          format="DD-MM-YYYY"
          defaultValue={dayjs()}
          onChange={(date) => setDate(date)}
        />
      );
    }
    return null;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components:{
            Button: {
              colorPrimary: '#00AA55',
              colorTextLightSolid: '#ffffff',
              colorPrimaryHover: '#00cc6a',
              colorPrimaryActive: '#ffffff',
            },
            Select: {
              colorPrimary: '#00AA55',
              colorBgContainer: '#1f1f1f',
              colorText: '#ffffff',
              colorBorder: '#ffffff',
              controlOutline: '#00AA55',
              colorPrimaryHover: '#00cc6a',
              optionSelectedBg:'#00AA55',
            },
            DatePicker: {
              colorTextPlaceholder: "#AAAAAA",
                    colorBgContainer: "#333333",
                    colorText: "#FFFFFF",
                    colorBorder: "#444444",
                    borderRadius: 4,
                    hoverBorderColor: "#555555",
                    activeBorderColor: "#00AA55",
                    colorIcon: "#FFFFFF",
                    colorIconHover:'#00AA55',
                    colorBgElevated: '#121212',
                    colorPrimary: '#00AA55',
                    colorTextDisabled: '#333333',
                    colorTextHeading:'#FFFFFF',
                    cellHoverBg:'#00AA55',
                    colorSplit:'#444444',
            },
          }
      }}
    >
      <div style={{ width: 400, margin: 'auto', backgroundColor:'#121212'}}>
        <Card style={{ textAlign: 'center' }}>
          <h2 style={{ color: 'white', fontSize:'25px', paddingBottom:'10px' }}>Generador de Reportes</h2>

          <Select
            placeholder="Seleccione un tipo de reporte"
            style={{ width: '100%', marginBottom: 16 }}
            onChange={(value) => {
              setReportType(value);
              setDate(null);
              setRange(null);
            }}
            value={reportType}
          >
            <Option value="diariaTerapeuta">Atencion Diaria x Terapeuta</Option>
            <Option value="pacientesTerapeuta">Reporte de pacientes por Terapeutas</Option>
            <Option value="reporteCaja">Reporte Caja</Option>
            <Option value="rangoCitas">Reporte Rango de citas</Option>
          </Select>

          {renderDateInputs()}

          {reportType && (
            <Button
              type="primary"
              icon={<FilePlus />}
              onClick={handleGenerate}
              block
            >
              Generar
            </Button>
          )}

          {reportType === 'reporteCaja' && (
            <Button
              type="default"
              style={{ marginTop: 10 }}
              onClick={() => console.log('Editar reporte')}
              block
            >
              Editar reporte
            </Button>
          )}
        </Card>
      </div>
    </ConfigProvider>
  );
};

export default Reporte;
