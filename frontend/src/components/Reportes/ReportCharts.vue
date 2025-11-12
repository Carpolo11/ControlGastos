<template>
  <div>
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
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import Chart from 'chart.js/auto';

const props = defineProps({
  transacciones: {
    type: Array,
    required: true
  },
  categorias: {
    type: Array,
    required: true
  }
});

const chartComparativo = ref(null);
const chartCategorias = ref(null);
let chartComparativoInstance = null;
let chartCategoriasInstance = null;

// Cálculos
const totalIngresos = computed(() => {
  return props.transacciones
    .filter(t => t.tipo === "Ingreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
});

const totalEgresos = computed(() => {
  return props.transacciones
    .filter(t => t.tipo === "Egreso")
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
});

const saldo = computed(() => totalIngresos.value - totalEgresos.value);

// Funciones auxiliares
const obtenerNombreCategoria = (id) => {
  const cat = props.categorias.find(c => c.idcategoria === id);
  return cat ? cat.nombre : "Sin categoría";
};

const formatearMonto = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

// Gráfico comparativo
const crearGraficoComparativo = () => {
  if (!chartComparativo.value) return;

  if (chartComparativoInstance) {
    chartComparativoInstance.destroy();
  }

  const datosPorMes = {};
  props.transacciones.forEach(t => {
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
      maintainAspectRatio: true,
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
  props.transacciones.forEach(t => {
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
    'rgba(255, 159, 64, 0.7)',
    'rgba(231, 76, 60, 0.7)',
    'rgba(46, 204, 113, 0.7)'
  ];

  chartCategoriasInstance = new Chart(chartCategorias.value, {
    type: 'doughnut',
    data: {
      labels: categorias_nombres,
      datasets: [{
        data: totales,
        backgroundColor: colores,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  });
};

const actualizarGraficos = () => {
  nextTick(() => {
    crearGraficoComparativo();
    crearGraficoCategorias();
  });
};

// Observar cambios en transacciones
watch(() => props.transacciones, () => {
  actualizarGraficos();
}, { deep: true });

onMounted(() => {
  actualizarGraficos();
});

onBeforeUnmount(() => {
  if (chartComparativoInstance) {
    chartComparativoInstance.destroy();
  }
  if (chartCategoriasInstance) {
    chartCategoriasInstance.destroy();
  }
});

defineExpose({ actualizarGraficos });
</script>

<style scoped>
.balance-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.balance-container h2 {
  color: white;
  text-align: center;
  margin-bottom: 1.5rem;
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
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
  max-height: 400px;
}
</style>