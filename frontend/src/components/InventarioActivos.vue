<template>
  <div class="activos-wrapper">

    <!-- PANEL IZQUIERDO -->
    <aside class="brand-panel">
      <div class="brand-content">
        <span class="brand-label">GRC IA · GESTIÓN INTELIGENTE</span>

        <h1>Identifica tus activos. Anticipa los riesgos.</h1>

        <p class="brand-description">
          Registra los recursos tecnológicos de tu empresa y evalúa su importancia
          desde la confidencialidad, integridad y disponibilidad.
        </p>
      </div>

      <div class="ai-message">
        <div class="ai-title">
          <span class="sparkle">✦</span>
          CLARA IA SECURITY ANALYST
        </div>

        <p>
          "Conocer tus activos es el primer paso para proteger la información
          y la continuidad de tu empresa."
        </p>
      </div>

      <footer class="brand-footer">
        © 2026 GRC IA. Todos los derechos reservados.
      </footer>
    </aside>

    <!-- PANEL DERECHO -->
    <main class="form-panel">
      <div class="content-container">

        <header class="page-header">
          <div>
            <span class="section-label">
              GESTIÓN DE ACTIVOS Y RIESGOS
            </span>

            <h2>Registro y evaluación del activo</h2>

            <p>
              Responde las preguntas para conocer la importancia y las
              condiciones de seguridad del activo.
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
            <span>
              Paso {{ paso }} de {{ nombresPasos.length }}
            </span>

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
              v-for="(nombre, index) in nombresPasos"
              :key="nombre"
              class="step-item"
              :class="{
                active: paso === index + 1,
                completed: paso > index + 1
              }"
            >
              <span class="step-number">
                {{ paso > index + 1 ? '✓' : index + 1 }}
              </span>

              <span class="step-name">
                {{ nombre }}
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

        <div v-if="guardado" class="alert alert-success">
          {{ guardado }}
        </div>

        <form
          class="asset-card"
          @submit.prevent="
            paso < nombresPasos.length
              ? siguiente()
              : registrarActivo()
          "
        >

          <!-- ================================= -->
          <!-- PASO 1: IDENTIFICACIÓN DEL ACTIVO -->
          <!-- ================================= -->

          <section v-if="paso === 1" class="form-step">

            <div class="step-heading">
              <div class="heading-icon">01</div>

              <div>
                <h3>Identificación del activo</h3>

                <p>
                  Identifica el recurso tecnológico, su función
                  y el área responsable.
                </p>
              </div>
            </div>

            <div class="form-group">
              <label for="nombre_activo">
                Nombre del activo *
              </label>

              <input
                id="nombre_activo"
                v-model.trim="form.nombre_activo"
                type="text"
                placeholder="Ej. Servidor de bases de datos"
              />
            </div>

            <div class="form-group">
              <label for="tipo_activo">
                Tipo de activo *
              </label>

              <select
                id="tipo_activo"
                v-model="form.tipo_activo"
              >
                <option disabled value="">
                  Selecciona el tipo
                </option>

                <option
                  v-for="tipo in tiposActivo"
                  :key="tipo"
                  :value="tipo"
                >
                  {{ tipo }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="uso">
                ¿Para qué se utiliza este activo? *
              </label>

              <textarea
                id="uso"
                v-model.trim="form.uso"
                rows="3"
                placeholder="Ej. Almacenar información de clientes, facturas y ventas."
              ></textarea>
            </div>

            <div class="form-grid">

              <div class="form-group">
                <label for="area">
                  Área de la empresa *
                </label>

                <select
                  id="area"
                  v-model="form.area"
                >
                  <option disabled value="">
                    Selecciona un área
                  </option>

                  <option
                    v-for="area in areas"
                    :key="area"
                    :value="area"
                  >
                    {{ area }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="responsable">
                  Responsable del activo
                </label>

                <input
                  id="responsable"
                  v-model.trim="form.responsable"
                  type="text"
                  placeholder="Ej. Administrador de TI"
                />
              </div>

            </div>

            <div class="form-group">
              <label for="propietario">
                Propietario o área que autoriza su uso
              </label>

              <input
                id="propietario"
                v-model.trim="form.propietario"
                type="text"
                placeholder="Ej. Dirección administrativa"
              />
            </div>

          </section>


          <!-- =========================== -->
          <!-- PASO 2: CONFIDENCIALIDAD     -->
          <!-- =========================== -->

          <section v-if="paso === 2" class="form-step">

            <div class="step-heading">
              <div class="heading-icon">02</div>

              <div>
                <h3>Confidencialidad</h3>

                <p>
                  Evalúa cómo se protege la información frente
                  al acceso o divulgación no autorizados.
                </p>
              </div>
            </div>

            <div class="cia-explanation">
              <strong>Confidencialidad:</strong>
              la información solo debe ser conocida o consultada
              por personas, procesos o entidades autorizadas.
            </div>

            <div class="form-group">
              <label>
                ¿Qué tipo de información almacena o procesa el activo?
              </label>

              <div class="options-grid">

                <label
                  v-for="dato in opcionesDatos"
                  :key="dato"
                  class="option-card"
                  :class="{
                    selected: form.datos.includes(dato)
                  }"
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
              <label for="clasificacion">
                ¿Cómo clasificarías la información? *
              </label>

              <select
                id="clasificacion"
                v-model="form.clasificacion"
              >
                <option disabled value="">
                  Selecciona una clasificación
                </option>

                <option value="Pública">
                  Pública: puede ser conocida por cualquier persona
                </option>

                <option value="Interna">
                  Interna: solo para uso dentro de la organización
                </option>

                <option value="Confidencial">
                  Confidencial: acceso restringido a personal autorizado
                </option>

                <option value="Restringida">
                  Restringida: información altamente sensible o crítica
                </option>

                <option value="No estoy seguro">
                  No estoy seguro
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="acceso">
                ¿Quién puede acceder a la información o al activo? *
              </label>

              <select
                id="acceso"
                v-model="form.acceso"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>Solo personal autorizado</option>
                <option>Varios empleados de la empresa</option>
                <option>Todos los empleados</option>
                <option>Usuarios externos o clientes</option>
                <option>No existe una restricción definida</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="control_acceso">
                ¿Cómo se controla el acceso? *
              </label>

              <select
                id="control_acceso"
                v-model="form.control_acceso"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>Usuarios y contraseñas individuales</option>
                <option>Autenticación multifactor (MFA)</option>
                <option>Roles y permisos definidos</option>
                <option>Cuentas compartidas</option>
                <option>No existe control de acceso</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="impacto_confidencialidad">
                ¿Qué sucedería si una persona no autorizada accede
                o divulga la información? *
              </label>

              <select
                id="impacto_confidencialidad"
                v-model="form.impacto_confidencialidad"
              >
                <option disabled value="">
                  Selecciona el posible impacto
                </option>

                <option>
                  Impacto bajo: consecuencias menores
                </option>

                <option>
                  Impacto medio: afecta algunas actividades o personas
                </option>

                <option>
                  Impacto alto: pérdidas económicas, legales o reputacionales importantes
                </option>

                <option>
                  Impacto crítico: exposición masiva o afectación grave del negocio
                </option>

                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="proteccion_confidencialidad">
                ¿Qué medidas protegen la información contra accesos no autorizados?
              </label>

              <textarea
                id="proteccion_confidencialidad"
                v-model.trim="form.proteccion_confidencialidad"
                rows="3"
                placeholder="Ej. Permisos por usuario, MFA, cifrado, políticas de acceso..."
              ></textarea>
            </div>

          </section>


          <!-- =========================== -->
          <!-- PASO 3: INTEGRIDAD           -->
          <!-- =========================== -->

          <section v-if="paso === 3" class="form-step">

            <div class="step-heading">
              <div class="heading-icon">03</div>

              <div>
                <h3>Integridad</h3>

                <p>
                  Identifica cómo se evita y detecta la modificación,
                  eliminación o alteración no autorizada de la información.
                </p>
              </div>
            </div>

            <div class="cia-explanation">
              <strong>Integridad:</strong>
              la información debe conservar su exactitud, consistencia
              y completitud durante su procesamiento y almacenamiento.
            </div>

            <div class="form-group">
              <label for="quien_modifica">
                ¿Quién puede modificar o eliminar la información? *
              </label>

              <select
                id="quien_modifica"
                v-model="form.quien_modifica"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>Solo personal autorizado</option>
                <option>Administradores del sistema</option>
                <option>Varios empleados</option>
                <option>Cualquier usuario con acceso</option>
                <option>No existen permisos definidos</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="registro_cambios">
                ¿Se registra quién realiza cambios en la información? *
              </label>

              <select
                id="registro_cambios"
                v-model="form.registro_cambios"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>
                  Sí, se mantiene un registro de auditoría
                </option>

                <option>Parcialmente</option>
                <option>No se registran los cambios</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="validacion_datos">
                ¿Se verifica que la información sea correcta y no haya sido alterada? *
              </label>

              <select
                id="validacion_datos"
                v-model="form.validacion_datos"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>
                  Sí, mediante validaciones o controles periódicos
                </option>

                <option>De manera manual</option>
                <option>No se realizan verificaciones</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="proteccion_integridad">
                ¿Qué mecanismos evitan modificaciones no autorizadas?
              </label>

              <textarea
                id="proteccion_integridad"
                v-model.trim="form.proteccion_integridad"
                rows="3"
                placeholder="Ej. Permisos, control de versiones, firmas digitales, auditorías..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="impacto_integridad">
                ¿Qué consecuencias tendría que la información fuera
                modificada, dañada o eliminada incorrectamente? *
              </label>

              <select
                id="impacto_integridad"
                v-model="form.impacto_integridad"
              >
                <option disabled value="">
                  Selecciona el posible impacto
                </option>

                <option>
                  Impacto bajo: correcciones sencillas
                </option>

                <option>
                  Impacto medio: retrasos o reprocesos
                </option>

                <option>
                  Impacto alto: decisiones erróneas o pérdidas económicas
                </option>

                <option>
                  Impacto crítico: fraude, incumplimientos o afectación grave del negocio
                </option>

                <option>No estoy seguro</option>
              </select>
            </div>

          </section>


          <!-- =========================== -->
          <!-- PASO 4: DISPONIBILIDAD       -->
          <!-- =========================== -->

          <section v-if="paso === 4" class="form-step">

            <div class="step-heading">
              <div class="heading-icon">04</div>

              <div>
                <h3>Disponibilidad</h3>

                <p>
                  Determina qué tan necesario es el activo para la operación
                  y cómo se recuperaría ante una interrupción.
                </p>
              </div>
            </div>

            <div class="cia-explanation">
              <strong>Disponibilidad:</strong>
              la información y los servicios deben estar accesibles
              y utilizables cuando los necesiten los usuarios autorizados.
            </div>

            <div class="form-group">
              <label for="dependencia">
                ¿Qué tan dependiente es la empresa de este activo? *
              </label>

              <select
                id="dependencia"
                v-model="form.dependencia"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

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

            <div class="form-group">
              <label for="impacto_disponibilidad">
                ¿Qué sucedería si el activo deja de estar disponible? *
              </label>

              <select
                id="impacto_disponibilidad"
                v-model="form.impacto_disponibilidad"
              >
                <option disabled value="">
                  Selecciona el posible impacto
                </option>

                <option>
                  Impacto bajo: interrupción mínima
                </option>

                <option>
                  Impacto medio: retraso de algunas actividades
                </option>

                <option>
                  Impacto alto: detención de procesos importantes y pérdidas económicas
                </option>

                <option>
                  Impacto crítico: paralización de operaciones esenciales
                </option>

                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="copias">
                ¿Se realizan copias de seguridad? *
              </label>

              <select
                id="copias"
                v-model="form.copias"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>
                  Sí, periódicamente y se verifica su restauración
                </option>

                <option>
                  Sí, pero no son periódicas
                </option>

                <option>No se realizan</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="recuperacion">
                ¿Existe un procedimiento para recuperar el activo
                o la información ante una falla? *
              </label>

              <select
                id="recuperacion"
                v-model="form.recuperacion"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>
                  Sí, está documentado y probado
                </option>

                <option>
                  Existe, pero no está documentado
                </option>

                <option>No existe un procedimiento</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="tiempo_recuperacion">
                ¿Cuánto tiempo podría permanecer fuera de servicio
                sin afectar gravemente a la empresa?
              </label>

              <select
                id="tiempo_recuperacion"
                v-model="form.tiempo_recuperacion"
              >
                <option disabled value="">
                  Selecciona un tiempo
                </option>

                <option>Menos de 1 hora</option>
                <option>Entre 1 y 4 horas</option>
                <option>Entre 4 y 24 horas</option>
                <option>Entre 1 y 3 días</option>
                <option>Más de 3 días</option>
                <option>No está definido</option>
              </select>
            </div>

            <div class="form-group">
              <label for="ubicacion_datos">
                ¿Dónde se almacena la información?
              </label>

              <select
                id="ubicacion_datos"
                v-model="form.ubicacion_datos"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>Equipo o servidor de la empresa</option>
                <option>Servicio en la nube</option>
                <option>Localmente y en la nube</option>
                <option>Dispositivos externos</option>
                <option>No estoy seguro</option>
              </select>
            </div>

          </section>


          <!-- =========================== -->
          <!-- PASO 5: REVISIÓN             -->
          <!-- =========================== -->

          <section v-if="paso === 5" class="form-step">

            <div class="step-heading">
              <div class="heading-icon">05</div>

              <div>
                <h3>Revisión del activo</h3>

                <p>
                  Verifica las respuestas antes de registrar la información
                  para la gestión de riesgos.
                </p>
              </div>
            </div>

            <div class="form-group">
              <label>
                ¿Qué amenazas o situaciones podrían afectar este activo?
              </label>

              <div class="options-list">

                <label
                  v-for="amenaza in opcionesAmenazas"
                  :key="amenaza"
                  class="option-row"
                  :class="{
                    selected: form.amenazas.includes(amenaza)
                  }"
                >
                  <input
                    v-model="form.amenazas"
                    type="checkbox"
                    :value="amenaza"
                  />

                  <span>{{ amenaza }}</span>
                </label>

              </div>
            </div>

            <div class="form-group">
              <label for="vulnerabilidades">
                ¿Qué debilidades podrían ser aprovechadas por esas amenazas?
              </label>

              <textarea
                id="vulnerabilidades"
                v-model.trim="form.vulnerabilidades"
                rows="3"
                placeholder="Ej. Contraseñas débiles, sistemas sin actualizar, falta de copias de seguridad..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="incidentes">
                ¿Has observado incidentes o situaciones sospechosas
                relacionadas con este activo?
              </label>

              <select
                id="incidentes"
                v-model="form.incidentes"
              >
                <option disabled value="">
                  Selecciona una opción
                </option>

                <option>Sí</option>
                <option>No</option>
                <option>No estoy seguro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="observaciones">
                Observaciones adicionales
              </label>

              <textarea
                id="observaciones"
                v-model.trim="form.observaciones"
                rows="3"
                placeholder="Describe cualquier detalle importante sobre el activo."
              ></textarea>
            </div>

            <!-- RESUMEN -->
            <div class="review-card">

              <div class="review-heading">
                <span class="review-icon">✓</span>

                <div>
                  <h4>Resumen del activo</h4>
                  <p>Verifica los datos registrados.</p>
                </div>
              </div>

              <div
                v-for="item in resumen"
                :key="item.label"
                class="review-row"
              >
                <span>{{ item.label }}</span>

                <strong>
                  {{ mostrar(item.value) }}
                </strong>
              </div>

            </div>

            <div class="notice">
              <span class="notice-icon">i</span>

              <p>
                Las respuestas permiten recopilar información para identificar
                amenazas, vulnerabilidades y consecuencias sobre la
                confidencialidad, integridad y disponibilidad. La evaluación
                del riesgo según ISO/IEC 27005 también requiere definir la
                probabilidad, el impacto y los criterios de aceptación de
                la organización.
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
              <template v-if="paso < 5">
                Continuar →
              </template>

              <template v-else>
                {{ cargando ? 'Registrando...' : 'Registrar activo' }}
              </template>
            </button>

          </footer>

        </form>

        <p class="security-footer">
          GRC IA · Registro y evaluación de activos tecnológicos
        </p>

      </div>
    </main>
  </div>
