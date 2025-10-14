# 📊 Lógica del Sistema de Peso: Peso Hoy → Peso Anterior

## 🎯 Resumen Ejecutivo

El sistema maneja 3 campos de peso que representan la evolución del paciente:
1. **Peso Inicial** - Peso al comenzar el tratamiento (nunca cambia)
2. **Peso Anterior** - Peso de la sesión anterior
3. **Peso Hoy** - Peso actual de la sesión (se limpia después de guardar)

**Lógica principal:** Cuando guardas, "Peso Hoy" se convierte automáticamente en "Peso Anterior" para la próxima sesión.

---

## 📚 Mapeo Base de Datos → Formulario

| Campo en BD | Campo en Formulario | Descripción |
|-------------|---------------------|-------------|
| `weight` | `pesoInicial` | Peso al iniciar tratamiento |
| `last_weight` | `ultimoPeso` | Peso de sesión anterior |
| `current_weight` | `pesoHoy` | Peso actual (temporal) |

---

## 🔄 Ciclo de Vida Completo

### 📥 **Paso 1: Carga Inicial del Formulario**

```javascript
// src/features/history2/utils/formHelpers.js (líneas 79-83)
const formValues = {
  talla: formatHeight(historyData.height),           // Ej: "1.65"
  pesoInicial: formatWeight(historyData.weight),      // Ej: "74"
  ultimoPeso: formatWeight(historyData.last_weight),  // Ej: "52"
  pesoHoy: formatWeight(historyData.current_weight),  // Ej: "" (vacío)
};
```

**Ejemplo en pantalla:**
```
┌─────────────────────────────────────┐
│ Talla (m)           │ 1.65          │
│ Peso Inicial (kg)   │ 74            │
│ Peso Anterior (kg)  │ 52            │
│ Peso Hoy (kg)       │ [vacío]       │
└─────────────────────────────────────┘
```

---

### ✏️ **Paso 2: Usuario Ingresa Peso de la Sesión Actual**

El terapeuta pesa al paciente y escribe en "Peso Hoy":

```
┌─────────────────────────────────────┐
│ Talla (m)           │ 1.65          │
│ Peso Inicial (kg)   │ 74            │
│ Peso Anterior (kg)  │ 52            │
│ Peso Hoy (kg)       │ 46     ← Nuevo│
└─────────────────────────────────────┘
```

---

### 💾 **Paso 3: Usuario Presiona "Guardar"**

#### A. Cálculo del Peso Actualizado

```javascript
// src/features/history2/utils/formHelpers.js (líneas 146-160)
export const calculateWeightUpdate = (values, currentHistory) => {
  // Obtener el peso actual de la BD
  const currentWeight = currentHistory?.data?.current_weight || 
                        currentHistory?.data?.last_weight || 
                        '';

  // ¿El usuario ingresó "peso hoy"?
  if (values.pesoHoy) {
    return {
      last_weight: formatNumberForBackend(currentWeight),      // 52 → "52"
      current_weight: formatNumberForBackend(values.pesoHoy),  // 46 → "46"
    };
  }

  // Si NO ingresó peso hoy, solo actualiza last_weight manualmente
  return {
    last_weight: formatNumberForBackend(values.ultimoPeso),
    current_weight: null,
  };
};
```

**Lo que sucede:**
```javascript
// ANTES (en BD)
{
  weight: 74,          // Peso inicial
  last_weight: 52,     // Peso anterior
  current_weight: null // No hay peso actual
}

// Usuario ingresa pesoHoy = 46
// calculateWeightUpdate retorna:
{
  last_weight: "52",      // El actual se convierte en anterior
  current_weight: "46"    // El nuevo se guarda como actual
}

// DESPUÉS (en BD)
{
  weight: 74,          // Peso inicial (sin cambios)
  last_weight: 52,     // Peso anterior (sin cambios AÚN)
  current_weight: 46   // Peso actual (GUARDADO)
}
```

#### B. Construcción del Payload

```javascript
// src/features/history2/utils/formHelpers.js (líneas 171-187)
const weightUpdate = calculateWeightUpdate(values, currentHistory);

const payload = {
  weight: formatNumberForBackend(values.pesoInicial),    // 74
  last_weight: weightUpdate.last_weight,                  // 52
  current_weight: weightUpdate.current_weight,            // 46
  // ... otros campos
};
```

**Payload enviado al backend:**
```json
{
  "weight": "74",
  "last_weight": "52",
  "current_weight": "46",
  "height": "1.65"
}
```

---

