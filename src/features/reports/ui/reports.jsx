import React, { useState, useEffect } from 'react';
import {
  Card,
  Select,
  DatePicker,
  Button,
  ConfigProvider,
  theme,
  Spin,
  Alert,
  message,
  Modal,
} from 'antd';
import {
  FilePlus,
  DownloadSimple,
  XCircle,
  ArrowLeft,
  Warning,
} from '@phosphor-icons/react';
import dayjs from 'dayjs';
import {
  useDailyTherapistReport,
  usePatientsByTherapistReport,
  useDailyCashReport,
  useAppointmentsBetweenDatesReport,
} from '../hook/reportsHook';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import DailyTherapistReportPDF from '../../../components/PdfTemplates/DailyTherapistReportPDF';
import PatientsByTherapistReportPDF from '../../../components/PdfTemplates/PatientsByTherapistReportPDF';
import DailyCashReportPDF from '../../../components/PdfTemplates/DailyCashReportPDF';
import ExcelPreviewTable from '../../../components/PdfTemplates/ExcelPreviewTable';
import * as XLSX from 'xlsx';

const { Option } = Select;

const Reporte = () => {
  const [reportType, setReportType] = useState('diariaTerapeuta');
  const [date, setDate] = useState(dayjs());
  const [range, setRange] = useState(null);
  const {
    data: diariaData,
    loading: diariaLoading,
    error: diariaError,
    fetchReport: fetchDiaria,
  } = useDailyTherapistReport();
  const {
    data: pacientesData,
    loading: pacientesLoading,
    error: pacientesError,
    fetchReport: fetchPacientes,
  } = usePatientsByTherapistReport();
  const {
    data: cajaData,
    loading: cajaLoading,
    error: cajaError,
    fetchReport: fetchCaja,
  } = useDailyCashReport();
  const {
    data: rangoData,
    loading: rangoLoading,
    error: rangoError,
    fetchReport: fetchRango,
  } = useAppointmentsBetweenDatesReport();
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  const safeDate = date || dayjs();

  // Validar que la fecha no sea futura
  const validateDate = (selectedDate) => {
    if (!selectedDate) return false;
    return selectedDate.isAfter(dayjs(), 'day') ? false : true;
  };

  // Validar que el rango de fechas sea válido
  const validateDateRange = (dates) => {
    if (!dates || !dates[0] || !dates[1]) return false;
    if (dates[0].isAfter(dates[1], 'day')) return false;
    if (dates[0].isAfter(dayjs(), 'day')) return false;
    return true;
  };

  const handleGenerate = async () => {
    setGenerating(true);
    if (reportType === 'diariaTerapeuta') {
      await fetchDiaria(date);
      setShowPreview('diariaTerapeuta');
    } else if (reportType === 'pacientesTerapeuta') {
      await fetchPacientes(date);
      setShowPreview('pacientesTerapeuta');
    } else if (reportType === 'reporteCaja') {
      await fetchCaja(date);
      setShowPreview('reporteCaja');
    } else if (reportType === 'rangoCitas' && range && range[0] && range[1]) {
      await fetchRango(
        range[0].format('YYYY-MM-DD'),
        range[1].format('YYYY-MM-DD'),
      );
      setShowPreview('rangoCitas');
    }
    setGenerating(false);
  };

  const handleCancel = () => {
    setShowPreview(false);
    setReportType('diariaTerapeuta');
    setDate(dayjs());
    setRange(null);
  };

  const handleDownloadExcel = () => {
    if (!rangoData || !rangoData.appointments) return;
    const ws = XLSX.utils.json_to_sheet(rangoData.appointments);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Citas');
    XLSX.writeFile(
      wb,
      `Reporte_Rango_Citas_${range && range[0] ? range[0].format('YYYY-MM-DD') : ''}_${range && range[1] ? range[1].format('YYYY-MM-DD') : ''}.xlsx`,
    );
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
    setErrorDetails(null);
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
    } else if (
      reportType === 'reporteCaja' ||
      (reportType && reportType !== 'reporteCaja')
    ) {
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

  // Vista de previsualización PDF/Excel
  if (showPreview) {
    let loading = false,
      error = null,
      content = null,
      downloadBtn = null;
    if (showPreview === 'diariaTerapeuta') {
      loading = diariaLoading;
      error = diariaError;
      content = diariaData && (
        <PDFViewer
          width="100%"
          height="95%"
          style={{
            marginTop: 30,
            borderRadius: 14,
            width: '100%',
            height: '100%',
            minHeight: 500,
            maxHeight: 'calc(96vh - 180px)',
            margin: '0 auto',
            display: 'block',
          }}
        >
          <DailyTherapistReportPDF data={diariaData} date={safeDate} />
        </PDFViewer>
      );
      downloadBtn = null;
    } else if (showPreview === 'pacientesTerapeuta') {
      loading = pacientesLoading;
      error = pacientesError;
      content =
        pacientesData && pacientesData.length > 0 ? (
          <PDFViewer
            width="100%"
            height="95%"
            style={{
              borderRadius: 14,
              width: '100%',
              height: '95%',
              minHeight: 500,
              maxHeight: 'calc(96vh - 180px)',
              margin: '0 auto',
              display: 'block',
            }}
          >
            <PatientsByTherapistReportPDF
              data={pacientesData}
              date={safeDate}
            />
          </PDFViewer>
        ) : (
          <div
            style={{
              color: '#e74c3c',
              textAlign: 'center',
              marginTop: 60,
              fontSize: 22,
              fontWeight: 500,
              background: '#fff',
              borderRadius: 14,
              padding: 40,
            }}
          >
            Error: No se pudo generar el archivo porque no hay datos.
          </div>
        );
      downloadBtn = null;
    } else if (showPreview === 'reporteCaja') {
      loading = cajaLoading;
      error = cajaError;
      content =
        cajaData && Object.keys(cajaData).length > 0 ? (
          <PDFViewer
            width="100%"
            height="95%"
            style={{
              borderRadius: 14,
              width: '100%',
              height: '95%',
              minHeight: 500,
              maxHeight: 'calc(96vh - 180px)',
              margin: '0 auto',
              display: 'block',
            }}
          >
            <DailyCashReportPDF data={cajaData} date={safeDate} />
          </PDFViewer>
        ) : (
          <div
            style={{
              color: '#e74c3c',
              textAlign: 'center',
              marginTop: 60,
              fontSize: 22,
              fontWeight: 500,
              background: '#fff',
              borderRadius: 14,
            }}
          >
            No hay datos para mostrar en la fecha seleccionada.
          </div>
        );
      downloadBtn = null;
    } else if (showPreview === 'rangoCitas') {
      loading = rangoLoading;
      error = rangoError;
      content =
        rangoData &&
        rangoData.appointments &&
        rangoData.appointments.length > 0 ? (
          <ExcelPreviewTable data={rangoData} />
        ) : (
          <div
            style={{
              color: '#888',
              textAlign: 'center',
              marginTop: 60,
              fontSize: 22,
              fontWeight: 500,
              background: '#fff',
              borderRadius: 14,
              padding: 40,
            }}
          >
            No hay datos para mostrar
          </div>
        );
      downloadBtn = rangoData &&
        rangoData.appointments &&
        rangoData.appointments.length > 0 && (
          <Button
            type="primary"
            icon={<DownloadSimple size={22} weight="bold" />}
            style={{
              marginTop: 10,
              background: '#4CAF50',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              borderRadius: 8,
              height: 42,
              fontSize: 15,
            }}
            onClick={handleDownloadExcel}
          >
            Descargar Excel
          </Button>
        );
    }
    return (
      <div
        style={{
          width: '96vw',
          maxWidth: 1300,
          height: '94%',
          background: '#2a2a2a',
          borderRadius: 18,
          boxShadow: '0 4px 32px rgba(0,0,0,0.13)',
          padding: 32,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
          position: 'relative',
        }}
      >
        {/* Botones de acción en la parte superior, pegados a las esquinas */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
            padding: 18,
            pointerEvents: 'none',
          }}
        >
          {/* Botón volver */}
          <div style={{ pointerEvents: 'auto' }}>
            <Button
              type="text"
              icon={<ArrowLeft size={28} weight="bold" />}
              onClick={handleCancel}
              style={{
                color: '#fff',
                fontSize: 24,
                padding: 0,
                minWidth: 0,
                height: 42,
                width: 42,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}
            />
          </div>
          {/* Botón descargar Excel solo para Excel */}
          <div style={{ pointerEvents: 'auto' }}>
            {showPreview === 'rangoCitas' && downloadBtn}
          </div>
        </div>
        {/* Spinner de carga */}
        {(loading || generating) && (
          <div
            style={{ textAlign: 'center', margin: '40px 0', paddingTop: 56 }}
          >
            <Spin
              size="large"
              tip="Generando reporte..."
              style={{ color: '#7ed957' }}
            />
          </div>
        )}
        {error && (
          <Alert
            message="Error al generar el reporte"
            description={error.message || 'Intenta nuevamente.'}
            type="error"
            showIcon
            style={{ marginBottom: 24, paddingTop: 56 }}
          />
        )}
        {/* Contenido con espacio para no tapar los botones */}
        <div
          style={{
            paddingTop: 45,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {!loading && !generating && !error && content}
        </div>
      </div>
    );
  }

  // Vista de selección de reportes
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
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
            optionSelectedBg: '#00AA55',
          },
          DatePicker: {
            colorTextPlaceholder: '#AAAAAA',
            colorBgContainer: '#333333',
            colorText: '#FFFFFF',
            colorBorder: '#444444',
            borderRadius: 4,
            hoverBorderColor: '#555555',
            activeBorderColor: '#00AA55',
            colorIcon: '#FFFFFF',
            colorIconHover: '#00AA55',
            colorBgElevated: '#121212',
            colorPrimary: '#00AA55',
            colorTextDisabled: '#333333',
            colorTextHeading: '#FFFFFF',
            cellHoverBg: '#00AA55',
            colorSplit: '#444444',
          },
          Modal: {
            colorBgElevated: '#1f1f1f',
            colorText: '#fff',
            borderRadius: 12,
          },
          Message: {
            colorBgElevated: '#1f1f1f',
            colorText: '#fff',
            borderRadius: 8,
          },
        },
      }}
    >
      <div style={{ width: 400, margin: 'auto', backgroundColor: '#121212' }}>
        <Card
          style={{
            textAlign: 'center',
            borderRadius: 12,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <h2
            style={{
              color: 'white',
              fontSize: '25px',
              paddingBottom: '10px',
              marginBottom: 24,
              fontWeight: 600,
            }}
          >
            Generador de Reportes
          </h2>

          <Select
            placeholder="Seleccione un tipo de reporte"
            style={{
              width: '100%',
              marginBottom: 16,
              borderRadius: 8,
            }}
            onChange={(value) => {
              setReportType(value);
              setDate(dayjs());
              setRange(null);
            }}
            value={reportType}
          >
            <Option value="diariaTerapeuta">Atención Diaria x Terapeuta</Option>
            <Option value="pacientesTerapeuta">
              Reporte de pacientes por Terapeutas
            </Option>
            <Option value="reporteCaja">Reporte Caja</Option>
            <Option value="rangoCitas">Reporte Rango de citas</Option>
          </Select>

          {renderDateInputs()}

          {reportType && (
            <Button
              type="primary"
              icon={<FilePlus size={20} weight="bold" />}
              onClick={handleGenerate}
              block
              loading={generating}
              style={{
                height: 42,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 8,
                transition: 'all 0.3s ease',
              }}
            >
              {generating ? 'Generando...' : 'Generar Reporte'}
            </Button>
          )}

          {reportType === 'reporteCaja' && (
            <Button
              type="default"
              style={{
                marginTop: 10,
                height: 42,
                fontSize: 15,
                fontWeight: 600,
                borderRadius: 8,
                borderColor: '#7ed957',
                color: '#7ed957',
                transition: 'all 0.3s ease',
              }}
              onClick={() => message.info('Función en desarrollo')}
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
