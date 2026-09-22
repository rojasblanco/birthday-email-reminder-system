# Sistema de recordatorios de cumpleaños por correo

[English version](README.md)

Automatización ligera en Google Apps Script para gestionar comunicaciones de cumpleaños dentro de una organización. El sistema conecta una fuente de datos de cumpleaños con tarjetas almacenadas en Google Drive y envía automáticamente dos tipos de correo:

- una **tarjeta personal de cumpleaños** enviada directamente a la persona el día exacto de su cumpleaños;
- un **aviso mensual de cumpleaños** enviado al listado activo para que el equipo conozca qué integrantes cumplen años durante ese mes.

Este repositorio contiene una implementación pública, anonimizada y configurable. No incluye datos reales de personas, correos de producción, IDs privados de Drive ni identificadores de bases de datos institucionales.

## Por qué existe el sistema

La necesidad de contar con recordatorios de cumpleaños por correo electrónico surgió como un **requerimiento operativo asignado dentro del equipo**. A partir de ese requerimiento, el autor del repositorio diseñó y desarrolló la estructura de automatización que permite mantener el proceso sin gestionar cada cumpleaños manualmente:

```text
Fuente de cumpleaños del personal
        ↓
Nombre + fecha de nacimiento + correo
        ↓
Vinculación por correo con la tarjeta
        ↓
Diseño almacenado en Google Drive
        ↓
Google Apps Script
        ↓
Felicitación personal + aviso mensual
```

Las tarjetas pueden ser diseñadas por el equipo de diseño, comunicación o cualquier persona autorizada para prepararlas. La automatización únicamente necesita el enlace correspondiente en Drive.

## Qué hace el sistema

### 1. Lee la fuente de cumpleaños

La hoja fuente debe proporcionar:

| Columna | Contenido |
|---|---|
| A | Nombre de la persona |
| B | Fecha de nacimiento |
| C | Correo |

En producción, esta fuente puede ser una base general de personal u otra hoja autorizada.

### 2. Envía una tarjeta personal

Cuando el día y mes actual coinciden con el cumpleaños de una persona, el sistema envía una felicitación **individual y directa al cumpleañero/a en la fecha correspondiente**. Para hacerlo:

1. relaciona su correo con la tabla de tarjetas personales;
2. obtiene la imagen correspondiente desde Google Drive;
3. inserta la imagen dentro del correo;
4. envía la felicitación al cumpleañero/a;
5. envía una confirmación administrativa al correo configurado.

### 3. Envía el aviso mensual

En el día configurado de cada mes, el sistema envía un **aviso general al equipo para informar qué integrantes cumplen años durante el mes actual**. Para hacerlo:

1. selecciona el diseño mensual del mes actual;
2. construye el listado de destinatarios desde la fuente de cumpleaños;
3. excluye los correos registrados en la hoja de exclusiones;
4. envía la imagen mensual mediante CCO/BCC para no mostrar el listado completo de destinatarios.

### 4. Permite exclusiones mensuales

La hoja de exclusiones sirve para las personas que no deben recibir el **aviso general mensual**.

En el comportamiento actual de referencia, la felicitación personal funciona de forma independiente a esa exclusión mensual. Si una organización desea que una sola exclusión bloquee ambos tipos de mensajes, esa política debe implementarse explícitamente.

## Hoja de gestión

El sistema utiliza tres hojas principales:

| Hoja | Para qué sirve |
|---|---|
| `tarjetas_personales` | Relaciona el correo de cada persona con el enlace de Drive de su tarjeta personal |
| `disenos_mensuales` | Relaciona los meses 1–12 con el enlace de Drive del diseño mensual |
| `excluidos_mensual` | Contiene personas/correos que no deben recibir el aviso grupal mensual |

Los nombres de las hojas son configurables mediante Script Properties, por lo que pueden adaptarse a inglés u otras convenciones.

## Archivos de ejemplo

Se incluyen dos ejemplos anonimizados:

- `data/birthday_reminder_management_example_en.xlsx`
- `data/sistema_recordatorios_cumpleanos_ejemplo_es.xlsx`

