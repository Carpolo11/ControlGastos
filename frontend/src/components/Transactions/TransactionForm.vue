<template>
  <div class="form-container">
    <h2>💰 Registrar Transacción</h2>

    <form @submit.prevent="handleSubmit">
      <div class="input-group">
        <input v-model="formData.fecha" type="date" placeholder="Fecha" required />
      </div>

      <div class="input-group">
        <input v-model="formData.monto" type="number" step="0.01" placeholder="Valor a ingresar" required />
      </div>

      <div class="input-group">
        <select v-model="formData.tipo" required>
          <option value="" disabled>Seleccionar Tipo</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
      </div>

      <div class="input-group">
        <select v-model="formData.idcategoria" required>
          <option value="" disabled>Seleccionar Categoría</option>
          <option v-for="cat in categorias" :key="cat.idcategoria" :value="cat.idcategoria">
            {{ cat.nombre }}
          </option>
        </select>
      </div>

      <div class="input-group">
        <textarea v-model="formData.descripcion" placeholder="Descripción de la transacción" rows="3" required></textarea>
      </div>

      <div class="input-group">
        <input v-model="formData.identificacion" type="number" placeholder="Identificación del usuario" required />
      </div>

      <div class="input-group">
        <select v-model="formData.id_familia" required>
          <option value="" disabled>Elige una familia</option>
          <option v-for="familia in familias" :key="familia.id_familia" :value="familia.id_familia">
            {{ familia.nombre_familia }}
          </option>
        </select>
      </div>

      <button type="submit" class="login-btn">
        {{ modoEdicion ? 'Actualizar Transacción' : 'Registrar Transacción' }}
      </button>

      <button v-if="modoEdicion" type="button" class="cancel-btn" @click="$emit('cancelar')">
        Cancelar Edición
      </button>
    </form>

    <button class="login-btn" @click="$emit('volver')">
      Volver
    </button>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  categorias: {
    type: Array,
    required: true
  },
  familias: {
    type: Array,
    required: true
  },
  transaccionEditar: {
    type: Object,
    default: null
  },
  modoEdicion: {
    type: Boolean,
    default: false
  },
  usuarioActual: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit', 'volver', 'cancelar']);

const formData = reactive({
  fecha: new Date().toISOString().split('T')[0],
  monto: '',
  tipo: '',
  idcategoria: '',
  descripcion: '',
  identificacion: props.usuarioActual.identificacion || '',
  id_familia: ''
});

// Observar cambios en transaccionEditar
watch(() => props.transaccionEditar, (nuevaTransaccion) => {
  if (nuevaTransaccion) {
    formData.fecha = nuevaTransaccion.fecha.split('T')[0];
    formData.monto = nuevaTransaccion.monto;
    formData.tipo = nuevaTransaccion.tipo;
    formData.idcategoria = nuevaTransaccion.idcategoria;
    formData.descripcion = nuevaTransaccion.descripcion;
    formData.identificacion = nuevaTransaccion.identificacion;
    formData.id_familia = nuevaTransaccion.id_familia;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Limpiar formulario cuando se cancela edición
watch(() => props.modoEdicion, (nuevoValor) => {
  if (!nuevoValor) {
    limpiarFormulario();
  }
});

const limpiarFormulario = () => {
  formData.fecha = new Date().toISOString().split('T')[0];
  formData.monto = '';
  formData.tipo = '';
  formData.idcategoria = '';
  formData.descripcion = '';
  formData.identificacion = props.usuarioActual.identificacion || '';
  formData.id_familia = '';
};

const handleSubmit = () => {
  if (!formData.fecha || !formData.monto || !formData.tipo || !formData.idcategoria || 
      !formData.descripcion || !formData.identificacion || !formData.id_familia) {
    alert("⚠️ Todos los campos son obligatorios.");
    return;
  }

  if (parseFloat(formData.monto) <= 0) {
    alert("⚠️ El monto debe ser mayor a 0.");
    return;
  }

  emit('submit', { ...formData });
  
  if (!props.modoEdicion) {
    limpiarFormulario();
  }
};

defineExpose({ limpiarFormulario });
</script>

<style scoped>
.form-container {
  background: rgb(102, 174, 179);
  padding: 2.5rem 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  text-align: center;
  width: 380px;
  margin-bottom: 2rem;
}

.form-container h2 {
  color: white;
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

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

textarea {
  border-radius: 20px;
  resize: vertical;
  min-height: 80px;
}

input::placeholder,
textarea::placeholder,
select option:first-child {
  color: black;
}

select {
  color: black;
}

select option {
  background: white;
  color: black;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

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

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

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

.cancel-btn:hover {
  background: linear-gradient(135deg, #ee5a6f, #c92a2a);
  transform: translateY(-2px);
}
</style>