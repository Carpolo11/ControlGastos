"""Genera el dataset sintético de entrenamiento del RF05.

Crea descripciones de activos en español, como las escribiría un
responsable de TI, cada una con su categoría. Es un punto de partida para
el MVP: la precisión real se debe medir y mejorar con descripciones reales
de los usuarios (y con la retroalimentación del RF18).

Uso:  python datos/generar_dataset.py
Crea: datos/activos_entrenamiento.csv
"""
import csv
import random
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from categorias import (APLICACIONES, BASES_DATOS, COMPUTADORES, NUBE,  # noqa: E402
                        REDES, SERVIDORES)

SEMILLA = 2026
EJEMPLOS_POR_PLANTILLA = 22
SALIDA = Path(__file__).resolve().parent / "activos_entrenamiento.csv"

# ---------------------------------------------------------------------------
# Vocabulario por categoría: "núcleos" que nombran el activo
# ---------------------------------------------------------------------------
NUCLEOS = {
    COMPUTADORES: [
        "un portátil Lenovo ThinkPad con Windows 11", "un computador de escritorio Dell Optiplex",
        "un portátil HP ProBook con Windows 10", "un MacBook Air", "un MacBook Pro con macOS Sonoma",
        "un equipo de escritorio con Windows 10", "un computador todo en uno HP",
        "una tablet Samsung Galaxy Tab", "un iPad", "un celular corporativo Android",
        "un iPhone de la empresa", "una impresora multifuncional Epson", "una impresora HP LaserJet",
        "un escáner Canon", "un portátil Asus con Windows 11", "el PC de recepción",
        "los computadores de los vendedores", "un lector de código de barras",
        "un datáfono", "una cámara IP de vigilancia", "el portátil del gerente",
        "un computador con Ubuntu 22.04 para diseño", "una estación de trabajo Dell Precision",
    ],
    SERVIDORES: [
        "un servidor con Windows Server 2012", "un servidor Windows Server 2019",
        "un servidor Windows Server 2022", "un servidor Linux con Ubuntu Server 20.04",
        "un servidor con CentOS 7", "un servidor Red Hat Enterprise Linux 8",
        "un servidor Debian 11", "un servidor físico Dell PowerEdge", "un servidor HPE ProLiant",
        "un servidor de archivos", "un servidor de dominio con Active Directory",
        "un servidor VMware ESXi 7 con máquinas virtuales", "un servidor Proxmox",
        "un NAS Synology", "un servidor de impresión", "un servidor de correo Exchange 2016",
        "un servidor web con Apache", "un servidor con Nginx", "un servidor de respaldos",
        "un servidor IIS", "un servidor en el rack de la oficina", "el servidor principal de la empresa",
    ],
    APLICACIONES: [
        "el software contable Siigo", "el ERP SAP Business One", "el ERP Odoo 16",
        "la aplicación de facturación electrónica", "el sistema de nómina",
        "el programa World Office", "el CRM de ventas", "la página web en WordPress 6",
        "la tienda virtual en WooCommerce", "el sistema de inventarios desarrollado a la medida",
        "la aplicación móvil para clientes", "el sistema POS de las cajas",
        "el antivirus ESET", "la suite Microsoft Office 2019", "el sistema de gestión documental",
        "la intranet", "el sistema de citas", "el software de diseño AutoCAD 2020",
        "la aplicación de recursos humanos", "el portal de clientes en PHP",
        "el sistema de historias clínicas", "el software de punto de venta",
    ],
    BASES_DATOS: [
        "una base de datos SQL Server 2016", "una base de datos MySQL 5.7",
        "una base de datos MySQL 8", "una base de datos PostgreSQL 14",
        "una base de datos Oracle 12c", "una base de datos MongoDB",
        "una base de datos MariaDB", "una base de datos SQLite",
        "una base de datos Firebird", "una base de datos Access",
        "la base de datos de clientes", "la base de datos de la contabilidad",
        "la base de datos de facturación", "la base de datos de nómina",
        "la base de datos de productos", "una base de datos Redis",
        "la base de datos del ERP", "una instancia de SQL Server Express",
        "las tablas de la base de datos de ventas", "un esquema PostgreSQL con los pedidos",
    ],
    NUBE: [
        "Google Workspace", "Microsoft 365", "una cuenta de Amazon Web Services",
        "máquinas en AWS EC2", "un bucket de Amazon S3", "una suscripción de Microsoft Azure",
        "Google Cloud Platform", "Google Drive", "OneDrive", "Dropbox Business",
        "el correo de Gmail empresarial", "Salesforce", "HubSpot", "Zoom", "Microsoft Teams",
        "el hosting en la nube de la página web", "Shopify", "una base de datos en Firebase",
        "el almacenamiento en la nube de iCloud", "Canva Pro", "Trello", "Slack",
    ],
    REDES: [
        "un router Mikrotik", "un firewall Fortinet FortiGate 60F", "un firewall pfSense",
        "un switch Cisco Catalyst 2960", "un switch TP-Link de 24 puertos",
        "un access point Ubiquiti UniFi", "el router del proveedor de internet",
        "la red WiFi de la oficina", "un módem Huawei", "la VPN para trabajo remoto",
        "el cableado estructurado", "un switch HP Aruba", "un router Cisco ISR",
        "el firewall Sophos", "los puntos de acceso inalámbricos", "la red de invitados",
        "el enlace de fibra óptica", "un repetidor WiFi", "la planta telefónica IP",
        "un balanceador de carga", "el rack de comunicaciones",
    ],
}