</template>


<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

// ESTADOS
const paso = ref(1)
const cargando = ref(false)
const mensaje = ref('')
const errorServidor = ref('')
const guardado = ref('')

// PASOS DEL FORMULARIO
const nombresPasos = [
  'Identificación',
  'Confidencialidad',
  'Integridad',
  'Disponibilidad',
  'Revisión'
]

const porcentaje = computed(() => paso.value * 20)


// OPCIONES
const tiposActivo = [
  'Computador o portátil',
  'Servidor',
  'Base de datos',
  'Red o dispositivo de red',
  'Aplicación o software',
  'Servicio en la nube',
  'Dispositivo móvil',
  'Sistema de información',
  'Otro'
]

const areas = [
  'Administración',
  'Finanzas',
  'Ventas',
  'Recursos humanos',
  'Tecnología',
  'Operaciones',
  'Atención al cliente',
  'Otra'
]

const opcionesDatos = [
  'Datos personales de clientes',
  'Información financiera',
  'Información de empleados',
  'Documentos internos',
  'Credenciales y contraseñas',
  'Información comercial',
  'Información pública',
  'Otros datos'
]

const opcionesAmenazas = [
  'Malware o ransomware',
  'Phishing o ingeniería social',
  'Acceso no autorizado',
  'Error humano',
  'Falla de hardware o software',
  'Corte de energía',
  'Desastre natural o incendio',
  'Robo o pérdida del equipo',
  'Ataque de denegación de servicio',
  'Fuga o divulgación de información'
]


