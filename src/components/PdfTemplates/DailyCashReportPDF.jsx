import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';
const defaultClinicName = 'Reflexo Perú';
const LOGO_URL = '/MiniLogoReflexo.png';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  // Cabecera
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4CAF50',
    borderStyle: 'solid',
  },
  headerTitles: {
    marginLeft: 15,
  },
  clinicName: {
    color: '#2d5a3d',
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
  },
  reportTitle: {
    color: '#444',
    fontSize: 12,
  },
  headerInfo: {
    marginLeft: 'auto',
    textAlign: 'right',
  },
  infoText: {
    fontSize: 8,
    color: '#555',
    marginBottom: 2,
  },
  // Sección de Resumen
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    border: `1px solid #e0e0e0`,
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#555',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    color: '#2d5a3d',
    fontFamily: 'Helvetica-Bold',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: '#95e472',
    marginVertical: 15,
  },
  // Estilos de la tabla principal
  table: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#2d5a3d',
    borderStyle: 'solid',
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#2d5a3d', // Verde oscuro
    height: 35,
  },
  headerCell: {
    color: '#fff',
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#fff',
    borderRightStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    height: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
  },
  tableCell: {
    fontSize: 9,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    borderRightStyle: 'solid',
    display: 'flex',
    alignItems: 'center',
  },
  // Anchos específicos de columnas
  colFecha: {
    width: '25%',
  },
  colNoPac: {
    width: '12%',
    textAlign: 'center',
  },
  colSubTotal: {
    width: '12%',
    textAlign: 'center',
  },
  colEgresos: {
    width: '15%',
    textAlign: 'center',
  },
  colEfectivo: {
    width: '15%',
    textAlign: 'center',
  },
  colObservaciones: {
    width: '21%',
    textAlign: 'center',
  },
  // Estilos para filas específicas
  dataRow: {
    fontFamily: 'Helvetica-Bold',
  },
  emptyRow: {
    backgroundColor: '#f8f9fa',
  },
  totalRow: {
    backgroundColor: '#e8f5e8',
    fontFamily: 'Helvetica-Bold',
    borderTopWidth: 2,
    borderTopColor: '#2d5a3d',
    borderTopStyle: 'solid',
  },
  sectionSeparator: {
    height: 20,
    backgroundColor: '#f0f0f0',
  },
  // Pie de página del documento
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#999',
    borderTop: `1px solid #e0e0e0`,
    paddingTop: 8,
  },
});

