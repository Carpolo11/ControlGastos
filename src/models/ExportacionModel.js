// models/ExportacionModel.js
const db = require('../db');

// Obtener transacciones con filtros opcionales
async function obtenerTransacciones(fechaInicio, fechaFin) {
  let query = `SELECT * FROM transacciones WHERE 1=1`;
  const values = [];
  let paramIndex = 1;

  if (fechaInicio) {
    query += ` AND fecha >= $${paramIndex}`;
    values.push(fechaInicio);
    paramIndex++;
  }

  if (fechaFin) {
    query += ` AND fecha <= $${paramIndex}`;
    values.push(fechaFin);
    paramIndex++;
  }

  query += ` ORDER BY fecha DESC, id DESC`;

  const result = await db.query(query, values);
  return result.rows;
}

// Obtener todas las familias
async function obtenerFamilias() {
  const query = `SELECT * FROM familia ORDER BY id_familia ASC`;
  const result = await db.query(query);
  return result.rows;
}

// Obtener todos los miembros
async function obtenerMiembros() {
  const query = `
    SELECT 
      m.*,
      f.nombre_familia
    FROM miembro_familia m
    LEFT JOIN familia f ON m.id_familia = f.id_familia
    ORDER BY m.idmiembro_familia ASC
  `;
  const result = await db.query(query);
  return result.rows;
}

// Obtener reporte de gastos con filtros
async function obtenerGastos(fechaInicio, fechaFin) {
  let query = `
    SELECT 
      t.*,
      m.nombre,
      m.apellido
    FROM transacciones t
    LEFT JOIN miembro_familia m ON t.id_miembro = m.idmiembro_familia
    WHERE t.tipo = 'Egreso'
  `;
  const values = [];
  let paramIndex = 1;

  if (fechaInicio) {
    query += ` AND t.fecha >= $${paramIndex}`;
    values.push(fechaInicio);
    paramIndex++;
  }

  if (fechaFin) {
    query += ` AND t.fecha <= $${paramIndex}`;
    values.push(fechaFin);
    paramIndex++;
  }

  query += ` ORDER BY t.fecha DESC, t.id DESC`;

  const result = await db.query(query, values);
  return result.rows;
}

module.exports = {
  obtenerTransacciones,
  obtenerFamilias,
  obtenerMiembros,
  obtenerGastos
};