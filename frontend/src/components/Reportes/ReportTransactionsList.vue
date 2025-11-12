<template>
  <div class="transacciones-container">
    <h2>📋 Transacciones ({{ transacciones.length }})</h2>
    
    <div v-if="transacciones.length === 0" class="no-data">
      No hay transacciones con los filtros seleccionados.
    </div>
    
    <div v-else class="transacciones-lista">
      <div 
        v-for="trans in transacciones" 
        :key="trans.id_transaccion" 
        class="transaccion-card" 
        :class="trans.tipo"
      >
        <div class="trans-header">
          <span class="tipo-badge">{{ trans.tipo }}</span>
          <span class="monto">{{ formatearMonto(trans.monto) }}</span>
        </div>
        <p><strong>{{ obtenerNombreCategoria(trans.idcategoria) }}</strong></p>
        <p class="fecha">{{ formatearFecha(trans.fecha) }}</p>
        <p class="descripcion">{{ trans.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transacciones: {
    type: Array,
    required: true
  },
  categorias: {
    type: Array,
    required: true
  }
});

const obtenerNombreCategoria = (id) => {
  const cat = props.categorias.find(c => c.idcategoria === id);
  return cat ? cat.nombre : "Sin categoría";
};

const formatearMonto = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

const formatearFecha = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
.transacciones-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.transacciones-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
}

.no-data {
  color: white;
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

.transacciones-lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
  padding: 0.5rem;
}

.transacciones-lista::-webkit-scrollbar {
  width: 8px;
}

.transacciones-lista::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.transacciones-lista::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.transacciones-lista::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.transaccion-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid #ccc;
  transition: all 0.3s ease;
}

.transaccion-card.Ingreso {
  border-left-color: #51cf66;
}

.transaccion-card.Egreso {
  border-left-color: #ff6b6b;
}

.transaccion-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.trans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tipo-badge {
  background: linear-gradient(135deg, #4dabf7, #339af0);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.transaccion-card.Ingreso .tipo-badge {
  background: linear-gradient(135deg, #51cf66, #37b24d);
}

.transaccion-card.Egreso .tipo-badge {
  background: linear-gradient(135deg, #ff6b6b, #fa5252);
}

.monto {
  font-size: 1.2rem;
  font-weight: bold;
}

.transaccion-card.Ingreso .monto {
  color: #2f9e44;
}

.transaccion-card.Egreso .monto {
  color: #c92a2a;
}

.transaccion-card p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #666;
}

.fecha {
  font-size: 0.85rem !important;
  color: #999 !important;
}

.descripcion {
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
  color: #444 !important;
  margin-top: 0.5rem;
}
</style>