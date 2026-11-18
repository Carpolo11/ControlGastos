"""Servicio de IA de GRC IA: clasificación de activos (RF05).

Lo llama el backend Node (no el navegador). Uso:  python app.py
Queda escuchando en http://localhost:8000
"""
import json
import re
from pathlib import Path

import joblib
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from extractor import extraer_atributos
from texto import normalizar

BASE = Path(__file__).resolve().parent
ARCHIVO_MODELO = BASE / "modelo" / "clasificador.joblib"
ARCHIVO_METRICAS = BASE / "modelo" / "metricas.json"
PUERTO = 8000

if not ARCHIVO_MODELO.exists():
    raise SystemExit("No hay modelo entrenado. Ejecuta primero: python entrenar.py")

_paquete = joblib.load(ARCHIVO_MODELO)
MODELO = _paquete["modelo"]
VERSION_MODELO = _paquete["version"]
METRICAS = json.loads(ARCHIVO_METRICAS.read_text(encoding="utf-8")) if ARCHIVO_METRICAS.exists() else {}

# Palabras que explican al usuario por qué se eligió cada categoría (RNF02)
PALABRAS_CLAVE = {
    "Computadores y dispositivos": ["portatil", "computador", "equipo", "pc", "tablet", "celular",
                                    "impresora", "escaner", "macbook", "iphone", "ipad", "camara"],
    "Servidores": ["servidor", "server", "nas", "maquinas virtuales", "rack", "dominio"],
    "Aplicaciones y sistemas": ["software", "sistema", "aplicacion", "programa", "erp", "crm",
                                "pagina web", "facturacion", "nomina", "antivirus", "intranet"],
    "Bases de datos": ["base de datos", "bases de datos", "tablas", "esquema", "registros"],
    "Servicios en la nube": ["nube", "cloud", "hosting", "suscripcion", "cuenta", "bucket"],
    "Redes y dispositivos de comunicación": ["router", "switch", "firewall", "wifi", "red",
                                             "vpn", "access point", "modem", "fibra", "cableado"],
}


class Solicitud(BaseModel):
    descripcion: str = Field(..., min_length=3, max_length=2000)


app = FastAPI(title="GRC IA - Servicio de clasificación de activos")


def contiene(texto: str, palabra: str) -> bool:
    """Busca la palabra completa (evita que "pc" coincida dentro de "recepcion")."""
    return re.search(rf"\b{re.escape(palabra)}\b", texto) is not None


def nivel(confianza: float) -> str:
    if confianza >= 0.7:
        return "Alta"
    if confianza >= 0.5:
        return "Media"
    return "Baja"


@app.get("/salud")
def salud():
    return {"estado": "ok", "modelo": VERSION_MODELO}


@app.post("/clasificar")
def clasificar(solicitud: Solicitud):
    descripcion = solicitud.descripcion.strip()
    if len(descripcion) < 3:
        raise HTTPException(status_code=400, detail="Describe el activo con algunas palabras más.")

    atributos = extraer_atributos(descripcion)
    pista = atributos.pop("_pista_catalogo")
    texto = normalizar(descripcion)

    # Probabilidades del modelo. Si se reconoció un producto conocido, se combinan
    # con el catálogo (70 % modelo, 30 % catálogo) para reforzar la decisión.
    probabilidades = dict(zip(MODELO.classes_, (float(p) for p in MODELO.predict_proba([descripcion])[0])))
    if pista:
        probabilidades = {c: 0.7 * p + (0.3 if c == pista["categoria_sugerida"] else 0.0)
                          for c, p in probabilidades.items()}
    ranking = sorted(probabilidades.items(), key=lambda x: x[1], reverse=True)
    categoria, confianza = ranking[0]

    encontradas = [p for p in PALABRAS_CLAVE.get(categoria, []) if contiene(texto, p)]
    sin_evidencia = not pista and not any(
        contiene(texto, p) for palabras in PALABRAS_CLAVE.values() for p in palabras)
    if sin_evidencia:
        # No hay ninguna palabra reconocible: no fingir seguridad
        confianza = min(confianza, 0.3)

    justificacion = [
        f"El modelo de aprendizaje automático (Random Forest) asignó la categoría "
        f"«{categoria}» con {confianza:.0%} de confianza."
    ]
    if encontradas:
        justificacion.append("Palabras de la descripción que apoyan esta categoría: "
                             + ", ".join(encontradas) + ".")
    if pista:
        if pista["categoria_sugerida"] == categoria:
            justificacion.append(f"Se reconoció el producto {pista['producto']} "
                                 f"({pista['fabricante']}), que corresponde a esta categoría; "
                                 f"esto reforzó la confianza.")
        else:
            justificacion.append(f"Se reconoció el producto {pista['producto']}, que suele ser "
                                 f"«{pista['categoria_sugerida']}». Revisa cuál describe mejor tu activo.")

    advertencia = None
    if sin_evidencia:
        advertencia = ("No se reconoció ningún término de un activo tecnológico. Describe el activo "
                       "con más detalle (qué es, marca o programa y para qué se usa).")
    elif confianza < 0.5:
        advertencia = ("La confianza es baja: la descripción es ambigua o el activo es poco común. "
                       "Verifica la categoría antes de guardar.")

    return {
        "categoria": categoria,
        "confianza": round(confianza, 3),
        "nivel_confianza": nivel(confianza),
        "alternativas": [{"categoria": c, "probabilidad": round(float(p), 3)} for c, p in ranking[1:3]],
        "atributos": atributos,
        "justificacion": justificacion,
        "advertencia": advertencia,
        "generado_con_ia": True,
        "modelo": {
            "tipo": "Random Forest",
            "version": VERSION_MODELO,
            "precision_validacion": METRICAS.get("precision_validacion"),
        },
    }


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=PUERTO)