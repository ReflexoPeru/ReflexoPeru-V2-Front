# Features y Funcionalidades

Documentación detallada de todas las funcionalidades y módulos del sistema ReflexoPeru.

## 🏠 Home (Inicio)

**Ubicación**: `src/features/home/`

Página principal tras el login que muestra:

### Componentes
- **WelcomeBanner**: Banner de bienvenida personalizado con el nombre del usuario
- **TodayAppointments**: Lista de citas programadas para el día actual
- **QuickAccess**: Accesos rápidos a las funcionalidades más usadas

### Funcionalidades
- Vista rápida de actividades del día
- Navegación rápida a módulos principales
- Resumen de citas pendientes

---

## 📊 Dashboard (Estadísticas)

**Ubicación**: `src/features/statistic/`

Panel de control con métricas y estadísticas visuales.

### Componentes
- **Dashboard**: Vista principal del dashboard
- **DashboardMetrics**: Tarjetas de KPIs principales
- **DashboardFilters**: Filtros por período
- **DashboardBottomSection**: Sección inferior con gráficos adicionales
- **ChartSkeleton**: Skeleton para carga de gráficos
- **SkeletonLoading**: Estados de carga

### Funcionalidades
- Métricas en tiempo real
- Gráficos interactivos con ApexCharts
- Filtrado por rangos de fecha personalizados
- KPIs: Total de citas, ingresos, pacientes activos, terapeutas
- Gráfico de sesiones por período
- Comparativas de rendimiento

### Tecnología
- TypeScript en utilidades de gráficos (`chartUtils.ts`)
- Constantes de rangos (`chartRanges.ts`)
- ApexCharts para visualizaciones

---

## 👥 Gestión de Pacientes

**Ubicación**: `src/features/patients/`

CRUD completo para la gestión de pacientes.

### Funcionalidades

#### Listado de Pacientes
- Tabla con paginación
- Búsqueda por DNI, nombre o apellidos
- Filtros avanzados
- Acciones: Ver info, Editar, Ver historial

#### Registro de Nuevo Paciente
**Componente**: `RegisterPatient/NewPatient.jsx`

Campos:
- Datos personales (nombres, apellidos, DNI)
- Tipo de documento (DNI, Pasaporte, Carnet de Extranjería)
- Fecha de nacimiento
- Sexo
- País
- Ubicación (Departamento → Provincia → Distrito) con selector en cascada
- Dirección detallada
- Teléfono y correo electrónico
- Ocupación

#### Edición de Paciente
**Componente**: `EditPatient/EditPatient.jsx`
- Todos los campos del registro son editables
- Precarga de datos del paciente
- Validaciones en tiempo real

#### Información del Paciente
**Componente**: `InfoPatient/infopatient.jsx`
- Vista detallada de todos los datos
- Acceso al historial médico
- Lista de citas del paciente

---

## 📋 Historial Médico

**Ubicación**: `src/features/history/`

Gestión completa del historial clínico de pacientes.

### Funcionalidades

#### Vista del Historial
**Componente**: `PatientHistory.jsx`

Secciones:
1. **Datos del Paciente**: Nombre completo (solo lectura)
2. **Observaciones**: Observación privada y pública
3. **Citas**: Selector de fecha de cita
4. **Terapeuta**: Asignación de terapeuta con búsqueda
5. **Información Médica**:
   - Diagnósticos médicos
   - Medicamentos actuales
   - Operaciones previas
   - Dolencias
   - Observaciones adicionales
   - Diagnósticos de reflexología
6. **Información Física**:
   - Talla (formato: 1.47 m)
   - Peso inicial
   - Peso anterior
   - Peso hoy
7. **Campos Específicos para Mujeres**:
   - Menstruación (Sí/No)
   - Gestación (Sí/No)
   - ¿Usa método anticonceptivo? (Sí/No)
   - Método anticonceptivo (selector)
   - Tipo de DIU (si aplica)
8. **Fechas**: Fecha de inicio del tratamiento
9. **Acciones**:
   - Generar boleta (PDF)
   - Generar ticket (PDF)
   - Guardar cambios
   - Cancelar

### Sistema de Pesos
- **Peso Inicial**: Peso del paciente al inicio del tratamiento
- **Peso Anterior**: Último peso registrado
- **Peso Hoy**: Peso actual (al guardar, se convierte en peso anterior)

### Generación de PDFs
- **FichaPDF**: Ficha médica completa con todos los datos
- **TicketPDF**: Boleta de pago/consulta

### Optimizaciones
- Sistema de caché para terapeutas
- Búsqueda de terapeutas con paginación
- Formateo automático de números (peso, altura)
- Refetch automático tras actualización

---

## 📅 Gestión de Citas

**Ubicación**: `src/features/appointments/`

Gestión completa de citas y consultas.

### Funcionalidades

