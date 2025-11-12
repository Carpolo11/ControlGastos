
// models/ReporteModel.js
const db = require('../db');

// ✅ Obtener transacciones con filtros opcionales
async function obtenerReportes(filtros) {
  let query = `
    SELECT t.*, c.nombre AS nombre_categoria, f.nombre_familia
    FROM transaccion t
    LEFT JOIN categoria c ON c.idcategoria = t.idcategoria
    LEFT JOIN familia f ON f.id_familia = t.id_familia
    WHERE 1 = 1
  `;
  
  const values = [];
  let index = 1;

  // ✅ Filtro por familia
  if (filtros.id_familia) {
    query += ` AND t.id_familia = $${index++}`;
    values.push(filtros.id_familia);
  }

  // ✅ Filtro por fecha inicio
  if (filtros.fecha_inicio) {
    query += ` AND t.fecha >= $${index++}`;
    values.push(filtros.fecha_inicio);
  }

  // ✅ Filtro por fecha fin
  if (filtros.fecha_fin) {
    query += ` AND t.fecha <= $${index++}`;
    values.push(filtros.fecha_fin);
  }

  // ✅ Filtro por categoría
  if (filtros.idcategoria) {
    query += ` AND t.idcategoria = $${index++}`;
    values.push(filtros.idcategoria);
  }

  // ✅ Orden por fecha (reporte organizado)
  query += ` ORDER BY t.fecha DESC`;

  const result = await db.query(query, values);
  return result.rows;
}

module.exports = {
  obtenerReportes
};