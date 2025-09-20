/**
 * Tipos de filtros de tiempo disponibles para el gráfico de sesiones
 */
export const ChartRange = {
  WEEK: 'week',
  MONTH: 'month', 
  THREE_MONTHS: '3months',
  YEAR: 'year',
  CUSTOM: 'custom'
};

// Para compatibilidad con TypeScript
export type ChartRangeType = 'week' | 'month' | '3months' | 'year' | 'custom';

/**
 * Configuración de rangos de tiempo
 */
export interface ChartRangeConfig {
  label: string;
  days: number;
  description: string;
}

/**
 * Mapeo de rangos de tiempo con su configuración
 */
export const CHART_RANGES: Record<ChartRangeType, ChartRangeConfig> = {
  week: {
    label: 'Semana actual',
    days: 7,
    description: 'Lunes a Domingo de la semana actual'
  },
  month: {
    label: 'Último mes',
    days: 30,
    description: 'Últimos 30 días'
  },
  '3months': {
    label: 'Últimos 3 meses',
    days: 90,
    description: 'Últimos 90 días'
  },
  year: {
    label: 'Último año',
    days: 365,
    description: 'Últimos 12 meses'
  },
  custom: {
    label: 'Personalizado',
    days: 0, // Se calcula dinámicamente
    description: 'Rango de fechas personalizado'
  }
};

/**
 * Nombres de días de la semana en español
 */
export const WEEKDAYS = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
] as const;

/**
 * Nombres de meses en español
 */
export const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
] as const;

/**
 * Nombres de días de la semana abreviados
 */
export const WEEKDAYS_SHORT = [
  'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'
] as const;
