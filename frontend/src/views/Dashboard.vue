<template>
  <div class="dashboard-container">

    <button class="logout-btn" @click="cerrarSesion">🚪 CERRAR SESIÓN</button>

    <h1>🏠 Panel Principal – HomeBalance</h1>

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
        <button class="btn" @click="vista_transaccion">Registrar Transacción</button>
      </div>

      <!-- RF05: Reportes -->
      <div class="card">
        <h2>📊 Reportes</h2>
        <p>Consulta reportes y gráficos financieros.</p>
        <button class="btn" @click="vista_reporte">Ver Balance General</button>
      </div>

      <!-- RF06: Exportación -->
      <div class="card">
        <h2>📁 Exportación</h2>
        <p>Descarga tus reportes o transacciones.</p>
        <button class="btn"@click="vista_exportacion">Exportar a Excel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted } from "vue";



const router = useRouter();


onMounted(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  console.log("Usuario actual:", usuario);

  if (usuario) {
    console.log("Rol:", usuario.rol);
  } else {
    console.warn("No hay usuario logueado");
  }
});

const cerrarSesion = () => {
  if (confirm("¿Seguro que deseas cerrar sesión?")) {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    router.push("/login");
  }
};

const vista_cate = () => {
  router.push("/categorias");
};

const vista_familia = () => {
  router.push("/familia");
};

const vista_miembro = () => {
  router.push("/miembro");
};

const vista_transaccion = () => {
  router.push("/transacciones");
};

const vista_reporte = () => {
  router.push("/reportes");
};

const vista_exportacion = () => {
  router.push("/exportar");
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
  background: rgb(102, 174, 179);
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
  background: rgb(8, 80, 122);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  margin-bottom: 15px;
}

.logout-btn {
  position: absolute;
  top: 20px;
  right: 25px;
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #f85032, #e73827);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}


</style>
