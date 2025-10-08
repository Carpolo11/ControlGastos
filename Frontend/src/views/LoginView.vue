<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>💰 FinTrack</h1>
        <p>Control de Gastos Familiares</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <h2>Iniciar Sesión</h2>
        
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            type="password"
            id="password"
            v-model="form.password"
            placeholder="••••••••"
            required
          />
        </div>

        <div v-if="error" class="alert alert-error">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Iniciando...' : 'Iniciar Sesión' }}
        </button>

        <div class="auth-footer">
          <p>¿No tienes cuenta? <router-link to="/register">Regístrate aquí</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginView',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      loading: false,
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = '';

      try {
        // Aquí irá la llamada al backend
        // const response = await fetch('/api/auth/login', {...})
        
        // Simulación temporal
        setTimeout(() => {
          if (this.form.email && this.form.password) {
            localStorage.setItem('token', 'temp_token_' + Date.now());
            localStorage.setItem('user', JSON.stringify({
              id: 1,
              name: 'Usuario Demo',
              email: this.form.email
            }));
            this.$router.push('/dashboard');
          } else {
            this.error = 'Credenciales inválidas';
          }
          this.loading = false;
        }, 1000);
        
      } catch (err) {
        this.error = 'Error al iniciar sesión. Intenta nuevamente.';
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  width: 100%;
  max-width: 450px;
  overflow: hidden;
}

.auth-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
}

.auth-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.auth-header p {
  margin: 0;
  opacity: 0.9;
}

.auth-form {
  padding: 2rem;
}

.auth-form h2 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #374151;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.alert {
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.alert-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.btn {
  width: 100%;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #6b7280;
}

.auth-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>