
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

              <td>#{{ activo.id }}</td>

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
                {{ activo.clasificacion || 'No especificada' }}
              </td>

              <!-- ACCIONES -->
              <td>
                <div class="actions">

                  <button
                    class="btn-edit"
                    @click="editarSeleccionado(activo)"
                  >
                    ✎ Editar
                  </button>

                  <button
                    class="btn-delete"
                    @click="eliminarActivo(activo)"
                    :disabled="eliminando === activo.id"
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

    <!-- =====================================
         MODAL PARA EDITAR ACTIVO
    ====================================== -->

    <div
      v-if="mostrarModal"
      class="modal-overlay"
      @click.self="cerrarModal"
    >

      <div class="modal">

        <div class="modal-header">
          <div>
            <span class="subtitle">GESTIÓN DE ACTIVOS</span>
            <h2>Editar activo</h2>
            <p>Modifica la información del activo tecnológico.</p>
          </div>

          <button
            class="btn-close"
            @click="cerrarModal"
            type="button"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="actualizarActivo">

          <div class="form-grid">

            <!-- NOMBRE -->
            <div class="form-group">
              <label>Nombre del activo</label>

              <input
                v-model="activoEditando.nombre_activo"
                type="text"
                placeholder="Nombre del activo"
                required
              />
            </div>

            <!-- TIPO -->
            <div class="form-group">
              <label>Tipo de activo</label>

              <input
                v-model="activoEditando.tipo_activo"
                type="text"
                placeholder="Ej: Hardware, Software..."
                required
              />
            </div>

            <!-- ÁREA -->
            <div class="form-group">
              <label>Área responsable</label>

              <input
                v-model="activoEditando.area"
                type="text"
                placeholder="Área de la empresa"
              />
            </div>

            <!-- USO -->
            <div class="form-group">
              <label>Uso del activo</label>

              <input
                v-model="activoEditando.uso"
                type="text"
                placeholder="Uso del activo"
              />
            </div>

            <!-- CLASIFICACIÓN -->
            <div class="form-group full-width">
              <label>Clasificación</label>

              <select v-model="activoEditando.clasificacion">

                <option value="">
                  Seleccionar clasificación
                </option>

                <option value="Pública">Pública</option>
                <option value="Interna">Interna</option>
                <option value="Confidencial">Confidencial</option>
                <option value="Restringida">Restringida</option>

              </select>
            </div>

          </div>

          <!-- ERROR DEL MODAL -->
          <div v-if="errorModal" class="error-message modal-error">
            {{ errorModal }}
          </div>

          <!-- BOTONES -->
          <div class="modal-actions">

            <button
              type="button"
              class="btn-cancel"
              @click="cerrarModal"
              :disabled="guardando"
            >
              Cancelar
            </button>

            <button
              type="submit"
              class="btn-save"
              :disabled="guardando"
            >
              {{
                guardando
                  ? 'Guardando...'
                  : 'Guardar cambios'
              }}
            </button>

          </div>

        </form>

      </div>

    </div>

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
// ESTADOS PARA EDITAR Y ELIMINAR
// ======================================

const mostrarModal = ref(false);

const guardando = ref(false);

const eliminando = ref(null);

const errorModal = ref('');

const activoEditando = ref({

  id: null,
  nombre_activo: '',
  tipo_activo: '',
  area: '',
  uso: '',
  clasificacion: ''

});


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
// SELECCIONAR ACTIVO PARA EDITAR
// ======================================

const editarSeleccionado = (activo) => {

  activoEditando.value = {

    id: activo.id,

    nombre_activo: activo.nombre_activo || '',

    tipo_activo: activo.tipo_activo || '',

    area: activo.area || '',

    uso: activo.uso || '',

    clasificacion: activo.clasificacion || ''

  };

  errorModal.value = '';

  mostrarModal.value = true;

};


// ======================================
// CERRAR MODAL
// ======================================

const cerrarModal = () => {

  if (guardando.value) {
    return;
  }

  mostrarModal.value = false;

  errorModal.value = '';

};


// ======================================
// ACTUALIZAR ACTIVO
// ======================================

const actualizarActivo = async () => {

  if (guardando.value) {
    return;
  }

  guardando.value = true;

  errorModal.value = '';

  try {

    const token = localStorage.getItem('token');

    if (!token) {

      throw new Error(
        'No se encontró el token de autenticación.'
      );

    }

    const id = activoEditando.value.id;

    const datos = {

      nombre_activo: activoEditando.value.nombre_activo,

      tipo_activo: activoEditando.value.tipo_activo,

      area: activoEditando.value.area,

      uso: activoEditando.value.uso,

      clasificacion: activoEditando.value.clasificacion

    };

    const respuesta = await axios.put(

      `http://localhost:4000/activos/${id}`,

      datos,

      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }

    );

    console.log('Activo actualizado:', respuesta.data);

    alert('¡Activo actualizado correctamente!');

    mostrarModal.value = false;

    await obtenerActivos();

  } catch (err) {

    console.error('Error al actualizar activo:', err);

    errorModal.value =

      err.response?.data?.error ||

      err.message ||

      'No fue posible actualizar el activo.';

  } finally {

    guardando.value = false;

  }

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
  background: #f5f7f6;
  color: #202b27;
  font-family: Arial, sans-serif;

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

  color: #17865b;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.5px;

}

.header h1 {

  font-size: 28px;
  margin: 9px 0;

}

.header p {

  color: #77817c;
  font-size: 14px;

}

.btn-refresh {

  background: #17865b;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

}

.btn-refresh:disabled {

  opacity: 0.6;
  cursor: not-allowed;

}


/* ======================================
   RESUMEN
====================================== */

