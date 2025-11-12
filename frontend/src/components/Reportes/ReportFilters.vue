<template>
  <div class="filtros-container">
    <h2>🔍 Filtros de Búsqueda</h2>
    <div class="filtros-grid">
      <div class="filtro-item">
        <label>Familia:</label>
        <select v-model="filtrosLocales.id_familia" @change="emitirCambio">
          <option value="">Todas las familias</option>
          <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
            {{ familia.nombre_familia }}
          </option>
        </select>
      </div>

      <div class="filtro-item">
        <label>Fecha Inicio:</label>
        <input type="date" v-model="filtrosLocales.fecha_inicio" @change="emitirCambio" />
      </div>

      <div class="filtro-item">
        <label>Fecha Fin:</label>
        <input type="date" v-model="filtrosLocales.fecha_fin" @change="emitirCambio" />
      </div>

      <div class="filtro-item">
        <label>Categoría:</label>
        <select v-model="filtrosLocales.idcategoria" @change="emitirCambio">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat.idcategoria" :value="cat.idcategoria">
            {{ cat.nombre }}
          </option>
        </select>
      </div>

      <div class="filtro-item">
        <button class="reset-btn" @click="limpiar">🔄 Limpiar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  familias: {
    type: Array,
    required: true
  },
  categorias: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: () => ({
      id_familia: '',
      fecha_inicio: '',
      fecha_fin: '',
      idcategoria: ''
    })
  }
});

const emit = defineEmits(['update:modelValue', 'limpiar']);

const filtrosLocales = reactive({
  id_familia: props.modelValue.id_familia,
  fecha_inicio: props.modelValue.fecha_inicio,
  fecha_fin: props.modelValue.fecha_fin,
  idcategoria: props.modelValue.idcategoria
});

// Sincronizar con props
watch(() => props.modelValue, (nuevoValor) => {
  filtrosLocales.id_familia = nuevoValor.id_familia;
  filtrosLocales.fecha_inicio = nuevoValor.fecha_inicio;
  filtrosLocales.fecha_fin = nuevoValor.fecha_fin;
  filtrosLocales.idcategoria = nuevoValor.idcategoria;
}, { deep: true });

const emitirCambio = () => {
  emit('update:modelValue', { ...filtrosLocales });
};

const limpiar = () => {
  filtrosLocales.id_familia = '';
  filtrosLocales.fecha_inicio = '';
  filtrosLocales.fecha_fin = '';
  filtrosLocales.idcategoria = '';
  emit('update:modelValue', { ...filtrosLocales });
  emit('limpiar');
};
</script>

<style scoped>
.filtros-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.filtros-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
}

.filtro-item label {
  color: white;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

.filtro-item input,
.filtro-item select {
  width: 100%;
  padding: 0.7rem;
  border: 2px solid black;
  border-radius: 50px;
  background: transparent;
  color: black;
  outline: none;
}

.filtro-item select option {
  background: white;
  color: black;
}

.reset-btn {
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.8rem;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: linear-gradient(135deg, #ee5a6f, #c92a2a);
  transform: translateY(-2px);
}
</style>