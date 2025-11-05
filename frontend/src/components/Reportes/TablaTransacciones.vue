<template>
  <div class="tabla-container">
    <div class="tabla-header">
      <h2>📋 Transacciones Filtradas</h2>
      <div class="resumen">
        <span class="badge">Total: {{ transacciones.length }} registros</span>
      </div>
    </div>

    <div v-if="transacciones.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>No se encontraron transacciones con los filtros aplicados</p>
    </div>

    <div v-else class="table-wrapper">
      <table class="tabla-transacciones">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Categoría</th>
            <th>Descripción</th>
            <th>Tipo</th>
            <th>Monto</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="transaccion in transacciones" 
            :key="transaccion.id"
            :class="transaccion.tipo.toLowerCase()"
          >
            <td>{{ formatDate(transaccion.fecha) }}</td>
            <td>
              <span class="categoria-badge">
                {{ transaccion.categoria }}
              </span>
            </td>
            <td class="descripcion">{{ transaccion.descripcion || '-' }}</td>
            <td>
              <span class="tipo-badge" :class="transaccion.tipo.toLowerCase()">
                {{ transaccion.tipo === 'Ingreso' ? '📈' : '📉' }}
                {{ transaccion.tipo }}
              </span>
            </td>
            <td class="monto" :class="transaccion.tipo.toLowerCase()">
              {{ formatCurrency(transaccion.monto) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  transacciones: {
    type: Array,
    default: () => []
  }
})

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.tabla-container {
  background: rgb(102, 174, 179);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.tabla-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.tabla-header h2 {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.resumen {
  display: flex;
  gap: 0.75rem;
}

.badge {
  background: rgba(255, 255, 255, 0.9);
  color: #3a1c71;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 2px solid #3a1c71;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  background: white;
}

.tabla-transacciones {
  width: 100%;
  border-collapse: collapse;
}

.tabla-transacciones thead {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
}

.tabla-transacciones th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.95rem;
  white-space: nowrap;
}

.tabla-transacciones tbody tr {
  border-bottom: 1px solid #e2e8f0;
  transition: background 0.2s;
}

.tabla-transacciones tbody tr:hover {
  background: #f8fafc;
}

.tabla-transacciones tbody tr:last-child {
  border-bottom: none;
}

.tabla-transacciones td {
  padding: 1rem;
  font-size: 0.95rem;
  color: #475569;
}

.descripcion {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.categoria-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.tipo-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
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
  font-weight: 700;
  font-size: 1.05rem;
  text-align: right;
}

.monto.ingreso {
  color: #059669;
}

.monto.egreso {
  color: #dc2626;
}

@media (max-width: 768px) {
  .tabla-container {
    padding: 1rem;
  }

  .tabla-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .tabla-transacciones th,
  .tabla-transacciones td {
    padding: 0.75rem 0.5rem;
    font-size: 0.85rem;
  }

  .descripcion {
    max-width: 150px;
  }
}
</style>