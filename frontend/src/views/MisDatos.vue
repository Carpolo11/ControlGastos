<template>
  <div class="privacidad-container">

    <header class="header">
      <span class="subtitle">MIS DATOS Y PRIVACIDAD</span>
      <h1>Tus datos personales</h1>
      <p>
        Consulta y actualiza tus datos, revisa tus autorizaciones y ejerce tus derechos
        como titular (Ley 1581 de 2012).
      </p>
    </header>

    <div v-if="cargando" class="message">
      <div class="loader"></div>
      <p>Cargando tus datos…</p>
    </div>

    <div v-else-if="errorCarga" class="error-message" role="alert">{{ errorCarga }}</div>

    <template v-else>
      <div class="grid">

        <!-- DATOS -->
        <section class="card">
          <h2>Tus datos</h2>
          <p class="card-desc">Puedes corregirlos aquí mismo cuando quieras.</p>

          <form class="formulario" @submit.prevent="guardarDatos">
            <label>
              Nombre completo
              <input v-model.trim="formulario.nombre" type="text" maxlength="100" required />
            </label>
            <label>
              Número de identificación
              <input :value="datos.usuario.identificacion" type="text" disabled />
              <small>Para corregirlo, envía una solicitud de corrección.</small>
            </label>
            <label>
              Empresa
              <input v-model.trim="formulario.nombre_empresa" type="text" maxlength="150" required />
            </label>
            <label>
              Correo electrónico
              <input v-model.trim="formulario.email" type="email" maxlength="150" required />
            </label>

            <p v-if="mensajeDatos" class="aviso" :class="mensajeDatos.tipo" role="status">
              {{ mensajeDatos.texto }}
            </p>

            <button type="submit" class="btn-primary" :disabled="guardando || !hayCambios">
              {{ guardando ? 'Guardando…' : 'Guardar cambios' }}
            </button>
          </form>
        </section>

        <!-- AUTORIZACIONES -->
        <section class="card">
          <h2>Tus autorizaciones</h2>
          <p class="card-desc">Prueba de cada vez que aceptaste la política de datos.</p>

          <p class="estado" :class="datos.consentimiento_vigente ? 'ok' : 'pendiente'">
            {{ datos.consentimiento_vigente ? '✓' : '⚠' }}
            {{ datos.consentimiento_vigente
              ? `Aceptaste la versión vigente (${datos.version_politica}) de la política.`
              : 'Aún no has aceptado la versión vigente de la política.' }}
          </p>

          <ul v-if="datos.consentimientos.length" class="historial">
            <li v-for="c in datos.consentimientos" :key="c.id">
              <strong>{{ fechaHora(c.fecha) }}</strong>
              <span>
                Política versión {{ c.version_politica }} ·
                {{ c.origen === 'registro' ? 'al crear la cuenta' : 'al iniciar sesión' }}
              </span>
              <span class="detalle">
                Autorizó el tratamiento de datos, aceptó los términos y fue informado del uso de IA.
              </span>
            </li>
          </ul>

          <router-link to="/politica-datos" class="enlace">Leer la política de datos →</router-link>
        </section>

      </div>

      <!-- SOLICITUDES -->
      <section class="card">
        <h2>Solicitudes sobre tus datos</h2>
        <p class="card-desc">
          Se responden en máximo 15 días hábiles (Ley 1581, art. 15). Aquí verás su estado.
        </p>

        <div class="grid solicitudes">
          <form class="formulario" @submit.prevent="enviarSolicitud">
            <label>
              ¿Qué necesitas?
              <select v-model="solicitud.tipo">
                <option v-for="(info, tipo) in TIPOS" :key="tipo" :value="tipo">{{ info.nombre }}</option>
              </select>
            </label>

            <p class="explicacion">{{ TIPOS[solicitud.tipo].explicacion }}</p>

            <label>
              {{ solicitud.tipo === 'rectificacion' ? '¿Qué dato se debe corregir y cuál es el correcto?' : 'Comentario (opcional)' }}
              <textarea
                v-model.trim="solicitud.detalle"
                rows="3"
                maxlength="1000"
                :required="solicitud.tipo === 'rectificacion'"
              ></textarea>
            </label>

            <p v-if="mensajeSolicitud" class="aviso" :class="mensajeSolicitud.tipo" role="status">
              {{ mensajeSolicitud.texto }}
            </p>

            <button
              type="submit"
              class="btn-primary"
              :class="{ peligro: solicitud.tipo !== 'rectificacion' }"
              :disabled="enviando"
            >
              {{ enviando ? 'Enviando…' : 'Enviar solicitud' }}
            </button>
          </form>

          <div>
            <h3>Tus solicitudes</h3>
            <p v-if="!datos.solicitudes.length" class="vacio">No has enviado solicitudes.</p>
            <ul v-else class="historial">
              <li v-for="s in datos.solicitudes" :key="s.id">
                <div class="fila">
                  <strong>{{ TIPOS[s.tipo]?.nombre || s.tipo }}</strong>
                  <span class="estado-chip" :class="claseEstado(s.estado)">{{ s.estado }}</span>
                </div>
                <span>Enviada el {{ fechaHora(s.fecha) }}</span>
                <span v-if="['Recibida', 'En trámite'].includes(s.estado)">
                  Respuesta a más tardar el {{ fechaLarga(s.fecha_limite) }}
                </span>
                <span v-if="s.detalle" class="detalle">“{{ s.detalle }}”</span>
                <span v-if="s.respuesta" class="detalle">Respuesta: {{ s.respuesta }}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- DERECHOS -->
      <section class="card derechos">
        <h2>Tus derechos como titular</h2>
        <ul>
          <li>Conocer, actualizar y corregir tus datos.</li>
          <li>Pedir prueba de tu autorización (la ves arriba, en «Tus autorizaciones»).</li>
          <li>Saber qué uso se ha dado a tus datos.</li>
          <li>Revocar tu autorización o pedir que se eliminen tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).</li>
          <li>Acceder gratis a tus datos.</li>
        </ul>
      </section>
    </template>

  </div>
