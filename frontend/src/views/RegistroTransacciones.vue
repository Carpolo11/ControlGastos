<template>
  <div class="Transaccion">
    <TransactionForm
      :categorias="categorias"
      :familias="familias"
      :transaccion-editar="transaccionEditando"
      :modo-edicion="modoEdicion"
      :usuario-actual="usuarioActual"
      @submit="procesarTransaccion"
      @volver="volver"
      @cancelar="cancelarEdicion"
      ref="formularioRef"
    />

    <TransactionList
      :transacciones="transacciones"
      :familias="familias"
      :categorias="categorias"
      :familia-filtro="familiaFiltro"
      @editar="editarTransaccion"
      @eliminar="eliminarTransaccion"
      @actualizar-filtro="actualizarFiltro"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import TransactionForm from "@/components/Transactions/TransactionForm.vue";
import TransactionList from "@/components/Transactions/TransactionList.vue";

const router = useRouter();

const familias = ref([]);
const categorias = ref([]);
const transacciones = ref([]);
const familiaFiltro = ref("");
const token = localStorage.getItem("token");
const usuarioActual = JSON.parse(localStorage.getItem("usuario") || "{}");

// Variables para edición
const modoEdicion = ref(false);
const transaccionEditando = ref(null);
const formularioRef = ref(null);

const volver = () => {
  router.push("/dashboard");
};

const actualizarFiltro = (filtro) => {
  familiaFiltro.value = filtro;
};

// Cargar datos iniciales
onMounted(async () => {
  try {
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

// Procesar transacción (crear o actualizar)
const procesarTransaccion = async (datosFormulario) => {
  try {
    const datosTransaccion = {
      fecha: datosFormulario.fecha,
      monto: parseFloat(datosFormulario.monto),
      tipo: datosFormulario.tipo,
      idcategoria: datosFormulario.idcategoria,
      descripcion: datosFormulario.descripcion,
      identificacion: datosFormulario.identificacion,
      id_familia: datosFormulario.id_familia
    };

    if (modoEdicion.value) {
      // Actualizar transacción existente
      const response = await axios.put(
        `http://localhost:4000/transaccion/${transaccionEditando.value.id_transaccion}`,
        datosTransaccion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Actualizar en el array local
      const index = transacciones.value.findIndex(
        t => t.id_transaccion === transaccionEditando.value.id_transaccion
      );
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
      alert(`✅ Transacción de ${datosFormulario.tipo} registrada correctamente.`);
    }

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

// Editar transacción
const editarTransaccion = (transaccion) => {
  modoEdicion.value = true;
  transaccionEditando.value = transaccion;
};

// Cancelar edición
const cancelarEdicion = () => {
  modoEdicion.value = false;
  transaccionEditando.value = null;
  if (formularioRef.value) {
    formularioRef.value.limpiarFormulario();
  }
};

// Eliminar transacción
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
</style>