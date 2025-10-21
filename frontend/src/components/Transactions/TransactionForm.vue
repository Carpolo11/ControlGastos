<template>
  <form class="transaction-form" @submit.prevent="enviar">
    <h2>{{ isEditing ? "Editar Transacción" : "Registrar Nueva Transacción" }}</h2>

    <div class="form-grid">
      <div class="form-group">
        <label>📅 Fecha</label>
        <input type="date" v-model="transaccion.fecha" required />
      </div>

      <div class="form-group">
        <label>💵 Monto</label>
        <input type="number" v-model.number="transaccion.monto" min="0" required />
      </div>

      <div class="form-group">
        <label>📂 Tipo</label>
        <select v-model="transaccion.tipo" required>
          <option disabled value="">Seleccione...</option>
          <option>Ingreso</option>
          <option>Egreso</option>
        </select>
      </div>

      <div class="form-group">
        <label>🏷️ Categoría</label>
        <select v-model="transaccion.categoria" required>
          <option disabled value="">Seleccione...</option>
          <option>Alimentación</option>
          <option>Transporte</option>
          <option>Salud</option>
          <option>Entretenimiento</option>
          <option>Educación</option>
        </select>
      </div>

      <div class="form-group">
        <label>🧾 Descripción</label>
        <input type="text" v-model="transaccion.descripcion" placeholder="Detalles de la transacción" required />
      </div>

      <div class="form-group">
        <label>👤 Usuario</label>
        <input type="text" v-model="transaccion.usuario" placeholder="Nombre del usuario" required />
      </div>
    </div>

    <button type="submit" class="btn-registrar">
      {{ isEditing ? "Actualizar" : "Registrar Transacción" }}
    </button>
  </form>
</template>

<script setup>
import { reactive, ref, defineEmits, onMounted } from 'vue'
const emit = defineEmits(['registrar'])

const transaccion = reactive({
  id: null,
  fecha: '',
  monto: '',
  tipo: '',
  categoria: '',
  descripcion: '',
  usuario: ''
})

const isEditing = ref(false)

function enviar() {
  emit('registrar', { ...transaccion })
  limpiar()
}

function limpiar() {
  Object.assign(transaccion, {
    id: null,
    fecha: '',
    monto: '',
    tipo: '',
    categoria: '',
    descripcion: '',
    usuario: ''
  })
  isEditing.value = false
}

onMounted(() => {
  window.addEventListener('editar-transaccion', e => {
    Object.assign(transaccion, e.detail)
    isEditing.value = true
  })
})
</script>

<style scoped>
.transaction-form {
  width: 100%;
  background: linear-gradient(145deg, #eef2ff, #e0e7ff);
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.25);
  text-align: left;
}

h2 {
  text-align: center;
  color: #4f46e5;
  font-weight: 700;
  margin-bottom: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: #4338ca;
  margin-bottom: 0.3rem;
}

input, select {
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f9fafb;
  transition: 0.3s;
}

input:focus, select:focus {
  border-color: #6366f1;
  outline: none;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
}

.btn-registrar {
  margin-top: 1rem;
  width: 100%;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  padding: 0.9rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.btn-registrar:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}
</style>
