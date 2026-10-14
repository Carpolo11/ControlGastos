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

      <!-- 🔹 Contenedor de lista de categorías -->
      <div class="categorias-container">
        <h2>📋 LISTA DE CATEGORÍAS</h2>

        <div v-if="categorias.length === 0" class="no-data">
          No hay categorías registradas aún.
        </div>
          <div
            v-for="categoria in categorias"
            :key="categoria.idcategoria"
            class="categoria-card"
          >
            <h3>{{ categoria.nombre }}</h3>
            <p>Pertecene a: {{ obtenerNombreFamilia(categoria.id_familia) }}</p>

          <button v-if="traerRol === 'Administrador'"class="logout-btn"@click="eliminarCategoria(categoria.idcategoria)" >
            Eliminar
          </button>

          <button v-if="traerRol === 'Administrador' "class="logout-btn" @click="editarCategoria(categoria)">
            Editar
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


  const nombre = ref("");
  const id_familia = ref("");
  const familias = ref([]);
  const categorias = ref([]);
  const token = localStorage.getItem("token");
  const traerRol = ref("");


   //Editar categoria
  const editarCategoria = async (categoria) => {
  const nuevoNombre = prompt("✏️ Nuevo nombre de la categoría:", categoria.nombre);
  if (!nuevoNombre) return;

  const nuevaFamilia = prompt("🔁 Nuevo ID de familia (actual: " + categoria.id_familia + "):", categoria.id_familia);
  if (!nuevaFamilia) return;

  try {
    const response = await axios.put(`http://localhost:4000/categoria/${categoria.idcategoria}`, {
      nombre: nuevoNombre,
      id_familia: nuevaFamilia
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // ✅ Actualiza localmente
    const index = categorias.value.findIndex(c => c.idcategoria === categoria.idcategoria);
    if (index !== -1) {
      categorias.value[index] = response.data;
    }

    alert("✅ Categoría actualizada correctamente.");
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error);
    alert("❌ No se pudo actualizar la categoría.");
  }
};



  // 🔹 Eliminar categoria
const eliminarCategoria = async (idcategoria) => {

  const confirmar = confirm("¿Seguro que deseas eliminar esta categoria?");
  if (!confirmar) return;

  try {
    // Petición DELETE al backend
    await axios.delete(`http://localhost:4000/categoria/${idcategoria}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Quitarlo de la lista local sin recargar
    categorias.value = categorias.value.filter(m => m.idcategoria !== idcategoria);

    alert("✅ Categoria eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar categoria:", error);
    alert("❌ No se pudo eliminar la categoria.");
  }
};


  // 🔹 Función para obtener el nombre de la familia desde el id
const obtenerNombreFamilia = (id) => {
  const familia = familias.value.find(f => f.id_familia === id);
  return familia ? familia.nombre_familia : "Sin familia";
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


  // Trae Categorias
  onMounted(async () => {
    try {
      const response = await axios.get("http://localhost:4000/categoria", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      categorias.value = response.data;
    } catch (error) {
      console.error("Error al cargar las categorias:", error);
    }
  });

  const volver = () => {
    router.push("/dashboard");
  };

  const Crear =  async () => {
    if (!nombre.value || !id_familia.value) {
      alert("⚠️ Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/categoria", {
        nombre: nombre.value,
        id_familia: id_familia.value
      },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    
    );

      alert(`🏠 Categoria creada: "${nombre.value}"`);
      categorias.value.push(response.data);
      console.log("Categoria creada:", response.data);

      nombre.value = "";
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
    background: rgb(102, 174, 179);
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
    background: #16776d;
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



  /* 🔹 Contenedor de categorías */
  .categorias-container {
    background:  rgb(102, 174, 179);
    padding: 2rem;
    border-radius: 20px;
    width: 80%;
    max-width: 900px;
    text-align: center;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
    margin-top: 2rem;
  }





  .categoria-card:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-3px);
  }

  .no-data {
    color: white;
    font-style: italic;
    margin-top: 1rem;
  }

  .categoria-card {
  position: relative;
  background: #ffffff;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
}


.categoria-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}


.categoria-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 25px rgba(0, 0, 0, 0.2);
}

/* 🔹 Encabezado del nombre */
.categoria-card h3 {
  color: #1c3d5a;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  border-bottom: 2px solid #aed9dc;
  padding-bottom: 0.3rem;
}

/* 🔹 Información del miembro */
.categoria-card p {
  margin: 0.4rem 0;
  color: #2e2e2e;
  font-size: 0.95rem;
}

 .logout-btn { 
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
  display: inline-block;          /* ✅ cada botón ocupa su propia línea */
  margin-bottom: 10px;
  margin-right: 10px;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #f85032, #e73827);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

  </style>


