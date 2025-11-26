<template>
  <div class="transacciones-container">
    <!-- Título con el conteo total de transacciones -->
    <h2>📋 Transacciones ({{ transacciones.length }})</h2>
    
    <!-- Mensaje cuando no hay transacciones -->
    <div v-if="transacciones.length === 0" class="no-data">
      No hay transacciones con los filtros seleccionados.
    </div>
    
    <!-- Lista de transacciones cuando sí existen -->
    <div v-else class="transacciones-lista">

      <!-- Renderiza cada transacción del arreglo recibido -->
      <div 
        v-for="trans in transacciones" 
        :key="trans.id_transaccion" 
        class="transaccion-card" 
        :class="trans.tipo"  
      >

        <!-- Encabezado de cada tarjeta -->
        <div class="trans-header">
          <!-- Etiqueta con el tipo de transacción -->
          <span class="tipo-badge">{{ trans.tipo }}</span>

          <!-- Monto formateado con formato moneda -->
          <span class="monto">{{ formatearMonto(trans.monto) }}</span>
        </div>

        <!-- Nombre de la categoría obtenido por ID -->
        <p><strong>{{ obtenerNombreCategoria(trans.idcategoria) }}</strong></p>

        <!-- Fecha formateada -->
        <p class="fecha">{{ formatearFecha(trans.fecha) }}</p>

        <!-- Descripción -->
        <p class="descripcion">{{ trans.descripcion }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/*
  Recibimos dos props:
  - transacciones: lista de transacciones a mostrar
  - categorias: lista de categorías para poder mostrar sus nombres
*/
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

/*
  Función que busca el nombre de la categoría a partir de su ID.
  Si no encuentra la categoría, devuelve "Sin categoría".
*/
const obtenerNombreCategoria = (id) => {
  const cat = props.categorias.find(c => c.idcategoria === id);
  return cat ? cat.nombre : "Sin categoría";
};

/*
  Función para dar formato de moneda colombiana a los montos.
*/
const formatearMonto = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

/*
  Convierte una fecha ISO en una fecha legible en español.
*/
const formatearFecha = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
</script>

<style scoped>
/* Contenedor principal de la sección */
.transacciones-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

/* Título */
.transacciones-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
}

/* Cuando no hay datos */
.no-data {
  color: white;
  text-align: center;
  padding: 2rem;
  font-style: italic;
}

/* Contenedor en grid para las tarjetas */
.transacciones-lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  max-height: 500px; /* Lista con scroll vertical */
  overflow-y: auto;
  padding: 0.5rem;
}

/* Personalización del scroll */
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

/* Estilos generales de las tarjetas */
.transaccion-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid #ccc;
  transition: all 0.3s ease;
}

/* Color del borde para ingresos */
.transaccion-card.Ingreso {
  border-left-color: #51cf66;
}

/* Color del borde para egresos */
.transaccion-card.Egreso {
  border-left-color: #ff6b6b;
}

/* Efecto hover */
.transaccion-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Encabezado de cada tarjeta */
.trans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

/* Etiqueta del tipo */
.tipo-badge {
  background: linear-gradient(135deg, #4dabf7, #339af0);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Badge verde para ingresos */
.transaccion-card.Ingreso .tipo-badge {
  background: linear-gradient(135deg, #51cf66, #37b24d);
}

/* Badge rojo para egresos */
.transaccion-card.Egreso .tipo-badge {
  background: linear-gradient(135deg, #ff6b6b, #fa5252);
}

/* Estilo del monto */
.monto {
  font-size: 1.2rem;
  font-weight: bold;
}

/* Colores del monto según tipo */
.transaccion-card.Ingreso .monto {
  color: #2f9e44;
}

.transaccion-card.Egreso .monto {
  color: #c92a2a;
}

/* Estilos de textos */
.transaccion-card p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #666;
}

/* Fecha más tenue */
.fecha {
  font-size: 0.85rem !important;
  color: #999 !important;
}

/* Descripción con borde arriba */
.descripcion {
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
  color: #444 !important;
  margin-top: 0.5rem;
}
</style>
