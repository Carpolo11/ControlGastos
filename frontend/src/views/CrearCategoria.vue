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
                <option value="" disabled>Tipo</option>
                <option value="Ingreso">Ingreso</option>
                <option value="Egreso">Egreso</option>
            </select>

        </div>


        <div class="input-group">
          <select v-model="id_familia" required>
            <option value="" disabled>¿A qué familia se la vas a asignar?</option>
            <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
              {{ familia.nombre_familia }}
            </option>
          </select>

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

import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();


const nombre = ref("");
const tipo = ref("");
const id_familia = ref("");
const familias = ref([]);
const categorias = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:4000/familia");
    familias.value = response.data; // axios ya parsea el JSON automáticamente
  } catch (error) {
    console.error("Error al cargar las familias:", error);
  }
});

onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:4000/categoria");
    categorias.value = response.data; // axios ya parsea el JSON automáticamente
  } catch (error) {
    console.error("Error al cargar las categorias:", error);
  }
});

const volver = () => {
  router.push("/dashboard");
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
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  flex-direction: column;
}

.login-container {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
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
  border: 2px solid black; /* 🔹 Borde negro */
  border-radius: 50px;     /* 🔹 Bordes redondeados (opcional) */
  outline: none;           /* 🔹 Quita el borde azul del foco */
  font-size: 1rem;
  background: rgba(0.15, 0.15, 0.15, 0.15);
}

.input-group select{
  border: 2px solid black;
  background: transparent;

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
  
  flex: 1;
  font-size: 1rem;
  color: white;
}

.input-group input::placeholder {
  color: black;
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  transform: translateY(-2px);
}

</style>


