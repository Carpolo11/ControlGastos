// models/ActivoModel.js

const db = require('../db');

// ============================================
// REGISTRAR UN ACTIVO
// ============================================

async function registrarActivo(activo) {
  const query = `
    INSERT INTO public.activos (
      nombre_activo,
      tipo_activo,
      uso,
      area,
      responsable,
      propietario,

      datos,
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
      observaciones
    )
    VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10, $11, $12,
      $13, $14, $15, $16, $17,
      $18, $19, $20, $21, $22, $23,
      $24, $25, $26, $27
    )
    RETURNING *;
  `;

  const values = [
    activo.nombre_activo,
    activo.tipo_activo,
    activo.uso,
    activo.area,
    activo.responsable,
    activo.propietario,

    activo.datos || [],
    activo.clasificacion,
    activo.acceso,
    activo.control_acceso,
    activo.impacto_confidencialidad,
    activo.proteccion_confidencialidad,

    activo.quien_modifica,
    activo.registro_cambios,
    activo.validacion_datos,
    activo.proteccion_integridad,
    activo.impacto_integridad,

    activo.dependencia,
    activo.impacto_disponibilidad,
    activo.copias,
    activo.recuperacion,
    activo.tiempo_recuperacion,
    activo.ubicacion_datos,

    activo.amenazas || [],
    activo.vulnerabilidades,
    activo.incidentes,
    activo.observaciones
  ];

  const resultado = await db.query(query, values);

  return resultado.rows[0];
}


// ============================================
// OBTENER TODOS LOS ACTIVOS
// ============================================

async function obtenerActivos() {
  const query = `
    SELECT *
    FROM public.activos
    ORDER BY id DESC;
  `;

  const resultado = await db.query(query);

  return resultado.rows;
}


// ============================================
// OBTENER UN ACTIVO POR SU ID
// ============================================

async function obtenerActivoPorId(id) {
  const query = `
    SELECT *
    FROM public.activos
    WHERE id = $1;
  `;

  const resultado = await db.query(query, [id]);

  return resultado.rows[0];
}


module.exports = {
  registrarActivo,
  obtenerActivos,
  obtenerActivoPorId
};