import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 18,
    fontFamily: 'Helvetica',
    fontSize: 12,
    color: '#111',
    backgroundColor: '#fff',
  },
  center: {
    textAlign: 'center',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
    fontSize: 13,
  },
  line: {
    marginVertical: 8,
    borderBottomWidth: 1.2,
    borderBottomColor: '#000',
    width: '100%',
    alignSelf: 'center',
  },
  lineDouble: {
    marginVertical: 8,
    borderBottomWidth: 2.2,
    borderBottomColor: '#000',
    width: '100%',
    alignSelf: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    marginVertical: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    flex: 1,
    padding: 4,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderRightColor: '#000',
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    fontSize: 12,
  },
  tableCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
    fontSize: 13,
  },
  lastCell: {
    borderRightWidth: 0,
  },
  totalBlock: {
    marginTop: 7,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 6,
    textAlign: 'center',
  },
  total: {
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    letterSpacing: 1,
  },
  small: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 7,
    color: '#333',
  },
  spaceBlock: {
    height: 10,
  },
  spaceBlockBig: {
    height: 18,
  },
  contact: {
    fontSize: 11,
    color: '#222',
    marginBottom: 2,
  },
  footer: {
    marginTop: 12,
    textAlign: 'center',
    fontSize: 10,
    color: '#888',
    letterSpacing: 0.5,
  },
});

const getFontSize = (text, base = 13, min = 9, maxLen = 28) => {
  if (!text) return base;
  if (text.length > maxLen) return min;
  return base;
};

const TicketPDF = ({
  company = {
    name: 'REFLEXOPERU',
    address: 'Calle Las Golondrinas N° 153 - Urb. Los Nogales',
    phone: '01-503-8416',
    email: 'reflexoperu@reflexoperu.com',
    city: 'LIMA - PERU',
    exonerated: 'EXONERADO DE TRIBUTOS',
    di: 'D.I. 626-D.I.23211',
  },
  ticket = {
    number: 1,
    date: '2025-06-23',
    patient: 'PACIENTE',
    service: 'Consulta',
    unit: 1,
    amount: 'S/ 0.00',
    paymentType: 'EFECTIVO',
  },
}) => (
  <Document>
    <Page size="A6" style={styles.page} wrap={false}>
      <View style={styles.center} wrap={false}>
        <Text
          style={{
            ...styles.bold,
            fontSize: getFontSize(company.name, 13, 10, 22),
          }}
        >
          {company.name}
        </Text>
        <Text style={styles.contact}>{company.address}</Text>
        <Text style={styles.contact}>Tel: {company.phone}</Text>
        <Text style={styles.contact}>{company.email}</Text>
        <View style={styles.spaceBlock} />
        <Text>{company.city}</Text>
        <Text>{company.exonerated}</Text>
        <Text>{company.di}</Text>
        <View style={styles.spaceBlock} />
        <Text style={{ marginTop: 2 }}>TICKET N° {ticket.number}</Text>
        <Text>Fecha: {ticket.date}</Text>
        <Text
          style={{
            marginBottom: 6,
            fontSize: getFontSize(ticket.patient, 12, 9, 22),
          }}
        >
          Paciente: {ticket.patient}
        </Text>
        <Text style={{ marginBottom: 6 }}>
          Tipo de Pago: {ticket.paymentType}
        </Text>
      </View>
      <View style={styles.lineDouble} wrap={false} />
      <View style={styles.table} wrap={false}>
        <View style={styles.tableRow} wrap={false}>
          <Text style={styles.tableCellHeader}>SERVICIO</Text>
          <Text style={styles.tableCellHeader}>UNIDAD</Text>
          <Text style={[styles.tableCellHeader, styles.lastCell]}>
            S/ IMPORTE
          </Text>
        </View>
        <View style={styles.tableRow} wrap={false}>
          <Text
            style={{
              ...styles.tableCell,
              fontSize: getFontSize(ticket.service, 13, 9, 18),
            }}
          >
            {ticket.service}
          </Text>
          <Text style={styles.tableCell}>{ticket.unit}</Text>
          <Text style={[styles.tableCell, styles.lastCell]}>
            {ticket.amount}
          </Text>
        </View>
      </View>
      <View style={styles.lineDouble} wrap={false} />
      <View style={styles.totalBlock} wrap={false}>
        <Text style={styles.total}>TOTAL: {ticket.amount}</Text>
      </View>
      <Text style={styles.small}>Gracias por su preferencia</Text>
      <Text style={styles.small}>Presentarse 30 minutos antes de la cita</Text>
    </Page>
  </Document>
);

export default TicketPDF;
