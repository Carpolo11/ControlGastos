<template>
  <table>
    <thead>
      <tr>
        <th>Fecha</th>
        <th>Categoría</th>
        <th>Descripción</th>
        <th>Monto</th>
        <th>Usuario</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="t in transacciones" :key="t.id">
        <td>{{ t.fecha }}</td>
        <td>{{ t.categoria }}</td>
        <td>{{ t.descripcion }}</td>
        <td :class="t.tipo === 'Egreso' ? 'egreso' : 'ingreso'">
          ${{ t.monto.toFixed(2) }}
        </td>
        <td>{{ t.usuario }}</td>
        <td class="acciones">
          <button class="btn-edit" @click="$emit('editar', t)">✏️</button>
          <button class="btn-delete" @click="$emit('eliminar', t.id)">🗑️</button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  transacciones: Array
})
defineEmits(['editar', 'eliminar'])
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.8rem;
  font-size: 0.95rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(79, 70, 229, 0.1);
}
th {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  font-weight: 600;
}
td {
  color: #374151;
  background-color: #ffffff;
  text-align: center;
  padding: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
}
.ingreso {
  color: #16a34a;
  font-weight: 700;
}
.egreso {
  color: #dc2626;
  font-weight: 700;
}
.acciones button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.1rem;
  transition: transform 0.2s, color 0.2s;
}
.btn-edit {
  color: #4f46e5;
}
.btn-delete {
  color: #dc2626;
}
</style>
