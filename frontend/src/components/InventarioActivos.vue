
<template>
  <div class="activos-wrapper">

    <!-- PANEL LATERAL -->
    <aside class="brand-panel">
      <div class="brand-content">
        <span class="brand-label">GRC IA · GESTIÓN INTELIGENTE</span>

        <h1>
          Identifica tus activos.
          Anticipa los riesgos.
        </h1>

        <p class="brand-description">
          Registra los recursos tecnológicos de tu empresa y descubre
          posibles amenazas, vulnerabilidades y acciones para mejorar
          su seguridad.
        </p>
      </div>

      <div class="ai-message">
        <div class="ai-title">
          <span class="sparkle">✦</span>
          CLARA IA SECURITY ANALYST
        </div>

        <p>
          "Conocer tus activos es el primer paso para proteger
          la información y la continuidad de tu empresa."
        </p>
      </div>

      <footer class="brand-footer">
        © 2026 GRC IA. Todos los derechos reservados.
      </footer>
    </aside>

    <!-- PANEL PRINCIPAL -->
    <main class="form-panel">
      <div class="content-container">

        <!-- ENCABEZADO -->
        <header class="page-header">
          <div>
            <span class="section-label">GESTIÓN DE ACTIVOS</span>
            <h2>Identificación de activos tecnológicos</h2>
            <p>
              Responde las preguntas para conocer los riesgos asociados
              a los recursos tecnológicos de tu organización.
            </p>
          </div>

          <button
            type="button"
            class="back-button"
            @click="volver"
          >
            ← Volver
          </button>
        </header>

        <!-- PROGRESO -->
        <section class="progress-section">
          <div class="progress-info">
            <span>Paso {{ paso }} de 4</span>
            <span>{{ porcentaje }}% completado</span>
          </div>

          <div class="progress-track">
            <div
              class="progress-fill"
              :style="{ width: porcentaje + '%' }"
            ></div>
          </div>

          <div class="steps-indicator">
            <div
              v-for="numero in 4"
              :key="numero"
              class="step-item"
              :class="{
                active: paso === numero,
                completed: paso > numero
              }"
            >
              <span class="step-number">
                <template v-if="paso > numero">✓</template>
                <template v-else>{{ numero }}</template>
              </span>

              <span class="step-name">
                {{
                  [
                    'Información',
                    'Impacto',
                    'Protección',
                    'Revisión'
                  ][numero - 1]
                }}
              </span>
            </div>
          </div>
        </section>

        <!-- MENSAJES -->
        <div v-if="mensaje" class="alert alert-error">
          {{ mensaje }}
        </div>

        <div v-if="errorServidor" class="alert alert-error">
          {{ errorServidor }}
        </div>

        <!-- FORMULARIO -->
        <form
          v-if="!resultado"
          class="asset-card"
          @submit.prevent="paso < 4 ? siguiente() : analizarActivo()"
        >

          <!-- PASO 1 -->
          <section v-if="paso === 1" class="form-step">
            <div class="step-heading">
              <div class="heading-icon">01</div>
              <div>
                <h3>Información del activo</h3>
                <p>
                  Cuéntanos qué recurso tecnológico deseas proteger.
                </p>
              </div>
            </div>

            <div class="form-group">
              <label for="nombre_activo">Nombre del activo *</label>
              <input
                id="nombre_activo"
                v-model.trim="form.nombre_activo"
                type="text"
                placeholder="Ej. Computador del área administrativa"
                required
              />
            </div>

            <div class="form-group">
              <label for="tipo_activo">Tipo de activo *</label>
              <select
                id="tipo_activo"
                v-model="form.tipo_activo"
                required
              >
                <option disabled value="">Selecciona el tipo</option>
                <option value="Computador">Computador o portátil</option>
                <option value="Servidor">Servidor</option>
                <option value="Base de datos">Base de datos</option>
                <option value="Red">Red o dispositivo de red</option>
                <option value="Aplicación">Aplicación o software</option>
                <option value="Servicio en la nube">Servicio en la nube</option>
                <option value="Dispositivo móvil">Dispositivo móvil</option>
                <option value="Sistema de información">
                  Sistema de información
                </option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="uso">¿Para qué se utiliza? *</label>
              <textarea
                id="uso"
                v-model.trim="form.uso"
                placeholder="Ej. Almacenar información de clientes, facturas y ventas."
                rows="3"
                required
              ></textarea>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label for="area">Área de la empresa *</label>
                <select
                  id="area"
                  v-model="form.area"
                  required
                >
                  <option disabled value="">Selecciona un área</option>
                  <option value="Administración">Administración</option>
                  <option value="Finanzas">Finanzas</option>
                  <option value="Ventas">Ventas</option>
                  <option value="Recursos humanos">Recursos humanos</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Operaciones">Operaciones</option>
                  <option value="Atención al cliente">Atención al cliente</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div class="form-group">
                <label for="responsable">Responsable del activo</label>
                <input
                  id="responsable"
                  v-model.trim="form.responsable"
                  type="text"
                  placeholder="Ej. Administrador"
                />
              </div>
            </div>
          </section>

          <!-- PASO 2 -->
          <section v-if="paso === 2" class="form-step">
            <div class="step-heading">
              <div class="heading-icon">02</div>
              <div>
                <h3>Información e impacto</h3>
                <p>
                  Identifica qué información maneja el activo y qué
                  sucedería si deja de funcionar.
                </p>
              </div>
            </div>

            <div class="form-group">
              <label>¿Qué tipo de información almacena o procesa? *</label>

              <div class="options-grid">
                <label
                  v-for="dato in opcionesDatos"
                  :key="dato"
                  class="option-card"
                  :class="{ selected: form.datos.includes(dato) }"
                >
                  <input
                    v-model="form.datos"
                    type="checkbox"
                    :value="dato"
                  />
                  <span>{{ dato }}</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>
                ¿Qué consecuencias tendría perder el acceso a este activo? *
              </label>

              <div class="options-list">
                <label
                  v-for="impacto in opcionesImpacto"
                  :key="impacto"
                  class="option-row"
                  :class="{ selected: form.impacto.includes(impacto) }"
                >
                  <input
                    v-model="form.impacto"
                    type="checkbox"
                    :value="impacto"
                  />
                  <span>{{ impacto }}</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="acceso">
                ¿Quién puede acceder al activo? *
              </label>

              <select id="acceso" v-model="form.acceso" required>
                <option disabled value="">Selecciona una opción</option>
                <option value="Solo personal autorizado">
                  Solo personal autorizado
                </option>
                <option value="Varios empleados">
                  Varios empleados de la empresa
                </option>
                <option value="Todos los empleados">
                  Todos los empleados
                </option>
                <option value="Usuarios externos">
                  También usuarios externos o clientes
                </option>
                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="dependencia">
                ¿Qué tan dependiente es la empresa de este activo? *
              </label>

              <select
                id="dependencia"
                v-model="form.dependencia"
                required
              >
                <option disabled value="">Selecciona una opción</option>
                <option value="Alta">
                  Alta: la empresa casi no puede operar sin él
                </option>
                <option value="Media">
                  Media: afecta algunas actividades
                </option>
                <option value="Baja">
                  Baja: existen alternativas para continuar
                </option>
              </select>
            </div>
          </section>

          <!-- PASO 3 -->
          <section v-if="paso === 3" class="form-step">
            <div class="step-heading">
              <div class="heading-icon">03</div>
              <div>
                <h3>Medidas de protección</h3>
                <p>
                  Indica qué medidas de seguridad tiene actualmente
                  el activo.
                </p>
              </div>
            </div>

            <div class="form-group">
              <label for="copias">
                ¿Se realizan copias de seguridad? *
              </label>

              <select id="copias" v-model="form.copias" required>
                <option disabled value="">Selecciona una opción</option>
                <option value="Sí, periódicamente">
                  Sí, periódicamente
                </option>
                <option value="Sí, pero no son periódicas">
                  Sí, pero no son periódicas
                </option>
                <option value="No se realizan">
                  No se realizan
                </option>
                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="actualizaciones">
                ¿El sistema se mantiene actualizado? *
              </label>

              <select
                id="actualizaciones"
                v-model="form.actualizaciones"
                required
              >
                <option disabled value="">Selecciona una opción</option>
                <option value="Sí, regularmente">
                  Sí, regularmente
                </option>
                <option value="Solo cuando hay problemas">
                  Solo cuando hay problemas
                </option>
                <option value="No se actualiza">
                  No se actualiza
                </option>
                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="proteccion">
                ¿Qué medidas de protección utiliza? *
              </label>

              <select id="proteccion" v-model="form.proteccion" required>
                <option disabled value="">Selecciona una opción</option>
                <option value="Antivirus y firewall">
                  Antivirus y firewall
                </option>
                <option value="Solo antivirus">Solo antivirus</option>
                <option value="Solo firewall">Solo firewall</option>
                <option value="Otras medidas">
                  Otras medidas de seguridad
                </option>
                <option value="Ninguna">
                  No tiene medidas conocidas
                </option>
                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="control_acceso">
                ¿Cómo se controla el acceso? *
              </label>

              <select
                id="control_acceso"
                v-model="form.control_acceso"
                required
              >
                <option disabled value="">Selecciona una opción</option>
                <option value="Usuario y contraseña individuales">
                  Usuario y contraseña individuales
                </option>
                <option value="Cuentas compartidas">
                  Se comparten usuarios o contraseñas
                </option>
                <option value="Sin control de acceso">
                  No existe un control definido
                </option>
                <option value="Autenticación multifactor">
                  Autenticación multifactor
                </option>
                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="ubicacion_datos">
                ¿Dónde se almacena la información? *
              </label>

              <select
                id="ubicacion_datos"
                v-model="form.ubicacion_datos"
                required
              >
                <option disabled value="">Selecciona una opción</option>
                <option value="Equipo local">
                  En el equipo o servidor de la empresa
                </option>
                <option value="Nube">
                  En un servicio en la nube
                </option>
                <option value="Local y nube">
                  Tanto localmente como en la nube
                </option>
                <option value="Dispositivos externos">
                  En discos o dispositivos externos
                </option>
                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>
          </section>

          <!-- PASO 4 -->
          <section v-if="paso === 4" class="form-step">
            <div class="step-heading">
              <div class="heading-icon">04</div>
              <div>
                <h3>Incidentes y revisión</h3>
                <p>
                  Revisa la información antes de solicitar el análisis.
                </p>
              </div>
            </div>

            <div class="form-group">
              <label for="incidentes">
                ¿Has observado incidentes o situaciones sospechosas? *
              </label>

              <select id="incidentes" v-model="form.incidentes" required>
                <option disabled value="">Selecciona una opción</option>
                <option value="Sí">
                  Sí, he observado situaciones sospechosas
                </option>
                <option value="No">
                  No he observado incidentes
                </option>
                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="observaciones">
                Observaciones adicionales
              </label>

              <textarea
                id="observaciones"
                v-model.trim="form.observaciones"
                rows="4"
                placeholder="Describe cualquier detalle importante sobre el activo."
              ></textarea>
            </div>

            <div class="review-card">
              <div class="review-heading">
                <span class="review-icon">✓</span>
                <div>
                  <h4>Resumen del activo</h4>
                  <p>Verifica los datos registrados.</p>
                </div>
              </div>

              <div class="review-row">
                <span>Nombre</span>
                <strong>{{ form.nombre_activo }}</strong>
              </div>

              <div class="review-row">
                <span>Tipo</span>
                <strong>{{ form.tipo_activo }}</strong>
              </div>

              <div class="review-row">
                <span>Área</span>
                <strong>{{ form.area }}</strong>
              </div>

              <div class="review-row">
                <span>Información</span>
                <strong>{{ form.datos.join(", ") || "Sin seleccionar" }}</strong>
              </div>

              <div class="review-row">
                <span>Dependencia</span>
                <strong>{{ form.dependencia }}</strong>
              </div>
            </div>

            <div class="notice">
              <span class="notice-icon">i</span>
              <p>
                El análisis identificará riesgos potenciales a partir
                de tus respuestas. Los resultados no sustituyen una
                verificación técnica del activo.
              </p>
            </div>
          </section>

          <!-- BOTONES DE NAVEGACIÓN -->
          <footer class="form-actions">
            <button
              v-if="paso > 1"
              type="button"
              class="secondary-button"
              @click="anterior"
            >
              ← Anterior
            </button>

            <span v-else></span>

            <button
              type="submit"
              class="primary-button"
              :disabled="cargando"
            >
              <template v-if="paso < 4">
                Continuar →
              </template>

              <template v-else>
                {{ cargando ? "Analizando..." : "Analizar riesgos" }}
              </template>
            </button>
          </footer>
        </form>

        <!-- RESULTADOS DEL ANÁLISIS -->
        <section v-else class="asset-card results-card">
          <div class="results-header">
            <div class="results-icon">✦</div>
            <span class="section-label">ANÁLISIS COMPLETADO</span>
            <h3>Resultados de la evaluación</h3>
            <p>
              Activo analizado:
              <strong>{{ form.nombre_activo }}</strong>
            </p>
          </div>

          <div v-if="resultado.resumen" class="result-section">
            <h4>Resumen</h4>
            <p>{{ resultado.resumen }}</p>
          </div>

          <div class="result-section">
            <h4>Posibles amenazas</h4>

            <ul v-if="resultado.amenazas?.length">
              <li v-for="(item, index) in resultado.amenazas" :key="index">
                {{ mostrarItem(item) }}
              </li>
            </ul>

            <p v-else class="empty-result">
              No se proporcionaron amenazas en la respuesta.
            </p>
          </div>

          <div class="result-section">
            <h4>Posibles vulnerabilidades</h4>

            <ul v-if="resultado.vulnerabilidades?.length">
              <li
                v-for="(item, index) in resultado.vulnerabilidades"
                :key="index"
              >
                {{ mostrarItem(item) }}
              </li>
            </ul>

            <p v-else class="empty-result">
              No se proporcionaron vulnerabilidades en la respuesta.
            </p>
          </div>

          <div class="result-section">
            <h4>Riesgos identificados</h4>

            <ul v-if="resultado.riesgos?.length">
              <li v-for="(item, index) in resultado.riesgos" :key="index">
                {{ mostrarItem(item) }}
              </li>
            </ul>

            <p v-else class="empty-result">
              No se proporcionaron riesgos en la respuesta.
            </p>
          </div>

          <div class="result-section">
            <h4>Recomendaciones</h4>

            <ol v-if="resultado.recomendaciones?.length">
              <li
                v-for="(item, index) in resultado.recomendaciones"
                :key="index"
              >
                {{ mostrarItem(item) }}
              </li>
            </ol>

            <p v-else class="empty-result">
              No se proporcionaron recomendaciones en la respuesta.
            </p>
          </div>

          <div class="notice">
            <span class="notice-icon">i</span>
            <p>
              Estos resultados son una evaluación preliminar basada
              en las respuestas registradas. Las vulnerabilidades
              deben verificarse mediante una revisión técnica.
            </p>
          </div>

          <div class="form-actions result-actions">
            <button
              type="button"
              class="secondary-button"
              @click="reiniciar"
            >
              Registrar otro activo
            </button>

            <button
              type="button"
              class="primary-button"
              @click="volver"
            >
              Volver al panel
            </button>
          </div>
        </section>

        <p class="security-footer">
          GRC IA · Identificación inteligente de riesgos tecnológicos
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

