<template>
  <div class="resumen">
    <div class="resumen-card ingreso">
      <div class="resumen-label">💰 Total Ingresos</div>
      <div class="resumen-valor">${{ totalIngresos.toFixed(2) }}</div>
    </div>
    <div class="resumen-card egreso">
      <div class="resumen-label">💸 Total Egresos</div>
      <div class="resumen-valor">${{ totalEgresos.toFixed(2) }}</div>
    </div>
    <div class="resumen-card balance" :class="{ positivo: balance >= 0, negativo: balance < 0 }">
      <div class="resumen-label">📊 Balance</div>
      <div class="resumen-valor">${{ balance.toFixed(2) }}</div>
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
    .filter(t => t.tipo === 'ingreso')
    .reduce((sum, t) => sum + t.monto, 0)
})

const totalEgresos = computed(() => {
  return props.transacciones
    .filter(t => t.tipo === 'egreso')
    .reduce((sum, t) => sum + t.monto, 0)
})

const balance = computed(() => totalIngresos.value - totalEgresos.value)
</script>

<style scoped>
.resumen {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.resumen-card {
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.resumen-card.ingreso {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
}

.resumen-card.egreso {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #fca5a5;
}

.resumen-card.balance {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #93c5fd;
}

.resumen-card.balance.positivo {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border: 1px solid #86efac;
}

.resumen-card.balance.negativo {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border: 1px solid #fca5a5;
}

.resumen-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.3rem;
}

.resumen-valor {
  font-size: 1.4rem;
  font-weight: 700;
  color: #1f2937;
}
</style>