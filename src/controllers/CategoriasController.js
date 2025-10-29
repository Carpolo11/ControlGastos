// controllers/MCategoriaController.js
const CategoriaModel = require('../models/CategoriaModel');


//Agregar Categoria
async function crearCategoria(req, res) {
  const { nombre, id_familia } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  try {
    const nuevaCategoria = await CategoriaModel.insertarCategoria( nombre, id_familia);
    res.status(201).json(nuevaCategoria);
  } catch (error) {
    console.error('❌ Error al crear categoria:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


// Obtener todas las categorias
async function obtenerCategoria(req, res) {
  try {
    const categoria = await CategoriaModel.obtenerCategorias();
    res.status(200).json(categoria);
  } catch (error) {
    console.error('❌ Error al obtener Categoria:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  crearCategoria,
  obtenerCategoria
};