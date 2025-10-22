// models/MiembroModel.js
const db = require('../db');

// Insertar una categoria
async function insertarCategoria(nombre, tipo, id_familia) {
  const query = `INSERT INTO categoria ( nombre, tipo, id_familia) VALUES ($1, $2, $3) RETURNING *;`;
  const values = [nombre, tipo, id_familia];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Obtener todas las categorias
async function obtenerCategorias() {
  const query = `SELECT * FROM categoria ORDER BY id ASC;`;
  const result = await db.query(query);
  return result.rows;
}


module.exports = {
  insertarCategoria,
  obtenerCategorias
};