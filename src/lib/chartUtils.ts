import dayjs from 'dayjs';
import { ChartRange, ChartRangeType, WEEKDAYS, WEEKDAYS_SHORT, MONTHS } from '../constants/chartRanges';

/**
 * Tipo para los datos de sesiones del backend
 */
export interface SessionData {
  [date: string]: number;
}

/**
 * Tipo para los datos transformados para Tremor
 */
export interface ChartDataPoint {
  date: string;
  sessions: number;
  label: string;
  sublabel?: string;
}

/**
 * Interfaz para los datos del backend
 */
export interface BackendData {
  sesiones: SessionData;
  terapeutas?: Array<{
    id: number;
    terapeuta: string;
    sesiones: number;
    fechas: string[];
    fechas_count: SessionData;
  }>;
}

/**
 * Transforma los datos del backend en formato compatible con Tremor según el rango seleccionado
 */
export function transformSessionDataForRange(
  data: BackendData,
  range: ChartRangeType,
  startDate?: dayjs.Dayjs,
  endDate?: dayjs.Dayjs
): ChartDataPoint[] {
  // Validar que los datos existan
  if (!data || !data.sesiones) {
    return [];
  }
  
  const sessionsData = data.sesiones;
  
  switch (range) {
    case 'week':
      return transformWeekData(sessionsData);
    case 'month':
      return transformMonthData(sessionsData);
    case '3months':
      return transformThreeMonthsData(sessionsData);
    case 'year':
      return transformYearData(sessionsData);
    case 'custom':
      return transformCustomData(sessionsData, startDate, endDate);
    default:
      return transformWeekData(sessionsData);
  }
}

/**
 * Transforma datos para vista semanal (7 días)
 * Muestra: Lunes, Martes, etc. con fecha debajo
 */
function transformWeekData(sessionsData: SessionData): ChartDataPoint[] {
  
  if (!sessionsData) {
    console.warn('No hay datos de sesiones para transformar');
    return [];
  }
  
  const today = dayjs();
  const startOfWeek = today.startOf('week').add(1, 'day'); // Lunes
  const result: ChartDataPoint[] = [];
  
  
  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.add(i, 'day');
    const dateStr = date.format('YYYY-MM-DD');
    const sessions = sessionsData[dateStr] || 0;
    
    
    result.push({
      date: dateStr,
      sessions,
      label: WEEKDAYS_SHORT[i],
      sublabel: date.format('DD/MM')
    });
  }
  
  return result;
}

/**
 * Transforma datos para vista mensual (30 días)
 * Muestra fechas reales en formato DD/MM con mes y año como sublabel
 */
function transformMonthData(sessionsData: SessionData): ChartDataPoint[] {
  const today = dayjs();
  const result: ChartDataPoint[] = [];
  
  for (let i = 29; i >= 0; i--) {
    const date = today.subtract(i, 'day');
    const dateStr = date.format('YYYY-MM-DD');
    const sessions = sessionsData[dateStr] || 0;
    
    result.push({
      date: dateStr,
      sessions,
      label: date.format('DD/MM'), // Mostrar fecha en formato DD/MM
      sublabel: date.format('MMM YYYY') // Mostrar mes y año como sublabel
    });
  }
  
  return result;
}

/**
 * Transforma datos para vista trimestral (90 días)
 * Muestra fechas reales cada 3 días para optimizar visualización
 */
function transformThreeMonthsData(sessionsData: SessionData): ChartDataPoint[] {
  const today = dayjs();
  const result: ChartDataPoint[] = [];
  
  for (let i = 89; i >= 0; i -= 3) {
    const date = today.subtract(i, 'day');
    const dateStr = date.format('YYYY-MM-DD');
    const sessions = sessionsData[dateStr] || 0;
    
    result.push({
      date: dateStr,
      sessions,
      label: date.format('DD/MM'), // Mostrar fecha en formato DD/MM
      sublabel: date.format('MMM YYYY') // Mostrar mes y año como sublabel
    });
  }
  
  return result;
}

/**
 * Transforma datos para vista anual (12 meses)
 * Muestra: Enero 2025, Febrero 2025, etc.
 */
