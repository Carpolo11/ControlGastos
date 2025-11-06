// controllers/MiembroController.js
const MiembroModel = require('../models/MiembroModel');

//Agregar miembro
async function crearMiembro(req, res) {
  const { nombre, apellido, identificacion, rol, id_familia } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  try {
    const nuevaFamilia = await MiembroModel.insertarMiembro( nombre, apellido, identificacion, rol, id_familia);
    res.status(201).json(nuevaFamilia);
  } catch (error) {
    console.error('❌ Error al crear familia:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


// Obtener todos los miembros
async function obtenerMiembros(req, res) {
  try {
    const miembros = await MiembroModel.obtenerMiembros();
    res.status(200).json(miembros);
  } catch (error) {
    console.error('❌ Error al obtener familias:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Eliminar miembro por ID
async function eliminarMiembro(req, res) {
  try {
    const { id } = req.params;

    const eliminado = await MiembroModel.eliminarMiembroPorId(id);

    if (eliminado.rowCount === 0) {
      return res.status(404).json({ error: "Miembro no encontrado" });
    }

    res.status(200).json({ mensaje: "✅ Miembro eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error al eliminar miembro:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}


module.exports = {
  crearMiembro,
  obtenerMiembros,
  eliminarMiembro

};