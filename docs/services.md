# Servicios

Los servicios gestionan la comunicación con APIs, notificaciones y otras funcionalidades externas. Están organizados por tipo y por módulo, siguiendo una arquitectura modular y escalable.

## Organización
- **Servicios de API**: `src/services/api/Axios/`
- **Servicios de notificaciones**: `src/services/toastify/`
- **Servicios por módulo**: `src/features/[modulo]/service/`
- **Utilidades generales**: `src/utils/`
- **Librerías compartidas**: `src/lib/`

## Servicios de API

### Configuración Base
**Ubicación**: `src/services/api/Axios/`

- **baseConfig.js**: Configuración base de Axios con interceptores
  - URL base de la API
  - Headers por defecto
  - Manejo de tokens de autenticación
  - Interceptores de request y response

- **MethodsGeneral.js**: Métodos HTTP reutilizables
  - `get(url, config)`: Peticiones GET
  - `post(url, data, config)`: Peticiones POST
  - `patch(url, data, config)`: Peticiones PATCH
  - `delete(url, config)`: Peticiones DELETE
  - `put(url, data, config)`: Peticiones PUT

## Servicios de Notificaciones

### Toastify
**Ubicación**: `src/services/toastify/`

- **toastConfig.js**: Configuración de notificaciones toast
  - Tipos de notificación (success, error, warning, info)
  - Duración y posición
  - Estilos personalizados

- **ToastContext.jsx**: Contexto global para notificaciones
  - `showToast(type, message)`: Muestra notificación
  - Mensajes predefinidos para acciones comunes
  - Integración con toda la aplicación

## Servicios por Módulo

### Autenticación
**Ubicación**: `src/features/auth/service/authService.js`
- Login de usuario
- Logout y cierre de sesión
- Cambio de contraseña
- Verificación de token

### Pacientes
**Ubicación**: `src/features/patients/service/patientsService.js`
- CRUD completo de pacientes
- Búsqueda por DNI, nombre o apellido
- Paginación de resultados
- Obtención de historial

### Historial
**Ubicación**: `src/features/history/service/historyService.js`
- Obtención de historial por paciente
- Obtención de historial por ID
- Actualización de historial
- Gestión de terapeutas asociados
- Búsqueda de personal (staff)

### Citas
**Ubicación**: `src/features/appointments/service/appointmentsService.js`
- Registro de nuevas citas
- Actualización de citas existentes
- Búsqueda y filtrado por fechas
- Cambio de estado de citas

### Citas Completadas
**Ubicación**: `src/features/appointmentsComplete/service/appointmentsCompleteService.js`
- Listado de citas finalizadas
- Filtros por terapeuta y fecha
- Estadísticas de completadas

### Calendario
**Ubicación**: `src/features/calendar/service/calendarService.js`
- Obtención de eventos del calendario
- Actualización de fechas de citas
- Drag & drop de eventos

### Reportes
**Ubicación**: `src/features/reports/service/reportsService.js`
- Generación de reporte de caja diario
- Reporte de terapeutas por día
- Reporte de pacientes por terapeuta
- Actualización de reportes de caja
- Exportación de datos

### Staff/Personal
**Ubicación**: `src/features/staff/service/staffService.js`
- CRUD de terapeutas
- Búsqueda con paginación
- Obtención de información detallada

### Estadísticas
**Ubicación**: `src/features/statistic/services/statisticService.js`
- Obtención de métricas del dashboard
- Estadísticas por período
- Datos para gráficos
- KPIs principales

### Home
**Ubicación**: `src/features/home/service/homeService.js`
- Citas del día actual
- Resumen de actividades
- Accesos rápidos

### Configuración

#### Perfil
**Ubicación**: `src/features/configuration/cProfile/service/profileService.js`
- Actualización de perfil de usuario
- Cambio de información personal

#### Anticonceptivos
**Ubicación**: `src/features/configuration/cContraceptive/service/contraceptiveService.js`
- Gestión de métodos anticonceptivos
- CRUD de tipos de DIU

#### Pagos
**Ubicación**: `src/features/configuration/cPayments/paymentsServices.js`
- Gestión de métodos de pago
- Configuración de precios predeterminados

#### Sistema
**Ubicación**: `src/features/configuration/cSystem/services/systemServices.js`
- Configuración general del sistema
- Parámetros globales

#### Usuarios
**Ubicación**: `src/features/configuration/cUsers/usersServices.js`
- Gestión de usuarios del sistema
- Roles y permisos

## Utilidades

### Gestión de Datos
**Ubicación**: `src/utils/`

- **localStorageUtility.js**: Helpers para localStorage
  - Guardado y recuperación segura de datos
  - Manejo de errores de parsing
  - Limpieza de datos corruptos

- **dayjsConfig.js**: Configuración de Day.js
  - Formato de fechas español
  - Plugins instalados
  - Locale configurado

- **messageFormatter.js**: Formateo de mensajes
  - Mensajes de error amigables
  - Normalización de texto

- **numberFormatter.js**: Formateo de números
  - `formatNumberForDisplay()`: Formato para mostrar (1.47, 70.5)
  - `formatNumberForBackend()`: Formato para enviar al backend
  - `formatHeight()`: Formato específico para altura
  - `formatWeight()`: Formato específico para peso

- **vars.js**: Variables y constantes globales
  - URLs de la API
  - Constantes de configuración
  - Valores por defecto

### Librerías Compartidas
**Ubicación**: `src/lib/`

- **chartUtils.ts**: Utilidades para gráficos (TypeScript)
  - Formateo de datos para gráficos
  - Configuraciones de ApexCharts
  - Helpers para visualización

### Constantes
**Ubicación**: `src/constants/`

- **chartRanges.ts**: Rangos predefinidos para gráficos (TypeScript)
  - Períodos de tiempo
  - Configuración de ejes
  - Colores y temas

## Ejemplo de uso

### Servicio de API
```javascript
import { getPatientHistoryById } from '../features/history/service/historyService';

const fetchHistory = async (patientId) => {
  try {
    const response = await getPatientHistoryById(patientId);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial:', error);
  }
};
```

### Notificaciones
```javascript
import { useToast } from '../services/toastify/ToastContext';

const MyComponent = () => {
  const { showToast } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      showToast('success', 'Datos guardados correctamente');
    } catch (error) {
      showToast('error', 'Error al guardar los datos');
    }
  };
};
```

### Utilidades
```javascript
import { formatWeight, formatHeight } from '../utils/numberFormatter';
import dayjs from '../utils/dayjsConfig';

const displayData = {
  weight: formatWeight(70.123), // "70.12"
  height: formatHeight(1.4699), // "1.47"
  date: dayjs().format('DD-MM-YYYY') // "14-10-2025"
};
```

## Patrones Comunes

Todos los servicios siguen estos patrones:

### Manejo de Errores
```javascript
try {
  const response = await apiCall();
  return response.data;
} catch (error) {
  throw error;
}
```

### Estructura de Respuesta
```javascript
{
  data: {...},      // Datos principales
  message: "...",   // Mensaje del servidor
  success: true     // Estado de la operación
}
```

Consulta cada archivo para ver los métodos y ejemplos de uso específicos.
