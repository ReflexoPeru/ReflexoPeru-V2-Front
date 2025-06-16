import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const logo = '/MiniLogoReflexo.png';
const pastelGreen = '#95e472';
const darkGreen = '#2d5a3d';
const clinicName = 'Reflexo Perú';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 8,
    fontFamily: 'Helvetica',
    fontSize: 11,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 6,
    marginTop: 0,
  },
  logo: {
    width: 38,
    height: 38,
    marginBottom: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkGreen,
    marginBottom: 1,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    color: '#444',
    marginBottom: 1,
    textAlign: 'center',
  },
  date: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: pastelGreen,
    marginVertical: 4,
    marginHorizontal: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  summary: {
    padding: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: pastelGreen,
  },
  summaryTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: darkGreen,
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  summaryLabel: {
    fontSize: 9,
    color: '#444',
  },
  summaryValue: {
    fontSize: 9,
    fontWeight: 'bold',
    color: darkGreen,
  },
  table: {
    borderWidth: 1.5,
    borderColor: pastelGreen,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 22,
  },
  tableHeader: {
    backgroundColor: pastelGreen,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    textAlign: 'center',
    padding: 4,
    borderBottomWidth: 2,
    borderBottomColor: '#b6e6b0',
  },
  cellName: {
    flex: 1.6,
    padding: 4,
    fontSize: 9,
    color: '#222',
    textAlign: 'left',
  },
  cellCount: {
    flex: 0.7,
    padding: 4,
    fontSize: 9,
    color: '#222',
    textAlign: 'center',
  },
  cellMoney: {
    flex: 1,
    padding: 4,
    fontSize: 9,
    color: darkGreen,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rowEven: {
    backgroundColor: '#f8f8f8',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#eaffdf',
    minHeight: 22,
    borderTopWidth: 2,
    borderTopColor: pastelGreen,
  },
  totalLabel: {
    flex: 2.3,
    padding: 4,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'right',
    fontSize: 10,
  },
  totalValue: {
    flex: 1,
    padding: 4,
    fontWeight: 'bold',
    color: pastelGreen,
    textAlign: 'center',
    fontSize: 10,
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 8,
    color: '#888',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 4,
  },
});

const DailyCashReportPDF = ({ data, date }) => {
  const rows = Object.values(data || {});
  const now = new Date();
  const fechaHora = `${date.format('DD/MM/YYYY')} - ${now.toLocaleTimeString()}`;
  const totalGeneral = rows.reduce((acc, row) => acc + (row.total || 0), 0);
  const totalCitas = rows.reduce(
    (acc, row) => acc + (row.countAppointment || 0),
    0,
  );
  const promedioPorCita =
    totalCitas > 0 ? (totalGeneral / totalCitas).toFixed(2) : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <Text style={styles.title}>{clinicName}</Text>
          <Text style={styles.subtitle}>Reporte de Caja Diaria</Text>
          <Text style={styles.date}>Fecha: {date.format('DD/MM/YYYY')}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.content}>
          {/* Resumen */}
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Resumen del Día</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total de Citas:</Text>
              <Text style={styles.summaryValue}>{totalCitas}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Promedio por Cita:</Text>
              <Text style={styles.summaryValue}>S/ {promedioPorCita}</Text>
            </View>
          </View>

          {/* Tabla de Detalles */}
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.cellName, styles.tableHeader]}>
                Método de Pago
              </Text>
              <Text style={[styles.cellCount, styles.tableHeader]}>Citas</Text>
              <Text style={[styles.cellMoney, styles.tableHeader]}>
                Monto Unitario
              </Text>
              <Text style={[styles.cellMoney, styles.tableHeader]}>Total</Text>
            </View>
            {rows.map((row, idx) => (
              <View
                style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
                key={row.name}
              >
                <Text style={styles.cellName}>{row.name}</Text>
                <Text style={styles.cellCount}>{row.countAppointment}</Text>
                <Text style={styles.cellMoney}>S/ {row.payment}</Text>
                <Text style={styles.cellMoney}>S/ {row.total}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total General</Text>
              <Text style={styles.totalValue}></Text>
              <Text style={styles.totalValue}></Text>
              <Text style={styles.totalValue}>S/ {totalGeneral}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          {clinicName} | Generado el {fechaHora}
        </Text>
      </Page>
    </Document>
  );
};

export default DailyCashReportPDF;
