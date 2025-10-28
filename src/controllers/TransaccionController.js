// controllers/TransaccionController.js
const TransaccionModel = require('../models/TransaccionModel');

// Agregar transacción
async function crearTransaccion(req, res) {
  const { id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  // Validar campos mínimos
  if (!id_familia || !idcategoria || !fecha || !tipo || !monto || !identificacion) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

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

// ✅ Obtener transacciones de una familia específica
async function obtenerTransacciones(req, res) {
  try {
    const { id_familia } = req.query;

    if (!id_familia) {
      return res.status(400).json({ error: "Falta el parámetro id_familia" });
    }

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
