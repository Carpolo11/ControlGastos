<template>
  <section class="transacciones-container">
    <div class="header">
      <h1>💰 Registro de Transacciones</h1>
      <p>Gestiona tus movimientos financieros de forma simple y elegante.</p>
    </div>

    <div class="content">
      <TransactionForm 
        @registrar="agregarTransaccion" 
        @actualizar="actualizarTransaccion"
        @cancelar="cancelarEdicion"
        :transaccion-editar="transaccionEditar"
        :modo-edicion="modoEdicion"
        :familias="familias"
        :categorias="categorias"
        :id-familia-usuario="idFamiliaUsuario"
      />
      <TransactionList 
        :transacciones="transacciones" 
        @editar="editarTransaccion"
        @eliminar="eliminarTransaccion"
      />

      <button class="login-btn" @click="volver">
        VOLVER
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import TransactionForm from '../components/transactions/TransactionForm.vue'
import TransactionList from '../components/transactions/TransactionList.vue'

const router = useRouter()
const volver = () => {
  router.push('/dashboard')
}

const transacciones = ref([])
const familias = ref([])
const categorias = ref([])
const transaccionEditar = ref(null)
const modoEdicion = ref(false)
const idFamiliaUsuario = ref(null)

// ==========================
// 🚀 CARGAR DATOS AL MONTAR
// ==========================
// onMounted(async () => {
//   const usuario = JSON.parse(localStorage.getItem("usuarioLogueado"))
//   if (!usuario) {
//     alert("⚠️ No hay usuario logueado. Redirigiendo al login...")
//     router.push('/')
//     return
//   }

//   usuarioLogueado.value = usuario
//   await cargarDatos(usuario.id_familia)
// })

async function cargarDatos() {
  try {
    const [resTransacciones, resFamilias, resCategorias] = await Promise.all([
      axios.get("http://localhost:4000/transacciones", {
        params: { id_familia: idFamiliaUsuario.value }
      }),
      axios.get("http://localhost:4000/familia"),
      axios.get("http://localhost:4000/categoria", {
        params: { id_familia: idFamiliaUsuario.value }
      })
    ]);
    
    transacciones.value = resTransacciones.data;
    familias.value = resFamilias.data;
    categorias.value = resCategorias.data;
    console.log('✅ Datos cargados correctamente para la familia:', idFamiliaUsuario.value);
  } catch (error) {
    console.error("❌ Error al cargar datos:", error);
    alert("Error al cargar los datos iniciales");
  }
}

async function agregarTransaccion(t) {
  try {
    const response = await axios.post("http://localhost:4000/transacciones", {
      id_familia: idFamiliaUsuario.value, // Usar siempre la familia del usuario logueado
      idcategoria: t.idcategoria,
      fecha: t.fecha,
      tipo: t.tipo,
      monto: t.monto,
      descripcion: t.descripcion,
      identificacion: t.identificacion
    });

    // Recargar transacciones para obtener los datos completos con joins
    await cargarDatos();
    alert(`✅ Transacción registrada exitosamente`);
    
  } catch (error) {
    console.error("❌ Error al crear transacción:", error);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error al registrar la transacción.");
    }
  }
}

function editarTransaccion(t) {
  transaccionEditar.value = { ...t }
  modoEdicion.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function actualizarTransaccion(t) {
  const index = transacciones.value.findIndex(trans => trans.id_transaccion === t.id_transaccion)
  if (index !== -1) {
    transacciones.value[index] = t
  }
  cancelarEdicion()
}

function eliminarTransaccion(id) {
  transacciones.value = transacciones.value.filter(t => t.id_transaccion !== id)
}

function cancelarEdicion() {
  transaccionEditar.value = null
  modoEdicion.value = false
}
</script>

<style scoped>
.transacciones-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1.5rem;
  font-family: "Inter", system-ui, sans-serif;
  color: #1f2937;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #4f46e5;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.header p {
  color: #6b7280;
  font-size: 1rem;
}

.content {
  background: linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(79, 70, 229, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  transition: transform 0.3s;
}

.content:hover {
  transform: translateY(-3px);
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
  transition: background 0.3s ease;
  margin-top: 1rem;
}

.login-btn:hover {
  opacity: 0.9;
}

@media (max-width: 600px) {
  .content {
    padding: 1.5rem;
  }
}
</style>