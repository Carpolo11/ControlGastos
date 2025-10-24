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

      <!-- Botón Volver -->
      <button class="login-btn" @click="volver">
        VOLVER
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import BalanceGeneral from '../components/reportes/BalanceGeneral.vue'
import FiltrosReporte from '../components/reportes/FiltrosReporte.vue'
import GraficosComparativos from '../components/reportes/GraficosComparativos.vue'
import TablaTransacciones from '../components/reportes/TablaTransacciones.vue'

const transacciones = ref([])
const miembros = ref([])
const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  categoria: '',
  idMiembro: ''
})

const router = useRouter()
const volver = () => {
  router.push('/dashboard')
}

onMounted(async () => {
  await cargarDatos()
})

// Cargar transacciones y miembros desde el backend
async function cargarDatos() {
  try {
    const [resTransacciones, resMiembros] = await Promise.all([
      axios.get('http://localhost:4000/reportes'),
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
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
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

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 1rem;
}

.login-btn:hover {
  opacity: 0.9;
}
</style>