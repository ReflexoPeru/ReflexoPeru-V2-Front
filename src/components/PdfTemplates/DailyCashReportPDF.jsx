import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const logo = '/src/assets/Img/Dashboard/MiniLogoReflexo.png';
const pastelGreen = '#95e472';
const darkGreen = '#2d5a3d';
const clinicName = 'Reflexo Perú';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 12,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 0,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: darkGreen,
    marginBottom: 4,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 0,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 3,
    borderBottomColor: pastelGreen,
    marginVertical: 15,
    marginHorizontal: 0,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  summary: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: pastelGreen,
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: darkGreen,
    marginBottom: 10,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#444',
    fontWeight: 'bold',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: darkGreen,
  },
  table: {
    borderWidth: 2,
    borderColor: pastelGreen,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 35,
  },
  tableHeader: {
    backgroundColor: pastelGreen,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#b6e6b0',
  },
  cellName: {
    flex: 1.6,
    padding: 10,
    fontSize: 12,
    color: '#222',
    textAlign: 'left',
  },
  cellCount: {
    flex: 0.7,
    padding: 10,
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
  },
  cellMoney: {
    flex: 1,
    padding: 10,
    fontSize: 12,
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
    minHeight: 40,
    borderTopWidth: 3,
    borderTopColor: pastelGreen,
  },
  totalLabel: {
    flex: 2.3,
    padding: 10,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'right',
    fontSize: 14,
  },
  totalValue: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
    color: pastelGreen,
    textAlign: 'center',
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
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
          <View style={styles.headerLeft}>
            <Image src={logo} style={styles.logo} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>{clinicName}</Text>
            <Text style={styles.subtitle}>Reporte de Caja Diaria</Text>
            <Text style={styles.date}>Fecha: {date.format('DD/MM/YYYY')}</Text>
          </View>
          <View style={styles.headerRight}></View>
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

export default React.memo(DailyCashReportPDF);
