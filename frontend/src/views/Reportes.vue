<template>
  <div class="Reportes">
    <div class="header-container">
      <h1>📊 REPORTES FINANCIEROS</h1>
      <button class="volver-btn" @click="volver">← Volver</button>
    </div>

    <ReportFilters
      v-model="filtros"
      :familias="familias"
      :categorias="categorias"
      @limpiar="limpiarFiltros"
    />

    <ReportCharts
      :transacciones="transaccionesFiltradas"
      :categorias="categorias"
      ref="chartsRef"
    />

    <ReportTransactionsList
      :transacciones="transaccionesFiltradas"
      :categorias="categorias"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import ReportFilters from "./ReportFilters.vue";
import ReportCharts from "./ReportCharts.vue";
import ReportTransactionsList from "./ReportTransactionsList.vue";

const router = useRouter();
const token = localStorage.getItem("token");

const familias = ref([]);
const categorias = ref([]);
const transacciones = ref([]);
const chartsRef = ref(null);

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

const limpiarFiltros = () => {
  filtros.value = {
    id_familia: "",
    fecha_inicio: "",
    fecha_fin: "",
    idcategoria: ""
  };
};

// Cargar datos
onMounted(async () => {
  try {
    const [resFamilias, resCategorias, resTransacciones] = await Promise.all([
      axios.get("http://localhost:4000/familia", { 
        headers: { Authorization: `Bearer ${token}` } 
      }),
      axios.get("http://localhost:4000/categoria", { 
        headers: { Authorization: `Bearer ${token}` } 
      }),
      axios.get("http://localhost:4000/transaccion", { 
        headers: { Authorization: `Bearer ${token}` } 
      })
    ]);

    familias.value = resFamilias.data;
    categorias.value = resCategorias.data;
    transacciones.value = resTransacciones.data;

  } catch (error) {
    console.error("Error al cargar datos:", error);
    if (error.response?.status === 401) {
      alert("⚠️ Sesión expirada. Por favor, inicia sesión nuevamente.");
      localStorage.removeItem("token");
      router.push("/login");
    } else {
      alert("Error al cargar los datos. Por favor, intenta nuevamente.");
    }
  }
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
  font-size: 2rem;
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
  font-size: 1rem;
}

.volver-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .Reportes {
    padding: 1rem;
  }

  .header-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .header-container h1 {
    font-size: 1.5rem;
  }
}
</style>