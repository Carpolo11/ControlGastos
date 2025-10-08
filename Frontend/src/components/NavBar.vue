<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-brand">
        <h1>💰 FinTrack</h1>
        <span v-if="currentFamily" class="family-badge">{{ currentFamily.name }}</span>
      </div>
      
      <div class="navbar-menu">
        <router-link to="/dashboard" class="nav-item" active-class="active">
          <i class="icon">📊</i> Dashboard
        </router-link>
        <router-link to="/transactions" class="nav-item" active-class="active">
          <i class="icon">💳</i> Transacciones
        </router-link>
        <router-link to="/categories" class="nav-item" active-class="active">
          <i class="icon">🏷️</i> Categorías
        </router-link>
        <router-link to="/reports" class="nav-item" active-class="active">
          <i class="icon">📈</i> Reportes
        </router-link>
        <router-link to="/family" class="nav-item" active-class="active">
          <i class="icon">👨‍👩‍👧‍👦</i> Familia
        </router-link>
      </div>

      <div class="navbar-user">
        <span class="user-name">{{ userName }}</span>
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      userName: '',
      currentFamily: null
    };
  },
  mounted() {
    this.loadUserData();
  },
  methods: {
    loadUserData() {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      this.userName = user.name || 'Usuario';
      this.currentFamily = JSON.parse(localStorage.getItem('currentFamily') || 'null');
    },
    logout() {
      localStorage.clear();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbar-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.family-badge {
  background: rgba(255,255,255,0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
}

.navbar-menu {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
}

.nav-item.active {
  background: rgba(255,255,255,0.2);
  font-weight: 600;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.btn-logout {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-logout:hover {
  background: rgba(255,255,255,0.3);
}
</style>