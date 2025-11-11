// models/TransaccionModel.js
const db = require('../db');

// ✅ Insertar transacción
async function insertarTransaccion(id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion) {
  const query = `
    INSERT INTO transaccion 
    (id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;
  const values = [id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion];

  const result = await db.query(query, values);
  return result.rows[0];
}

// ✅ Obtener historial completo
async function obtenerTransacciones() {
  const query = `SELECT * FROM transaccion ORDER BY fecha DESC;`;
  const result = await db.query(query);
  return result.rows;
}

// ✅ Obtener por familia (útil para filtrar)
async function obtenerTransaccionesPorFamilia(id_familia) {
  const query = `
    SELECT * FROM transaccion 
    WHERE id_familia = $1
    ORDER BY fecha DESC;
  `;
  return (await db.query(query, [id_familia])).rows;
}

// ✅ Editar transacción
async function editarTransaccion(id, datos) {
  const { idcategoria, fecha, tipo, monto, descripcion } = datos;

  const query = `
    UPDATE transaccion SET
      idcategoria = $1,
      fecha = $2,
      tipo = $3,
      monto = $4,
      descripcion = $5
    WHERE id_transaccion = $6
    RETURNING *;
  `;

  const values = [idcategoria, fecha, tipo, monto, descripcion, id];
  const result = await db.query(query, values);
  return result.rows[0];
}

// ✅ Eliminar transacción
async function eliminarTransaccion(id) {
  const query = `DELETE FROM transaccion WHERE id_transaccion = $1`;
  return await db.query(query, [id]);
}

module.exports = {
  insertarTransaccion,
  obtenerTransacciones,
  obtenerTransaccionesPorFamilia,
  editarTransaccion,
  eliminarTransaccion
};
