<template>
  <div class="dashboard-container">
    <h1>🏠 Panel Principal – Gestión Familiar</h1>

    <div class="section-grid">

      <!-- RF02: Familias -->
      <div class="card">
        <h2>👨‍👩‍👧‍👦 Familias</h2>
        <p>Crea y gestiona las familias del sistema.</p>
        <button class="btn" @click="vista_familia">Crear Familia</button>
      </div>

        <div class="card">
        <h2>👤➕ Miembros</h2>
        <p>Crea y amplía los miembros de tu familia.</p>
        <button class="btn" @click="vista_miembro">Crear Miembros</button>
      </div>

      <!-- RF03: Categorías -->
      <div class="card">
        <h2>🗂️ Categorías</h2>
        <p>Clasifica tus categorías de ingresos y egresos.</p>
        <button class="btn" @click="vista_cate">Crear Categoría</button>
      </div>

      <!-- RF04: Transacciones -->
      <div class="card">
        <h2>💸 Transacciones</h2>
        <p>Registra, edita y visualiza transacciones familiares.</p>
        <button class="btn" @click="vista_trans">Registrar Transacción</button>
        <button class="btn">Historial</button>
      </div>

      <!-- RF05: Reportes -->
      <div class="card">
        <h2>📊 Reportes</h2>
        <p>Consulta reportes y gráficos financieros.</p>
        <button class="btn">Ver Balance General</button>
        <button class="btn">Generar Reporte</button>
      </div>

      <!-- RF06: Exportación -->
      <div class="card">
        <h2>📁 Exportación</h2>
        <p>Descarga tus reportes o transacciones.</p>
        <button class="btn">Exportar a Excel</button>
        <button class="btn">Descargar CSV</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const vista_cate = () => {
  router.push("/categorias");
};

const vista_familia = () => {
  router.push("/familia");
};

const vista_miembro = () => {
  router.push("/miembro");
};

const vista_trans = () => {
  router.push("/transacciones");
};


</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  padding: 40px;
  font-family: "Poppins", sans-serif;
  color: #333;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
  color: white;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
}

.card {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 20px;
  padding: 45px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.15);
}

.card h2 {
  font-size: 1.4rem;
  color: white;
  margin-bottom: 10px;
}

.card p {
  font-size: 0.95rem;
  margin-bottom: 15px;
  color: white;
}

.btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  margin-bottom: 15px;
}


</style>
