<template>
  <div class="politica-container">
    <article class="politica">

      <header>
        <span class="subtitle">GRC IA</span>
        <h1>Política de tratamiento de datos personales y términos de uso</h1>
        <p class="meta">Versión {{ VERSION }} · Vigente desde el {{ FECHA_VIGENCIA }}</p>
        <p class="nota-plantilla">
          Documento elaborado para el proyecto académico GRC IA. Antes de usar la
          plataforma con clientes reales, debe revisarse con asesoría jurídica y
          completarse con los datos del responsable.
        </p>
      </header>

      <section>
        <h2>1. Responsable del tratamiento</h2>
        <ul class="datos">
          <li><strong>Responsable:</strong> {{ RESPONSABLE.nombre }}</li>
          <li><strong>Correo de contacto:</strong> {{ RESPONSABLE.correo }}</li>
          <li><strong>Dirección:</strong> {{ RESPONSABLE.direccion }}</li>
          <li><strong>Teléfono:</strong> {{ RESPONSABLE.telefono }}</li>
        </ul>
      </section>

      <section>
        <h2>2. Datos que recolectamos</h2>
        <ul>
          <li>De la persona que crea la cuenta: nombre, número de identificación, nombre de la empresa, correo electrónico y contraseña (que se guarda cifrada y nadie puede leer).</li>
          <li>De la empresa: la información de sus activos tecnológicos que el usuario registra (equipos, programas, servidores, redes y su nivel de importancia).</li>
          <li>De la autorización: la fecha, la versión de esta política que se aceptó y la dirección IP desde la que se aceptó, como prueba de la autorización.</li>
        </ul>
        <p>
          GRC IA no solicita datos sensibles (como salud, origen étnico u opiniones
          políticas) ni datos de niños, niñas o adolescentes. Si en algún momento se
          pidieran, responder sería opcional.
        </p>
      </section>

      <section>
        <h2>3. Para qué usamos los datos</h2>
        <ul>
          <li>Crear y administrar la cuenta e identificar al usuario al iniciar sesión.</li>
          <li>Registrar el inventario de activos tecnológicos de la empresa y evaluar su seguridad.</li>
          <li>Generar análisis, fichas, alertas y recomendaciones de ciberseguridad.</li>
          <li>Atender las solicitudes del titular sobre sus datos.</li>
          <li>Mejorar la precisión de las funciones de inteligencia artificial con las correcciones que hacen los usuarios.</li>
        </ul>
        <p>Los datos no se venden ni se comparten con terceros con fines comerciales.</p>
      </section>

      <section class="destacado">
        <h2>4. Uso de inteligencia artificial</h2>
        <p>GRC IA usa inteligencia artificial para:</p>
        <ul>
          <li>Clasificar los activos a partir de la descripción que escribe el usuario.</li>
          <li>Generar la ficha de conocimiento de cada activo y el panel de seguridad.</li>
        </ul>
        <p>
          Estas funciones corren en los servidores de GRC IA y no envían la información a
          proveedores externos. Todo resultado generado con IA se muestra con la
          etiqueta <strong>«Generado con IA»</strong> y es una sugerencia: el usuario
          siempre puede revisarlo, corregirlo o descartarlo.
        </p>
        <p>
          Si en el futuro se usa un servicio de IA externo, antes de enviarle información
          se eliminarán o anonimizarán los datos que permitan identificar a personas.
        </p>
      </section>

      <section>
        <h2>5. Derechos del titular</h2>
        <p>Según el artículo 8 de la Ley 1581 de 2012, como titular de los datos puedes:</p>
        <ul>
          <li>Conocer, actualizar y rectificar tus datos personales.</li>
          <li>Pedir prueba de la autorización que diste.</li>
          <li>Ser informado, si lo pides, sobre el uso que se ha dado a tus datos.</li>
          <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
          <li>Revocar la autorización o pedir que se eliminen tus datos, cuando no exista un deber legal o contractual de conservarlos.</li>
          <li>Acceder gratis a tus datos.</li>
        </ul>
      </section>

      <section>
        <h2>6. Cómo ejercer tus derechos</h2>
        <p>
          Dentro de GRC IA, en la sección <strong>Mis datos y privacidad</strong>, puedes
          consultar y actualizar tus datos al instante, ver el historial de tus
          autorizaciones y enviar solicitudes de eliminación, revocación o corrección.
          También puedes escribir al correo de contacto del responsable.
        </p>
        <ul>
          <li><strong>Consultas:</strong> se responden en máximo 10 días hábiles, prorrogables hasta 5 días hábiles más (art. 14).</li>
          <li><strong>Reclamos</strong> (eliminación, revocación o corrección): se responden en máximo 15 días hábiles, prorrogables hasta 8 días hábiles más (art. 15).</li>
        </ul>
      </section>

      <section>
        <h2>7. Seguridad de la información</h2>
        <p>
          Las contraseñas se guardan cifradas, el acceso a la información exige iniciar
          sesión y cada usuario solo ve los activos de su cuenta.
        </p>
      </section>

      <section>
        <h2>8. Términos de uso</h2>
        <ul>
          <li>El usuario es responsable de que la información que registra sea correcta y de tener autorización para registrarla.</li>
          <li>Las sugerencias de la IA son una ayuda y no reemplazan el criterio de un profesional en seguridad de la información.</li>
          <li>El usuario debe proteger su contraseña y no compartir su cuenta.</li>
        </ul>
      </section>

      <section>
        <h2>9. Vigencia y cambios</h2>
        <p>
          Esta política rige desde la fecha indicada arriba. Si cambia, se publicará una
          nueva versión y se pedirá aceptarla de nuevo al iniciar sesión.
        </p>
        <p class="fuente">
          Marco legal:
          <a href="https://relatoria.colombiacompra.gov.co/normativa/ley-1581-de-2012/" target="_blank" rel="noopener">
            Ley 1581 de 2012
          </a>
        </p>
      </section>

      <footer>
        <button type="button" class="btn-secondary" @click="volver">← Volver</button>
      </footer>

    </article>
  </div>
