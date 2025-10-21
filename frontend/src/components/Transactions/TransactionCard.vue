<template>
  <li class="card" :class="transaccion.tipo">
    <div class="card-header">
      <span class="tipo-badge" :class="transaccion.tipo">
        {{ transaccion.tipo === 'ingreso' ? '↑ Ingreso' : '↓ Egreso' }}
      </span>
      <span class="fecha">{{ fechaFormateada }}</span>
    </div>
    
    <div class="card-body">
      <div class="monto" :class="transaccion.tipo">${{ transaccion.monto.toFixed(2) }}</div>
      <div class="info">
        <p><strong>Categoría:</strong> {{ categoriaFormateada }}</p>
        <p><strong>Usuario:</strong> {{ transaccion.usuario }}</p>
        <p class="descripcion">{{ transaccion.descripcion }}</p>
      </div>
    </div>

    <div class="card-actions">
      <button @click="$emit('editar', transaccion)" class="btn-accion editar">✏️ Editar</button>
      <button @click="confirmarEliminar" class="btn-accion eliminar">🗑️ Eliminar</button>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ transaccion: Object })
const emit = defineEmits(['editar', 'eliminar'])

const fechaFormateada = computed(() => {
  const date = new Date(props.transaccion.fecha + 'T00:00:00')
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
})

const categoriaFormateada = computed(() => {
  const cats = {
    salario: 'Salario', freelance: 'Freelance', negocio: 'Negocio', inversion: 'Inversión',
    otro_ingreso: 'Otro Ingreso', alimentacion: 'Alimentación', transporte: 'Transporte',
    vivienda: 'Vivienda', servicios: 'Servicios', salud: 'Salud', educacion: 'Educación',
    entretenimiento: 'Entretenimiento', otro_egreso: 'Otro Egreso'
  }
  return cats[props.transaccion.categoria] || props.transaccion.categoria
})

function confirmarEliminar() {
  if (confirm(`¿Eliminar transacción de ${props.transaccion.usuario}?`)) {
    emit('eliminar', props.transaccion.id)
  }
}
</script>

<style scoped>
.card {
  background: white;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  border-left: 4px solid #e5e7eb;
  box-shadow: 0 2px 6px rgba(99, 102, 241, 0.08);
  transition: all 0.2s;
  list-style: none;
}

.card.ingreso { border-left-color: #16a34a; }
.card.egreso { border-left-color: #dc2626; }

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.tipo-badge {
  padding: 0.25rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.tipo-badge.ingreso {
  background: #dcfce7;
  color: #166534;
}

.tipo-badge.egreso {
  background: #fee2e2;
  color: #991b1b;
}

.fecha {
  color: #6b7280;
  font-size: 0.85rem;
}

.card-body {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.monto {
  font-size: 1.6rem;
  font-weight: 700;
  min-width: 110px;
}

.monto.ingreso { color: #16a34a; }
.monto.egreso { color: #dc2626; }

.info {
  flex: 1;
}

.info p {
  font-size: 0.9rem;
  color: #4b5563;
  margin: 0.3rem 0;
}

.info strong {
  color: #1f2937;
}

.descripcion {
  color: #6b7280;
  font-style: italic;
}

.card-actions {
  display: flex;
  gap: 0.6rem;
  padding-top: 0.8rem;
  border-top: 1px solid #f3f4f6;
}

.btn-accion {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  border: none;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accion.editar {
  background: #dbeafe;
  color: #1e40af;
}

.btn-accion.editar:hover { background: #bfdbfe; }

.btn-accion.eliminar {
  background: #fee2e2;
  color: #991b1b;
}

.btn-accion.eliminar:hover { background: #fecaca; }

@media (max-width: 600px) {
  .card-body { flex-direction: column; }
  .monto { font-size: 1.4rem; }
}
</style>