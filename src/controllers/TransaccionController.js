// controllers/TransaccionController.js
const TransaccionModel = require('../models/TransaccionModel');

// Agregar transacción
async function crearTransaccion(req, res) {
  const { id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion } = req.body;

  console.log("📩 Datos recibidos del frontend:", req.body);

  // Validar que identificacion esté presente
  if (!identificacion) {
    return res.status(400).json({ error: 'La identificación es requerida' });
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

// Actualizar transacción
async function actualizarTransaccion(req, res) {
  const { id } = req.params;
  const { id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion } = req.body;

  console.log("🔄 Actualizando transacción ID:", id, "con datos:", req.body);

  if (!identificacion) {
    return res.status(400).json({ error: 'La identificación es requerida' });
  }

  try {
    const transaccionActualizada = await TransaccionModel.actualizarTransaccion(
      id,
      id_familia,
      idcategoria,
      fecha,
      tipo,
      monto,
      descripcion,
      identificacion
    );

    if (!transaccionActualizada) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.status(200).json(transaccionActualizada);
  } catch (error) {
    console.error('❌ Error al actualizar transacción:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Eliminar transacción
async function eliminarTransaccion(req, res) {
  const { id } = req.params;

  console.log("🗑️ Eliminando transacción ID:", id);

  try {
    const transaccionEliminada = await TransaccionModel.eliminarTransaccion(id);

    if (!transaccionEliminada) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }

    res.status(200).json({ mensaje: 'Transacción eliminada exitosamente', transaccion: transaccionEliminada });
  } catch (error) {
    console.error('❌ Error al eliminar transacción:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  crearTransaccion,
  obtenerTransacciones,
  actualizarTransaccion,
  eliminarTransaccion
};