</template>

<script setup>
// RF20: política de tratamiento de datos (Ley 1581 de 2012, art. 12 y 13).
// Si cambian el texto, suban también VERSION_POLITICA en src/politicaDatos.js.
import { useRouter } from 'vue-router'

const VERSION = '1.0'
const FECHA_VIGENCIA = '18 de noviembre de 2026'

// Completar con los datos reales del responsable
const RESPONSABLE = {
  nombre: 'Equipo GRC IA (por definir)',
  correo: 'privacidad@grcia.co (por definir)',
  direccion: 'Por definir',
  telefono: 'Por definir'
}

const router = useRouter()

// Volver a la página anterior; si se abrió en una pestaña nueva, ir al inicio
const volver = () => (window.history.length > 1 ? router.back() : router.push('/login'))
</script>

<style scoped>
.politica-container {
  min-height: 100vh;
  padding: 40px 16px;
  background: #f4f7f5;
  color: #24352d;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.politica {
  max-width: 820px;
  margin: 0 auto;
  padding: 36px;
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
  margin: 10px 0 8px;
  color: #20352b;
  font-size: 26px;
  line-height: 1.25;
}

.meta {
  margin: 0 0 14px;
  color: #7c8982;
  font-size: 13px;
}

.nota-plantilla {
  margin: 0 0 24px;
  padding: 12px 14px;
  border: 1px solid #f1dca7;
  border-radius: 10px;
  background: #fff8e6;
  color: #6f5300;
  font-size: 13px;
  line-height: 1.5;
}

section {
  margin-bottom: 26px;
}

h2 {
  margin: 0 0 10px;
  color: #263b30;
  font-size: 17px;
}

p,
li {
  color: #3d4944;
  font-size: 14px;
  line-height: 1.65;
}

p {
  margin: 0 0 10px;
}

ul {
  margin: 0 0 10px;
  padding-left: 20px;
}

.datos {
  padding-left: 0;
  list-style: none;
}

.destacado {
  padding: 18px 20px;
  border: 1px solid #cfe7e2;
  border-radius: 12px;
  background: #f4fbf9;
}

.fuente a {
  color: #16875e;
}

footer {
  padding-top: 10px;
  border-top: 1px solid #eef2ef;
}

.btn-secondary {
  margin-top: 16px;
  padding: 11px 18px;
  border: 1px solid #d5ddd9;
  border-radius: 8px;
  background: #fff;
  color: #2f3b36;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

@media (max-width: 640px) {
  .politica {
    padding: 22px 18px;
  }

  h1 {
    font-size: 22px;
  }
}
</style>