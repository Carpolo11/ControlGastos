// models/TransaccionModel.js
const db = require('../db');

// Insertar una nueva transacción
async function insertarTransaccion(tipo, categoria, monto, descripcion, fecha) {
  const query = `INSERT INTO transacciones (tipo, categoria, monto, descripcion, fecha) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const values = [tipo, categoria, monto, descripcion, fecha];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Obtener todas las transacciones
async function obtenerTransacciones() {
  const query = `SELECT * FROM transacciones ORDER BY fecha DESC, id DESC;`;
  const result = await db.query(query);
  return result.rows;
}

module.exports = {
  insertarTransaccion,
  obtenerTransacciones
};