### 🔄 **Paso 4: Actualización del Formulario (UI)**

Después de guardar exitosamente:

```javascript
// src/features/history2/PatientHistory.jsx (línea 368)
updateWeightFieldsAfterSave(form, values);

// src/features/history2/utils/formHelpers.js (líneas 284-291)
export const updateWeightFieldsAfterSave = (form, values) => {
  if (values.pesoHoy) {
    form.setFieldsValue({
      pesoHoy: '',                                  // ← Limpia "Peso Hoy"
      ultimoPeso: formatWeight(values.pesoHoy),     // ← Mueve a "Peso Anterior"
    });
  }
};
```

**Lo que ve el usuario INMEDIATAMENTE después de guardar:**
```
ANTES de guardar:                DESPUÉS de guardar:
┌─────────────────────┐         ┌─────────────────────┐
│ Peso Inicial │ 74   │   →     │ Peso Inicial │ 74   │
│ Peso Anterior│ 52   │   →     │ Peso Anterior│ 46   │ ← Actualizado
│ Peso Hoy     │ 46   │   →     │ Peso Hoy     │      │ ← Limpiado
└─────────────────────┘         └─────────────────────┘
```

---

### 🔄 **Paso 5: Recarga de Datos desde el Backend**

```javascript
// src/features/history2/PatientHistory.jsx (líneas 372-375)
await Promise.all([
  refetchHistory(),        // Obtiene datos actualizados del historial
  refetchAppointments(),   // Obtiene datos actualizados de citas
]);
```

**Datos actualizados en BD:**
```javascript
// Backend respondió y ahora tenemos:
{
  weight: 74,          // Peso inicial (sin cambios)
  last_weight: 52,     // Peso anterior (aún el viejo)
  current_weight: 46   // Peso actual (guardado)
}

// El formulario se recarga con estos valores:
pesoInicial: "74"     ✅
ultimoPeso: "52"      ✅ (todavía el anterior)
pesoHoy: "46"         ✅ (desde current_weight de la BD)
```

**PERO** en el UI se ve diferente porque `updateWeightFieldsAfterSave` ya lo actualizó:
```
┌─────────────────────┐
│ Peso Inicial │ 74   │
│ Peso Anterior│ 46   │ ← Lo que vimos después de guardar
│ Peso Hoy     │      │ ← Limpio
└─────────────────────┘
```

---

## 🎬 Ejemplo Completo Paso a Paso

### **Sesión 1 (Primera vez)**

```
BD:                          Formulario:
weight: 74                   pesoInicial: 74
last_weight: null      →     ultimoPeso: [vacío]
current_weight: null         pesoHoy: [vacío]

Usuario ingresa pesoHoy: 70
Usuario guarda

BD DESPUÉS:                  Formulario DESPUÉS:
weight: 74                   pesoInicial: 74
last_weight: null      →     ultimoPeso: 70  ← Movido
current_weight: 70           pesoHoy: [vacío] ← Limpio
```

---

### **Sesión 2 (Próxima visita)**

```
BD (al cargar):              Formulario (al cargar):
weight: 74                   pesoInicial: 74
last_weight: null      →     ultimoPeso: [vacío]
current_weight: 70           pesoHoy: 70

Usuario ingresa nuevo pesoHoy: 65
Usuario guarda

BD DESPUÉS:                  Formulario DESPUÉS:
weight: 74                   pesoInicial: 74
last_weight: 70        →     ultimoPeso: 65  ← Nuevo anterior
current_weight: 65           pesoHoy: [vacío] ← Limpio
```

---

### **Sesión 3 (Otra visita)**

```
BD (al cargar):              Formulario (al cargar):
weight: 74                   pesoInicial: 74
last_weight: 70        →     ultimoPeso: 70  ← Ahora sí tiene anterior
current_weight: 65           pesoHoy: 65

Usuario ingresa nuevo pesoHoy: 60
Usuario guarda

BD DESPUÉS:                  Formulario DESPUÉS:
weight: 74                   pesoInicial: 74
last_weight: 65        →     ultimoPeso: 60  ← Actualizado
current_weight: 60           pesoHoy: [vacío] ← Limpio
```

---

## 📊 Diagrama de Flujo Visual

