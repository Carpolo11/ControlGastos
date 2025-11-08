<template>
  <form class="transaction-form" @submit.prevent="enviar">
    
    <!-- Fila 1: Fecha y Tipo -->
    <div class="form-row">
      <div class="form-group">
        <label>📅 Fecha</label>
        <input type="date" v-model="transaccion.fecha" required />
      </div>

      <div class="form-group">
        <label>🔄 Tipo</label>
        <select v-model="transaccion.tipo" required>
          <option value="">Seleccionar</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
      </div>
    </div>

    <!-- Fila 2: Monto y Categoría -->
    <div class="form-row">
      <div class="form-group">
        <label>💵 Monto</label>
        <input type="number" v-model.number="transaccion.monto" min="0" step="0.01" required />
      </div>

      <div class="form-group">
        <label>📂 Categoría</label>
        <select v-model="transaccion.idcategoria" required>
          <option value="">Seleccionar</option>
          <option 
            v-for="categoria in categorias" 
            :key="categoria.idcategoria" 
            :value="categoria.idcategoria"
          >
            {{ categoria.nombre_categoria }}
          </option>
        </select>
      </div>
    </div>

    <!-- Fila 3: Identificación y Familia -->
    <div class="form-row">
      <div class="form-group">
        <label>🆔 Identificación</label>
        <input 
          type="text" 
          v-model="transaccion.identificacion" 
          placeholder="Ingresa tu identificación..." 
          required 
        />
      </div>

      <div class="form-group">
        <label>👨‍👩‍👧‍👦 Asignar a Familia</label>
        <select v-model="transaccion.id_familia" required>
          <option value="">Seleccionar</option>
          <option 
            v-for="familia in familias" 
            :key="familia.id_familia" 
            :value="familia.id_familia"
          >
            {{ familia.nombre_familia }}
          </option>
        </select>
      </div>
    </div>

    <!-- Campo Descripción -->
    <div class="form-group">
      <label>📝 Descripción</label>
      <textarea 
        v-model="transaccion.descripcion" 
        placeholder="Describe la transacción..." 
        rows="2" 
        required
      ></textarea>
    </div>

    <!-- Botones de acción -->
    <div class="form-actions">
      <button type="submit" class="btn-registrar">
        {{ modoEdicion ? '✔ Actualizar' : '+ Registrar' }}
      </button>
      
      <button v-if="modoEdicion" type="button" class="btn-cancelar" @click="cancelarEdicion">
        ✕ Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

// Props recibidos del componente padre
const props = defineProps({
  transaccionEditar: Object,
  modoEdicion: Boolean,
  familias: Array,
  categorias: Array,
  idFamiliaUsuario: Number
})

// Eventos que emite hacia el padre
const emit = defineEmits(['registrar', 'actualizar', 'cancelar'])

// Estado reactivo del formulario
const transaccion = reactive({ 
  fecha: '', 
  tipo: '', 
  monto: '', 
  idcategoria: '', 
  descripcion: '', 
  identificacion: '',
  id_familia: ''
})

// Observador: cuando cambia transaccionEditar, carga los datos en el formulario
watch(() => props.transaccionEditar, (nueva) => {
  if (nueva) {
    Object.assign(transaccion, nueva)
  }
}, { immediate: true })

// Enviar formulario: registra nueva o actualiza existente
function enviar() {
  // Validar que todos los campos estén completos
  if (!transaccion.fecha || !transaccion.tipo || !transaccion.monto || 
      !transaccion.idcategoria || !transaccion.descripcion || 
      !transaccion.identificacion || !transaccion.id_familia) {
    alert('⚠️ Por favor completa todos los campos');
    return;
  }

  const datos = { 
    ...transaccion, 
    id_transaccion: props.modoEdicion ? transaccion.id_transaccion : Date.now()
  }

  console.log("📤 Enviando transacción:", datos);
  emit(props.modoEdicion ? 'actualizar' : 'registrar', datos);
  
  if (!props.modoEdicion) {
    limpiarFormulario();
  }
}

// Cancelar edición y limpiar formulario
function cancelarEdicion() {
  emit('cancelar')
  limpiarFormulario()
}

// Resetear todos los campos del formulario
function limpiarFormulario() {
  Object.assign(transaccion, { 
    fecha: '', 
    tipo: '', 
    monto: '', 
    idcategoria: '', 
    descripcion: '', 
    identificacion: '',
    id_familia: '' 
  })
}
</script>

<style scoped>
/* Contenedor del formulario */
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Filas con dos columnas para campos lado a lado */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Contenedor de cada campo */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Estilos de las etiquetas */
label {
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

/* Estilos de inputs, selects y textareas */
input, select, textarea {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
}

/* Estado focus de los campos */
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Contenedor de botones */
.form-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

/* Botón principal (Registrar/Actualizar) */
.btn-registrar {
  flex: 1;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-registrar:hover {
  opacity: 0.9;
}

/* Botón secundario (Cancelar) */
.btn-cancelar {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancelar:hover {
  background: #4b5563;
}

/* Responsive: una columna en móviles */
@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>