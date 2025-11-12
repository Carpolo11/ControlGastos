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

const exportarDatos = async () => {
  if (!tipoReporte.value || !formato.value) {
    alert("⚠️ Debe seleccionar el tipo de reporte y formato.");
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

    const token = localStorage.getItem('token');
    
    console.log('📤 Enviando solicitud:', params);

    const response = await axios.get("http://localhost:4000/api/exportar", {
      params,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      responseType: "blob",
    });

    console.log('✅ Respuesta recibida');

    // Crear un enlace temporal para descargar el archivo
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    
    const extension = formato.value === "xlsx" ? "xlsx" : "csv";
    const nombreArchivo = `${tipoReporte.value}_${new Date().toISOString().split('T')[0]}.${extension}`;
    
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();
    
    // Limpiar
    setTimeout(() => {
      link.remove();
      window.URL.revokeObjectURL(url);
    }, 100);

    alert(`✅ Reporte "${tipoReporte.value}" descargado exitosamente`);
    
    // Limpiar formulario
    tipoReporte.value = "";
    formato.value = "";
    fechaInicio.value = "";
    fechaFin.value = "";

  } catch (error) {
    console.error("❌ Error completo:", error);
    
    if (error.response) {
      // Error del servidor
      if (error.response.data instanceof Blob) {
        // Si es un blob, convertirlo a texto
        const text = await error.response.data.text();
        try {
          const jsonError = JSON.parse(text);
          alert(`❌ Error: ${jsonError.error || jsonError.mensaje || 'Error desconocido'}`);
        } catch {
          alert(`❌ Error del servidor: ${text}`);
        }
      } else {
        alert(`❌ Error: ${error.response.data.error || 'Error al generar el reporte'}`);
      }
    } else if (error.request) {
      // No hay respuesta del servidor
      alert("❌ No se pudo conectar con el servidor. Verifique que esté corriendo.");
    } else {
      // Otro tipo de error
      alert(`❌ Error: ${error.message}`);
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