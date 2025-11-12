// models/ExportacionModel.js
const db = require('../db');

// Obtener transacciones con filtros opcionales
async function obtenerTransacciones(fechaInicio, fechaFin) {
  let query = `
    SELECT 
      t.*,
      COALESCE(f.nombre_familia, 'Sin familia') as nombre_familia,
      COALESCE(m.nombre || ' ' || m.apellido, 'Sin miembro') as nombre_completo
    FROM transacciones t
    LEFT JOIN familia f ON t.id_familia = f.id_familia
    LEFT JOIN miembro_familia m ON t.id_miembro = m.idmiembro_familia
    WHERE 1=1
  `;
  
  const values = [];
  let paramIndex = 1;

  if (fechaInicio) {
    query += ` AND t.fecha >= $${paramIndex}::date`;
    values.push(fechaInicio);
    paramIndex++;
  }

  if (fechaFin) {
    query += ` AND t.fecha <= $${paramIndex}::date`;
    values.push(fechaFin);
    paramIndex++;
  }

  query += ` ORDER BY t.fecha DESC, t.id DESC`;

  console.log('📊 Query transacciones:', query);
  console.log('📊 Valores:', values);

  try {
    const result = await db.query(query, values);
    console.log(`✅ Se encontraron ${result.rows.length} transacciones`);
    return result.rows;
  } catch (error) {
    console.error('❌ Error en obtenerTransacciones:', error.message);
    throw error;
  }
}

// Obtener todas las familias con estadísticas
async function obtenerFamilias() {
  const query = `
    SELECT 
      f.id_familia,
      f.nombre_familia,
      f.direccion,
      f.telefono,
      f.email,
      COUNT(DISTINCT m.idmiembro_familia) as total_miembros,
      COALESCE(SUM(CASE WHEN t.tipo = 'Ingreso' THEN t.monto ELSE 0 END), 0) as total_ingresos,
      COALESCE(SUM(CASE WHEN t.tipo = 'Egreso' THEN t.monto ELSE 0 END), 0) as total_egresos,
      COALESCE(SUM(CASE WHEN t.tipo = 'Ingreso' THEN t.monto ELSE 0 END), 0) - 
      COALESCE(SUM(CASE WHEN t.tipo = 'Egreso' THEN t.monto ELSE 0 END), 0) as saldo
    FROM familia f
    LEFT JOIN miembro_familia m ON f.id_familia = m.id_familia
    LEFT JOIN transacciones t ON f.id_familia = t.id_familia
    GROUP BY f.id_familia, f.nombre_familia, f.direccion, f.telefono, f.email
    ORDER BY f.nombre_familia ASC
  `;

  console.log('📊 Query familias:', query);

  try {
    const result = await db.query(query);
    console.log(`✅ Se encontraron ${result.rows.length} familias`);
    return result.rows;
  } catch (error) {
    console.error('❌ Error en obtenerFamilias:', error.message);
    throw error;
  }
}

// Obtener todos los miembros
async function obtenerMiembros() {
  const query = `
    SELECT 
      m.idmiembro_familia,
      m.nombre,
      m.apellido,
      m.fecha_nacimiento,
      m.genero,
      m.parentesco,
      m.ocupacion,
      m.estado_civil,
      m.nivel_educativo,
      COALESCE(f.nombre_familia, 'Sin familia') as nombre_familia,
      f.id_familia,
      EXTRACT(YEAR FROM AGE(m.fecha_nacimiento)) as edad
    FROM miembro_familia m
    LEFT JOIN familia f ON m.id_familia = f.id_familia
    ORDER BY f.nombre_familia ASC, m.nombre ASC
  `;

  console.log('📊 Query miembros:', query);

  try {
    const result = await db.query(query);
    console.log(`✅ Se encontraron ${result.rows.length} miembros`);
    return result.rows;
  } catch (error) {
    console.error('❌ Error en obtenerMiembros:', error.message);
    throw error;
  }
}

// Obtener reporte de gastos con filtros
async function obtenerGastos(fechaInicio, fechaFin) {
  let query = `
    SELECT 
      t.id,
      t.tipo,
      t.monto,
      t.descripcion,
      t.categoria,
      t.fecha,
      COALESCE(f.nombre_familia, 'Sin familia') as nombre_familia,
      COALESCE(m.nombre || ' ' || m.apellido, 'Sin miembro') as nombre_completo
    FROM transacciones t
    LEFT JOIN familia f ON t.id_familia = f.id_familia
    LEFT JOIN miembro_familia m ON t.id_miembro = m.idmiembro_familia
    WHERE t.tipo = 'Egreso'
  `;
  
  const values = [];
  let paramIndex = 1;

  if (fechaInicio) {
    query += ` AND t.fecha >= $${paramIndex}::date`;
    values.push(fechaInicio);
    paramIndex++;
  }

  if (fechaFin) {
    query += ` AND t.fecha <= $${paramIndex}::date`;
    values.push(fechaFin);
    paramIndex++;
  }

  query += ` ORDER BY t.fecha DESC, t.id DESC`;

  console.log('📊 Query gastos:', query);
  console.log('📊 Valores:', values);

  try {
    const result = await db.query(query, values);
    console.log(`✅ Se encontraron ${result.rows.length} gastos`);
    return result.rows;
  } catch (error) {
    console.error('❌ Error en obtenerGastos:', error.message);
    throw error;
  }
}

module.exports = {
  obtenerTransacciones,
  obtenerFamilias,
  obtenerMiembros,
  obtenerGastos
};