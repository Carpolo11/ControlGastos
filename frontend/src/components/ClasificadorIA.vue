<template>
  <div class="clasificador-ia">

    <div class="ia-encabezado">
      <span class="ia-icono">✦</span>
      <div>
        <h4>Identificar el activo con IA</h4>
        <p>
          Descríbelo con tus palabras y la IA sugerirá su categoría y sus
          características. Tú decides si las usas.
        </p>
      </div>
    </div>

    <label for="descripcion_ia" class="ia-label">Describe tu activo</label>
    <textarea
      id="descripcion_ia"
      v-model="descripcion"
      rows="3"
      maxlength="2000"
      placeholder="Ej. Tenemos un servidor con Windows Server 2012 donde está la contabilidad"
    ></textarea>

    <button
      type="button"
      class="ia-boton"
      :disabled="analizando || descripcion.trim().length < 3"
      @click="analizar"
    >
      {{ analizando ? 'Analizando…' : 'Analizar con IA' }}
    </button>

    <p v-if="error" class="ia-error" role="alert">{{ error }}</p>

    <!-- RESULTADO -->
    <div v-if="resultado && !aplicado" class="ia-resultado">

      <span class="ia-etiqueta">✦ Generado con IA</span>

      <div class="ia-categoria">
        <span class="ia-subtitulo">Categoría sugerida</span>
        <strong>{{ resultado.categoria }}</strong>
        <span class="ia-confianza" :class="resultado.nivel_confianza.toLowerCase()">
          Confianza {{ resultado.nivel_confianza.toLowerCase() }}
          ({{ Math.round(resultado.confianza * 100) }} %)
        </span>
      </div>

      <p v-if="resultado.advertencia" class="ia-advertencia">⚠ {{ resultado.advertencia }}</p>

      <p v-if="resultado.alternativas?.length" class="ia-alternativas">
        Otras opciones posibles:
        <span v-for="(alt, i) in resultado.alternativas" :key="alt.categoria">
          {{ alt.categoria }} ({{ Math.round(alt.probabilidad * 100) }} %){{ i < resultado.alternativas.length - 1 ? ', ' : '' }}
        </span>
      </p>

      <span class="ia-subtitulo">Características detectadas (puedes corregirlas)</span>
      <div class="ia-atributos">
        <label>
          Fabricante
          <input v-model.trim="atributos.fabricante" type="text" placeholder="No detectado" />
        </label>
        <label>
          Producto
          <input v-model.trim="atributos.producto" type="text" placeholder="No detectado" />
        </label>
        <label>
          Versión
          <input v-model.trim="atributos.version" type="text" placeholder="No detectada" />
        </label>
        <label>
          ¿Expuesto a internet?
          <select v-model="atributos.expuesto_internet">
            <option>Sí</option>
            <option>No</option>
            <option>No determinado</option>
          </select>
        </label>
      </div>

      <div v-if="atributos.tipos_datos.length" class="ia-datos">
        <span class="ia-subtitulo">Tipo de datos que procesa</span>
        <span v-for="tipo in atributos.tipos_datos" :key="tipo" class="ia-chip">{{ tipo }}</span>
      </div>

      <details class="ia-justificacion">
        <summary>¿Por qué esta clasificación?</summary>
        <ul>
          <li v-for="(motivo, i) in resultado.justificacion" :key="i">{{ motivo }}</li>
        </ul>
        <p class="ia-modelo">
          Modelo {{ resultado.modelo.tipo }} · versión {{ resultado.modelo.version }}
          <template v-if="resultado.modelo.precision_validacion">
            · precisión en validación {{ Math.round(resultado.modelo.precision_validacion * 100) }} %
          </template>
        </p>
      </details>

      <div class="ia-acciones">
        <button type="button" class="ia-boton" @click="aplicar">Usar esta clasificación</button>
        <button type="button" class="ia-boton secundario" @click="descartar">Descartar</button>
      </div>
    </div>

    <p v-if="aplicado" class="ia-aplicado" role="status">
      ✓ Se aplicó la categoría «{{ resultado.categoria }}». Si no es correcta,
      cámbiala en «Tipo de activo».
      <button type="button" class="ia-enlace" @click="descartar">Analizar otra descripción</button>
    </p>

  </div>
</template>

<script setup>
// RF05: identificar y clasificar activos con IA.
// La IA solo sugiere; el usuario confirma o corrige (RNF06).
import { reactive, ref } from 'vue'
import axios from 'axios'

const emit = defineEmits(['aplicar', 'descartar'])

const descripcion = ref('')
const analizando = ref(false)
const error = ref('')
const resultado = ref(null)
const aplicado = ref(false)
const atributos = reactive({
  fabricante: '',
  producto: '',
  version: '',
  expuesto_internet: 'No determinado',
  tipos_datos: []
})

