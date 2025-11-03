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

       <!-- Mostrar botón según el rol -->
        <button  type="submit" class="btn">
          CREAR FAMILIA
        </button>

        <!-- <button  type="button" class="btn" disabled>
          No tienes permiso para crear familias
        </button> -->

      </form>

        <button class="login-btn" @click="volver" >
            VOLVER
        </button>

    </div>
  </div>


</template>



<script setup>

import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const volver = () => {
  router.push("/dashboard");
};


const nombre_familia = ref("");
const fecha_creacion = ref("");
const family = ref([]);

const token = localStorage.getItem("token");




onMounted(async () => {
  try {

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.rol) {
        traerRol.value = usuario.rol;
    }
    const response = await axios.get("http://localhost:4000/familia");
    family.value = response.data; // axios ya parsea el JSON automáticamente
  } catch (error) {
    console.error("Error al cargar las familias:", error);
  }
});

const Crear =  async () => {
  if (!nombre_familia.value || !fecha_creacion.value) {
    alert("⚠️ Por favor completa todos los campos.");
    return;
  }

  try {
    // ✅ Enviar el token en los headers
    const response = await axios.post("http://localhost:4000/familia",{
        nombre_familia: nombre_familia.value,
        fecha_creacion: fecha_creacion.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Familia Creada:", response.data);
    alert(`🏠 Familia creada: "${nombre_familia.value}"\n📅 Fecha: ${fecha_creacion.value}`);
    
    
    nombre_familia.value = "";
    fecha_creacion.value = "";

    router.push("/familia");



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
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
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


h2 {
  color: white;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.input-group {
  width: 100%;
  padding: 0.75rem;
  border-radius: 50px;     /* 🔹 Bordes redondeados (opcional) */
  outline: none;           /* 🔹 Quita el borde azul del foco */
  font-size: 1rem;
  border: none;
  background: white;
  flex: 1;
  font-size: 1rem;
  color: black;
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