const DailyCashReportPDF = ({
  data,
  date,
  logoUrl,
  companyInfo,
  isEdited = false,
}) => {
  // Manejar la nueva estructura de datos del backend y agrupar por categorías
  const processData = (rawData) => {
    if (!rawData) return { 
      cuponSinCosto: { countAppointment: 0, total: 0 },
      efectivoRows: [], 
      yapeRows: [], 
      totalEfectivo: 0, 
      totalYape: 0, 
      totalGeneral: 0, 
      totalCitas: 0 
    };
    
    let paymentData = {};
    
    // Si viene con la estructura antigua (Object.values) o nueva estructura
    if (rawData && typeof rawData === 'object') {
      if (rawData.report && Array.isArray(rawData.report)) {
        // Nueva estructura
        if (rawData.report.length > 0) {
          paymentData = rawData.report.reduce((acc, item) => {
            acc[item.name] = item;
            return acc;
          }, {});
        } else if (rawData.debug && rawData.debug.sample_appointments) {
          // Si report está vacío pero hay datos en debug.sample_appointments
          const appointments = rawData.debug.sample_appointments;
          appointments.forEach(appointment => {
            const paymentType = appointment.payment_type_id || 'SIN_PAGO';
            if (!paymentData[paymentType]) {
              paymentData[paymentType] = {
                name: paymentType,
                countAppointment: 0,
                payment: 0,
                total: 0
              };
            }
            paymentData[paymentType].countAppointment += 1;
            paymentData[paymentType].payment = parseFloat(appointment.payment || 0);
            paymentData[paymentType].total += parseFloat(appointment.payment || 0);
          });
        }
      } else {
        // Estructura antigua (Object.values)
        paymentData = rawData;
      }
    }
    
    // Procesar los datos agrupados por categorías
    const cuponSinCosto = { countAppointment: 0, total: 0 };
    const efectivoRows = [];
    const yapeRows = [];
    
    Object.values(paymentData).forEach(item => {
      const name = item.name || '';
      
      if (name.includes('CUPÓN SIN COSTO') || name.includes('SIN COSTO')) {
        cuponSinCosto.countAppointment += item.countAppointment || 0;
        cuponSinCosto.total += item.total || 0;
      } else if (name.includes('EFECTIVO')) {
        efectivoRows.push(item);
      } else if (name.includes('YAPE')) {
        yapeRows.push(item);
      }
    });
    
    // Calcular totales
    const totalEfectivo = efectivoRows.reduce((acc, row) => acc + (row.total || 0), 0);
    const totalYape = yapeRows.reduce((acc, row) => acc + (row.total || 0), 0);
    const totalGeneral = cuponSinCosto.total + totalEfectivo + totalYape;
    const totalCitas = cuponSinCosto.countAppointment + 
                      efectivoRows.reduce((acc, row) => acc + (row.countAppointment || 0), 0) + 
                      yapeRows.reduce((acc, row) => acc + (row.countAppointment || 0), 0);
    
    return { 
      cuponSinCosto, 
      efectivoRows, 
      yapeRows, 
      totalEfectivo, 
      totalYape, 
      totalGeneral, 
      totalCitas 
    };
  };

  const { 
    cuponSinCosto, 
    efectivoRows, 
    yapeRows, 
    totalEfectivo, 
    totalYape, 
    totalGeneral, 
    totalCitas 
  } = processData(data);
  const clinicName = companyInfo?.company_name || defaultClinicName;
  const logo = LOGO_URL;
  const now = new Date();
  const fechaHora = `${date.format('DD/MM/YYYY')} - ${now.toLocaleTimeString()}`;
  const promedioPorCita = totalCitas > 0 ? (totalGeneral / totalCitas).toFixed(2) : 0;

  // Función para crear una fila vacía
  const createEmptyRow = (key) => (
    <View style={styles.tableRow} key={key}>
      <Text style={[styles.tableCell, styles.colFecha]}></Text>
      <Text style={[styles.tableCell, styles.colNoPac]}></Text>
      <Text style={[styles.tableCell, styles.colSubTotal]}></Text>
      <Text style={[styles.tableCell, styles.colEgresos]}></Text>
      <Text style={[styles.tableCell, styles.colEfectivo]}></Text>
      <Text style={[styles.tableCell, styles.colObservaciones]}></Text>
    </View>
  );

  // Función para crear una fila de datos
  const createDataRow = (label, noPac = "0", subTotal = "0", key) => (
    <View style={styles.tableRow} key={key}>
      <Text style={[styles.tableCell, styles.colFecha, styles.dataRow]}>
        {label}
      </Text>
      <Text style={[styles.tableCell, styles.colNoPac, styles.dataRow]}>
        {noPac}
      </Text>
      <Text style={[styles.tableCell, styles.colSubTotal, styles.dataRow]}>
        {subTotal}
      </Text>
      <Text style={[styles.tableCell, styles.colEgresos]}></Text>
      <Text style={[styles.tableCell, styles.colEfectivo]}></Text>
      <Text style={[styles.tableCell, styles.colObservaciones]}></Text>
    </View>
  );

  // Función para crear una fila de total
  const createTotalRow = (label, noPac = "0", subTotal = "0", key) => (
    <View style={styles.tableRow} key={key}>
      <Text style={[styles.tableCell, styles.colFecha, styles.dataRow, { backgroundColor: '#e8f5e8' }]}>
        {label}
      </Text>
      <Text style={[styles.tableCell, styles.colNoPac, styles.dataRow, { backgroundColor: '#e8f5e8' }]}>
        {noPac}
      </Text>
      <Text style={[styles.tableCell, styles.colSubTotal, styles.dataRow, { backgroundColor: '#e8f5e8' }]}>
        {subTotal}
      </Text>
      <Text style={[styles.tableCell, styles.colEgresos, { backgroundColor: '#e8f5e8' }]}></Text>
      <Text style={[styles.tableCell, styles.colEfectivo, { backgroundColor: '#e8f5e8' }]}></Text>
      <Text style={[styles.tableCell, styles.colObservaciones, { backgroundColor: '#e8f5e8' }]}></Text>
    </View>
  );

  // Función para crear filas de efectivo
  const createEfectivoRows = () => {
    const rows = [];
    
    // Agregar cada fila de efectivo
    efectivoRows.forEach((row, index) => {
      const amount = row.payment || 0;
      rows.push(
        createDataRow(`EFECTIVO ${amount}`, row.countAppointment.toString(), row.total.toString(), `efectivo-${index}`)
      );
    });
    
    // Si no hay efectivos, agregar una fila vacía
    if (efectivoRows.length === 0) {
      rows.push(createEmptyRow("efectivo-empty"));
    }
    
    return rows;
  };

  // Función para crear filas de yape
  const createYapeRows = () => {
    const rows = [];
    
    // Agregar cada fila de yape
    yapeRows.forEach((row, index) => {
      const amount = row.payment || 0;
      rows.push(
        createDataRow(`YAPE ${amount}`, row.countAppointment.toString(), row.total.toString(), `yape-${index}`)
      );
    });
    
    // Si no hay yape, agregar una fila vacía
    if (yapeRows.length === 0) {
      rows.push(createEmptyRow("yape-empty"));
    }
    
    return rows;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.headerTitles}>
            <Text style={styles.clinicName}>{clinicName}</Text>
            <Text style={styles.reportTitle}>
              Reporte de Caja Diaria
              {isEdited && (
                <Text style={{ fontSize: 10, color: '#ff6b35', marginLeft: 8 }}>
                  (Datos Simulados)
                </Text>
              )}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.infoText}>
              Fecha del Reporte: {date.format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.infoText}>Generado: {fechaHora}</Text>
            {isEdited && (
              <Text style={{ fontSize: 8, color: '#ff6b35', marginTop: 2 }}>
                * Datos modificados para simulación
              </Text>
            )}
          </View>
        </View>

        {/* Sección de Resumen */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de Citas</Text>
            <Text style={styles.summaryValue}>{totalCitas}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Promedio por Cita</Text>
            <Text style={styles.summaryValue}>S/ {promedioPorCita}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Ingreso Total</Text>
            <Text style={styles.summaryValue}>
              S/ {totalGeneral.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tabla principal con estructura fija */}
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.colFecha]}>
              Fecha: {date.format('DD/MM/YYYY')}
            </Text>
            <Text style={[styles.headerCell, styles.colNoPac]}>
              No PAC.
            </Text>
            <Text style={[styles.headerCell, styles.colSubTotal]}>
              Sub-Total
            </Text>
            <Text style={[styles.headerCell, styles.colEgresos]}>
              Egresos
            </Text>
            <Text style={[styles.headerCell, styles.colEfectivo]}>
              Efect./Dia
            </Text>
            <Text style={[styles.headerCell, styles.colObservaciones]}>
              Observaciones
            </Text>
          </View>

          {/* CUPÓN SIN COSTO - siempre aparece */}
          {createDataRow("CUPÓN SIN COSTO", cuponSinCosto.countAppointment.toString(), cuponSinCosto.total.toString(), "cupon-sin-costo")}

          {/* 2 filas vacías después de CUPÓN SIN COSTO */}
          {createEmptyRow("empty-1")}
          {createEmptyRow("empty-2")}

          {/* Filas de EFECTIVO */}
          {createEfectivoRows()}

          {/* 2 filas vacías después de EFECTIVO */}
          {createEmptyRow("empty-3")}
          {createEmptyRow("empty-4")}

          {/* Filas de YAPE */}
          {createYapeRows()}

          {/* 2 filas vacías después de YAPE */}
          {createEmptyRow("empty-5")}
          {createEmptyRow("empty-6")}

          {/* TOTAL YAPE */}
          {createTotalRow("TOTAL YAPE", 
            yapeRows.reduce((acc, row) => acc + (row.countAppointment || 0), 0).toString(), 
            totalYape.toString(), 
            "total-yape")}

          {/* TOTAL EFECTIVO */}
          {createTotalRow("TOTAL EFECTIVO", 
            efectivoRows.reduce((acc, row) => acc + (row.countAppointment || 0), 0).toString(), 
            totalEfectivo.toString(), 
            "total-efectivo")}

          {/* TOTAL GENERAL */}
          {createTotalRow("TOTAL", totalCitas.toString(), totalGeneral.toString(), "total-general")}
        </View>

        <Text style={styles.footer}>
          {clinicName} - Documento generado automáticamente.
          {isEdited && (
            <Text style={{ color: '#ff6b35' }}>
              {' '}
              Datos modificados para simulación.
            </Text>
          )}
        </Text>
      </Page>
    </Document>
  );
};

export default React.memo(DailyCashReportPDF);
