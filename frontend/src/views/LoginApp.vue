<template>
  <div class="login-wrapper">
    <div class="login-container">

        <div class="avatar">
            <img src="../assets/avatar1.png" alt="Avatar"></img>
        </div>


      <form @submit.prevent="login">
        <div class="input-group">
          <span class="icon-placeholder">👤</span>
          <input
            v-model="email"
            type="text"
            placeholder="Username"
            required
          />
        </div>

        <div class="input-group">
          <span class="icon-placeholder">🔒</span>
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit" class="login-btn">
          INICIAR SESION
        </button>

        <div class="options">
          <input type="checkbox" id="rememberMe" v-model="rememberMe" />
          <label for="rememberMe">Remember me</label>
          <a href="#">Forgot password?</a>
        </div>
      </form>

      <p class="redirect">
        Not a member?
        <button class="create-account-btn" @click.prevent="goToRegister">
          Create account
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router"; // ✅ Importa el router

const router = useRouter(); // ✅ Instancia de router

const email = ref("");
const password = ref("");
const rememberMe = ref(false);

const login = () => {
  if (email.value && password.value) {
    alert(`Bienvenido: ${email.value}`);
    // 👇 Redirige a otra vista, por ejemplo al "home" o "dashboard"
    router.push("/familia"); // Cambia "/home" por la ruta que tengas
  } else {
    alert("Por favor ingresa todos los campos");
  }
};

const goToRegister = () => {
  router.push("/register"); // ✅ Redirige al registro
};
</script>

<style>
/* 🟦 Fondo degradado y centrado */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* El login-wrapper ahora contendrá todo el layout */
.login-wrapper {
  width: 100%;
  height: 100vh; /* ocupa toda la ventana del navegador */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, #00c6ff, #0072ff, #7a00ff);
  background-attachment: fixed;
}

/* 🟩 Caja del login */
.login-container {
  width: 350px;
  padding: 30px;
  border-radius: 12px;
  background: white;
  text-align: center;
  color: black;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
}

/* 🖼️ Avatar */
.avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.avatar img {
  width: 120px; /* Reducido un poco para que se vea más como un logo */
  height: 120px;
  border-radius: 50%; /* Cambiado a circular para darle un toque diferente */
  object-fit: cover;
  border: 3px solid #0072ff;
}

/* 🟧 Inputs */
.input-group {
  display: flex;
  align-items: center;
  background: #f5f5f5;
  border-radius: 25px;
  margin-bottom: 15px;
  padding: 10px 15px;
  border: 1px solid #0072ff;
}

/* Estilos para el span de reemplazo del ícono */
.icon-placeholder {
    color: #0072ff;
    margin-right: 10px;
    font-size: 20px; /* Ajusta el tamaño del emoji para que parezca un ícono */
}

/* Estilos para el input nativo */
.input-group input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  padding: 0; /* Asegurar que no haya padding extra */
}

/* Avatar */
.avatar img {
  width: 180px;
  height: 180px;
  margin-bottom: 15px;
  border-radius: 50%;
}

/* 🟥 Botón login */
.login-btn {
  background: #ffb703;
  color: black;
  font-weight: bold;
  border: none;
  border-radius: 25px;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px; /* Espacio superior */
}

.login-btn:hover {
  background: #ff9800;
}

/* 🟫 Opciones (Remember me, Forgot password) */
.options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    font-size: 14px;
}

.options label {
    margin-right: auto; /* Empuja el enlace de "Forgot password" a la derecha */
    margin-left: 5px; /* Espacio entre el checkbox y el texto */
    color: #000;
}

.options a {
    color: #0072ff;
    text-decoration: none;
}

/* 🩵 Texto de error */
.error-text {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}

/* 🟪 Redirección (crear cuenta) */
.redirect {
  margin-top: 20px;
  font-size: 14px;
  color: #000;
}

.redirect a {
  color: #0072ff;
  text-decoration: none;
  font-weight: bold;
}

.redirect a:hover {
  text-decoration: underline;
}

/* Estilo para el botón de "Crear cuenta" que reemplaza a ion-button */
.create-account-btn {
    background: transparent;
    border: 1px solid #0072ff; /* fill="outline" */
    color: #0072ff;
    padding: 5px 10px;
    border-radius: 20px;
    font-size: 12px; /* size="small" */
    font-weight: bold;
    cursor: pointer;
    margin-left: 5px;
    transition: background-color 0.3s, color 0.3s;
}

.create-account-btn:hover {
    background: #0072ff;
    color: white;
}

</style>








