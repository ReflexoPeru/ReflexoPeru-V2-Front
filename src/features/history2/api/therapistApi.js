import { get } from '../../../services/api/Axios/MethodsGeneral';
import { PAGINATION_CONFIG } from '../constants';

/**
 * API para gestión de terapeutas
 * Maneja listado, búsqueda y paginación
 */

/**
 * Normaliza la respuesta del API de terapeutas
 * Maneja diferentes formatos de respuesta del backend
 * @param {Object} response - Respuesta del API
 * @returns {Object} {data: Array, total: number}
 */
const normalizeTherapistResponse = (response) => {
  let data = [];
  let total = 0;

  if (!response?.data) {
    return { data, total };
  }

  // Formato 1: { data: { data: [], total: number } }
  if (response.data.data && Array.isArray(response.data.data)) {
    data = response.data.data;
    total = response.data.total || 0;
  }
  // Formato 2: { data: [] }
  else if (Array.isArray(response.data)) {
    data = response.data;
    total = data.length;
  }
  // Formato 3: { data: { items: [], total: number } }
  else if (Array.isArray(response.data.items)) {
    data = response.data.items;
    total = response.data.total || data.length;
  }

  return { data, total };
};

/**
 * Obtiene lista de terapeutas con paginación
 * @param {number} page - Número de página
 * @param {number} perPage - Items por página
 * @returns {Promise<Object>} {data: Array, total: number}
 */
export const getTherapists = async (
  page = PAGINATION_CONFIG.DEFAULT_PAGE,
  perPage = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE
) => {
  try {
    const response = await get(`therapists?page=${page}&per_page=${perPage}`);
    return normalizeTherapistResponse(response);
  } catch (error) {
    console.error('[therapistApi] Error fetching therapists:', error);
    throw error;
  }
};

/**
 * Busca terapeutas por término
 * @param {string} searchTerm - Término de búsqueda
 * @param {number} page - Número de página
 * @param {number} perPage - Items por página
 * @returns {Promise<Object>} {data: Array, total: number}
 */
export const searchTherapists = async (
  searchTerm,
  page = PAGINATION_CONFIG.DEFAULT_PAGE,
  perPage = PAGINATION_CONFIG.DEFAULT_PAGE_SIZE
) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return getTherapists(page, perPage);
  }

  try {
    const encodedTerm = encodeURIComponent(searchTerm.trim());
    const response = await get(
      `therapists/search?search=${encodedTerm}&page=${page}&per_page=${perPage}`
    );
    return normalizeTherapistResponse(response);
  } catch (error) {
    console.error('[therapistApi] Error searching therapists:', error);
    throw error;
  }
};

/**
 * Formatea el nombre completo de un terapeuta
 * @param {Object} therapist - Objeto terapeuta
 * @returns {string} Nombre completo formateado
 */
export const formatTherapistName = (therapist) => {
  if (!therapist) {
    return '';
  }

  const { paternal_lastname = '', maternal_lastname = '', name = '' } = therapist;
  return `${paternal_lastname} ${maternal_lastname} ${name}`.trim();
};

/**
 * Encuentra un terapeuta por ID en una lista
 * @param {Array} therapists - Lista de terapeutas
 * @param {number} therapistId - ID a buscar
 * @returns {Object|null} Terapeuta encontrado o null
 */
export const findTherapistById = (therapists, therapistId) => {
  if (!Array.isArray(therapists) || !therapistId) {
    return null;
  }

  return therapists.find((t) => t.id === therapistId) || null;
};

