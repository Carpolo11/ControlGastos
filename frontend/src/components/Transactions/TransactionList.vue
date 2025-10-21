<template>
  <div class="transaction-list">
    <h2>📜 Historial de Transacciones</h2>

    <p v-if="!transacciones.length" class="no-data">
      Aún no hay transacciones registradas. 🌱
    </p>

    <div v-else class="historial">
      <div v-for="tipo in ['Ingreso', 'Egreso']" :key="tipo" class="grupo">
        <h3>{{ tipo }}s</h3>
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
            <tr v-for="t in transacciones.filter(tx => tx.tipo === tipo)" :key="t.id">
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
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  transacciones: Array
})
</script>

<style scoped>
.transaction-list {
  width: 100%;
  text-align: center;
}

h2 {
  color: #4338ca;
  font-weight: 700;
  margin-bottom: 1rem;
}

.grupo {
  margin-bottom: 2rem;
}

.grupo{
    color: #121513;   
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.8rem;
  font-size: 0.95rem;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(79, 70, 229, 0.1);
}

th, td {
  padding: 0.9rem;
  border-bottom: 1px solid #e5e7eb;
  text-align: center;
}

/* ✅ Encabezados visibles y modernos */
th {
  background: linear-gradient(90deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
}

/* ✅ Filas limpias */
td {
  color: #121513;
  background-color: #ffffff;
}

/* ✅ Alterna color de filas para mejor legibilidad */
tbody tr:nth-child(even) td {
  background-color: #121513;
}

/* ✅ Colores de ingreso y egreso */
.ingreso {
  color: #121513;
  font-weight: 700;
}

.egreso {
  color: #121513;
  font-weight: 700;
}

/* ✅ Botones de acción */
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

.btn-edit:hover {
  transform: scale(1.2);
  color: #4338ca;
}

.btn-delete {
  color: #dc2626;
}

.btn-delete:hover {
  transform: scale(1.2);
  color: #b91c1c;
}

/* ✅ Texto cuando no hay datos */
.no-data {
  color: #0c0d0f;
  font-style: italic;
  margin-top: 1rem;
}

</style>
