
// controllers/ActivoController.js

const ActivoModel = require('../models/ActivoModel');


// ============================================
// PREPARAR INFORMACIÓN DEL ACTIVO
// ============================================

function prepararActivo(body) {

  const {
    nombre_activo,
    tipo_activo,
    uso,
    area,
    clasificacion,
    acceso,
    control_acceso,
    impacto_confidencialidad,
    quien_modifica,
    registro_cambios,
    validacion_datos,
    impacto_integridad,
    dependencia,
    impacto_disponibilidad,
    copias,
    recuperacion
  } = body;

  // VALIDAR CAMPOS BÁSICOS
  if (!nombre_activo || !tipo_activo || !uso || !area) {
    throw new Error('Debes completar los datos básicos del activo.');
  }

  // VALIDAR CONFIDENCIALIDAD
  if (
    !clasificacion ||
    !acceso ||
    !control_acceso ||
    !impacto_confidencialidad
  ) {
    throw new Error('Debes completar las preguntas de confidencialidad.');
  }

  // VALIDAR INTEGRIDAD
  if (
    !quien_modifica ||
    !registro_cambios ||
    !validacion_datos ||
    !impacto_integridad
  ) {
    throw new Error('Debes completar las preguntas de integridad.');
  }

  // VALIDAR DISPONIBILIDAD
  if (
    !dependencia ||
    !impacto_disponibilidad ||
    !copias ||
    !recuperacion
  ) {
    throw new Error('Debes completar las preguntas de disponibilidad.');
  }

  return {

    nombre_activo,
    tipo_activo,
    uso,
    area,

    responsable: body.responsable || '',
    propietario: body.propietario || '',

    datos: Array.isArray(body.datos) ? body.datos : [],

    clasificacion,
    acceso,
    control_acceso,
    impacto_confidencialidad,

    proteccion_confidencialidad:
      body.proteccion_confidencialidad || '',

    quien_modifica,
    registro_cambios,
    validacion_datos,

    proteccion_integridad:
      body.proteccion_integridad || '',

    impacto_integridad,

    dependencia,
    impacto_disponibilidad,
    copias,
    recuperacion,

    tiempo_recuperacion:
      body.tiempo_recuperacion || '',

    ubicacion_datos:
      body.ubicacion_datos || '',

    amenazas: Array.isArray(body.amenazas)
      ? body.amenazas
      : [],

    vulnerabilidades: body.vulnerabilidades || '',
    incidentes: body.incidentes || '',
    observaciones: body.observaciones || '',

    impacto: {
      confidencialidad: impacto_confidencialidad,
      integridad: impacto_integridad,
      disponibilidad: impacto_disponibilidad
    },

    actualizaciones: registro_cambios,

    proteccion: [
      body.proteccion_confidencialidad || '',
      body.proteccion_integridad || ''
    ].filter(Boolean).join(' | ')

  };
}


// ============================================
// REGISTRAR ACTIVO
// ============================================

async function registrarActivo(req, res) {

  try {

    const activo = prepararActivo(req.body);

    const nuevoActivo = await ActivoModel.insertarActivo({
      ...activo,
      usuario_id: req.usuario.id
    });

    console.log('Activo registrado:', nuevoActivo);

    return res.status(201).json({
      mensaje: 'Activo registrado correctamente.',
      activo: nuevoActivo
    });

  } catch (error) {

    console.error('Error al registrar activo:', error);

    const esValidacion = [
      'Debes completar los datos básicos del activo.',
      'Debes completar las preguntas de confidencialidad.',
      'Debes completar las preguntas de integridad.',
      'Debes completar las preguntas de disponibilidad.'
    ].includes(error.message);

    return res.status(esValidacion ? 400 : 500).json({
      error: esValidacion
        ? error.message
        : 'Error interno al registrar el activo.',
      detalle: error.message
    });

  }

}


// ============================================
// OBTENER TODOS LOS ACTIVOS
// ============================================

