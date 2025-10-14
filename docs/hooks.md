# Hooks Personalizados

Los hooks encapsulan lógica reutilizable y permiten separar la lógica de negocio de los componentes. En este proyecto, los hooks están organizados por módulo y también existen hooks globales.

## Organización
- **Hooks globales**: `src/hooks/`
- **Hooks por módulo**: `src/features/[modulo]/hook/`

## Hooks Globales

### src/hooks/
- **loginpacticles.js**: Efectos visuales de partículas para la pantalla de login
- **usePageAnimation.js**: Hook para animaciones de transición entre páginas

## Hooks por Feature/Módulo

### Autenticación (auth)
**Ubicación**: `src/features/auth/hook/authHook.js`
- Manejo de login y logout
- Gestión del estado de autenticación
- Cambio de contraseña
- Primera sesión de usuario

### Pacientes (patients)
**Ubicación**: `src/features/patients/hook/patientsHook.js`
- Registro de nuevos pacientes
- Edición de información del paciente
- Búsqueda y filtrado de pacientes
- Obtención de información detallada del paciente

### Historial de Pacientes (history)
**Ubicación**: `src/features/history/hook/historyHook.js`
- `usePatientHistory`: Obtiene y gestiona el historial completo del paciente
- `useHistoryById`: Obtiene historial por ID específico
- `useUpdatePatientHistory`: Actualiza información del historial
- `useStaff`: Gestión de lista de terapeutas con búsqueda y paginación
- `usePatientAppointments`: Obtiene todas las citas de un paciente
- `useUpdateAppointment`: Actualiza información de citas

### Citas (appointments)
**Ubicación**: `src/features/appointments/hook/appointmentsHook.js`
- Registro de nuevas citas
- Edición de citas existentes
- Búsqueda y filtrado de citas
- Gestión del estado de las citas

### Citas Completadas (appointmentsComplete)
**Ubicación**: `src/features/appointmentsComplete/hook/appointmentsCompleteHook.js`
- Listado de citas finalizadas
- Filtrado por fechas y terapeutas
- Estadísticas de citas completadas

### Calendario (calendar)
**Ubicación**: `src/features/calendar/hook/calendarHook.js`
- Gestión de eventos del calendario
- Visualización de citas por fecha
- Drag & drop de citas
- Filtros de calendario

### Reportes (reports)
**Ubicación**: `src/features/reports/hook/reportsHook.js`
- Generación de reportes diarios
- Reporte de caja
- Reporte de terapeutas
- Reporte de pacientes por terapeuta
- Filtrado y exportación de datos

### Staff/Personal (staff)
**Ubicación**: `src/features/staff/hook/staffHook.js`
- Registro de nuevos terapeutas
- Edición de información del terapeuta
- Búsqueda y filtrado de personal
- Precarga de datos para optimización (`preloadEditData`)
- Sistema de caché para mejorar rendimiento

### Estadísticas (statistic)
**Ubicación**: `src/features/statistic/hook/useStatistic.js`
- Métricas del dashboard
- Estadísticas de citas por período
- Gráficos de sesiones
- KPIs principales

### Home (home)
**Ubicación**: `src/features/home/hook/homeHook.js`
- Citas del día
- Accesos rápidos
- Banner de bienvenida
- Resumen de actividades recientes

### Configuración

#### Perfil (configuration/cProfile)
**Ubicación**: `src/features/configuration/cProfile/hook/profileHook.js`
- Edición de perfil de usuario
- Actualización de información personal

#### Anticonceptivos (configuration/cContraceptive)
**Ubicación**: `src/features/configuration/cContraceptive/hook/contraceptiveHook.js`
- Gestión de métodos anticonceptivos
- CRUD de tipos de DIU

#### Pagos (configuration/cPayments)
**Ubicación**: `src/features/configuration/cPayments/paymentsHook.js`
- Gestión de métodos de pago
- Configuración de precios

#### Sistema (configuration/cSystem)
**Ubicación**: `src/features/configuration/cSystem/hook/systemHook.js`
- Configuración general del sistema
- Parámetros de la aplicación

#### Usuarios (configuration/cUsers)
**Ubicación**: `src/features/configuration/cUsers/usersHook.js`
- Gestión de usuarios del sistema
- Roles y permisos

## Patrones Comunes

Todos los hooks del proyecto siguen patrones consistentes:

### Estados Estándar
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

### Funciones de Refetch
Muchos hooks exponen una función `refetch()` para recargar datos:
```javascript
const { data, loading, refetch } = usePatientHistory(id);
```

### Optimizaciones
Los hooks implementan optimizaciones como:
- **Debouncing** en búsquedas
- **Caché** de datos frecuentemente accedidos
- **Precarga** de datos antes de mostrar modales
- **Paginación** para grandes conjuntos de datos

## Ejemplo de uso
```javascript
import { usePatientHistory } from '../features/history/hook/historyHook';

const PatientDetail = ({ patientId }) => {
  const { data, loading, error, refetch } = usePatientHistory(patientId);
  
  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return (
    <div>
      <h1>{data?.patient?.name}</h1>
      <button onClick={refetch}>Actualizar</button>
    </div>
  );
};
```

Cada hook está documentado en su archivo correspondiente. Revisa los comentarios en el código fuente para ver los detalles de uso y parámetros disponibles.
