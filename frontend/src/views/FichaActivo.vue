<template>
  <div class="ficha-container">

    <!-- ENCABEZADO -->
    <header class="header">
      <div>
        <span class="subtitle">FICHA DE CONOCIMIENTO DEL ACTIVO</span>
        <h1>{{ ficha?.activo.nombre || 'Ficha del activo' }}</h1>
        <div v-if="ficha" class="header-meta">
          <span class="type-badge">{{ ficha.activo.tipo }}</span>
          <span class="ia-badge">✦ Generado con IA</span>
          <span class="fecha">Generada el {{ fechaGeneracion }}</span>
        </div>
      </div>

      <div class="header-actions">
        <router-link to="/activos" class="btn-secondary">← Volver al inventario</router-link>
        <button v-if="ficha" class="btn-primary" @click="imprimir">Imprimir ficha</button>
      </div>
    </header>

    <!-- CARGANDO -->
    <div v-if="cargando" class="message">
      <div class="loader"></div>
      <p>Generando la ficha del activo…</p>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="error-message" role="alert">
      {{ error }}
      <button class="btn-secondary" @click="cargarFicha">Reintentar</button>
    </div>

    <template v-else-if="ficha">

      <p class="aviso" role="note">ⓘ {{ ficha.aviso }}</p>

      <div class="grid">

        <!-- QUÉ ES -->
        <section class="card">
          <h2>¿Qué es y para qué sirve?</h2>
          <p>{{ ficha.que_es.texto }}</p>
          <dl class="datos-basicos">
            <div v-if="ficha.que_es.uso">
              <dt>Uso en tu empresa</dt>
              <dd>{{ ficha.que_es.uso }}</dd>
            </div>
            <div v-if="ficha.que_es.area">
              <dt>Área</dt>
              <dd>{{ ficha.que_es.area }}</dd>
            </div>
          </dl>
        </section>

        <!-- CRITICIDAD -->
        <section class="card">
          <h2>Importancia para el negocio</h2>
          <div class="criticidad">
            <span class="nivel" :class="claseNivel(ficha.criticidad.nivel)">
              Criticidad {{ ficha.criticidad.nivel.toLowerCase() }}
            </span>
          </div>
          <ul class="dimensiones">
            <li v-for="d in ficha.criticidad.detalle" :key="d.dimension">
              <span>{{ d.dimension }}</span>
              <strong :class="claseNivel(d.nivel)">{{ d.nivel }}</strong>
            </li>
          </ul>
          <p class="nota">{{ ficha.criticidad.explicacion }}</p>
        </section>

      </div>

      <!-- CARACTERÍSTICAS -->
      <section class="card">
        <h2>Características relevantes</h2>
        <dl class="caracteristicas">
          <div
            v-for="c in ficha.caracteristicas"
            :key="c.etiqueta"
            :class="{ alerta: c.alerta }"
          >
            <dt>{{ c.etiqueta }}</dt>
            <dd>
              <strong>{{ c.alerta ? '⚠ ' : '' }}{{ c.valor }}</strong>
              <span v-if="c.detalle" class="detalle">
                {{ c.detalle }}
                <a v-if="c.fuente" :href="c.fuente.url" target="_blank" rel="noopener" class="cita">[{{ numeroFuente(c.fuente) }}]</a>
              </span>
            </dd>
          </div>
        </dl>
      </section>

      <div class="grid">

        <!-- AMENAZAS -->
        <section class="card">
          <h2>Amenazas y vulnerabilidades típicas</h2>
          <ul class="lista">
            <li v-for="(a, i) in ficha.amenazas" :key="i">
              <span class="origen">{{ a.origen }}</span>
              {{ a.texto }}
              <a v-if="a.fuente" :href="a.fuente.url" target="_blank" rel="noopener" class="cita">[{{ numeroFuente(a.fuente) }}]</a>
            </li>
          </ul>
        </section>

        <!-- BUENAS PRÁCTICAS -->
        <section class="card">
          <h2>Buenas prácticas básicas</h2>
          <ul class="lista">
            <li v-for="(p, i) in ficha.practicas" :key="i" :class="{ prioritaria: p.prioridad === 'alta' }">
              <span v-if="p.prioridad === 'alta'" class="origen prioridad">Prioritaria</span>
              {{ p.texto }}
              <a v-if="p.fuente" :href="p.fuente.url" target="_blank" rel="noopener" class="cita">[{{ numeroFuente(p.fuente) }}]</a>
            </li>
          </ul>
        </section>

      </div>

      <!-- FUENTES -->
      <section class="card">
        <h2>Fuentes</h2>
        <ol class="fuentes">
          <li v-for="f in ficha.fuentes" :key="f.url">
            <a :href="f.url" target="_blank" rel="noopener">{{ f.titulo }}</a>
          </li>
        </ol>
        <p class="nota">{{ ficha.metodo }}</p>
      </section>

    </template>
  </div>
</template>

<script setup>
// RF06: ficha de conocimiento del activo, con fuentes (RNF02).
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()

const ficha = ref(null)
const cargando = ref(true)
const error = ref('')

const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

const fechaGeneracion = computed(() => {
  if (!ficha.value) return ''
  const [anio, mes, dia] = ficha.value.fecha_generacion.split('-').map(Number)
  return `${dia} de ${MESES[mes - 1]} de ${anio}`
})

// Número de cada fuente en la lista final, para citarla como [1], [2]...
const indiceFuentes = computed(() => {
  const indice = {}
  ;(ficha.value?.fuentes || []).forEach((f, i) => { indice[f.url] = i + 1 })
  return indice
})

