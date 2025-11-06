// models/MiembroModel.js
const db = require('../db');

// Insertar una categoria
async function insertarCategoria(nombre, id_familia) {
  const query = `INSERT INTO categoria ( nombre, id_familia) VALUES ($1, $2) RETURNING *;`;
  const values = [nombre, id_familia];
  const result = await db.query(query, values);
  return result.rows[0];
}

// Obtener todas las categorias
async function obtenerCategorias() {
  const query = `SELECT * FROM categoria ORDER BY idcategoria ASC;`;
  const result = await db.query(query);
  return result.rows;
}

// 🔹 Eliminar categoria por ID
async function eliminarCategoriaPorId(id) {
  const query = 'DELETE FROM categoria WHERE idcategoria = $1';
  const values = [id];
  return await db.query(query, values);
}


module.exports = {
  insertarCategoria,
  obtenerCategorias,
  eliminarCategoriaPorId
};