async function obtenerActivos(req, res) {

  try {

    const activos = await ActivoModel.obtenerActivosPorUsuario(
      req.usuario.id
    );

    return res.status(200).json({
      mensaje: 'Activos consultados correctamente.',
      total: activos.length,
      activos
    });

  } catch (error) {

    console.error('Error al consultar activos:', error);

    return res.status(500).json({
      error: 'Error al obtener los activos.'
    });

  }

}


// ============================================
// OBTENER ACTIVO POR ID
// ============================================

async function obtenerActivoPorId(req, res) {

  try {

    const { id } = req.params;

    if (!/^\d+$/.test(id)) {

      return res.status(400).json({
        error: 'El identificador del activo no es válido.'
      });

    }

    const activo = await ActivoModel.obtenerActivoPorId(
      id,
      req.usuario.id
    );

    if (!activo) {

      return res.status(404).json({
        error: 'No se encontró el activo solicitado.'
      });

    }

    return res.status(200).json({
      mensaje: 'Activo encontrado correctamente.',
      activo
    });

  } catch (error) {

    console.error('Error al consultar el activo:', error);

    return res.status(500).json({
      error: 'Error al obtener el activo.'
    });

  }

}


// ============================================
// ACTUALIZAR ACTIVO
// ============================================

async function actualizarActivo(req, res) {

  try {

    const { id } = req.params;

    if (!/^\d+$/.test(id)) {

      return res.status(400).json({
        error: 'El identificador del activo no es válido.'
      });

    }

    // Verificar que el activo pertenezca al usuario
    const activoExistente = await ActivoModel.obtenerActivoPorId(
      id,
      req.usuario.id
    );

    if (!activoExistente) {

      return res.status(404).json({
        error: 'No se encontró el activo o no tienes permiso para modificarlo.'
      });

    }

    // Preparar y validar los nuevos datos
    const datosActualizados = prepararActivo(req.body);

    // Actualizar en la base de datos
    const activoActualizado = await ActivoModel.actualizarActivo(
      id,
      req.usuario.id,
      datosActualizados
    );

    if (!activoActualizado) {

      return res.status(404).json({
        error: 'No fue posible actualizar el activo.'
      });

    }

    console.log('Activo actualizado:', activoActualizado);

    return res.status(200).json({
      mensaje: 'Activo actualizado correctamente.',
      activo: activoActualizado
    });

  } catch (error) {

    console.error('Error al actualizar activo:', error);

    const esValidacion = error.message.startsWith('Debes completar');

    return res.status(esValidacion ? 400 : 500).json({
      error: esValidacion
        ? error.message
        : 'Error interno al actualizar el activo.',
      detalle: error.message
    });

  }

}


// ============================================
// ELIMINAR ACTIVO
// ============================================

async function eliminarActivo(req, res) {

  try {

    const { id } = req.params;

    if (!/^\d+$/.test(id)) {

      return res.status(400).json({
        error: 'El identificador del activo no es válido.'
      });

    }

    // Eliminar únicamente si pertenece al usuario
    const activoEliminado = await ActivoModel.eliminarActivo(
      id,
      req.usuario.id
    );

    if (!activoEliminado) {

      return res.status(404).json({
        error: 'No se encontró el activo o no tienes permiso para eliminarlo.'
      });

    }

    console.log('Activo eliminado:', id);

    return res.status(200).json({
      mensaje: 'Activo eliminado correctamente.',
      activo: activoEliminado
    });

  } catch (error) {

    console.error('Error al eliminar activo:', error);

    return res.status(500).json({
      error: 'Error interno al eliminar el activo.',
      detalle: error.message
    });

  }

}


// ============================================
// EXPORTAR FUNCIONES
// ============================================

module.exports = {
  registrarActivo,
  obtenerActivos,
  obtenerActivoPorId,
  actualizarActivo,
  eliminarActivo
};
