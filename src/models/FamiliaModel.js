// models/FamiliaModel.js
const db = require('../db');

// Insertar una nueva familia
async function insertarFamilia(nombre_familia, fecha_creacion) {
  const query = `INSERT INTO familia (nombre_familia, fecha_creacion) VALUES ($1, $2) RETURNING *;`;
  const values = [nombre_familia, fecha_creacion];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Obtener todas las familias
async function obtenerFamilias() {
  const query = 'SELECT * FROM familia ORDER BY id_familia ASC;';
  const result = await db.query(query);
  return result.rows;
}




module.exports = {
  insertarFamilia,
  obtenerFamilias
};