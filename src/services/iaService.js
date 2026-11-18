// services/iaService.js
// Comunicación con el servicio de IA en Python (carpeta ia-service).

const IA_SERVICE_URL = process.env.IA_SERVICE_URL || 'http://localhost:8000';
const TIEMPO_MAXIMO_MS = 15000;

class ServicioIANoDisponible extends Error {}

async function clasificarActivo(descripcion) {
  let respuesta;
  try {
    respuesta = await fetch(`${IA_SERVICE_URL}/clasificar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ descripcion }),
      signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
    });
  } catch (error) {
    // El servicio está apagado o tardó demasiado (RNF08)
    throw new ServicioIANoDisponible(error.message);
  }

  const datos = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    const error = new Error(
      typeof datos.detail === 'string' ? datos.detail : 'La descripción no es válida.'
    );
    error.status = respuesta.status === 422 ? 400 : respuesta.status;
    throw error;
  }

  return datos;
}

module.exports = { clasificarActivo, ServicioIANoDisponible };