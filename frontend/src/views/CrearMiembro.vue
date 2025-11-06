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
          Agregar Miembro
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
        Volver
      </button>
    </div>

              <!-- 🔹 Contenedor de lista de miembros -->
      <div class="miembros-container">
        <h2>📋 LISTA DE MIEMBROS</h2>

        <div v-if="miembros.length === 0" class="no-data">
          No hay miembros registrados aún.
        </div>
          <div v-for="miembro in miembros":key="miembro.idmiembro_familia" class="miembro-card">
            <h3>Nombre:{{miembro.nombre}}</h3>
            <p>Apellido:{{ miembro.apellido }}</p>
            <p>Rol:{{ miembro.rol }}</p>
            <p>Identificacion:{{ miembro.identificacion }}</p>
            <p>Pertecene a: {{ obtenerNombreFamilia(miembro.id_familia) }}</p>
            
          <button v-if="traerRol === 'Administrador'"class="logout-btn"@click="eliminarMiembro(miembro.idmiembro_familia)">
            Eliminar
          </button>
            
          </div>
        
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
const miembros = ref([]);

const volver = () => {
  router.push("/dashboard");
};


// 🔹 Eliminar miembro
const eliminarMiembro = async (idmiembro_familia) => {

  const confirmar = confirm("¿Seguro que deseas eliminar este miembro?");
  if (!confirmar) return;

  try {
    // Petición DELETE al backend
    await axios.delete(`http://localhost:4000/miembro_familia/${idmiembro_familia}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Quitarlo de la lista local sin recargar
    miembros.value = miembros.value.filter(m => m.idmiembro_familia !== idmiembro_familia);

    alert("✅ Miembro eliminado correctamente.");
  } catch (error) {
    console.error("Error al eliminar miembro:", error);
    alert("❌ No se pudo eliminar el miembro.");
  }
};




// 🔹 Función para obtener el nombre de la familia desde el id
const obtenerNombreFamilia = (id) => {
  const familia = familias.value.find(f => f.id_familia === id);
  return familia ? familia.nombre_familia : "Sin familia";
};

onMounted(async () => {
  try {

    // Cargar familias con token JWT
    const response = await axios.get("http://localhost:4000/miembro_familia", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    miembros.value = response.data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    if (error.response?.status === 401) {
      alert("⚠️ Tu sesión ha expirado o no tienes autorización. Inicia sesión nuevamente.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
});



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

    miembros.value.push(miembroResponse.data);

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
  flex-direction: column;
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


/* 🔹 Contenedor de miembros */
.miembros-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 20px;
  width: 80%;
  max-width: 900px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  margin-top: 2rem;
}



  .no-data {
    color: white;
    font-style: italic;
    margin-top: 1rem;
  }

  .logout-btn {
  right: 25px;
  background: linear-gradient(135deg, #ff4e50, #f9d423);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 10px 18px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.miembro-card {
  position: relative;
  background: #ffffff;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #f85032, #e73827);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.miembros-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}


.miembro-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}

/* 🔹 Encabezado del nombre */
.miembro-card h3 {
  color: #1c3d5a;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #aed9dc;
  padding-bottom: 0.3rem;
}

/* 🔹 Información del miembro */
.miembro-card p {
  margin: 0.4rem 0;
  color: #2e2e2e;
  font-size: 0.95rem;
}
</style>
