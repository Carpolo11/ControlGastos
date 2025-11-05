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
          <input v-model="identificacion" type="number" placeholder="Identificación" required />
        </div>

        <div class="input-group">
          <input v-model="email" type="email" placeholder="Correo del miembro" required />
        </div>

        <div class="input-group">
          <input v-model="password_hash" type="password" placeholder="Contraseña" required />
        </div>

        <div class="input-group">
          <select v-model="rol" required>
            <option value="" disabled>Seleccionar Rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Miembro">Miembro</option>
          </select>
        </div>

        <div class="input-group">
          <select v-model="id_familia" required>
            <option value="" disabled>Elige una familia</option>
            <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
              {{ familia.nombre_familia }}
            </option>
          </select>
        </div>

        <!-- Mostrar botón según el rol -->
        <button v-if="traerRol === 'Administrador'" type="submit" class="login-btn">
          AGREGAR MIEMBRO
        </button>

        <button 
          v-else 
          type="button" 
          class="btn" 
          disabled
        >
          No tienes permiso para agregar miembros
        </button>
      </form>

      <button class="login-btn" @click="volver">
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

// Campos del formulario
const nombre = ref("");
const apellido = ref("");
const rol = ref("");
const id_familia = ref("");
const identificacion = ref("");
const familias = ref([]);
const email = ref("");
const password_hash = ref("");
const traerRol = ref(""); // Rol del usuario logueado
const token = localStorage.getItem("token");


const volver = () => {
  router.push("/dashboard");
};




onMounted(async () => {
  try {
    // Obtener el usuario logueado desde localStorage
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (usuario && usuario.rol) {
      traerRol.value = usuario.rol;
    }

    // Cargar familias con token JWT
    const response = await axios.get("http://localhost:4000/familia", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    familias.value = response.data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    if (error.response?.status === 401) {
      alert("⚠️ Tu sesión ha expirado o no tienes autorización. Inicia sesión nuevamente.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
});

// 🔹 Crear un nuevo miembro
const crearMiembro = async () => {
  if (traerRol.value !== "Administrador") {
    alert("❌ No tienes permiso para agregar miembros.");
    return;
  }

  if (!nombre.value || !apellido.value || !identificacion.value || !rol.value || !id_familia.value || !email.value || !password_hash.value) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  try {
    // Crear miembro en la familia
    const miembroResponse = await axios.post("http://localhost:4000/miembro_familia", {
      nombre: nombre.value,
      apellido: apellido.value,
      identificacion: identificacion.value,
      rol: rol.value,
      id_familia: id_familia.value,
    },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
  
  );

    console.log("Miembro creado:", miembroResponse.data);

    // Crear usuario asociado
    const usuarioResponse = await axios.post("http://localhost:4000/usuarios", {
      identificacion: identificacion.value,
      nombre: `${nombre.value} ${apellido.value}`,
      email: email.value,
      password_hash: password_hash.value,
      rol: rol.value
    });

    console.log("Usuario creado:", usuarioResponse.data);
    alert(`✅ Miembro y usuario "${nombre.value}" creados correctamente.`);

    // Limpiar campos
    nombre.value = "";
    apellido.value = "";
    identificacion.value = "";
    rol.value = "";
    id_familia.value = "";
    email.value = "";
    password_hash.value = "";
    
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
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
}

.form-container {
  background:  rgb(102, 174, 179);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 380px;
}

.input-group {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid black; /* 🔹 Borde negro */
  border-radius: 50px;     /* 🔹 Bordes redondeados (opcional) */
  outline: none;           /* 🔹 Quita el borde azul del foco */
  font-size: 1rem;
  
  
}

input, ::placeholder{
  color: black;
}


input,
select {
  width: 100%;
  padding: 0.7rem;
  border-radius: 10px;
  border: 1px solid black;
  font-size: 1rem;

}


.btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}


/* Quitar flechas en Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
