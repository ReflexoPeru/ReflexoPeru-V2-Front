import React, { useState, useEffect } from 'react';
import { ConfigProvider, DatePicker, Button, theme } from 'antd';
import ReportSelector from './ReportSelector';
import ReportPreview from './ReportPreview';
import styles from './reports.module.css';
import dayjs from 'dayjs';
import {
  useDailyTherapistReport,
  usePatientsByTherapistReport,
  useDailyCashReport,
  useAppointmentsBetweenDatesReport,
} from '../hook/reportsHook';
import { PDFViewer } from '@react-pdf/renderer';
import DailyTherapistReportPDF from '../../../components/PdfTemplates/DailyTherapistReportPDF';
import PatientsByTherapistReportPDF from '../../../components/PdfTemplates/PatientsByTherapistReportPDF';
import DailyCashReportPDF from '../../../components/PdfTemplates/DailyCashReportPDF';
import ExcelPreviewTable from '../../../components/PdfTemplates/ExcelPreviewTable';
import ExcelJS from 'exceljs';

const Reporte = () => {
  const [reportType, setReportType] = useState('diariaTerapeuta');
  const [date, setDate] = useState(dayjs());
  const [range, setRange] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [excelPagination, setExcelPagination] = useState({
    current: 1,
    pageSize: 20,
  });

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

  const safeDate = date || dayjs();

  // Resetear paginación cuando cambian los datos de rango
  useEffect(() => {
    setExcelPagination((prev) => ({ current: 1, pageSize: prev.pageSize }));
  }, [rangoData]);

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

  // Renderiza los inputs de fecha según el tipo de reporte
  const renderDateInputs = () => {
    if (reportType === 'rangoCitas') {
      return (
        <DatePicker.RangePicker
          style={{ width: '100%', marginBottom: 16 }}
          format="DD-MM-YYYY"
          onChange={(dates) => setRange(dates)}
        />
      );
    } else {
      return (
        <DatePicker
          style={{ width: '100%', marginBottom: 16 }}
          format="DD-MM-YYYY"
          defaultValue={dayjs()}
          onChange={(date) => setDate(date)}
        />
      );
    }
  };

  // Nueva función para exportar a Excel usando exceljs
  const exportToExcel = async (data, fileName = 'Reporte_Rango_Citas.xlsx') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Citas');
    worksheet.columns = [
      { header: 'ID Paciente', key: 'patient_id', width: 12 },
      { header: 'Documento', key: 'document_number', width: 15 },
      { header: 'Nombre Completo', key: 'full_name', width: 30 },
      { header: 'Teléfono', key: 'primary_phone', width: 15 },
      { header: 'Fecha', key: 'appointment_date', width: 12 },
      { header: 'Hora', key: 'appointment_hour', width: 10 },
    ];
    data.forEach((item) => {
      worksheet.addRow({
        patient_id: item.patient_id,
        document_number: item.document_number,
        full_name: `${item.name} ${item.paternal_lastname} ${item.maternal_lastname}`,
        primary_phone: item.primary_phone,
        appointment_date: item.appointment_date,
        appointment_hour: item.appointment_hour,
      });
    });
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Lógica para la previsualización y descarga
  let loading = false,
    error = null,
    content = null,
    downloadBtn = null;
  if (showPreview) {
    if (showPreview === 'diariaTerapeuta') {
      loading = diariaLoading;
      error = diariaError;
      content = diariaData && (
        <PDFViewer
          width="100%"
          height="95%"
          style={{
            minHeight: 500,
            maxHeight: 'calc(96vh - 180px)',
            margin: '0 auto',
            display: 'block',
            borderRadius: 14,
          }}
        >
          <DailyTherapistReportPDF data={diariaData} date={safeDate} />
        </PDFViewer>
      );
    } else if (showPreview === 'pacientesTerapeuta') {
      loading = pacientesLoading;
      error = pacientesError;
      content =
        pacientesData && pacientesData.length > 0 ? (
          <PDFViewer
            width="100%"
            height="95%"
            style={{
              minHeight: 500,
              maxHeight: 'calc(96vh - 180px)',
              margin: '0 auto',
              display: 'block',
              borderRadius: 14,
            }}
          >
            <PatientsByTherapistReportPDF
              data={pacientesData}
              date={safeDate}
            />
          </PDFViewer>
        ) : (
          <div className={styles.errorMsg}>
            Error: No se pudo generar el archivo porque no hay datos.
          </div>
        );
    } else if (showPreview === 'reporteCaja') {
      loading = cajaLoading;
      error = cajaError;
      content =
        cajaData && Object.keys(cajaData).length > 0 ? (
          <PDFViewer
            width="100%"
            height="95%"
            style={{
              minHeight: 500,
              maxHeight: 'calc(96vh - 180px)',
              margin: '0 auto',
              display: 'block',
              borderRadius: 14,
            }}
          >
            <DailyCashReportPDF data={cajaData} date={safeDate} />
          </PDFViewer>
        ) : (
          <div className={styles.errorMsg}>
            No hay datos para mostrar en la fecha seleccionada.
          </div>
        );
    } else if (showPreview === 'rangoCitas') {
      loading = rangoLoading;
      error = rangoError;
      content =
        rangoData &&
        rangoData.appointments &&
        rangoData.appointments.length > 0 ? (
          <ExcelPreviewTable
            data={rangoData}
            pagination={excelPagination}
            onPaginationChange={setExcelPagination}
          />
        ) : (
          <div className={styles.noDataMsg}>No hay datos para mostrar</div>
        );
      if (
        rangoData &&
        rangoData.appointments &&
        rangoData.appointments.length > 0
      ) {
        downloadBtn = (
          <Button
            type="primary"
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
            onClick={() =>
              exportToExcel(
                rangoData.appointments,
                `Reporte_Rango_Citas_${range && range[0] ? range[0].format('YYYY-MM-DD') : ''}_${range && range[1] ? range[1].format('YYYY-MM-DD') : ''}.xlsx`,
              )
            }
          >
            Descargar Excel
          </Button>
        );
      }
    }
  }

  const themeConfig = {
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
  };

  if (showPreview) {
    if (showPreview === 'rangoCitas') {
      return (
        <ReportPreview
          showPreview={showPreview}
          loading={loading}
          generating={generating}
          error={error}
          content={content}
          downloadBtn={downloadBtn}
          handleCancel={handleCancel}
        />
      );
    } else {
      return (
        <ConfigProvider theme={themeConfig}>
          <ReportPreview
            showPreview={showPreview}
            loading={loading}
            generating={generating}
            error={error}
            content={content}
            downloadBtn={downloadBtn}
            handleCancel={handleCancel}
          />
        </ConfigProvider>
      );
    }
  }

  return (
    <ConfigProvider theme={themeConfig}>
      <ReportSelector
        reportType={reportType}
        setReportType={setReportType}
        date={date}
        setDate={setDate}
        range={range}
        setRange={setRange}
        generating={generating}
        handleGenerate={handleGenerate}
        renderDateInputs={renderDateInputs}
      />
    </ConfigProvider>
  );
};

export default Reporte;
