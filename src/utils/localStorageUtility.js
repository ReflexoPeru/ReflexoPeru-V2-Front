export const persistLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalStorage = (key) => localStorage.removeItem(key);

export const getLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    
    // Intentar parsear como JSON
    try {
      return JSON.parse(item);
    } catch (jsonError) {
      // Si no es JSON válido, devolver el string tal como está
      return item;
    }
  } catch (error) {
    console.warn(`Error al obtener ${key} del localStorage:`, error);
    return null;
  }
};

export const clearLocalStorage = () => localStorage.clear();

// Función específica para obtener strings simples (como temas)
export const getLocalStorageString = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Error al obtener ${key} del localStorage:`, error);
    return null;
  }
};

// Función específica para guardar strings simples
export const setLocalStorageString = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Error al guardar ${key} en localStorage:`, error);
  }
};
