<template>
  <div class="Transaccion">
    <div class="form-container">
      <h2>💰 Registrar Transacción</h2>

      <form @submit.prevent="crearTransaccion">
        <div class="input-group">
          <input v-model="fecha" type="date" placeholder="Fecha" required />
        </div>

        <div class="input-group">
          <input v-model="monto" type="number" step="0.01" placeholder="Valor a ingresar" required />
        </div>
        

        <div class="input-group">
          <select v-model="tipo" required>
            <option value="" disabled>Seleccionar Tipo</option>
            <option value="Ingreso">Ingreso</option>
            <option value="Egreso">Egreso</option>
          </select>
        </div>

        <div class="input-group">
          <select v-model="idcategoria" required>
            <option value="" disabled>Seleccionar Categoría</option>
            <option v-for="cat in categorias" :key="cat.idcategoria" :value="cat.idcategoria">
              {{ cat.nombre }}
            </option>
          </select>
        </div>

        <div class="input-group">
          <textarea v-model="descripcion" placeholder="Descripción de la transacción" rows="3" required></textarea>
        </div>

        <div class="input-group">
          <input v-model="identificacion" type="number" placeholder="Identificación del usuario" required />
        </div>

        <div class="input-group">
          <select v-model="id_familia" required>
            <option value="" disabled>Elige una familia</option>
            <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
              {{ familia.nombre_familia }}
            </option>
          </select>
        </div>

        <button type="submit" class="login-btn">
          {{ modoEdicion ? 'Actualizar Transacción' : 'Registrar Transacción' }}
        </button>

        <button v-if="modoEdicion" type="button" class="cancel-btn" @click="cancelarEdicion">
          Cancelar Edición
        </button>
      </form>

      <button class="login-btn" @click="volver">
        Volver
      </button>
    </div>

    <!-- 📹 Contenedor de historial de transacciones -->
    <div class="transacciones-container">
      <h2>📋 HISTORIAL DE TRANSACCIONES</h2>

      <!-- Filtro por familia -->
      <div class="filtro-familia">
        <label>Filtrar por familia:</label>
        <select v-model="familiaFiltro" @change="filtrarTransacciones">
          <option value="">Todas las familias</option>
          <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
            {{ familia.nombre_familia }}
          </option>
        </select>
      </div>

      <div v-if="transaccionesFiltradas.length === 0" class="no-data">
        No hay transacciones registradas aún.
      </div>

      <div v-for="transaccion in transaccionesFiltradas" :key="transaccion.id_transaccion" class="transaccion-card" :class="transaccion.tipo === 'Ingreso' ? 'ingreso' : 'egreso'">
        <div class="transaccion-header">
          <h3>{{ transaccion.tipo }} - {{ obtenerNombreCategoria(transaccion.idcategoria) }}</h3>
          <span class="monto">{{ formatearMonto(transaccion.monto) }}</span>
        </div>
        
        <p><strong>Fecha:</strong> {{ formatearFecha(transaccion.fecha) }}</p>
        <p><strong>Descripción:</strong> {{ transaccion.descripcion }}</p>
        <p><strong>Familia:</strong> {{ obtenerNombreFamilia(transaccion.id_familia) }}</p>
        <p><strong>Identificación:</strong> {{ transaccion.identificacion }}</p>
        
        
        <div class="acciones">
          <button class="edit-btn" @click="editarTransaccion(transaccion)">
            Editar
          </button>
          <button class="logout-btn" @click="eliminarTransaccion(transaccion.id_transaccion)">
            Eliminar
          </button>
        </div>
      </div>

      <!-- Resumen por familia -->
      <div v-if="familiaFiltro" class="resumen-container">
        <h3>📊 Resumen de {{ obtenerNombreFamilia(familiaFiltro) }}</h3>
        <div class="resumen-grid">
          <div class="resumen-item ingreso">
            <span class="label">Total Ingresos:</span>
            <span class="valor">{{ formatearMonto(calcularTotal('Ingreso')) }}</span>
          </div>
          <div class="resumen-item egreso">
            <span class="label">Total Egresos:</span>
            <span class="valor">{{ formatearMonto(calcularTotal('Egreso')) }}</span>
          </div>
          <div class="resumen-item balance">
            <span class="label">Balance:</span>
            <span class="valor">{{ formatearMonto(calcularBalance()) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// Campos del formulario
const fecha = ref("");
const monto = ref("");
const tipo = ref("");
const idcategoria = ref("");
const descripcion = ref("");
const identificacion = ref("");
const id_familia = ref("");
const familias = ref([]);
const categorias = ref([]);
const transacciones = ref([]);
const familiaFiltro = ref("");
const token = localStorage.getItem("token");
const usuarioActual = JSON.parse(localStorage.getItem("usuario") || "{}");

// Variables para edición
const modoEdicion = ref(false);
const transaccionEditando = ref(null);

const volver = () => {
  router.push("/dashboard");
};

// 📹 Función para obtener el nombre de la familia desde el id
const obtenerNombreFamilia = (id) => {
  const familia = familias.value.find(f => f.id_familia === id);
  return familia ? familia.nombre_familia : "Sin familia";
};

// 📹 Función para obtener el nombre de la categoría desde el id
const obtenerNombreCategoria = (id) => {
  const categoria = categorias.value.find(c => c.idcategoria === id);
  return categoria ? categoria.nombre : "Sin categoría";
};

// 📹 Formatear monto en moneda
const formatearMonto = (valor) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
};

// 📹 Formatear fecha
const formatearFecha = (fechaISO) => {
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// 📹 Transacciones filtradas
const transaccionesFiltradas = computed(() => {
  if (!familiaFiltro.value) {
    return transacciones.value;
  }
  return transacciones.value.filter(t => t.id_familia === familiaFiltro.value);
});

// 📹 Calcular totales
const calcularTotal = (tipoTransaccion) => {
  return transaccionesFiltradas.value
    .filter(t => t.tipo === tipoTransaccion)
    .reduce((sum, t) => sum + parseFloat(t.monto), 0);
};

const calcularBalance = () => {
  return calcularTotal('Ingreso') - calcularTotal('Egreso');
};

// 📹 Filtrar transacciones
const filtrarTransacciones = () => {
  // La computada property se encarga automáticamente
};

// 📹 Cargar datos iniciales
onMounted(async () => {
  try {
    // Establecer fecha actual por defecto
    const hoy = new Date().toISOString().split('T')[0];
    fecha.value = hoy;

    // Cargar identificación del usuario actual
    if (usuarioActual && usuarioActual.identificacion) {
      identificacion.value = usuarioActual.identificacion;
    }

    // Cargar familias
    const responseFamilias = await axios.get("http://localhost:4000/familia", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    familias.value = responseFamilias.data;

    // Cargar categorías
    const responseCategorias = await axios.get("http://localhost:4000/categoria", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    categorias.value = responseCategorias.data;

    // Cargar transacciones
    const responseTransacciones = await axios.get("http://localhost:4000/transaccion", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    transacciones.value = responseTransacciones.data;

  } catch (error) {
    console.error("Error al cargar los datos:", error);
    if (error.response?.status === 401) {
      alert("⚠️ Tu sesión ha expirado o no tienes autorización. Inicia sesión nuevamente.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
});

// 📹 Crear o actualizar transacción
const crearTransaccion = async () => {
  if (!fecha.value || !monto.value || !tipo.value || !idcategoria.value || !descripcion.value || !identificacion.value || !id_familia.value) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  if (parseFloat(monto.value) <= 0) {
    alert("⚠️ El monto debe ser mayor a 0.");
    return;
  }

  try {
    const datosTransaccion = {
      fecha: fecha.value,
      monto: parseFloat(monto.value),
      tipo: tipo.value,
      idcategoria: idcategoria.value,
      descripcion: descripcion.value,
      identificacion: identificacion.value,
      id_familia: id_familia.value
    };

    if (modoEdicion.value) {
      // Actualizar transacción existente
      const response = await axios.put(
        `http://localhost:4000/transaccion/${transaccionEditando.value}`,
        datosTransaccion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar en el array local
      const index = transacciones.value.findIndex(t => t.id_transaccion === transaccionEditando.value);
      if (index !== -1) {
        transacciones.value[index] = response.data;
      }

      alert("✅ Transacción actualizada correctamente.");
      cancelarEdicion();
    } else {
      // Crear nueva transacción
      const response = await axios.post(
        "http://localhost:4000/transaccion",
        datosTransaccion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      transacciones.value.push(response.data);
      alert(`✅ Transacción de ${tipo.value} registrada correctamente.`);
    }

    // Limpiar campos
    limpiarFormulario();

  } catch (error) {
  console.error("❌ Error al procesar transacción:", error);
  if (error.response) {
    console.log("📩 Respuesta del servidor:", error.response.data);
    console.log("📋 Código de estado:", error.response.status);
  }
  if (error.response?.data?.error) {
    alert(error.response.data.error);
  } else {
    alert("Error al procesar la transacción.");
  }
}
};

// 📹 Editar transacción
const editarTransaccion = (transaccion) => {
  modoEdicion.value = true;
  transaccionEditando.value = transaccion.id_transaccion;
  
  fecha.value = transaccion.fecha.split('T')[0];
  monto.value = transaccion.monto;
  tipo.value = transaccion.tipo;
  idcategoria.value = transaccion.idcategoria;
  descripcion.value = transaccion.descripcion;
  identificacion.value = transaccion.identificacion;
  id_familia.value = transaccion.id_familia;

  // Scroll al formulario
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 📹 Cancelar edición
const cancelarEdicion = () => {
  modoEdicion.value = false;
  transaccionEditando.value = null;
  limpiarFormulario();
};

// 📹 Limpiar formulario
const limpiarFormulario = () => {
  const hoy = new Date().toISOString().split('T')[0];
  fecha.value = hoy;
  monto.value = "";
  tipo.value = "";
  idcategoria.value = "";
  descripcion.value = "";
  identificacion.value = usuarioActual.identificacion || "";
  id_familia.value = "";
};

// 📹 Eliminar transacción
const eliminarTransaccion = async (id_transaccion) => {
  const confirmar = confirm("¿Seguro que deseas eliminar esta transacción?");
  if (!confirmar) return;

  try {
    await axios.delete(`http://localhost:4000/transaccion/${id_transaccion}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Quitarlo de la lista local
    transacciones.value = transacciones.value.filter(t => t.id_transaccion !== id_transaccion);

    alert("✅ Transacción eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    alert("❌ No se pudo eliminar la transacción.");
  }
};
</script>

<style scoped>
.Transaccion {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem 0;
}

.form-container {
  background: rgb(102, 174, 179);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 380px;
  margin-bottom: 2rem;
}

.form-container h2 {
  color: white;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid black;
  border-radius: 50px;
  outline: none;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  background: transparent;
  color: white;
}

textarea {
  border-radius: 20px;
}

input::placeholder,
textarea::placeholder,
select option:first-child {
  color: black;
}

select {
  color: black;
}

select option {
  background: white;
  color: black;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

/* Quitar flechas en Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
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
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.cancel-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.cancel-btn:hover {
  background: linear-gradient(135deg, #ee5a6f, #c92a2a);
  transform: translateY(-2px);
}

/* 📹 Contenedor de transacciones */
.transacciones-container {
  background: rgb(102, 174, 179);
  padding: 2rem;
  border-radius: 20px;
  width: 80%;
  max-width: 900px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.transacciones-container h2 {
  color: white;
  margin-bottom: 1.5rem;
}

.filtro-familia {
  margin-bottom: 1.5rem;
  text-align: left;
  background: white;
  padding: 1rem;
  border-radius: 10px;
}

.filtro-familia label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #1c3d5a;
}

.filtro-familia select {
  width: 100%;
  padding: 0.6rem;
  border: 2px solid black;
  border-radius: 8px;
}

.no-data {
  color: white;
  font-style: italic;
  margin-top: 1rem;
  padding: 2rem;
}

.transaccion-card {
  position: relative;
  background: #ffffff;
  border-radius: 15px;
  padding: 1.5rem;
  margin: 1rem 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  text-align: left;
  transition: all 0.3s ease;
  border-left: 5px solid #ccc;
}

.transaccion-card.ingreso {
  border-left-color: #51cf66;
}

.transaccion-card.egreso {
  border-left-color: #ff6b6b;
}

.transaccion-card:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.transaccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #aed9dc;
}

.transaccion-header h3 {
  color: #1c3d5a;
  font-size: 1.2rem;
  margin: 0;
}

.monto {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c3d5a;
}

.transaccion-card.ingreso .monto {
  color: #2f9e44;
}

.transaccion-card.egreso .monto {
  color: #c92a2a;
}

.transaccion-card p {
  margin: 0.4rem 0;
  color: #2e2e2e;
  font-size: 0.95rem;
}

.transaccion-card p strong {
  color: #1c3d5a;
}

.acciones {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
}

.edit-btn {
  flex: 1;
  background: linear-gradient(135deg, #4dabf7, #339af0);
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

.edit-btn:hover {
  background: linear-gradient(135deg, #339af0, #1c7ed6);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.logout-btn {
  flex: 1;
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

.logout-btn:hover {
  background: linear-gradient(135deg, #f85032, #e73827);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* 📹 Resumen */
.resumen-container {
  margin-top: 2rem;
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.resumen-container h3 {
  color: #1c3d5a;
  margin-bottom: 1rem;
  text-align: center;
}

.resumen-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.resumen-item {
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.resumen-item.ingreso {
  background: linear-gradient(135deg, #d3f9d8, #b2f2bb);
}

.resumen-item.egreso {
  background: linear-gradient(135deg, #ffe3e3, #ffc9c9);
}

.resumen-item.balance {
  background: linear-gradient(135deg, #d0ebff, #a5d8ff);
}

.resumen-item .label {
  font-weight: 600;
  color: #1c3d5a;
  font-size: 0.9rem;
}

.resumen-item .valor {
  font-size: 1.5rem;
  font-weight: bold;
  color: #1c3d5a;
}
</style>