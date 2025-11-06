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

// Obtener transacciones filtradas por familia del usuario
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

// Actualizar una transacción
async function actualizarTransaccion(id_transaccion, id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion) {
  const query = `
    UPDATE transaccion 
    SET id_familia = $2, idcategoria = $3, fecha = $4, tipo = $5, monto = $6, descripcion = $7, identificacion = $8
    WHERE id_transaccion = $1
    RETURNING *;
  `;
  const values = [id_transaccion, id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Eliminar una transacción
async function eliminarTransaccion(id_transaccion) {
  const query = `DELETE FROM transaccion WHERE id_transaccion = $1 RETURNING *;`;
  const result = await db.query(query, [id_transaccion]);
  return result.rows[0];
}

module.exports = {
  insertarTransaccion,
  obtenerTransaccionesPorFamilia,
  actualizarTransaccion,
  eliminarTransaccion
};