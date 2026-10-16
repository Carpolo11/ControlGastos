```vue
<template>
  <div class="login-wrapper">

    <!-- PANEL IZQUIERDO -->
    <section class="brand-panel">
      <div class="brand-content">
        <h1>
          La gestión de riesgos de ciberseguridad,
          simplificada con Inteligencia Artificial.
        </h1>

        <p class="brand-description">
          Diseñado exclusivamente para que las pequeñas y medianas
          empresas identifiquen activos, cumplan normativas y
          respondan a amenazas sin complicaciones.
        </p>
      </div>

      <div class="ai-message">
        <div class="ai-title">
          <span class="sparkle">✦</span>
          CLARA IA SECURITY ANALYST
        </div>

        <p>
          "He analizado tu infraestructura de red. Tienes 3 puertos
          expuestos críticamente en la base de datos."
        </p>
      </div>

      <footer class="brand-footer">
        © 2026 GRC IA. Todos los derechos reservados.
      </footer>
    </section>

    <!-- PANEL DERECHO -->
    <section class="form-panel">
      <div class="login-card">

        <header class="form-header">
          <h2>Iniciar sesión</h2>
          <p>
            Introduce tus credenciales para acceder al espacio
            corporativo
          </p>
        </header>

        <form @submit.prevent="login">

          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="ejemplo@empresa.com"
              autocomplete="username"
              required
            />
          </div>

          <div class="form-group">
            <div class="password-label">
              <label for="password">Contraseña</label>
              <button
                type="button"
                class="forgot-password"
                @click="alert('Contacta al administrador para recuperar tu contraseña.')"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <div class="password-input">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingresa tu contraseña"
                autocomplete="current-password"
                required
              />

              <button
                type="button"
                class="show-password"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <button type="submit" class="login-btn">
            Ingresar al sistema
          </button>

        </form>

        <div class="register-section">
          <p>¿Tu empresa aún no cuenta con acceso?</p>

          <button
            type="button"
            class="register-btn"
            @click="goToLogin"
          >
            Registrarse
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";


const router = useRouter();

const login = () => {
  router.push("/inventario");
};

const goToLogin = () => {
  router.push("/register");
};




</script>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

body {
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  color: #19262b;
}

button,
input {
  font: inherit;
}

.login-wrapper {
  display: grid;
  grid-template-columns: 44% 56%;
  width: 100%;
  min-height: 100vh;
}

/* PANEL IZQUIERDO */

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 96px 10.5%;
  background: #102629;
  color: #fff;
}

.brand-content h1 {
  max-width: 540px;
  margin: 0;
  font-size: clamp(28px, 2.65vw, 38px);
  line-height: 1.2;
  font-weight: 750;
  letter-spacing: -0.7px;
}

.brand-description {
  max-width: 510px;
  margin-top: 25px;
  color: #a7b5b8;
  font-size: 16px;
  line-height: 1.55;
}

.ai-message {
  width: 100%;
  max-width: 520px;
  margin-top: 135px;
  padding: 23px;
  border: 1px solid #b7c5c5;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.045);
}

.ai-title {
  margin-bottom: 10px;
  color: #168b7c;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.3px;
}

.sparkle {
  margin-right: 5px;
  font-size: 19px;
}

.ai-message p {
  margin: 0;
  color: #edf2f2;
  font-size: 13px;
  line-height: 1.5;
}

.brand-footer {
  position: absolute;
  right: 10.5%;
  bottom: 0;
  left: 10.5%;
  padding-bottom: 0;
  color: #91a3a5;
  font-size: 12px;
}

/* PANEL DERECHO */

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 100vh;
  padding: 55px 35px;
  background: #f3f5f7;
}

.login-card {
  width: 100%;
  max-width: 480px;
  padding: 45px 47px;
  border: 1px solid #dbe2e6;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 8px 25px rgba(22, 42, 48, 0.045);
}

.form-header {
  margin-bottom: 31px;
}

.form-header h2 {
  margin: 0 0 8px;
  color: #202a2e;
  font-size: 25px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.form-header p {
  margin: 0;
  color: #718087;
  font-size: 14px;
  line-height: 1.4;
}

.form-group {
  margin-bottom: 21px;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  color: #202a2e;
  font-size: 13px;
  font-weight: 650;
}

.form-group input {
  display: block;
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #d7e0e5;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #25343a;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #89969c;
}

.form-group input:focus {
  border-color: #16776d;
  box-shadow: 0 0 0 3px rgba(22, 119, 109, 0.1);
}

.password-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 9px;
}

.password-label label {
  margin-bottom: 0;
}

.forgot-password {
  padding: 0;
  border: none;
  background: transparent;
  color: #08796e;
  font-size: 12px;
  cursor: pointer;
}

.password-input {
  position: relative;
}

.password-input input {
  padding-right: 75px;
}

.show-password {
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  padding: 4px 0;
  border: none;
  background: transparent;
  color: #617179;
  font-size: 12px;
  cursor: pointer;
}

.login-btn {
  width: 100%;
  min-height: 46px;
  margin-top: 11px;
  border: none;
  border-radius: 8px;
  background: #176e65;
  color: #16776d;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #11584f;
}

.register-section {
  margin-top: 33px;
  text-align: center;
}

.register-section p {
  margin: 0 0 9px;
  color: #74838a;
  font-size: 13px;
}

.register-btn {
  width: 100%;
  min-height: 45px;
  border: 1px solid #16776d;
  border-radius: 8px;
  background: #fff;
  color: #16776d;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.register-btn:hover {
  background: #edf7f5;
}

/* DISEÑO RESPONSIVE */

@media (max-width: 900px) {
  .login-wrapper {
    grid-template-columns: 40% 60%;
  }

  .brand-panel {
    padding: 65px 8%;
  }

  .brand-content h1 {
    font-size: 29px;
  }

  .ai-message {
    margin-top: 80px;
  }

  .login-card {
    padding: 35px 28px;
  }
}

@media (max-width: 650px) {
  .login-wrapper {
    display: flex;
    flex-direction: column;
  }

  .brand-panel {
    min-height: auto;
    padding: 45px 25px 30px;
  }

  .brand-content h1 {
    font-size: 30px;
  }

  .brand-description {
    margin-top: 17px;
    font-size: 14px;
  }

  .ai-message {
    margin-top: 25px;
    padding: 17px;
  }

  .brand-footer {
    position: static;
    margin-top: 30px;
    padding: 0;
    font-size: 11px;
  }

  .form-panel {
    min-height: auto;
    padding: 35px 20px;
  }

  .login-card {
    max-width: 480px;
    padding: 30px 24px;
  }
}
</style>
```