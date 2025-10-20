// controllers/FamiliaController.js
const familiaModel = require('../models/FamiliaModel');


//Crear Familia
async function crearFamilia(req, res) {
  const { nombre_familia, fecha_creacion } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  try {
    const nuevaFamilia = await familiaModel.insertarFamilia( nombre_familia, fecha_creacion);
    res.status(201).json(nuevaFamilia);
  } catch (error) {
    console.error('❌ Error al crear familia:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}


// Obtener todas las familias
async function obtenerFamilias(req, res) {
  try {
    const familia = await familiaModel.obtenerFamilias();
    res.status(200).json(familia);
  } catch (error) {
    console.error('❌ Error al obtener familias:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}



module.exports = {
  crearFamilia,
  obtenerFamilias
}