# 🧪 Plan de Testeo - Historia del Paciente (History2)

## 📋 Checklist General

### ✅ Pre-requisitos
- [ ] Backend corriendo correctamente
- [ ] Base de datos con datos de prueba
- [ ] Frontend compilando sin errores
- [ ] Consola del navegador abierta (F12) para ver logs

---

## 🎯 Casos de Prueba

### **Test 1: Carga de Datos del Paciente** ⭐ PRIORITARIO

#### Objetivo
Verificar que el nombre del paciente y datos básicos se carguen correctamente.

#### Pasos
1. Ir a la lista de pacientes
2. Buscar un paciente existente (ID: 72258 o similar)
3. Hacer clic en "Ver Historia" o abrir: `/patient-history/72258`

#### ✅ Resultado Esperado
- [ ] Muestra spinner "Cargando datos del paciente..."
- [ ] Después de cargar, muestra:
  - [ ] **Nombre del paciente** en el campo superior (Ej: "VEGA MENDOZA LILY BRIGIDA")
  - [ ] Campos de peso (Inicial, Anterior, Hoy)
  - [ ] Selector de citas con fechas disponibles
  - [ ] Sin errores en consola

#### ❌ Si falla
- Revisar consola: buscar warnings `[PatientHistory]`
- Verificar en Network (F12 → Network) que las peticiones respondan:
  - `GET patients/appoiments/{id}` → debe retornar `{ appointments: [...], patient: {...} }`
  - `GET histories/patient/{id}` → debe retornar historia

---

### **Test 2: Selección de Citas**

#### Objetivo
Verificar que al seleccionar una cita se carguen sus datos correctamente.

#### Pasos
1. Con el historial abierto, ir al selector "Cita"
2. Seleccionar una fecha de la lista desplegable

#### ✅ Resultado Esperado
- [ ] Los campos se actualizan con datos de esa cita:
  - [ ] Dolencias
  - [ ] Diagnósticos Médicos
  - [ ] Diagnósticos Reflexología
  - [ ] Medicamentos
  - [ ] Operaciones
  - [ ] Terapeuta (si tiene)
  - [ ] Observaciones Adicionales

#### ❌ Si falla
- Verificar que `appointments` tenga datos
- Revisar función `buildAppointmentFormValues` en consola

---

### **Test 3: Campos de Peso**

#### Objetivo
Verificar que los campos de peso funcionen correctamente.

#### Pasos
1. Observar valores iniciales de:
   - Peso Inicial
   - Peso Anterior
   - Peso Hoy
2. Anotar los valores
3. Ingresar un nuevo valor en "Peso Hoy" (Ej: 45)
4. Hacer clic en "Guardar"

#### ✅ Resultado Esperado
- [ ] Al cargar, los campos tienen valores de la BD
- [ ] Puedes escribir en "Peso Hoy"
- [ ] Después de guardar:
  - [ ] "Peso Hoy" se limpia
  - [ ] "Peso Anterior" se actualiza con el valor que acabas de ingresar
  - [ ] Mensaje de éxito: "Cambios guardados exitosamente"

#### ❌ Si falla
- Verificar función `updateWeightFieldsAfterSave`
- Revisar que `calculateWeightUpdate` esté funcionando

---

### **Test 4: Selección de Terapeuta**

#### Objetivo
Verificar que puedas buscar y seleccionar un terapeuta.

#### Pasos
1. Hacer clic en el botón "Buscar Terapeuta"
2. Debe abrir un modal
3. Escribir nombre de terapeuta en el buscador (Ej: "LUCY")
4. Seleccionar un terapeuta de la lista
5. Hacer clic en "Confirmar Selección"

#### ✅ Resultado Esperado
- [ ] Modal se abre correctamente
- [ ] Puedes buscar terapeutas
- [ ] Al seleccionar, el modal se cierra
- [ ] El campo "Terapeuta" muestra el nombre seleccionado
- [ ] Al guardar, el terapeuta se asocia a la cita

#### ❌ Si falla
- Verificar endpoint `GET staff` en Network
- Revisar que el modal `TherapistModal` se renderice

---

### **Test 5: Guardado de Historia**

#### Objetivo
Verificar que se guarden todos los cambios correctamente.

#### Pasos
1. Con una cita seleccionada, modificar varios campos:
   - Dolencias: "Dolor de cabeza"
   - Diagnósticos Médicos: "Migraña"
   - Peso Hoy: 46
2. Hacer clic en "Guardar"
3. Esperar mensaje de éxito
4. Recargar la página (F5)

