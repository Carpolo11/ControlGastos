"""Normalización de texto compartida por el entrenamiento y el servicio."""
import re
import unicodedata


def normalizar(texto: str) -> str:
    """Minúsculas, sin tildes y con espacios simples."""
    texto = unicodedata.normalize("NFKD", texto or "")
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    texto = texto.lower()
    return re.sub(r"\s+", " ", texto).strip()