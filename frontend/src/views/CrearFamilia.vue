<template>

  <div class="Familia">
    <div class="login-container">

        <h2>🏠 CREA UNA FAMILIA</h2>

      <form @submit.prevent="Crear">
        <div class="input-group">
          <span class="icon-placeholder">👤</span>
          <input
            v-model="nombre_familia"
            type="text"
            placeholder="Nombre de la familia"
            required
          />
        </div>

        <div class="input-group">
          <span class="calendar-number-outline">📅</span>
          <input
            v-model="fecha_creacion"
            type="date"
            placeholder="Fecha de creación"
            required
          />
        </div>

        <button type="submit" class="login-btn">
          CREAR FAMILIA
        </button>

      </form>

    </div>
  </div>


</template>



<script setup>

import { ref } from "vue";
import axios from "axios";



const nombre_familia = ref("");
const fecha_creacion = ref("");

const Crear =  async () => {
  if (!nombre_familia.value || !fecha_creacion.value) {
    alert("⚠️ Por favor completa todos los campos.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4000/familia", {
      nombre_familia: nombre_familia.value,
      fecha_creacion: fecha_creacion.value,
    });

    

    console.log("✅ Familia Creada:", response.data);
    alert(`🏠 Familia creada: "${nombre_familia.value}"\n📅 Fecha: ${fecha_creacion.value}`);
    router.push("/familia");

    nombre_familia.value = "";
    fecha_creacion.value = "";

  } catch (error) {
    console.error("❌ Error al crear familia:", error);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error al registrar la familia.");
    }
  }
  

};


</script>

<style>

.Familia {
  height: 100vh;
  background: linear-gradient(135deg, #74b9ff, #a29bfe);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
}

.login-container {
  background: #fff;
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 350px;
}

.avatar img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 3px solid #74b9ff;
}

h2 {
  color: #2d3436;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  background: #f1f2f6;
  border-radius: 10px;
  padding: 0.6rem 1rem;
}

.icon-placeholder {
  margin-right: 10px;
  font-size: 1.3rem;
}

.calendar-number-outline {
  margin-right: 10px;
  font-size: 1.3rem;
}

.input-group input {
  border: none;
  outline: none;
  background: transparent;
  flex: 1;
  font-size: 1rem;
  color: #2d3436;
}

.input-group input::placeholder {
  color: #636e72;
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background: #0984e3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.login-btn:hover {
  background: #74b9ff;
  transform: translateY(-2px);
}

</style>