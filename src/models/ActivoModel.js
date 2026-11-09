
// models/ActivoModel.js
const db = require('../db');

// ============================================
// REGISTRAR UN ACTIVO
// ============================================
async function insertarActivo(activo) {
  const query = `
    INSERT INTO activos (
      usuario_id,
      nombre_activo,
      tipo_activo,
      uso,
      area,
      responsable,
      propietario,
      datos,
      impacto,
      clasificacion,
      acceso,
      control_acceso,
      impacto_confidencialidad,
      proteccion_confidencialidad,
      quien_modifica,
      registro_cambios,
      validacion_datos,
      proteccion_integridad,
      impacto_integridad,
      dependencia,
      impacto_disponibilidad,
      copias,
      recuperacion,
      tiempo_recuperacion,
      ubicacion_datos,
      amenazas,
      vulnerabilidades,
      incidentes,
      observaciones,
      actualizaciones,
      proteccion
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8::jsonb, $9::jsonb,
      $10, $11, $12, $13, $14, $15, $16, $17, $18, $19,
      $20, $21, $22, $23, $24, $25, $26, $27, $28, $29,
      $30, $31
    )
    RETURNING *;
  `;

  const values = [
    activo.usuario_id,
    activo.nombre_activo,
    activo.tipo_activo,
    activo.uso,
    activo.area,
    activo.responsable || null,
    activo.propietario || null,
    JSON.stringify(activo.datos || []),
    JSON.stringify(activo.impacto || {}),
    activo.clasificacion,
    activo.acceso,
    activo.control_acceso,
    activo.impacto_confidencialidad,
    activo.proteccion_confidencialidad || null,
    activo.quien_modifica,
    activo.registro_cambios,
    activo.validacion_datos,
    activo.proteccion_integridad || null,
    activo.impacto_integridad,
    activo.dependencia,
    activo.impacto_disponibilidad,
    activo.copias,
    activo.recuperacion,
    activo.tiempo_recuperacion || null,
    activo.ubicacion_datos || null,
    activo.amenazas || [],              // text[] -> sin JSON.stringify
    activo.vulnerabilidades || null,
    activo.incidentes || null,
    activo.observaciones || null,
    activo.actualizaciones || null,
    activo.proteccion || null
  ];

  const result = await db.query(query, values);

  return result.rows[0];
}
// Obtener los activos del usuario autenticado
async function obtenerActivosPorUsuario(usuario_id) {
  const query = `
    SELECT *
    FROM activos
    WHERE usuario_id = $1
    ORDER BY id DESC;
  `;

  const result = await db.query(query, [usuario_id]);

  return result.rows;
}

// Obtener un activo por ID, siempre que pertenezca al usuario
async function obtenerActivoPorId(id, usuario_id) {
  const query = `
    SELECT *
    FROM activos
    WHERE id = $1 AND usuario_id = $2;
  `;

  const result = await db.query(query, [id, usuario_id]);

  return result.rows[0];
}

// Eliminar un activo del usuario autenticado
async function eliminarActivo(id, usuario_id) {
  const query = `
    DELETE FROM activos
    WHERE id = $1 AND usuario_id = $2
    RETURNING *;
  `;

  const result = await db.query(query, [id, usuario_id]);

  return result.rows[0];
}

module.exports = {
  insertarActivo,
  obtenerActivosPorUsuario,
  obtenerActivoPorId,
  eliminarActivo
};
