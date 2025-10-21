<template>
  <div class="transaction-list">
    <div class="list-header">
      <h3>📜 Historial de Transacciones</h3>
      
      <TransactionFilters 
        :familias="familias"
        v-model:filtro-familia="filtroFamilia"
        v-model:filtro-tipo="filtroTipo"
      />
    </div>

    <TransactionSummary 
      v-if="transaccionesFiltradas.length"
      :transacciones="transaccionesFiltradas" 
    />

    <p v-if="!transaccionesFiltradas.length" class="no-data">
      {{ filtroFamilia || filtroTipo ? 'No hay transacciones con estos filtros.' : 'No hay transacciones registradas.' }}
    </p>

    <ul v-else class="transaction-cards">
      <TransactionCard 
        v-for="t in transaccionesFiltradas" 
        :key="t.id" 
        :transaccion="t"
        @editar="$emit('editar', $event)"
        @eliminar="$emit('eliminar', $event)"
      />
    </ul>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import TransactionFilters from './TransactionFilters.vue'
import TransactionSummary from './TransactionSummary.vue'
import TransactionCard from './TransactionCard.vue'

const props = defineProps({
  transacciones: Array
})

const emit = defineEmits(['editar', 'eliminar'])

const filtroFamilia = ref('')
const filtroTipo = ref('')

const familias = computed(() => {
  const usuarios = props.transacciones.map(t => t.usuario)
  return [...new Set(usuarios)].sort()
})

const transaccionesFiltradas = computed(() => {
  return props.transacciones.filter(t => {
    const cumpleFamilia = !filtroFamilia.value || t.usuario === filtroFamilia.value
    const cumpleTipo = !filtroTipo.value || t.tipo === filtroTipo.value
    return cumpleFamilia && cumpleTipo
  })
})
</script>

<style scoped>
.transaction-list {
  margin-top: 2.5rem;
}

.list-header {
  margin-bottom: 1.5rem;
}

h3 {
  color: #4f46e5;
  font-weight: 600;
  margin-bottom: 1rem;
}

.no-data {
  color: #9ca3af;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

.transaction-cards {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>