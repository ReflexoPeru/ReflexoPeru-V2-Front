# Estilos

La aplicación utiliza una combinación de estilos globales, módulos CSS y Ant Design para mantener la coherencia visual y facilitar el mantenimiento.

## Organización

### Estilos Globales
**Ubicación**: `src/css/`

- **normalize.css**: Reset CSS para consistencia entre navegadores
- **VarColors.css**: Variables CSS para colores y temas
- **Typography.css**: Estilos tipográficos globales
- **Animations.css**: Animaciones y transiciones reutilizables

### Estilos por Componente
- Cada componente tiene su archivo `.module.css`
- Ubicados junto al componente correspondiente
- Scope local para evitar conflictos

### Estilos de Ant Design
- Tema personalizado en archivos de configuración
- Overrides específicos cuando es necesario

## Sistema de Temas

### ThemeContext
**Ubicación**: `src/context/ThemeContext.jsx`

Gestiona el tema de la aplicación (claro/oscuro):
- Estado global del tema
- Toggle entre temas
- Persistencia en localStorage
- Aplicación de variables CSS dinámicas

```javascript
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Cambiar a {theme === 'dark' ? 'claro' : 'oscuro'}
    </button>
  );
};
```

### Variables CSS por Tema
**Ubicación**: `src/css/VarColors.css`

```css
:root {
  /* Tema Claro */
  --color-primary: #1677ff;
  --color-secondary: #52c41a;
  --color-background-primary: #ffffff;
  --color-background-secondary: #f5f5f5;
  --color-text-primary: #000000;
  --color-text-secondary: #666666;
  --color-border: #d9d9d9;
}

[data-theme="dark"] {
  /* Tema Oscuro */
  --color-primary: #177ddc;
  --color-secondary: #49aa19;
  --color-background-primary: #141414;
  --color-background-secondary: #1f1f1f;
  --color-text-primary: #ffffff;
  --color-text-secondary: #a0a0a0;
  --color-border: #434343;
}
```

## CSS Modules

### Convención de Nombres
- Archivos: `ComponentName.module.css`
- Clases: camelCase (`primaryButton`, `headerContainer`)

### Ejemplo de Uso
```jsx
// MyComponent.jsx
import styles from './MyComponent.module.css';

const MyComponent = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Título</h1>
    <button className={styles.primaryButton}>Acción</button>
  </div>
);
```

```css
/* MyComponent.module.css */
.container {
  padding: 20px;
  background-color: var(--color-background-primary);
}

.title {
  color: var(--color-text-primary);
  font-size: 24px;
  margin-bottom: 16px;
}

.primaryButton {
  background-color: var(--color-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.primaryButton:hover {
  opacity: 0.8;
}
```

## Animaciones

### Animaciones Globales
**Ubicación**: `src/css/Animations.css`

```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fadeIn {
  animation: fadeIn 0.3s ease-in;
}

/* Slide In */
@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.slideIn {
  animation: slideIn 0.4s ease-out;
}
```

### Uso en Componentes
```jsx
import styles from './MyComponent.module.css';

const MyComponent = () => (
  <div className={`${styles.container} fadeIn`}>
    Contenido con animación
  </div>
);
```

## Overrides de Ant Design

### Modales
**Ubicación**: `src/components/Modal/ModalTheme.css`

```css
.modal-themed .ant-modal-content {
  background-color: var(--color-background-primary);
  color: var(--color-text-primary);
}

.modal-themed .ant-modal-header {
  background-color: var(--color-background-secondary);
  border-bottom: 1px solid var(--color-border);
}
```

### Calendario
**Ubicación**: `src/features/calendar/ui/CalendarOverrides.css`

```css
.custom-calendar .fc-event {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.custom-calendar .fc-daygrid-day:hover {
  background-color: var(--color-background-secondary);
}
```

### Estadísticas
**Ubicación**: `src/features/statistic/ui/StatisticOverrides.css`

Overrides específicos para gráficos y métricas del dashboard.

## Tipografía

