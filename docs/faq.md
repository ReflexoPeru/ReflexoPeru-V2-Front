# Preguntas Frecuentes (FAQ)

Respuestas a las preguntas más comunes sobre ReflexoPeru-V2-Front.

## 🚀 Instalación y Configuración

### ¿Qué versión de Node.js necesito?
Se requiere **Node.js 18 o superior**. Puedes verificar tu versión con:
```bash
node --version
```

### ¿Cómo configuro la URL del backend?
La URL de la API se configura en:
- `src/utils/vars.js`
- `src/services/api/Axios/baseConfig.js`

También puedes usar variables de entorno:
```env
VITE_API_URL=https://api.reflexoperu.com
```

### ¿Cómo instalo las dependencias?
```bash
npm install
# o
yarn install
```

### El servidor de desarrollo no inicia, ¿qué hago?
1. Verifica que el puerto 5173 esté libre
2. Elimina `node_modules` y reinstala:
```bash
rm -rf node_modules
npm install
npm run dev
```

---

## 🔐 Autenticación y Sesión

### ¿Dónde se guarda el token de autenticación?
El token se almacena en `localStorage` con la clave `token`.

### ¿Por qué me sale "Token expirado"?
El token JWT tiene una duración limitada configurada en el backend. Cuando expira, debes iniciar sesión nuevamente.

### ¿Cómo cierro sesión?
Usa el botón de logout en el header o ejecuta:
```javascript
localStorage.removeItem('token');
navigate('/login');
```

### ¿Puedo tener múltiples sesiones abiertas?
Sí, pero cada tab/ventana necesita su propio token. El sistema no sincroniza sesiones entre tabs actualmente.

---

## 🎨 Temas y Estilos

### ¿Cómo cambio entre modo claro y oscuro?
Usa el componente `ThemeToggle` en el header o programa ticamente:
```javascript
const { toggleTheme } = useTheme();
toggleTheme();
```

### ¿Dónde se guarda la preferencia de tema?
En `localStorage` con la clave `theme` (valores: `'light'` o `'dark'`).

### ¿Cómo personalizo los colores del tema?
Edita las variables CSS en `src/css/VarColors.css`:
```css
:root {
  --color-primary: #1677ff;
  /* ... más variables */
}
```

### ¿Por qué los estilos no se aplican correctamente?
1. Verifica que estés usando CSS Modules correctamente
2. Revisa que las variables CSS estén definidas
3. Limpia el caché del navegador
4. Ejecuta `npm run dev` nuevamente

---

## 📊 Datos y API

### ¿Cómo funciona el sistema de caché?
El sistema de caché en `SelectsApi.js` almacena respuestas de APIs frecuentes:
- Países
- Regiones/Provincias/Distritos
- Tipos de documento
- Métodos de pago
- Diagnósticos
- Métodos anticonceptivos

### ¿Cómo limpio el caché?
```javascript
import { clearApiCache } from '../components/Select/SelectsApi';
clearApiCache();
```

### ¿Por qué no se actualizan los datos?
1. Verifica tu conexión al backend
2. Revisa la consola del navegador para errores
3. Ejecuta un refetch manual si el componente lo permite
4. Limpia el caché si es necesario

### ¿Cómo manejo errores de API?
Los servicios lanzan errores que debes capturar:
```javascript
try {
  await saveData();
  showToast('success', 'Guardado');
} catch (error) {
  showToast('error', error.message);
}
```

---

## 🔍 Búsqueda y Filtros

### ¿Por qué la búsqueda tiene delay?
Implementamos **debouncing** de 1 segundo para reducir llamadas innecesarias al backend. Esto mejora el rendimiento.

### ¿Cómo busco un paciente por DNI?
Usa el componente `DNISearchInput` o busca en la tabla de pacientes ingresando el DNI en el campo de búsqueda.

### ¿Los filtros se combinan?
Sí, los filtros son acumulativos. Por ejemplo, puedes filtrar por terapeuta Y por fecha simultáneamente.

