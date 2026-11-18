"""Base de conocimiento verificada para la ficha del activo (RF06).

Cada afirmación técnica de la ficha apunta a una fuente de FUENTES (RNF02).
Las fechas de soporte se verificaron en las páginas citadas en noviembre de 2026;
revísenlas cada cierto tiempo y agreguen productos aquí.
"""
from categorias import (APLICACIONES, BASES_DATOS, COMPUTADORES, NUBE,
                        REDES, SERVIDORES)

# ---------------------------------------------------------------------------
# Fuentes
# ---------------------------------------------------------------------------
FUENTES = {
    "cis": {"titulo": "CIS Critical Security Controls v8",
            "url": "https://www.cisecurity.org/controls/v8"},
    "cisa_ransomware": {"titulo": "CISA - #StopRansomware Guide",
                        "url": "https://www.cisa.gov/stopransomware/ransomware-guide"},
    "incibe": {"titulo": "INCIBE - Guías de ciberseguridad para empresas",
               "url": "https://www.incibe.es/empresas/guias"},
    "owasp": {"titulo": "OWASP Top 10",
              "url": "https://owasp.org/Top10/2025/0x00_2025-Introduction/"},
    "ley1581": {"titulo": "Ley 1581 de 2012 (protección de datos personales, Colombia)",
                "url": "https://relatoria.colombiacompra.gov.co/normativa/ley-1581-de-2012/"},
    "nvd": {"titulo": "NIST - National Vulnerability Database (NVD)",
            "url": "https://nvd.nist.gov/vuln/search/results"},
    # Ciclo de vida de productos
    "ms_ws2012": {"titulo": "Microsoft - Fin de soporte de Windows Server 2012 y 2012 R2",
                  "url": "https://learn.microsoft.com/lifecycle/announcements/windows-server-2012-r2-end-of-support"},
    "ms_win10": {"titulo": "Microsoft - Windows 10 support has ended on October 14, 2025",
                 "url": "https://support.microsoft.com/kb/5056949"},
    "ms_exchange": {"titulo": "Microsoft - Fin de soporte de Exchange Server 2016 y 2019",
                    "url": "https://learn.microsoft.com/en-us/troubleshoot/exchange/administration/exchange-2019-2016-end-of-support"},
    "ms_office": {"titulo": "Microsoft - Fin de soporte de Office 2016 y Office 2019",
                  "url": "https://www.microsoft.com/en-us/microsoft-365/office-2016-2019-end-of-support"},
    "sqlserver": {"titulo": "Lansweeper - Guía de fin de vida de SQL Server",
                  "url": "https://www.lansweeper.com/eol/a-comprehensive-guide-to-sql-server-end-of-life/"},
    "redhat_centos": {"titulo": "Red Hat - CentOS Linux has reached its end of life",
                      "url": "https://www.redhat.com/blog/centos-linux-has-reached-its-end-life-eol"},
    "mysql57": {"titulo": "endoflife.ai - MySQL 5.7",
                "url": "https://endoflife.ai/mysql/5.7"},
    "postgresql": {"titulo": "PostgreSQL - Versioning Policy",
                   "url": "https://www.postgresql.org/support/versioning"},
    "ubuntu2004": {"titulo": "Canonical - Ubuntu 20.04 end of standard support",
                   "url": "https://ubuntu.com/blog/20.04-end-of-standard-support"},
}

