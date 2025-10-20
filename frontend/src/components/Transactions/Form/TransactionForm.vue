<template>
  <form class="transaction-form" @submit.prevent="enviar">
    <h2>{{ isEditing ? "✏️ Editar Transacción" : "🧾 Registrar Nueva Transacción" }}</h2>

    <div class="form-layout">
      <div class="col">
        <TransactionField label="📅 Fecha" type="date" v-model="transaccion.fecha" />
        <TransactionField label="💵 Monto" type="number" v-model="transaccion.monto" />
        <TransactionSelector
          label="📂 Tipo"
          :options="['Ingreso', 'Egreso']"
          v-model="transaccion.tipo"
        />
      </div>

      <div class="col">
        <TransactionSelector
          label="🏷️ Categoría"
          :options="['Alimentación','Transporte','Salud','Entretenimiento','Educación','Otros']"
          v-model="transaccion.categoria"
        />
        <TransactionField label="🧾 Descripción" v-model="transaccion.descripcion" />
        <TransactionField label="👤 Usuario" v-model="transaccion.usuario" />
      </div>
    </div>

    <div class="button-container">
      <button type="submit" class="btn-registrar">
        {{ isEditing ? "Actualizar Transacción" : "Registrar Transacción" }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, ref, defineEmits, onMounted } from 'vue'
import TransactionField from './TransactionField.vue'
import TransactionSelector from './TransactionSelector.vue'

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
  background: linear-gradient(145deg, #eef2ff, #e0e7ff);
  padding: 2rem 3rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.25);
  text-align: left;
}
h2 {
  text-align: center;
  color: #4f46e5;
  font-weight: 700;
  font-size: 1.6rem;
  margin-bottom: 1.5rem;
}
.form-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}
.btn-registrar {
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-registrar:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}
@media (max-width: 850px) {
  .form-layout {
    grid-template-columns: 1fr;
  }
}
</style>
