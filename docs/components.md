# Componentes

En este proyecto, los componentes reutilizables se encuentran en `src/components/` y están organizados por tipo y funcionalidad. Permiten construir la interfaz de usuario de manera modular y escalable.

## Organización
- Cada componente está en una subcarpeta dentro de `src/components/`
- Los estilos específicos están en archivos `.module.css` junto al componente
- Algunos componentes utilizan TypeScript (`.tsx`) para mejor tipado

## Categorías de Componentes

### Botones
- **Button/CustomButtom.jsx**: Botón personalizado reutilizable para acciones generales
- **DesignSystem/Button/**: Sistema de diseño de botones

### Inputs y Formularios
- **Input/Input.jsx**: Campo de entrada de texto genérico
- **Input/DNISearchInput.jsx**: Campo especializado para búsqueda por DNI
- **Form/Form.jsx**: Formularios reutilizables para registro y edición

### Tablas y Paginación
- **Table/Tabla.jsx**: Tabla para mostrar datos tabulares
- **Table/Pagination/Pagination.jsx**: Componente de paginación para tablas

### Modales
- **Modal/UniversalModal.jsx**: Modal universal reutilizable
- **Modal/BaseModalProfile/**: Modal para edición de perfil
- **Modal/BaseModalPayments/**: Modal para gestión de pagos
- **Modal/EditModal.jsx**: Modal de edición genérico
- **DataVerificationModal/**: Modal para verificación de datos

### Selectores y Búsqueda
- **Select/SelectCountry.jsx**: Selector de país
- **Select/SelectUbigeoCascader.jsx**: Selector en cascada para ubicación (Departamento → Provincia → Distrito)
- **Select/SelctTypeOfDocument.jsx**: Selector de tipo de documento
- **Select/SelectDiagnoses.jsx**: Selector de diagnósticos
- **Select/SelectPaymentStatus.jsx**: Selector de estado de pago
- **Select/SelectPrices.jsx**: Selector de precios predeterminados
- **Select/SelectTherapist.jsx**: Selector de terapeutas
- **Select/SelectContraceptiveMethod.jsx**: Selector de métodos anticonceptivos
- **Select/SelectDiuType.jsx**: Selector de tipos de DIU
- **Select/SelectsApi.js**: Sistema de caché global para APIs de selectores
- **Search/CustomSearch.jsx**: Barra de búsqueda personalizada
- **DateSearch/CustomTimeFilter.jsx**: Filtro de fechas y horas
- **DNISearch/**: Búsqueda especializada por DNI
- **DNISearchResults/**: Resultados de búsqueda por DNI

### Navegación y Layout
- **Header/Header.jsx**: Encabezado principal de la aplicación
- **Header/CustomLayout.jsx**: Layout personalizado con sidebar
- **Navigation/**: Componentes de navegación
- **ThemeToggle/ThemeToggle.jsx**: Cambio de tema (oscuro/claro)

### Visualización de Datos
- **charts/ChartSummary.tsx**: Resumen de gráficos (TypeScript)
- **charts/SessionsLineChart.tsx**: Gráfico de líneas para sesiones (TypeScript)
- **Card/**: Componentes de tarjetas para mostrar información

### Estados y Carga
- **Loading/AdvancedLoader.jsx**: Loader avanzado con animaciones
- **Loading/ConsistentSpinner.jsx**: Spinner consistente para estados de carga
- **Empty/EmptyState.jsx**: Estado vacío cuando no hay datos

### Generación de PDFs
- **PdfTemplates/FichaPDF.jsx**: Plantilla PDF para fichas de paciente
- **PdfTemplates/TicketPDF.jsx**: Plantilla PDF para tickets/boletas
- **PdfTemplates/DailyCashReportPDF.jsx**: Reporte diario de caja en PDF
- **PdfTemplates/DailyTherapistReportPDF.jsx**: Reporte diario de terapeutas en PDF
- **PdfTemplates/PatientsByTherapistReportPDF.jsx**: Reporte de pacientes por terapeuta en PDF
- **PdfTemplates/ExcelPreviewTable.jsx**: Vista previa de tablas estilo Excel

## Sistema de Caché para Selectores

El archivo `SelectsApi.js` implementa un sistema de caché global que:
- Almacena respuestas de APIs para evitar llamadas repetidas
- Mejora significativamente el rendimiento de los selectores
- Incluye función `clearApiCache()` para limpiar el caché cuando sea necesario
- Cachea: países, regiones, provincias, distritos, tipos de documento, estados de pago, precios, diagnósticos, métodos anticonceptivos y tipos de DIU

## Ejemplo de uso
```jsx
import CustomButton from '../components/Button/CustomButtom';
import UniversalModal from '../components/Modal/UniversalModal';
import SelectUbigeoCascader from '../components/Select/SelectUbigeoCascader';

<CustomButton label="Guardar" onClick={handleSave} />

<UniversalModal 
  title="Editar Paciente" 
  open={isOpen} 
  onCancel={handleClose}
>
  <SelectUbigeoCascader 
    value={ubigeo} 
    onChange={handleUbigeoChange} 
  />
</UniversalModal>
```

## TypeScript
Los componentes de gráficos están implementados en TypeScript (`.tsx`) para proporcionar mejor tipado y autocompletado en el desarrollo.

Consulta cada archivo para ver los props y ejemplos de uso específicos.
