<template>
  <form class="transaction-form" @submit.prevent="enviar">
    
    <!-- Fila 1: Fecha y Tipo -->
    <div class="form-row">
      <div class="form-group">
        <label>Fecha</label>
        <input type="date" v-model="transaccion.fecha" required />
      </div>

      <div class="form-group">
        <label>Tipo</label>
        <select v-model="transaccion.tipo" required>
          <option value="" disabled >Seleccionar</option>
          <option value="Ingreso">Ingreso</option>
          <option value="Egreso">Egreso</option>
        </select>
      </div>
    </div>

    <!-- Fila 2: Monto y CategorÃ­a -->
    <div class="form-row">
      <div class="form-group">
        <label>Monto</label>
        <input type="number" v-model.number="transaccion.monto" min="0" step="0.01" required />
      </div>

      <div class="form-group">
        <label>Categorias</label>
        <select v-model="transaccion.idcategoria" required >
          <option value="" disabled >Seleccionar</option>
          <option 
            v-for="categoria in categorias" 
            :key="categoria.idcategoria" 
            :value="categoria.idcategoria"
          >
            {{ categoria.nombre }}
          </option>
        </select>
      </div>
          <!-- Fila 3: IdentificaciÃ³n -->
    <div class="form-group">
      <label>Identificacion</label>
      <input 
        type="text" 
        v-model="transaccion.identificacion" 
        placeholder="Ingresa tu identificaciÃ³n..." 
        required /></div>

    <div class="form-group">
        <label>Asignar a Familia</label>
        <select v-model="transaccion.id_familia" required>
          <option value=""  disabled >Seleccionar</option>
          <option 
            v-for="familia in familias" 
            :key="familia.id_familia" 
            :value="familia.id_familia"
            
          >
            {{familia.nombre_familia}}
          </option>
        </select>
      </div>


    </div>

    <!-- Campo DescripciÃ³n -->
    <div class="form-group">
      <label>Descripcion</label>
      <textarea v-model="transaccion.descripcion" placeholder="Describe la transacciÃ³n..." rows="2" required></textarea>
    </div>

    <!-- Botones de acciÃ³n -->
    <div class="form-actions">
      <!-- BotÃ³n cambia texto segÃºn modo ediciÃ³n -->
      <button type="submit" class="btn-registrar">
        {{ modoEdicion ? 'âœ“ Actualizar' : '+ Registrar' }}
      </button>
      
      <!-- BotÃ³n cancelar solo visible en modo ediciÃ³n -->
      <button v-if="modoEdicion" type="button" class="btn-cancelar" @click="cancelarEdicion">
        âœ• Cancelar
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch, onMounted, ref } from 'vue'
import axios from 'axios';
import { useRouter } from 'vue-router'

const router = useRouter()

const categorias = ref([]);
const familias = ref([]);
const token = localStorage.getItem("token");



    onMounted(async () => {
  try {

    // Cargar familias con token JWT
        const FamiliaResponde = await axios.get("http://localhost:4000/familia", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    familias.value = FamiliaResponde.data;

  } catch (error) {
    console.error("Error al cargar los datos:", error);
    if (error.response?.status === 401) {
      alert("âš ï¸ Tu sesiÃ³n ha expirado o no tienes autorizaciÃ³n. Inicia sesiÃ³n nuevamente.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
});



onMounted(async () => {
  try {

    // Cargar Categorias con token JWT
    const response = await axios.get("http://localhost:4000/categoria", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    categorias.value = response.data;
  } catch (error) {
    console.error("Error al cargar los datos:", error);
    if (error.response?.status === 401) {
      alert("âš ï¸ Tu sesiÃ³n ha expirado o no tienes autorizaciÃ³n. Inicia sesiÃ³n nuevamente.");
      localStorage.removeItem("token");
      router.push("/login");
    }
  }
});

// Props recibidos del componente padre
const props = defineProps({
  transaccionEditar: Object,
  modoEdicion: Boolean,
  familias: Array,
  idFamiliaUsuario: Number
})

// Eventos que emite hacia el padre
const emit = defineEmits(['registrar', 'actualizar', 'cancelar'])

// Estado reactivo del formulario
const transaccion = reactive({ 
  fecha: '', 
  tipo: '', 
  monto: '', 
  idcategoria: '', 
  descripcion: '', 
  identificacion: '',
  id_familia: ''
})

// Observador: cuando cambia transaccionEditar, carga los datos en el formulario
watch(() => props.transaccionEditar, (nueva) => {
  if (nueva) Object.assign(transaccion, nueva)
}, { immediate: true })

// Enviar formulario: registra nueva o actualiza existente
function enviar() {
  const datos = { 
    ...transaccion, 
    id_transaccion: props.modoEdicion ? transaccion.id_transaccion : Date.now()
  }

  console.log("ðŸ“¤ Enviando transacciÃ³n con familia:", datos.id_familia);
  emit(props.modoEdicion ? 'actualizar' : 'registrar', datos);
  limpiarFormulario();
}


// Cancelar ediciÃ³n y limpiar formulario
function cancelarEdicion() {
  emit('cancelar')
  limpiarFormulario()
}

// Resetear todos los campos del formulario
function limpiarFormulario() {
  Object.assign(transaccion, { 
    fecha: '', 
    tipo: '', 
    monto: '', 
    idcategoria: '', 
    descripcion: '', 
    identificacion: '',
    id_familia: '' 
  })
}
</script>

<style scoped>

/* Contenedor del formulario */
.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Filas con dos columnas para campos lado a lado */
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.5rem;
}

/* Contenedor de cada campo */
.form-group {
  display: flex;
  flex-direction: column;
}

/* Estilos de las etiquetas */
label {
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

/* Estilos de inputs, selects y textareas */
input, select,option, textarea {
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background-color: #f9fafb;
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  font-size: 0.95rem;
}

textarea {
  resize: vertical;
}

/* Estado focus de los campos */
input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}


select {
  color: #111827 !important; /* texto negro */
  background-color: #ffffff !important; /* fondo blanco */
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0.6rem;
  font-size: 0.95rem;
}

option {
  color: #111827 !important; /* texto negro */
  background-color: #ffffff !important; /* fondo blanco */
}

/* Contenedor de botones */
.form-actions {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

/* BotÃ³n principal (Registrar/Actualizar) */
.btn-registrar {
  flex: 1;
  background: linear-gradient(90deg, #4f46e5, #6366f1);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.3s;
}

.btn-registrar:hover {
  opacity: 0.9;
}

/* BotÃ³n secundario (Cancelar) */
.btn-cancelar {
  background: #6b7280;
  color: white;
  border: none;
  padding: 0.75rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-cancelar:hover {
  background: #4b5563;
}

/* Responsive: una columna en mÃ³viles */
@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>