// controllers/ExportacionController.js
const ExportacionModel = require('../models/ExportacionModel');
const XLSX = require('xlsx');
const { Parser } = require('json2csv');

// Exportar datos en formato Excel o CSV
async function exportarDatos(req, res) {
  const { tipo, formato, fecha_inicio, fecha_fin } = req.query;

  console.log("📊 Datos recibidos para exportación:", {
    tipo,
    formato,
    fecha_inicio,
    fecha_fin
  });

  if (!tipo || !formato) {
    return res.status(400).json({ error: 'Tipo y formato son obligatorios' });
  }

  try {
    let datos = [];
    let nombreHoja = '';
    let nombreArchivo = '';

    // Obtener datos según el tipo de reporte
    switch (tipo) {
      case 'transacciones':
        datos = await ExportacionModel.obtenerTransacciones(fecha_inicio, fecha_fin);
        nombreHoja = 'Transacciones';
        nombreArchivo = `Transacciones_${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'familias':
        datos = await ExportacionModel.obtenerFamilias();
        nombreHoja = 'Familias';
        nombreArchivo = `Familias_${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'miembros':
        datos = await ExportacionModel.obtenerMiembros();
        nombreHoja = 'Miembros';
        nombreArchivo = `Miembros_${new Date().toISOString().split('T')[0]}`;
        break;
      
      case 'gastos':
        datos = await ExportacionModel.obtenerGastos(fecha_inicio, fecha_fin);
        nombreHoja = 'Gastos';
        nombreArchivo = `Gastos_${new Date().toISOString().split('T')[0]}`;
        break;
      
      default:
        return res.status(400).json({ error: 'Tipo de reporte no válido' });
    }

    console.log(`📋 Datos obtenidos: ${datos.length} registros`);

    if (datos.length === 0) {
      return res.status(404).json({ 
        error: 'No se encontraron datos para exportar en el rango seleccionado' 
      });
    }

    // Formatear datos antes de exportar
    const datosFormateados = formatearDatos(datos, tipo);

    // Generar archivo según el formato
    if (formato === 'xlsx') {
      // Generar Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(datosFormateados);
      
      // Ajustar ancho de columnas
      const colWidths = Object.keys(datosFormateados[0] || {}).map(key => ({
        wch: Math.max(key.length, 15)
      }));
      worksheet['!cols'] = colWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, nombreHoja);
      
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}.xlsx"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
      
      console.log(`✅ Excel generado: ${nombreArchivo}.xlsx`);
      
    } else if (formato === 'csv') {
      // Generar CSV
      const fields = Object.keys(datosFormateados[0]);
      const parser = new Parser({ fields, withBOM: true });
      const csv = parser.parse(datosFormateados);
      
      res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}.csv"`);
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.send(csv);
      
      console.log(`✅ CSV generado: ${nombreArchivo}.csv`);
      
    } else {
      return res.status(400).json({ error: 'Formato no válido. Use xlsx o csv' });
    }

  } catch (error) {
    console.error('❌ Error al exportar datos:', error);
    res.status(500).json({ 
      error: 'Error interno del servidor al exportar datos',
      detalles: error.message 
    });
  }
}

// Función para formatear datos según el tipo
function formatearDatos(datos, tipo) {
  switch (tipo) {
    case 'transacciones':
      return datos.map(t => ({
        'ID': t.id,
        'Tipo': t.tipo,
        'Monto': parseFloat(t.monto).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        'Descripción': t.descripcion || 'Sin descripción',
        'Categoría': t.categoria || 'Sin categoría',
        'Fecha': new Date(t.fecha).toLocaleDateString('es-CO'),
        'Familia': t.nombre_familia,
        'Responsable': t.nombre_completo
      }));
    
    case 'familias':
      return datos.map(f => ({
        'ID': f.id_familia,
        'Nombre Familia': f.nombre_familia,
        'Dirección': f.direccion || 'Sin dirección',
        'Teléfono': f.telefono || 'Sin teléfono',
        'Email': f.email || 'Sin email',
        'Total Miembros': f.total_miembros || 0,
        'Total Ingresos': parseFloat(f.total_ingresos || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        'Total Egresos': parseFloat(f.total_egresos || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        'Saldo': parseFloat(f.saldo || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })
      }));
    
    case 'miembros':
      return datos.map(m => ({
        'ID': m.idmiembro_familia,
        'Nombre': m.nombre,
        'Apellido': m.apellido,
        'Edad': m.edad || 'N/A',
        'Género': m.genero || 'No especificado',
        'Parentesco': m.parentesco || 'No especificado',
        'Ocupación': m.ocupacion || 'No especificada',
        'Estado Civil': m.estado_civil || 'No especificado',
        'Nivel Educativo': m.nivel_educativo || 'No especificado',
        'Familia': m.nombre_familia,
        'Fecha Nacimiento': m.fecha_nacimiento ? new Date(m.fecha_nacimiento).toLocaleDateString('es-CO') : 'No especificada'
      }));
    
    case 'gastos':
      return datos.map(g => ({
        'ID': g.id,
        'Monto': parseFloat(g.monto).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
        'Descripción': g.descripcion || 'Sin descripción',
        'Categoría': g.categoria || 'Sin categoría',
        'Fecha': new Date(g.fecha).toLocaleDateString('es-CO'),
        'Familia': g.nombre_familia,
        'Responsable': g.nombre_completo
      }));
    
    default:
      return datos;
  }
}

module.exports = {
  exportarDatos
};