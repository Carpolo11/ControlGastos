<template>
  <div class="filters">
    
    <!-- Filtro por familia/usuario -->
    <select v-model="filtroFamiliaLocal" class="filter-select" @change="emitirCambio">
      <option value="">Todas las familias</option>
      <option v-for="familia in familias" :key="familia" :value="familia">
        {{ familia }}
      </option>
    </select>

    <!-- Filtro por tipo (ingreso/egreso) -->
    <select v-model="filtroTipoLocal" class="filter-select" @change="emitirCambio">
      <option value="">Todos los tipos</option>
      <option value="ingreso">Ingresos</option>
      <option value="egreso">Egresos</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Props: recibe listas y valores de filtros
const props = defineProps({
  familias: Array,
  filtroFamilia: String,
  filtroTipo: String
})

// Eventos: emite cambios de filtros usando v-model
const emit = defineEmits(['update:filtroFamilia', 'update:filtroTipo'])

// Estado local de los filtros
const filtroFamiliaLocal = ref(props.filtroFamilia || '')
const filtroTipoLocal = ref(props.filtroTipo || '')

// Observador: sincroniza filtro familia con props
watch(() => props.filtroFamilia, (nuevo) => {
  filtroFamiliaLocal.value = nuevo || ''
})

// Observador: sincroniza filtro tipo con props
watch(() => props.filtroTipo, (nuevo) => {
  filtroTipoLocal.value = nuevo || ''
})

// Emitir cambios al componente padre
function emitirCambio() {
  emit('update:filtroFamilia', filtroFamiliaLocal.value)
  emit('update:filtroTipo', filtroTipoLocal.value)
}
</script>

<style scoped>
/* Contenedor de filtros */
.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Selectores de filtro */
.filter-select {
  flex: 1;
  min-width: 200px;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f9fafb;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

/* Estado focus del selector */
.filter-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

/* Responsive: columna única en móviles */
@media (max-width: 600px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: 100%;
  }
}
</style>