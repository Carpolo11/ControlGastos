<template>
  <div class="resumen-container">
    <h2>📈 Resumen Estadístico</h2>

    <div class="estadisticas-grid">

      <!-- Top Gastos -->
      <div class="estadistica-card">
        <div class="card-header">
          <span class="icon">💸</span>
          <h3>Top 5 Mayores Gastos</h3>
        </div>
        <div class="card-content">
          <div 
            v-for="(gasto, index) in topGastos" 
            :key="index"
            class="top-item"
          >
            <div class="top-numero">{{ index + 1 }}</div>
            <div class="top-info">
              <div class="top-categoria">{{ gasto.categoria }}</div>
              <div class="top-descripcion">{{ gasto.descripcion || 'Sin descripción' }}</div>
              <div class="top-fecha">{{ formatDate(gasto.fecha) }}</div>
            </div>
            <div class="top-monto">{{ formatCurrency(gasto.monto) }}</div>
          </div>
          <div v-if="topGastos.length === 0" class="empty-message">
            No hay gastos registrados
          </div>
        </div>
      </div>

      <!-- Categorías más frecuentes -->
      <div class="estadistica-card">
        <div class="card-header">
          <span class="icon">🎯</span>
          <h3>Categorías Más Frecuentes</h3>
        </div>
        <div class="card-content">
          <div 
            v-for="(cat, index) in categoriasFrecuentes" 
            :key="index"
            class="frecuencia-item"
          >
            <div class="frecuencia-info">
              <div class="frecuencia-nombre">{{ cat.nombre }}</div>
              <div class="frecuencia-contador">{{ cat.cantidad }} transacciones</div>
            </div>
            <div class="frecuencia-barra">
              <div 
                class="frecuencia-progreso" 
                :style="{ width: (cat.cantidad / maxFrecuencia * 100) + '%' }"
              ></div>
            </div>
            <div class="frecuencia-monto">{{ formatCurrency(cat.total) }}</div>
          </div>
          <div v-if="categoriasFrecuentes.length === 0" class="empty-message">
            No hay datos disponibles
          </div>
        </div>
      </div>

      <!-- Distribución por día -->
      <div class="estadistica-card">
        <div class="card-header">
          <span class="icon">📅</span>
          <h3>Gastos por Día de la Semana</h3>
        </div>
        <div class="card-content">
          <div 
            v-for="dia in diasSemana" 
            :key="dia.nombre"
            class="dia-item"
          >
            <div class="dia-nombre">{{ dia.nombre }}</div>
            <div class="dia-barra">
              <div 
                class="dia-progreso" 
                :style="{ width: (dia.total / maxDiaSemana * 100) + '%' }"
              ></div>
            </div>
            <div class="dia-info">
              <span class="dia-monto">{{ formatCurrency(dia.total) }}</span>
              <span class="dia-contador">({{ dia.cantidad }})</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumen de periodo -->
      <div class="estadistica-card full-width">
        <div class="card-header">
          <span class="icon">📊</span>
          <h3>Resumen de Periodo</h3>
        </div>
        <div class="card-content">
          <div class="periodo-grid">
            <div class="periodo-stat">
              <div class="stat-label">Periodo analizado</div>
              <div class="stat-value">{{ periodoAnalizado }}</div>
            </div>
            <div class="periodo-stat">
              <div class="stat-label">Total de días</div>
              <div class="stat-value">{{ totalDias }} días</div>
            </div>
            <div class="periodo-stat">
              <div class="stat-label">Promedio diario de gastos</div>
              <div class="stat-value">{{ formatCurrency(promedioDiario) }}</div>
            </div>
            <div class="periodo-stat">
              <div class="stat-label">Mayor gasto en un día</div>
              <div class="stat-value">{{ formatCurrency(mayorGastoDia) }}</div>
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
  transacciones: {
    type: Array,
    default: () => []
  }
})

const egresos = computed(() => 
  props.transacciones.filter(t => t.tipo === 'Egreso')
)

const ingresos = computed(() => 
  props.transacciones.filter(t => t.tipo === 'Ingreso')
)

const totalEgresos = computed(() => 
  egresos.value.reduce((s, t) => s + parseFloat(t.monto), 0)
)

const topGastos = computed(() => {
  return [...egresos.value]
    .sort((a, b) => parseFloat(b.monto) - parseFloat(a.monto))
    .slice(0, 5)
})

const categoriasFrecuentes = computed(() => {
  const cats = {}
  egresos.value.forEach(t => {
    if (!cats[t.categoria]) cats[t.categoria] = { cantidad: 0, total: 0 }
    cats[t.categoria].cantidad++
    cats[t.categoria].total += parseFloat(t.monto)
  })

  return Object.entries(cats)
    .map(([nombre, data]) => ({
      nombre,
      cantidad: data.cantidad,
      total: data.total
    }))
    .sort((a, b) => b.cantidad - a.cantidad)
})

const maxFrecuencia = computed(() => {
  if (categoriasFrecuentes.value.length === 0) return 1
  return Math.max(...categoriasFrecuentes.value.map(c => c.cantidad))
})

