
// controllers/ActivosController.js
const ActivoModel = require('../models/ActivoModel');

// Registrar un activo
async function crearActivo(req, res) {
  try {
    const {
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
    } = req.body;

   

    // Validar campos obligatorios
    if (
      !nombre_activo ||
      !tipo_activo ||
      !uso ||
      !area ||
      !Array.isArray(datos) ||
      datos.length === 0 ||
      !Array.isArray(impacto) ||
      impacto.length === 0 ||
      !acceso ||
      !dependencia ||
      !copias ||
      !actualizaciones ||
      !proteccion ||
      !control_acceso ||
      !ubicacion_datos ||
      !incidentes
    ) {
      return res.status(400).json({
        error: 'Completa todos los campos obligatorios del activo.'
      });
    }

    // El middleware de autenticación debe establecer req.usuario.
    // Ajusta esta propiedad si tu middleware utiliza otro nombre.
    const usuario_id = req.usuario?.id;

    if (!usuario_id) {
      return res.status(401).json({
        error: 'No se pudo identificar al usuario autenticado.'
      });
    }

    const nuevoActivo = await ActivoModel.insertarActivo({
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
    });

    return res.status(201).json({
      mensaje: 'Activo registrado correctamente.',
      activo: nuevoActivo
    });
  } catch (error) {
    console.error('Error al registrar el activo:', error);

    return res.status(500).json({
      error: 'Error interno al registrar el activo.'
    });
  }
}

// Obtener los activos del usuario autenticado
async function obtenerActivos(req, res) {
  try {
    const usuario_id = req.usuario?.id;

    if (!usuario_id) {
      return res.status(401).json({
        error: 'No se pudo identificar al usuario autenticado.'
      });
    }

    const activos =
      await ActivoModel.obtenerActivosPorUsuario(usuario_id);

    return res.status(200).json(activos);
  } catch (error) {
    console.error('Error al obtener los activos:', error);

    return res.status(500).json({
      error: 'Error interno al obtener los activos.'
    });
  }
}

// Obtener un activo específico
async function obtenerActivo(req, res) {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario?.id;

    if (!usuario_id) {
      return res.status(401).json({
        error: 'No se pudo identificar al usuario autenticado.'
      });
    }

    const activo = await ActivoModel.obtenerActivoPorId(
      id,
      usuario_id
    );

    if (!activo) {
      return res.status(404).json({
        error: 'Activo no encontrado.'
      });
    }

    return res.status(200).json(activo);
  } catch (error) {
    console.error('Error al obtener el activo:', error);

    return res.status(500).json({
      error: 'Error interno al obtener el activo.'
    });
  }
}

// Eliminar un activo
async function eliminarActivo(req, res) {
  try {
    const { id } = req.params;
    const usuario_id = req.usuario?.id;

    if (!usuario_id) {
      return res.status(401).json({
        error: 'No se pudo identificar al usuario autenticado.'
      });
    }

    const eliminado = await ActivoModel.eliminarActivo(
      id,
      usuario_id
    );

    if (!eliminado) {
      return res.status(404).json({
        error: 'Activo no encontrado.'
      });
    }

    return res.status(200).json({
      mensaje: 'Activo eliminado correctamente.'
    });
  } catch (error) {
    console.error('Error al eliminar el activo:', error);

    return res.status(500).json({
      error: 'Error interno al eliminar el activo.'
    });
  }
}

module.exports = {
  crearActivo,
  obtenerActivos,
  obtenerActivo,
  eliminarActivo
};
