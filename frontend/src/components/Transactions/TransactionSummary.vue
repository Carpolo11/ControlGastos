<template>
  <div class="transaction-summary">
    <div class="summary-card ingresos">
      <div class="icon">💰</div>
      <div class="info">
        <span class="label">Total Ingresos</span>
        <span class="amount">${{ formatearMonto(totalIngresos) }}</span>
      </div>
    </div>

    <div class="summary-card egresos">
      <div class="icon">💸</div>
      <div class="info">
        <span class="label">Total Egresos</span>
        <span class="amount">${{ formatearMonto(totalEgresos) }}</span>
      </div>
    </div>

    <div class="summary-card balance" :class="balanceClass">
      <div class="icon">{{ balanceIcon }}</div>
      <div class="info">
        <span class="label">Balance</span>
        <span class="amount">${{ formatearMonto(balance) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  transacciones: Array
})

const totalIngresos = computed(() => {
  return props.transacciones
    .filter(t => t.tipo.toLowerCase() === 'ingreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
})

const totalEgresos = computed(() => {
  return props.transacciones
    .filter(t => t.tipo.toLowerCase() === 'egreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
})

const balance = computed(() => {
  return totalIngresos.value - totalEgresos.value
})

const balanceClass = computed(() => {
  if (balance.value > 0) return 'positivo'
  if (balance.value < 0) return 'negativo'
  return 'neutro'
})

const balanceIcon = computed(() => {
  if (balance.value > 0) return '📈'
  if (balance.value < 0) return '📉'
  return '➖'
})

function formatearMonto(monto) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(Math.abs(monto))
}
</script>

<style scoped>
.transaction-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.summary-card.ingresos {
  border-left: 4px solid #10b981;
}

.summary-card.egresos {
  border-left: 4px solid #ef4444;
}

.summary-card.balance.positivo {
  border-left: 4px solid #10b981;
  background: #f0fdf4;
}

.summary-card.balance.negativo {
  border-left: 4px solid #ef4444;
  background: #fef2f2;
}

.summary-card.balance.neutro {
  border-left: 4px solid #9ca3af;
  background: #f9fafb;
}

.icon {
  font-size: 2rem;
}

.info {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.amount {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
}

.summary-card.ingresos .amount {
  color: #10b981;
}

.summary-card.egresos .amount {
  color: #ef4444;
}

@media (max-width: 600px) {
  .transaction-summary {
    grid-template-columns: 1fr;
  }
}
</style>