#### Listado de Citas
**Componente**: `appointments.jsx`
- Tabla con todas las citas
- Filtros por fecha, terapeuta, estado
- Búsqueda de pacientes
- Estados: Pendiente, Completada, Cancelada
- Acciones: Editar, Ver detalle, Completar

#### Registro de Nueva Cita
**Componente**: `RegisterAppointment/NewAppointment.jsx`

Campos:
- Búsqueda de paciente (por DNI o nombre)
- Fecha y hora de la cita
- Tipo de cita (Consulta, Control, Emergencia)
- Terapeuta asignado
- Monto del pago
- Método de pago
- Observaciones

#### Edición de Cita
**Componente**: `EditAppointment/EditAppointment.jsx`
- Modificación de todos los campos
- Cambio de estado
- Reasignación de terapeuta

#### Citas Completadas
**Ubicación**: `src/features/appointmentsComplete/`
- Listado de citas finalizadas
- Filtros por fecha y terapeuta
- Estadísticas de citas completadas
- No se pueden editar (solo visualizar)

---

## 📆 Calendario

**Ubicación**: `src/features/calendar/`

Visualización de citas en formato de calendario.

### Componentes
- **Calendar.jsx**: Vista principal del calendario
- **CalendarList.jsx**: Vista de lista
- **MiniCalendar.jsx**: Calendario compacto

### Funcionalidades
- Vista mensual, semanal y diaria
- Drag & drop de citas para cambiar fecha
- Click en evento para ver detalle
- Filtros por terapeuta
- Códigos de colores por estado de cita
- Navegación rápida entre fechas

### Tecnología
- React Big Calendar
- Overrides personalizados en `CalendarOverrides.css`
- Integración con datos del backend

---

## 👨‍⚕️ Gestión de Personal (Staff)

**Ubicación**: `src/features/staff/`

CRUD completo para terapeutas y personal médico.

### Funcionalidades

#### Listado de Personal
**Componente**: `staff.jsx`
- Tabla con búsqueda y paginación
- Filtros por estado (activo/inactivo)
- Acciones: Ver info, Editar

#### Registro de Nuevo Terapeuta
**Componente**: `RegisterTherapist/NewTherapist.jsx`

Campos similares al registro de pacientes:
- Datos personales completos
- Tipo de documento
- Ubicación con selector en cascada
- Información de contacto
- Especialidad

#### Edición de Terapeuta
**Componente**: `EditTherapist/EditTherapist.jsx`

Optimizaciones especiales:
- Precarga de datos antes de abrir modal
- Sistema de caché para selectores
- Modal se abre rápidamente con datos listos
- Ver `docs/optimizaciones-staff.md` para más detalles

#### Información del Terapeuta
**Componente**: `infoTherapist/infoTherapist.jsx`
- Vista detallada de datos
- Historial de citas atendidas
- Estadísticas del terapeuta

---

## 📊 Reportes

**Ubicación**: `src/features/reports/`

Generación y visualización de reportes diversos.

### Tipos de Reportes

#### Reporte de Caja Diario
**Componente**: `reports.jsx` + `DailyCashReportPDF.jsx`

Contenido:
- Fecha del reporte
- Total de ingresos
- Desglose por método de pago
- Lista de citas con montos
- Total de pacientes atendidos
- Generación en PDF

Funcionalidades:
- Filtro por fecha
- Edición de montos (con modal)
- Actualización en tiempo real
- Exportación a PDF

#### Reporte de Terapeutas Diario
**Componente**: `DailyTherapistReportPDF.jsx`

Contenido:
- Lista de terapeutas
- Número de pacientes atendidos por terapeuta
- Total de ingresos generados
- Porcentaje de ocupación
- Vista en PDF

#### Reporte de Pacientes por Terapeuta
**Componente**: `PatientsByTherapistReportPDF.jsx`

Contenido:
- Selección de terapeuta
- Rango de fechas
- Lista detallada de pacientes atendidos
- Diagnósticos y tratamientos
- Exportación a PDF

### Componentes Auxiliares
- **ReportSelector.jsx**: Selector de tipo de reporte
- **ReportPreview.jsx**: Vista previa antes de generar PDF
- **EditCashReportModal.jsx**: Modal para editar montos del reporte de caja
- **ExcelPreviewTable.jsx**: Vista previa estilo Excel

---

## ⚙️ Configuración

**Ubicación**: `src/features/configuration/`

Panel de configuración del sistema con varios submódulos.

### Perfil de Usuario
**Ubicación**: `configuration/cProfile/`

Funcionalidades:
- Edición de datos personales
- Cambio de contraseña
- Actualización de foto de perfil
- Preferencias de usuario

### Gestión de Usuarios
**Ubicación**: `configuration/cUsers/`

Funcionalidades:
- CRUD de usuarios del sistema
- Asignación de roles (Admin, Terapeuta, Recepcionista)
- Activar/Desactivar usuarios
- Reseteo de contraseñas

