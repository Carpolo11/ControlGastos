<template>
  <section class="transacciones-container">
    <div class="header">
      <h1>💰 Registro de Transacciones</h1>
      <p>Gestiona tus movimientos financieros de forma simple y elegante.</p>
    </div>

    <div class="content">
      <TransactionForm 
        @registrar="agregarTransaccion" 
        @actualizar="actualizarTransaccion"
        @cancelar="cancelarEdicion"
        :transaccion-editar="transaccionEditar"
        :modo-edicion="modoEdicion"
      />
      <TransactionList 
        :transacciones="transacciones" 
        @editar="editarTransaccion"
        @eliminar="eliminarTransaccion"
      />
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TransactionForm from '../components/transactions/TransactionForm.vue'
import TransactionList from '../components/transactions/TransactionList.vue'

const transacciones = ref([])
const transaccionEditar = ref(null)
const modoEdicion = ref(false)

function agregarTransaccion(t) {
  transacciones.value.push({
    ...t,
    id: Date.now()
  })
}

function editarTransaccion(t) {
  transaccionEditar.value = { ...t }
  modoEdicion.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function actualizarTransaccion(t) {
  const index = transacciones.value.findIndex(trans => trans.id === t.id)
  if (index !== -1) {
    transacciones.value[index] = t
  }
  cancelarEdicion()
}

function eliminarTransaccion(id) {
  transacciones.value = transacciones.value.filter(t => t.id !== id)
}

function cancelarEdicion() {
  transaccionEditar.value = null
  modoEdicion.value = false
}
</script>

<style scoped>
.transacciones-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #eef2ff 0%, #f3f4f6 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  font-family: "Inter", system-ui, sans-serif;
  color: #1f2937;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #4f46e5;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header p {
  color: #6b7280;
  font-size: 1rem;
}

.content {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  transition: transform 0.3s;
}

.content:hover {
  transform: translateY(-3px);
}

@media (max-width: 600px) {
  .content {
    padding: 1.5rem;
  }
}
</style>