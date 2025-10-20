<template>
  <div v-if="transacciones.length" class="grupo">
    <h3>{{ titulo }}</h3>
    <TransactionTable
      :transacciones="transacciones"
      @editar="$emit('editar', $event)"
      @eliminar="$emit('eliminar', $event)"
    />
  </div>
</template>

<script setup>
import TransactionTable from './TransactionTable.vue'

defineProps({
  titulo: String,
  transacciones: Array
})
defineEmits(['editar', 'eliminar'])
</script>

<style scoped>
.grupo {
  margin-bottom: 2rem;
}
h3 {
  margin-top: 1.5rem;
  margin-bottom: 0.8rem;
  font-size: 1.3rem;
  font-weight: 700;
  color: #4f46e5;
  text-transform: uppercase;
  border-bottom: 2px solid #4f46e5;
  display: inline-block;
  padding-bottom: 0.3rem;
}
</style>
