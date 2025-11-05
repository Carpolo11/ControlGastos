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

  onMounted(async () => {
    try {
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
    background: rgb(8, 80, 122);
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

  </style>