### ¿Se pueden guardar filtros favoritos?
Actualmente no, pero está en el roadmap para futuras versiones.

---

## 📋 Formularios y Validaciones

### ¿Qué campos son obligatorios?
Los campos obligatorios están marcados con asterisco (*) y tienen validación en tiempo real.

### ¿Por qué no puedo guardar un formulario?
1. Verifica que todos los campos obligatorios estén completos
2. Revisa que los formatos sean correctos (email, teléfono, etc.)
3. Mira la consola para mensajes de error
4. Asegúrate de tener conexión al backend

### ¿Cómo funciona la validación de DNI?
El DNI debe tener exactamente 8 dígitos numéricos. La validación es automática.

### ¿Puedo editar datos después de guardar?
Sí, la mayoría de datos son editables excepto ciertos campos críticos que requieren permisos especiales.

---

## 👥 Pacientes e Historial

### ¿Cómo registro un nuevo paciente?
1. Ve a "Pacientes" → "Nuevo Paciente"
2. Completa el formulario
3. Haz clic en "Guardar"

### ¿Cómo accedo al historial médico?
Desde la lista de pacientes, haz clic en "Ver Historial" o accede directamente a `/pacientes/:id/historial`.

### ¿Qué pasa si ingreso un peso "hoy"?
Al guardar, el sistema automáticamente:
- Mueve el "Peso Anterior" a histórico
- El "Peso Hoy" se convierte en "Peso Anterior"
- El campo "Peso Hoy" se limpia para la próxima consulta

### ¿Los campos de anticonceptivos son obligatorios?
Solo aparecen para pacientes de sexo femenino y no son obligatorios, pero se recomienda completarlos.

---

## 📅 Citas y Calendario

### ¿Cómo creo una cita?
1. Ve a "Citas" → "Nueva Cita"
2. Busca y selecciona el paciente
3. Completa fecha, hora y terapeuta
4. Guarda la cita

### ¿Puedo mover citas en el calendario?
Sí, el calendario soporta **drag & drop**. Arrastra la cita a la nueva fecha y se actualizará automáticamente.

### ¿Qué significan los colores en el calendario?
- **Azul**: Cita pendiente
- **Verde**: Cita completada
- **Rojo**: Cita cancelada
- **Amarillo**: Cita en proceso

### ¿Cómo filtro citas por terapeuta en el calendario?
Usa el selector de terapeuta en la parte superior del calendario.

---

## 📊 Reportes y PDFs

### ¿Cómo genero un reporte?
1. Ve a "Reportes"
2. Selecciona el tipo de reporte
3. Configura los filtros (fecha, terapeuta, etc.)
4. Haz clic en "Generar PDF" o "Vista Previa"

### ¿Puedo editar un reporte antes de generarlo?
Sí, el reporte de caja permite editar montos antes de generar el PDF final.

### ¿Los PDFs se guardan automáticamente?
No, se generan on-demand. Debes descargarlos manualmente desde el visor de PDF.

### ¿Puedo exportar a Excel?
Actualmente solo hay vista previa estilo Excel. La exportación real a Excel está en desarrollo.

---

## ⚙️ Configuración

### ¿Quién puede acceder a la configuración?
Solo usuarios con rol de **Administrador** pueden acceder al panel de configuración completo.

### ¿Cómo cambio mi contraseña?
Ve a "Configuración" → "Perfil" → "Cambiar Contraseña"

### ¿Puedo agregar nuevos métodos de pago?
Sí, desde "Configuración" → "Métodos de Pago" puedes agregar, editar o eliminar métodos de pago.

### ¿Cómo agrego un nuevo tipo de anticonceptivo?
Ve a "Configuración" → "Anticonceptivos" y usa el botón "Nuevo Método".

---

## 🐛 Problemas Comunes

### Error: "localStorage is corrupted"
Ejecuta el script de limpieza:
```javascript
// En consola del navegador
localStorage.clear();
location.reload();
```

O usa el archivo incluido `clean-localStorage.js`.

