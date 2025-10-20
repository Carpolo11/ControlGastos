<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      :id="id"
      :type="type"
      v-model="valor"
      :placeholder="placeholder"
      required
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  id: String,
  label: String,
  type: { type: String, default: 'text' },
  modelValue: [String, Number],
  placeholder: String
})
const emit = defineEmits(['update:modelValue'])

// 🔹 Variable local para manejar el valor del input
const valor = ref(props.modelValue)

// 🔹 Sincroniza cuando cambia el valor desde el padre
watch(
  () => props.modelValue,
  (nuevo) => {
    valor.value = nuevo
  }
)

// 🔹 Emite cambios hacia el padre cuando el usuario escribe
watch(valor, (nuevo) => {
  emit('update:modelValue', nuevo)
})
</script>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: 600;
  color: #4338ca;
  margin-bottom: 0.3rem;
}

input {
  padding: 0.9rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: #f9fafb;
  transition: 0.3s;
  font-size: 1rem;
}

input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  outline: none;
}
</style>
