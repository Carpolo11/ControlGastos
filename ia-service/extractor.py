"""Extracción de atributos del activo a partir de su descripción (RF05).

Usa reglas de procesamiento de lenguaje natural (diccionarios y expresiones
regulares) para encontrar: fabricante, producto, versión, exposición a
internet y tipo de datos que procesa. El usuario confirma o corrige todo
antes de guardar (RNF06).
"""
import re

from categorias import (APLICACIONES, BASES_DATOS, COMPUTADORES, NUBE,
                        REDES, SERVIDORES)
from texto import normalizar

# (expresión a buscar en el texto normalizado, fabricante, producto, categoría sugerida)
# El orden importa: primero los nombres más específicos.
CATALOGO = [
    (r"windows server", "Microsoft", "Windows Server", SERVIDORES),
    (r"sql server", "Microsoft", "SQL Server", BASES_DATOS),
    (r"exchange", "Microsoft", "Exchange Server", SERVIDORES),
    (r"active directory", "Microsoft", "Active Directory", SERVIDORES),
    (r"microsoft 365|office 365", "Microsoft", "Microsoft 365", NUBE),
    (r"microsoft office|office \d{4}", "Microsoft", "Microsoft Office", APLICACIONES),
    (r"\bteams\b", "Microsoft", "Microsoft Teams", NUBE),
    (r"onedrive", "Microsoft", "OneDrive", NUBE),
    (r"\bazure\b", "Microsoft", "Azure", NUBE),
    (r"\biis\b", "Microsoft", "IIS", SERVIDORES),
    (r"windows", "Microsoft", "Windows", COMPUTADORES),
    (r"ubuntu server", "Canonical", "Ubuntu Server", SERVIDORES),
    (r"ubuntu", "Canonical", "Ubuntu", COMPUTADORES),
    (r"red hat|rhel", "Red Hat", "Red Hat Enterprise Linux", SERVIDORES),
    (r"centos", "CentOS Project", "CentOS", SERVIDORES),
    (r"debian", "Debian Project", "Debian", SERVIDORES),
    (r"vmware|esxi", "VMware", "VMware ESXi", SERVIDORES),
    (r"proxmox", "Proxmox", "Proxmox VE", SERVIDORES),
    (r"apache", "Apache Software Foundation", "Apache HTTP Server", SERVIDORES),
    (r"nginx", "F5", "Nginx", SERVIDORES),
    (r"synology", "Synology", "NAS Synology", SERVIDORES),
    (r"poweredge", "Dell", "PowerEdge", SERVIDORES),
    (r"proliant", "HPE", "ProLiant", SERVIDORES),
    (r"mysql", "Oracle", "MySQL", BASES_DATOS),
    (r"mariadb", "MariaDB Foundation", "MariaDB", BASES_DATOS),
    (r"postgres(?:ql)?", "PostgreSQL Global Development Group", "PostgreSQL", BASES_DATOS),
    (r"oracle", "Oracle", "Oracle Database", BASES_DATOS),
    (r"mongodb|mongo\b", "MongoDB Inc.", "MongoDB", BASES_DATOS),
    (r"redis", "Redis Ltd.", "Redis", BASES_DATOS),
    (r"sqlite", "SQLite", "SQLite", BASES_DATOS),
    (r"firebird", "Firebird Project", "Firebird", BASES_DATOS),
    (r"firebase", "Google", "Firebase", NUBE),
    (r"\baccess\b", "Microsoft", "Access", BASES_DATOS),
    (r"siigo", "Siigo", "Siigo", APLICACIONES),
    (r"world office", "World Office", "World Office", APLICACIONES),
    (r"\bsap\b", "SAP", "SAP", APLICACIONES),
    (r"odoo", "Odoo", "Odoo", APLICACIONES),
    (r"wordpress", "WordPress", "WordPress", APLICACIONES),
    (r"woocommerce", "Automattic", "WooCommerce", APLICACIONES),
    (r"autocad", "Autodesk", "AutoCAD", APLICACIONES),
    (r"eset", "ESET", "ESET Antivirus", APLICACIONES),
    (r"google workspace|gmail", "Google", "Google Workspace", NUBE),
    (r"google drive", "Google", "Google Drive", NUBE),
    (r"google cloud|\bgcp\b", "Google", "Google Cloud", NUBE),
    (r"amazon web services|\baws\b|\bec2\b|\bs3\b", "Amazon", "Amazon Web Services", NUBE),
    (r"dropbox", "Dropbox", "Dropbox", NUBE),
    (r"salesforce", "Salesforce", "Salesforce", NUBE),
    (r"hubspot", "HubSpot", "HubSpot", NUBE),
    (r"shopify", "Shopify", "Shopify", NUBE),
    (r"\bzoom\b", "Zoom", "Zoom", NUBE),
    (r"\bslack\b", "Slack", "Slack", NUBE),
    (r"trello", "Atlassian", "Trello", NUBE),
    (r"icloud", "Apple", "iCloud", NUBE),
    (r"fortigate|fortinet", "Fortinet", "FortiGate", REDES),
    (r"pfsense", "Netgate", "pfSense", REDES),
    (r"sophos", "Sophos", "Sophos Firewall", REDES),
    (r"mikrotik", "MikroTik", "RouterOS", REDES),
    (r"unifi|ubiquiti", "Ubiquiti", "UniFi", REDES),
    (r"aruba", "HPE Aruba", "Aruba", REDES),
    (r"cisco", "Cisco", "Cisco", REDES),
    (r"tp-?link", "TP-Link", "TP-Link", REDES),
    (r"huawei", "Huawei", "Huawei", REDES),
    (r"macbook", "Apple", "MacBook", COMPUTADORES),
    (r"macos", "Apple", "macOS", COMPUTADORES),
    (r"iphone", "Apple", "iPhone", COMPUTADORES),
    (r"ipad", "Apple", "iPad", COMPUTADORES),
    (r"thinkpad", "Lenovo", "ThinkPad", COMPUTADORES),
    (r"lenovo", "Lenovo", "Lenovo", COMPUTADORES),
    (r"optiplex", "Dell", "OptiPlex", COMPUTADORES),
    (r"dell precision", "Dell", "Precision", COMPUTADORES),
    (r"\bdell\b", "Dell", "Dell", COMPUTADORES),
    (r"probook|elitebook", "HP", "HP ProBook/EliteBook", COMPUTADORES),
    (r"laserjet", "HP", "LaserJet", COMPUTADORES),
    (r"\bhp\b", "HP", "HP", COMPUTADORES),
    (r"samsung", "Samsung", "Samsung", COMPUTADORES),
    (r"epson", "Epson", "Epson", COMPUTADORES),
    (r"canon", "Canon", "Canon", COMPUTADORES),
    (r"asus", "Asus", "Asus", COMPUTADORES),
    (r"android", "Google", "Android", COMPUTADORES),
]

