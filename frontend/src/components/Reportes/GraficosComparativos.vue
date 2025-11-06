<template>
  <div class="graficos-container">

    <h2>📊 Gráficos Comparativos</h2>

    <div class="graficos-grid">

      <!-- Gráfico de Barras -->
      <div class="grafico-card">
        <h3>Ingresos vs Egresos</h3>
        <Bar :data="barData" :options="barOptions" />
      </div>

      <!-- Gráfico Circular -->
      <div class="grafico-card">
        <h3>Distribución General</h3>
        <Doughnut :data="doughnutData" :options="doughnutOptions" />
      </div>

      <!-- Categorías -->
      <div class="grafico-card full-width">
        <h3>Gastos por Categoría</h3>
        <Bar :data="categoriasData" :options="categoriasOptions" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Bar, Doughnut } from "vue-chartjs";
import {
  Chart,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

// Registrar componentes Chart.js
Chart.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const props = defineProps({
  transaccionesFiltradas: { type: Array, default: () => [] }
});

// Cálculos básicos
const totalIngresos = computed(() =>
  props.transaccionesFiltradas
    .filter(t => t.tipo === "Ingreso")
    .reduce((s, t) => s + parseFloat(t.monto), 0)
);

const totalEgresos = computed(() =>
  props.transaccionesFiltradas
    .filter(t => t.tipo === "Egreso")
    .reduce((s, t) => s + parseFloat(t.monto), 0)
);

// ✅ Bar Chart
const barData = computed(() => ({
  labels: ["Ingresos", "Egresos"],
  datasets: [
    {
      label: "Monto",
      data: [totalIngresos.value, totalEgresos.value],
      backgroundColor: ["#10b981", "#ef4444"],
      borderRadius: 8
    }
  ]
}));

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  }
};

// ✅ Doughnut Chart
const doughnutData = computed(() => ({
  labels: ["Ingresos", "Egresos"],
  datasets: [
    {
      data: [totalIngresos.value, totalEgresos.value],
      backgroundColor: ["#10b981", "#ef4444"]
    }
  ]
}));

const doughnutOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "bottom"
    }
  }
};

// ✅ Categorías
const categorias = computed(() => {
  const cats = {};
  props.transaccionesFiltradas.forEach(t => {
    if (!cats[t.categoria]) cats[t.categoria] = 0;
    cats[t.categoria] += parseFloat(t.monto);
  });
  return cats;
});

const categoriasData = computed(() => ({
  labels: Object.keys(categorias.value),
  datasets: [
    {
      label: "Monto por categoría",
      data: Object.values(categorias.value),
      backgroundColor: "#3b82f6",
      borderRadius: 8
    }
  ]
}));

const categoriasOptions = {
  responsive: true,
  plugins: {
    legend: { display: false }
  },
  indexAxis: "y" // ✅ Barras horizontales
};
</script>

<style scoped>
.graficos-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.graficos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(300px,1fr));
  gap: 1.5rem;
}

.grafico-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
}

.grafico-card.full-width {
  grid-column: 1 / -1;
}
</style>
