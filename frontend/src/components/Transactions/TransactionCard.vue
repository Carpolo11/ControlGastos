<template>
  <li class="transaction-card" :class="transaccion.tipo.toLowerCase()">
    <div class="card-header">
      <div class="tipo-badge" :class="transaccion.tipo.toLowerCase()">
        {{ transaccion.tipo === 'Ingreso' ? '💰' : '💸' }} {{ transaccion.tipo }}
      </div>
      <div class="monto" :class="transaccion.tipo.toLowerCase()">
        {{ transaccion.tipo === 'Ingreso' ? '+' : '-' }} ${{ formatearMonto(transaccion.monto) }}
      </div>
    </div>

    <div class="card-body">
      <p class="descripcion">{{ transaccion.descripcion }}</p>
      
      <div class="detalles">
        <span class="detalle">
          <strong>📅 Fecha:</strong> {{ formatearFecha(transaccion.fecha) }}
        </span>
        <span class="detalle">
          <strong>🆔 Identificación:</strong> {{ transaccion.identificacion }}
        </span>
        <span class="detalle" v-if="transaccion.nombre_categoria">
          <strong>📂 Categoría:</strong> {{ transaccion.nombre_categoria }}
        </span>
      </div>
    </div>

    <div class="card-actions">
      <button class="btn-editar" @click="$emit('editar', transaccion)" title="Editar">
        ✏️
      </button>
      <button class="btn-eliminar" @click="$emit('eliminar', transaccion.id_transaccion)" title="Eliminar">
        🗑️
      </button>
    </div>
  </li>
</template>

<script setup>
defineProps({
  transaccion: Object
})

defineEmits(['editar', 'eliminar'])

function formatearMonto(monto) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(monto)
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.transaction-card {
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  border-left: 4px solid transparent;
}

.transaction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.transaction-card.ingreso {
  border-left-color: #10b981;
}

.transaction-card.egreso {
  border-left-color: #ef4444;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.tipo-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.tipo-badge.ingreso {
  background: #d1fae5;
  color: #065f46;
}

.tipo-badge.egreso {
  background: #fee2e2;
  color: #991b1b;
}

.monto {
  font-size: 1.5rem;
  font-weight: 700;
}

.monto.ingreso {
  color: #10b981;
}

.monto.egreso {
  color: #ef4444;
}

.card-body {
  margin-bottom: 1rem;
}

.descripcion {
  color: #374151;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
}

.detalles {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.detalle {
  font-size: 0.85rem;
  color: #6b7280;
}

.detalle strong {
  color: #4b5563;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-editar,
.btn-eliminar {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn-editar {
  background: #dbeafe;
}

.btn-editar:hover {
  opacity: 0.8;
}

.btn-eliminar {
  background: #fee2e2;
}

.btn-eliminar:hover {
  opacity: 0.8;
}

@media (max-width: 600px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>