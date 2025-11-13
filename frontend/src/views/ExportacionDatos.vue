<template>
  <div class="Exportacion">
    <div class="form-container">
      <h2>📊 Exportación de Datos</h2>

      <form @submit.prevent="exportarDatos">
        <div class="input-group">
          <select v-model="tipoReporte" required>
            <option value="" disabled>Seleccionar tipo de reporte</option>
            <option value="transacciones">Historial de Transacciones</option>
            <option value="familias">Reporte de Familias</option>
            <option value="miembros">Reporte de Miembros</option>
          </select>
        </div>

        <div class="input-group">
          <select v-model="formato" required>
            <option value="" disabled>Seleccionar formato</option>
            <option value="xlsx">Excel (.xlsx)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>

        <div class="input-group">
          <label style="color: white; font-size: 0.9rem; display: block; margin-bottom: 0.5rem;">
            Fecha Inicio (opcional)
          </label>
          <input v-model="fechaInicio" type="date" />
        </div>

        <div class="input-group">
          <label style="color: white; font-size: 0.9rem; display: block; margin-bottom: 0.5rem;">
            Fecha Fin (opcional)
          </label>
          <input v-model="fechaFin" type="date" />
        </div>

        <button type="submit" class="btn">
          <span v-if="!cargando">📥 Descargar Reporte</span>
          <span v-else>⏳ Generando...</span>
        </button>
      </form>

      <button class="login-btn" @click="volver">
        VOLVER
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const volver = () => {
  router.push("/dashboard");
};

const tipoReporte = ref("");
const formato = ref("");
const fechaInicio = ref("");
const fechaFin = ref("");
const cargando = ref(false);

// Obtenemos el token de localStorage. Asegúrate de que tu app lo guarde ahí.
const token = localStorage.getItem("token"); 

const exportarDatos = async () => {
  if (!tipoReporte.value || !formato.value) {
    alert("⚠️ Debe seleccionar el tipo de reporte y formato.");
    return;
  }

  // Comprobación de token añadida para una mejor UX
  if (!token) {
    alert("❌ Error de Autenticación: El token de usuario no está disponible. Por favor, inicie sesión de nuevo.");
    return;
  }

  cargando.value = true;

  try {
    const params = {
      tipo: tipoReporte.value,
      formato: formato.value,
    };

    if (fechaInicio.value) params.fecha_inicio = fechaInicio.value;
    if (fechaFin.value) params.fecha_fin = fechaFin.value;

    const response = await axios.get("http://localhost:4000/exportar", {
      params,
      responseType: "blob", // Importante para descargar archivos
      // 🔑 SOLUCIÓN: Enviamos el token en el header Authorization
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    
    const extension = formato.value === "xlsx" ? "xlsx" : "csv";
    const nombreArchivo = `${tipoReporte.value}_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert(`✅ Reporte "${tipoReporte.value}" descargado exitosamente en formato ${formato.value.toUpperCase()}`);
    
    // Limpiar formulario
    tipoReporte.value = "";
    formato.value = "";
    fechaInicio.value = "";
    fechaFin.value = "";

  } catch (error) {
    console.error("❌ Error al exportar datos:", error);
    // Manejo de error para la respuesta del backend
    if (error.response?.data?.error) {
      // Intenta leer el mensaje de error del cuerpo (p. ej., "Token no proporcionado")
      const reader = new FileReader();
      reader.onload = function() {
        try {
          const errorData = JSON.parse(reader.result);
          alert(`Error del Servidor: ${errorData.error}`);
        } catch (e) {
          alert("Error desconocido al parsear la respuesta del servidor.");
        }
      };
      // Leer el blob de error (response.data es un Blob por responseType: "blob")
      reader.readAsText(error.response.data);

    } else {
      // Mensaje genérico para errores de red o CORS
      alert("Error al generar el reporte. Por favor, intente nuevamente o revise la conexión.");
    }
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
.Exportacion {
  height: 100vh;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Poppins", sans-serif;
}

.form-container {
 background: rgb(102, 174, 179);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 380px;
}

h2 {
  color: white;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.input-group {
  margin-bottom: 1.2rem;
}

input,
select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid black;
  border-radius: 50px;
  outline: none;
  font-size: 1rem;
  background: white;
  color: black;
}

input::placeholder {
  color: rgba(0, 0, 0, 0.6);
}

select {
  cursor: pointer;
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
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  transform: translateY(-2px);
}

/* Quitar flechas en Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Quitar flechas en Firefox */
input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
}
</style>