// models/MiembroModel.js
const db = require('../db');

// Insertar una nuevo miembro
async function insertarMiembro(nombre, apellido, identificacion, rol, id_familia) {
  const query = `INSERT INTO miembro_familia (nombre, apellido, identificacion, rol, id_familia) VALUES ($1, $2, $3, $4, $5) RETURNING *;`;
  const values = [nombre, apellido, identificacion, rol, id_familia];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Obtener todos los miembros
async function obtenerMiembros() {
  const query = `SELECT * FROM miembro_familia ORDER BY idmiembro_familia ASC;`;
  const result = await db.query(query);
  return result.rows;
}

// 🔹 Eliminar miembro por ID
async function eliminarMiembroPorId(id) {
  const query = 'DELETE FROM miembro_familia WHERE idmiembro_familia = $1';
  const values = [id];
  return await db.query(query, values);
}


module.exports = {
  insertarMiembro,
  obtenerMiembros,
  eliminarMiembroPorId
};