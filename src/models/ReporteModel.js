// models/ReporteModel.js
const db = require('../db');

// Obtener todas las transacciones con información del miembro
async function obtenerTransaccionesConMiembros() {
  const query = `
    SELECT 
      t.*,
      m.nombre,
      m.apellido,
      m.idmiembro_familia as id_miembro
    FROM transacciones t
    LEFT JOIN miembro_familia m ON t.id_miembro = m.idmiembro_familia
    ORDER BY t.fecha DESC, t.id DESC;
  `;
  const result = await db.query(query);
  return result.rows;
}

// Obtener resumen por categoría
async function obtenerResumenPorCategoria() {
  const query = `
    SELECT 
      categoria,
      tipo,
      SUM(monto) as total,
      COUNT(*) as cantidad
    FROM transacciones
    GROUP BY categoria, tipo
    ORDER BY total DESC;
  `;
  const result = await db.query(query);
  return result.rows;
}

// Obtener resumen por miembro
async function obtenerResumenPorMiembro() {
  const query = `
    SELECT 
      m.idmiembro_familia as id_miembro,
      m.nombre,
      m.apellido,
      t.tipo,
      SUM(t.monto) as total,
      COUNT(*) as cantidad
    FROM miembro_familia m
    LEFT JOIN transacciones t ON t.id_miembro = m.idmiembro_familia
    GROUP BY m.idmiembro_familia, m.nombre, m.apellido, t.tipo
    ORDER BY total DESC;
  `;
  const result = await db.query(query);
  return result.rows;
}

// Obtener balance general
async function obtenerBalanceGeneral() {
  const query = `
    SELECT 
      tipo,
      SUM(monto) as total
    FROM transacciones
    GROUP BY tipo;
  `;
  const result = await db.query(query);
  return result.rows;
}

module.exports = {
  obtenerTransaccionesConMiembros,
  obtenerResumenPorCategoria,
  obtenerResumenPorMiembro,
  obtenerBalanceGeneral
};