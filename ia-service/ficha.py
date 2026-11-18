"""Generador de la ficha de conocimiento del activo (RF06).

Sistema experto: combina los datos del activo, los atributos que detectó la
IA del RF05 y la base de conocimiento verificada (conocimiento.py). Cada
afirmación técnica lleva su fuente (RNF02).
"""
import re
from datetime import date
from urllib.parse import quote_plus

from conocimiento import CICLOS_SOPORTE, FUENTES, info_categoria
from extractor import extraer_atributos

MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
         "septiembre", "octubre", "noviembre", "diciembre"]
NIVELES_IMPACTO = {"bajo": 1, "medio": 2, "alto": 3, "critico": 4, "crítico": 4}
NOMBRES_NIVEL = {1: "Baja", 2: "Media", 3: "Alta", 4: "Crítica"}
METODO = ("Sistema experto de GRC IA: reglas sobre los datos del activo y una base de "
          "conocimiento con fuentes verificadas.")


def fecha_larga(fecha: date) -> str:
    return f"{fecha.day} de {MESES[fecha.month - 1]} de {fecha.year}"


def fuente(id_fuente):
    return dict(FUENTES[id_fuente]) if id_fuente else None


# ---------------------------------------------------------------------------
# Soporte del fabricante
# ---------------------------------------------------------------------------
def _coincide_version(version: str, clave: str) -> bool:
    version = version.strip().lower()
    return version == clave or version.startswith(clave + ".") or version.startswith(clave + " ")


def soporte_fabricante(producto, version, hoy=None):
    hoy = hoy or date.today()
    if not producto:
        return None
    if not version:
        return {"estado": "Desconocido", "alerta": False,
                "texto": f"No se indicó la versión de {producto}; sin ella no se puede saber si "
                         f"aún recibe actualizaciones de seguridad.",
                "fuente": None}

    for ciclo in CICLOS_SOPORTE:
        if ciclo["producto"].lower() != producto.lower():
            continue
        for clave, fin in ciclo["versiones"].items():
            if not _coincide_version(version, clave):
                continue
            fin = date.fromisoformat(fin)
            nota = f" {ciclo['nota']}" if ciclo.get("nota") else ""
            if fin < hoy:
                return {"estado": "Sin soporte", "alerta": True, "fecha_fin": fin.isoformat(),
                        "texto": f"{producto} {version} dejó de tener soporte del fabricante el "
                                 f"{fecha_larga(fin)}: ya no recibe actualizaciones de seguridad.{nota}",
                        "fuente": fuente(ciclo["fuente"])}
            dias = (fin - hoy).days
            texto = f"{producto} {version} tiene soporte del fabricante hasta el {fecha_larga(fin)}."
            if dias <= 365:
                texto += " El soporte termina en menos de un año: planea la actualización."
            return {"estado": "Con soporte", "alerta": dias <= 365, "fecha_fin": fin.isoformat(),
                    "texto": texto, "fuente": fuente(ciclo["fuente"])}

    return {"estado": "Desconocido", "alerta": False,
            "texto": f"No tenemos información verificada del soporte de {producto} {version}. "
                     f"Consulta el sitio del fabricante.",
            "fuente": None}


# ---------------------------------------------------------------------------
# Criticidad (a partir de las respuestas de impacto del formulario)
# ---------------------------------------------------------------------------
def _nivel_impacto(respuesta):
    m = re.match(r"\s*impacto\s+(\w+)", (respuesta or "").lower())
    return NIVELES_IMPACTO.get(m.group(1)) if m else None