#### ✅ Resultado Esperado
- [ ] Muestra spinner mientras guarda
- [ ] Mensaje: "Cambios guardados exitosamente" (8 segundos)
- [ ] Los datos permanecen después de recargar
- [ ] No hay errores en consola

#### ❌ Si falla
- Revisar en Network:
  - `PATCH histories/{id}` → debe responder 200
  - `PATCH appointments/{id}` → debe responder 200
- Verificar payload enviado

---

### **Test 6: Campos para Mujeres (Solo si el paciente es mujer)**

#### Objetivo
Verificar que los campos específicos para mujeres aparezcan.

#### Pasos
1. Abrir historia de una paciente mujer (sex = "F")

#### ✅ Resultado Esperado
- [ ] Aparecen campos adicionales:
  - [ ] Gestación (Sí/No)
  - [ ] Menstruación (Sí/No)
  - [ ] Usa Método Anticonceptivo (Sí/No)
  - [ ] Si selecciona "Sí", aparecen más opciones:
    - [ ] Método Anticonceptivo
    - [ ] Si selecciona DIU, aparece tipo de DIU

#### ❌ Si falla
- Verificar que `isFemale` se calcule correctamente
- Revisar componente `ContraceptiveFields`

---

### **Test 7: Generación de PDFs**

#### Objetivo
Verificar que se generen boleta y ficha correctamente.

#### Pasos
1. Con una cita seleccionada que tenga todos los datos
2. Hacer clic en "Generar Boleta"
3. Cerrar modal
4. Hacer clic en "Generar Ficha"

#### ✅ Resultado Esperado
- [ ] **Boleta:**
  - [ ] Muestra modal con vista previa del PDF
  - [ ] Tiene nombre del paciente
  - [ ] Tiene fecha de cita
  - [ ] Tiene monto y tipo de pago
  - [ ] Tiene número de ticket
- [ ] **Ficha:**
  - [ ] Muestra modal con vista previa completa
  - [ ] Tiene todos los datos del paciente
  - [ ] Tiene datos de la cita seleccionada
  - [ ] Tiene número de visitas

#### ❌ Si falla
- Verificar que `patient` llegue a los componentes PDF
- Revisar `PDFModals.jsx`
- Ver consola de errores de `@react-pdf/renderer`

---

### **Test 8: Paciente Nuevo (Sin Historia)**

#### Objetivo
Verificar que funcione con un paciente que no tiene historia previa.

#### Pasos
1. Crear un paciente nuevo en el sistema
2. Registrar una cita para ese paciente
3. Abrir la historia del paciente nuevo

#### ✅ Resultado Esperado
- [ ] Se carga el formulario aunque no tenga historia
- [ ] Campos están vacíos excepto nombre del paciente
- [ ] Puedes llenar los campos
- [ ] Al guardar, crea el historial automáticamente
- [ ] No hay errores

#### ❌ Si falla
- Verificar que el backend cree el historial automáticamente
- Revisar `usePatientHistory` hook

---

### **Test 9: Navegación Entre Citas**

#### Objetivo
Verificar que puedas cambiar entre diferentes citas del mismo paciente.

#### Pasos
1. Abrir historial de un paciente con múltiples citas
2. Seleccionar primera cita → observar datos
3. Seleccionar segunda cita → observar cambios
4. Volver a la primera cita

#### ✅ Resultado Esperado
- [ ] Los datos cambian según la cita seleccionada
- [ ] El terapeuta cambia si es diferente
- [ ] Los diagnósticos y dolencias se actualizan
- [ ] Sin errores al cambiar

#### ❌ Si falla
- Verificar `useEffect` de selección de cita
- Revisar que `selectedAppointment` se actualice

---

### **Test 10: Validaciones**

#### Objetivo
Verificar que las validaciones funcionen.

#### Pasos
1. Intentar guardar SIN seleccionar una cita
2. Intentar ingresar valores inválidos en peso (letras)
3. Intentar guardar con campos requeridos vacíos

#### ✅ Resultado Esperado
- [ ] Sin cita: muestra error "Debe seleccionar una cita"
- [ ] Valores inválidos: Ant Design valida el formato
- [ ] No permite guardar si falla validación

#### ❌ Si falla
- Revisar `validateAppointmentId`
- Verificar reglas de validación en `validators.js`

---

## 🔍 Tests de Consola (Debugging)

### Verificar logs en la consola del navegador:

```javascript
// Logs esperados al cargar:
[usePatientHistory] ✅ Sin errores
[usePatientAppointments] ✅ Sin errores

// Logs al guardar:
[PatientHistory] Datos actualizados exitosamente
```

