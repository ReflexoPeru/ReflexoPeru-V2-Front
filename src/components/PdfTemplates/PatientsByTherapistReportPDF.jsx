import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const pastelGreen = '#95e472';
const darkGreen = '#2d5a3d';
const clinicName = 'Reflexo Perú';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 0,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: darkGreen,
    marginBottom: 2,
    letterSpacing: 1,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: pastelGreen,
    marginVertical: 12,
    marginHorizontal: 0,
  },
  therapistBlock: {
    marginBottom: 24,
  },
  therapistName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: darkGreen,
    marginBottom: 6,
    marginTop: 10,
    textAlign: 'left',
  },
  table: {
    marginTop: 2,
    borderWidth: 1.5,
    borderColor: pastelGreen,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 28,
  },
  tableHeader: {
    backgroundColor: pastelGreen,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
    padding: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#b6e6b0',
  },
  cell: {
    flex: 1,
    padding: 8,
    fontSize: 11,
    color: '#222',
    textAlign: 'center',
  },
  cellName: {
    flex: 3,
    padding: 8,
    fontSize: 11,
    color: '#222',
    textAlign: 'left',
  },
  cellCount: {
    flex: 1,
    padding: 8,
    fontSize: 11,
    color: '#222',
    textAlign: 'center',
  },
  rowEven: {
    backgroundColor: '#f8f8f8',
  },
  rowOdd: {
    backgroundColor: '#fff',
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
  },
});

const PatientsByTherapistReportPDF = ({ data, date }) => {
  const therapists = data || [];
  const now = new Date();
  const fechaHora = `${date.format('DD/MM/YYYY')} - ${now.toLocaleTimeString()}`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{clinicName}</Text>
          <Text style={styles.subtitle}>
            Reporte de Pacientes Atendidos x Terapeuta
          </Text>
          <Text style={styles.date}>Fecha: {date.format('DD/MM/YYYY')}</Text>
        </View>
        <View style={styles.divider} />
        {therapists.map((therapist, idx) => (
          <View
            key={therapist.therapist_id || idx}
            style={styles.therapistBlock}
          >
            <Text style={styles.therapistName}>{therapist.therapist}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.cell, styles.tableHeader, { flex: 1.2 }]}>
                  ID Paciente
                </Text>
                <Text style={[styles.cellName, styles.tableHeader]}>
                  Nombre Paciente
                </Text>
                <Text style={[styles.cellCount, styles.tableHeader]}>
                  Citas
                </Text>
              </View>
              {therapist.patients.map((p, i) => (
                <View
                  style={[
                    styles.tableRow,
                    i % 2 === 0 ? styles.rowEven : styles.rowOdd,
                  ]}
                  key={p.patient_id}
                >
                  <Text style={[styles.cell, { flex: 1.2 }]}>
                    {p.patient_id}
                  </Text>
                  <Text style={styles.cellName}>{p.patient}</Text>
                  <Text style={styles.cellCount}>{p.appointments}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
        <Text style={styles.footer}>
          {clinicName} | Generado el {fechaHora}
        </Text>
      </Page>
    </Document>
  );
};

export default PatientsByTherapistReportPDF;
