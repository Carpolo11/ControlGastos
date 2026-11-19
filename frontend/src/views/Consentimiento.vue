<template>
  <div class="consentimiento-container">
    <section class="tarjeta">

      <span class="subtitle">ANTES DE CONTINUAR</span>
      <h1>Autoriza el tratamiento de tus datos</h1>
      <p>
        Para usar GRC IA necesitamos tu autorización, como lo exige la Ley 1581 de 2012.
        Léela con calma: puedes revocarla después desde <strong>Mis datos y privacidad</strong>.
      </p>

      <div class="resumen">
        <h2>En resumen</h2>
        <ul>
          <li>Usamos tu nombre, identificación, empresa y correo para tu cuenta, y la información de los activos que registres para evaluar su seguridad.</li>
          <li>GRC IA usa <strong>inteligencia artificial</strong> para clasificar activos y generar fichas y alertas. Todo lo generado con IA se marca así y tú decides si lo usas.</li>
          <li>No vendemos ni compartimos tus datos con terceros.</li>
          <li>Puedes consultar, actualizar o pedir la eliminación de tus datos cuando quieras.</li>
        </ul>
        <router-link to="/politica-datos" class="enlace">Leer la política completa →</router-link>
      </div>

      <form @submit.prevent="aceptar">
        <label class="casilla">
          <input v-model="acepta.tratamiento" type="checkbox" />
          <span>
            Autorizo el tratamiento de mis datos personales según la
            <router-link to="/politica-datos">política de tratamiento de datos</router-link>.
          </span>
        </label>

        <label class="casilla">
          <input v-model="acepta.terminos" type="checkbox" />
          <span>Acepto los términos de uso de GRC IA.</span>
        </label>

        <label class="casilla">
          <input v-model="acepta.ia" type="checkbox" />
          <span>Entiendo que GRC IA usa inteligencia artificial y que sus resultados son sugerencias que debo revisar.</span>
        </label>

        <p v-if="error" class="error" role="alert">{{ error }}</p>

        <div class="acciones">
          <button type="submit" class="btn-primary" :disabled="!todoAceptado || enviando">
            {{ enviando ? 'Guardando…' : 'Aceptar y continuar' }}
          </button>
          <button type="button" class="btn-secondary" @click="salir">
            No acepto, cerrar sesión
          </button>
        </div>
      </form>

    </section>
  </div>
</template>

<script setup>
// RF20: pedir la autorización a quien aún no ha aceptado la política vigente.
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const acepta = reactive({ tratamiento: false, terminos: false, ia: false })
const enviando = ref(false)
const error = ref('')

const todoAceptado = computed(() => acepta.tratamiento && acepta.terminos && acepta.ia)

async function aceptar() {
  if (!todoAceptado.value) return
  enviando.value = true
  error.value = ''

  try {
    const token = localStorage.getItem('token')
    await axios.post(
      'http://localhost:4000/privacidad/consentimiento',
      { acepta_tratamiento: true, acepta_terminos: true, informado_uso_ia: true },
      { headers: { Authorization: `Bearer ${token}` } }
    )

    // Recordar que ya aceptó para no volver a pedírselo en esta sesión
    const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
    usuario.consentimiento_vigente = true
    localStorage.setItem('usuario', JSON.stringify(usuario))

    router.push('/inventario')
  } catch (e) {
    error.value =
      e.response?.status === 401 || e.response?.status === 403
        ? 'Tu sesión expiró. Vuelve a iniciar sesión.'
        : e.response?.data?.error || 'No fue posible guardar tu autorización. Intenta de nuevo.'
  } finally {
    enviando.value = false
  }
}

function salir() {
  localStorage.removeItem('token')
  localStorage.removeItem('usuario')
  router.push('/login')
}
</script>

<style scoped>
.consentimiento-container {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  background: #f4f7f5;
  color: #24352d;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.tarjeta {
  width: 100%;
  max-width: 640px;
  padding: 34px;
  border: 1px solid #e6ece8;
  border-radius: 14px;
  background: #fff;
}

.subtitle {
  color: #16875e;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

h1 {
  margin: 10px 0;
  color: #20352b;
  font-size: 24px;
}

p {
  margin: 0 0 18px;
  color: #3d4944;
  font-size: 14px;
  line-height: 1.6;
}

.resumen {
  margin-bottom: 22px;
  padding: 16px 18px;
  border: 1px solid #cfe7e2;
  border-radius: 12px;
  background: #f4fbf9;
}

.resumen h2 {
  margin: 0 0 8px;
  font-size: 15px;
}

.resumen ul {
  margin: 0 0 10px;
  padding-left: 18px;
}

.resumen li {
  color: #3d4944;
  font-size: 13px;
  line-height: 1.6;
}

.enlace,
.casilla a {
  color: #16875e;
  font-weight: 600;
}

.casilla {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 14px;
  color: #34483b;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;
}

.casilla input {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: #16875e;
}

.error {
  padding: 10px 12px;
  border: 1px solid #f3c2c2;
  border-radius: 8px;
  background: #fdecec;
  color: #9b1c1c;
  font-size: 13px;
}

.acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  padding: 12px 18px;
  border-radius: 9px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.btn-primary {
  border: none;
  background: #16875e;
  color: #fff;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  border: 1px solid #d5ddd9;
  background: #fff;
  color: #2f3b36;
}

@media (max-width: 640px) {
  .tarjeta {
    padding: 22px 18px;
  }
}
</style>