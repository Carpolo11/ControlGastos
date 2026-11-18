<template>
  <div class="activos-container">

    <!-- ENCABEZADO -->
    <header class="header">
      <div>
        <span class="subtitle">GESTIÓN DE ACTIVOS</span>
        <h1>Inventario tecnológico</h1>
        <p>
          Consulta y administra los activos tecnológicos
          registrados en tu organización.
        </p>
      </div>

      <button
        class="btn-refresh"
        @click="obtenerActivos"
        :disabled="cargando"
        type="button"
      >
        {{ cargando ? 'Cargando...' : '↻ Actualizar' }}
      </button>
    </header>

    <!-- RESUMEN -->
    <section class="summary">

      <div class="summary-card">
        <div class="summary-icon">▣</div>
        <div>
          <span>Total de activos</span>
          <h2>{{ activos.length }}</h2>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon">⌕</div>
        <div>
          <span>Resultados encontrados</span>
          <h2>{{ activosFiltrados.length }}</h2>
        </div>
      </div>

    </section>

    <!-- CONTENIDO -->
    <section class="content-card">

      <div class="table-header">
        <div>
          <h2>Activos registrados</h2>
          <p>Información general de los activos de la empresa.</p>
        </div>

        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar por nombre, tipo o área..."
          class="search-input"
        />
      </div>

      <!-- CARGANDO -->
      <div v-if="cargando" class="message">
        <div class="loader"></div>
        <p>Consultando activos...</p>
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- SIN ACTIVOS -->
      <div v-else-if="activos.length === 0" class="message">
        <div class="empty-icon">▣</div>
        <h3>No hay activos registrados</h3>
        <p>Cuando registres activos, aparecerán en esta sección.</p>
      </div>

      <!-- SIN RESULTADOS -->
      <div v-else-if="activosFiltrados.length === 0" class="message">
        <h3>No se encontraron resultados</h3>
        <p>Intenta buscar utilizando otro término.</p>
      </div>

      <!-- TABLA -->
      <div v-else class="table-container">

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del activo</th>
              <th>Tipo</th>
              <th>Área</th>
              <th>Uso</th>
              <th>Clasificación</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="activo in activosFiltrados"
              :key="activo.id"
            >

              <td class="id-cell">#{{ activo.id }}</td>

              <td class="asset-name">
                {{ activo.nombre_activo }}
              </td>

              <td>
                <span class="type-badge">
                  {{ activo.tipo_activo }}
                </span>
              </td>

              <td>{{ activo.area || 'No especificada' }}</td>

              <td>{{ activo.uso || 'No especificado' }}</td>

              <td>
                <span
                  class="classification-badge"
                  :class="claseClasificacion(activo.clasificacion)"
                >
                  {{ activo.clasificacion || 'No especificada' }}
                </span>
              </td>

              <!-- ACCIONES -->
              <td>
                <div class="actions">

                  <button
                    class="btn-delete"
                    @click="eliminarActivo(activo)"
                    :disabled="eliminando === activo.id"
                    type="button"
                  >
                    {{
                      eliminando === activo.id
                        ? 'Eliminando...'
                        : '✕ Eliminar'
                    }}
                  </button>

                </div>
              </td>

            </tr>
          </tbody>
        </table>

      </div>

      <footer v-if="!cargando && !error && activos.length > 0">
        Mostrando {{ activosFiltrados.length }} de
        {{ activos.length }} activos registrados.
      </footer>

    </section>

  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// ======================================
// ESTADOS
// ======================================

const activos = ref([]);

const cargando = ref(false);
const error = ref('');
const busqueda = ref('');

// ======================================
// ESTADO PARA ELIMINAR
// ======================================

const eliminando = ref(null);

// ======================================
// CONSULTAR ACTIVOS
// ======================================

const obtenerActivos = async () => {

  cargando.value = true;
  error.value = '';

  try {

    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error(
        'No se encontró el token de autenticación. Inicia sesión nuevamente.'
      );
    }

    const respuesta = await axios.get(
      'http://localhost:4000/activos',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    activos.value = respuesta.data.activos || [];

    console.log('Activos recibidos:', activos.value);

  } catch (err) {

    console.error('Error al consultar activos:', err);

    if (
      err.response?.status === 401 ||
      err.response?.status === 403
    ) {

      error.value =
        'Tu sesión no es válida o no tienes autorización para consultar los activos.';

    } else {

      error.value =
        err.response?.data?.error ||
        err.message ||
        'No fue posible consultar los activos.';

    }

  } finally {

    cargando.value = false;

  }

};

