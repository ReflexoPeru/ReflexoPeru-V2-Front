# Rutas

Las rutas definen la navegación principal de la aplicación y la protección de acceso a ciertas vistas. El sistema de enrutamiento garantiza la seguridad y una experiencia de usuario fluida.

## Organización
- **Definición de rutas**: `src/routes/Router.jsx`
- **Protección de rutas**: `src/routes/ProtectedRoute.jsx`
- **Contexto de autenticación**: `src/routes/AuthContext.jsx`

## Sistema de Autenticación

### AuthContext
**Ubicación**: `src/routes/AuthContext.jsx`

Proporciona el estado de autenticación global:
- Estado de usuario autenticado
- Token de sesión
- Información del usuario actual
- Funciones de login/logout

```javascript
import { useAuth } from '../routes/AuthContext';

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();
  // ...
};
```

### ProtectedRoute
**Ubicación**: `src/routes/ProtectedRoute.jsx`

Componente que protege rutas que requieren autenticación:
- Verifica el token de sesión
- Redirige a login si no está autenticado
- Muestra loader mientras valida

```javascript
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

## Rutas Principales

### Autenticación
- **`/`**: Página de login
- **`/login`**: Página de inicio de sesión (alternativa)
- **`/change-password`**: Cambio de contraseña
- **`/first-session`**: Primera sesión (cambio de contraseña inicial)

### Dashboard
- **`/dashboard`**: Panel principal con métricas y estadísticas
  - Resumen de actividades
  - KPIs principales
  - Gráficos de rendimiento

### Home
- **`/home`**: Página de inicio tras autenticación
  - Citas del día
  - Accesos rápidos
  - Banner de bienvenida

### Pacientes
- **`/pacientes`**: Listado de pacientes
  - Búsqueda y filtrado
  - Vista de tabla
  - Paginación
- **`/pacientes/nuevo`**: Registro de nuevo paciente
- **`/pacientes/editar/:id`**: Edición de paciente existente
- **`/pacientes/info/:id`**: Información detallada del paciente
- **`/pacientes/:id/historial`**: Historial médico completo del paciente

### Citas
- **`/citas`**: Gestión de citas
  - Vista de tabla
  - Filtros por fecha, terapeuta, estado
  - Búsqueda de pacientes
- **`/citas/nueva`**: Registro de nueva cita
- **`/citas/editar/:id`**: Edición de cita existente
- **`/citas/completadas`**: Listado de citas finalizadas

### Calendario
- **`/calendario`**: Vista de calendario
  - Visualización mensual de citas
  - Drag & drop de eventos
  - Filtros por terapeuta
- **`/calendario/lista`**: Vista de lista del calendario
- **`/calendario/mini`**: Vista compacta del calendario

### Personal/Staff
- **`/personal`**: Gestión de terapeutas y personal
  - Listado con búsqueda
  - Información de contacto
  - Estado activo/inactivo
- **`/personal/nuevo`**: Registro de nuevo terapeuta
- **`/personal/editar/:id`**: Edición de terapeuta
- **`/personal/info/:id`**: Información detallada del terapeuta

### Reportes
- **`/reportes`**: Centro de reportes
  - Selector de tipo de reporte
  - Filtros por fecha
  - Vista previa
- **`/reportes/caja`**: Reporte de caja diario
- **`/reportes/terapeutas`**: Reporte de terapeutas por día
- **`/reportes/pacientes-terapeuta`**: Pacientes atendidos por terapeuta

### Configuración
- **`/configuracion`**: Panel de configuración general
- **`/configuracion/perfil`**: Edición de perfil de usuario
- **`/configuracion/usuarios`**: Gestión de usuarios del sistema
- **`/configuracion/pagos`**: Configuración de métodos de pago y precios
- **`/configuracion/sistema`**: Configuración general del sistema
- **`/configuracion/anticonceptivos`**: Gestión de métodos anticonceptivos

### Error
- **`/404`**: Página no encontrada
- **`/error`**: Página de error general

## Estructura de Rutas

```javascript
// src/routes/Router.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const Router = () => (
  <BrowserRouter>
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />
      
      {/* Rutas protegidas */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      {/* Más rutas... */}
    </Routes>
  </BrowserRouter>
);
```

## Navegación Programática

### useNavigate
```javascript
import { useNavigate } from 'react-router-dom';

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/pacientes');
  };
  
  const goBack = () => {
    navigate(-1);
  };
};
```

### Pasar Estado entre Rutas
```javascript
// Desde el componente origen
navigate('/pacientes/historial', { 
  state: { appointment: appointmentData } 
});

// En el componente destino
const location = useLocation();
const appointmentFromState = location.state?.appointment;
```

## Parámetros de Ruta

### Parámetros en URL
```javascript
// Definición
<Route path="/pacientes/:id" element={<PatientDetail />} />

// Uso
import { useParams } from 'react-router-dom';

const PatientDetail = () => {
  const { id } = useParams();
  // id contiene el valor del parámetro
};
```

### Query Parameters
```javascript
// URL: /reportes?fecha=2025-01-01&tipo=caja
import { useSearchParams } from 'react-router-dom';

const Reports = () => {
  const [searchParams] = useSearchParams();
  const fecha = searchParams.get('fecha');
  const tipo = searchParams.get('tipo');
};
```

## Guards y Permisos

Las rutas están protegidas por el componente `ProtectedRoute` que:
1. Verifica si existe un token válido en localStorage
2. Valida el token con el backend
3. Redirige a `/login` si no está autenticado
4. Muestra un loader durante la verificación

```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

## Layouts

### Layout Principal
**Ubicación**: `src/components/Header/CustomLayout.jsx`

Todas las rutas protegidas se envuelven en un layout que incluye:
- Header con navegación
- Sidebar con menú
- Toggle de tema
- Información del usuario
- Breadcrumbs

## Redirecciones

### Redirección después de Login
Tras un login exitoso, se redirige a:
- `/home` (por defecto)
- O a la ruta que intentaba acceder antes de ser redirigido a login

### Redirección por Rol
Aunque actualmente no está implementado el sistema de roles, la arquitectura permite agregar:
```javascript
// Futuro: Redirección basada en rol
if (user.role === 'admin') {
  navigate('/dashboard');
} else if (user.role === 'therapist') {
  navigate('/citas');
}
```

## Mejores Prácticas

1. **Siempre usar rutas protegidas** para vistas que requieren autenticación
2. **Pasar estado entre rutas** cuando se necesita mantener contexto
3. **Usar parámetros de URL** para recursos específicos (IDs)
4. **Validar parámetros** antes de usarlos
5. **Manejar errores** de navegación (404, acceso denegado)
6. **Implementar breadcrumbs** para mejor UX
7. **Lazy loading** de rutas para optimizar carga inicial

## Agregar Nuevas Rutas

Para agregar una nueva ruta:

1. Define el componente de la vista
2. Importa en `Router.jsx`
3. Agrega la ruta con o sin protección
4. Actualiza el menú de navegación si corresponde

```javascript
// Ejemplo de nueva ruta
<Route path="/nueva-funcionalidad" element={
  <ProtectedRoute>
    <NuevaFuncionalidad />
  </ProtectedRoute>
} />
```

Para modificar o agregar rutas, edita `src/routes/Router.jsx` y utiliza `ProtectedRoute` para restringir el acceso según el estado de autenticación.
