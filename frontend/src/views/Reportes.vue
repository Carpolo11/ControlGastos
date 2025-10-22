<template>
  <section class="reportes-container">
    <div class="header">
      <h1>📊 Reportes Financieros</h1>
      <p>Visualiza y analiza tus movimientos financieros</p>
    </div>

    <div class="content">
      <!-- Balance General -->
      <BalanceGeneral 
        :total-ingresos="totalIngresos"
        :total-egresos="totalEgresos"
        :saldo="saldo"
      />

      <!-- Filtros de Búsqueda -->
      <FiltrosReporte 
        @aplicar-filtros="aplicarFiltros"
        :miembros="miembros"
      />

      <!-- Gráficos Comparativos -->
      <GraficosComparativos 
        :transacciones-filtradas="transaccionesFiltradas"
      />

      <!-- Tabla de Transacciones Filtradas -->
      <TablaTransacciones 
        :transacciones="transaccionesFiltradas"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import BalanceGeneral from '../components/reportes/BalanceGeneral.vue'
import FiltrosReporte from '../components/reportes/FiltrosReporte.vue'
import GraficosComparativos from '../components/Reportes/GraficosComparativos.vue'
import TablaTransacciones from '../components/Reportes/TablaTransacciones.vue'

const transacciones = ref([])
const miembros = ref([])
const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  categoria: '',
  idMiembro: ''
})

onMounted(async () => {
  await cargarDatos()
})

// Cargar transacciones y miembros
async function cargarDatos() {
  try {
    const [resTransacciones, resMiembros] = await Promise.all([
      axios.get('http://localhost:4000/transacciones'),
      axios.get('http://localhost:4000/miembro_familia')
    ])
    
    transacciones.value = resTransacciones.data
    miembros.value = resMiembros.data
    console.log('✅ Datos cargados correctamente')
  } catch (error) {
    console.error('❌ Error al cargar datos:', error)
    alert('Error al cargar los datos del reporte')
  }
}

// Aplicar filtros
function aplicarFiltros(nuevosFiltros) {
  filtros.value = { ...nuevosFiltros }
}

// Transacciones filtradas
const transaccionesFiltradas = computed(() => {
  let resultado = [...transacciones.value]

  // Filtrar por rango de fechas
  if (filtros.value.fechaInicio) {
    resultado = resultado.filter(t => new Date(t.fecha) >= new Date(filtros.value.fechaInicio))
  }
  if (filtros.value.fechaFin) {
    resultado = resultado.filter(t => new Date(t.fecha) <= new Date(filtros.value.fechaFin))
  }

  // Filtrar por categoría
  if (filtros.value.categoria) {
    resultado = resultado.filter(t => t.categoria === filtros.value.categoria)
  }

  // Filtrar por miembro
  if (filtros.value.idMiembro) {
    resultado = resultado.filter(t => t.id_miembro === parseInt(filtros.value.idMiembro))
  }

  return resultado
})

// Cálculos del balance
const totalIngresos = computed(() => {
  return transaccionesFiltradas.value
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
})

const totalEgresos = computed(() => {
  return transaccionesFiltradas.value
    .filter(t => t.tipo === 'Egreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
})

const saldo = computed(() => totalIngresos.value - totalEgresos.value)
</script>

<style scoped>
.reportes-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 3rem 1.5rem;
  font-family: "Inter", system-ui, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header h1 {
  color: #0369a1;
  font-weight: 700;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.header p {
  color: #64748b;
  font-size: 1.1rem;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
</style>