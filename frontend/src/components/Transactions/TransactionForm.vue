<template>
  <div class="form-container">
    <!-- Título principal del formulario -->
    <h2>💰 Registrar Transacción</h2>

    <!-- Formulario principal -->
    <form @submit.prevent="handleSubmit">
      <!-- Campo: Fecha -->
      <div class="input-group">
        <input v-model="formData.fecha" type="date" placeholder="Fecha" required />
      </div>

      <!-- Campo: Monto -->
      <div class="input-group">
        <input v-model="formData.monto" type="number" step="0.01" placeholder="Valor a ingresar" required />
      </div>

      <!-- Campo: Tipo (Ingreso/Egreso) -->
      <div class="input-group">
        <select v-model="formData.tipo" required>
          <option value="" disabled>Seleccionar Tipo</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
      </div>

      <!-- Campo: Categoría -->
      <div class="input-group">
        <select v-model="formData.idcategoria" required>
          <option value="" disabled>Seleccionar Categoría</option>
          <option v-for="cat in categorias" :key="cat.idcategoria" :value="cat.idcategoria">
            {{ cat.nombre }}
          </option>
        </select>
      </div>

      <!-- Campo: Descripción -->
      <div class="input-group">
        <textarea v-model="formData.descripcion" placeholder="Descripción de la transacción" rows="3" required></textarea>
      </div>

      <!-- Campo: Identificación del usuario -->
      <div class="input-group">
        <input v-model="formData.identificacion" type="number" placeholder="Identificación del usuario" required />
      </div>

      <!-- Campo: Familia -->
      <div class="input-group">
        <select v-model="formData.id_familia" required>
          <option value="" disabled>Elige una familia</option>
          <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
            {{ familia.nombre_familia }}
          </option>
        </select>
      </div>

      <!-- Botón de enviar -->
      <button type="submit" class="login-btn">
        {{ modoEdicion ? 'Actualizar Transacción' : 'Registrar Transacción' }}
      </button>

      <!-- Botón de cancelar solo visible en modo edición -->
      <button v-if="modoEdicion" type="button" class="cancel-btn" @click="$emit('cancelar')">
        Cancelar Edición
      </button>
    </form>

    <!-- Botón para volver -->
    <button class="login-btn" @click="$emit('volver')">
      Volver
    </button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

// Props recibidas desde el componente padre
const props = defineProps({
  categorias: { // Lista de categorías
    type: Array,
    required: true
  },
  familias: { // Lista de familias
    type: Array,
    required: true
  },
  transaccionEditar: { // Datos de la transacción que se edita
    type: Object,
    default: null
  },
  modoEdicion: { // Indica si está en modo edición
    type: Boolean,
    default: false
  },
  usuarioActual: { // Datos del usuario actual
    type: Object,
    required: true
  }
});

// Eventos emitidos al componente padre
const emit = defineEmits(['submit', 'volver', 'cancelar']);

// Datos reactivos del formulario
const formData = reactive({
  fecha: new Date().toISOString().split('T')[0], // Fecha actual por defecto
  monto: '', // Valor del dinero
  tipo: '', // Tipo: Ingreso o Egreso
  idcategoria: '', // Categoría seleccionada
  descripcion: '', // Descripción
  identificacion: props.usuarioActual.identificacion || '', // Identificación del usuario
  id_familia: '' // Familia seleccionada
});

// Observa si cambia la transacción a editar
watch(() => props.transaccionEditar, (nuevaTransaccion) => {
  if (nuevaTransaccion) {
    // Si hay transacción, carga sus datos en el formulario
    formData.fecha = nuevaTransaccion.fecha.split('T')[0];
    formData.monto = nuevaTransaccion.monto;
    formData.tipo = nuevaTransaccion.tipo;
    formData.idcategoria = nuevaTransaccion.idcategoria;
    formData.descripcion = nuevaTransaccion.descripcion;
    formData.identificacion = nuevaTransaccion.identificacion;
    formData.id_familia = nuevaTransaccion.id_familia;

    // Desplaza la pantalla hacia arriba para mostrar el formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Observa los cambios del modo edición
watch(() => props.modoEdicion, (nuevoValor) => {
  // Si se sale del modo edición, limpia el formulario
  if (!nuevoValor) {
    limpiarFormulario();
  }
});

// Función para limpiar todos los campos del formulario
const limpiarFormulario = () => {
  formData.fecha = new Date().toISOString().split('T')[0];
  formData.monto = '';
  formData.tipo = '';
  formData.idcategoria = '';
  formData.descripcion = '';
  formData.identificacion = props.usuarioActual.identificacion || '';
  formData.id_familia = '';
};

// Maneja el envío del formulario
const handleSubmit = () => {
  // Validación de campos vacíos
  if (!formData.fecha || !formData.monto || !formData.tipo || !formData.idcategoria || 
      !formData.descripcion || !formData.identificacion || !formData.id_familia) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  // Validación de monto positivo
  if (parseFloat(formData.monto) <= 0) {
    alert("⚠️ El monto debe ser mayor a 0.");
    return;
  }

  // Envía los datos al componente padre
  emit('submit', { ...formData });
  
  // Si no está en modo edición, limpia el formulario después de enviar
  if (!props.modoEdicion) {
    limpiarFormulario();
  }
};

// Expone la función para poder llamarla desde el componente padre
defineExpose({ limpiarFormulario });
</script>

<style scoped>
/* Contenedor principal del formulario */
.form-container {
  background: rgb(102, 174, 179);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 380px;
  margin-bottom: 2rem;
}

/* Título del formulario */
.form-container h2 {
  color: white;
  margin-bottom: 1.5rem;
}

/* Contenedor de cada input */
.input-group {
  margin-bottom: 1rem;
}

/* Estilos generales de inputs, selects y textarea */
input,
select,
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid black;
  border-radius: 50px;
  outline: none;
  font-size: 1rem;
  font-family: "Poppins", sans-serif;
  background: transparent;
  color: white;
}

/* Ajuste visual para textarea */
textarea {
  border-radius: 20px;
  resize: vertical;
  min-height: 80px;
}

/* Color de texto placeholder */
input::placeholder,
textarea::placeholder,
select option:first-child {
  color: black;
}

/* Color del texto del select */
select {
  color: black;
}

/* Estilos para opciones del select */
select option {
  background: white;
  color: black;
}

/* Quitar flechas de los inputs tipo número */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Botón principal de registrar o volver */
.login-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

/* Efecto hover del botón principal */
.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

/* Botón de cancelar edición */
.cancel-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

/* Efecto hover del botón cancelar */
.cancel-btn:hover {
  background: linear-gradient(135deg, #ee5a6f, #c92a2a);
  transform: translateY(-2px);
}
</style>
