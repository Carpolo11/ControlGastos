<template>
  <div class="panel-container">

    <!-- ENCABEZADO -->
    <header class="header">
      <div>
        <span class="subtitle">RESUMEN DE SEGURIDAD</span>
        <h1>{{ saludo }}</h1>
        <p>Estado de seguridad de los activos tecnológicos de tu organización.</p>
      </div>

      <button
        class="btn-refresh"
        type="button"
        :disabled="cargando"
        @click="cargarPanel"
      >
        {{ cargando ? 'Cargando...' : '↻ Actualizar' }}
      </button>
    </header>

    <!-- CARGANDO -->
    <div v-if="cargando && !panel" class="message">
      <div class="loader"></div>
      <p>Cargando el panel...</p>
    </div>

    <!-- ERROR -->
    <div v-else-if="error" class="error-message" role="alert">
      {{ error }}
    </div>

    <!-- SIN ACTIVOS -->
    <section v-else-if="panel && panel.totales.activos === 0" class="card empty">
      <div class="empty-icon">▣</div>
      <h2>Aún no tienes activos registrados</h2>
      <p>Registra tu primer activo para ver aquí su criticidad, soporte y alertas.</p>
      <router-link to="/inventario" class="btn-primary">Registrar mi primer activo</router-link>
    </section>

    <template v-else-if="panel">

      <!-- IA NO DISPONIBLE -->
      <p v-if="!panel.ia_disponible" class="aviso" role="note">
        ⓘ El servicio de IA no está disponible: no se muestran el soporte del
        fabricante ni la exposición a internet. El resto del panel funciona normal.
      </p>

      <!-- INDICADORES -->
      <section class="kpis" aria-label="Indicadores principales">
        <article
          v-for="kpi in indicadores"
          :key="kpi.etiqueta"
          class="kpi"
          :class="{ 'kpi-alerta': kpi.alerta }"
        >
          <span class="kpi-etiqueta">{{ kpi.etiqueta }}</span>
          <strong class="kpi-valor">{{ kpi.valor ?? '—' }}</strong>
          <span class="kpi-nota">
            <template v-if="kpi.alerta">⚠ </template>{{ kpi.nota }}
          </span>
        </article>
      </section>

      <div class="grid">

        <!-- CRITICIDAD -->
        <section class="card">
          <h2>Activos por criticidad</h2>
          <p class="card-desc">Según el mayor impacto en confidencialidad, integridad y disponibilidad.</p>
          <ul class="barras">
            <li
              v-for="nivel in panel.criticidad"
              :key="nivel.nombre"
              :title="`${nivel.nombre}: ${nivel.total} ${nivel.total === 1 ? 'activo' : 'activos'}`"
            >
              <span class="barra-nombre">{{ nivel.nombre }}</span>
              <span class="barra-pista">
                <span
                  class="barra"
                  :class="'nivel-' + claseNivel(nivel.nombre)"
                  :style="{ width: ancho(nivel.total, maxCriticidad) }"
                ></span>
              </span>
              <span class="barra-valor">{{ nivel.total }}</span>
            </li>
          </ul>
        </section>

        <!-- CATEGORÍAS -->
        <section class="card">
          <h2>Activos por categoría</h2>
          <p class="card-desc">Cuántos activos hay de cada tipo.</p>
          <ul class="barras">
            <li
              v-for="tipo in panel.por_tipo"
              :key="tipo.nombre"
              :title="`${tipo.nombre}: ${tipo.total}`"
            >
              <span class="barra-nombre">{{ tipo.nombre }}</span>
              <span class="barra-pista">
                <span class="barra barra-categoria" :style="{ width: ancho(tipo.total, maxTipo) }"></span>
              </span>
              <span class="barra-valor">{{ tipo.total }}</span>
            </li>
          </ul>

          <h3>Clasificación de la información</h3>
          <div class="chips">
            <span v-for="c in panel.por_clasificacion" :key="c.nombre" class="chip">
              {{ c.nombre }} <strong>{{ c.total }}</strong>
            </span>
          </div>
        </section>

      </div>

      <div class="grid">

        <!-- ATENCIÓN PRIORITARIA -->
        <section class="card">
          <h2>Requieren atención</h2>
          <p class="card-desc">Activos con alertas, del más urgente al menos urgente.</p>

          <p v-if="panel.atencion.length === 0" class="ok">
            ✓ Ningún activo tiene alertas en este momento.
          </p>

          <ul v-else class="atencion">
            <li v-for="activo in panel.atencion" :key="activo.id">
              <div class="atencion-cabecera">
                <div>
                  <strong>{{ activo.nombre }}</strong>
                  <span class="atencion-tipo">{{ activo.tipo }}</span>
                </div>
                <router-link :to="`/activos/${activo.id}/ficha`" class="btn-ficha">
                  ✦ Ver ficha
                </router-link>
              </div>
              <div class="chips">
                <span v-for="motivo in activo.motivos" :key="motivo" class="chip chip-alerta">
                  ⚠ {{ motivo }}
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- DESEMPEÑO DE LA IA -->
        <section class="card">
          <h2>Uso y desempeño de la IA</h2>
          <p class="card-desc">Clasificación automática de activos (RF05).</p>

          <div class="ia-datos">
            <div>
              <strong>{{ formatoPorcentaje(panel.ia.porcentaje_clasificados) }}</strong>
              <span>de los activos se clasificaron con IA ({{ panel.ia.clasificados }} de {{ panel.totales.activos }})</span>
            </div>
            <div>
              <strong>{{ formatoPorcentaje(panel.ia.porcentaje_aceptacion) }}</strong>
              <span>de las sugerencias se aceptaron sin corregir ({{ panel.ia.corregidos }} {{ panel.ia.corregidos === 1 ? 'corregida' : 'corregidas' }})</span>
            </div>
          </div>

          <p class="nota">
            Las correcciones de los usuarios quedan guardadas para medir y mejorar
            el modelo (RNF07, RF18).
          </p>
        </section>

      </div>

      <!-- EVOLUCIÓN -->
      <section class="card">
        <h2>Activos registrados por mes</h2>
        <p class="card-desc">Últimos 6 meses.</p>
        <div class="columnas" role="list">
          <div
            v-for="mes in panel.evolucion"
            :key="mes.etiqueta"
            class="columna"
            role="listitem"
            :title="`${mes.etiqueta}: ${mes.total} ${mes.total === 1 ? 'activo' : 'activos'}`"
          >
            <span class="columna-valor">{{ mes.total }}</span>
            <span class="columna-pista">
              <span class="columna-barra" :style="{ height: ancho(mes.total, maxEvolucion) }"></span>
            </span>
            <span class="columna-etiqueta">{{ mes.etiqueta }}</span>
          </div>
        </div>
      </section>

      <!-- PRÓXIMAMENTE -->
      <section class="card pendiente">
        <h2>Próximamente en este panel</h2>
        <p class="card-desc">
          Se activarán cuando estén los módulos de riesgos y tratamiento (RF09 a RF13).
        </p>
        <ul>
          <li>Riesgos por nivel y matriz de riesgos (probabilidad × impacto)</li>
          <li>Recomendaciones de tratamiento pendientes</li>
          <li>Avance de los planes de tratamiento</li>
        </ul>
      </section>

      <p class="actualizado">Actualizado: {{ horaActualizacion }}</p>

    </template>
  </div>