</template>

<script setup>
// RF20: el titular consulta, actualiza y ejerce sus derechos sobre sus datos.
import { computed, onMounted, reactive, ref } from 'vue'
import axios from 'axios'

const API = 'http://localhost:4000/privacidad'

const TIPOS = {
  rectificacion: {
    nombre: 'Corregir un dato',
    explicacion: 'Úsalo para datos que no puedes cambiar aquí, como tu número de identificación.'
  },
  revocacion: {
    nombre: 'Revocar mi autorización',
    explicacion: 'Dejaremos de tratar tus datos. Como la plataforma no funciona sin ellos, tu cuenta quedará inactiva.'
  },
  eliminacion: {
    nombre: 'Eliminar mis datos',
    explicacion: 'Se eliminará tu cuenta y la información asociada, salvo lo que la ley obligue a conservar. No se puede deshacer.'
  }
}

const datos = ref(null)
const cargando = ref(true)
const errorCarga = ref('')

const formulario = reactive({ nombre: '', nombre_empresa: '', email: '' })
const guardando = ref(false)
const mensajeDatos = ref(null)

const solicitud = reactive({ tipo: 'rectificacion', detalle: '' })
const enviando = ref(false)
const mensajeSolicitud = ref(null)

const encabezados = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })

const hayCambios = computed(() => {
  const u = datos.value?.usuario
  return u && (formulario.nombre !== u.nombre ||
    formulario.nombre_empresa !== u.nombre_empresa ||
    formulario.email !== u.email)
})

function mensajeError(e, porDefecto) {
  if (e.response?.status === 401 || e.response?.status === 403) {
    return 'Tu sesión expiró. Cierra sesión y vuelve a ingresar.'
  }
  return e.response?.data?.error || porDefecto
}

async function cargar() {
  cargando.value = true
  errorCarga.value = ''
  try {
    const { data } = await axios.get(`${API}/mis-datos`, encabezados())
    datos.value = data
    Object.assign(formulario, {
      nombre: data.usuario.nombre,
      nombre_empresa: data.usuario.nombre_empresa,
      email: data.usuario.email
    })
  } catch (e) {
    errorCarga.value = mensajeError(e, 'No fue posible cargar tus datos.')
  } finally {
    cargando.value = false
  }
}

async function guardarDatos() {
  guardando.value = true
  mensajeDatos.value = null
  try {
    const { data } = await axios.put(`${API}/mis-datos`, { ...formulario }, encabezados())
    datos.value.usuario = data.usuario
    Object.assign(formulario, {
      nombre: data.usuario.nombre,
      nombre_empresa: data.usuario.nombre_empresa,
      email: data.usuario.email
    })

    // Mantener al día el nombre que muestra el menú
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    localStorage.setItem('usuario', JSON.stringify({ ...usuario, ...data.usuario }))

    mensajeDatos.value = { tipo: 'exito', texto: '✓ Tus datos se actualizaron.' }
  } catch (e) {
    mensajeDatos.value = { tipo: 'error', texto: mensajeError(e, 'No fue posible guardar tus datos.') }
  } finally {
    guardando.value = false
  }
}

async function enviarSolicitud() {
  if (solicitud.tipo !== 'rectificacion') {
    const confirmar = window.confirm(
      `¿Seguro que quieres enviar la solicitud «${TIPOS[solicitud.tipo].nombre}»?\n\n${TIPOS[solicitud.tipo].explicacion}`
    )
    if (!confirmar) return
  }

  enviando.value = true
  mensajeSolicitud.value = null
  try {
    const { data } = await axios.post(`${API}/solicitudes`, { ...solicitud }, encabezados())
    datos.value.solicitudes.unshift(data.solicitud)
    solicitud.detalle = ''
    mensajeSolicitud.value = {
      tipo: 'exito',
      texto: `✓ Solicitud enviada. Te responderemos a más tardar el ${fechaLarga(data.solicitud.fecha_limite)}.`
    }
  } catch (e) {
    mensajeSolicitud.value = { tipo: 'error', texto: mensajeError(e, 'No fue posible enviar tu solicitud.') }
  } finally {
    enviando.value = false
  }
}

