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
        :transacciones="transaccionesFiltradas"
      />

      <!-- Filtros de Búsqueda -->
      <FiltrosReporte 
        @aplicar-filtros="aplicarFiltros"
        :miembros="miembros"
        :categorias="categorias"
      />

      <!-- Gráficos Comparativos -->
      <GraficosComparativos 
        :transacciones-filtradas="transaccionesFiltradas"
      />

      <!-- Tabla -->
      <TablaTransacciones 
        :transacciones="transaccionesFiltradas"
      />

      <!-- Resumen -->
      <ResumenEstadistico 
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

import BalanceGeneral from '../components/Reportes/BalanceGeneral.vue'
import FiltrosReporte from '../components/Reportes/FiltrosReporte.vue'
import GraficosComparativos from '../components/Reportes/GraficosComparativos.vue'
import TablaTransacciones from '../components/Reportes/TablaTransacciones.vue'
import ResumenEstadistico from '../components/Reportes/ResumenEstadistico.vue'

const transacciones = ref([])
const miembros = ref([])
const categorias = ref([])

const filtros = ref({
  fechaInicio: '',
  fechaFin: '',
  categoria: '',
  idMiembro: ''
})

const router = useRouter()
const volver = () => router.push('/dashboard')

onMounted(async () => {
  await cargarDatos()
})


// ✅ Cargar transacciones, miembros y categorías desde el backend
async function cargarDatos() {
  try {
    const [resTransacciones, resMiembros, resCategorias] = await Promise.all([
      axios.get('http://localhost:4000/reportes'),
      axios.get('http://localhost:4000/miembro_familia'),
      axios.get('http://localhost:4000/categorias')
    ])

    transacciones.value = resTransacciones.data
    miembros.value = resMiembros.data
    categorias.value = resCategorias.data

    console.log('✅ Datos cargados correctamente')
    console.log('📊 Total transacciones:', transacciones.value.length)
    console.log('👥 Miembros:', miembros.value.length)
    console.log('🏷️ Categorías:', categorias.value.length)

  } catch (error) {
    console.error('❌ Error al cargar datos:', error)
  }
}


// ✅ Recibir filtros desde FiltrosReporte.vue
function aplicarFiltros(nuevosFiltros) {
  filtros.value = { ...nuevosFiltros }
  console.log('🔍 Filtros aplicados:', filtros.value)
}


// ✅ Transacciones filtradas automáticamente
const transaccionesFiltradas = computed(() => {
  let resultado = [...transacciones.value]

  if (filtros.value.fechaInicio) {
    resultado = resultado.filter(
      t => new Date(t.fecha) >= new Date(filtros.value.fechaInicio)
    )
  }

  if (filtros.value.fechaFin) {
    resultado = resultado.filter(
      t => new Date(t.fecha) <= new Date(filtros.value.fechaFin)
    )
  }

  if (filtros.value.categoria) {
    resultado = resultado.filter(t => t.categoria === filtros.value.categoria)
  }

  if (filtros.value.idMiembro) {
    resultado = resultado.filter(
      t => t.id_miembro === parseInt(filtros.value.idMiembro)
    )
  }

  console.log('📋 Transacciones filtradas:', resultado.length)
  return resultado
})


// ✅ Cálculos del balance
const totalIngresos = computed(() => 
  transaccionesFiltradas.value
    .filter(t => t.tipo === 'Ingreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
)

const totalEgresos = computed(() => 
  transaccionesFiltradas.value
    .filter(t => t.tipo === 'Egreso')
    .reduce((sum, t) => sum + parseFloat(t.monto), 0)
)

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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
.header p {
  color: #ffffff;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}
.content {
  max-width: 1400px;
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
  transition: all 0.3s ease;
  margin-top: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.login-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}
</style>