</template>

<script setup>
// RF15: panel principal con el estado de seguridad de los activos.
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const panel = ref(null)
const cargando = ref(false)
const error = ref('')

const usuario = (() => {
  try {
    return JSON.parse(localStorage.getItem('usuario')) || null
  } catch {
    return null
  }
})()

const saludo = computed(() => {
  const nombre = (usuario?.nombre || '').split(' ')[0]
  return nombre ? `Hola, ${nombre}` : 'Estado de seguridad'
})

const indicadores = computed(() => {
  const t = panel.value.totales
  const ia = panel.value.ia_disponible
  return [
    { etiqueta: 'Activos registrados', valor: t.activos, nota: 'en el inventario', alerta: false },
    { etiqueta: 'Activos críticos', valor: t.criticos, nota: 'criticidad alta o crítica', alerta: t.criticos > 0 },
    { etiqueta: 'Sin soporte del fabricante', valor: t.sin_soporte, nota: ia ? 'ya no reciben parches' : 'IA no disponible', alerta: t.sin_soporte > 0 },
    { etiqueta: 'Expuestos a internet', valor: t.expuestos, nota: ia ? 'accesibles desde fuera' : 'IA no disponible', alerta: t.expuestos > 0 },
    { etiqueta: 'Sin copias de seguridad', valor: t.sin_copias, nota: 'no se respaldan', alerta: t.sin_copias > 0 }
  ]
})

