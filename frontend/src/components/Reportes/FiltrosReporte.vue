<template>
  <div class="filtros-container">
    <h2>🔍 Filtros de Búsqueda</h2>
    
    <form @submit.prevent="aplicarFiltros" class="filtros-form">
      <div class="filtros-grid">
        <!-- Rango de Fechas -->
        <div class="filtro-group">
          <label>📅 Fecha Inicio</label>
          <input 
            v-model="filtrosLocal.fechaInicio" 
            type="date" 
            class="input-field"
          />
        </div>

        <div class="filtro-group">
          <label>📅 Fecha Fin</label>
          <input 
            v-model="filtrosLocal.fechaFin" 
            type="date" 
            class="input-field"
          />
        </div>

        <!-- Categoría -->
        <div class="filtro-group">
          <label>🏷️ Categoría</label>
          <select v-model="filtrosLocal.categoria" class="input-field">
            <option value="">Todas las categorías</option>
            <option value="Alimentación">Alimentación</option>
            <option value="Transporte">Transporte</option>
            <option value="Salud">Salud</option>
            <option value="Educación">Educación</option>
            <option value="Entretenimiento">Entretenimiento</option>
            <option value="Servicios">Servicios</option>
            <option value="Salario">Salario</option>
            <option value="Otros">Otros</option>
          </select>
        </div>

        <!-- Miembro de Familia -->
        <div class="filtro-group">
          <label>👤 Miembro</label>
          <select v-model="filtrosLocal.idMiembro" class="input-field">
            <option value="">Todos los miembros</option>
            <option 
              v-for="miembro in miembros" 
              :key="miembro.id" 
              :value="miembro.id"
            >
              {{ miembro.nombre }} {{ miembro.apellido }}
            </option>
          </select>
        </div>
      </div>

      <div class="botones-group">
        <button type="submit" class="btn-aplicar">
          ✓ Aplicar Filtros
        </button>
        <button type="button" @click="limpiarFiltros" class="btn-limpiar">
          ✕ Limpiar Filtros
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  miembros: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['aplicar-filtros'])

const filtrosLocal = ref({
  fechaInicio: '',
  fechaFin: '',
  categoria: '',
  idMiembro: ''
})

function aplicarFiltros() {
  emit('aplicar-filtros', { ...filtrosLocal.value })
}

function limpiarFiltros() {
  filtrosLocal.value = {
    fechaInicio: '',
    fechaFin: '',
    categoria: '',
    idMiembro: ''
  }
  emit('aplicar-filtros', { ...filtrosLocal.value })
}
</script>

<style scoped>
.filtros-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.filtros-container h2 {
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.filtros-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.filtro-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filtro-group label {
  font-weight: 600;
  color: #475569;
  font-size: 0.95rem;
}

.input-field {
  padding: 0.75rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
}

.input-field:focus {
  outline: none;
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.botones-group {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-aplicar,
.btn-limpiar {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-aplicar {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
}

.btn-aplicar:hover {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.btn-limpiar {
  background: #f1f5f9;
  color: #64748b;
}

.btn-limpiar:hover {
  background: #e2e8f0;
  color: #475569;
}

@media (max-width: 768px) {
  .filtros-grid {
    grid-template-columns: 1fr;
  }

  .botones-group {
    flex-direction: column;
  }

  .btn-aplicar,
  .btn-limpiar {
    width: 100%;
  }
}
</style>