// ======================================
// BUSCADOR
// ======================================

const activosFiltrados = computed(() => {

  const texto = busqueda.value.toLowerCase().trim();

  if (!texto) {
    return activos.value;
  }

  return activos.value.filter((activo) => {

    return (

      String(activo.nombre_activo || '')
        .toLowerCase()
        .includes(texto) ||

      String(activo.tipo_activo || '')
        .toLowerCase()
        .includes(texto) ||

      String(activo.area || '')
        .toLowerCase()
        .includes(texto)

    );

  });

});

// ======================================
// CLASE DE CLASIFICACIÓN
// ======================================

const claseClasificacion = (clasificacion) => {

  const valor = String(clasificacion || '')
    .toLowerCase()
    .trim();

  if (valor === 'pública' || valor === 'publica') {
    return 'classification-public';
  }

  if (valor === 'interna') {
    return 'classification-internal';
  }

  if (valor === 'confidencial') {
    return 'classification-confidential';
  }

  if (valor === 'restringida') {
    return 'classification-restricted';
  }

  return 'classification-default';

};

// ======================================
// ELIMINAR ACTIVO
// ======================================

const eliminarActivo = async (activo) => {

  if (eliminando.value !== null) {
    return;
  }

  const confirmar = window.confirm(
    `¿Estás seguro de eliminar el activo "${activo.nombre_activo}"?\n\nEsta acción no se puede deshacer.`
  );

  if (!confirmar) {
    return;
  }

  eliminando.value = activo.id;

  try {

    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error(
        'No se encontró el token de autenticación.'
      );
    }

    const respuesta = await axios.delete(
      `http://localhost:4000/activos/${activo.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Activo eliminado:', respuesta.data);

    activos.value = activos.value.filter(
      item => item.id !== activo.id
    );

    alert('¡Activo eliminado correctamente!');

  } catch (err) {

    console.error('Error al eliminar activo:', err);

    alert(
      err.response?.data?.error ||
      err.message ||
      'No fue posible eliminar el activo.'
    );

  } finally {

    eliminando.value = null;

  }

};

// ======================================
// CARGAR AL INICIAR LA VISTA
// ======================================

onMounted(() => {
  obtenerActivos();
});

</script>

<style scoped>

/* ======================================
   CONTENEDOR
====================================== */

.activos-container {
  min-height: 100vh;
  padding: 35px;
  background: #f4f7f5;
  color: #24352d;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.activos-container * {
  box-sizing: border-box;
}

/* ======================================
   ENCABEZADO
====================================== */

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.subtitle {
  display: inline-block;
  color: #16875e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.header h1 {
  font-size: 30px;
  font-weight: 700;
  letter-spacing: -0.7px;
  color: #20352b;
  margin: 9px 0;
}

.header p {
  color: #7c8982;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.btn-refresh {
  background: #16875e;
  color: white;
  border: none;
  padding: 12px 19px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 10px rgba(22, 135, 94, 0.15);
  transition: all 0.25s ease;
}

.btn-refresh:hover {
  background: #106d4b;
  transform: translateY(-2px);
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* ======================================
   RESUMEN
====================================== */

.summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 240px));
  gap: 18px;
  margin-bottom: 25px;
}

.summary-card {
  display: flex;
  align-items: center;
  gap: 17px;
  background: #ffffff;
  padding: 22px;
  border-radius: 13px;
  border: 1px solid #e8eee9;
  box-shadow: 0 3px 12px rgba(33, 58, 44, 0.04);
  transition: all 0.25s ease;
}

.summary-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 20px rgba(33, 58, 44, 0.07);
}

.summary-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  background: #e6f5ed;
  color: #16875e;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;
  font-size: 23px;
}

.summary-card span {
  color: #829087;
  font-size: 11px;
  font-weight: 600;
}

.summary-card h2 {
  margin: 5px 0 0;
  font-size: 27px;
  color: #263b30;
  font-weight: 750;
}

/* ======================================
   CONTENIDO
====================================== */

.content-card {
  background: #ffffff;
  border: 1px solid #e6ece8;
  border-radius: 14px;
  padding: 26px;
  box-shadow: 0 4px 18px rgba(33, 58, 44, 0.035);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.table-header h2 {
  font-size: 18px;
  color: #263b30;
  font-weight: 700;
  margin: 0 0 7px;
}

.table-header p {
  color: #89958e;
  font-size: 12px;
  margin: 0;
}

/* ======================================
   BUSCADOR
====================================== */

.search-input {
  width: 310px;
  max-width: 100%;
  padding: 12px 15px;
  background: #fbfcfb;
  border: 1px solid #dfe8e2;
  border-radius: 9px;
  outline: none;
  font-size: 12px;
  color: #34463b;
  transition: all 0.2s ease;
}

.search-input::placeholder {
  color: #a0aaa4;
}

.search-input:focus {
  background: #ffffff;
  border-color: #16875e;
  box-shadow: 0 0 0 3px rgba(22, 135, 94, 0.09);
}

/* ======================================
   TABLA
====================================== */

.table-container {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #edf1ee;
  border-radius: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1050px;
}

thead {
  background: #f3f7f4;
}

th {
  color: #64756b;
  font-size: 10px;
  text-align: left;
  padding: 16px 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  white-space: nowrap;
  border-bottom: 1px solid #e8eee9;
}

td {
  padding: 17px 15px;
  border-bottom: 1px solid #eef2ef;
  font-size: 12px;
  color: #637168;
  vertical-align: middle;
}

tbody tr {
  transition: background 0.2s ease;
}

tbody tr:hover {
  background: #f7fbf8;
}

tbody tr:last-child td {
  border-bottom: none;
}

.id-cell {
  color: #89958e;
  font-size: 11px;
  font-weight: 600;
}

.asset-name {
  color: #263b30;
  font-weight: 700;
}

/* ======================================
   TIPO DE ACTIVO
====================================== */

.type-badge {
  display: inline-block;
  background: #e8f5ed;
  color: #16875e;
  padding: 6px 11px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

/* ======================================
   CLASIFICACIÓN
====================================== */

.classification-badge {
  display: inline-block;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.classification-public {
  background: #e9f3ff;
  color: #3475bd;
}

.classification-internal {
  background: #e8f5ed;
  color: #16875e;
}

.classification-confidential {
  background: #fff3df;
  color: #b87917;
}

.classification-restricted {
  background: #ffebeb;
  color: #cb4646;
}

.classification-default {
  background: #f0f2f1;
  color: #748078;
}

/* ======================================
   ACCIONES
====================================== */

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-delete {
  border: none;
  padding: 9px 12px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  background: #fff0ef;
  color: #d44d4d;
}

.btn-delete:hover {
  background: #ffdddd;
  transform: translateY(-1px);
}

.btn-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* ======================================
   MENSAJES
====================================== */

.message {
  text-align: center;
  padding: 65px 20px;
  color: #89958e;
}

.message h3 {
  color: #34483b;
  font-size: 16px;
  margin: 13px 0 8px;
}

.message p {
  font-size: 12px;
}

.empty-icon {
  width: 58px;
  height: 58px;
  background: #e8f5ed;
  color: #16875e;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  border-radius: 15px;
  font-size: 27px;
}

.error-message {
  padding: 17px 20px;
  background: #fff1f0;
  color: #c0392b;
  border: 1px solid #f8dddd;
  border-radius: 9px;
  font-size: 12px;
}

.loader {
  width: 34px;
  height: 34px;
  border: 3px solid #e1eee7;
  border-top-color: #16875e;
  border-radius: 50%;
  margin: 0 auto 16px;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

/* ======================================
   FOOTER
====================================== */

footer {
  padding-top: 19px;
  color: #8b9890;
  font-size: 11px;
}

/* ======================================
   RESPONSIVE
====================================== */

@media (max-width: 900px) {

  .activos-container {
    padding: 25px;
  }

  .content-card {
    padding: 20px;
  }

}

@media (max-width: 700px) {

  .activos-container {
    padding: 18px;
  }

  .header,
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header h1 {
    font-size: 25px;
  }

  .summary {
    grid-template-columns: 1fr 1fr;
  }

  .summary-card {
    padding: 15px;
    gap: 10px;
  }

  .summary-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
  }

  .search-input {
    width: 100%;
  }

}

@media (max-width: 600px) {

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

}

@media (max-width: 380px) {

  .summary {
    grid-template-columns: 1fr;
  }

}

</style>