const paso = ref(1);
const cargando = ref(false);
const mensaje = ref("");
const errorServidor = ref("");
const resultado = ref(null);

const opcionesDatos = [
  "Datos personales de clientes",
  "Información financiera",
  "Información de empleados",
  "Documentos internos",
  "Credenciales y contraseñas",
  "Información comercial",
  "Información pública",
  "Otros datos"
];

const opcionesImpacto = [
  "Pérdida de información",
  "Interrupción de las operaciones",
  "Pérdidas económicas",
  "Exposición de datos personales",
  "Daño a la reputación de la empresa",
  "Incumplimiento de obligaciones legales"
];

const form = reactive({
  nombre_activo: "",
  tipo_activo: "",
  uso: "",
  area: "",
  responsable: "",
  datos: [],
  impacto: [],
  acceso: "",
  dependencia: "",
  copias: "",
  actualizaciones: "",
  proteccion: "",
  control_acceso: "",
  ubicacion_datos: "",
  incidentes: "",
  observaciones: ""
});

const porcentaje = computed(() => paso.value * 25);

function validarPaso() {
  mensaje.value = "";

  if (paso.value === 1) {
    if (
      !form.nombre_activo ||
      !form.tipo_activo ||
      !form.uso ||
      !form.area
    ) {
      mensaje.value = "Completa los campos obligatorios para continuar.";
      return false;
    }
  }

  if (paso.value === 2) {
    if (
      form.datos.length === 0 ||
      form.impacto.length === 0 ||
      !form.acceso ||
      !form.dependencia
    ) {
      mensaje.value =
        "Selecciona al menos un tipo de información, un impacto y completa las demás preguntas.";
      return false;
    }
  }

  if (paso.value === 3) {
    if (
      !form.copias ||
      !form.actualizaciones ||
      !form.proteccion ||
      !form.control_acceso ||
      !form.ubicacion_datos
    ) {
      mensaje.value = "Responde todas las preguntas de protección.";
      return false;
    }
  }

  if (paso.value === 4 && !form.incidentes) {
    mensaje.value = "Responde la pregunta sobre incidentes.";
    return false;
  }

  return true;
}

