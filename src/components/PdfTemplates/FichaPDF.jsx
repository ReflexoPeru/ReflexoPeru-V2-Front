import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import dayjs from 'dayjs';

// Función para calcular el elemento base chino
const calculateChineseElement = (birthDate) => {
  if (!birthDate) return 'No especificado';
  let year = dayjs(birthDate).year();
  const month = dayjs(birthDate).month() + 1;
  const day = dayjs(birthDate).date();
  if ((month === 1 && day >= 1) || (month === 2 && day <= 15)) {
    year -= 1;
  }
  const lastTwoDigits = year % 100;
  let suma = lastTwoDigits
    .toString()
    .split('')
    .reduce((acc, curr) => acc + parseInt(curr), 0);
  while (suma >= 10) {
    suma = suma
      .toString()
      .split('')
      .reduce((acc, curr) => acc + parseInt(curr), 0);
  }
  const result = 10 - suma;
  return result;
};

const styles = StyleSheet.create({
  page: {
    width: 230, // Ticket angosto
    height: 595.3, // A5
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 10,
    fontSize: 8,
    fontFamily: 'Helvetica',
    lineHeight: 1.13,
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    marginVertical: 2,
    width: '100%',
  },
  spaced: {
    marginBottom: 6,
  },
  spacedSmall: {
    marginBottom: 2,
  },
  spacedBig: {
    marginBottom: 10,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 60,
    marginLeft: 4,
    marginRight: 4,
    height: 8,
    display: 'inline-block',
  },
  fieldUnderline: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 80,
    marginLeft: 4,
    marginRight: 4,
    height: 8,
    display: 'inline-block',
  },
  block: {
    minHeight: 26,
    marginBottom: 7,
    paddingTop: 1,
    paddingBottom: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockBig: {
    minHeight: 36,
    marginBottom: 7,
    paddingTop: 1,
    paddingBottom: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockSmall: {
    minHeight: 16,
    marginBottom: 6,
    paddingTop: 1,
    paddingBottom: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockText: {
    minHeight: 12,
    marginBottom: 1,
  },
});

const FichaPDF = ({ cita, paciente, visitas }) => {
  // Formato de fecha
  const formatDate = (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '');

  return (
    <Document>
      <Page size={{ width: 230, height: 595.3 }} style={styles.page}>
        {/* Cabecera */}
        <View style={styles.row}>
          <Text style={styles.label}>NOMBRE:</Text>
          <View style={styles.underline} />
          <Text style={[styles.label, { marginLeft: 4 }]}>COD:</Text>
          <View style={styles.underline} />
        </View>
        <View style={styles.row}>
          <Text>Fecha: {formatDate(cita.appointment_date) || ''}</Text>
          <Text style={{ marginLeft: 6 }}>
            ({cita.ticket_number ? cita.ticket_number : 'S/N'})
          </Text>
        </View>
        <View style={styles.row}>
          <Text>N° VISITAS: {visitas > 0 ? visitas : 'Aún no tiene cita'}</Text>
        </View>
        <Text style={[styles.bold, styles.spaced]}>
          {paciente.paternal_lastname || <View style={styles.underline} />}{' '}
          {paciente.maternal_lastname || <View style={styles.underline} />}{' '}
          {paciente.name || <View style={styles.underline} />}
        </Text>
        <View style={styles.line} />
        {/* DNI y Hora en dos líneas si es necesario */}
        <View style={styles.row}>
          <Text>
            DNI:{' '}
            {paciente.document_number || <View style={styles.fieldUnderline} />}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>
            H: {cita.appointment_hour || <View style={styles.fieldUnderline} />}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>
            Ocupación:{' '}
            {paciente.ocupation || <View style={styles.fieldUnderline} />}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>
            VISITA PRIMERA :{' '}
            {formatDate(cita.initial_date) || (
              <View style={styles.fieldUnderline} />
            )}
          </Text>
        </View>
        <View style={styles.row}>
          <Text>
            ULTIMA : <View style={styles.fieldUnderline} />
          </Text>
        </View>
        <View style={styles.row}>
          <Text>
            NAC :{' '}
            {formatDate(paciente.birth_date) || (
              <View style={styles.fieldUnderline} />
            )}
          </Text>
          <Text style={{ marginLeft: 4 }}>
            / Base :{' '}
            {paciente.birth_date ? (
              calculateChineseElement(paciente.birth_date)
            ) : (
              <View style={styles.fieldUnderline} />
            )}
          </Text>
        </View>
        <View style={styles.line} />
        {/* Diagnóstico */}
        <Text style={[styles.label, styles.spacedSmall]}>
          DIAGNOSTICO MEDICO
        </Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          <Text style={styles.blockText}>{cita.diagnosis || ''}</Text>
        </View>
        {/* Medicamentos */}
        <Text style={[styles.label, styles.spacedSmall]}>MEDICAMENTOS</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          <Text style={styles.blockText}>{cita.medications || ''}</Text>
        </View>
        {/* Operaciones */}
        <Text style={[styles.label, styles.spacedSmall]}>OPERACIONES</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          <Text style={styles.blockText}>{cita.surgeries || ''}</Text>
        </View>
        {/* Menstruando/Gestando */}
        <View style={styles.row}>
          <Text style={styles.bold}>MENSTRUANDO</Text>
          <Text style={{ marginLeft: 4 }}>SI / NO</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.bold}>GESTANDO</Text>
          <Text style={{ marginLeft: 4 }}>SI / NO</Text>
        </View>
        {/* Dolencias */}
        <Text style={[styles.label, styles.spacedSmall]}>DOLENCIAS</Text>
        <View style={styles.line} />
        <View style={styles.blockSmall}>
          <Text style={styles.blockText}>{cita.ailments || ''}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default FichaPDF;
