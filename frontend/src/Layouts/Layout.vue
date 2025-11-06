<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">💰</span>
          <span v-if="!sidebarCollapsed" class="logo-text">HomeBalance</span>
        </div>
        <button class="toggle-btn" @click="toggleSidebar">
          <span v-if="!sidebarCollapsed">←</span>
          <span v-else>→</span>
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item">
          <span class="nav-icon">🏠</span>
          <span v-if="!sidebarCollapsed" class="nav-text">Inicio</span>
        </router-link>

        <router-link to="/familia" class="nav-item">
          <span class="nav-icon">👨‍👩‍👧‍👦</span>
          <span v-if="!sidebarCollapsed" class="nav-text">Familias</span>
        </router-link>

        <router-link to="/miembro" class="nav-item">
          <span class="nav-icon">👤</span>
          <span v-if="!sidebarCollapsed" class="nav-text">Miembros</span>
        </router-link>

        <router-link to="/categorias" class="nav-item">
          <span class="nav-icon">🗂️</span>
          <span v-if="!sidebarCollapsed" class="nav-text">Categorías</span>
        </router-link>

        <router-link to="/transacciones" class="nav-item">
          <span class="nav-icon">💸</span>
          <span v-if="!sidebarCollapsed" class="nav-text">Transacciones</span>
        </router-link>

        <router-link to="/reportes" class="nav-item">
          <span class="nav-icon">📊</span>
          <span v-if="!sidebarCollapsed" class="nav-text">Reportes</span>
        </router-link>

        <router-link to="/exportar" class="nav-item">
          <span class="nav-icon">📁</span>
          <span v-if="!sidebarCollapsed" class="nav-text">Exportar</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info" v-if="usuario">
          <span class="user-icon">👤</span>
          <div v-if="!sidebarCollapsed" class="user-details">
            <p class="user-name">{{ usuario.nombre }}</p>
            <p class="user-role">{{ usuario.rol }}</p>
          </div>
        </div>
        <button class="logout-btn" @click="cerrarSesion">
          <span class="logout-icon">🚪</span>
          <span v-if="!sidebarCollapsed">Salir</span>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="main-container" :class="{ expanded: sidebarCollapsed }">
      <!-- Top Header -->
      <header class="top-header">
        <div class="header-left">
          <h2 class="page-title">{{ pageTitle }}</h2>
        </div>
        <div class="header-right">
          <div class="header-info">
            <span class="date">{{ currentDate }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="content-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const sidebarCollapsed = ref(false);
const usuario = ref(null);
const currentDate = ref("");

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value;
};

const pageTitle = computed(() => {
  const titles = {
    "/dashboard": "Panel Principal",
    "/familia": "Gestión de Familias",
    "/miembro": "Gestión de Miembros",
    "/categorias": "Categorías",
    "/transacciones": "Transacciones",
    "/reportes": "Reportes Financieros",
    "/exportar": "Exportación de Datos"
  };
  return titles[route.path] || "HomeBalance";
});

const cerrarSesion = () => {
  if (confirm("¿Seguro que deseas cerrar sesión?")){
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
  localStorage.clear();
  router.push("/login");
  }
};

onMounted(() => {
  usuario.value = JSON.parse(localStorage.getItem("usuario"));
  
  const now = new Date();
  currentDate.value = now.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.layout-wrapper {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
  font-family: "Poppins", sans-serif;
}

/* Sidebar Styles */
.sidebar {
  width: 280px;
  background: linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1000;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  
}

.sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 25px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 2rem;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffaf7b, #d76d77);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.toggle-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 25px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.router-link-active {
  background: linear-gradient(90deg, rgba(255, 175, 123, 0.2), transparent);
  color: #ffaf7b;
  border-left: 4px solid #ffaf7b;
}

.nav-icon {
  font-size: 1.5rem;
  min-width: 30px;
  text-align: center;
}

.nav-text {
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

.sidebar.collapsed .nav-text {
  display: none;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.user-icon {
  font-size: 2rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 2px;
}

.user-role {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: capitalize;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background: rgba(255, 82, 82, 0.2);
  border: 1px solid rgba(255, 82, 82, 0.3);
  color: #ff5252;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(255, 82, 82, 0.3);
  transform: translateY(-2px);
}

.logout-icon {
  font-size: 1.2rem;
}

/* Main Content Styles */
.main-container {
  flex: 1;
  margin-left: 280px;
  transition: margin-left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.main-container.expanded {
  margin-left: 80px;
}

.top-header {
  background: linear-gradient(90deg, #0f2027, #203a43, #2c5364);
  color: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid #1b262c;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}


.page-title {
  font-size: 1.8rem;
  color: #ffffff;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.date {
  color: #dcdcdc;
  font-size: 0.95rem;
  text-transform: capitalize;
}

.content-area {
  flex: 1;
  padding: 0;
  overflow-y: auto;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 80px;
  }

  .sidebar .nav-text,
  .sidebar .logo-text,
  .sidebar .user-details {
    display: none;
  }

  .main-container {
    margin-left: 80px;
  }

  .top-header {
    padding: 15px 20px;
  }

  .page-title {
    font-size: 1.4rem;
  }
}
</style>