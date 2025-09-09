// Script para limpiar localStorage corrupto
// Ejecutar este script en la consola del navegador si hay problemas con localStorage

console.log('🧹 Iniciando limpieza de localStorage...');

// Lista de claves conocidas que pueden causar problemas
const keysToCheck = ['theme', 'token', 'user_id', 'name'];

keysToCheck.forEach(key => {
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      console.log(`📋 Verificando ${key}:`, item);
      
      // Si es la clave 'theme', debe ser solo 'dark' o 'light'
      if (key === 'theme') {
        if (item !== 'dark' && item !== 'light') {
          console.warn(`❌ Valor inválido para theme: ${item}, limpiando...`);
          localStorage.removeItem(key);
          localStorage.setItem(key, 'dark'); // Establecer por defecto
          console.log('✅ Theme restablecido a "dark"');
        } else {
          console.log(`✅ Theme válido: ${item}`);
        }
        return;
      }
      
      // Para otras claves, intentar parsear JSON
      try {
        JSON.parse(item);
        console.log(`✅ ${key} es JSON válido`);
      } catch (jsonError) {
        // Si no es JSON válido pero es un string simple, podría estar bien
        if (typeof item === 'string' && item.length > 0 && !item.startsWith('{') && !item.startsWith('[')) {
          console.log(`✅ ${key} es string simple válido`);
        } else {
          console.warn(`❌ ${key} tiene JSON corrupto: ${item}, limpiando...`);
          localStorage.removeItem(key);
          console.log(`🗑️ ${key} eliminado`);
        }
      }
    } else {
      console.log(`📭 ${key} no existe en localStorage`);
    }
  } catch (error) {
    console.error(`❌ Error procesando ${key}:`, error);
  }
});

console.log('✅ Limpieza completada. Recarga la página para aplicar los cambios.');
console.log('🔄 Ejecuta: location.reload()');
