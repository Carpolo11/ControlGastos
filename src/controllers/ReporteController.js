// controllers/ReporteController.js
const ReporteModel = require('../models/ReporteModel');

// Obtener todas las transacciones con información de miembros
async function obtenerReporteCompleto(req, res) {
  console.log("📊 Solicitando reporte completo...");

  try {
    const transacciones = await ReporteModel.obtenerTransaccionesConMiembros();
    res.status(200).json(transacciones);
  } catch (error) {
    console.error('❌ Error al obtener reporte completo:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Obtener resumen por categoría
async function obtenerResumenCategoria(req, res) {
  console.log("📊 Solicitando resumen por categoría...");

  try {
    const resumen = await ReporteModel.obtenerResumenPorCategoria();
    res.status(200).json(resumen);
  } catch (error) {
    console.error('❌ Error al obtener resumen por categoría:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Obtener resumen por miembro
async function obtenerResumenMiembro(req, res) {
  console.log("📊 Solicitando resumen por miembro...");

  try {
    const resumen = await ReporteModel.obtenerResumenPorMiembro();
    res.status(200).json(resumen);
  } catch (error) {
    console.error('❌ Error al obtener resumen por miembro:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Obtener balance general
async function obtenerBalance(req, res) {
  console.log("📊 Solicitando balance general...");

  try {
    const balance = await ReporteModel.obtenerBalanceGeneral();
    res.status(200).json(balance);
  } catch (error) {
    console.error('❌ Error al obtener balance:', error.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

module.exports = {
  obtenerReporteCompleto,
  obtenerResumenCategoria,
  obtenerResumenMiembro,
  obtenerBalance
};