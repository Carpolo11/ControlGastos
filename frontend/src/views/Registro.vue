<template>
  <div class="register-wrapper">
    <div class="register-container">
        <!-- <div class="avatar">
            <img src="../assets/registro.png" alt="Avatar"></img>
        </div> -->

      <form @submit.prevent="register">
        <div class="input-group">
          <span class="icon-placeholder">👤</span>
          <input
            v-model="name"
            type="text"
            placeholder="Full Name"
            required
          />
        </div>

        <div class="input-group">
            <span class="icon-placeholder">👤</span>
            <input v-model="identificacion" type="number" placeholder="Identificacion" required></input>
        </div>

        <div class="input-group">
          <select v-model="rol" required>
            <option value="" disabled>Seleccionar Rol</option>
            <option value="Administrador">Administrador</option>
          </select>
        </div>

        <div class="input-group">
          <span class="icon-placeholder">📧</span>
          <input
            v-model="email"
            type="email"
            placeholder="Email"
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

        <div class="input-group">
          <span class="icon-placeholder">🔒</span>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
          />
        </div>

        <button type="submit" class="register-btn">
          Register Now
        </button>
      </form>

      <p class="redirect">
        Already have an account?
        <button class="login-redirect-btn" @click.prevent="goToLogin">
          Login here
        </button>
      </p>
    </div>
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
const rol = ref("");


const register = async () => {
  if (!name.value || !email.value || !password.value || !confirmPassword.value || !identificacion.value) {
    alert("Por favor completa todos los campos");
    return;
  }

  if (password.value !== confirmPassword.value) {
    alert("Las contraseñas no coinciden");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4000/usuarios", {
      identificacion: identificacion.value,
      nombre: name.value,
      email: email.value,
      password_hash: password.value, // puedes encriptar después
      rol: rol.value
    });

    console.log("✅ Usuario registrado:", response.data);
    alert(`Cuenta creada para: ${name.value}`);
    router.push("/login");
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error);
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
/* Estilos globales para el layout (simulan ion-page/ion-content con fondo) */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

/* 🟦 Fondo degradado y centrado (simula register-bg) */
.register-wrapper {
  width: 100%;
  height: 100vh; /* ocupa toda la ventana del navegador */
  display: flex;
  align-items: center;
  justify-content: center;
  /* Replicando el --background de Ionic */
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  background-attachment: fixed;
}

/* 🟩 Caja del registro */
.register-container {
  width: 350px;
  padding: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  text-align: center;
  color: black;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
  height: 500px;
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
}

/* 🟧 Inputs (Simula ion-item) */
.input-group {
  display: flex;
  align-items: center;
  border-radius: 25px;
  margin-bottom: 15px;
  padding: 10px 10px;
  border: 1px solid black; /* Simula --border-color */
}

/* Quitar las flechas de los inputs numéricos */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Estilos para el span de reemplazo del ícono (Simula ion-icon) */
.icon-placeholder {
  color: #0072ff;
  margin-right: 10px;
  font-size: 20px;
}

/* Estilos para el input nativo (Simula ion-input) */
.input-group input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  padding: 0;
  color: white;
}

/* 🟥 Botón registro (Simula ion-button) */
.register-btn {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white; /* Simula --color */
  font-weight: bold;
  border: none;
  border-radius: 25px;
  width: 100%;
  padding: 12px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.register-btn:hover {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
}

/* 🟪 Redirección (Volver a Login) */
.redirect {
  margin-top: 20px;
  font-size: 14px;
  color: #000;
}

/* Estilo para el botón de "Login here" (Simula ion-button fill="outline" size="small") */
.login-redirect-btn {
    background: transparent;
    border: 1px solid black;
    color: white;
    padding: 5px 10px;
    border-radius: 25px;
    font-size: 12px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 5px;
    transition: background-color 0.3s, color 0.3s;
}

.login-redirect-btn:hover {
    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
    color: white;
}
</style>