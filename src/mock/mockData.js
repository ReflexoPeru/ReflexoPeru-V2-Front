// mockData.js
export const mockData = {
  data: {
    sesiones: {
      Monday: 5,
      Tuesday: 8,
      Wednesday: 12,
      Thursday: 15,
      Friday: 10,
      Saturday: 7,
    },
    metricas: {
      ttlganancias: 1250.50,
      ttlpacientes: 45,
    },
    terapeutas: [
      {
        id: 1,
        terapeuta: 'LOPEZ, TERESA MARIA',
        sesiones: 25,
        ingresos: 750.00,
        raiting: 4.5,
      },
      {
        id: 2,
        terapeuta: 'MENDOZA, CARLOS ALBERTO',
        sesiones: 18,
        ingresos: 540.00,
        raiting: 4.2,
      },
      {
        id: 3,
        terapeuta: 'RAMIREZ, ANA LUCIA',
        sesiones: 22,
        ingresos: 660.00,
        raiting: 4.8,
      },
      {
        id: 4,
        terapeuta: 'TORRES, MANUEL JOSE',
        sesiones: 15,
        ingresos: 450.00,
        raiting: 3.9,
      },
    ],
    tipos_pago: {
      Efectivo: 450,
      Yape: 320,
      Transferencia: 280,
      Cupón: 200,
    },
    ingresos: {
      '2024-01': 1200,
      '2024-02': 1500,
      '2024-03': 1300,
      '2024-04': 1400,
      '2024-05': 1600,
    },
    tipos_pacientes: {
      c: 25,
      cc: 20,
    },
  },
};