# ---------------------------------------------------------------------------
# Ciclo de soporte por producto y versión
# producto: igual al nombre que devuelve extractor.py
# versiones: {"versión": "AAAA-MM-DD"}; "2012" también cubre "2012 R2"
# ---------------------------------------------------------------------------
CICLOS_SOPORTE = [
    {"producto": "Windows Server", "versiones": {"2012": "2023-10-10"}, "fuente": "ms_ws2012"},
    {"producto": "Windows", "versiones": {"10": "2025-10-14"}, "fuente": "ms_win10",
     "nota": "Microsoft ofrece actualizaciones extendidas (ESU) pagas para algunos equipos."},
    {"producto": "Exchange Server", "versiones": {"2016": "2025-10-14", "2019": "2025-10-14"},
     "fuente": "ms_exchange"},
    {"producto": "Microsoft Office", "versiones": {"2016": "2025-10-14", "2019": "2025-10-14"},
     "fuente": "ms_office"},
    {"producto": "SQL Server", "fuente": "sqlserver", "versiones": {
        "2012": "2022-07-12", "2014": "2024-07-09", "2016": "2026-07-14",
        "2017": "2027-10-12", "2019": "2030-01-08", "2022": "2033-01-11"}},
    {"producto": "CentOS", "versiones": {"7": "2024-06-30"}, "fuente": "redhat_centos"},
    {"producto": "MySQL", "versiones": {"5.7": "2023-10-31"}, "fuente": "mysql57"},
    {"producto": "PostgreSQL", "fuente": "postgresql", "versiones": {
        "9.6": "2021-11-11", "10": "2022-11-10", "11": "2023-11-09", "12": "2024-11-21",
        "13": "2025-11-13", "14": "2026-11-12", "15": "2027-11-11", "16": "2028-11-09",
        "17": "2029-11-08", "18": "2030-11-14"}},
    {"producto": "Ubuntu Server", "versiones": {"20.04": "2025-05-31"}, "fuente": "ubuntu2004",
     "nota": "Canonical ofrece parches extendidos pagos (Ubuntu Pro / ESM)."},
    {"producto": "Ubuntu", "versiones": {"20.04": "2025-05-31"}, "fuente": "ubuntu2004",
     "nota": "Canonical ofrece parches extendidos pagos (Ubuntu Pro / ESM)."},
]

# ---------------------------------------------------------------------------
# Conocimiento por categoría: qué es, amenazas típicas y buenas prácticas.
# Cada elemento: (texto, id_fuente)
# ---------------------------------------------------------------------------
GENERAL = {
    "que_es": "Recurso tecnológico que la organización usa para operar.",
    "amenazas": [
        ("Malware y ransomware que cifra la información y pide un rescate.", "cisa_ransomware"),
        ("Errores humanos o accesos no autorizados que exponen o dañan la información.", "incibe"),
    ],
    "practicas": [
        ("Mantener un inventario actualizado de los activos y de su software.", "cis"),
        ("Hacer copias de seguridad periódicas y probar que se pueden restaurar.", "cis"),
    ],
}

