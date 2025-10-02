import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import dayjs from '../../utils/dayjsConfig';

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
    width: 260,
    height: 750,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 16,
    fontFamily: 'Helvetica',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 9,
    marginBottom: 2,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica-Bold',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 9,
    letterSpacing: 0.3,
    color: '#000000',
    fontFamily: 'Helvetica-Bold',
  },
  field: {
    fontSize: 10,
    marginBottom: 1,
    letterSpacing: 0.2,
    color: '#000000',
    lineHeight: 1.2,
  },
  line: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    marginVertical: 3,
    width: '100%',
  },
  underline: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 100,
    marginLeft: 3,
    marginRight: 3,
    height: 10,
    display: 'inline-block',
  },
  fieldUnderline: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 50,
    marginLeft: 3,
    marginRight: 3,
    height: 10,
    display: 'inline-block',
  },
  block: {
    minHeight: 12,
    marginBottom: 3,
    paddingTop: 1,
    paddingBottom: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockBig: {
    minHeight: 29,
    marginBottom: 11,
    paddingTop: 4,
    paddingBottom: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  blockText: {
    minHeight: 8,
    marginBottom: 1,
    textAlign: 'left',
    fontSize: 10,
    letterSpacing: 0.2,
    color: '#000000',
    lineHeight: 1.3,
  },
  firma: {
    marginTop: 8,
    fontSize: 9,
    flexDirection: 'row',
    alignItems: 'center',
    letterSpacing: 0.3,
    color: '#000000',
    fontFamily: 'Helvetica-Bold',
  },
  firmaLinea: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 100,
    marginLeft: 3,
    marginRight: 3,
    height: 10,
    display: 'inline-block',
  },
  shortUnderline: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 25,
    marginLeft: 2,
    marginRight: 2,
    height: 10,
    display: 'inline-block',
  },
  tinyUnderline: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 15,
    marginLeft: 2,
    marginRight: 2,
    height: 10,
    display: 'inline-block',
  },
  nameLabel: {
    fontWeight: 'bold',
    fontSize: 9,
    letterSpacing: 0.4,
    color: '#000000',
    fontFamily: 'Helvetica-Bold',
  },
  nameUnderline: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 140,
    marginLeft: 3,
    marginRight: 12,
    height: 10,
    display: 'inline-block',
  },
  codeLabel: {
    fontWeight: 'bold',
    fontSize: 9,
    letterSpacing: 0.4,
    color: '#000000',
    fontFamily: 'Helvetica-Bold',
  },
  codeUnderline: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    minWidth: 50,
    marginLeft: 3,
    marginRight: 3,
    height: 10,
    display: 'inline-block',
  },
});