```
┌──────────────────────────────────────────────────────────────┐
│                    INICIO DE SESIÓN                          │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Cargar datos desde BD:                                      │
│  • weight → pesoInicial (74 kg)                              │
│  • last_weight → ultimoPeso (52 kg)                          │
│  • current_weight → pesoHoy (null → vacío)                   │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Usuario pesa al paciente y escribe en "Peso Hoy": 46 kg    │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Usuario presiona GUARDAR                                    │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  calculateWeightUpdate ejecuta:                              │
│  • Obtiene currentWeight de BD: 52 kg                        │
│  • ¿Hay pesoHoy? SÍ (46 kg)                                  │
│  • Retorna:                                                  │
│    - last_weight: 52 (el actual pasa a anterior)             │
│    - current_weight: 46 (el nuevo se guarda)                 │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Se envía payload a BD:                                      │
│  {                                                           │
│    weight: 74,                                               │
│    last_weight: 52,                                          │
│    current_weight: 46                                        │
│  }                                                           │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  ✅ Guardado exitoso                                         │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  updateWeightFieldsAfterSave ejecuta:                        │
│  • form.setFieldsValue({                                     │
│      pesoHoy: '',          ← Limpia campo                    │
│      ultimoPeso: 46        ← Mueve peso actual a anterior    │
│    })                                                        │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Usuario ve en pantalla:                                     │
│  • Peso Inicial: 74 kg                                       │
│  • Peso Anterior: 46 kg  ← ¡Actualizado!                     │
│  • Peso Hoy: [vacío]     ← ¡Listo para próxima sesión!      │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│  Recarga datos desde BD (sincronización)                     │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                    FIN DE SESIÓN                             │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔑 Puntos Clave

### 1. **¿Por qué se limpia "Peso Hoy"?**
Para que en la próxima sesión esté vacío y el terapeuta pueda ingresar el nuevo peso.

### 2. **¿Por qué no se actualiza `last_weight` en la BD inmediatamente?**
Porque el sistema guarda:
- `current_weight` = peso de HOY
- `last_weight` = peso de la sesión ANTERIOR

En la próxima sesión:
- El `current_weight` actual (46) se convertirá en `last_weight`
- El nuevo peso ingresado será el nuevo `current_weight`

### 3. **¿Qué pasa si NO ingreso "Peso Hoy"?**
```javascript
if (values.pesoHoy) {
  // ... lógica normal
} else {
  return {
    last_weight: formatNumberForBackend(values.ultimoPeso),
    current_weight: null  // ← Se guarda como null
  };
}
```
El sistema simplemente guarda lo que esté en "Peso Anterior" sin hacer cambios.

### 4. **¿Puedo editar "Peso Anterior" manualmente?**
**SÍ**, si no ingresas "Peso Hoy", puedes editar "Peso Anterior" directamente y ese valor se guardará.

---

## 🎯 Casos de Uso

### ✅ Caso 1: Seguimiento Normal de Peso
```
Sesión 1: pesoHoy = 70  → Guarda → ultimoPeso = 70, pesoHoy = vacío
Sesión 2: pesoHoy = 65  → Guarda → ultimoPeso = 65, pesoHoy = vacío
Sesión 3: pesoHoy = 60  → Guarda → ultimoPeso = 60, pesoHoy = vacío
```

### ✅ Caso 2: Paciente No se Pesó Hoy
```
Sesión: pesoHoy = [vacío] → Guarda → No hay cambios en peso
```

### ✅ Caso 3: Corrección de Peso Anterior
```
Usuario ve: ultimoPeso = 70 (incorrecto)
Usuario edita: ultimoPeso = 72
Usuario NO ingresa pesoHoy
Usuario guarda → last_weight = 72 en BD
```

---

## 📝 Código Fuente Relevante

### Archivos Clave

| Archivo | Líneas | Función |
|---------|--------|---------|
| `formHelpers.js` | 79-83 | Carga inicial del formulario |
| `formHelpers.js` | 146-160 | `calculateWeightUpdate` |
| `formHelpers.js` | 284-291 | `updateWeightFieldsAfterSave` |
| `PatientHistory.jsx` | 368 | Llamada a `updateWeightFieldsAfterSave` |
| `WeightFields.jsx` | 40-64 | Componente visual de campos |

---

## 🎉 Resumen en 3 Pasos

1. **Cargas el formulario** → "Peso Anterior" y "Peso Hoy" se llenan con datos de BD
2. **Ingresas nuevo peso en "Peso Hoy"** → Usuario escribe el peso actual
3. **Guardas** → "Peso Hoy" pasa a "Peso Anterior", y "Peso Hoy" se limpia

**¡Listo para la próxima sesión!** 🎊

---

**Fecha:** Octubre 14, 2025  
**Autor:** Sistema ReflexoPeru V2

