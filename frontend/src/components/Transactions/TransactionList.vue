<template>
  <div class="transaction-list">
    
    <!-- Encabezado con título y filtros -->
    <div class="list-header">
      <h3>📜 Historial de Transacciones</h3>
      
      <!-- Componente de filtros por identificación y tipo -->
      <TransactionFilters 
        :identificaciones="identificaciones"
        v-model:filtro-identificacion="filtroIdentificacion"
        v-model:filtro-tipo="filtroTipo"
      />
    </div>

    <!-- Resumen financiero (totales y balance) -->
    <TransactionSummary 
      v-if="transaccionesFiltradas.length"
      :transacciones="transaccionesFiltradas" 
    />

    <!-- Mensaje cuando no hay transacciones -->
    <p v-if="!transaccionesFiltradas.length" class="no-data">
      {{ filtroIdentificacion || filtroTipo ? 'No hay transacciones con estos filtros.' : 'No hay transacciones registradas.' }}
    </p>

    <!-- Lista de cards de transacciones -->
    <ul v-else class="transaction-cards">
      <TransactionCard 
        v-for="t in transaccionesFiltradas" 
        :key="t.id_transaccion" 
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

// Props: recibe el array de transacciones
const props = defineProps({
  transacciones: Array
})

// Eventos que emite hacia el padre
const emit = defineEmits(['editar', 'eliminar'])

// Estado de los filtros
const filtroIdentificacion = ref('')
const filtroTipo = ref('')

// Computed: extrae lista única de identificaciones
const identificaciones = computed(() => {
  const ids = props.transacciones.map(t => t.identificacion)
  return [...new Set(ids)].sort()
})

// Computed: filtra transacciones según filtros activos
const transaccionesFiltradas = computed(() => {
  return props.transacciones.filter(t => {
    const cumpleIdentificacion = !filtroIdentificacion.value || t.identificacion === filtroIdentificacion.value
    const cumpleTipo = !filtroTipo.value || t.tipo.toLowerCase() === filtroTipo.value.toLowerCase()
    return cumpleIdentificacion && cumpleTipo
  })
})
</script>

<style scoped>
/* Contenedor principal de la lista */
.transaction-list {
  margin-top: 2.5rem;
}

/* Encabezado con título y filtros */
.list-header {
  margin-bottom: 1.5rem;
}

/* Título del historial */
h3 {
  color: #4f46e5;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* Mensaje de lista vacía */
.no-data {
  color: white;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

/* Lista de cards sin estilos de lista */
.transaction-cards {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>