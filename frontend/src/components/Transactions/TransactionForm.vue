<template>
  <form class="transaction-form" @submit.prevent="enviar">
    <div class="form-row">
      <div class="form-group">
        <label>📅 Fecha</label>
        <input type="date" v-model="transaccion.fecha" required />
      </div>

      <div class="form-group">
        <label>🔄 Tipo</label>
        <select v-model="transaccion.tipo" required>
          <option value="">Seleccionar</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
        </select>
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label>💵 Monto</label>
        <input type="number" v-model.number="transaccion.monto" min="0" step="0.01" required />
      </div>

      <div class="form-group">
        <label>📂 Categoría</label>
        <select v-model="transaccion.categoria" required>
          <option value="">Seleccionar</option>
          <optgroup label="Ingresos" v-if="transaccion.tipo === 'ingreso'">
            <option value="salario">Salario</option>
            <option value="freelance">Freelance</option>
            <option value="negocio">Negocio</option>
            <option value="inversion">Inversión</option>
            <option value="otro_ingreso">Otro</option>
          </optgroup>
          <optgroup label="Egresos" v-if="transaccion.tipo === 'egreso'">
            <option value="alimentacion">Alimentación</option>
            <option value="transporte">Transporte</option>
            <option value="vivienda">Vivienda</option>
            <option value="servicios">Servicios</option>
            <option value="salud">Salud</option>
            <option value="educacion">Educación</option>
            <option value="entretenimiento">Entretenimiento</option>
            <option value="otro_egreso">Otro</option>
          </optgroup>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>👤 Usuario</label>
      <input type="text" v-model="transaccion.usuario" placeholder="Nombre" required />
    </div>

    <div class="form-group">
      <label>📝 Descripción</label>
      <textarea v-model="transaccion.descripcion" placeholder="Describe la transacción..." rows="2" required></textarea>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn-registrar">
        {{ modoEdicion ? '✓ Actualizar' : '+ Registrar' }}
      </button>
      <button v-if="modoEdicion" type="button" class="btn-cancelar" @click="cancelarEdicion">
        ✕ Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  transaccionEditar: Object,
  modoEdicion: Boolean
})

const emit = defineEmits(['registrar', 'actualizar', 'cancelar'])

const transaccion = reactive({ 
  fecha: '', tipo: '', monto: '', categoria: '', descripcion: '', usuario: ''
})

watch(() => props.transaccionEditar, (nueva) => {
  if (nueva) Object.assign(transaccion, nueva)
}, { immediate: true })

function enviar() {
  const datos = { ...transaccion, id: props.modoEdicion ? transaccion.id : Date.now() }
  emit(props.modoEdicion ? 'actualizar' : 'registrar', datos)
  limpiarFormulario()
}

function cancelarEdicion() {
  emit('cancelar')
  limpiarFormulario()
}

function limpiarFormulario() {
  Object.assign(transaccion, { fecha: '', tipo: '', monto: '', categoria: '', descripcion: '', usuario: '' })
}
</script>

<style scoped>
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

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

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.form-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

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

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>