### Métodos de Pago
**Ubicación**: `configuration/cPayments/`

Funcionalidades:
- Gestión de métodos de pago (Efectivo, Tarjeta, Transferencia, Yape, Plin)
- Configuración de precios predeterminados
- Descuentos y promociones

### Métodos Anticonceptivos
**Ubicación**: `configuration/cContraceptive/`

Funcionalidades:
- CRUD de métodos anticonceptivos
- Gestión de tipos de DIU
- Información adicional sobre cada método

### Configuración del Sistema
**Ubicación**: `configuration/cSystem/`

Funcionalidades:
- Información de la empresa
- Configuración de logo
- Parámetros generales del sistema
- Backups y mantenimiento

---

## 🔐 Autenticación

**Ubicación**: `src/features/auth/`

Sistema completo de autenticación y gestión de sesiones.

### Componentes

#### Login
**Componente**: `login.jsx`

Funcionalidades:
- Inicio de sesión con DNI/email y contraseña
- Recordar sesión
- Animación de partículas de fondo
- Validación de credenciales
- Redirección tras login exitoso

#### Cambio de Contraseña
**Componente**: `ChangesPassword/ChangesPassword.jsx`

Funcionalidades:
- Cambio de contraseña desde el perfil
- Validación de contraseña actual
- Reglas de seguridad para nueva contraseña
- Confirmación de nueva contraseña

#### Primera Sesión
**Componente**: `FirstSession/FirstSession.jsx`

Funcionalidades:
- Obligatorio cambiar contraseña en primer acceso
- No permite saltarse el paso
- Redirección automática tras completar

### Seguridad
- Tokens JWT
- Almacenamiento seguro en localStorage
- Interceptores de Axios para incluir token
- Validación de token en cada request
- Logout automático si token expira

---

## 🎨 Sistema de Temas

**Ubicación**: `src/context/ThemeContext.jsx`

Gestión global del tema de la aplicación.

### Funcionalidades
- Toggle entre modo claro y oscuro
- Persistencia de preferencia en localStorage
- Variables CSS dinámicas
- Aplicación automática en todos los componentes
- Componente `ThemeToggle` para cambiar tema

### Implementación
```javascript
const { theme, toggleTheme } = useTheme();
// theme: 'light' | 'dark'
```

---

## 🔔 Sistema de Notificaciones

**Ubicación**: `src/services/toastify/`

Sistema global de notificaciones tipo toast.

### ToastContext

Funcionalidades:
- Notificaciones de éxito
- Notificaciones de error
- Notificaciones de advertencia
- Notificaciones informativas
- Duración configurable
- Posición personalizable

### Mensajes Predefinidos
- `showToast('success', 'Datos guardados correctamente')`
- `showToast('error', 'Error al guardar')`
- Mensajes predefinidos para operaciones comunes

---

## 🔍 Búsqueda y Filtros

Implementados en varios módulos con características comunes:

### Componentes de Búsqueda
- **CustomSearch**: Búsqueda genérica con debouncing
- **DNISearch**: Búsqueda especializada por DNI
- **DNISearchResults**: Resultados de búsqueda por DNI

### Características
- Debouncing de 1 segundo para reducir peticiones
- Búsqueda en tiempo real
- Resaltado de coincidencias
- Resultados paginados
- Filtros combinables

---

## 📱 Responsive Design

Toda la aplicación está optimizada para diferentes dispositivos:

- **Desktop**: Experiencia completa
- **Tablet**: Layout adaptado
- **Mobile**: Interfaz simplificada con menú hamburguesa

Breakpoints:
- Mobile: < 576px
- Tablet: 577px - 992px
- Desktop: > 993px

---

## ⚡ Optimizaciones de Rendimiento

### Sistema de Caché
Ver `docs/optimizaciones-staff.md` para detalles completos.

Implementaciones:
- Caché de respuestas de API en selectores
- Precarga de datos antes de abrir modales
- Memoización de componentes y funciones costosas

### Code Splitting
- Preparado para lazy loading de rutas
- Chunks optimizados por Vite

### Debouncing
- Búsquedas con delay
- Reducción de peticiones al backend

### Paginación
- Todas las listas están paginadas
- Carga incremental de datos

---

## 🚀 Próximas Funcionalidades

Funcionalidades planificadas para futuras versiones:

- [ ] Sistema de notificaciones push
- [ ] Chat en tiempo real entre usuarios
- [ ] Exportación masiva a Excel
- [ ] Modo offline con sincronización
- [ ] App móvil nativa (React Native)
- [ ] Sistema de citas online para pacientes
- [ ] Integración con WhatsApp
- [ ] Recordatorios automáticos de citas
- [ ] Firma digital para documentos
- [ ] Historial de cambios auditables

---

Para más detalles sobre cada módulo, consulta el código fuente en la carpeta correspondiente dentro de `src/features/`.