function transformYearData(sessionsData: SessionData): ChartDataPoint[] {
  const today = dayjs();
  const result: ChartDataPoint[] = [];
  
  for (let i = 11; i >= 0; i--) {
    const month = today.subtract(i, 'month');
    const monthStr = month.format('YYYY-MM');
    const sessions = getSessionsForMonth(sessionsData, monthStr);
    
    result.push({
      date: monthStr,
      sessions,
      label: MONTHS[month.month()],
      sublabel: month.format('YYYY')
    });
  }
  
  return result;
}

/**
 * Transforma datos para vista personalizada
 * Adapta automáticamente según el rango de fechas
 */
function transformCustomData(
  sessionsData: SessionData,
  startDate?: dayjs.Dayjs,
  endDate?: dayjs.Dayjs
): ChartDataPoint[] {
  if (!startDate || !endDate) {
    console.warn('No hay fechas para rango personalizado, usando semana por defecto');
    return transformWeekData(sessionsData);
  }
  
  const daysDiff = endDate.diff(startDate, 'day');
  
  if (daysDiff <= 7) {
    // Si es 7 días o menos, mostrar día por día
    return transformCustomDailyData(sessionsData, startDate, endDate);
  } else if (daysDiff <= 30) {
    // Si es menos de 30 días, mostrar día por día
    return transformCustomDailyData(sessionsData, startDate, endDate);
  } else if (daysDiff <= 90) {
    // Si es menos de 90 días, mostrar cada 3 días
    return transformCustomWeeklyData(sessionsData, startDate, endDate);
  } else if (daysDiff <= 365) {
    // Si es menos de 1 año, mostrar por mes
    return transformCustomMonthlyData(sessionsData, startDate, endDate);
  } else {
    // Si es más de 1 año, mostrar por trimestre o año
    return transformCustomYearlyData(sessionsData, startDate, endDate);
  }
}

/**
 * Transforma datos personalizados día por día
 */
function transformCustomDailyData(
  sessionsData: SessionData,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  let current = startDate;
  const daysDiff = endDate.diff(startDate, 'day');
  
  while (current.isBefore(endDate) || current.isSame(endDate, 'day')) {
    const dateStr = current.format('YYYY-MM-DD');
    const sessions = sessionsData[dateStr] || 0;
    
    // Si el rango es mayor a 7 días, mostrar fechas reales en lugar de días de la semana
    if (daysDiff > 7) {
      result.push({
        date: dateStr,
        sessions,
        label: current.format('DD/MM'), // Mostrar fecha en formato DD/MM
        sublabel: current.format('MMM YYYY') // Mostrar mes y año como sublabel
      });
    } else {
      // Para rangos de 7 días o menos, mantener el formato original
      result.push({
        date: dateStr,
        sessions,
        label: current.format('ddd'),
        sublabel: current.format('DD/MM')
      });
    }
    
    current = current.add(1, 'day');
  }
  
  return result;
}

/**
 * Transforma datos personalizados cada 3 días (para rangos medianos)
 */
function transformCustomWeeklyData(
  sessionsData: SessionData,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  let current = startDate;
  
  while (current.isBefore(endDate, 'day') || current.isSame(endDate, 'day')) {
    const dateStr = current.format('YYYY-MM-DD');
    let sessions = 0;
    
    // Sumar sesiones de los próximos 3 días
    for (let i = 0; i < 3 && (current.isBefore(endDate, 'day') || current.isSame(endDate, 'day')); i++) {
      const dayStr = current.format('YYYY-MM-DD');
      sessions += sessionsData[dayStr] || 0;
      current = current.add(1, 'day');
    }
    
    const startDateForLabel = current.subtract(3, 'day');
    result.push({
      date: dateStr,
      sessions,
      label: startDateForLabel.format('DD/MM'), // Mostrar fecha en formato DD/MM
      sublabel: startDateForLabel.format('MMM YYYY') // Mostrar mes y año como sublabel
    });
  }
  
  return result;
}

/**
 * Transforma datos personalizados por mes
 */
function transformCustomMonthlyData(
  sessionsData: SessionData,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  let current = startDate.startOf('month');
  
  while (current.isBefore(endDate, 'month') || current.isSame(endDate, 'month')) {
    const monthStr = current.format('YYYY-MM');
    const sessions = getSessionsForMonth(sessionsData, monthStr);
    
    result.push({
      date: monthStr,
      sessions,
      label: MONTHS[current.month()],
      sublabel: current.format('YYYY')
    });
    
    current = current.add(1, 'month');
  }
  
  return result;
}

/**
 * Transforma datos personalizados por año o trimestre
 */