const FichaPDF = ({ cita, paciente, visitas, historia = {} }) => {
  // Formato de fecha
  const formatDate = (date) => (date ? dayjs(date).format('DD/MM/YYYY') : '');

  // Helper para subrayado si vacío
  const renderField = (value, underlineStyle = styles.underline) =>
    value ? (
      <Text style={styles.field}>{value}</Text>
    ) : (
      <View style={underlineStyle} />
    );

  // Helper para renderizar secciones siempre con línea si vacío
  const renderSectionField = (value) =>
    value ? (
      <Text style={styles.blockText}>{value}</Text>
    ) : (
      <View style={{ height: 10, borderBottomWidth: 0.5, borderBottomColor: '#000', borderBottomStyle: 'solid' }} />
    );

  // Datos opcionales: peso hoy y anticoncepción
  const pesoHoy = historia?.current_weight ?? historia?.actual_weight ?? '';
  const hasPesoHoy = pesoHoy !== null && pesoHoy !== undefined && `${pesoHoy}` !== '';
  const metodoAnticonceptivoNombre = historia?.contraceptive_method?.name ?? null;
  const metodoAnticonceptivoId = historia?.contraceptive_method_id ?? null;
  const isDiu = metodoAnticonceptivoNombre === 'DIU' || Number(metodoAnticonceptivoId) === 4;
  const tipoDiuNombre = historia?.diu_type?.name ?? null;

  return (
    <Document>
      <Page size={{ width: 260, height: 800 }} style={styles.page}>
        {/* Cabecera */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.nameLabel}>NOMBRE:</Text>
          <View style={styles.nameUnderline} />
          <Text style={[styles.codeLabel, { marginLeft: 4 }]}>COD:</Text>
          <View style={styles.codeUnderline} />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
          <Text style={styles.label}>
            FECHA:{' '}
            <Text style={styles.field}>
              {formatDate(cita.appointment_date)}
            </Text>
          </Text>
          <Text style={[styles.field, { marginLeft: 4 }]}>
            ({cita.ticket_number ? cita.ticket_number : 'S/N'})
          </Text>
        </View>
        <View style={{ marginBottom: 4 }}>
          <Text style={styles.label}>
            N° VISITAS:{' '}
            <Text style={styles.field}>
              {visitas > 0 ? visitas : 'Aún no tiene cita'}
            </Text>
          </Text>
        </View>
        {renderField(
          `${paciente.paternal_lastname || ''} ${paciente.maternal_lastname || ''} ${paciente.name || ''}`.trim(),
          styles.underline,
        )}
        <View style={styles.line} />
        {/* DNI y Hora en la misma línea */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Text style={styles.label}>DNI:</Text>
          {renderField(paciente.document_number, styles.fieldUnderline)}
          <Text style={[styles.label, { marginLeft: 8 }]}>H:</Text>
          {renderField(cita.appointment_hour, styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Text style={styles.label}>OCUPACIÓN:</Text>
          {renderField(paciente.ocupation, styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Text style={styles.label}>VISITA PRIMERA:</Text>
          {renderField(formatDate(cita.initial_date), styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Text style={styles.label}>ULTIMA:</Text>
          {renderField('', styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
          }}
        >
          <Text style={styles.label}>NAC:</Text>
          {renderField(formatDate(paciente.birth_date), styles.fieldUnderline)}
          <Text style={[styles.label, { marginLeft: 4 }]}>/ Base:</Text>
          {paciente.birth_date ? (
            <Text style={styles.field}>
              {calculateChineseElement(paciente.birth_date)}
            </Text>
          ) : (
            <View style={styles.fieldUnderline} />
          )}
        </View>
        <View style={styles.line} />
        {/* Diagnóstico */}
        <Text style={styles.sectionTitle}>DIAGNOSTICO MEDICO</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderSectionField(cita.diagnosis)}
        </View>
        {/* Medicamentos */}
        <Text style={styles.sectionTitle}>MEDICAMENTOS</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderSectionField(cita.medications)}
        </View>
        {/* Operaciones */}
        <Text style={styles.sectionTitle}>OPERACIONES</Text>
        <View style={styles.blockBig}>
          {renderSectionField(cita.surgeries)}
        </View>
        {/* Dolencias */}
        <Text style={styles.sectionTitle}>DOLENCIAS</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderSectionField(cita.ailments)}
        </View>
        {/* Campos para mujeres */}
        {paciente.sex === 'F' && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 6,
              marginTop: 6,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '48%' }}>
              <Text style={styles.label}>GESTA:</Text>
              <Text style={[styles.field, { marginLeft: 4 }]}>SI / NO</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '46%', justifyContent: 'flex-start', marginLeft: 12 }}>
              <Text style={styles.label}>MENSTR:</Text>
              <Text style={[styles.field, { marginLeft: 4 }]}>SI / NO</Text>
            </View>
          </View>
        )}
        {/* Anticoncepción (solo si es mujer) */}
        {paciente.sex === 'F' && (
          <View style={{ marginTop: 4, marginBottom: 6 }}>
            <Text style={styles.sectionTitle}>MÉTODO ANTICONCEPTIVO</Text>
            <View style={styles.line} />
            <View style={styles.block}>
              <Text style={styles.label}>
                Método: <Text style={styles.field}>{metodoAnticonceptivoNombre || (metodoAnticonceptivoId ? `ID ${metodoAnticonceptivoId}` : '')}</Text>
              </Text>
            </View>
            {isDiu && (tipoDiuNombre || historia?.diu_type_id) ? (
              <View style={styles.block}>
                <Text style={styles.label}>
                  Tipo DIU: <Text style={styles.field}>{tipoDiuNombre || `ID ${historia?.diu_type_id}`}</Text>
                </Text>
                <View style={styles.line} />
              </View>
            ) : (
              <View style={styles.block}>
                <Text style={styles.label}>
                  Tipo DIU: <Text style={styles.field}></Text>
                </Text>
                <View style={styles.line} />
              </View>
            )}
          </View>
        )}
        {/* PESO INICIAL, PESO ANTERIOR, PESO HOY, TALLA */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <Text style={styles.label}>PESO INICIAL:</Text>
          {renderField(historia.weight, styles.fieldUnderline)}
          <Text style={styles.label}> KG /</Text>
          <Text style={[styles.label, { marginLeft: 6 }]}>
            {formatDate(cita.appointment_date)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <Text style={styles.label}>PESO ANTERIOR:</Text>
          {renderField(historia.last_weight, styles.fieldUnderline)}
          <Text style={styles.label}> KG /</Text>
        </View>
        {/* Peso Hoy (siempre mostrar, con línea si no hay dato) */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <Text style={styles.label}>PESO HOY:</Text>
          {renderField('', styles.fieldUnderline)}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
        >
          <Text style={styles.label}>TALLA:</Text>
          {renderField(historia.height ? `${historia.height} m` : '', styles.fieldUnderline)}
        </View>
        <Text style={styles.sectionTitle}>DIAGNOSTICOS REFLEXOLOGICO</Text>
        <View style={styles.line} />
        <View style={styles.blockBig}>
          {renderSectionField(cita.reflexology_diagnostics)}
        </View>
        {/* Firma del terapeuta */}
        <View style={styles.firma}>
          <Text style={{ fontSize: 9 }}>Firma del terapeuta:</Text>
          <View style={styles.firmaLinea} />
        </View>
      </Page>
    </Document>
  );
};

export default FichaPDF;
