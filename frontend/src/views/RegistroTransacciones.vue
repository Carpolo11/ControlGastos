<template>
  <div class="Transaccion">
    <!-- 📋 Formulario para registrar o editar transacciones -->
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

    <!-- 📄 Listado de transacciones con opciones de filtro, edición y eliminación -->
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
/* -------------------------------------------------------------
   Importaciones necesarias
   ------------------------------------------------------------- */
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import TransactionForm from "../components/Transactions/TransactionForm.vue";
import TransactionList from "../components/Transactions/TransactionList.vue";

/* -------------------------------------------------------------
   Configuración inicial de router y variables reactivas
   ------------------------------------------------------------- */
const router = useRouter();
const familias = ref([]);
const categorias = ref([]);
const transacciones = ref([]);
const familiaFiltro = ref("");
const token = localStorage.getItem("token");
const usuarioActual = JSON.parse(localStorage.getItem("usuario") || "{}");

/* -------------------------------------------------------------
   Variables para manejo de edición y referencia del formulario
   ------------------------------------------------------------- */
const modoEdicion = ref(false);
const transaccionEditando = ref(null);
const formularioRef = ref(null);

/* -------------------------------------------------------------
   Función para regresar al dashboard principal
   ------------------------------------------------------------- */
const volver = () => {
  router.push("/dashboard");
};

/* -------------------------------------------------------------
   Actualiza el filtro por familia en el listado
   ------------------------------------------------------------- */
const actualizarFiltro = (filtro) => {
  familiaFiltro.value = filtro;
};

/* -------------------------------------------------------------
   Carga inicial de datos: familias, categorías y transacciones
   ------------------------------------------------------------- */
onMounted(async () => {
  try {
    // Cargar familias
    const responseFamilias = await axios.get("http://localhost:4000/familia", {
      headers: { Authorization: `Bearer ${token}` },
    });
    familias.value = responseFamilias.data;

    // Cargar categorías
    const responseCategorias = await axios.get("http://localhost:4000/categoria", {
      headers: { Authorization: `Bearer ${token}` },
    });
    categorias.value = responseCategorias.data;

    // Cargar transacciones
    const responseTransacciones = await axios.get("http://localhost:4000/transaccion", {
      headers: { Authorization: `Bearer ${token}` },
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

/* -------------------------------------------------------------
   Procesar transacción: crear nueva o actualizar existente
   ------------------------------------------------------------- */
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
      // 🟡 Modo edición: actualizar transacción existente
      const response = await axios.put(
        `http://localhost:4000/transaccion/${transaccionEditando.value.id_transaccion}`,
        datosTransaccion,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar el registro en la lista local
      const index = transacciones.value.findIndex(
        t => t.id_transaccion === transaccionEditando.value.id_transaccion
      );
      if (index !== -1) transacciones.value[index] = response.data;

      alert("✅ Transacción actualizada correctamente.");
      cancelarEdicion();
    } else {
      // 🟢 Modo creación: registrar nueva transacción
      const response = await axios.post(
        "http://localhost:4000/transaccion",
        datosTransaccion,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      transacciones.value.push(response.data);
      alert(`✅ Transacción de ${datosFormulario.tipo} registrada correctamente.`);
    }

  } catch (error) {
    console.error("❌ Error al procesar transacción:", error);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Error al procesar la transacción.");
    }
  }
};

/* -------------------------------------------------------------
   Establece el modo edición con la transacción seleccionada
   ------------------------------------------------------------- */
const editarTransaccion = (transaccion) => {
  modoEdicion.value = true;
  transaccionEditando.value = transaccion;
};

/* -------------------------------------------------------------
   Cancela el modo de edición y limpia el formulario
   ------------------------------------------------------------- */
const cancelarEdicion = () => {
  modoEdicion.value = false;
  transaccionEditando.value = null;
  if (formularioRef.value) formularioRef.value.limpiarFormulario();
};

/* -------------------------------------------------------------
   Elimina una transacción seleccionada del sistema y la lista
   ------------------------------------------------------------- */
const eliminarTransaccion = async (id_transaccion) => {
  const confirmar = confirm("¿Seguro que deseas eliminar esta transacción?");
  if (!confirmar) return;

  try {
    await axios.delete(`http://localhost:4000/transaccion/${id_transaccion}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Remover del listado local
    transacciones.value = transacciones.value.filter(
      t => t.id_transaccion !== id_transaccion
    );

    alert("✅ Transacción eliminada correctamente.");
  } catch (error) {
    console.error("Error al eliminar transacción:", error);
    alert("❌ No se pudo eliminar la transacción.");
  }
};
</script>

<style scoped>
/* 🎨 Contenedor principal del módulo de transacciones */
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