// ESTADO INICIAL DEL FORMULARIO
const estadoInicial = () => ({
  // Identificación
  nombre_activo: '',
  tipo_activo: '',
  uso: '',
  area: '',
  responsable: '',
  propietario: '',

  // Confidencialidad
  datos: [],
  clasificacion: '',
  acceso: '',
  control_acceso: '',
  impacto_confidencialidad: '',
  proteccion_confidencialidad: '',

  // Integridad
  quien_modifica: '',
  registro_cambios: '',
  validacion_datos: '',
  proteccion_integridad: '',
  impacto_integridad: '',

  // Disponibilidad
  dependencia: '',
  impacto_disponibilidad: '',
  copias: '',
  recuperacion: '',
  tiempo_recuperacion: '',
  ubicacion_datos: '',

  // Amenazas y vulnerabilidades
  amenazas: [],
  vulnerabilidades: '',
  incidentes: '',
  observaciones: ''
})

const form = reactive(estadoInicial())


// RESUMEN DE LA INFORMACIÓN
const resumen = computed(() => [
  { label: 'Nombre del activo', value: form.nombre_activo },
  { label: 'Tipo de activo', value: form.tipo_activo },
  { label: 'Uso', value: form.uso },
  { label: 'Área', value: form.area },
  { label: 'Responsable', value: form.responsable },
  { label: 'Propietario', value: form.propietario },

  { label: 'Información procesada', value: form.datos },
  { label: 'Clasificación de información', value: form.clasificacion },
  { label: 'Quién accede', value: form.acceso },
  { label: 'Control de acceso', value: form.control_acceso },
  { label: 'Impacto en confidencialidad', value: form.impacto_confidencialidad },
  { label: 'Protección de confidencialidad', value: form.proteccion_confidencialidad },

  { label: 'Quién modifica', value: form.quien_modifica },
  { label: 'Registro de cambios', value: form.registro_cambios },
  { label: 'Verificación de información', value: form.validacion_datos },
  { label: 'Protección de integridad', value: form.proteccion_integridad },
  { label: 'Impacto en integridad', value: form.impacto_integridad },

  { label: 'Dependencia del activo', value: form.dependencia },
  { label: 'Impacto en disponibilidad', value: form.impacto_disponibilidad },
  { label: 'Copias de seguridad', value: form.copias },
  { label: 'Procedimiento de recuperación', value: form.recuperacion },
  { label: 'Tiempo tolerable fuera de servicio', value: form.tiempo_recuperacion },
  { label: 'Ubicación de información', value: form.ubicacion_datos },

  { label: 'Amenazas identificadas', value: form.amenazas },
  { label: 'Vulnerabilidades', value: form.vulnerabilidades },
  { label: 'Incidentes', value: form.incidentes },
  { label: 'Observaciones', value: form.observaciones }
])


