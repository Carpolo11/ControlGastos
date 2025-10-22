<template>
  <div class="graficos-container">
    <h2>📊 Gráficos Comparativos</h2>
    
    <div class="graficos-grid">
      <!-- Gráfico de Barras -->
      <div class="grafico-card">
        <h3>Comparativa Ingresos vs Egresos</h3>
        <div class="chart-wrapper">
          <div class="bar-chart">
            <div class="bar-group">
              <div class="bar ingresos-bar" :style="{ height: ingresosHeight }">
                <span class="bar-label">{{ formatCurrency(totalIngresos) }}</span>
              </div>
              <p class="bar-name">Ingresos</p>
            </div>
            <div class="bar-group">
              <div class="bar egresos-bar" :style="{ height: egresosHeight }">
                <span class="bar-label">{{ formatCurrency(totalEgresos) }}</span>
              </div>
              <p class="bar-name">Egresos</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de Pastel -->
      <div class="grafico-card">
        <h3>Distribución por Tipo</h3>
        <div class="chart-wrapper">
          <div class="pie-chart">
            <svg viewBox="0 0 200 200" class="pie-svg">
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                :stroke="ingresosColor"
                :stroke-width="60"
                :stroke-dasharray="ingresosCircle"
                transform="rotate(-90 100 100)"
              />
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                :stroke="egresosColor"
                :stroke-width="60"
                :stroke-dasharray="egresosCircle"
                :stroke-dashoffset="ingresosOffset"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div class="pie-legend">
              <div class="legend-item">
                <span class="legend-color" :style="{ background: ingresosColor }"></span>
                <span>Ingresos: {{ ingresosPercentage }}%</span>
              </div>
              <div class="legend-item">
                <span class="legend-color" :style="{ background: egresosColor }"></span>
                <span>Egresos: {{ egresosPercentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico por Categoría -->
      <div class="grafico-card full-width">
        <h3>Distribución por Categoría</h3>
        <div class="categoria-chart">
          <div 
            v-for="cat in categorias" 
            :key="cat.nombre" 
            class="categoria-bar-wrapper"
          >
            <div class="categoria-info">
              <span class="categoria-nombre">{{ cat.nombre }}</span>
              <span class="categoria-monto">{{ formatCurrency(cat.total) }}</span>
            </div>
            <div class="categoria-bar-bg">
              <div 
                class="categoria-bar-fill" 
                :style="{ 
                  width: cat.porcentaje + '%',
                  background: cat.tipo === 'Ingreso' ? '#10b981' : '#ef4444'
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  transaccionesFiltradas: {
    type: Array,
    default: () => []
  }
})

const totalIngresos = computed(() => {
  return props.transaccionesFiltradas
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
})

const totalEgresos = computed(() => {
  return props.transaccionesFiltradas
    .filter(t => t.tipo === 'Egreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
})

const maxValue = computed(() => Math.max(totalIngresos.value, totalEgresos.value))

const ingresosHeight = computed(() => {
  if (maxValue.value === 0) return '0%'
  return (totalIngresos.value / maxValue.value * 100) + '%'
})

const egresosHeight = computed(() => {
  if (maxValue.value === 0) return '0%'
  return (totalEgresos.value / maxValue.value * 100) + '%'
})

// Cálculos para el gráfico circular
const totalTransacciones = computed(() => totalIngresos.value + totalEgresos.value)
const ingresosPercentage = computed(() => {
  if (totalTransacciones.value === 0) return 0
  return Math.round((totalIngresos.value / totalTransacciones.value) * 100)
})
const egresosPercentage = computed(() => {
  if (totalTransacciones.value === 0) return 0
  return Math.round((totalEgresos.value / totalTransacciones.value) * 100)
})

const circumference = 2 * Math.PI * 80
const ingresosCircle = computed(() => {
  const percentage = totalTransacciones.value === 0 ? 0 : (totalIngresos.value / totalTransacciones.value)
  return `${percentage * circumference} ${circumference}`
})
const egresosCircle = computed(() => {
  const percentage = totalTransacciones.value === 0 ? 0 : (totalEgresos.value / totalTransacciones.value)
  return `${percentage * circumference} ${circumference}`
})
const ingresosOffset = computed(() => {
  const percentage = totalTransacciones.value === 0 ? 0 : (totalIngresos.value / totalTransacciones.value)
  return -percentage * circumference
})

const ingresosColor = '#10b981'
const egresosColor = '#ef4444'

// Distribución por categoría
const categorias = computed(() => {
  const cats = {}
  props.transaccionesFiltradas.forEach(t => {
    if (!cats[t.categoria]) {
      cats[t.categoria] = { nombre: t.categoria, total: 0, tipo: t.tipo }
    }
    cats[t.categoria].total += parseFloat(t.monto)
  })

  const maxCat = Math.max(...Object.values(cats).map(c => c.total))
  
  return Object.values(cats).map(c => ({
    ...c,
    porcentaje: maxCat === 0 ? 0 : (c.total / maxCat) * 100
  })).sort((a, b) => b.total - a.total)
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
.graficos-container {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.graficos-container h2 {
  color: #1e293b;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.graficos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.grafico-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
}

.grafico-card.full-width {
  grid-column: 1 / -1;
}

.grafico-card h3 {
  color: #475569;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 250px;
}

/* Gráfico de Barras */
.bar-chart {
  display: flex;
  gap: 3rem;
  align-items: flex-end;
  height: 250px;
  width: 100%;
  justify-content: center;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.bar {
  width: 80px;
  min-height: 20px;
  border-radius: 8px 8px 0 0;
  position: relative;
  transition: all 0.5s ease;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
}

.ingresos-bar {
  background: linear-gradient(180deg, #10b981, #059669);
}

.egresos-bar {
  background: linear-gradient(180deg, #ef4444, #dc2626);
}

.bar-label {
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  text-align: center;
}

.bar-name {
  font-weight: 600;
  color: #64748b;
  margin-top: 0.5rem;
}

/* Gráfico Circular */
.pie-chart {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.pie-svg {
  width: 200px;
  height: 200px;
}

.pie-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  color: #475569;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

/* Gráfico por Categoría */
.categoria-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.categoria-bar-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.categoria-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #475569;
}

.categoria-nombre {
  font-weight: 600;
}

.categoria-monto {
  color: #0ea5e9;
  font-weight: 700;
}

.categoria-bar-bg {
  background: #e2e8f0;
  height: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.categoria-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  padding-left: 0.75rem;
  color: white;
  font-weight: 600;
}

@media (max-width: 768px) {
  .graficos-grid {
    grid-template-columns: 1fr;
  }

  .bar-chart {
    gap: 2rem;
  }

  .bar {
    width: 60px;
  }
}
</style>