### Fuentes
**Ubicación**: `src/assets/Fonts/`

- Fuentes personalizadas importadas
- Fallbacks configurados para máxima compatibilidad

### Estilos Tipográficos
**Ubicación**: `src/css/Typography.css`

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
               'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5715;
  color: var(--color-text-primary);
}

h1, h2, h3, h4, h5, h6 {
  margin: 0 0 16px 0;
  font-weight: 600;
  color: var(--color-text-primary);
}

h1 { font-size: 32px; }
h2 { font-size: 28px; }
h3 { font-size: 24px; }
h4 { font-size: 20px; }
h5 { font-size: 16px; }
h6 { font-size: 14px; }
```

## Responsive Design

### Breakpoints
```css
/* Mobile */
@media (max-width: 576px) {
  .container {
    padding: 10px;
  }
}

/* Tablet */
@media (min-width: 577px) and (max-width: 992px) {
  .container {
    padding: 15px;
  }
}

/* Desktop */
@media (min-width: 993px) {
  .container {
    padding: 20px;
  }
}
```

### Mobile First
El diseño sigue un enfoque mobile-first, donde:
1. Estilos base para móvil
2. Media queries para ampliar hacia pantallas más grandes

## Buenas Prácticas

### 1. Usar Variables CSS
```css
/* ✅ Correcto */
.button {
  background-color: var(--color-primary);
}

/* ❌ Incorrecto */
.button {
  background-color: #1677ff;
}
```

### 2. CSS Modules para Componentes
```css
/* ✅ Correcto - Scope local */
.container { ... }

/* ❌ Evitar - Scope global */
.global-container { ... }
```

### 3. BEM para Clases Descriptivas
```css
/* Block__Element--Modifier */
.card { }
.card__header { }
.card__header--highlighted { }
```

### 4. No Usar !important
```css
/* ✅ Correcto */
.button {
  background-color: var(--color-primary);
}

/* ❌ Evitar */
.button {
  background-color: var(--color-primary) !important;
}
```

### 5. Agrupar Propiedades Relacionadas
```css
.element {
  /* Posicionamiento */
  position: relative;
  top: 0;
  left: 0;
  
  /* Box Model */
  display: flex;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  
  /* Tipografía */
  font-size: 14px;
  color: var(--color-text-primary);
  
  /* Visual */
  background-color: var(--color-background-primary);
  border-radius: 4px;
  
  /* Otros */
  cursor: pointer;
  transition: all 0.3s;
}
```

## Utilidades Comunes

### Flexbox
```css
.flex {
  display: flex;
}

.flexCenter {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flexBetween {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Espaciado
```css
.mt-1 { margin-top: 8px; }
.mt-2 { margin-top: 16px; }
.mt-3 { margin-top: 24px; }

.p-1 { padding: 8px; }
.p-2 { padding: 16px; }
.p-3 { padding: 24px; }
```

### Texto
```css
.textCenter { text-align: center; }
.textBold { font-weight: 600; }
.textMuted { color: var(--color-text-secondary); }
```

## Debugging de Estilos

### DevTools
1. Inspeccionar elemento
2. Ver estilos computados
3. Verificar cascada de CSS
4. Probar cambios en tiempo real

### Console Logs
```javascript
// Ver variables CSS aplicadas
const root = document.documentElement;
const primaryColor = getComputedStyle(root)
  .getPropertyValue('--color-primary');
console.log('Color primario:', primaryColor);
```

## Performance

### 1. Minimizar CSS
- Vite optimiza automáticamente en producción

### 2. Eliminar CSS No Usado
- Revisar regularmente estilos obsoletos

### 3. Cargar Fuentes Eficientemente
```css
@font-face {
  font-family: 'CustomFont';
  src: url('../assets/Fonts/CustomFont.woff2') format('woff2');
  font-display: swap; /* Mejora LCP */
}
```

Para modificar la paleta de colores o estilos globales, edita los archivos en `src/css/`. Para agregar estilos a un componente, crea un archivo `.module.css` junto al componente.