Cada archivo incluye también una hoja ficticia de cumpleaños para mostrar cómo debe verse la fuente de datos. Todos los nombres, correos y enlaces de Drive son ejemplos ficticios.

## Configuración

Los valores específicos de producción deben guardarse en **Google Apps Script Script Properties** y no directamente en el código público.

Obligatorios:

- `BIRTHDAY_SOURCE_SPREADSHEET_ID`
- `ADMIN_EMAIL`

Opcionales:

- `BIRTHDAY_SOURCE_SHEET`
- `PERSONAL_CARDS_SHEET`
- `MONTHLY_DESIGNS_SHEET`
- `MONTHLY_EXCLUSIONS_SHEET`
- `ORGANIZATION_NAME`
- `LANGUAGE` (`en` o `es`)
- `MONTHLY_SEND_DAY`

Consulta [CONFIGURATION.example.md](CONFIGURATION.example.md).

## Automatización

Debe existir un trigger temporal de Apps Script que ejecute:

`sendBirthdayReminders`

una vez al día. El sistema revisa en cada ejecución si corresponde enviar una felicitación personal o el aviso mensual.

La zona horaria del proyecto de Apps Script debe corresponder con la zona operativa de la organización.

## Tarjetas en Drive

Las imágenes permanecen almacenadas en Google Drive. La cuenta que ejecuta Apps Script debe tener acceso suficiente para leerlas.

No es recomendable dar permisos públicos de edición solo para que funcione la automatización. Debe utilizarse el menor nivel de acceso que permita a la cuenta ejecutora leer el archivo.

## Seguridad y privacidad

Las fechas de nacimiento y los correos son datos personales. La base real de cumpleaños, enlaces reales de tarjetas, correos de producción, IDs de Drive y registros operativos deben mantenerse fuera del repositorio público.

El aviso mensual utiliza CCO/BCC para evitar exponer la lista completa de correos a los destinatarios.

Consulta [SECURITY.md](SECURITY.md).

## Procedencia del proyecto

La necesidad de implementar recordatorios de cumpleaños mediante correo electrónico surgió como un **requerimiento operativo asignado dentro del equipo**. A partir de ese requerimiento, el autor del repositorio **diseñó y desarrolló de forma integral el sistema de automatización que lo convierte en un flujo operativo**, incluyendo la conexión con la fuente de cumpleaños del personal, la relación por correo, la estructura de tarjetas personales y mensuales, la lectura de imágenes desde Drive, el manejo de exclusiones, la lógica de envío por Gmail y la confirmación administrativa.

El entorno organizacional aportó la necesidad real, la estructura de datos de personal, el contexto de comunicación y el flujo de diseño de tarjetas. La versión pública excluye deliberadamente los datos e identificadores privados de la organización.

Consulta [PROVENANCE.md](PROVENANCE.md).

## Limitaciones actuales

- Depende de las cuotas y límites de Google Apps Script y Gmail.
- La fuente espera actualmente nombre, fecha de nacimiento y correo en las columnas A:C.
- Las tarjetas de Drive deben ser accesibles para la cuenta que ejecuta el código.
- La lista de exclusión actual afecta solamente al aviso grupal mensual.
- No existe una interfaz administrativa web.
- La implementación de referencia no mantiene una base separada de historial de envíos.

## Posibles mejoras futuras

- historial de envíos y controles de reenvío;
- detección automática de tarjetas faltantes;
- panel para identificar cumpleaños/tarjetas pendientes de diseño;
- opción de exclusión que pueda aplicarse tanto al mensaje personal como al mensual;
- plantillas HTML configurables además de tarjetas basadas en imágenes;
- alertas automáticas cuando existan problemas de permisos en Drive.

## Estado y licencia

**Estado:** Implementación funcional de referencia / mantenimiento iterativo.

El código fuente anonimizado y la documentación incluidos en este repositorio se distribuyen bajo la [Licencia MIT](LICENSE).

La licencia aplica al material publicado en este repositorio. Los datos reales de personal, credenciales, bases privadas de la organización, recursos privados de Drive, diseños pertenecientes a terceros y demás activos no públicos no forman parte de este repositorio.

---

**Stack:** Google Apps Script · Google Sheets · Google Drive · Gmail
