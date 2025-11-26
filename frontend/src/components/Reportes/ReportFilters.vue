<template>
  <div class="filtros-container">
    <!-- Título del panel de filtros -->
    <h2>🔍 Filtros de Búsqueda</h2>

    <div class="filtros-grid">
      
      <!-- Filtro por familia -->
      <div class="filtro-item">
        <label>Familia:</label>

        <!-- v-model enlaza el valor seleccionado con filtrosLocales.id_familia -->
        <!-- @change dispara la función emitirCambio para notificar al padre -->
        <select v-model="filtrosLocales.id_familia" @change="emitirCambio">
          <option value="">Todas las familias</option>

          <!-- Se generan las opciones dinámicamente a partir del prop familias -->
          <option 
            v-for="familia in familias" 
            :key="familia.id_familia" 
            :value="familia.id_familia"
          >
            {{ familia.nombre_familia }}
          </option>
        </select>
      </div>

      <!-- Filtro por fecha de inicio -->
      <div class="filtro-item">
        <label>Fecha Inicio:</label>

        <!-- Campo de fecha con enlace reactivo -->
        <input type="date" v-model="filtrosLocales.fecha_inicio" @change="emitirCambio" />
      </div>

      <!-- Filtro por fecha fin -->
      <div class="filtro-item">
        <label>Fecha Fin:</label>
        <input type="date" v-model="filtrosLocales.fecha_fin" @change="emitirCambio" />
      </div>

      <!-- Filtro por categoría -->
      <div class="filtro-item">
        <label>Categoría:</label>

        <select v-model="filtrosLocales.idcategoria" @change="emitirCambio">
          <option value="">Todas las categorías</option>

          <!-- Se genera la lista de categorías dinámicamente -->
          <option 
            v-for="cat in categorias" 
            :key="cat.idcategoria" 
            :value="cat.idcategoria"
          >
            {{ cat.nombre }}
          </option>
        </select>
      </div>

      <!-- Botón para limpiar filtros -->
      <div class="filtro-item">
        <button class="reset-btn" @click="limpiar">🔄 Limpiar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

/*
  defineProps permite recibir datos desde el componente padre.
  Se validan los tipos de datos esperados.
*/
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

    // Valor inicial por defecto para los filtros
    default: () => ({
      id_familia: '',
      fecha_inicio: '',
      fecha_fin: '',
      idcategoria: ''
    })
  }
});

/*
  defineEmits permite emitir eventos hacia el componente padre.
  Se emiten dos eventos:
  - update:modelValue → para actualizar el v-model del padre
  - limpiar → para notificar que los filtros fueron reseteados
*/
const emit = defineEmits(['update:modelValue', 'limpiar']);

/*
  filtrosLocales es un objeto reactivo basado en modelValue.
  Este objeto se usa internamente en el componente.
*/
const filtrosLocales = reactive({
  id_familia: props.modelValue.id_familia,
  fecha_inicio: props.modelValue.fecha_inicio,
  fecha_fin: props.modelValue.fecha_fin,
  idcategoria: props.modelValue.idcategoria
});

/*
  Watcher que observa cambios en modelValue desde el padre.
  Si el padre actualiza los filtros externamente, este watch
  sincroniza los valores dentro de filtrosLocales.
*/
watch(
  () => props.modelValue,
  (nuevoValor) => {
    filtrosLocales.id_familia = nuevoValor.id_familia;
    filtrosLocales.fecha_inicio = nuevoValor.fecha_inicio;
    filtrosLocales.fecha_fin = nuevoValor.fecha_fin;
    filtrosLocales.idcategoria = nuevoValor.idcategoria;
  },
  { deep: true }
);

/*
  Función que emite los filtros actualizados al padre.
  Se usa cada vez que el usuario cambia un filtro.
*/
const emitirCambio = () => {
  emit('update:modelValue', { ...filtrosLocales });
};

/*
  Función para limpiar todos los filtros.
  Se restablecen todos a vacío y se emiten los cambios al padre.
*/
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
/* Contenedor principal de los filtros */
.filtros-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Estilos del título */
.filtros-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Grid que ordena los elementos del formulario */
.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2.5rem;
}

/* Estilo del texto de cada etiqueta */
.filtro-item label {
  color: white;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

/* Estilos de inputs y selects */
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

/* Estilo de las opciones del select */
.filtro-item select option {
  background: white;
  color: black;
}

/* Botón de limpiar */
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

/* Hover del botón */
.reset-btn:hover {
  background: linear-gradient(135deg, #ee5a6f, #c92a2a);
  transform: translateY(-2px);
}
</style>