// MOSTRAR VALORES EN EL RESUMEN
function mostrar(valor) {
  if (Array.isArray(valor)) {
    return valor.length
      ? valor.join(', ')
      : 'No especificado'
  }

  return valor || 'No especificado'
}


// AVANZAR SIN VALIDAR CAMPOS
function siguiente() {
  mensaje.value = ''

  if (paso.value < nombresPasos.length) {
    paso.value++

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}


// REGRESAR AL PASO ANTERIOR
function anterior() {
  mensaje.value = ''
  errorServidor.value = ''

  if (paso.value > 1) {
    paso.value--

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }
}


// VALIDACIONES AL REGISTRAR
function validarFormulario() {

  if (
    !form.nombre_activo ||
    !form.tipo_activo ||
    !form.uso ||
    !form.area
  ) {
    mensaje.value =
      'Completa nombre, tipo, uso y área del activo antes de registrarlo.'

    paso.value = 1
    return false
  }

  if (
    !form.clasificacion ||
    !form.acceso ||
    !form.control_acceso ||
    !form.impacto_confidencialidad
  ) {
    mensaje.value =
      'Completa las preguntas obligatorias de confidencialidad.'

    paso.value = 2
    return false
  }

  if (
    !form.quien_modifica ||
    !form.registro_cambios ||
    !form.validacion_datos ||
    !form.impacto_integridad
  ) {
    mensaje.value =
      'Completa las preguntas obligatorias de integridad.'

    paso.value = 3
    return false
  }

  if (
    !form.dependencia ||
    !form.impacto_disponibilidad ||
    !form.copias ||
    !form.recuperacion
  ) {
    mensaje.value =
      'Completa las preguntas obligatorias de disponibilidad.'

    paso.value = 4
    return false
  }

  return true
}


// LIMPIAR FORMULARIO
function limpiarFormulario() {
  Object.assign(form, estadoInicial())

  paso.value = 1
  mensaje.value = ''
  errorServidor.value = ''
}


// REGISTRAR ACTIVO
async function registrarActivo() {
  mensaje.value = ''
  errorServidor.value = ''
  guardado.value = ''

  if (!validarFormulario()) {
    return
  }

  cargando.value = true

  try {
    const token = localStorage.getItem('token')

    if (!token) {
      errorServidor.value =
        'Tu sesión no está activa. Inicia sesión para continuar.'

      return
    }

    const datosEnviar = {
      ...form,
      datos: [...form.datos],
      amenazas: [...form.amenazas]
    }

    console.log(
      'DATOS ENVIADOS AL BACKEND:',
      JSON.stringify(datosEnviar, null, 2)
    )

    const response = await axios.post(
      'http://localhost:4000/activos',
      datosEnviar,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    guardado.value =
      response.data?.mensaje ||
      'El activo se registró correctamente.'

    await new Promise(resolve => setTimeout(resolve, 1800))

    limpiarFormulario()
    guardado.value = ''

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

  } catch (error) {
    console.error('ERROR AL REGISTRAR EL ACTIVO:', error)

    errorServidor.value =
      error.response?.data?.error ||
      error.response?.data?.mensaje ||
      'No fue posible registrar el activo. Verifica el servidor y vuelve a intentarlo.'

  } finally {
    cargando.value = false
  }
}


// VOLVER AL DASHBOARD
function volver() {
  router.push('/dashboard')
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
  font-family: Inter, 'Segoe UI', Arial, sans-serif;
}

/* PANEL IZQUIERDO */

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
  letter-spacing: -.9px;
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
  border: 1px solid rgba(185, 213, 210, .3);
  border-radius: 14px;
  background: rgba(255, 255, 255, .045);
}

.ai-title {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #45b6a6;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .5px;
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


/* PANEL DERECHO */

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
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 35px;
}

.section-label {
  color: #168d80;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.page-header h2 {
  margin: 10px 0 8px;
  color: #183438;
  font-size: clamp(24px, 2.5vw, 32px);
  letter-spacing: -.6px;
}

.page-header p {
  margin: 0;
  color: #718083;
  font-size: 14px;
  line-height: 1.6;
}

.back-button {
  flex-shrink: 0;
  padding: 10px 15px;
  border: 1px solid #d8e0e1;
  border-radius: 8px;
  background: #fff;
  color: #405457;
  cursor: pointer;
  font-weight: 650;
}

.back-button:hover,
.secondary-button:hover {
  background: #edf3f3;
}


/* PROGRESO */

.progress-section {
  margin-bottom: 25px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  color: #647477;
  font-size: 12px;
  font-weight: 650;
}

.progress-track {
  height: 7px;
  overflow: hidden;
  border-radius: 20px;
  background: #dfe7e7;
}

.progress-fill {
  height: 100%;
  border-radius: 20px;
  background: #25a697;
  transition: width .25s ease;
}

.steps-indicator {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
  margin-top: 18px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 7px;
  min-width: 0;
  color: #829092;
  font-size: 11px;
}

.step-number {
  display: grid;
  flex: 0 0 25px;
  width: 25px;
  height: 25px;
  place-items: center;
  border: 1px solid #d4dddd;
  border-radius: 50%;
  background: #fff;
  font-size: 11px;
  font-weight: 750;
}

.step-item.active {
  color: #147f74;
  font-weight: 750;
}

.step-item.active .step-number,
.step-item.completed .step-number {
  border-color: #1d9b8c;
  background: #1d9b8c;
  color: #fff;
}

.step-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* TARJETA DEL FORMULARIO */

.asset-card {
  padding: clamp(22px, 4vw, 38px);
  border: 1px solid #e5ebeb;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 8px 28px rgba(24, 52, 56, .045);
}

.form-step {
  min-height: 300px;
}

.step-heading {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.heading-icon {
  display: grid;
  flex: 0 0 47px;
  width: 47px;
  height: 47px;
  place-items: center;
  border-radius: 12px;
  background: #e4f4f1;
  color: #168d80;
  font-size: 14px;
  font-weight: 800;
}

.step-heading h3 {
  margin: 0 0 5px;
  color: #203b3e;
  font-size: 20px;
}

.step-heading p {
  margin: 0;
  color: #7a898b;
  font-size: 13px;
  line-height: 1.5;
}

.cia-explanation {
  margin: -10px 0 25px;
  padding: 14px 16px;
  border-left: 3px solid #28a394;
  border-radius: 5px;
  background: #eff8f6;
  color: #496261;
  font-size: 13px;
  line-height: 1.65;
}


/* CAMPOS */

.form-group {
  margin-bottom: 23px;
}

.form-group > label {
  display: block;
  margin-bottom: 9px;
  color: #34494b;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
}

input:not([type='checkbox']),
select,
textarea {
  width: 100%;
  min-height: 44px;
  padding: 11px 13px;
  border: 1px solid #dce4e4;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #34494b;
  font: inherit;
  font-size: 13px;
  transition: border-color .2s, box-shadow .2s;
}

textarea {
  min-height: 90px;
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  border-color: #26a394;
  box-shadow: 0 0 0 3px rgba(38, 163, 148, .1);
}

input::placeholder,
textarea::placeholder {
  color: #a1adae;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}


/* OPCIONES */

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.option-card,
.option-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 13px;
  border: 1px solid #e0e7e7;
  border-radius: 8px;
  background: #fff;
  color: #596b6d;
  cursor: pointer;
  font-size: 12px;
  line-height: 1.5;
  transition: .2s;
}

.option-card:hover,
.option-row:hover {
  border-color: #8bcfc5;
}

.option-card.selected,
.option-row.selected {
  border-color: #39aa9c;
  background: #f0f9f7;
  color: #236d65;
}

.option-card input,
.option-row input {
  accent-color: #219889;
}

.options-list {
  display: grid;
  gap: 9px;
}


/* RESUMEN */

.review-card {
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #e1e9e8;
  border-radius: 11px;
  background: #fbfdfd;
}

.review-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.review-icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border-radius: 50%;
  background: #e1f4ef;
  color: #168d80;
  font-weight: 800;
}

.review-heading h4 {
  margin: 0 0 3px;
  color: #294346;
  font-size: 15px;
}

.review-heading p {
  margin: 0;
  color: #899697;
  font-size: 11px;
}

.review-row {
  display: grid;
  grid-template-columns: minmax(150px, 35%) 1fr;
  gap: 15px;
  padding: 11px 0;
  border-top: 1px solid #edf0f0;
  font-size: 12px;
  line-height: 1.55;
}

.review-row span {
  color: #7a898b;
}

.review-row strong {
  color: #354c4e;
  font-weight: 650;
  overflow-wrap: anywhere;
}


/* AVISO */

.notice {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #dcebe8;
  border-radius: 9px;
  background: #f1f8f7;
}

.notice-icon {
  display: grid;
  flex: 0 0 22px;
  width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  background: #d8efea;
  color: #168d80;
  font-size: 12px;
  font-weight: 800;
}

.notice p {
  margin: 0;
  color: #5d7473;
  font-size: 12px;
  line-height: 1.65;
}


/* BOTONES */

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 35px;
  padding-top: 22px;
  border-top: 1px solid #edf0f0;
}