async function analizar() {
  error.value = ''
  resultado.value = null
  aplicado.value = false
  analizando.value = true

  try {
    const token = localStorage.getItem('token')
    const { data } = await axios.post(
      'http://localhost:4000/activos/clasificar',
      { descripcion: descripcion.value },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    resultado.value = data
    Object.assign(atributos, {
      fabricante: data.atributos.fabricante || '',
      producto: data.atributos.producto || '',
      version: data.atributos.version || '',
      expuesto_internet: data.atributos.expuesto_internet || 'No determinado',
      tipos_datos: data.atributos.tipos_datos || []
    })
  } catch (e) {
    error.value =
      e.response?.data?.error ||
      'No fue posible conectar con el servidor. Verifica que el backend esté encendido.'
  } finally {
    analizando.value = false
  }
}

function aplicar() {
  aplicado.value = true
  emit('aplicar', {
    ...resultado.value,
    atributos: { ...atributos, tipos_datos: [...atributos.tipos_datos] }
  })
}

function descartar() {
  resultado.value = null
  aplicado.value = false
  emit('descartar')
}
</script>

<style scoped>
.clasificador-ia {
  margin-bottom: 26px;
  padding: 18px;
  border: 1px solid #cfe7e2;
  border-radius: 12px;
  background: #f4fbf9;
}

.ia-encabezado {
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
}

.ia-icono {
  display: grid;
  flex: 0 0 34px;
  height: 34px;
  place-items: center;
  border-radius: 9px;
  background: #e4f4f1;
  color: #168d80;
  font-size: 18px;
}

.ia-encabezado h4 {
  margin: 0 0 4px;
  color: #203b3e;
  font-size: 15px;
}

.ia-encabezado p {
  margin: 0;
  color: #5f7375;
  font-size: 13px;
  line-height: 1.45;
}

.ia-label,
.ia-subtitulo {
  display: block;
  margin-bottom: 6px;
  color: #34494b;
  font-size: 13px;
  font-weight: 600;
}

textarea,
.ia-atributos input,
.ia-atributos select {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #dce4e4;
  border-radius: 8px;
  background: #fff;
  color: #34494b;
  font: inherit;
  font-size: 14px;
}

textarea {
  resize: vertical;
}

textarea:focus,
.ia-atributos input:focus,
.ia-atributos select:focus {
  border-color: #26a394;
  outline: 2px solid rgba(38, 163, 148, 0.2);
}

.ia-boton {
  margin-top: 10px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #168d80;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.ia-boton:hover:not(:disabled) {
  background: #11584f;
}

.ia-boton:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.ia-boton.secundario {
  border: 1px solid #c9d6d6;
  background: #fff;
  color: #34494b;
}

.ia-error,
.ia-advertencia {
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.45;
}

.ia-error {
  border: 1px solid #f3c2c2;
  background: #fdecec;
  color: #9b1c1c;
}

.ia-advertencia {
  margin-bottom: 12px;
  border: 1px solid #f1dca7;
  background: #fff8e6;
  color: #7a5a00;
}

.ia-resultado {
  margin-top: 16px;
  padding: 16px;
  border: 1px solid #dce4e4;
  border-radius: 10px;
  background: #fff;
}

.ia-etiqueta {
  display: inline-block;
  margin-bottom: 10px;
  padding: 3px 9px;
  border-radius: 20px;
  background: #e4f4f1;
  color: #11584f;
  font-size: 12px;
  font-weight: 700;
}

.ia-categoria {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 6px 12px;
  margin-bottom: 12px;
}

.ia-categoria .ia-subtitulo {
  width: 100%;
  margin: 0;
}

.ia-categoria strong {
  color: #203b3e;
  font-size: 18px;
}

.ia-confianza {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.ia-confianza.alta { background: #e2f5ec; color: #17603f; }
.ia-confianza.media { background: #fff3d6; color: #7a5a00; }
.ia-confianza.baja { background: #fdecec; color: #9b1c1c; }

.ia-alternativas {
  margin: 0 0 14px;
  color: #5f7375;
  font-size: 13px;
}

.ia-atributos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  gap: 10px;
  margin-bottom: 14px;
}

.ia-atributos label {
  display: flex;
  flex-direction: column;
  gap: 5px;
  color: #5f7375;
  font-size: 12px;
}

.ia-datos {
  margin-bottom: 14px;
}

.ia-chip {
  display: inline-block;
  margin: 0 6px 6px 0;
  padding: 4px 10px;
  border-radius: 20px;
  background: #edf3f3;
  color: #34494b;
  font-size: 12px;
}

.ia-justificacion {
  margin-bottom: 4px;
  color: #34494b;
  font-size: 13px;
}

.ia-justificacion summary {
  color: #147f74;
  font-weight: 600;
  cursor: pointer;
}

.ia-justificacion ul {
  margin: 8px 0;
  padding-left: 18px;
  line-height: 1.5;
}

.ia-modelo {
  margin: 0;
  color: #7a898b;
  font-size: 12px;
}

.ia-acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ia-aplicado {
  margin: 14px 0 0;
  color: #17603f;
  font-size: 13px;
  line-height: 1.5;
}

.ia-enlace {
  margin-left: 4px;
  padding: 0;
  border: none;
  background: none;
  color: #147f74;
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
}
</style>