function siguiente() {
  if (!validarPaso()) return;

  if (paso.value < 4) {
    paso.value++;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function anterior() {
  mensaje.value = "";

  if (paso.value > 1) {
    paso.value--;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function mostrarItem(item) {
  if (typeof item === "string") return item;

  if (item && typeof item === "object") {
    return (
      item.descripcion ||
      item.nombre ||
      item.riesgo ||
      item.recomendacion ||
      JSON.stringify(item)
    );
  }

  return String(item ?? "");
}

async function analizarActivo() {
  if (!validarPaso()) return;

  cargando.value = true;
  mensaje.value = "";
  errorServidor.value = "";

  try {
    const token = localStorage.getItem("token");

    if (!token) {
      errorServidor.value =
        "Tu sesión no está activa. Inicia sesión para continuar.";
      return;
    }

    const datosEnviar = {
      ...form,
      datos: [...form.datos],
      impacto: [...form.impacto]
    };

    const response = await axios.post(
      "http://localhost:4000/activos/analizar",
      datosEnviar,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const datosResultado = response.data?.resultado ?? response.data;

    if (!datosResultado || typeof datosResultado !== "object") {
      throw new Error("El servidor no devolvió un resultado válido.");
    }

    resultado.value = {
      resumen: datosResultado.resumen ?? "",
      amenazas: Array.isArray(datosResultado.amenazas)
        ? datosResultado.amenazas
        : [],
      vulnerabilidades: Array.isArray(datosResultado.vulnerabilidades)
        ? datosResultado.vulnerabilidades
        : [],
      riesgos: Array.isArray(datosResultado.riesgos)
        ? datosResultado.riesgos
        : [],
      recomendaciones: Array.isArray(datosResultado.recomendaciones)
        ? datosResultado.recomendaciones
        : []
    };

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Error al analizar el activo:", error);

    errorServidor.value =
      error.response?.data?.error ||
      error.response?.data?.mensaje ||
      error.message ||
      "No fue posible analizar el activo. Intenta nuevamente.";
  } finally {
    cargando.value = false;
  }
}

function reiniciar() {
  Object.assign(form, {
    nombre_activo: "",
    tipo_activo: "",
    uso: "",
    area: "",
    responsable: "",
    datos: [],
    impacto: [],
    acceso: "",
    dependencia: "",
    copias: "",
    actualizaciones: "",
    proteccion: "",
    control_acceso: "",
    ubicacion_datos: "",
    incidentes: "",
    observaciones: ""
  });

  paso.value = 1;
  mensaje.value = "";
  errorServidor.value = "";
  resultado.value = null;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function volver() {
  router.push("/dashboard");
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.activos-wrapper {
  display: grid;
  grid-template-columns: 34% 66%;
  min-height: 100vh;
  width: 100%;
  color: #243238;
  font-family: Inter, "Segoe UI", Arial, sans-serif;
}

/* PANEL LATERAL */

.brand-panel {
  position: sticky;
  top: 0;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  padding: 70px 9%;
  overflow-y: auto;
  background: #102629;
  color: #fff;
}

.brand-label {
  display: inline-block;
  margin-bottom: 22px;
  color: #39b6a5;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 1.2px;
}

.brand-content h1 {
  max-width: 470px;
  margin: 0;
  font-size: clamp(29px, 3vw, 43px);
  line-height: 1.2;
  font-weight: 750;
  letter-spacing: -0.9px;
}

.brand-description {
  max-width: 420px;
  margin-top: 22px;
  color: #afc0c1;
  font-size: 14px;
  line-height: 1.8;
}

.ai-message {
  max-width: 450px;
  margin-top: auto;
  padding: 22px;
  border: 1px solid rgba(185, 213, 210, 0.3);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
}

.ai-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #45b6a6;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.5px;
}

.sparkle {
  margin-right: 8px;
  font-size: 20px;
}

.ai-message p {
  margin: 0;
  color: #e2ebeb;
  font-size: 13px;
  line-height: 1.7;
}

.brand-footer {
  margin-top: 28px;
  color: #91a6a7;
  font-size: 11px;
}

/* PANEL PRINCIPAL */

.form-panel {
  min-width: 0;
  min-height: 100vh;
  padding: 45px clamp(22px, 5vw, 70px);
  background: #f4f6f7;
}

.content-container {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.section-label {
  display: inline-block;
  margin-bottom: 10px;
  color: #168477;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.page-header h2 {
  margin: 0;
  color: #1d2c30;
  font-size: clamp(23px, 2.3vw, 30px);
  line-height: 1.25;
  letter-spacing: -0.6px;
}

.page-header p {
  max-width: 600px;
  margin: 12px 0 0;
  color: #77858a;
  font-size: 13px;
  line-height: 1.7;
}

.back-button {
  flex-shrink: 0;
  padding: 10px 13px;
  border: 1px solid #d8e1e3;
  border-radius: 8px;
  background: #fff;
  color: #53656a;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.back-button:hover {
  border-color: #168477;
  color: #168477;
}

/* PROGRESO */

.progress-section {
  margin-bottom: 24px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  color: #69797e;
  font-size: 11px;
  font-weight: 650;
}

.progress-track {
  width: 100%;
  height: 6px;
  overflow: hidden;
  border-radius: 20px;
  background: #dfe7e8;
}

.progress-fill {
  height: 100%;
  border-radius: inherit;
  background: #188477;
  transition: width 0.25s ease;
}

.steps-indicator {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 22px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  color: #879498;
  font-size: 11px;
}

.step-number {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 27px;
  height: 27px;
  border: 1px solid #d6dfe1;
  border-radius: 50%;
  background: #fff;
  font-size: 11px;
  font-weight: 750;
}

.step-item.active {
  color: #137a6f;
  font-weight: 750;
}

.step-item.active .step-number,
.step-item.completed .step-number {
  border-color: #167b70;
  background: #167b70;
  color: #fff;
}

.step-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* TARJETA */

.asset-card {
  padding: clamp(22px, 3.5vw, 38px);
  border: 1px solid #e0e7e9;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 7px 28px rgba(24, 47, 53, 0.035);
}

.step-heading {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 29px;
}

.heading-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 43px;
  height: 43px;
  border-radius: 11px;
  background: #e5f4f1;
  color: #15796e;
  font-size: 14px;
  font-weight: 800;
}

.step-heading h3 {
  margin: 0;
  color: #233338;
  font-size: 19px;
  font-weight: 750;
}

.step-heading p {
  margin: 6px 0 0;
  color: #7a898e;
  font-size: 12px;
  line-height: 1.6;
}

/* CAMPOS */

.form-group {
  margin-bottom: 23px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  margin-bottom: 9px;
  color: #354449;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.6;
}

.form-group input:not([type="checkbox"]),
.form-group select,
.form-group textarea {
  display: block;
  width: 100%;
  min-height: 44px;
  padding: 11px 13px;
  border: 1px solid #d8e1e4;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #28393e;
  font-family: inherit;
  font-size: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group textarea {
  min-height: 95px;
  resize: vertical;
  line-height: 1.6;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9aa6aa;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #188477;
  box-shadow: 0 0 0 3px rgba(24, 132, 119, 0.09);
}

.form-group select {
  cursor: pointer;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

/* OPCIONES */

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.option-card,
.option-row {
  display: flex !important;
  align-items: center;
  gap: 10px;
  margin: 0 !important;
  border: 1px solid #e0e7e9;
  border-radius: 8px;
  background: #fff;
  color: #526267 !important;
  cursor: pointer;
  font-size: 11px !important;
  font-weight: 550 !important;
  transition: border-color 0.2s, background 0.2s;
}

.option-card {
  min-height: 52px;
  padding: 12px;
}

.option-row {
  min-height: 44px;
  padding: 11px 13px;
}

.option-card:hover,
.option-row:hover {
  border-color: #80bdb5;
}

.option-card.selected,
.option-row.selected {
  border-color: #21877b;
  background: #eff8f6;
  color: #176f65 !important;
}

.option-card input,
.option-row input {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: #167b70;
}

.options-list {
  display: grid;
  gap: 8px;
}

/* AVISOS */

.alert {
  margin-bottom: 18px;
  padding: 13px 15px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.6;
}

.alert-error {
  border: 1px solid #f1c6c3;
  background: #fff2f1;
  color: #a3342c;
}

.notice {
  display: flex;
  align-items: flex-start;
  gap: 11px;
  margin-top: 24px;
  padding: 15px;
  border: 1px solid #d8e9e6;
  border-radius: 9px;
  background: #f1f8f7;
}

.notice-icon {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #d9eeea;
  color: #16796e;
  font-size: 12px;
  font-weight: 800;
}

.notice p {
  margin: 0;
  color: #59716f;
  font-size: 11px;
  line-height: 1.7;
}

/* RESUMEN */

.review-card {
  padding: 20px;
  border: 1px solid #e0e8e9;
  border-radius: 10px;
  background: #fafcfc;
}

.review-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 17px;
}

.review-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: #e0f2ee;
  color: #14796d;
  font-size: 15px;
  font-weight: 800;
}

.review-heading h4 {
  margin: 0;
  color: #293a3e;
  font-size: 13px;
}

.review-heading p {
  margin: 4px 0 0;
  color: #839095;
  font-size: 11px;
}

.review-row {
  display: grid;
  grid-template-columns: 125px minmax(0, 1fr);
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #e8eded;
  font-size: 11px;
  line-height: 1.6;
}

.review-row > span {
  color: #849095;
}

.review-row strong {
  overflow-wrap: anywhere;
  color: #35464a;
  font-weight: 650;
}

/* BOTONES */

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 30px;
  padding-top: 23px;
  border-top: 1px solid #edf0f1;
}

.primary-button,
.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 19px;
  border-radius: 8px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 750;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.primary-button {
  border: 1px solid #176f65;
  background: #176f65;
  color: #fff;
}

.primary-button:hover:not(:disabled) {
  border-color: #10584f;
  background: #10584f;
}

.primary-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.secondary-button {
  border: 1px solid #d6e0e2;
  background: #fff;
  color: #526368;
}

.secondary-button:hover {
  border-color: #188477;
  background: #f4faf9;
  color: #176f65;
}

/* RESULTADOS */

.results-card {
  padding-top: 35px;
}

.results-header {
  padding-bottom: 25px;
  border-bottom: 1px solid #e8eeee;
  text-align: center;
}

.results-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 53px;
  height: 53px;
  margin: 0 auto 15px;
  border-radius: 15px;
  background: #e3f4f0;
  color: #17796d;
  font-size: 27px;
}

.results-header h3 {
  margin: 3px 0 10px;
  color: #233338;
  font-size: 23px;
}

.results-header p {
  margin: 0;
  color: #718187;
  font-size: 12px;
  line-height: 1.6;
}

.results-header strong {
  color: #34464b;
}

.result-section {
  padding: 22px 0;
  border-bottom: 1px solid #e8eeee;
}

.result-section h4 {
  margin: 0 0 13px;
  color: #26393e;
  font-size: 14px;
}

.result-section p,
.result-section li {
  color: #617277;
  font-size: 12px;
  line-height: 1.8;
}

.result-section p {
  margin: 0;
}

.result-section ul,
.result-section ol {
  display: grid;
  gap: 9px;
  margin: 0;
  padding-left: 22px;
}

.result-section li {
  padding-left: 3px;
}

.empty-result {
  color: #89969a !important;
  font-style: italic;
}

.result-actions {
  flex-wrap: wrap;
}

/* PIE */

.security-footer {
  margin: 25px 0 0;
  color: #9aa6aa;
  font-size: 10px;
  line-height: 1.6;
  text-align: center;
}

/* RESPONSIVE */

@media (max-width: 1050px) {
  .activos-wrapper {
    grid-template-columns: 30% 70%;
  }

  .brand-panel {
    padding: 55px 8%;
  }

  .brand-content h1 {
    font-size: 30px;
  }

  .form-panel {
    padding: 35px 25px;
  }

  .step-name {
    font-size: 10px;
  }
}

@media (max-width: 760px) {
  .activos-wrapper {
    display: flex;
    flex-direction: column;
  }

  .brand-panel {
    position: relative;
    height: auto;
    min-height: auto;
    padding: 32px 25px;
    overflow: visible;
  }

  .brand-content h1 {
    max-width: 520px;
    font-size: 31px;
  }

  .brand-description {
    margin-top: 15px;
  }

  .ai-message {
    margin-top: 24px;
    padding: 17px;
  }

  .brand-footer {
    margin-top: 20px;
  }

  .form-panel {
    min-height: auto;
    padding: 28px 18px;
  }

  .page-header {
    flex-direction: column-reverse;
    gap: 16px;
  }

  .back-button {
    align-self: flex-start;
  }

  .steps-indicator {
    gap: 5px;
  }

  .step-item {
    flex-direction: column;
    justify-content: center;
    gap: 6px;
    text-align: center;
  }

  .step-name {
    max-width: 100%;
    font-size: 10px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media (max-width: 480px) {
  .asset-card {
    padding: 20px 16px;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .step-heading {
    align-items: flex-start;
  }

  .step-heading h3 {
    font-size: 17px;
  }

  .review-row {
    grid-template-columns: 95px minmax(0, 1fr);
  }

  .form-actions {
    gap: 8px;
  }

  .primary-button,
  .secondary-button {
    padding: 0 12px;
    font-size: 11px;
  }

  .result-actions {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
