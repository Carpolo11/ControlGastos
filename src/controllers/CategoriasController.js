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

// Eliminar categoria por ID
async function eliminarCategoria(req, res) {
  try {
    const { id } = req.params;

    const eliminado = await CategoriaModel.eliminarCategoriaPorId(id);

    if (eliminado.rowCount === 0) {
      return res.status(404).json({ error: "Categoria no encontrado" });
    }

    res.status(200).json({ mensaje: "✅ Categoria eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar Categoria:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// 🔹 Actualizar categoría por ID
async function actualizarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nombre, id_familia } = req.body;

    const actualizada = await CategoriaModel.actualizarCategoria(id, nombre, id_familia);

    if (!actualizada) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.status(200).json({ mensaje: "✅ Categoría actualizada correctamente", categoria: actualizada });
  } catch (error) {
    console.error("❌ Error al actualizar categoría:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


module.exports = {
  crearCategoria,
  obtenerCategoria,
  eliminarCategoria,
  actualizarCategoria
};