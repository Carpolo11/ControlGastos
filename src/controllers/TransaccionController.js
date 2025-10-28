// controllers/TransaccionController.js
const TransaccionModel = require('../models/TransaccionModel');

// Agregar transacción
async function crearTransaccion(req, res) {
  const { id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  try {
    const nuevaTransaccion = await TransaccionModel.insertarTransaccion(
      id_familia, 
      idcategoria, 
      fecha, 
      tipo, 
      monto, 
      descripcion, 
      identificacion
    );
    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    console.error('❌ Error al crear transacción:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Obtener todas las transacciones
async function obtenerTransacciones(req, res) {
  try {
    const transacciones = await TransaccionModel.obtenerTransacciones();
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