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
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.filtros-container h2 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.filtros-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 3.5rem;
}

.filtro-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filtro-group label {
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.input-field {
  padding: 0.75rem 1rem;
  border: 2px solid #000000;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  background: white;
  color: #000000;
}

.input-field:focus {
  outline: none;
  border-color: #ffaf7b;
  box-shadow: 0 0 0 3px rgba(255, 175, 123, 0.3);
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
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-aplicar {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  border: 2px solid transparent;
}

.btn-aplicar:hover {
  border-color: #ffaf7b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-limpiar {
  background: rgba(255, 255, 255, 0.9);
  color: #3a1c71;
  border: 2px solid #3a1c71;
}

.btn-limpiar:hover {
  background: white;
  transform: translateY(-2px);
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