def criticidad(activo):
    dimensiones = [
        ("Confidencialidad", activo.get("impacto_confidencialidad")),
        ("Integridad", activo.get("impacto_integridad")),
        ("Disponibilidad", activo.get("impacto_disponibilidad")),
    ]
    detalle, puntajes = [], []
    for nombre, respuesta in dimensiones:
        nivel = _nivel_impacto(respuesta)
        detalle.append({"dimension": nombre,
                        "nivel": NOMBRES_NIVEL.get(nivel, "Sin evaluar"),
                        "respuesta": respuesta or None})
        if nivel:
            puntajes.append(nivel)

    if not puntajes:
        return {"nivel": "Sin evaluar", "puntaje": None, "detalle": detalle,
                "explicacion": "Responde las preguntas de impacto del activo para calcular su criticidad."}

    puntaje = max(puntajes)
    explicacion = ("La criticidad es la del mayor impacto entre confidencialidad, integridad y "
                   "disponibilidad, según las respuestas registradas.")
    if (activo.get("dependencia") or "").lower() == "alta":
        explicacion += " Además, el negocio depende mucho de este activo."
    return {"nivel": NOMBRES_NIVEL[puntaje], "puntaje": puntaje, "detalle": detalle,
            "explicacion": explicacion}


# ---------------------------------------------------------------------------
# Ficha completa
# ---------------------------------------------------------------------------
def _atributos(activo):
    """Usa lo que el usuario confirmó en el RF05; si no hay, lo detecta del nombre y el uso."""
    ia = activo.get("clasificacion_ia") or {}
    if ia.get("atributos"):
        return dict(ia["atributos"]), True
    texto = " ".join(filter(None, [activo.get("nombre_activo"), activo.get("uso")]))
    atributos = extraer_atributos(texto)
    atributos.pop("_pista_catalogo", None)
    return atributos, False


def _maneja_datos_personales(tipos):
    return any(re.search(r"personal|cliente|emplead|salud|pacient", t.lower()) for t in tipos)


