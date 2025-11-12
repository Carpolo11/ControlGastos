// controllers/ExportacionController.js
const ExportacionModel = require('../models/ExportacionModel');
const XLSX = require('xlsx');
const { Parser } = require('json2csv');

// Exportar datos en formato Excel o CSV
async function exportarDatos(req, res) {
  const { tipo, formato, fecha_inicio, fecha_fin } = req.query;

  console.log("📊 Datos recibidos para exportación:", req.query);

  if (!tipo || !formato) {
    return res.status(400).json({ error: 'Tipo y formato son obligatorios' });
  }

  try {
    let datos = [];
    let nombreHoja = '';

    // Obtener datos según el tipo de reporte
    switch (tipo) {
      case 'transacciones':
        datos = await ExportacionModel.obtenerTransacciones(fecha_inicio, fecha_fin);
        nombreHoja = 'Transacciones';
        break;
      case 'familias':
        datos = await ExportacionModel.obtenerFamilias();
        nombreHoja = 'Familias';
        break;
      case 'miembros':
        datos = await ExportacionModel.obtenerMiembros();
        nombreHoja = 'Miembros';
        break;
      case 'gastos':
        datos = await ExportacionModel.obtenerGastos(fecha_inicio, fecha_fin);
        nombreHoja = 'Gastos';
        break;
      default:
        return res.status(400).json({ error: 'Tipo de reporte no válido' });
    }

    if (datos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron datos para exportar' });
    }

    // Generar archivo según el formato
    if (formato === 'xlsx') {
      // Generar Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(datos);
      XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Disposition', `attachment; filename=${tipo}_${Date.now()}.xlsx`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
      
    } else if (formato === 'csv') {
      // Generar CSV
      const parser = new Parser();
      const csv = parser.parse(datos);
      
      res.setHeader('Content-Disposition', `attachment; filename=${tipo}_${Date.now()}.csv`);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.send('\uFEFF' + csv); // BOM para UTF-8
      
    } else {
      return res.status(400).json({ error: 'Formato no válido' });
    }

    console.log(`✅ Reporte ${tipo} exportado exitosamente en formato ${formato}`);

  } catch (error) {
    console.error('❌ Error al exportar datos:', error.message);
    res.status(500).json({ error: 'Error interno del servidor al exportar datos' });
  }
}

module.exports = {
  exportarDatos
};