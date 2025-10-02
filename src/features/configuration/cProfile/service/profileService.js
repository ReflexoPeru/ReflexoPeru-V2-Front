import {
  get,
  put,
  post,
  patch,
} from '../../../../services/api/Axios/MethodsGeneral';
import instance from '../../../../services/api/Axios/baseConfig';

// Cache para peticiones
const apiCache = new Map();

const cachedRequest = async (key, requestFn) => {
  const now = Date.now();

  // Verificar si existe en caché y no ha expirado (5 minutos)
  if (apiCache.has(key)) {
    const { data, timestamp } = apiCache.get(key);
    if (now - timestamp < 300000) {
      // 5 minutos
      return data;
    }
  }

  // Hacer la petición real
  const response = await requestFn();
  apiCache.set(key, {
    data: response.data,
    timestamp: now,
  });

  return response.data;
};

export const createPatient = async (data) => {
  try {
    const response = await post('sendVerifyCode', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const verifyCode = async (code) => {
  try {
    const response = await post('verification', { code });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfileEmail = async (email) => {
  try {
    const response = await patch('profile', { email });
    // Invalidar caché del perfil
    apiCache.delete('profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    return await cachedRequest('profile', () => get('profile'));
  } catch (error) {
    throw error;
  }
};

export const updateAllProfile = async (data) => {
  try {
    const res = await put('profile', data);
    // Invalidar caché del perfil
    apiCache.delete('profile');
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const validatePassword = async (data) => {
  try {
    const res = await post('validate-password', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data) => {
  try {
    const res = await put('change-password', data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

//CONSEGUIR LA FOTO DE PERFIL -> (GET)
export const getUserPhoto = async (signal) => {
  try {
    const response = await instance.get('users/photo', {
      responseType: 'blob',
      headers: {
        'Cache-Control': 'no-cache'
      },
      signal
    });

    // Convertir blob a URL para mostrarla como imagen
    return URL.createObjectURL(response.data);
  } catch (error) {
    throw error;
  }
}

//ACTUALIZAR LA FOTO DE PERFIL -> (POST)
export const uploadProfilePhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await instance.post('users/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}