USOS = {
    COMPUTADORES: ["lo usa la contadora para su trabajo diario", "se usa para atender clientes",
                   "lo usan los vendedores en campo", "sirve para imprimir facturas",
                   "es el equipo personal del gerente", "lo usa el equipo de diseño",
                   "se usa para videollamadas y correo", "registra los pagos de los clientes"],
    SERVIDORES: ["aloja los archivos compartidos de todas las áreas", "corre las máquinas virtuales",
                 "maneja los usuarios y contraseñas de la red", "publica la página web",
                 "guarda las copias de seguridad", "procesa la contabilidad",
                 "atiende las aplicaciones internas", "recibe el correo de la empresa"],
    APLICACIONES: ["con el que llevamos la contabilidad", "para facturar a los clientes",
                   "para manejar la nómina de los empleados", "donde se registran las ventas",
                   "para controlar el inventario", "donde los clientes hacen pedidos",
                   "para gestionar a los empleados", "para agendar citas de pacientes"],
    BASES_DATOS: ["donde se guardan los datos de los clientes", "que almacena las facturas",
                  "con la información de los empleados", "que guarda el historial de ventas",
                  "con los registros contables", "que contiene los pedidos",
                  "donde quedan los datos del inventario", "que almacena las historias clínicas"],
    NUBE: ["para el correo y los documentos", "donde guardamos los archivos compartidos",
           "para las reuniones virtuales", "donde está alojada la página web",
           "para el seguimiento de clientes", "para colaborar entre áreas",
           "donde corren algunas aplicaciones", "para la tienda en línea"],
    REDES: ["que da internet a toda la oficina", "que protege la red de ataques externos",
            "que conecta los equipos de la oficina", "para que los empleados trabajen desde casa",
            "que conecta la sede con el datacenter", "para la red WiFi de los visitantes",
            "que separa la red de invitados de la red interna", "que comunica las dos sedes"],
}

AREAS = ["contabilidad", "ventas", "gerencia", "recursos humanos", "tecnología",
         "bodega", "atención al cliente", "operaciones", "finanzas", "toda la empresa"]

EXTRAS = ["", "", "", " Está expuesto a internet.", " Solo se accede desde la red interna.",
          " Tiene datos personales de clientes.", " No tiene copias de seguridad.",
          " Lleva varios años sin actualizarse.", " Se accede de forma remota.",
          " Lo administra un proveedor externo.", " Es crítico para la operación."]

# ---------------------------------------------------------------------------
# Plantillas: distintas formas de describir un activo
# ---------------------------------------------------------------------------
PLANTILLAS = [
    "tenemos {n} {u}.",
    "Tenemos {n} en el área de {a} {u}.{x}",
    "{N} del área de {a}, {u}.{x}",
    "En la empresa usamos {n} {u}.",
    "Contamos con {n}, {u}.{x}",
    "Hay {n} que {a2} utiliza a diario.{x}",
    "registrar {n} de {a}{x}",
    "{N}{x}",
    "Quiero agregar {n} al inventario, {u}.",
    "El área de {a} trabaja con {n}.{x}",
    "nuestro activo es {n} {u}",
    "Disponemos de {n} administrado por {a}.{x}",
    "{N} {u}, lo maneja {a}.",
    "Usamos {n} {u} desde hace años.{x}",
    "Activo: {n}. Uso: {u}. Área: {a}.",
    "Se trata de {n} {u}.{x}",
]


def generar():
    rng = random.Random(SEMILLA)
    filas = []
    for id_plantilla, plantilla in enumerate(PLANTILLAS):
        for categoria, nucleos in NUCLEOS.items():
            for _ in range(EJEMPLOS_POR_PLANTILLA):
                n = rng.choice(nucleos)
                area = rng.choice(AREAS)
                texto = plantilla.format(
                    n=n, N=n[:1].upper() + n[1:], u=rng.choice(USOS[categoria]),
                    a=area, a2=f"el área de {area}", x=rng.choice(EXTRAS),
                )
                if rng.random() < 0.3:
                    texto = texto.lower()
                filas.append({"descripcion": texto.strip(), "categoria": categoria,
                              "plantilla": id_plantilla, "nucleo": n})
    # quitar duplicados exactos
    vistos, unicas = set(), []
    for f in filas:
        clave = (f["descripcion"], f["categoria"])
        if clave not in vistos:
            vistos.add(clave)
            unicas.append(f)
    return unicas


if __name__ == "__main__":
    filas = generar()
    with SALIDA.open("w", newline="", encoding="utf-8") as archivo:
        escritor = csv.DictWriter(archivo, fieldnames=["descripcion", "categoria", "plantilla", "nucleo"])
        escritor.writeheader()
        escritor.writerows(filas)
    print(f"Dataset generado: {len(filas)} ejemplos en {SALIDA.name}")