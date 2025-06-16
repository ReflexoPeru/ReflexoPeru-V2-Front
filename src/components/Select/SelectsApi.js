import { get } from '../../services/api/Axios/MethodsGeneral';

// Servicios para selects de ubicación
export const getCountries = async () => {
  const response = await get('ubigeo/countries');
  return response.data || [];
};

export const getDepartaments = async () => {
  const response = await get('ubigeo/regions');
  return response.data || [];
};

export const getProvinces = async (departamentId) => {
  const response = await get(`ubigeo/provinces/${departamentId}`);
  return response.data || [];
};

export const getDistricts = async (provinceId) => {
  const response = await get(`ubigeo/districts/${provinceId}`);
  return response.data || [];
};

// Servicios para selects de documentos
export const getDocumentTypes = async () => {
  const response = await get('document-types'); // Endpoint exacto
  return response.data?.map(item => ({
    value: item.id,
    label: item.name,
    description: item.description // Opcional: para tooltips o info adicional
  })) || [];
};

// Servicios para estados de pago
export const getPaymentStatuses = async () => {
  const response = await get('payment-types'); // Endpoint exacto
  return response.data?.map(item => ({
    value: item.id,
    label: item.name
  })) || [];
};

// Servicios para precios predeterminados
export const getPredeterminedPrices = async () => {
  const response = await get('predetermined-prices'); // Endpoint exacto
  return response.data?.map(item => ({
    value: item.id,
    label: item.name,
    price: item.price // Agregamos el precio como propiedad adicional
  })) || [];
};

// Servicios para diagnósticos  =====================> FALTA COLOCAR LA API UBICARLO EN LA CARPETA CORRECTA
export const getDiagnoses = async () => {
  const response = await get('diagnosticos');
  return response.data?.map(item => ({
    id: item.id || item.codigo,
    name: item.nombre || item.descripcion
  })) || [];
};