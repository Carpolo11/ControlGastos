```vue
<template>
  <div class="layout-wrapper">

    <!-- PANEL LATERAL -->
    <aside class="sidebar" :class="{ collapsed: sidebarCollapsed }">

      <div class="sidebar-header">
        <div class="logo">
          <span class="logo-icon">✦</span>

          <span v-if="!sidebarCollapsed" class="logo-text">
            GRC IA
          </span>
        </div>

        <button class="toggle-btn" @click="toggleSidebar" type="button"
          :aria-label="sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'">
          {{ sidebarCollapsed ? "→" : "←" }}
        </button>
      </div>

      <div v-if="!sidebarCollapsed" class="sidebar-caption">
        GESTIÓN INTELIGENTE
      </div>

      <!-- NAVEGACIÓN -->
      <nav class="sidebar-nav">

        <router-link to="/dashboard" class="nav-item">
          <span class="nav-icon">⌂</span>
          <span v-if="!sidebarCollapsed" class="nav-text">
            Panel principal
          </span>
        </router-link>

        <router-link to="/inventario" class="nav-item">
          <span class="nav-icon">▤</span>
          <span v-if="!sidebarCollapsed" class="nav-text">
            Inventario de activos
          </span>
        </router-link>

        <router-link to="/riesgos" class="nav-item">
          <span class="nav-icon">⚠</span>
          <span v-if="!sidebarCollapsed" class="nav-text">
            Gestión de riesgos
          </span>
        </router-link>

        <router-link to="/recomendaciones" class="nav-item">
          <span class="nav-icon">✦</span>
          <span v-if="!sidebarCollapsed" class="nav-text">
            Recomendaciones IA
          </span>
        </router-link>


        <router-link to="/alertas" class="nav-item">
          <span class="nav-icon">🔔</span>
          <span v-if="!sidebarCollapsed" class="nav-text">
            Alertas
          </span>
        </router-link>

        <router-link to="/controles" class="nav-item">
          <span class="nav-icon">◈</span>
          <span v-if="!sidebarCollapsed" class="nav-text">
            Controles de seguridad
          </span>
        </router-link>

        <router-link to="/reportes" class="nav-item">
          <span class="nav-icon">▥</span>
          <span v-if="!sidebarCollapsed" class="nav-text">
            Reportes
          </span>
        </router-link>

      </nav>

      <!-- INFORMACIÓN DEL USUARIO -->
      <div class="sidebar-footer">

        <div class="user-info" v-if="usuario">
          <div class="user-avatar">
            {{ obtenerIniciales(usuario.nombre) }}
          </div>

          <div v-if="!sidebarCollapsed" class="user-details">
            <p class="user-name">
              {{ usuario.nombre }}
            </p>

            <p class="user-role">
              {{ usuario.rol }}
            </p>
          </div>
        </div>

        <button class="logout-btn" @click="cerrarSesion" type="button">
          <span class="logout-icon">↪</span>
          <span v-if="!sidebarCollapsed">Cerrar sesión</span>
        </button>

      </div>
    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <div class="main-container" :class="{ expanded: sidebarCollapsed }">

      <!-- ENCABEZADO -->
      <header class="top-header">

        <div class="header-left">
          <span class="header-indicator"></span>

          <div>
            <span class="header-label">GRC IA / ESPACIO DE TRABAJO</span>
            <h2 class="page-title">{{ pageTitle }}</h2>
          </div>
        </div>

        <div class="header-right">
          <div class="status-indicator">
            <span class="status-dot"></span>
            Sistema de gestión
          </div>

          <div class="date-container">
            <span class="date-icon">▦</span>
            <span class="date">{{ currentDate }}</span>
          </div>
        </div>

      </header>

      <!-- VISTA ACTUAL -->
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
    "/dashboard": "Panel principal",
    "/inventario": "Inventario de activos",
    "/riesgos": "Gestión de riesgos",
    "/controles": "Controles de seguridad",
    "/reportes": "Reportes de seguridad"
  };

  return titles[route.path] || "GRC IA";
});

const obtenerIniciales = (nombre) => {
  if (!nombre) return "U";

  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(palabra => palabra.charAt(0).toUpperCase())
    .join("");
};

const cerrarSesion = () => {
  if (confirm("¿Seguro que deseas cerrar sesión?")) {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    router.push("/login");
  }
};

onMounted(() => {
  try {
    usuario.value = JSON.parse(localStorage.getItem("usuario")) || null;
  } catch {
    usuario.value = null;
  }

  currentDate.value = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
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
  min-height: 100vh;
  background: #f4f6f7;
  color: #243238;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

/* PANEL LATERAL */

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  width: 270px;
  height: 100vh;
  overflow-x: hidden;
  background: #102629;
  color: #fff;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 78px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 88px;
  padding: 22px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 11px;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 39px;
  flex-shrink: 0;
  border-radius: 11px;
  background: #1b8175;
  color: #fff;
  font-size: 25px;
}

.logo-text {
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.6px;
  white-space: nowrap;
}

.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  color: #d7e8e5;
  font-size: 18px;
  cursor: pointer;
}

.toggle-btn:hover {
  background: #1b8175;
  color: #fff;
}

.sidebar-caption {
  padding: 25px 24px 12px;
  color: #6eaaa2;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

/* MENÚ */

.sidebar-nav {
  flex: 1;
  padding: 10px 12px;
  overflow-y: auto;
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 13px;
  min-height: 49px;
  margin-bottom: 7px;
  padding: 12px 14px;
  border-radius: 9px;
  color: #b5c7c8;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
}

.nav-item.router-link-active {
  background: rgba(38, 155, 139, 0.17);
  color: #5dd0bd;
}

.nav-item.router-link-active::before {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 0;
  width: 3px;
  border-radius: 5px;
  background: #36b6a4;
  content: "";
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  min-width: 26px;
  font-size: 21px;
}

.nav-text {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.sidebar.collapsed .sidebar-header {
  flex-direction: column;
  gap: 15px;
  padding: 18px 10px;
}

.sidebar.collapsed .logo {
  justify-content: center;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 13px 5px;
}

.sidebar.collapsed .sidebar-footer {
  padding: 12px 9px;
}

/* USUARIO */

.sidebar-footer {
  padding: 17px 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 11px;
  min-width: 0;
  margin-bottom: 14px;
  padding: 11px 8px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.035);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 10px;
  background: #d9f0eb;
  color: #176f65;
  font-size: 12px;
  font-weight: 800;
}

.user-details {
  min-width: 0;
}

.user-name {
  overflow: hidden;
  margin-bottom: 5px;
  color: #f3f7f7;
  font-size: 11px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role {
  overflow: hidden;
  color: #91aaa9;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 42px;
  padding: 10px;
  border: 1px solid rgba(239, 116, 116, 0.2);
  border-radius: 9px;
  background: rgba(239, 116, 116, 0.08);
  color: #f39b98;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(239, 116, 116, 0.17);
}

.logout-icon {
  font-size: 19px;
}

/* CONTENIDO */

.main-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 270px;
  transition: margin-left 0.3s ease;
}

.main-container.expanded {
  margin-left: 78px;
}

/* ENCABEZADO */

.top-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  min-height: 100px;
  padding: 20px 38px;
  border-bottom: 1px solid #e3e9e9;
  background: rgba(255, 255, 255, 0.97);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-indicator {
  width: 4px;
  height: 42px;
  border-radius: 5px;
  background: #218b7d;
}

.header-label {
  display: block;
  margin-bottom: 6px;
  color: #188477;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1px;
}

.page-title {
  color: #203337;
  font-size: 23px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #65777a;
  font-size: 10px;
  white-space: nowrap;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2aa58e;
  box-shadow: 0 0 0 4px #e4f5ef;
}

.date-container {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #728185;
}

.date-icon {
  color: #168477;
  font-size: 19px;
}

.date {
  font-size: 11px;
  text-transform: capitalize;
  white-space: nowrap;
}

/* VISTA DINÁMICA */

.content-area {
  flex: 1;
  min-width: 0;
  padding: 0;
  background: #f4f6f7;
}

/* PIE DE PÁGINA */

.main-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  padding: 18px 35px;
  border-top: 1px solid #e2e8e9;
  background: #fff;
  color: #89979a;
  font-size: 10px;
}

/* RESPONSIVE */

@media (max-width: 1000px) {
  .top-header {
    padding: 18px 24px;
  }

  .header-right {
    gap: 14px;
  }

  .status-indicator {
    display: none;
  }
}

@media (max-width: 700px) {
  .sidebar {
    width: 78px;
  }

  .sidebar .logo-text,
  .sidebar .sidebar-caption,
  .sidebar .nav-text,
  .sidebar .user-details,
  .sidebar .logout-btn span:last-child {
    display: none;
  }

  .sidebar .sidebar-header {
    flex-direction: column;
    gap: 15px;
    padding: 18px 10px;
  }

  .sidebar .nav-item {
    justify-content: center;
    padding: 13px 5px;
  }

  .sidebar .sidebar-footer {
    padding: 12px 9px;
  }

  .sidebar .user-info {
    justify-content: center;
    padding: 8px 2px;
  }

  .sidebar .logout-btn {
    padding: 10px 4px;
  }

  .main-container {
    margin-left: 78px;
  }

  .top-header {
    align-items: flex-start;
    padding: 20px 15px;
  }

  .page-title {
    font-size: 17px;
  }

  .header-label {
    font-size: 8px;
  }

  .header-right {
    display: none;
  }

  .main-footer {
    align-items: flex-start;
    flex-direction: column;
    padding: 15px;
  }
}
</style>
```
