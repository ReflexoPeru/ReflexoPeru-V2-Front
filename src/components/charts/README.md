# 📊 SessionsLineChart - Gráfico Premium de Sesiones

## 🎯 Descripción

`SessionsLineChart` es un componente premium de visualización de datos que utiliza **Tremor** para crear gráficos de líneas interactivos y adaptativos. Está diseñado específicamente para mostrar datos de sesiones médicas con un estilo **Google Analytics**.

## ✨ Características

- **🎨 Diseño Premium**: Estilo moderno con fondo oscuro y colores vibrantes
- **📱 Totalmente Adaptativo**: Se ajusta automáticamente según el rango de fechas
- **🔄 Múltiples Rangos**: Soporta semana, mes, trimestre, año y personalizado
- **📈 Interactivo**: Tooltips informativos con tendencias y estadísticas
- **🌙 Modo Oscuro**: Optimizado para temas oscuros y claros
- **📊 Datos Reales**: Usa directamente los datos del backend sin interpolación

## 🚀 Uso Básico

```tsx
import SessionsLineChart from '../components/charts/SessionsLineChart';

// Datos del backend
const backendData = {
  sesiones: {
    "2025-09-13": 53,
    "2025-09-15": 24,
    "2025-09-16": 39,
    "2025-09-17": 30,
    "2025-09-18": 32,
    "2025-09-19": 17
  },
  terapeutas: [
    {
      id: 5,
      terapeuta: "ARIAS ROJAS, LEONOR ISIDORA",
      sesiones: 7,
      fechas: ["2025-09-13", "2025-09-16", "2025-09-18"],
      fechas_count: {
        "2025-09-13": 3,
        "2025-09-16": 2,
        "2025-09-18": 2
      }
    }
    // ... más terapeutas
  ]
};

function Dashboard() {
  return (
    <SessionsLineChart
      data={backendData}
      range="week"
      title="Sesiones por Semana"
      subtitle="Esta semana (Lunes a Domingo)"
      isDarkMode={true}
      height={400}
    />
  );
}
```

## 📋 Props

| Prop | Tipo | Requerido | Descripción |
|------|------|-----------|-------------|
| `data` | `BackendData` | ✅ | Datos del backend con sesiones y terapeutas |
| `range` | `ChartRange` | ✅ | Tipo de rango: 'week', 'month', '3months', 'year', 'custom' |
| `startDate` | `dayjs.Dayjs` | ❌ | Fecha de inicio para rangos personalizados |
| `endDate` | `dayjs.Dayjs` | ❌ | Fecha de fin para rangos personalizados |
| `title` | `string` | ❌ | Título del gráfico (default: "Sesiones por Período") |
| `subtitle` | `string` | ❌ | Subtítulo del gráfico |
| `isDarkMode` | `boolean` | ❌ | Modo oscuro activado (default: true) |
| `height` | `number` | ❌ | Altura del gráfico (default: 400) |
| `width` | `string \| number` | ❌ | Ancho del gráfico (default: '100%') |

## 🎨 Rangos de Tiempo

### 📅 Semana (7 días)
- **Formato**: Lunes, Martes, Miércoles, etc.
- **Subetiquetas**: Fechas (16/09, 17/09, etc.)
- **Datos**: Mapeo directo de lunes a domingo

### 📅 Mes (30 días)
- **Formato**: Días abreviados (Mar, Mié, Jue, etc.)
- **Subetiquetas**: Fechas (12/09, 13/09, etc.)
- **Datos**: Últimos 30 días día por día

### 📅 Trimestre (90 días)
- **Formato**: Días abreviados cada 3 días
- **Subetiquetas**: Fechas correspondientes
- **Datos**: Últimos 90 días optimizados

### 📅 Año (12 meses)
- **Formato**: Nombres de meses (Enero, Febrero, etc.)
- **Subetiquetas**: Años (2025, 2024, etc.)
- **Datos**: 12 meses hacia atrás desde hoy

### 📅 Personalizado (>1 año)
- **Formato**: Adaptativo según el rango
- **Lógica**: Trimestres (≤3 años) o Años (>3 años)
- **Datos**: Agrupación inteligente

## 🎨 Paleta de Colores

### Modo Oscuro (Default)
```css
{
  primary: '#00ff7f',      /* Verde vibrante */
  background: '#1a1a1a',   /* Fondo oscuro */
  text: '#ffffff',         /* Texto blanco */
  textSecondary: '#a0a0a0', /* Texto secundario */
  grid: '#333333',         /* Líneas de cuadrícula */
  tooltip: '#2a2a2a'       /* Fondo de tooltip */
}
```

### Modo Claro
```css
{
  primary: '#00cc66',      /* Verde más suave */
  background: '#ffffff',   /* Fondo blanco */
  text: '#1a1a1a',         /* Texto oscuro */
  textSecondary: '#666666', /* Texto secundario */
  grid: '#e5e5e5',         /* Líneas de cuadrícula */
  tooltip: '#f8f8f8'       /* Fondo de tooltip */
}
```

## 📊 Tooltip Interactivo

El tooltip muestra información detallada:

- **📅 Fecha**: Día y fecha seleccionada
- **📈 Sesiones**: Número de sesiones con color destacado
- **📊 Tendencia**: Indicador visual de cambio (↗️↘️➡️)
- **📈 Porcentaje**: Cambio porcentual respecto al punto anterior
- **👥 Terapeutas**: Lista de terapeutas activos (si aplica)

## 🔧 Archivos Relacionados

- `constants/chartRanges.ts` - Tipos y configuraciones de rangos
- `lib/chartUtils.ts` - Funciones de transformación de datos
- `components/charts/SessionsLineChart.tsx` - Componente principal

## 🚀 Ejemplo Completo

```tsx
import React, { useState } from 'react';
import dayjs from 'dayjs';
import SessionsLineChart from './components/charts/SessionsLineChart';

function StatisticsDashboard() {
  const [timeFilter, setTimeFilter] = useState('7días');
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(6, 'day'),
    dayjs().endOf('day')
  ]);

  // Datos del backend (ejemplo)
  const backendData = {
    sesiones: {
      "2025-09-13": 53,
      "2025-09-15": 24,
      "2025-09-16": 39,
      "2025-09-17": 30,
      "2025-09-18": 32,
      "2025-09-19": 17
    },
    terapeutas: [
      // ... datos de terapeutas
    ]
  };

  const mapFilterToRange = (filter) => {
    switch (filter) {
      case '7días': return 'week';
      case '28días': return 'month';
      case '3meses': return '3months';
      case '1año': return 'year';
      default: return 'custom';
    }
  };

  return (
    <div className="dashboard">
      <SessionsLineChart
        data={backendData}
        range={mapFilterToRange(timeFilter)}
        startDate={dateRange[0]}
        endDate={dateRange[1]}
        title="Indicación de Sesiones"
        subtitle="Esta semana (Lunes a Domingo)"
        isDarkMode={true}
        height={400}
      />
    </div>
  );
}
```

## 🎯 Beneficios

1. **📊 Visualización Profesional**: Estilo Google Analytics
2. **🔄 Adaptabilidad Total**: Funciona con cualquier rango de fechas
3. **⚡ Performance Optimizada**: Renderizado eficiente con Tremor
4. **📱 Responsive**: Se adapta a diferentes tamaños de pantalla
5. **🎨 Temas Consistentes**: Integración perfecta con el diseño
6. **📈 Datos Precisos**: Solo información real del backend
7. **🔍 Interactividad Rica**: Tooltips informativos y tendencias