def generar_ficha(activo, hoy=None):
    hoy = hoy or date.today()
    categoria = activo.get("tipo_activo") or "Otro"
    info = info_categoria(categoria)
    atributos, confirmados = _atributos(activo)
    producto = atributos.get("producto")
    # "2012 r2" -> "2012 R2" para mostrarlo como lo escribe el fabricante
    version = re.sub(r"\br(\d)", r"R\1", atributos.get("version") or "") or None
    expuesto = atributos.get("expuesto_internet") or "No determinado"

    tipos_datos = list(dict.fromkeys((activo.get("datos") or []) + (atributos.get("tipos_datos") or [])))
    soporte = soporte_fabricante(producto, version, hoy)
    nivel_criticidad = criticidad(activo)

    # 1. Qué es y para qué sirve
    que_es = {
        "texto": info["que_es"],
        "uso": activo.get("uso") or None,
        "area": activo.get("area") or None,
    }

    # 2. Características relevantes
    origen = "confirmado en el registro" if confirmados else "detectado automáticamente del nombre"
    caracteristicas = [
        {"etiqueta": "Categoría", "valor": categoria},
        {"etiqueta": "Fabricante", "valor": atributos.get("fabricante") or "No identificado", "detalle": origen},
        {"etiqueta": "Producto", "valor": producto or "No identificado", "detalle": origen},
        {"etiqueta": "Versión", "valor": version or "No indicada"},
    ]
    if soporte:
        caracteristicas.append({"etiqueta": "Soporte del fabricante", "valor": soporte["estado"],
                                "detalle": soporte["texto"], "fuente": soporte["fuente"],
                                "alerta": soporte["alerta"]})
    caracteristicas.append({"etiqueta": "Expuesto a internet", "valor": expuesto,
                            "alerta": expuesto == "Sí"})
    caracteristicas.append({"etiqueta": "Datos que almacena o procesa",
                            "valor": ", ".join(tipos_datos) if tipos_datos else "No indicados"})
    if activo.get("clasificacion"):
        caracteristicas.append({"etiqueta": "Clasificación de la información",
                                "valor": activo["clasificacion"]})

    # 3. Amenazas y vulnerabilidades típicas
    amenazas = [{"texto": t, "fuente": fuente(f), "origen": "Típica de la categoría"}
                for t, f in info["amenazas"]]
    if soporte and soporte["estado"] == "Sin soporte":
        amenazas.insert(0, {"texto": "Vulnerabilidades que el fabricante ya no corregirá, porque "
                                     "la versión no tiene soporte.",
                            "fuente": soporte["fuente"], "origen": "Por la versión"})
    if expuesto == "Sí":
        amenazas.insert(0, {"texto": "Al estar expuesto a internet, cualquier persona puede "
                                     "intentar atacarlo, por ejemplo adivinando contraseñas.",
                            "fuente": fuente("cisa_ransomware"), "origen": "Por su exposición"})
    for amenaza in activo.get("amenazas") or []:
        amenazas.append({"texto": amenaza, "fuente": None, "origen": "Identificada por tu equipo"})

    # 4. Buenas prácticas básicas (las prioritarias primero)
    practicas = []
    if soporte and soporte["estado"] == "Sin soporte":
        practicas.append({"texto": f"Planear la migración de {producto} {version} a una versión con "
                                   f"soporte; mientras tanto, aislarlo y limitar su acceso.",
                          "fuente": soporte["fuente"], "prioridad": "alta"})
    if expuesto == "Sí":
        practicas.append({"texto": "Limitar el acceso desde internet (VPN o lista de direcciones "
                                   "permitidas) y exigir autenticación multifactor.",
                          "fuente": fuente("cisa_ransomware"), "prioridad": "alta"})
    if (activo.get("copias") or "").startswith("No se realizan"):
        practicas.append({"texto": "Empezar a hacer copias de seguridad de este activo y probar "
                                   "que se pueden restaurar.",
                          "fuente": fuente("cis"), "prioridad": "alta"})
    if _maneja_datos_personales(tipos_datos):
        practicas.append({"texto": "Como maneja datos personales, la Ley 1581 de 2012 exige "
                                   "protegerlos con medidas de seguridad que eviten su pérdida, "
                                   "consulta o uso no autorizado.",
                          "fuente": fuente("ley1581"), "prioridad": "alta"})
    practicas += [{"texto": t, "fuente": fuente(f), "prioridad": "normal"} for t, f in info["practicas"]]
    if producto:
        consulta = f"{producto} {version or ''}".strip()
        practicas.append({
            "texto": f"Revisar las vulnerabilidades publicadas para {consulta}.",
            "fuente": {"titulo": f"NVD - búsqueda de vulnerabilidades de {consulta}",
                       "url": "https://nvd.nist.gov/vuln/search/results?form_type=Basic"
                              f"&results_type=overview&search_type=all&query={quote_plus(consulta)}"},
            "prioridad": "normal"})

    # Lista de fuentes usadas, sin repetir
    usadas = {}
    for elemento in caracteristicas + amenazas + practicas:
        f = elemento.get("fuente")
        if f:
            usadas[f["url"]] = f

    return {
        "activo": {"id": activo.get("id"), "nombre": activo.get("nombre_activo"),
                   "tipo": categoria},
        "generado_con_ia": True,
        "metodo": METODO,
        "fecha_generacion": hoy.isoformat(),
        "que_es": que_es,
        "caracteristicas": caracteristicas,
        "criticidad": nivel_criticidad,
        "amenazas": amenazas,
        "practicas": practicas,
        "fuentes": list(usadas.values()),
        "aviso": "Contenido generado automáticamente con IA a partir de la información "
                 "registrada. Verifícalo antes de tomar decisiones importantes.",
    }
    
    

# ---------------------------------------------------------------------------
# Análisis rápido para el panel principal (RF15)
# ---------------------------------------------------------------------------
def analizar_activo(activo, hoy=None):
    """Soporte del fabricante y exposición de un activo, sin armar la ficha completa."""
    atributos, _ = _atributos(activo)
    producto = atributos.get("producto")
    version = re.sub(r"\br(\d)", r"R\1", atributos.get("version") or "") or None
    soporte = soporte_fabricante(producto, version, hoy)
    return {
        "id": activo.get("id"),
        "producto": producto,
        "version": version,
        "soporte": soporte["estado"] if soporte else "Desconocido",
        "fecha_fin_soporte": soporte.get("fecha_fin") if soporte else None,
        "expuesto_internet": atributos.get("expuesto_internet") or "No determinado",
    }