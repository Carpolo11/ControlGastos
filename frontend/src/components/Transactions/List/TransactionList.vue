<template>
  <div class="transaction-list">
    <h2>📜 Historial de Transacciones</h2>

    <div v-if="transacciones.length" class="historial">
      <TransactionGroup
        v-for="tipo in ['Ingreso', 'Egreso']"
        :key="tipo"
        :titulo="tipo + 's'"
        :transacciones="filtrarPorTipo(tipo)"
        @editar="$emit('editar', $event)"
        @eliminar="$emit('eliminar', $event)"
      />
    </div>

    <p v-else class="no-data">🌱 Aún no hay transacciones registradas.</p>
  </div>
</template>

<script setup>
import TransactionGroup from './TransactionGroup.vue'

const props = defineProps({
  transacciones: Array
})
defineEmits(['editar', 'eliminar'])

function filtrarPorTipo(tipo) {
  return props.transacciones.filter(tx => tx.tipo === tipo)
}
</script>

<style scoped>
.transaction-list {
  width: 100%;
  text-align: center;
}
h2 {
  color: #4338ca;
  font-weight: 700;
  margin-bottom: 1.2rem;
}
.no-data {
  margin-top: 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #4f46e5;
  background: rgba(99, 102, 241, 0.08);
  padding: 1rem 1.5rem;
  border-radius: 10px;
  display: inline-block;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.15);
}
</style>