const maximo = (lista) => Math.max(1, ...lista.map(e => e.total))
const maxCriticidad = computed(() => maximo(panel.value.criticidad))
const maxTipo = computed(() => maximo(panel.value.por_tipo))
const maxEvolucion = computed(() => maximo(panel.value.evolucion))

// Tamaño de la barra en %; un valor mayor que 0 siempre se ve
const ancho = (valor, max) => (valor > 0 ? `${Math.max(4, (valor / max) * 100)}%` : '0%')

const claseNivel = (nivel) => ({
  'Crítica': 'critica',
  'Alta': 'alta',
  'Media': 'media',
  'Baja': 'baja'
}[nivel] || 'sin-evaluar')

const formatoPorcentaje = (valor) => (valor === null || valor === undefined ? '—' : `${valor} %`)

const horaActualizacion = computed(() =>
  panel.value
    ? new Date(panel.value.generado).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
    : ''
)

async function cargarPanel() {
  cargando.value = true
  error.value = ''
  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.get('http://localhost:4000/dashboard', {
      headers: { Authorization: `Bearer ${token}` }
    })
    panel.value = data
  } catch (e) {
    if (e.response?.status === 401 || e.response?.status === 403) {
      error.value = 'Tu sesión expiró. Cierra sesión y vuelve a ingresar.'
    } else {
      error.value =
        e.response?.data?.error ||
        'No fue posible conectar con el servidor. Verifica que el backend esté encendido.'
    }
  } finally {
    cargando.value = false
  }
}

onMounted(cargarPanel)
</script>

<style scoped>
.panel-container {
  min-height: 100vh;
  padding: 35px;
  background: #f4f7f5;
  color: #24352d;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.panel-container * {
  box-sizing: border-box;
}

/* ENCABEZADO */
.header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
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
  font-weight: 700;
  letter-spacing: -0.7px;
}

.header p {
  margin: 0;
  color: #7c8982;
  font-size: 13px;
}

.btn-refresh,
.btn-primary {
  padding: 12px 19px;
  border: none;
  border-radius: 9px;
  background: #16875e;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* AVISO */
.aviso {
  margin: 0 0 20px;
  padding: 12px 14px;
  border: 1px solid #f1dca7;
  border-radius: 10px;
  background: #fff8e6;
  color: #6f5300;
  font-size: 13px;
  line-height: 1.5;
}

/* INDICADORES */
.kpis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.kpi {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 18px;
  border: 1px solid #e6ece8;
  border-radius: 13px;
  background: #fff;
  box-shadow: 0 3px 12px rgba(33, 58, 44, 0.04);
}

.kpi-alerta {
  border-color: #f3c2c2;
  background: #fffafa;
}

.kpi-etiqueta {
  color: #637168;
  font-size: 12px;
  font-weight: 600;
}

.kpi-valor {
  color: #20352b;
  font-size: 30px;
  font-weight: 750;
  line-height: 1;
}

.kpi-nota {
  color: #89958e;
  font-size: 11px;
}

.kpi-alerta .kpi-nota {
  color: #9b1c1c;
  font-weight: 600;
}

/* TARJETAS */
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
  margin: 20px 0 10px;
  color: #34483b;
  font-size: 13px;
}

.card-desc {
  margin: 0 0 18px;
  color: #89958e;
  font-size: 12px;
}

.nota {
  margin: 16px 0 0;
  color: #89958e;
  font-size: 11px;
  line-height: 1.5;
}