const numeroFuente = (f) => indiceFuentes.value[f.url]

const claseNivel = (nivel) => ({
  'Crítica': 'critica',
  'Alta': 'alta',
  'Media': 'media',
  'Baja': 'baja'
}[nivel] || 'sin-evaluar')

async function cargarFicha() {
  cargando.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get(
      `http://localhost:4000/activos/${route.params.id}/ficha`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    ficha.value = data
  } catch (e) {
    error.value =
      e.response?.data?.error ||
      'No fue posible conectar con el servidor. Verifica que el backend esté encendido.'
  } finally {
    cargando.value = false
  }
}

const imprimir = () => window.print()

onMounted(cargarFicha)
</script>

<style scoped>
.ficha-container {
  min-height: 100vh;
  padding: 35px;
  background: #f5f7f6;
  color: #202b27;
  font-family: Arial, sans-serif;
}

/* ENCABEZADO */
.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 22px;
}

.subtitle {
  color: #17865b;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1.5px;
}

.header h1 {
  margin: 9px 0 12px;
  font-size: 28px;
}

.header-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.type-badge,
.ia-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
}

.type-badge {
  background: #e7f5ee;
  color: #17654a;
}

.ia-badge {
  background: #e4f4f1;
  color: #11584f;
}

.fecha {
  color: #77817c;
  font-size: 13px;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 11px 18px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

.btn-primary {
  border: none;
  background: #17865b;
  color: #fff;
}

.btn-secondary {
  border: 1px solid #d5ddd9;
  background: #fff;
  color: #2f3b36;
}

/* AVISO */
.aviso {
  margin: 0 0 20px;
  padding: 12px 14px;
  border: 1px solid #cfe7e2;
  border-radius: 10px;
  background: #f4fbf9;
  color: #2f5550;
  font-size: 13px;
  line-height: 1.5;
}

/* TARJETAS */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
  gap: 20px;
}

.card {
  margin-bottom: 20px;
  padding: 24px;
  border: 1px solid #e7ece9;
  border-radius: 12px;
  background: #fff;
}

.card h2 {
  margin: 0 0 14px;
  font-size: 17px;
}

.card p {
  margin: 0 0 12px;
  color: #3d4944;
  font-size: 14px;
  line-height: 1.6;
}

.nota {
  color: #77817c !important;
  font-size: 12px !important;
}

/* QUÉ ES */
.datos-basicos {
  display: grid;
  gap: 10px;
  margin: 0;
}

dt {
  color: #77817c;
  font-size: 12px;
}

dd {
  margin: 3px 0 0;
  font-size: 14px;
}

/* CRITICIDAD */
.criticidad {
  margin-bottom: 14px;
}

.nivel {
  display: inline-block;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
}

.dimensiones {
  margin: 0 0 12px;
  padding: 0;
  list-style: none;
}

.dimensiones li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eef2f0;
  font-size: 14px;
}

.critica { background: #fdecec; color: #9b1c1c; }
.alta { background: #fff1e6; color: #8a3b00; }
.media { background: #fff8e1; color: #6f5300; }
.baja { background: #e7f5ee; color: #17654a; }
.sin-evaluar { background: #eef2f0; color: #59645f; }

.dimensiones strong {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
}

/* CARACTERÍSTICAS */
.caracteristicas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
  gap: 12px;
  margin: 0;
}

.caracteristicas > div {
  padding: 12px 14px;
  border: 1px solid #eef2f0;
  border-radius: 10px;
}

.caracteristicas > div.alerta {
  border-color: #f3c2c2;
  background: #fff7f7;
}

.alerta strong {
  color: #9b1c1c;
}

.detalle {
  display: block;
  margin-top: 5px;
  color: #59645f;
  font-size: 13px;
  line-height: 1.5;
}

/* LISTAS */
.lista {
  margin: 0;
  padding: 0;
  list-style: none;
}

.lista li {
  padding: 11px 0;
  border-bottom: 1px solid #eef2f0;
  color: #2f3b36;
  font-size: 14px;
  line-height: 1.55;
}

.lista li:last-child {
  border-bottom: none;
}

.origen {
  display: inline-block;
  margin-right: 6px;
  padding: 1px 8px;
  border-radius: 6px;
  background: #eef2f0;
  color: #59645f;
  font-size: 11px;
  font-weight: bold;
}

.origen.prioridad {
  background: #fff1e6;
  color: #8a3b00;
}

.cita {
  color: #17865b;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
}

.cita:hover {
  text-decoration: underline;
}

/* FUENTES */
.fuentes {
  margin: 0 0 12px;
  padding-left: 22px;
  font-size: 14px;
  line-height: 1.8;
}

.fuentes a {
  color: #17654a;
}

/* ESTADOS */
.message {
  padding: 60px 20px;
  color: #77817c;
  text-align: center;
}

.loader {
  width: 34px;
  height: 34px;
  margin: 0 auto 14px;
  border: 3px solid #dfe7e3;
  border-top-color: #17865b;
  border-radius: 50%;
  animation: girar 0.8s linear infinite;
}

@keyframes girar {
  to { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  border: 1px solid #f3c2c2;
  border-radius: 10px;
  background: #fdecec;
  color: #9b1c1c;
}

@media (max-width: 640px) {
  .ficha-container {
    padding: 20px 16px;
  }
}

@media print {
  .header-actions {
    display: none;
  }

  .ficha-container {
    padding: 0;
    background: #fff;
  }

  .card {
    break-inside: avoid;
  }
}
</style>