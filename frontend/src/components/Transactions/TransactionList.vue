<template>
  <div class="transacciones-container">
    <h2>📋 HISTORIAL DE TRANSACCIONES</h2>

    <!-- Filtro por familia -->
    <div class="filtro-familia">
      <label>Filtrar por familia:</label>
      <select v-model="familiaSeleccionada" @change="actualizarFiltro">
        <option value="">Todas las familias</option>
        <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
          {{ familia.nombre_familia }}
        </option>
      </select>
    </div>

    <div v-if="transaccionesFiltradas.length === 0" class="no-data">
      No hay transacciones registradas aún.
    </div>

    <div 
      v-for="transaccion in transaccionesFiltradas" 
      :key="transaccion.id_transaccion" 
      class="transaccion-card" 
      :class="transaccion.tipo === 'Ingreso' ? 'ingreso' : 'egreso'"
    >
      <div class="transaccion-header">
        <h3>{{ transaccion.tipo }} - {{ obtenerNombreCategoria(transaccion.idcategoria) }}</h3>
        <span class="monto">{{ formatearMonto(transaccion.monto) }}</span>
      </div>
      
      <p><strong>Fecha:</strong> {{ formatearFecha(transaccion.fecha) }}</p>
      <p><strong>Descripción:</strong> {{ transaccion.descripcion }}</p>
      <p><strong>Familia:</strong> {{ obtenerNombreFamilia(transaccion.id_familia) }}</p>
      <p><strong>Identificación:</strong> {{ transaccion.identificacion }}</p>
      
      <div class="acciones">
        <button class="edit-btn" @click="$emit('editar', transaccion)">
          Editar
        </button>
        <button class="logout-btn" @click="$emit('eliminar', transaccion.id_transaccion)">
          Eliminar
        </button>
      </div>
    </div>

    <!-- Resumen por familia -->
    <div v-if="familiaSeleccionada" class="resumen-container">
      <h3>📊 Resumen de {{ obtenerNombreFamilia(familiaSeleccionada) }}</h3>
      <div class="resumen-grid">
        <div class="resumen-item ingreso">
          <span class="label">Total Ingresos:</span>
          <span class="valor">{{ formatearMonto(calcularTotal('Ingreso')) }}</span>
        </div>
        <div class="resumen-item egreso">
          <span class="label">Total Egresos:</span>
          <span class="valor">{{ formatearMonto(calcularTotal('Egreso')) }}</span>
        </div>
        <div class="resumen-item balance">
          <span class="label">Balance:</span>
          <span class="valor">{{ formatearMonto(calcularBalance()) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  transacciones: {
    type: Array,
    required: true
  },
  familias: {
    type: Array,
    required: true
  },
  categorias: {
    type: Array,
    required: true
  },
  familiaFiltro: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['editar', 'eliminar', 'actualizar-filtro']);

const familiaSeleccionada = ref(props.familiaFiltro);

const obtenerNombreFamilia = (id) => {
  const familia = props.familias.find(f => f.id_familia === id);
  return familia ? familia.nombre_familia : "Sin familia";
};

const obtenerNombreCategoria = (id) => {
  const categoria = props.categorias.find(c => c.idcategoria === id);
  return categoria ? categoria.nombre : "Sin categoría";
};

const formatearMonto = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const transaccionesFiltradas = computed(() => {
  if (!familiaSeleccionada.value) {
    return props.transacciones;
  }
  return props.transacciones.filter(t => t.id_familia === familiaSeleccionada.value);
});

const calcularTotal = (tipoTransaccion) => {
  return transaccionesFiltradas.value
    .filter(t => t.tipo === tipoTransaccion)
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
};

const calcularBalance = () => {
  return calcularTotal('Ingreso') - calcularTotal('Egreso');
};

const actualizarFiltro = () => {
  emit('actualizar-filtro', familiaSeleccionada.value);
};
</script>

<style scoped>
.transacciones-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 20px;
  width: 80%;
  max-width: 900px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.transacciones-container h2 {
  color: white;
  margin-bottom: 1.5rem;
}

.filtro-familia {
  margin-bottom: 1.5rem;
  text-align: left;
  background: white;
  padding: 1rem;
  border-radius: 10px;
}

.filtro-familia label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1c3d5a;
}

.filtro-familia select {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid black;
  border-radius: 8px;
}

.no-data {
  color: white;
  font-style: italic;
  margin-top: 1rem;
  padding: 2rem;
}

.transaccion-card {
  position: relative;
  background: #ffffff;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: all 0.3s ease;
  border-left: 5px solid #ccc;
}

.transaccion-card.ingreso {
  border-left-color: #51cf66;
}

.transaccion-card.egreso {
  border-left-color: #ff6b6b;
}

.transaccion-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.transaccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #aed9dc;
}

.transaccion-header h3 {
  color: #1c3d5a;
  font-size: 1.2rem;
  margin: 0;
}

.monto {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c3d5a;
}

.transaccion-card.ingreso .monto {
  color: #2f9e44;
}

.transaccion-card.egreso .monto {
  color: #c92a2a;
}

.transaccion-card p {
  margin: 0.4rem 0;
  color: #2e2e2e;
  font-size: 0.95rem;
}

.transaccion-card p strong {
  color: #1c3d5a;
}

.acciones {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.edit-btn {
  flex: 1;
  background: linear-gradient(135deg, #4dabf7, #339af0);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: linear-gradient(135deg, #339af0, #1c7ed6);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.logout-btn {
  flex: 1;
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #f85032, #e73827);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.resumen-container {
  margin-top: 2rem;
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.resumen-container h3 {
  color: #1c3d5a;
  margin-bottom: 1rem;
  text-align: center;
}

.resumen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.resumen-item {
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.resumen-item.ingreso {
  background: linear-gradient(135deg, #d3f9d8, #b2f2bb);
}

.resumen-item.egreso {
  background: linear-gradient(135deg, #ffe3e3, #ffc9c9);
}

.resumen-item.balance {
  background: linear-gradient(135deg, #d0ebff, #a5d8ff);
}

.resumen-item .label {
  font-weight: 600;
  color: #1c3d5a;
  font-size: 0.9rem;
}

.resumen-item .valor {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c3d5a;
}
</style>