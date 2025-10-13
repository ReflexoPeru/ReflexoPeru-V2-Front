/**
 * Utilidades para formatear números de manera precisa y amigable para el usuario
 * 
 * El backend a veces devuelve números con precisión de punto flotante excesiva
 * Ej: 1.4699999999999999733546474089962430298328399658203125
 * 
 * Estas funciones ayudan a formatear esos valores para:
 * 1. Mostrarlos de forma amigable al usuario
 * 2. Enviarlos de forma precisa al backend
 */

/**
 * Formatea un número para mostrarlo al usuario de manera amigable
 * Elimina decimales innecesarios y redondea a la precisión deseada
 * 
 * @param {number|string|null|undefined} value - El valor a formatear
 * @param {number} decimals - Número máximo de decimales (por defecto 3)
 * @returns {string} - El número formateado como string, o '' si es inválido
 * 
 * @example
 * formatNumberForDisplay(1.4699999999999) // "1.47"
 * formatNumberForDisplay(70.5) // "70.5"
 * formatNumberForDisplay(75) // "75"
 * formatNumberForDisplay(70.500) // "70.5"
 */
export const formatNumberForDisplay = (value, decimals = 3) => {
  if (value === null || value === undefined || value === '') return '';
  const num = Number(value);
  if (isNaN(num)) return '';
  
  // Redondear a la precisión deseada
  const fixed = num.toFixed(decimals);
  const parsed = parseFloat(fixed);
  
  // Si el número es entero, mostrarlo sin decimales
  if (parsed === Math.floor(parsed)) {
    return parsed.toString();
  }
  
  // Si no, mostrar con la cantidad mínima de decimales necesaria
  // parseFloat automáticamente elimina ceros trailing
  return parsed.toString();
};

/**
 * Formatea un número para enviarlo al backend
 * Convierte a número con precisión fija y lo devuelve como número (no string)
 * 
 * @param {number|string|null|undefined} value - El valor a formatear
 * @param {number} decimals - Número de decimales de precisión (por defecto 3)
 * @returns {number|null} - El número formateado, o null si es inválido
 * 
 * @example
 * formatNumberForBackend("70.5") // 70.5
 * formatNumberForBackend(1.4699999999) // 1.47
 * formatNumberForBackend("") // null
 * formatNumberForBackend(null) // null
 */
export const formatNumberForBackend = (value, decimals = 3) => {
  if (value === undefined || value === null || value === '') return null;
  const num = Number(value);
  if (isNaN(num)) return null;
  // Retornar número parseado con precisión fija
  return parseFloat(num.toFixed(decimals));
};

/**
 * Formatea un número con precisión específica para tallas
 * Las tallas típicamente usan 2 decimales (metros)
 * 
 * @param {number|string|null|undefined} value - El valor de la talla
 * @returns {string} - La talla formateada
 * 
 * @example
 * formatHeight(1.4699999999) // "1.47"
 * formatHeight(1.80) // "1.8"
 * formatHeight(2) // "2"
 */
export const formatHeight = (value) => {
  return formatNumberForDisplay(value, 2);
};

/**
 * Formatea un número con precisión específica para pesos
 * Los pesos típicamente usan 3 decimales (kilogramos)
 * 
 * @param {number|string|null|undefined} value - El valor del peso
 * @returns {string} - El peso formateado
 * 
 * @example
 * formatWeight(70.5) // "70.5"
 * formatWeight(70.500) // "70.5"
 * formatWeight(75) // "75"
 */
export const formatWeight = (value) => {
  return formatNumberForDisplay(value, 3);
};

