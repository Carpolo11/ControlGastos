<template>
  <div class="balance-container">
    <h2>💰 Balance General</h2>
    
    <!-- Cards principales -->
    <div class="cards-grid">
      <div class="balance-card ingresos">
        <div class="icon">📈</div>
        <div class="info">
          <p class="label">Total Ingresos</p>
          <p class="amount">{{ formatCurrency(totalIngresos) }}</p>
          <p class="subtitle">{{ cantidadIngresos }} transacciones</p>
        </div>
      </div>

      <div class="balance-card egresos">
        <div class="icon">📉</div>
        <div class="info">
          <p class="label">Total Egresos</p>
          <p class="amount">{{ formatCurrency(totalEgresos) }}</p>
          <p class="subtitle">{{ cantidadEgresos }} transacciones</p>
        </div>
      </div>

      <div class="balance-card saldo" :class="saldoClass">
        <div class="icon">💵</div>
        <div class="info">
          <p class="label">Saldo</p>
          <p class="amount">{{ formatCurrency(saldo) }}</p>
          <p class="subtitle">{{ porcentajeSaldo }}%</p>
        </div>
      </div>
    </div>

    <!-- Métricas adicionales -->
    <div class="metricas-adicionales">
      <h3>📊 Análisis Detallado</h3>
      
      <div class="metricas-grid">
        <!-- Promedio diario -->
        <div class="metrica-item">
          <div class="metrica-header">
            <span class="metrica-icon">📅</span>
            <span class="metrica-titulo">Promedio Diario</span>
          </div>
          <div class="metrica-valores">
            <div class="metrica-valor ingreso">
              <span class="label-mini">Ingresos:</span>
              <span class="valor">{{ formatCurrency(promedioIngresosDiario) }}</span>
            </div>
            <div class="metrica-valor egreso">
              <span class="label-mini">Egresos:</span>
              <span class="valor">{{ formatCurrency(promedioEgresosDiario) }}</span>
            </div>
          </div>
        </div>

        <!-- Mayor transacción -->
        <div class="metrica-item">
          <div class="metrica-header">
            <span class="metrica-icon">🏆</span>
            <span class="metrica-titulo">Mayor Transacción</span>
          </div>
          <div class="metrica-valores">
            <div class="metrica-valor ingreso">
              <span class="label-mini">Ingreso:</span>
              <span class="valor">{{ formatCurrency(mayorIngreso) }}</span>
            </div>
            <div class="metrica-valor egreso">
              <span class="label-mini">Egreso:</span>
              <span class="valor">{{ formatCurrency(mayorEgreso) }}</span>
            </div>
          </div>
        </div>

        <!-- Tasa de ahorro -->
        <div class="metrica-item destacado">
          <div class="metrica-header">
            <span class="metrica-icon">🎯</span>
            <span class="metrica-titulo">Tasa de Ahorro</span>
          </div>
          <div class="tasa-ahorro" :class="tasaAhorroClass">
            <div class="tasa-valor">{{ tasaAhorro }}%</div>
            <div class="tasa-barra">
              <div class="tasa-progreso" :style="{ width: tasaAhorro + '%' }"></div>
            </div>
            <div class="tasa-descripcion">{{ mensajeTasaAhorro }}</div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { computed } from 'vue'

const props = defineProps({
  totalIngresos: { type: Number, default: 0 },
  totalEgresos: { type: Number, default: 0 },
  saldo: { type: Number, default: 0 },
  transacciones: { type: Array, default: () => [] }
})

// Cantidades
const cantidadIngresos = computed(() => 
  props.transacciones.filter(t => t.tipo === 'Ingreso').length
)

const cantidadEgresos = computed(() => 
  props.transacciones.filter(t => t.tipo === 'Egreso').length
)

// Porcentaje de saldo
const porcentajeSaldo = computed(() => {
  if (props.totalIngresos === 0) return 0
  return ((props.saldo / props.totalIngresos) * 100).toFixed(1)
})

const saldoClass = computed(() => {
  if (props.saldo > 0) return 'positivo'
  if (props.saldo < 0) return 'negativo'
  return 'neutro'
})

// Promedios diarios
const diasConTransacciones = computed(() => {
  if (props.transacciones.length === 0) return 1
  
  const fechas = props.transacciones.map(t => new Date(t.fecha).toDateString())
  const fechasUnicas = [...new Set(fechas)]
  return fechasUnicas.length || 1
})