CATEGORIAS_INFO = {
    COMPUTADORES: {
        "que_es": "Equipo que usan las personas para trabajar a diario: computadores, "
                  "portátiles, celulares, tabletas o impresoras.",
        "amenazas": [
            ("Malware o ransomware que llega por correos de phishing o descargas.", "cisa_ransomware"),
            ("Robo o pérdida del equipo con información de la empresa.", "incibe"),
            ("Uso de cuentas con privilegios de administrador que facilitan instalar software malicioso.", "cis"),
        ],
        "practicas": [
            ("Instalar las actualizaciones del sistema operativo y de las aplicaciones.", "cis"),
            ("Usar antivirus o una solución de protección de equipos.", "cis"),
            ("Cifrar el disco de los portátiles y equipos móviles.", "cis"),
            ("Trabajar con cuentas sin privilegios de administrador.", "cis"),
        ],
    },
    SERVIDORES: {
        "que_es": "Equipo que presta servicios a otros: guarda archivos, ejecuta aplicaciones, "
                  "maneja usuarios o publica páginas web. Suele funcionar todo el día.",
        "amenazas": [
            ("Explotación de vulnerabilidades sin parchear para entrar al servidor.", "cisa_ransomware"),
            ("Ransomware que cifra los archivos compartidos y las copias conectadas.", "cisa_ransomware"),
            ("Ataques al acceso remoto (por ejemplo, escritorio remoto expuesto a internet).", "cisa_ransomware"),
        ],
        "practicas": [
            ("Aplicar los parches de seguridad de forma periódica.", "cis"),
            ("Mantener copias de seguridad desconectadas o aisladas de la red.", "cisa_ransomware"),
            ("Exigir autenticación multifactor para el acceso remoto.", "cisa_ransomware"),
            ("Guardar y revisar los registros (logs) de acceso.", "cis"),
        ],
    },
    APLICACIONES: {
        "que_es": "Programa o sistema que apoya un proceso del negocio: contabilidad, "
                  "facturación, ventas, nómina o la página web.",
        "amenazas": [
            ("Fallas de control de acceso que permiten ver o cambiar datos de otros usuarios.", "owasp"),
            ("Inyección de código o de consultas a través de formularios.", "owasp"),
            ("Robo de contraseñas débiles o reutilizadas.", "cis"),
        ],
        "practicas": [
            ("Mantener la aplicación en una versión con soporte y actualizada.", "cis"),
            ("Dar a cada usuario solo los permisos que necesita.", "cis"),
            ("Activar la autenticación multifactor cuando la aplicación lo permita.", "cis"),
        ],
    },
    BASES_DATOS: {
        "que_es": "Sistema que almacena y organiza información del negocio, como clientes, "
                  "facturas o inventario. Suele ser el activo más valioso para un atacante.",
        "amenazas": [
            ("Acceso no autorizado y fuga de la información almacenada.", "cis"),
            ("Inyección SQL desde aplicaciones mal protegidas.", "owasp"),
            ("Cifrado o borrado de los datos por ransomware.", "cisa_ransomware"),
        ],
        "practicas": [
            ("Permitir conexiones solo desde las aplicaciones y equipos que la necesitan.", "cis"),
            ("Usar cuentas con los mínimos privilegios necesarios.", "cis"),
            ("Cifrar los datos sensibles.", "cis"),
            ("Hacer copias de seguridad y probar su restauración.", "cis"),
        ],
    },
    NUBE: {
        "que_es": "Servicio que la empresa usa por internet y administra un proveedor, "
                  "como el correo, el almacenamiento de archivos o un CRM.",
        "amenazas": [
            ("Robo de credenciales por phishing para entrar a la cuenta.", "cisa_ransomware"),
            ("Archivos o carpetas compartidos públicamente por error.", "cis"),
        ],
        "practicas": [
            ("Activar la autenticación multifactor en todas las cuentas.", "cis"),
            ("Revisar periódicamente los permisos y enlaces compartidos.", "cis"),
            ("Retirar el acceso de las personas que salen de la empresa.", "cis"),
        ],
    },
    REDES: {
        "que_es": "Equipo o servicio que conecta y protege la red: routers, switches, "
                  "firewalls, WiFi o VPN.",
        "amenazas": [
            ("Firmware desactualizado con vulnerabilidades conocidas.", "cis"),
            ("Contraseñas de fábrica sin cambiar en los equipos de red.", "cis"),
            ("Acceso no autorizado a la red WiFi o a la administración del equipo.", "incibe"),
        ],
        "practicas": [
            ("Cambiar las contraseñas que vienen de fábrica.", "cis"),
            ("Actualizar el firmware de los equipos de red.", "cis"),
            ("Separar la red de invitados de la red interna.", "cis"),
        ],
    },
}


# Nombres de tipo usados antes del RF05, para los activos ya registrados
ALIAS_CATEGORIAS = {
    "Computador o portátil": COMPUTADORES,
    "Dispositivo móvil": COMPUTADORES,
    "Servidor": SERVIDORES,
    "Aplicación o software": APLICACIONES,
    "Sistema de información": APLICACIONES,
    "Base de datos": BASES_DATOS,
    "Servicio en la nube": NUBE,
    "Red o dispositivo de red": REDES,
}


def info_categoria(categoria):
    categoria = ALIAS_CATEGORIAS.get(categoria, categoria)
    return CATEGORIAS_INFO.get(categoria, GENERAL)