### Error: "Network Error"
1. Verifica que el backend esté corriendo
2. Comprueba la URL de la API en la configuración
3. Revisa tu conexión a internet
4. Verifica los CORS en el backend

### Error: "Cannot read property of undefined"
Esto suele indicar que:
1. Los datos aún no se han cargado (problema de timing)
2. El backend devolvió una estructura diferente
3. Hay un error en la lógica del componente

Revisa la consola para más detalles.

### La aplicación está lenta
1. Limpia el caché del navegador
2. Verifica tu conexión a internet
3. Comprueba que no haya muchas tabs abiertas
4. Ejecuta `npm run build` para una versión optimizada

### No se muestran los íconos
Verifica que la librería `@phosphor-icons/react` esté instalada:
```bash
npm list @phosphor-icons/react
```

### Error al compilar (build)
1. Elimina `dist/` y `node_modules/`
2. Reinstala dependencias: `npm install`
3. Ejecuta: `npm run build`
4. Revisa errores de TypeScript si los hay

---

## 🔧 Desarrollo

### ¿Cómo agrego un nuevo feature?
1. Crea la estructura de carpetas:
```
src/features/mi-feature/
├── ui/
├── hook/
└── service/
```
2. Implementa los componentes, lógica y servicios
3. Agrega las rutas en `Router.jsx`
4. Actualiza la documentación

### ¿Cómo creo un nuevo componente reutilizable?
1. Crea una carpeta en `src/components/MiComponente/`
2. Agrega el componente: `MiComponente.jsx`
3. Agrega los estilos: `MiComponente.module.css`
4. Exporta el componente

### ¿Debo usar TypeScript?
No es obligatorio, pero se recomienda para:
- Componentes de gráficos
- Utilidades compartidas
- Constantes y configuraciones
- Librerías complejas

### ¿Cómo hago debugging?
1. Usa React DevTools
2. Console.log estratégicamente
3. Usa breakpoints en el navegador
4. Revisa Network tab para llamadas API

### ¿Qué linter usa el proyecto?
**Biome** para JavaScript y **Stylelint** para CSS.

Ejecuta:
```bash
npm run lint        # JavaScript
npm run stylelint   # CSS
```

---

## 📚 Recursos Adicionales

### ¿Dónde encuentro más documentación?
- `/docs/arquitectura.md` - Arquitectura del proyecto
- `/docs/components.md` - Componentes disponibles
- `/docs/hooks.md` - Hooks personalizados
- `/docs/services.md` - Servicios y APIs
- `/docs/routes.md` - Sistema de rutas
- `/docs/styles.md` - Guía de estilos
- `/docs/features.md` - Funcionalidades detalladas

### ¿Hay ejemplos de código?
Sí, cada archivo de documentación incluye ejemplos. También puedes revisar los componentes existentes como referencia.

### ¿Dónde reporto bugs?
Abre un issue en el repositorio del proyecto con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs actual
- Screenshots si aplica
- Versión del navegador

### ¿Cómo contribuyo al proyecto?
1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Haz commits descriptivos
4. Push y abre un Pull Request
5. Espera la revisión

---

## 💡 Tips y Mejores Prácticas

### Rendimiento
- Usa el sistema de caché cuando sea posible
- Implementa paginación para listas grandes
- Evita re-renders innecesarios con `useMemo` y `useCallback`

### Estilos
- Usa variables CSS en lugar de valores hardcodeados
- Prefiere CSS Modules para evitar conflictos
- Mantén los estilos junto al componente

### Código
- Un componente, una responsabilidad
- Hooks para lógica, componentes para UI
- Services para toda comunicación con API
- Nombres descriptivos y consistentes

### Seguridad
- Nunca guardes información sensible en localStorage sin encriptar
- Valida siempre los datos del usuario
- Usa HTTPS en producción
- Mantén las dependencias actualizadas

---

¿No encontraste tu pregunta? Consulta la documentación completa en `/docs` o contacta al equipo de desarrollo.


