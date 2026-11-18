// services/iaService.js
// Comunicación con el servicio de IA en Python (carpeta ia-service).

const IA_SERVICE_URL = process.env.IA_SERVICE_URL || 'http://localhost:8000';
const TIEMPO_MAXIMO_MS = 15000;

class ServicioIANoDisponible extends Error {}

// Envía una petición POST al servicio de IA y devuelve su respuesta
async function llamarIA(ruta, cuerpo) {
  let respuesta;
  try {
    respuesta = await fetch(`${IA_SERVICE_URL}${ruta}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
    });
  } catch (error) {
    // El servicio está apagado o tardó demasiado (RNF08)
    throw new ServicioIANoDisponible(error.message);
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(
      typeof datos.detail === 'string' ? datos.detail : 'Los datos enviados a la IA no son válidos.'
    );
    error.status = respuesta.status === 422 ? 400 : respuesta.status;
    throw error;
  }

  return datos;
}

// RF05: clasificar un activo a partir de su descripción
function clasificarActivo(descripcion) {
  return llamarIA('/clasificar', { descripcion });
}

// RF06: ficha de conocimiento del activo
function generarFicha(activo) {
  return llamarIA('/ficha', activo);
}

// RF15: soporte y exposición de varios activos, para el panel principal
function analizarActivos(activos) {
  return llamarIA('/analisis-activos', activos);
}

module.exports = { clasificarActivo, generarFicha, analizarActivos, ServicioIANoDisponible };