# Versión justo después del producto: "2012", "2012 r2", "8.0.3", "12c", "v2"
PATRON_VERSION = re.compile(
    r"^[\s:,-]*(?:version|ver\.?|v\.?)?\s*"
    r"(\d{1,4}(?:\.\d{1,4}){0,3}(?:\s?r2|[a-z])?)\b"
)

EXPOSICION_SI = [
    r"expuest[oa] a internet", r"desde internet", r"acceso remoto", r"se accede de forma remota",
    r"desde casa", r"\bvpn\b", r"publica(?:da|do)? (?:en|a) internet", r"pagina web",
    r"tienda (?:virtual|en linea)", r"clientes (?:acceden|entran|hacen pedidos)", r"portal de clientes",
    r"en la nube", r"publica la pagina", r"desde fuera de la oficina",
]
EXPOSICION_NO = [
    r"solo (?:se accede )?desde la red interna", r"solo (?:en la )?red (?:interna|local)",
    r"sin (?:acceso a )?internet", r"no (?:esta )?expuest[oa]", r"no tiene internet",
    r"solo dentro de la oficina",
]

TIPOS_DATOS = {
    "Datos personales": [r"datos personales", r"clientes", r"empleados", r"cedula", r"pacientes",
                         r"nomina", r"recursos humanos"],
    "Datos financieros o contables": [r"contab", r"factura", r"nomina", r"pagos", r"tarjeta",
                                      r"financ", r"bancari"],
    "Datos de salud": [r"historias? clinicas?", r"pacientes", r"citas medicas"],
    "Credenciales de acceso": [r"contrasena", r"usuarios y contrasenas", r"active directory",
                               r"credencial"],
    "Información comercial": [r"ventas", r"pedidos", r"inventario", r"productos", r"proveedores",
                              r"clientes"],
    "Documentos internos": [r"archivos compartidos", r"documentos", r"gestion documental"],
}


def _buscar_producto(texto):
    for patron, fabricante, producto, categoria in CATALOGO:
        coincidencia = re.search(patron, texto)
        if coincidencia:
            version = None
            resto = texto[coincidencia.end():]
            m = PATRON_VERSION.match(resto)
            if m:
                version = m.group(1).upper() if re.search(r"[a-z]$", m.group(1)) else m.group(1)
            return {"fabricante": fabricante, "producto": producto, "version": version,
                    "categoria_sugerida": categoria, "termino": coincidencia.group(0)}
    return None


def _exposicion(texto):
    if any(re.search(p, texto) for p in EXPOSICION_NO):
        return "No"
    if any(re.search(p, texto) for p in EXPOSICION_SI):
        return "Sí"
    return "No determinado"


def _tipos_datos(texto):
    return [tipo for tipo, patrones in TIPOS_DATOS.items()
            if any(re.search(p, texto) for p in patrones)]


def extraer_atributos(descripcion: str) -> dict:
    texto = normalizar(descripcion)
    producto = _buscar_producto(texto)
    return {
        "fabricante": producto["fabricante"] if producto else None,
        "producto": producto["producto"] if producto else None,
        "version": producto["version"] if producto else None,
        "expuesto_internet": _exposicion(texto),
        "tipos_datos": _tipos_datos(texto),
        "_pista_catalogo": producto,
    }