const promedioIngresosDiario = computed(() => 
  props.totalIngresos / diasConTransacciones.value
)

const promedioEgresosDiario = computed(() => 
  props.totalEgresos / diasConTransacciones.value
)

// Mayor transacción
const mayorIngreso = computed(() => {
  const ingresos = props.transacciones.filter(t => t.tipo === 'Ingreso')
  if (ingresos.length === 0) return 0
  return Math.max(...ingresos.map(t => parseFloat(t.monto)))
})

const mayorEgreso = computed(() => {
  const egresos = props.transacciones.filter(t => t.tipo === 'Egreso')
  if (egresos.length === 0) return 0
  return Math.max(...egresos.map(t => parseFloat(t.monto)))
})

// Tasa de ahorro
const tasaAhorro = computed(() => {
  if (props.totalIngresos === 0) return 0
  const tasa = ((props.saldo / props.totalIngresos) * 100)
  return Math.max(0, Math.min(100, tasa)).toFixed(1)
})

const tasaAhorroClass = computed(() => {
  const tasa = parseFloat(tasaAhorro.value)
  if (tasa >= 20) return 'excelente'
  if (tasa >= 10) return 'bueno'
  if (tasa >= 0) return 'regular'
  return 'critico'
})

const mensajeTasaAhorro = computed(() => {
  const tasa = parseFloat(tasaAhorro.value)
  if (tasa >= 20) return '¡Excelente! Estás ahorrando muy bien'
  if (tasa >= 10) return 'Buen nivel de ahorro'
  if (tasa >= 0) return 'Considera aumentar tu ahorro'
  return 'Atención: Gastas más de lo que ingresas'
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
  background: rgb(102, 174, 179);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.balance-container h2,
.balance-container h3 {
  color: #ffffff;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 1.5rem;
}

.balance-container h2 {
  font-size: 1.5rem;
}

.balance-container h3 {
  font-size: 1.2rem;
  margin-top: 2rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  color: #ffffff;
  margin-bottom: 0.25rem;
  font-weight: 500;
}

.balance-card .amount {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0.25rem 0;
}

.balance-card .subtitle {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
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

/* Métricas adicionales */
.metricas-adicionales {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metrica-item {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metrica-item.destacado {
  grid-column: span 2;
}

.metrica-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f5f9;
}

.metrica-icon {
  font-size: 1.5rem;
}

.metrica-titulo {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
}

.metrica-valores {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.metrica-valor {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  border-radius: 8px;
}

.metrica-valor.ingreso {
  background: #d1fae5;
}

.metrica-valor.egreso {
  background: #fee2e2;
}

.label-mini {
  font-size: 0.85rem;
  font-weight: 500;
  color: #64748b;
}

.metrica-valor .valor {
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
}

/* Tasa de ahorro */
.tasa-ahorro {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tasa-valor {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin: 0.5rem 0;
}

.tasa-ahorro.excelente .tasa-valor { color: #059669; }
.tasa-ahorro.bueno .tasa-valor { color: #0284c7; }
.tasa-ahorro.regular .tasa-valor { color: #d97706; }
.tasa-ahorro.critico .tasa-valor { color: #dc2626; }

.tasa-barra {
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.tasa-progreso {
  height: 100%;
  border-radius: 6px;
  transition: width 0.5s ease;
}

.tasa-ahorro.excelente .tasa-progreso { background: #059669; }
.tasa-ahorro.bueno .tasa-progreso { background: #0284c7; }
.tasa-ahorro.regular .tasa-progreso { background: #d97706; }
.tasa-ahorro.critico .tasa-progreso { background: #dc2626; }

.tasa-descripcion {
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}

/* Salud financiera */
.salud-financiera {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
}

.indicadores {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.indicador {
  background: white;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid;
}

.indicador.saludable { border-left-color: #059669; }
.indicador.moderado { border-left-color: #d97706; }
.indicador.critico { border-left-color: #dc2626; }

.indicador-icono {
  font-size: 2.5rem;
}

.indicador-info {
  flex: 1;
}

.indicador-titulo {
  font-size: 0.95rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 0.25rem;
}

.indicador-descripcion {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .balance-card .amount {
    font-size: 1.5rem;
  }

  .metricas-grid {
    grid-template-columns: 1fr;
  }

  .metrica-item.destacado {
    grid-column: span 1;
  }

  .indicadores {
    grid-template-columns: 1fr;
  }
}
</style>