
<template>
  <div class="registro-wrapper">

    <!-- PANEL IZQUIERDO -->
    <section class="brand-panel">
      <div class="brand-content">
        <h1>
          Registra tu empresa y comienza a proteger
          tus activos tecnológicos.
        </h1>

        <p class="brand-description">
          GRC IA simplifica la gestión de riesgos de ciberseguridad
          para las pequeñas y medianas empresas. Centraliza la
          información de tu organización e identifica posibles amenazas.
        </p>
      </div>

      <!-- Mensaje de Clara IA -->
      <div class="ai-message">
        <div class="ai-title">
          <span class="sparkle">✦</span>
          CLARA IA SECURITY ANALYST
        </div>

        <p>
          "Conocer tu empresa es el primer paso para identificar
          tus activos tecnológicos y anticipar posibles riesgos
          de ciberseguridad."
        </p>
      </div>

      <footer class="brand-footer">
        © 2026 GRC IA. Todos los derechos reservados.
      </footer>
    </section>

    <!-- PANEL DERECHO -->
    <section class="form-panel">
      <div class="registro-card">

        <header class="form-header">
          <span class="eyebrow">CONFIGURACIÓN INICIAL</span>

          <h2>Registrar empresa</h2>

          <p>
            Completa los datos de tu organización para comenzar
            a gestionar tus riesgos de ciberseguridad.
          </p>
        </header>

        <form @submit.prevent="registrarEmpresa">

          <!-- Nombre -->
          <div class="form-group">
            <label for="nombre">
              Nombre de la empresa <span class="required">*</span>
            </label>

            <input
              id="nombre"
              v-model.trim="form.nombre"
              type="text"
              placeholder="Ej. Tecnología Integral S.A.S."
              maxlength="180"
              autocomplete="organization"
              required
            />
          </div>

          <!-- NIT -->
          <div class="form-group">
            <label for="nit">NIT</label>

            <input
              id="nit"
              v-model.trim="form.nit"
              type="text"
              placeholder="Ej. 900123456-7"
              maxlength="40"
            />

            <small>
              El NIT es opcional, pero no puede repetirse.
            </small>
          </div>

          <!-- Sector -->
          <div class="form-row">
            <div class="form-group">
              <label for="sector">Sector económico</label>

              <select id="sector" v-model="form.sector">
                <option value="">Selecciona un sector</option>
                <option value="Tecnología">Tecnología</option>
                <option value="Comercio">Comercio</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Financiero">Financiero</option>
                <option value="Industrial">Industrial</option>
                <option value="Servicios">Servicios</option>
                <option value="Transporte">Transporte</option>
                <option value="Construcción">Construcción</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <!-- Tamaño -->
            <div class="form-group">
              <label for="tamano">Tamaño</label>

              <select id="tamano" v-model="form.tamano">
                <option value="">Selecciona</option>
                <option value="Microempresa">Microempresa</option>
                <option value="Pequeña">Pequeña</option>
                <option value="Mediana">Mediana</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
          </div>

          <!-- Correo -->
          <div class="form-group">
            <label for="correo_contacto">
              Correo de contacto
            </label>

            <input
              id="correo_contacto"
              v-model.trim="form.correo_contacto"
              type="email"
              placeholder="contacto@empresa.com"
              maxlength="180"
              autocomplete="email"
            />
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="telefono">Teléfono de contacto</label>

            <input
              id="telefono"
              v-model.trim="form.telefono"
              type="tel"
              placeholder="+57 300 123 4567"
              maxlength="40"
              autocomplete="tel"
            />
          </div>

          <!-- Mensaje -->
          <div
            v-if="mensaje"
            class="message"
            :class="tipoMensaje"
            role="status"
            aria-live="polite"
          >
            {{ mensaje }}
          </div>

          <!-- Botones -->
          <div class="form-actions">
            <button
              type="button"
              class="btn-secondary"
              @click="limpiarFormulario"
              :disabled="enviando"
            >
              Limpiar
            </button>

            <button
              type="submit"
              class="btn-primary"
              :disabled="enviando"
            >
              <span v-if="enviando" class="spinner"></span>

              {{
                enviando
                  ? 'Registrando...'
                  : 'Registrar empresa →'
              }}
            </button>
          </div>

          <p class="security-note">
            🔒 Información gestionada dentro de GRC IA.
          </p>

        </form>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: "RegistroEmpresaComponent",

  data() {
    return {
      enviando: false,
      mensaje: "",
      tipoMensaje: "",

      form: {
        nombre: "",
        nit: "",
        sector: "",
        tamano: "",
        correo_contacto: "",
        telefono: ""
      }
    };
  },

  methods: {
    async registrarEmpresa() {
      this.mensaje = "";
      this.tipoMensaje = "";

      if (!this.form.nombre.trim()) {
        this.mensaje = "El nombre de la empresa es obligatorio.";
        this.tipoMensaje = "error";
        return;
      }

      if (
        this.form.correo_contacto &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          this.form.correo_contacto
        )
      ) {
        this.mensaje = "Ingresa un correo válido.";
        this.tipoMensaje = "error";
        return;
      }

      const datos = {
        nombre: this.form.nombre,
        nit: this.form.nit || null,
        sector: this.form.sector || null,
        tamano: this.form.tamano || null,
        correo_contacto: this.form.correo_contacto || null,
        telefono: this.form.telefono || null
      };

      this.enviando = true;

      try {
        const respuesta = await fetch(
          "http://localhost:4000/empresas",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
          }
        );

        const resultado = await respuesta.json().catch(() => ({}));

        if (!respuesta.ok) {
          throw new Error(
            resultado.mensaje ||
            resultado.error ||
            "No fue posible registrar la empresa."
          );
        }

        this.mensaje = "¡Empresa registrada correctamente!";
        this.tipoMensaje = "success";

        const empresaRegistrada =
          resultado.empresa || resultado;

        this.$emit("empresa-registrada", empresaRegistrada);

        this.limpiarCampos();

      } catch (error) {
        console.error("Error al registrar la empresa:", error);

        this.mensaje =
          error.message ||
          "Error al conectar con el servidor.";

        this.tipoMensaje = "error";
      } finally {
        this.enviando = false;
      }
    },

    limpiarCampos() {
      this.form = {
        nombre: "",
        nit: "",
        sector: "",
        tamano: "",
        correo_contacto: "",
        telefono: ""
      };
    },

    limpiarFormulario() {
      this.limpiarCampos();
      this.mensaje = "";
      this.tipoMensaje = "";
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

body {
  font-family: Inter, "Segoe UI", Arial, sans-serif;
  color: #19262b;
}

button,
input,
select {
  font: inherit;
}

/* ESTRUCTURA PRINCIPAL */

.registro-wrapper {
  display: grid;
  grid-template-columns: 44% 56%;
  width: 100%;
  min-height: 100vh;
}

/* PANEL IZQUIERDO */

.brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-width: 0;
  min-height: 100vh;
  padding: 96px 10.5%;
  background: #102629;
  color: #fff;
}

