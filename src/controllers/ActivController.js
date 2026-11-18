// controllers/ActivoController.js

const ActivoModel = require('../models/ActivoModel');

const { clasificarActivo: clasificarConIA, generarFicha, ServicioIANoDisponible } = require('../services/iaService');


// ============================================
// RF05: RESULTADO DE LA IA CONFIRMADO POR EL USUARIO
// ============================================
// Guarda lo que propuso la IA y lo que el usuario dejó finalmente,
// para saber si la clasificación fue corregida (RNF06, RF18).

function prepararClasificacionIA(ia, tipoConfirmado) {
  if (!ia || typeof ia !== 'object' || !ia.categoria) {
    return null;
  }

  const atributos = ia.atributos || {};

  return {
    categoria_sugerida: ia.categoria,
    categoria_confirmada: tipoConfirmado,
    corregida_por_usuario: ia.categoria !== tipoConfirmado,
    confianza: Number(ia.confianza) || null,
    atributos: {
      fabricante: atributos.fabricante || null,
      producto: atributos.producto || null,
      version: atributos.version || null,
      expuesto_internet: atributos.expuesto_internet || null,
      tipos_datos: Array.isArray(atributos.tipos_datos) ? atributos.tipos_datos : []
    },
    descripcion: ia.descripcion || null,
    modelo: ia.modelo?.version || null,
    fecha: new Date().toISOString()
  };
}


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
    clasificacion_ia: prepararClasificacionIA(body.clasificacion_ia, tipo_activo),
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
// RF05: CLASIFICAR UN ACTIVO CON IA
// ============================================

async function clasificarActivo(req, res) {

  const descripcion = (req.body.descripcion || '').trim();

  if (descripcion.length < 3) {
    return res.status(400).json({
      error: 'Describe el activo con algunas palabras: qué es, marca o programa y para qué se usa.'
    });
  }

  try {

    const resultado = await clasificarConIA(descripcion);

    return res.status(200).json({ ...resultado, descripcion });

  } catch (error) {

    if (error instanceof ServicioIANoDisponible) {
      // RNF08: sin IA, el usuario puede seguir registrando de forma manual
      return res.status(503).json({
        error: 'El asistente de IA no está disponible en este momento. Puedes elegir el tipo de activo manualmente.'
      });
    }

    console.error('Error al clasificar activo:', error.message);

    return res.status(error.status || 500).json({
      error: error.status ? error.message : 'No fue posible clasificar el activo.'
    });
  }
}


// ============================================
// RF06: FICHA DE CONOCIMIENTO DEL ACTIVO
// ============================================

async function obtenerFichaActivo(req, res) {

  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ error: 'El identificador del activo no es válido.' });
  }

  try {

    const activo = await ActivoModel.obtenerActivoPorId(id, req.usuario.id);

    if (!activo) {
      return res.status(404).json({ error: 'No se encontró el activo solicitado.' });
    }

    // RNF05: a la IA solo se envía lo necesario (sin nombres de personas)
    const ficha = await generarFicha({
      id: activo.id,
      nombre_activo: activo.nombre_activo,
      tipo_activo: activo.tipo_activo,
      uso: activo.uso,
      area: activo.area,
      datos: activo.datos,
      clasificacion: activo.clasificacion,
      impacto_confidencialidad: activo.impacto_confidencialidad,
      impacto_integridad: activo.impacto_integridad,
      impacto_disponibilidad: activo.impacto_disponibilidad,
      dependencia: activo.dependencia,
      copias: activo.copias,
      amenazas: activo.amenazas,
      clasificacion_ia: activo.clasificacion_ia
    });

    return res.status(200).json(ficha);

  } catch (error) {

    if (error instanceof ServicioIANoDisponible) {
      return res.status(503).json({
        error: 'El servicio de IA no está disponible en este momento. Intenta de nuevo más tarde.'
      });
    }

    console.error('Error al generar la ficha:', error.message);

    return res.status(500).json({ error: 'No fue posible generar la ficha del activo.' });
  }
}


// ============================================
// EXPORTAR FUNCIONES
// ============================================

module.exports = {
  obtenerFichaActivo,
  clasificarActivo,
  registrarActivo,
  obtenerActivos,
  obtenerActivoPorId,
  actualizarActivo,
  eliminarActivo
};