### Verificar Network (F12 → Network):

| Endpoint | Método | Estado | Respuesta |
|----------|--------|--------|-----------|
| `patients/appoiments/{id}` | GET | 200 | `{ appointments: [...], patient: {...} }` |
| `histories/patient/{id}` | GET | 200 | `{ data: {...} }` |
| `histories/{id}` | PATCH | 200 | `{ data: {...} }` |
| `appointments/{id}` | PATCH | 200 | `{ data: {...} }` |
| `staff` | GET | 200 | `{ data: [...], meta: {...} }` |

---

## 🐛 Problemas Comunes y Soluciones

### ❌ "Nombre del paciente no aparece"

**Verificar:**
1. Consola: warnings de `[PatientHistory]`
2. Network: que `patients/appoiments/{id}` retorne `patient: { name, paternal_lastname, maternal_lastname }`
3. Que el hook `usePatientAppointments` retorne `patient`

**Solución:**
- Si no retorna `patient`, el backend no está usando la nueva estructura
- Revisar que backend envíe `patient` a nivel raíz

---

### ❌ "No se guardan los cambios"

**Verificar:**
1. Que haya una cita seleccionada
2. Network: que las peticiones PATCH respondan 200
3. Consola: errores de validación

**Solución:**
- Verificar que `historyId` y `appointmentId` existan
- Revisar payload enviado

---

### ❌ "Error al cargar terapeutas"

**Verificar:**
1. Endpoint `GET staff` responde correctamente
2. Modal se abre sin errores

**Solución:**
- Verificar permisos del usuario
- Revisar que el endpoint de staff funcione

---

### ❌ "Peso no se actualiza después de guardar"

**Verificar:**
1. Función `updateWeightFieldsAfterSave` se ejecuta
2. Que `refetchHistory` traiga datos actualizados

**Solución:**
- Ver si hay errores en `calculateWeightUpdate`
- Verificar que el formulario se actualice después del guardado

---

## 📊 Matriz de Pruebas

### Escenarios por Tipo de Paciente

| Escenario | Paciente Nuevo | Paciente Existente | Mujer | Hombre |
|-----------|---------------|-------------------|-------|--------|
| Carga de datos | ✅ | ✅ | ✅ | ✅ |
| Campos anticonceptivos | - | - | ✅ | - |
| Peso inicial | ✅ | ✅ | ✅ | ✅ |
| Sin citas | ✅ | - | ✅ | ✅ |
| Con citas | - | ✅ | ✅ | ✅ |
| Generar PDFs | - | ✅ | ✅ | ✅ |

---

## 🎯 Checklist Final

Antes de considerar History como "funcionando correctamente", verifica:

### Funcionalidad Core
- [ ] Carga nombre del paciente
- [ ] Carga datos de historia
- [ ] Carga lista de citas
- [ ] Puede seleccionar citas
- [ ] Puede guardar cambios
- [ ] Peso se maneja correctamente

### Interacciones
- [ ] Búsqueda de terapeuta funciona
- [ ] Campos para mujeres aparecen
- [ ] Validaciones funcionan
- [ ] Generación de PDFs funciona

### Rendimiento
- [ ] Carga en menos de 2 segundos
- [ ] Sin errores en consola
- [ ] Sin warnings críticos
- [ ] Peticiones responden 200

### UX
- [ ] Spinners se muestran mientras carga
- [ ] Mensajes de éxito/error claros
- [ ] Navegación fluida entre citas
- [ ] Formulario intuitivo

---

## 📝 Plantilla de Reporte de Bug

Si encuentras algún problema, usa este formato:

```markdown
### Bug: [Título descriptivo]

**Severidad:** Alta / Media / Baja

**Pasos para reproducir:**
1. 
2. 
3. 

**Resultado esperado:**
...

**Resultado actual:**
...

**Consola (errores):**
```
[Pegar errores aquí]
```

**Network (peticiones):**
- Endpoint:
- Método:
- Estado:
- Respuesta:

**Screenshot:**
[Si aplica]
```

---

## 🚀 Próximos Pasos Después del Testeo

Una vez que todos los tests pasen:

1. [ ] Documentar casos edge encontrados
2. [ ] Optimizaciones de rendimiento si es necesario
3. [ ] Pruebas de integración con otros módulos
4. [ ] Testing en diferentes navegadores
5. [ ] Testing con datos reales de producción (ambiente staging)

---

**Fecha:** Octubre 14, 2025  
**Módulo:** History2  
**Estado:** Listo para testing 🧪