.primary-button,
.secondary-button {
  min-height: 44px;
  padding: 0 22px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 750;
  transition: .2s;
}

.primary-button {
  border: 1px solid #168d80;
  background: #168d80;
  color: #fff;
}

.primary-button:hover {
  border-color: #10776c;
  background: #10776c;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: .6;
}

.secondary-button {
  border: 1px solid #d8e1e1;
  background: #fff;
  color: #526668;
}


/* MENSAJES */

.alert {
  margin-bottom: 16px;
  padding: 12px 15px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
}

.alert-error {
  border: 1px solid #f1d0ce;
  background: #fff3f2;
  color: #a33e38;
}

.alert-success {
  border: 1px solid #c8e8d7;
  background: #effaf3;
  color: #26764b;
}

.security-footer {
  margin: 22px 0 0;
  color: #9aa6a7;
  text-align: center;
  font-size: 11px;
}


/* RESPONSIVE */

@media (max-width: 950px) {
  .activos-wrapper {
    grid-template-columns: 1fr;
  }

  .brand-panel {
    position: relative;
    height: auto;
    min-height: auto;
    padding: 35px 7%;
  }

  .ai-message {
    margin-top: 30px;
  }

  .brand-footer {
    margin-top: 18px;
  }

  .form-panel {
    min-height: auto;
  }
}

@media (max-width: 600px) {
  .form-panel {
    padding: 28px 15px;
  }

  .page-header {
    flex-direction: column;
  }

  .back-button {
    align-self: flex-start;
  }

  .steps-indicator {
    gap: 3px;
  }

  .step-item {
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }

  .step-name {
    max-width: 100%;
    font-size: 9px;
  }

  .form-grid,
  .options-grid {
    grid-template-columns: 1fr;
  }

  .asset-card {
    padding: 20px 16px;
  }

  .review-row {
    grid-template-columns: 1fr;
    gap: 3px;
  }

  .form-actions {
    margin-top: 25px;
  }
}
</style>