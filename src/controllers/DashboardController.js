// controllers/DashboardController.js
// RF15: resumen del estado de seguridad de los activos para el panel principal.

const ActivoModel = require('../models/ActivoModel');
const { analizarActivos, ServicioIANoDisponible } = require('../services/iaService');

const NIVELES = { bajo: 1, medio: 2, alto: 3, critico: 4, 'crítico': 4 };
const NOMBRES_NIVEL = { 1: 'Baja', 2: 'Media', 3: 'Alta', 4: 'Crítica' };
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

// Nombres de tipo usados antes del RF05, para agrupar los activos antiguos
const ALIAS_TIPOS = {
  'Computador o portátil': 'Computadores y dispositivos',
  'Dispositivo móvil': 'Computadores y dispositivos',
  'Servidor': 'Servidores',
  'Aplicación o software': 'Aplicaciones y sistemas',
  'Sistema de información': 'Aplicaciones y sistemas',
  'Base de datos': 'Bases de datos',
  'Servicio en la nube': 'Servicios en la nube',
  'Red o dispositivo de red': 'Redes y dispositivos de comunicación'
};


// "Impacto alto: ..." -> 3
function nivelImpacto(respuesta) {
  const m = /^\s*impacto\s+(\S+)/i.exec(respuesta || '');
  return m ? NIVELES[m[1].toLowerCase().replace(/[:.,]/g, '')] || null : null;
}

// Criticidad = el mayor impacto entre confidencialidad, integridad y disponibilidad
function criticidad(activo) {
  const niveles = [
    activo.impacto_confidencialidad,
    activo.impacto_integridad,
    activo.impacto_disponibilidad
  ].map(nivelImpacto).filter(Boolean);

  if (niveles.length === 0) {
    return { nivel: 'Sin evaluar', puntaje: 0 };
  }

  const puntaje = Math.max(...niveles);
  return { nivel: NOMBRES_NIVEL[puntaje], puntaje };
}

function contar(lista, clave) {
  const conteo = {};
  lista.forEach(elemento => {
    const valor = clave(elemento);
    conteo[valor] = (conteo[valor] || 0) + 1;
  });
  return Object.entries(conteo)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total);
}

function fechaCorta(iso) {
  const [anio, mes, dia] = iso.split('-').map(Number);
  return `${dia} ${MESES[mes - 1]} ${anio}`;
}

// Activos registrados en cada uno de los últimos 6 meses
function evolucionMensual(activos) {
  const hoy = new Date();
  const meses = [];

  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    meses.push({
      clave: `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`,
      etiqueta: `${MESES[fecha.getMonth()]} ${String(fecha.getFullYear()).slice(2)}`,
      total: 0
    });
  }

  activos.forEach(activo => {
    if (!activo.fecha_creacion) return;
    const fecha = new Date(activo.fecha_creacion);
    const clave = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    const mes = meses.find(m => m.clave === clave);
    if (mes) mes.total += 1;
  });

  return meses.map(({ etiqueta, total }) => ({ etiqueta, total }));
}


// GET /dashboard
async function obtenerResumen(req, res) {

  try {

    const activos = await ActivoModel.obtenerActivosPorUsuario(req.usuario.id);

    // Soporte del fabricante y exposición a internet los calcula la IA.
    // Si no está disponible, el panel funciona con el resto de datos (RNF08).
    let analisis = [];
    let iaDisponible = true;

    if (activos.length > 0) {
      try {
        analisis = await analizarActivos(activos.map(a => ({
          id: a.id,
          nombre_activo: a.nombre_activo,
          tipo_activo: a.tipo_activo,
          uso: a.uso,
          clasificacion_ia: a.clasificacion_ia
        })));
      } catch (error) {
        if (!(error instanceof ServicioIANoDisponible)) throw error;
        iaDisponible = false;
      }
    }

    const analisisPorId = {};
    analisis.forEach(a => { analisisPorId[String(a.id)] = a; });

    const detalle = activos.map(activo => {
      const ia = analisisPorId[String(activo.id)] || {};
      const crit = criticidad(activo);
      const sinCopias = (activo.copias || '').startsWith('No se realizan');
      const sinSoporte = ia.soporte === 'Sin soporte';
      const expuesto = ia.expuesto_internet === 'Sí';

      const motivos = [];
      if (sinSoporte) {
        motivos.push(`Sin soporte del fabricante desde ${fechaCorta(ia.fecha_fin_soporte)}`);
      }
      if (expuesto) motivos.push('Expuesto a internet');
      if (sinCopias) motivos.push('Sin copias de seguridad');
      if (crit.puntaje >= 3) motivos.push(`Criticidad ${crit.nivel.toLowerCase()}`);

      return {
        id: activo.id,
        nombre: activo.nombre_activo,
        tipo: ALIAS_TIPOS[activo.tipo_activo] || activo.tipo_activo,
        clasificacion: activo.clasificacion || 'Sin clasificar',
        criticidad: crit,
        sinCopias,
        sinSoporte,
        expuesto,
        motivos,
        // Entre más alto, más urgente revisarlo
        urgencia: (sinSoporte ? 3 : 0) + (expuesto ? 2 : 0) + (sinCopias ? 2 : 0) + crit.puntaje,
        clasificadoConIA: Boolean(activo.clasificacion_ia),
        corregidoPorUsuario: Boolean(activo.clasificacion_ia?.corregida_por_usuario)
      };
    });

    const conIA = detalle.filter(a => a.clasificadoConIA);
    const corregidos = conIA.filter(a => a.corregidoPorUsuario);
    const porcentaje = (parte, total) => (total ? Math.round((parte / total) * 100) : null);

    return res.status(200).json({
      generado: new Date().toISOString(),
      ia_disponible: iaDisponible,

      totales: {
        activos: detalle.length,
        criticos: detalle.filter(a => a.criticidad.puntaje >= 3).length,
        sin_soporte: iaDisponible ? detalle.filter(a => a.sinSoporte).length : null,
        expuestos: iaDisponible ? detalle.filter(a => a.expuesto).length : null,
        sin_copias: detalle.filter(a => a.sinCopias).length
      },

      criticidad: ['Crítica', 'Alta', 'Media', 'Baja', 'Sin evaluar'].map(nivel => ({
        nombre: nivel,
        total: detalle.filter(a => a.criticidad.nivel === nivel).length
      })),

      por_tipo: contar(detalle, a => a.tipo),
      por_clasificacion: contar(detalle, a => a.clasificacion),
      evolucion: evolucionMensual(activos),

      atencion: detalle
        .filter(a => a.motivos.length > 0)
        .sort((a, b) => b.urgencia - a.urgencia)
        .slice(0, 6)
        .map(({ id, nombre, tipo, criticidad: crit, motivos }) => ({
          id, nombre, tipo, criticidad: crit.nivel, motivos
        })),

      // Desempeño de la IA del RF05 (RNF07, ISO/IEC 42001 cláusula 9)
      ia: {
        clasificados: conIA.length,
        porcentaje_clasificados: porcentaje(conIA.length, detalle.length),
        corregidos: corregidos.length,
        porcentaje_aceptacion: porcentaje(conIA.length - corregidos.length, conIA.length)
      }
    });

  } catch (error) {

    console.error('Error al generar el panel:', error);

    return res.status(500).json({ error: 'No fue posible cargar el panel principal.' });
  }
}

module.exports = { obtenerResumen };