const fechaHora = (valor) =>
  new Date(valor).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

// "2026-12-09" -> "9 de diciembre de 2026" (sin desfase por zona horaria)
const fechaLarga = (texto) => {
  const [anio, mes, dia] = String(texto).slice(0, 10).split('-').map(Number)
  return new Date(anio, mes - 1, dia).toLocaleDateString('es-CO', { dateStyle: 'long' })
}

const claseEstado = (estado) => ({
  'Recibida': 'recibida',
  'En trámite': 'tramite',
  'Resuelta': 'resuelta',
  'Rechazada': 'rechazada'
}[estado] || 'recibida')

onMounted(cargar)
</script>

<style scoped>
.privacidad-container {
  min-height: 100vh;
  padding: 35px;
  background: #f4f7f5;
  color: #24352d;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.privacidad-container * {
  box-sizing: border-box;
}

.header {
  margin-bottom: 26px;
}

.subtitle {
  color: #16875e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.header h1 {
  margin: 9px 0;
  color: #20352b;
  font-size: 30px;
  letter-spacing: -0.7px;
}

.header p {
  max-width: 680px;
  margin: 0;
  color: #7c8982;
  font-size: 13px;
  line-height: 1.6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
  gap: 20px;
}

.card {
  margin-bottom: 20px;
  padding: 24px;
  border: 1px solid #e6ece8;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 4px 18px rgba(33, 58, 44, 0.035);
}

.card h2 {
  margin: 0 0 4px;
  color: #263b30;
  font-size: 17px;
}

.card h3 {
  margin: 0 0 10px;
  color: #34483b;
  font-size: 14px;
}

.card-desc {
  margin: 0 0 18px;
  color: #89958e;
  font-size: 12px;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.formulario label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #34483b;
  font-size: 13px;
  font-weight: 600;
}

.formulario input,
.formulario select,
.formulario textarea {
  width: 100%;
  padding: 11px 13px;
  border: 1px solid #dfe8e2;
  border-radius: 9px;
  background: #fbfcfb;
  color: #34463b;
  font: inherit;
  font-size: 13px;
  font-weight: 400;
}

.formulario input:focus,
.formulario select:focus,
.formulario textarea:focus {
  border-color: #16875e;
  outline: 2px solid rgba(22, 135, 94, 0.15);
}

.formulario input:disabled {
  color: #89958e;
  cursor: not-allowed;
}

.formulario small {
  color: #89958e;
  font-size: 11px;
  font-weight: 400;
}

.explicacion {
  margin: -4px 0 0;
  color: #637168;
  font-size: 12px;
  line-height: 1.5;
}

.btn-primary {
  align-self: flex-start;
  padding: 11px 18px;
  border: none;
  border-radius: 9px;
  background: #16875e;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary.peligro {
  background: #b83a2e;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.aviso {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
}

.aviso.exito {
  border: 1px solid #bfdfd0;
  background: #e8f5ed;
  color: #17654a;
}

.aviso.error {
  border: 1px solid #f3c2c2;
  background: #fdecec;
  color: #9b1c1c;
}

.estado {
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.estado.ok {
  background: #e8f5ed;
  color: #17654a;
}

.estado.pendiente {
  background: #fff8e6;
  color: #6f5300;
}

.historial {
  margin: 0 0 14px;
  padding: 0;
  list-style: none;
}

.historial li {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 11px 0;
  border-bottom: 1px solid #eef2ef;
  color: #637168;
  font-size: 12px;
}

.historial li:last-child {
  border-bottom: none;
}

.historial strong {
  color: #263b30;
  font-size: 13px;
}

.detalle {
  color: #89958e;
  font-style: italic;
}

.fila {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.estado-chip {
  padding: 3px 9px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.estado-chip.recibida { background: #e9f3ff; color: #2f6aa8; }
.estado-chip.tramite { background: #fff3df; color: #8a5a10; }
.estado-chip.resuelta { background: #e8f5ed; color: #17654a; }
.estado-chip.rechazada { background: #fdecec; color: #9b1c1c; }

.enlace {
  color: #16875e;
  font-size: 13px;
  font-weight: 600;
}

.vacio {
  color: #89958e;
  font-size: 13px;
}

.derechos ul {
  margin: 8px 0 0;
  padding-left: 18px;
  color: #3d4944;
  font-size: 13px;
  line-height: 1.8;
}

.message {
  padding: 60px 20px;
  color: #89958e;
  text-align: center;
}

.loader {
  width: 34px;
  height: 34px;
  margin: 0 auto 16px;
  border: 3px solid #e1eee7;
  border-top-color: #16875e;
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

.error-message {
  padding: 17px 20px;
  border: 1px solid #f8dddd;
  border-radius: 9px;
  background: #fff1f0;
  color: #c0392b;
  font-size: 13px;
}

@media (max-width: 700px) {
  .privacidad-container {
    padding: 18px;
  }

  .header h1 {
    font-size: 25px;
  }
}
</style>