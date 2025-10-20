<template>
  <section class="transacciones-page">
    <!-- 🔹 Encabezado -->
    <header class="header">
      <h1>💸 Registro de Transacciones</h1>
      <p>Gestiona tus movimientos financieros con una experiencia moderna y profesional.</p>
    </header>

    <!-- 🔹 Contenido principal -->
    <main class="main-content">
      <div class="card-container">
        <!-- Formulario -->
        <TransactionForm @registrar="agregarTransaccion" />

        <!-- Historial -->
        <TransactionList
          :transacciones="transacciones"
          @editar="editarTransaccion"
          @eliminar="eliminarTransaccion"
        />
      </div>
    </main>
  </section>
</template>

<script setup>
import { ref } from 'vue'

// ✅ Imports actualizados con la nueva estructura
import TransactionForm from '../components/transactions/form/TransactionForm.vue'
import TransactionList from '../components/transactions/list/TransactionList.vue'

const transacciones = ref([])
const transaccionEnEdicion = ref(null)

// 🔹 Agregar nueva transacción
function agregarTransaccion(t) {
  if (t.id) {
    // si existe, actualizar
    const index = transacciones.value.findIndex(x => x.id === t.id)
    if (index !== -1) transacciones.value[index] = { ...t }
  } else {
    // si no existe, crear nueva
    transacciones.value.push({ ...t, id: Date.now() })
  }
}

// 🔹 Editar
function editarTransaccion(tx) {
  transaccionEnEdicion.value = tx
  const evento = new CustomEvent('editar-transaccion', { detail: tx })
  window.dispatchEvent(evento)
}

// 🔹 Eliminar
function eliminarTransaccion(id) {
  transacciones.value = transacciones.value.filter(t => t.id !== id)
}
</script>

<style scoped>
/* === Estructura principal === */
.transacciones-page {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #a5b4fc 100%);
  color: #f9fafb;
  font-family: "Poppins", system-ui, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

/* === Encabezado === */
.header {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeIn 1.2s ease-out;
}

.header h1 {
  font-size: 2.6rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header p {
  font-size: 1.1rem;
  color: #e0e7ff;
}

/* === Contenedor principal === */
.main-content {
  width: 100%;
  max-width: 1000px;
}

.card-container {
  background: white;
  border-radius: 20px;
  padding: 2.4rem;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  animation: slideUp 1s ease;
  max-height: 82vh;
  overflow-y: auto;
}

/* === Animaciones === */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* === Responsivo === */
@media (max-width: 768px) {
  .card-container {
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header p {
    font-size: 1rem;
  }
}
</style>
