<template>
  <div class="login-container">
    <h2>➕ CREA TUS CATEGORIAS</h2>

    <form @submit.prevent="Crear">
      <div class="input-group">
        <span class="icon-placeholder">👤</span>
        <input v-model="nombre" type="text" placeholder="Nombre de la categoria" required />
      </div>

      <div class="input-group">
        <select v-model="id_familia" required>
          <option value="" disabled>¿A qué familia se la vas a asignar?</option>
          <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
            {{ familia.nombre_familia }}
          </option>
        </select>
      </div>

      <button type="submit" class="login-btn">CREAR CATEGORIA</button>
    </form>

    <button class="login-btn" @click="$emit('volver')">VOLVER</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const props = defineProps({
  familias: Array,
  token: String,
});

const emit = defineEmits(["categoriaCreada", "volver"]);

const nombre = ref("");
const id_familia = ref("");

const Crear = async () => {
  if (!nombre.value || !id_familia.value) {
    alert("⚠️ Por favor completa todos los campos.");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:4000/categoria",
      {
        nombre: nombre.value,
        id_familia: id_familia.value,
      },
      { headers: { Authorization: `Bearer ${props.token}` } }
    );

    alert(`🏠 Categoria creada: "${nombre.value}"`);
    emit("categoriaCreada", response.data);

    nombre.value = "";
    id_familia.value = "";
  } catch (error) {
    console.error("❌ Error al crear Categoria:", error);
    alert("❌ No se pudo crear la categoría.");
  }
};
</script>

<style scoped>
/* (puedes copiar el CSS del bloque .login-container de tu código original) */
</style>
