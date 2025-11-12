<template>
  <div class="Reportes">
    <div class="header-container">
      <h1>📊 REPORTES FINANCIEROS</h1>
      <button class="volver-btn" @click="volver">← Volver</button>
    </div>

    <!-- FILTROS -->
    <div class="filtros-container">
      <h2>🔍 Filtros de Búsqueda</h2>
      <div class="filtros-grid">
        <div class="filtro-item">
          <label>Familia:</label>
          <select v-model="filtros.id_familia">
            <option value="">Todas las familias</option>
            <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
              {{ familia.nombre_familia }}
            </option>
          </select>
        </div>

        <div class="filtro-item">
          <label>Fecha Inicio:</label>
          <input type="date" v-model="filtros.fecha_inicio" />
        </div>

        <div class="filtro-item">
          <label>Fecha Fin:</label>
          <input type="date" v-model="filtros.fecha_fin" />
        </div>

        <div class="filtro-item">
          <label>Categoría:</label>
          <select v-model="filtros.idcategoria">
            <option value="">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat.idcategoria" :value="cat.idcategoria">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <div class="filtro-item">
          <button class="reset-btn" @click="limpiarFiltros">🔄 Limpiar</button>
        </div>
      </div>
    </div>

    <!-- BALANCE GENERAL -->
    <div class="balance-container">
      <h2>💰 Balance General</h2>
      <div class="balance-grid">
        <div class="balance-card ingresos">
          <div class="icon">💵</div>
          <div class="info">
            <span class="label">Total Ingresos</span>
            <span class="valor">{{ formatearMonto(totalIngresos) }}</span>
          </div>
        </div>

        <div class="balance-card egresos">
          <div class="icon">💸</div>
          <div class="info">
            <span class="label">Total Egresos</span>
            <span class="valor">{{ formatearMonto(totalEgresos) }}</span>
          </div>
        </div>

        <div class="balance-card saldo" :class="saldo >= 0 ? 'positivo' : 'negativo'">
          <div class="icon">{{ saldo >= 0 ? '✅' : '⚠️' }}</div>
          <div class="info">
            <span class="label">Saldo</span>
            <span class="valor">{{ formatearMonto(saldo) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- GRÁFICOS -->
    <div class="graficos-container">
      <div class="grafico-card">
        <h3>📈 Ingresos vs Egresos</h3>
        <canvas ref="chartComparativo"></canvas>
      </div>

      <div class="grafico-card">
        <h3>🥧 Por Categoría</h3>
        <canvas ref="chartCategorias"></canvas>
      </div>
    </div>

    <!-- TRANSACCIONES -->
    <div class="transacciones-container">
      <h2>📋 Transacciones ({{ transaccionesFiltradas.length }})</h2>
      <div v-if="transaccionesFiltradas.length === 0" class="no-data">
        No hay transacciones con los filtros seleccionados.
      </div>
      <div v-else class="transacciones-lista">
        <div v-for="trans in transaccionesFiltradas" :key="trans.id_transaccion" 
             class="transaccion-card" :class="trans.tipo">
          <div class="trans-header">
            <span class="tipo-badge">{{ trans.tipo }}</span>
            <span class="monto">{{ formatearMonto(trans.monto) }}</span>
          </div>
          <p><strong>{{ obtenerNombreCategoria(trans.idcategoria) }}</strong></p>
          <p class="fecha">{{ formatearFecha(trans.fecha) }}</p>
          <p class="descripcion">{{ trans.descripcion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Chart from "chart.js/auto";

const router = useRouter();
const token = localStorage.getItem("token");

const chartComparativo = ref(null);
const chartCategorias = ref(null);
let chartComparativoInstance = null;
let chartCategoriasInstance = null;

const familias = ref([]);
const categorias = ref([]);
const transacciones = ref([]);

const filtros = ref({
  id_familia: "",
  fecha_inicio: "",
  fecha_fin: "",
  idcategoria: ""
});

const volver = () => router.push("/dashboard");

// Transacciones filtradas
const transaccionesFiltradas = computed(() => {
  let resultado = [...transacciones.value];

  if (filtros.value.id_familia) {
    resultado = resultado.filter(t => t.id_familia === filtros.value.id_familia);
  }
  if (filtros.value.fecha_inicio) {
    resultado = resultado.filter(t => new Date(t.fecha) >= new Date(filtros.value.fecha_inicio));
  }
  if (filtros.value.fecha_fin) {
    resultado = resultado.filter(t => new Date(t.fecha) <= new Date(filtros.value.fecha_fin));
  }
  if (filtros.value.idcategoria) {
    resultado = resultado.filter(t => t.idcategoria === filtros.value.idcategoria);
  }

  return resultado;
});

// Cálculos
const totalIngresos = computed(() => {
  return transaccionesFiltradas.value
    .filter(t => t.tipo === "Ingreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
});

const totalEgresos = computed(() => {
  return transaccionesFiltradas.value
    .filter(t => t.tipo === "Egreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
});

const saldo = computed(() => totalIngresos.value - totalEgresos.value);

// Funciones auxiliares
const obtenerNombreCategoria = (id) => {
  const cat = categorias.value.find(c => c.idcategoria === id);
  return cat ? cat.nombre : "Sin categoría";
};

const formatearMonto = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

const formatearFecha = (fechaISO) => {
  return new Date(fechaISO).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const limpiarFiltros = () => {
  filtros.value = {
    id_familia: "",
    fecha_inicio: "",
    fecha_fin: "",
    idcategoria: ""
  };
};

// Gráfico comparativo
const crearGraficoComparativo = () => {
  if (!chartComparativo.value) return;

  if (chartComparativoInstance) {
    chartComparativoInstance.destroy();
  }

  const datosPorMes = {};
  transaccionesFiltradas.value.forEach(t => {
    const mes = new Date(t.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'short' });
    if (!datosPorMes[mes]) {
      datosPorMes[mes] = { ingresos: 0, egresos: 0 };
    }
    if (t.tipo === "Ingreso") {
      datosPorMes[mes].ingresos += parseFloat(t.monto);
    } else {
      datosPorMes[mes].egresos += parseFloat(t.monto);
    }
  });

  const meses = Object.keys(datosPorMes).sort();
  const ingresos = meses.map(m => datosPorMes[m].ingresos);
  const egresos = meses.map(m => datosPorMes[m].egresos);

  chartComparativoInstance = new Chart(chartComparativo.value, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [
        {
          label: 'Ingresos',
          data: ingresos,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2
        },
        {
          label: 'Egresos',
          data: egresos,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => '$' + value.toLocaleString()
          }
        }
      }
    }
  });
};

// Gráfico de categorías
const crearGraficoCategorias = () => {
  if (!chartCategorias.value) return;

  if (chartCategoriasInstance) {
    chartCategoriasInstance.destroy();
  }

  const datosCat = {};
  transaccionesFiltradas.value.forEach(t => {
    const nombreCat = obtenerNombreCategoria(t.idcategoria);
    if (!datosCat[nombreCat]) {
      datosCat[nombreCat] = 0;
    }
    datosCat[nombreCat] += parseFloat(t.monto);
  });

  const categorias_nombres = Object.keys(datosCat);
  const totales = Object.values(datosCat);

  const colores = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 206, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)'
  ];

  chartCategoriasInstance = new Chart(chartCategorias.value, {
    type: 'doughnut',
    data: {
      labels: categorias_nombres,
      datasets: [{
        data: totales,
        backgroundColor: colores,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
};

const actualizarGraficos = () => {
  crearGraficoComparativo();
  crearGraficoCategorias();
};

// Cargar datos
onMounted(async () => {
  try {
    const [resFamilias, resCategorias, resTransacciones] = await Promise.all([
      axios.get("http://localhost:4000/familia", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://localhost:4000/categoria", { headers: { Authorization: `Bearer ${token}` } }),
      axios.get("http://localhost:4000/transaccion", { headers: { Authorization: `Bearer ${token}` } })
    ]);

    familias.value = resFamilias.data;
    categorias.value = resCategorias.data;
    transacciones.value = resTransacciones.data;

    nextTick(() => actualizarGraficos());

  } catch (error) {
    console.error("Error:", error);
    if (error.response?.status === 401) {
      alert("⚠️ Sesión expirada.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
});

watch(transaccionesFiltradas, () => {
  nextTick(() => actualizarGraficos());
});
</script>

<style scoped>
.Reportes {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  min-height: 100vh;
  padding: 2rem;
  font-family: "Poppins", sans-serif;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: rgb(102, 174, 179);
  padding: 1.5rem 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.header-container h1 {
  color: white;
  margin: 0;
}

.volver-btn {
  background: linear-gradient(135deg, #0f2027, #203a43);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 0.8rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.volver-btn:hover {
  transform: translateY(-2px);
}

.filtros-container,
.balance-container,
.transacciones-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.filtros-container h2,
.balance-container h2,
.transacciones-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
}

.filtros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.filtro-item label {
  color: white;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

.filtro-item input,
.filtro-item select {
  width: 100%;
  padding: 0.7rem;
  border: 2px solid black;
  border-radius: 50px;
  background: transparent;
  color: black;
  outline: none;
}

.filtro-item select option {
  background: white;
  color: black;
}

.reset-btn {
  width: 100%;
  padding: 0.7rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border: none;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.8rem;
}

.balance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.balance-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.balance-card:hover {
  transform: translateY(-5px);
}

.balance-card .icon {
  font-size: 3rem;
}

.balance-card .label {
  font-size: 0.9rem;
  color: #666;
  display: block;
}

.balance-card .valor {
  font-size: 1.8rem;
  font-weight: bold;
  color: #1c3d5a;
  display: block;
}

.balance-card.ingresos {
  border-left: 5px solid #51cf66;
}

.balance-card.egresos {
  border-left: 5px solid #ff6b6b;
}

.balance-card.saldo.positivo {
  border-left: 5px solid #4dabf7;
}

.balance-card.saldo.positivo .valor {
  color: #2f9e44;
}

.balance-card.saldo.negativo {
  border-left: 5px solid #ff6b6b;
}

.balance-card.saldo.negativo .valor {
  color: #c92a2a;
}

.graficos-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.grafico-card {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.grafico-card h3 {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
}

.grafico-card canvas {
  background: white;
  border-radius: 10px;
  padding: 1rem;
}

.no-data {
  color: white;
  text-align: center;
  padding: 2rem;
}

.transacciones-lista {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  max-height: 500px;
  overflow-y: auto;
}

.transaccion-card {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  border-left: 4px solid #ccc;
  transition: all 0.3s ease;
}

.transaccion-card.Ingreso {
  border-left-color: #51cf66;
}

.transaccion-card.Egreso {
  border-left-color: #ff6b6b;
}

.transaccion-card:hover {
  transform: translateY(-3px);
}

.trans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.tipo-badge {
  background: linear-gradient(135deg, #4dabf7, #339af0);
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.transaccion-card.Ingreso .tipo-badge {
  background: linear-gradient(135deg, #51cf66, #37b24d);
}

.transaccion-card.Egreso .tipo-badge {
  background: linear-gradient(135deg, #ff6b6b, #fa5252);
}

.monto {
  font-size: 1.2rem;
  font-weight: bold;
}

.transaccion-card.Ingreso .monto {
  color: #2f9e44;
}

.transaccion-card.Egreso .monto {
  color: #c92a2a;
}

.transaccion-card p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
  color: #666;
}

.fecha {
  font-size: 0.85rem !important;
  color: #999 !important;
}

.descripcion {
  padding-top: 0.5rem;
  border-top: 1px solid #f0f0f0;
  color: #444 !important;
}
</style>