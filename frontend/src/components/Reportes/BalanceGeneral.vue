<template>
  <div class="balance-container">
    <h2>💰 Balance General</h2>
    
    <div class="cards-grid">
      <div class="balance-card ingresos">
        <div class="icon">📈</div>
        <div class="info">
          <p class="label">Total Ingresos</p>
          <p class="amount">{{ formatCurrency(totalIngresos) }}</p>
        </div>
      </div>

      <div class="balance-card egresos">
        <div class="icon">📉</div>
        <div class="info">
          <p class="label">Total Egresos</p>
          <p class="amount">{{ formatCurrency(totalEgresos) }}</p>
        </div>
      </div>

      <div class="balance-card saldo" :class="saldoClass">
        <div class="icon">💵</div>
        <div class="info">
          <p class="label">Saldo</p>
          <p class="amount">{{ formatCurrency(saldo) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalIngresos: {
    type: Number,
    default: 0
  },
  totalEgresos: {
    type: Number,
    default: 0
  },
  saldo: {
    type: Number,
    default: 0
  }
})

const saldoClass = computed(() => {
  if (props.saldo > 0) return 'positivo'
  if (props.saldo < 0) return 'negativo'
  return 'neutro'
})

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}
</script>

<style scoped>
.balance-container {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.balance-container h2 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.balance-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  background: rgba(255, 255, 255, 0.95);
}

.balance-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.balance-card .icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.5);
}

.balance-card .info {
  flex: 1;
}

.balance-card .label {
  font-size: 0.9rem;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.balance-card .amount {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
}

.ingresos {
  background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
  color: #166534;
}

.egresos {
  background: linear-gradient(135deg, #fda085 0%, #f6d365 100%);
  color: #991b1b;
}

.saldo {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.saldo.positivo {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
  color: #065f46;
}

.saldo.negativo {
  background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
  color: #991b1b;
}

.saldo.neutro {
  background: linear-gradient(135deg, #e0e7ff 0%, #cffafe 100%);
  color: #1e40af;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .balance-card .amount {
    font-size: 1.5rem;
  }
}
</style>