<template>

  <div class="Categoria">
    <div class="login-container">

        <h2>➕ CREA TUS CATEGORIAS</h2>

      <form @submit.prevent="Crear">
        <div class="input-group">
          <span class="icon-placeholder">👤</span>
          <input v-model="nombre" type="text" placeholder="Nombre de la categoria" required />
        </div>

        <div class="input-group">
            <select v-model="tipo" required>
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
            </select>

        </div>


        <div class="input-group">
          <input v-model="id_familia" type="number" placeholder="ID de la familia" required />
        </div>

        <button type="submit" class="login-btn">
          CREAR CATEGORIA
        </button>

      </form>

        <button class="login-btn" @click="volver" >
            VOLVER
        </button>

    </div>
  </div>


</template>



<script setup>

import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();


const nombre = ref("");
const tipo = ref("");
const id_familia = ref("");

const volver = () => {
  router.push("/login");
};

const Crear =  async () => {
  if (!nombre.value || !tipo.value || !id_familia.value) {
    alert("⚠️ Por favor completa todos los campos.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4000/categoria", {
      nombre: nombre.value,
      tipo: tipo.value,
      id_familia: id_familia.value
    });


    alert(`🏠 Categoria creada: "${nombre.value}"\n Tipo: ${tipo.value}`);
    console.log("Categoria creada:", response.data);

    nombre.value = "";
    tipo.value = "";
    id_familia.value = 0;

    router.push("/categorias");

  } catch (error) {
    console.error("❌ Error al crear Categoria:", error);
  }
  

};


</script>

<style>

.Categoria {
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


