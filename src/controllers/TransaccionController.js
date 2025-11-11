const TransaccionModel = require('../models/TransaccionModel');

// ✅ Crear transacción
async function crearTransaccion(req, res) {
  try {
    const { id_familia, idcategoria, fecha, tipo, monto, descripcion, identificacion } = req.body;

    console.log("📩 Datos recibidos para transacción:", req.body);

    const nueva = await TransaccionModel.insertarTransaccion(
      id_familia,
      idcategoria,
      fecha,
      tipo,
      monto,
      descripcion,
      identificacion
    );

    res.status(201).json(nueva);
  } catch (error) {
    console.error("❌ Error al crear transacción:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ✅ Obtener historial completo
async function obtenerTransacciones(req, res) {
  try {
    const transacciones = await TransaccionModel.obtenerTransacciones();
    res.status(200).json(transacciones);
  } catch (error) {
    console.error("❌ Error al obtener transacciones:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ✅ Obtener por familia (útil para filtros)
async function obtenerTransaccionesPorFamilia(req, res) {
  try {
    const { id_familia } = req.params;

    const datos = await TransaccionModel.obtenerTransaccionesPorFamilia(id_familia);
    res.status(200).json(datos);
  } catch (error) {
    console.error("❌ Error al obtener transacciones por familia:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ✅ Editar una transacción
async function editarTransaccion(req, res) {
  try {
    const { id } = req.params;
    const nuevaData = req.body;

    const editada = await TransaccionModel.editarTransaccion(id, nuevaData);

    if (!editada) {
      return res.status(404).json({ error: "Transacción no encontrada" });
    }

    res.status(200).json(editada);
  } catch (error) {
    console.error("❌ Error al editar transacción:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// ✅ Eliminar transacción
async function eliminarTransaccion(req, res) {
  try {
    const { id } = req.params;

    const eliminado = await TransaccionModel.eliminarTransaccion(id);

    if (eliminado.rowCount === 0) {
      return res.status(404).json({ error: "Transacción no encontrada" });
    }

    res.status(200).json({ mensaje: "✅ Transacción eliminada" });
  } catch (error) {
    console.error("❌ Error al eliminar transacción:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

module.exports = {
  crearTransaccion,
  obtenerTransacciones,
  obtenerTransaccionesPorFamilia,
  editarTransaccion,
  eliminarTransaccion
};
