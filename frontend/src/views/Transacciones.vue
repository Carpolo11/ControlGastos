<template>
  <section class="transacciones-page">
    <header class="header">
      <h1>💸 Registro de Transacciones</h1>
      <p>Gestiona tus movimientos financieros con una experiencia moderna y profesional.</p>
    </header>

    <main class="main-content">
      <div class="card-container">
        <TransactionForm @registrar="agregarTransaccion" />
        <TransactionList
          :transacciones="transacciones"
          @eliminar="eliminarTransaccion"
          @editar="editarTransaccion"
        />
      </div>
    </main>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TransactionForm from '../components/transactions/TransactionForm.vue'
import TransactionList from '../components/transactions/TransactionList.vue'

const transacciones = ref([])

function agregarTransaccion(t) {
  // Si es edición, actualiza
  const index = transacciones.value.findIndex(tx => tx.id === t.id)
  if (index !== -1) {
    transacciones.value[index] = t
  } else {
    t.id = Date.now()
    transacciones.value.push(t)
  }
}

function eliminarTransaccion(id) {
  transacciones.value = transacciones.value.filter(tx => tx.id !== id)
}

function editarTransaccion(transaccion) {
  // Enviar evento al formulario (reactivo)
  window.dispatchEvent(new CustomEvent('editar-transaccion', { detail: transaccion }))
}
</script>

<style scoped>
.transacciones-page {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #a5b4fc 100%);
  color: #f9fafb;
  font-family: "Poppins", system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.header {
  text-align: center;
  margin-bottom: 1rem;
}

.header h1 {
  font-size: 2.4rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.header p {
  font-size: 1rem;
  color: #e0e7ff;
}

.card-container {
  background: white;
  border-radius: 18px;
  padding: 1.8rem 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: fadeIn 1s ease;
  max-width: 950px;
  width: 100%;
  max-height: 78vh;
  overflow-y: auto;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