.brand-content h1 {
  max-width: 540px;
  margin: 0;
  font-size: clamp(28px, 2.65vw, 38px);
  line-height: 1.2;
  font-weight: 750;
  letter-spacing: -0.7px;
}

.brand-description {
  max-width: 510px;
  margin-top: 25px;
  color: #a7b5b8;
  font-size: 16px;
  line-height: 1.55;
}

/* TARJETA DE CLARA IA */

.ai-message {
  width: 100%;
  max-width: 520px;
  margin-top: 135px;
  padding: 23px;
  border: 1px solid #b7c5c5;
  border-radius: 17px;
  background: rgba(255, 255, 255, 0.045);
}

.ai-title {
  margin-bottom: 10px;
  color: #168b7c;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.3px;
}

.sparkle {
  margin-right: 5px;
  font-size: 19px;
}

.ai-message p {
  margin: 0;
  color: #edf2f2;
  font-size: 13px;
  line-height: 1.5;
}

/* PIE DE PÁGINA */

.brand-footer {
  position: absolute;
  right: 10.5%;
  bottom: 0;
  left: 10.5%;
  padding-bottom: 0;
  color: #91a3a5;
  font-size: 12px;
}

/* PANEL DERECHO */

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  min-height: 100vh;
  padding: 45px 35px;
  background: #f3f5f7;
}

