// controllers/ReporteController.js
const ReporteModel = require('../models/ReporteModel');

async function obtenerReportes(req, res) {
  try {
    const filtros = {
      id_familia: req.query.id_familia || null,
      fecha_inicio: req.query.fecha_inicio || null,
      fecha_fin: req.query.fecha_fin || null,
      idcategoria: req.query.idcategoria || null
    };

    console.log("📩 Filtros recibidos en backend:", filtros);

    const datos = await ReporteModel.obtenerReportes(filtros);
    res.status(200).json(datos);
    
  } catch (error) {
    console.error("❌ Error al generar reporte:", error);
    res.status(500).json({ error: "Error al obtener los reportes." });
  }
}

module.exports = {
  obtenerReportes
};