const diasSemana = computed(() => {
  const dias = {
    0: { nombre: 'Domingo', total: 0, cantidad: 0 },
    1: { nombre: 'Lunes', total: 0, cantidad: 0 },
    2: { nombre: 'Martes', total: 0, cantidad: 0 },
    3: { nombre: 'Miércoles', total: 0, cantidad: 0 },
    4: { nombre: 'Jueves', total: 0, cantidad: 0 },
    5: { nombre: 'Viernes', total: 0, cantidad: 0 },
    6: { nombre: 'Sábado', total: 0, cantidad: 0 }
  }

  egresos.value.forEach(t => {
    const dia = new Date(t.fecha).getDay()
    dias[dia].total += parseFloat(t.monto)
    dias[dia].cantidad++
  })

  return Object.values(dias)
})

const maxDiaSemana = computed(() => {
  if (diasSemana.value.length === 0) return 1
  return Math.max(...diasSemana.value.map(d => d.total))
})

const periodoAnalizado = computed(() => {
  if (props.transacciones.length === 0) return 'Sin datos'

  const fechas = props.transacciones.map(t => new Date(t.fecha))
  const minFecha = new Date(Math.min(...fechas))
  const maxFecha = new Date(Math.max(...fechas))

  return `${formatDate(minFecha)} - ${formatDate(maxFecha)}`
})

const totalDias = computed(() => {
  if (props.transacciones.length === 0) return 0

  const fechas = props.transacciones.map(t => new Date(t.fecha))
  const minFecha = new Date(Math.min(...fechas))
  const maxFecha = new Date(Math.max(...fechas))

  const diff = Math.ceil(Math.abs(maxFecha - minFecha) / (1000 * 60 * 60 * 24))
  return diff || 1
})

const promedioDiario = computed(() => {
  if (totalDias.value === 0) return 0
  return totalEgresos.value / totalDias.value
})

const mayorGastoDia = computed(() => {
  const porDia = {}

  egresos.value.forEach(t => {
    const fecha = new Date(t.fecha).toDateString()
    if (!porDia[fecha]) porDia[fecha] = 0
    porDia[fecha] += parseFloat(t.monto)
  })

  const valores = Object.values(porDia)
  return valores.length > 0 ? Math.max(...valores) : 0
})

function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value)
}

function formatDate(date) {
  if (typeof date === 'string') date = new Date(date)
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
<style scoped>
.resumen-container {
  background: rgb(102, 174, 179);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.resumen-container h2 {
  color: #ffffff;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.estadisticas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.estadistica-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.estadistica-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #f1f5f9;
}

.card-header .icon {
  font-size: 1.75rem;
}

.card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Tendencias */
.tendencia-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.tendencia-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.tendencia-valor {
  font-size: 1rem;
  font-weight: 700;
}

.tendencia-valor.saludable { color: #059669; }
.tendencia-valor.advertencia { color: #d97706; }
.tendencia-valor.critico { color: #dc2626; }

/* Top Gastos */
.top-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
  transition: background 0.2s;
}

.top-item:hover {
  background: #f1f5f9;
}

.top-numero {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.top-info {
  flex: 1;
  min-width: 0;
}

.top-categoria {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.top-descripcion {
  font-size: 0.85rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.top-fecha {
  font-size: 0.8rem;
  color: #94a3b8;
}

.top-monto {
  font-weight: 700;
  color: #dc2626;
  font-size: 1rem;
  flex-shrink: 0;
}

/* Frecuencias */
.frecuencia-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.frecuencia-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.frecuencia-nombre {
  font-weight: 600;
  color: #334155;
  font-size: 0.95rem;
}

.frecuencia-contador {
  font-size: 0.85rem;
  color: #64748b;
}

.frecuencia-barra {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.frecuencia-progreso {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.5s ease;
}

.frecuencia-monto {
  text-align: right;
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
}

/* Días de la semana */
.dia-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem;
}

.dia-nombre {
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem;
}

.dia-barra {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
}

.dia-progreso {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #059669);
  transition: width 0.5s ease;
}

.dia-info {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.dia-monto {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.9rem;
}

.dia-contador {
  font-size: 0.85rem;
  color: #64748b;
}

/* Proyecciones */
.proyeccion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 8px;
}

.proyeccion-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.proyeccion-valor {
  font-size: 1.1rem;
  font-weight: 700;
}

.proyeccion-valor.destacado {
  color: #3b82f6;
  font-size: 1.25rem;
}

.proyeccion-valor.positivo { color: #059669; }
.proyeccion-valor.negativo { color: #dc2626; }

.proyeccion-alerta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.alerta-icon {
  font-size: 1.25rem;
}

.alerta-texto {
  font-size: 0.9rem;
  color: #92400e;
  font-weight: 600;
}

/* Periodo */
.periodo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.periodo-stat {
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
}

.empty-message {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
  font-style: italic;
}

@media (max-width: 768px) {
  .estadisticas-grid {
    grid-template-columns: 1fr;
  }

  .top-item {
    flex-wrap: wrap;
  }

  .top-monto {
    width: 100%;
    text-align: right;
    margin-top: 0.5rem;
  }

  .dia-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .dia-info {
    justify-content: space-between;
  }

  .periodo-grid {
    grid-template-columns: 1fr;
  }
}
</style>