/* BARRAS HORIZONTALES */
.barras {
  margin: 0;
  padding: 0;
  list-style: none;
}

.barras li {
  display: grid;
  grid-template-columns: minmax(90px, 38%) 1fr 32px;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
  border-radius: 6px;
}

.barras li:hover {
  background: #f7fbf8;
}

.barra-nombre {
  color: #34483b;
  font-size: 12px;
}

.barra-pista {
  height: 12px;
}

.barra {
  display: block;
  height: 100%;
  border-radius: 0 4px 4px 0;
}

.barra-valor {
  color: #263b30;
  font-size: 13px;
  font-weight: 700;
  text-align: right;
}

.barra-categoria { background: #16875e; }
.nivel-critica { background: #c0392b; }
.nivel-alta { background: #e07b24; }
.nivel-media { background: #d9a514; }
.nivel-baja { background: #2e9e6b; }
.nivel-sin-evaluar { background: #b8c2bd; }

/* CHIPS */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip {
  padding: 5px 10px;
  border-radius: 20px;
  background: #f0f4f1;
  color: #34483b;
  font-size: 11px;
}

.chip strong {
  margin-left: 3px;
}

.chip-alerta {
  background: #fff0ef;
  color: #9b1c1c;
  font-weight: 600;
}

/* ATENCIÓN */
.atencion {
  margin: 0;
  padding: 0;
  list-style: none;
}

.atencion li {
  padding: 14px 0;
  border-bottom: 1px solid #eef2ef;
}

.atencion li:last-child {
  border-bottom: none;
}

.atencion-cabecera {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.atencion-cabecera strong {
  display: block;
  color: #263b30;
  font-size: 14px;
}

.atencion-tipo {
  color: #89958e;
  font-size: 11px;
}

.btn-ficha {
  padding: 8px 11px;
  border-radius: 7px;
  background: #e8f5ed;
  color: #16875e;
  font-size: 11px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.btn-ficha:hover {
  background: #d6efe1;
}

.ok {
  color: #17654a;
  font-size: 13px;
}

/* IA */
.ia-datos {
  display: grid;
  gap: 16px;
}

.ia-datos div {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.ia-datos strong {
  min-width: 70px;
  color: #16875e;
  font-size: 26px;
}

.ia-datos span {
  color: #637168;
  font-size: 13px;
  line-height: 1.4;
}

/* COLUMNAS (EVOLUCIÓN) */
.columnas {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  align-items: end;
}

.columna {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  border-radius: 6px;
}

.columna:hover {
  background: #f7fbf8;
}

.columna-valor {
  color: #263b30;
  font-size: 12px;
  font-weight: 700;
}

.columna-pista {
  display: flex;
  align-items: flex-end;
  width: 60%;
  max-width: 40px;
  height: 110px;
  border-bottom: 1px solid #dfe8e2;
}

.columna-barra {
  display: block;
  width: 100%;
  border-radius: 4px 4px 0 0;
  background: #16875e;
}

.columna-etiqueta {
  color: #89958e;
  font-size: 11px;
}

/* PRÓXIMAMENTE */
.pendiente {
  border-style: dashed;
  background: #fbfcfb;
}

.pendiente ul {
  margin: 0;
  padding-left: 18px;
  color: #637168;
  font-size: 13px;
  line-height: 1.8;
}

/* ESTADOS */
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

.empty {
  text-align: center;
}

.empty p {
  margin: 8px 0 20px;
  color: #7c8982;
  font-size: 13px;
}

.empty .btn-primary {
  display: inline-block;
}

.empty-icon {
  display: flex;
  width: 58px;
  height: 58px;
  margin: 0 auto 12px;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  background: #e8f5ed;
  color: #16875e;
  font-size: 27px;
}

.actualizado {
  margin: 0;
  color: #a0aaa4;
  font-size: 11px;
  text-align: right;
}

@media (max-width: 700px) {
  .panel-container {
    padding: 18px;
  }

  .header h1 {
    font-size: 25px;
  }

  .columnas {
    gap: 6px;
  }
}
</style>