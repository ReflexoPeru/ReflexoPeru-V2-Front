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
  table: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: pastelGreen,
    borderRadius: 10,
    overflow: 'hidden',
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
  cell: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
  },
  cellName: {
    flex: 4,
    padding: 10,
    fontSize: 12,
    color: '#222',
    textAlign: 'left',
  },
  cellCount: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
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
    flex: 5,
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
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
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

const DailyTherapistReportPDF = ({ data, date }) => {
  const therapists = data?.therapists_appointments || [];
  const total = data?.total_appointments_count || 0;
  const now = new Date();
  const fechaHora = `${date.format('DD/MM/YYYY')} - ${now.toLocaleTimeString()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image src={logo} style={styles.logo} />
          </View>
          <View style={styles.headerCenter}>
            <Text style={styles.title}>{clinicName}</Text>
            <Text style={styles.subtitle}>
              Reporte de Atenciones Diarias x Terapeuta
            </Text>
            <Text style={styles.date}>Fecha: {date.format('DD/MM/YYYY')}</Text>
          </View>
          <View style={styles.headerRight}></View>
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.tableHeader, { flex: 0.7 }]}>
                N°
              </Text>
              <Text style={[styles.cellName, styles.tableHeader]}>Nombre</Text>
              <Text style={[styles.cellCount, styles.tableHeader]}>
                Cantidad
              </Text>
            </View>
            {therapists.map((t, idx) => (
              <View
                style={[
                  styles.tableRow,
                  idx % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
                key={t.id}
              >
                <Text style={[styles.cell, { flex: 0.7 }]}>{idx + 1}</Text>
                <Text style={styles.cellName}>
                  {`${t.paternal_lastname} ${t.maternal_lastname} ${t.name}`}
                </Text>
                <Text style={styles.cellCount}>{t.appointments_count}</Text>
              </View>
            ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>{total}</Text>
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

export default React.memo(DailyTherapistReportPDF);
