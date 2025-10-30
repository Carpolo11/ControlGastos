// controllers/TransaccionController.js
const TransaccionModel = require('../models/TransaccionModel');

// Agregar transacción
async function crearTransaccion(req, res) {
  const { id_familia, idcategoria, fecha, tipo, monto, descripcion } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  try {
    const nuevaTransaccion = await TransaccionModel.insertarTransaccion(
      id_familia, 
      idcategoria, 
      fecha, 
      tipo, 
      monto, 
      descripcion
    
    );
    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    console.error('❌ Error al crear transacción:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Obtener transacciones filtradas por familia
async function obtenerTransacciones(req, res) {
  const { id_familia } = req.query;

  console.log("📊 Solicitando transacciones de la familia:", id_familia);

  if (!id_familia) {
    return res.status(400).json({ error: 'El id_familia es requerido' });
  }

  try {
    const transacciones = await TransaccionModel.obtenerTransaccionesPorFamilia(id_familia);
    res.status(200).json(transacciones);
  } catch (error) {
    console.error('❌ Error al obtener transacciones:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  crearTransaccion,
  obtenerTransacciones
};