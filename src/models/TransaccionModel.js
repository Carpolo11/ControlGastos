// models/TransaccionModel.js
const db = require('../db');

// Insertar una nueva transacción
async function insertarTransaccion(id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion) {
  const query = `
    INSERT INTO transaccion (id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *;
  `;
  const values = [id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Obtener TODAS las transacciones (
async function obtenerTransacciones() {
  const query = `
    SELECT 
      t.*, 
      f.nombre_familia, 
      c.nombre_categoria
    FROM transaccion t
    LEFT JOIN familia f ON t.id_familia = f.id_familia
    LEFT JOIN categoria c ON t.idcategoria = c.idcategoria
    ORDER BY t.fecha DESC, t.id_transaccion DESC;
  `;
  const result = await db.query(query);
  return result.rows;
}

// ✅ Obtener transacciones solo de una familia específica
async function obtenerTransaccionesPorFamilia(id_familia) {
  const query = `
    SELECT 
      t.*, 
      f.nombre_familia, 
      c.nombre_categoria
    FROM transaccion t
    LEFT JOIN familia f ON t.id_familia = f.id_familia
    LEFT JOIN categoria c ON t.idcategoria = c.idcategoria
    WHERE t.id_familia = $1
    ORDER BY t.fecha DESC, t.id_transaccion DESC;
  `;
  const result = await db.query(query, [id_familia]);
  return result.rows;
}

module.exports = {
  insertarTransaccion,
  obtenerTransacciones,
  obtenerTransaccionesPorFamilia
};
