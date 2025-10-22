<template>
  <div class="Miembro">
    <div class="form-container">
      <h2>👥 Agregar Miembro a la Familia</h2>

      <form @submit.prevent="crearMiembro">
        <div class="input-group">
          <input v-model="nombre" type="text" placeholder="Nombre del miembro" required />
        </div>

        <div class="input-group">
          <input v-model="apellido" type="text" placeholder="Apellido del miembro" required />
        </div>

        <div class="input-group">
          <input v-model="identificacion" type="text" placeholder="Identificacion" required />
        </div>

        <div class="input-group">
          <select v-model="rol" required>
            <option value="">Seleccionar Rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Miembro">Miembro</option>
          </select>
        </div>

        <div class="input-group">
          <input
            v-model="id_familia"
            type="number"
            placeholder="ID de la familia"
            required
          />
        </div>

        <button type="submit" class="btn">Agregar Miembro</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const nombre = ref("");
const apellido = ref("");
const rol = ref("");
const id_familia = ref("");
const identificacion = ref("");


const crearMiembro = async () => {
  if (!nombre.value || !apellido.value || !identificacion.value || !rol.value || !id_familia.value) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:4000/miembro_familia", {
      nombre: nombre.value,
      apellido: apellido.value,
      identificacion: identificacion.value,
      rol: rol.value,
      id_familia: id_familia.value,
    });

    alert(`✅ Miembro "${nombre.value}" agregado a la familia #${id_familia.value}`);
    console.log("Miembro creado:", response.data);

    nombre.value = "";
    apellido.value = "";
    identificacion.value = "";
    rol.value = "";
    id_familia.value = "";
  } catch (error) {
    console.error("❌ Error al crear miembro:", error);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error al registrar el miembro.");
    }
  }
};
</script>

<style>
.Miembro {
  height: 100vh;
  background: linear-gradient(135deg, #a29bfe, #74b9ff);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
}

.form-container {
  background: #fff;
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 380px;
}

h2 {
  color: #2d3436;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.input-group {
  margin-bottom: 1rem;
}

input,
select {
  width: 100%;
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid #dcdde1;
  font-size: 1rem;
}

.btn {
  width: 100%;
  padding: 0.8rem;
  background: #0984e3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn:hover {
  background: #74b9ff;
}

/* Quitar flechas en Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
