
// models/ActivoModel.js
const db = require('../db');

// Registrar un activo tecnológico
async function insertarActivo(activo) {
  const query = `
    INSERT INTO activos (
      usuario_id,
      nombre_activo,
      tipo_activo,
      uso,
      area,
      responsable,
      datos,
      impacto,
      acceso,
      dependencia,
      copias,
      actualizaciones,
      proteccion,
      control_acceso,
      ubicacion_datos,
      incidentes,
      observaciones
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb,
      $9, $10, $11, $12, $13, $14, $15, $16, $17
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
    JSON.stringify(activo.datos),
    JSON.stringify(activo.impacto),
    activo.acceso,
    activo.dependencia,
    activo.copias,
    activo.actualizaciones,
    activo.proteccion,
    activo.control_acceso,
    activo.ubicacion_datos,
    activo.incidentes,
    activo.observaciones || null
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
