<template>
  <div class="filters">
    <select v-model="filtroFamiliaLocal" class="filter-select" @change="emitirCambio">
      <option value="">Todas las familias</option>
      <option v-for="familia in familias" :key="familia" :value="familia">
        {{ familia }}
      </option>
    </select>

    <select v-model="filtroTipoLocal" class="filter-select" @change="emitirCambio">
      <option value="">Todos los tipos</option>
      <option value="ingreso">Ingresos</option>
      <option value="egreso">Egresos</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  familias: Array,
  filtroFamilia: String,
  filtroTipo: String
})

const emit = defineEmits(['update:filtroFamilia', 'update:filtroTipo'])

const filtroFamiliaLocal = ref(props.filtroFamilia || '')
const filtroTipoLocal = ref(props.filtroTipo || '')

watch(() => props.filtroFamilia, (nuevo) => {
  filtroFamiliaLocal.value = nuevo || ''
})

watch(() => props.filtroTipo, (nuevo) => {
  filtroTipoLocal.value = nuevo || ''
})

function emitirCambio() {
  emit('update:filtroFamilia', filtroFamiliaLocal.value)
  emit('update:filtroTipo', filtroTipoLocal.value)
}
</script>

<style scoped>
.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

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

.filter-select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

@media (max-width: 600px) {
  .filters {
    flex-direction: column;
  }
  
  .filter-select {
    min-width: 100%;
  }
}
</style>