function transformCustomYearlyData(
  sessionsData: SessionData,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): ChartDataPoint[] {
  const yearsDiff = endDate.diff(startDate, 'year');
  
  if (yearsDiff <= 3) {
    // Mostrar trimestres si son 3 años o menos
    return transformCustomQuarterlyData(sessionsData, startDate, endDate);
  } else {
    // Mostrar años si son más de 3 años
    return transformCustomYearlyOnlyData(sessionsData, startDate, endDate);
  }
}

/**
 * Transforma datos personalizados por trimestre
 */
function transformCustomQuarterlyData(
  sessionsData: SessionData,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  let current = startDate.startOf('month');
  
  while (current.isBefore(endDate, 'month') || current.isSame(endDate, 'month')) {
    const quarter = Math.floor(current.month() / 3) + 1;
    const year = current.year();
    const sessions = getSessionsForQuarter(sessionsData, current);
    
    result.push({
      date: current.format('YYYY-Q'),
      sessions,
      label: `Q${quarter}`,
      sublabel: year.toString()
    });
    
    current = current.add(3, 'month');
  }
  
  return result;
}

/**
 * Transforma datos personalizados solo por año
 */
function transformCustomYearlyOnlyData(
  sessionsData: SessionData,
  startDate: dayjs.Dayjs,
  endDate: dayjs.Dayjs
): ChartDataPoint[] {
  const result: ChartDataPoint[] = [];
  let current = startDate.startOf('year');
  
  while (current.isBefore(endDate, 'year') || current.isSame(endDate, 'year')) {
    const year = current.format('YYYY');
    const sessions = getSessionsForYear(sessionsData, year);
    
    result.push({
      date: year,
      sessions,
      label: year,
      sublabel: ''
    });
    
    current = current.add(1, 'year');
  }
  
  return result;
}

/**
 * Obtiene el total de sesiones para un mes específico
 */
function getSessionsForMonth(sessionsData: SessionData, monthStr: string): number {
  return Object.keys(sessionsData)
    .filter(date => date.startsWith(monthStr))
    .reduce((total, date) => total + (sessionsData[date] || 0), 0);
}

/**
 * Obtiene el total de sesiones para un trimestre específico
 */
function getSessionsForQuarter(sessionsData: SessionData, quarterStart: dayjs.Dayjs): number {
  const quarterEnd = quarterStart.add(3, 'month').subtract(1, 'day');
  let total = 0;
  let current = quarterStart;
  
  while (current.isBefore(quarterEnd) || current.isSame(quarterEnd, 'day')) {
    const dateStr = current.format('YYYY-MM-DD');
    total += sessionsData[dateStr] || 0;
    current = current.add(1, 'day');
  }
  
  return total;
}

/**
 * Obtiene el total de sesiones para un año específico
 */
function getSessionsForYear(sessionsData: SessionData, year: string): number {
  return Object.keys(sessionsData)
    .filter(date => date.startsWith(year))
    .reduce((total, date) => total + (sessionsData[date] || 0), 0);
}

/**
 * Obtiene el color del tema basado en el modo oscuro/claro
 */
export function getChartColors(isDarkMode: boolean = false) {
  return {
    primary: isDarkMode ? '#00ff7f' : '#00cc66',
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    text: isDarkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: isDarkMode ? '#a0a0a0' : '#666666',
    grid: isDarkMode ? '#333333' : '#e5e5e5',
    tooltip: isDarkMode ? '#2a2a2a' : '#f8f8f8'
  };
}

/**
 * Formatea un número de sesiones para mostrar en el tooltip
 */
export function formatSessionCount(count: number): string {
  if (count === 0) return 'Sin sesiones';
  if (count === 1) return '1 sesión';
  return `${count} sesiones`;
}

/**
 * Calcula la tendencia entre dos valores
 */
export function calculateTrend(current: number, previous: number): {
  direction: 'up' | 'down' | 'stable';
  percentage: number;
  difference: number;
} {
  if (previous === 0) {
    return {
      direction: current > 0 ? 'up' : 'stable',
      percentage: 0,
      difference: current
    };
  }
  
  const difference = current - previous;
  const percentage = Math.abs((difference / previous) * 100);
  
  if (difference > 0) {
    return { direction: 'up', percentage, difference };
  } else if (difference < 0) {
    return { direction: 'down', percentage, difference };
  } else {
    return { direction: 'stable', percentage: 0, difference: 0 };
  }
}