/* TARJETA DEL FORMULARIO */

.registro-card {
  width: 100%;
  max-width: 520px;
  padding: 35px 40px;
  border: 1px solid #dbe2e6;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 8px 25px rgba(22, 42, 48, 0.045);
}

.form-header {
  margin-bottom: 25px;
}

.eyebrow {
  display: block;
  margin-bottom: 10px;
  color: #16776d;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.form-header h2 {
  margin: 0 0 8px;
  color: #202a2e;
  font-size: 25px;
  font-weight: 750;
  letter-spacing: -0.5px;
}

.form-header p {
  margin: 0;
  color: #718087;
  font-size: 13px;
  line-height: 1.5;
}

/* CAMPOS */

.form-group {
  flex: 1;
  min-width: 0;
  margin-bottom: 17px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #202a2e;
  font-size: 12px;
  font-weight: 650;
}

.required {
  color: #dc2626;
}

.form-group input,
.form-group select {
  display: block;
  width: 100%;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #d7e0e5;
  border-radius: 8px;
  outline: none;
  background: #fff;
  color: #25343a;
  font-size: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input::placeholder {
  color: #89969c;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #16776d;
  box-shadow: 0 0 0 3px rgba(22, 119, 109, 0.1);
}

.form-group small {
  display: block;
  margin-top: 7px;
  color: #89969c;
  font-size: 10px;
  line-height: 1.5;
}

.form-row {
  display: flex;
  gap: 14px;
}

/* MENSAJES */

.message {
  margin: 10px 0 15px;
  padding: 11px 12px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.5;
}

.message.success {
  border: 1px solid #bbf7d0;
  background: #f0fdf4;
  color: #166534;
}

.message.error {
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
}

/* BOTONES */

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 22px;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 45px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.btn-primary {
  flex: 1;
  border: 1px solid #176e65;
  background: #176e65;
  color: #fff;
}

.btn-primary:hover:not(:disabled) {
  background: #11584f;
}

.btn-secondary {
  border: 1px solid #d7e0e5;
  background: #fff;
  color: #617179;
}

.btn-secondary:hover:not(:disabled) {
  background: #f3f5f7;
}

.btn-primary:disabled,
.btn-secondary:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.security-note {
  margin: 22px 0 0;
  color: #89969c;
  font-size: 10px;
  line-height: 1.6;
  text-align: center;
}

/* RESPONSIVE */

@media (max-width: 1100px) {
  .brand-panel {
    padding: 75px 8%;
  }

  .ai-message {
    margin-top: 85px;
  }

  .registro-card {
    padding: 30px 25px;
  }

  .form-panel {
    padding: 35px 22px;
  }
}

@media (max-width: 900px) {
  .registro-wrapper {
    grid-template-columns: 40% 60%;
  }

  .brand-panel {
    padding: 65px 8%;
  }

  .brand-content h1 {
    font-size: 29px;
  }

  .ai-message {
    margin-top: 60px;
    padding: 17px;
  }

  .registro-card {
    padding: 28px 22px;
  }
}

@media (max-width: 650px) {
  .registro-wrapper {
    display: flex;
    flex-direction: column;
  }

  .brand-panel {
    min-height: auto;
    padding: 45px 25px 30px;
  }

  .brand-content h1 {
    font-size: 30px;
  }

  .brand-description {
    margin-top: 17px;
    font-size: 14px;
  }

  .ai-message {
    margin-top: 25px;
    padding: 17px;
  }

  .brand-footer {
    position: static;
    margin-top: 30px;
    padding: 0;
    font-size: 11px;
  }

  .form-panel {
    min-height: auto;
    padding: 30px 18px;
  }

  .registro-card {
    max-width: 480px;
    padding: 28px 22px;
  }
}

@media (max-width: 420px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
