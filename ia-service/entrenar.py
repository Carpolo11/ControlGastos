"""Entrena el clasificador de activos del RF05 (Random Forest).

1. Valida el modelo con activos que NO vio al entrenar (RNF07: mínimo 85 %).
2. Si cumple, lo entrena con todos los datos y lo guarda en modelo/.

Uso:  python entrenar.py
Crea: modelo/clasificador.joblib y modelo/metricas.json
"""
import csv
import json
import random
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import FeatureUnion, Pipeline

from categorias import CATEGORIAS
from texto import normalizar

BASE = Path(__file__).resolve().parent
DATASET = BASE / "datos" / "activos_entrenamiento.csv"
CARPETA_MODELO = BASE / "modelo"
PRECISION_MINIMA = 0.85  # RNF07
VERSION_MODELO = "rf05-rf-" + datetime.now().strftime("%Y%m%d")


def crear_modelo():
    caracteristicas = FeatureUnion([
        # palabras sueltas y pares de palabras: "base de datos", "windows server"
        ("palabras", TfidfVectorizer(preprocessor=normalizar, ngram_range=(1, 2),
                                     min_df=2, sublinear_tf=True)),
        # fragmentos de letras: ayudan con nombres de productos nuevos y errores de escritura
        ("letras", TfidfVectorizer(preprocessor=normalizar, analyzer="char_wb",
                                   ngram_range=(3, 5), min_df=2, sublinear_tf=True)),
    ])
    clasificador = RandomForestClassifier(
        n_estimators=500, max_features="log2", class_weight="balanced",
        random_state=42, n_jobs=-1,
    )
    return Pipeline([("caracteristicas", caracteristicas), ("clasificador", clasificador)])


def cargar_dataset():
    with DATASET.open(encoding="utf-8") as archivo:
        return list(csv.DictReader(archivo))


def separar_por_activo(filas, proporcion=0.25, semilla=7):
    """Reserva el 25 % de los activos de cada categoría solo para validar,
    para medir si el modelo reconoce activos que nunca vio."""
    rng = random.Random(semilla)
    por_categoria = defaultdict(set)
    for f in filas:
        por_categoria[f["categoria"]].add(f["nucleo"])
    reservados = set()
    for nucleos in por_categoria.values():
        nucleos = sorted(nucleos)
        rng.shuffle(nucleos)
        reservados.update(nucleos[: max(1, round(len(nucleos) * proporcion))])
    entrenamiento = [f for f in filas if f["nucleo"] not in reservados]
    validacion = [f for f in filas if f["nucleo"] in reservados]
    return entrenamiento, validacion


def main():
    if not DATASET.exists():
        sys.exit("No existe el dataset. Ejecuta primero: python datos/generar_dataset.py")

    filas = cargar_dataset()
    entrenamiento, validacion = separar_por_activo(filas)

    modelo = crear_modelo()
    modelo.fit([f["descripcion"] for f in entrenamiento], [f["categoria"] for f in entrenamiento])

    esperado = [f["categoria"] for f in validacion]
    predicho = modelo.predict([f["descripcion"] for f in validacion])
    precision = accuracy_score(esperado, predicho)

    print(f"Ejemplos: {len(entrenamiento)} para entrenar, {len(validacion)} para validar")
    print(f"Precisión con activos no vistos: {precision:.1%} (mínimo {PRECISION_MINIMA:.0%})\n")
    print(classification_report(esperado, predicho, labels=CATEGORIAS, zero_division=0))

    if precision < PRECISION_MINIMA:
        sys.exit("ERROR: El modelo no alcanza la precisión mínima del RNF07. No se guardó.")

    # Modelo final: se entrena con todos los datos
    modelo_final = crear_modelo()
    modelo_final.fit([f["descripcion"] for f in filas], [f["categoria"] for f in filas])

    CARPETA_MODELO.mkdir(exist_ok=True)
    joblib.dump({"modelo": modelo_final, "version": VERSION_MODELO},
                CARPETA_MODELO / "clasificador.joblib")
    metricas = {
        "version": VERSION_MODELO,
        "fecha": datetime.now().isoformat(timespec="seconds"),
        "precision_validacion": round(precision, 4),
        "ejemplos_entrenamiento": len(filas),
        "ejemplos_validacion": len(validacion),
        "dataset": "sintético (generar_dataset.py)",
    }
    (CARPETA_MODELO / "metricas.json").write_text(
        json.dumps(metricas, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"OK: Modelo guardado en modelo/clasificador.joblib (versión {VERSION_MODELO})")


if __name__ == "__main__":
    main()