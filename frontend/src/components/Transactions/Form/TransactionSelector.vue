<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <select v-model="valor" required>
      <option disabled value="">Seleccione...</option>
      <option
        v-for="option in options"
        :key="option"
        :value="option"
      >
        {{ option }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  label: String,
  options: Array,
  modelValue: String
})
const emit = defineEmits(['update:modelValue'])

// 🔹 variable local sincronizada con la prop
const valor = ref(props.modelValue)

// 🔹 cuando cambia el valor en el padre → actualiza el local
watch(
  () => props.modelValue,
  (nuevo) => {
    valor.value = nuevo
  }
)

// 🔹 cuando cambia el valor local → emite al padre
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

select {
  padding: 0.9rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background-color: #f9fafb;
  transition: 0.3s;
  font-size: 1rem;
}

select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25);
  outline: none;
}
</style>