.summary {

  display: grid;
  grid-template-columns: repeat(2, minmax(0, 220px));
  gap: 20px;
  margin-bottom: 25px;

}

.summary-card {

  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e7ece9;

}

.summary-icon {

  width: 45px;
  height: 45px;
  background: #e7f5ee;
  color: #17865b;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  font-size: 22px;

}

.summary-card span {

  color: #7b8580;
  font-size: 12px;

}

.summary-card h2 {

  margin: 5px 0 0;
  font-size: 25px;

}


/* ======================================
   CONTENIDO
====================================== */

.content-card {

  background: white;
  border: 1px solid #e7ece9;
  border-radius: 12px;
  padding: 25px;

}

.table-header {

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;

}

.table-header h2 {

  font-size: 19px;
  margin: 0 0 7px;

}

.table-header p {

  color: #89918d;
  font-size: 13px;
  margin: 0;

}

.search-input {

  width: 300px;
  max-width: 100%;
  padding: 12px;
  border: 1px solid #dce4df;
  border-radius: 8px;
  outline: none;

}

.search-input:focus {

  border-color: #17865b;

}


/* ======================================
   TABLA
====================================== */

.table-container {

  width: 100%;
  overflow-x: auto;

}

table {

  width: 100%;
  border-collapse: collapse;
  min-width: 1050px;

}

thead {

  background: #f5f8f6;

}

th {

  color: #68736d;
  font-size: 12px;
  text-align: left;
  padding: 15px;

}

td {

  padding: 17px 15px;
  border-bottom: 1px solid #edf0ee;
  font-size: 13px;
  color: #59645e;

}

tbody tr:hover {

  background: #f8fbf9;

}

.asset-name {

  color: #253c31;
  font-weight: bold;

}

.type-badge {

  background: #e9f5ee;
  color: #17865b;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;

}


/* ======================================
   ACCIONES
====================================== */

.actions {

  display: flex;
  gap: 8px;
  align-items: center;

}

.btn-edit,
.btn-delete {

  border: none;
  padding: 8px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;

}

.btn-edit {

  background: #e7f5ee;
  color: #17865b;

}

.btn-edit:hover {

  background: #d3ecdf;

}

.btn-delete {

  background: #fff0f0;
  color: #d64545;

}

.btn-delete:hover {

  background: #ffe0e0;

}

.btn-delete:disabled {

  opacity: 0.5;
  cursor: not-allowed;

}


/* ======================================
   MENSAJES
====================================== */

.message {

  text-align: center;
  padding: 55px 20px;
  color: #89918d;

}

.message h3 {

  color: #34443b;

}

.empty-icon {

  font-size: 40px;
  color: #17865b;

}

.error-message {

  padding: 20px;
  background: #fff0f0;
  color: #c0392b;
  border-radius: 8px;

}

.loader {

  width: 30px;
  height: 30px;
  border: 3px solid #e1eee7;
  border-top-color: #17865b;
  border-radius: 50%;
  margin: 0 auto 15px;
  animation: girar 0.8s linear infinite;

}

@keyframes girar {

  to {
    transform: rotate(360deg);
  }

}

footer {

  padding-top: 20px;
  color: #89918d;
  font-size: 12px;

}


/* ======================================
   MODAL
====================================== */

.modal-overlay {

  position: fixed;
  inset: 0;
  background: rgba(20, 35, 28, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  z-index: 1000;

}

.modal {

  background: white;
  width: 100%;
  max-width: 650px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 14px;
  padding: 30px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.15);

}

.modal-header {

  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;

}

.modal-header h2 {

  margin: 8px 0;
  font-size: 23px;
  color: #202b27;

}

.modal-header p {

  color: #89918d;
  font-size: 13px;

}

.btn-close {

  background: #f1f4f2;
  border: none;
  border-radius: 7px;
  padding: 9px 12px;
  cursor: pointer;

}


/* ======================================
   FORMULARIO
====================================== */

.form-grid {

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

}

.form-group {

  display: flex;
  flex-direction: column;
  gap: 8px;

}

.form-group label {

  font-size: 13px;
  font-weight: bold;
  color: #46534b;

}

.form-group input,
.form-group select {

  padding: 12px;
  border: 1px solid #dce4df;
  border-radius: 7px;
  outline: none;
  font-size: 13px;

}

.form-group input:focus,
.form-group select:focus {

  border-color: #17865b;

}

.full-width {

  grid-column: 1 / -1;

}

.modal-error {

  margin-top: 20px;

}


/* ======================================
   BOTONES DEL MODAL
====================================== */

.modal-actions {

  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;

}

.btn-cancel,
.btn-save {

  border: none;
  padding: 12px 20px;
  border-radius: 7px;
  font-weight: bold;
  cursor: pointer;

}

.btn-cancel {

  background: #eef1ef;
  color: #59645e;

}

.btn-save {

  background: #17865b;
  color: white;

}

.btn-save:hover {

  background: #116b47;

}

.btn-save:disabled,
.btn-cancel:disabled {

  opacity: 0.6;
  cursor: not-allowed;

}


/* ======================================
   RESPONSIVE
====================================== */

@media (max-width: 700px) {

  .activos-container {

    padding: 18px;

  }

  .header,
  .table-header {

    flex-direction: column;
    align-items: stretch;

  }

  .summary {

    grid-template-columns: 1fr;

  }

  .search-input {

    width: 100%;
    box-sizing: border-box;

  }

}

@media (max-width: 600px) {

  .form-grid {

    grid-template-columns: 1fr;

  }

  .full-width {

    grid-column: auto;

  }

  .modal {

    padding: 20px;

  }

  .actions {

    flex-direction: column;
    align-items: stretch;

  }

}

</style>
