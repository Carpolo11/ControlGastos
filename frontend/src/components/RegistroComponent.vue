```vue
<template>
  <div class="register-wrapper">

    <!-- PANEL IZQUIERDO -->
    <section class="brand-panel">
      <div class="brand-content">
        <span class="brand-label">GRC IA · GESTIÓN INTELIGENTE</span>

        <h1>
          Protege tu empresa.
          Gestiona tus riesgos con Inteligencia Artificial.
        </h1>

        <p class="brand-description">
          Crea tu cuenta corporativa y comienza a identificar activos
          tecnológicos, evaluar amenazas y fortalecer la seguridad
          de tu organización.
        </p>
      </div>

      <div class="ai-message">
        <div class="ai-title">
          <span class="sparkle">✦</span>
          CLARA IA SECURITY ANALYST
        </div>

        <p>
          "Un paso más cerca de una gestión de riesgos de
          ciberseguridad sencilla, inteligente y efectiva."
        </p>
      </div>

      <footer class="brand-footer">
        © 2026 GRC IA. Todos los derechos reservados.
      </footer>
    </section>

    <!-- PANEL DERECHO -->
    <section class="form-panel">
      <div class="register-card">

        <header class="form-header">
          <h2>Crear cuenta</h2>
          <p>
            Registra tus datos para acceder al espacio corporativo
          </p>
        </header>

        <form @submit.prevent="register">

          <!-- NOMBRE -->
          <div class="form-group">
            <label for="name">Nombre completo</label>
            <input
              id="name"
              v-model="name"
              type="text"
              placeholder="Ingresa tu nombre completo"
              autocomplete="name"
              required
            />
          </div>

          <!-- IDENTIFICACIÓN -->
          <div class="form-group">
            <label for="identificacion">Número de identificación</label>
            <input
              id="identificacion"
              v-model="identificacion"
              type="number"
              placeholder="Ingresa tu identificación"
              required
            />
          </div>

          <!-- EMPRESA NOMBRE -->
          <div class="form-group">
            <label for="name">Nombre de la empresa</label>
            <input
              id="name"
              v-model="Nom_Empresa"
              type="text"
              placeholder="Ingresa el nombre de la empresa"
              required
            />
          </div>

          <!-- CORREO -->
          <div class="form-group">
            <label for="email">Correo electrónico corporativo o de contacto</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="ejemplo@empresa.com"
              autocomplete="email"
              required
            />
          </div>

          <!-- CONTRASEÑA -->
          <div class="form-group">
            <label for="password">Contraseña</label>

            <div class="password-input">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Crea una contraseña"
                autocomplete="new-password"
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

          <!-- CONFIRMAR CONTRASEÑA -->
          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>

            <div class="password-input">
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Repite tu contraseña"
                autocomplete="new-password"
                required
              />

              <button
                type="button"
                class="show-password"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                {{ showConfirmPassword ? 'Ocultar' : 'Mostrar' }}
              </button>
            </div>
          </div>

          <!-- REGISTRAR -->
          <button type="submit" class="register-btn">
            Crear cuenta
          </button>

        </form>

        <!-- VOLVER AL LOGIN -->
        <div class="login-section">
          <p>¿Ya tienes una cuenta?</p>

          <button
            type="button"
            class="login-redirect-btn"
            @click="goToLogin"
          >
            Iniciar sesión
          </button>
        </div>

      </div>
    </section>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const identificacion = ref("");
const Nom_Empresa = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const register = async () => {
  if (
    !name.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value ||
    !identificacion.value ||
    !Nom_Empresa.value
  ) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:4000/usuarios",
      {
        identificacion: identificacion.value,
        nombre: name.value,
        email: email.value,
        password_hash: password.value,
        nombre_empresa: Nom_Empresa.value
      }
    );

    console.log("Usuario registrado:", response.data);

    alert(`Cuenta creada para: ${name.value}`);
    router.push("/login");

  } catch (error) {
    console.error("Error al registrar usuario:", error);

    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error al registrar usuario");
    }
  }
};

const goToLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.register-wrapper {
  display: grid;
  grid-template-columns: 44% 56%;
  width: 100%;
  min-height: 100vh;
  color: #19262b;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

/* PANEL IZQUIERDO */

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100vh;
  padding: 95px 10.5%;
  background: #102629;
  color: #fff;
}

.brand-label {
  display: inline-block;
  margin-bottom: 22px;
  color: #36a99a;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 1.2px;
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
  line-height: 1.6;
}

.ai-message {
  width: 100%;
  max-width: 520px;
  margin-top: 95px;
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
  padding-bottom: 8px;
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
  padding: 35px;
  background: #f3f5f7;
}

.register-card {
  width: 100%;
  max-width: 480px;
  padding: 35px 43px;
  border: 1px solid #dbe2e6;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 8px 25px rgba(22, 42, 48, 0.045);
}

.form-header {
  margin-bottom: 25px;
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
  line-height: 1.45;
}

/* CAMPOS */

.form-group {
  margin-bottom: 17px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #202a2e;
  font-size: 13px;
  font-weight: 650;
}

.form-group input,
.form-group select {
  display: block;
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #d7e0e5;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #25343a;
  font-size: 13px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #89969c;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #16776d;
  box-shadow: 0 0 0 3px rgba(22, 119, 109, 0.1);
}

.form-group select {
  cursor: pointer;
}

/* MOSTRAR CONTRASEÑA */

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

/* BOTÓN DE REGISTRO */

.register-btn {
  width: 100%;
  min-height: 46px;
  margin-top: 5px;
  border: none;
  border-radius: 8px;
  background: #176e65;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.register-btn:hover {
  background: #11584f;
}

/* REDIRECCIÓN AL LOGIN */

.login-section {
  margin-top: 25px;
  text-align: center;
}

.login-section p {
  margin: 0 0 10px;
  color: #74838a;
  font-size: 13px;
}

.login-redirect-btn {
  width: 100%;
  min-height: 44px;
  border: 1px solid #16776d;
  border-radius: 8px;
  background: #fff;
  color: #16776d;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.login-redirect-btn:hover {
  background: #edf7f5;
}

/* RESPONSIVE */

@media (max-width: 1000px) {
  .register-wrapper {
    grid-template-columns: 40% 60%;
  }

  .brand-panel {
    padding: 65px 8%;
  }

  .brand-content h1 {
    font-size: 29px;
  }

  .ai-message {
    margin-top: 60px;
  }

  .form-panel {
    padding: 25px;
  }

  .register-card {
    padding: 30px 25px;
  }
}

@media (max-width: 700px) {
  .register-wrapper {
    display: flex;
    flex-direction: column;
  }

  .brand-panel {
    min-height: auto;
    padding: 40px 25px 25px;
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
    margin-top: 25px;
    padding: 0;
    font-size: 11px;
  }

  .form-panel {
    min-height: auto;
    padding: 30px 18px;
  }

  .register-card {
    max-width: 480px;
    padding: 28px 23px;
  }
}
</style>
```