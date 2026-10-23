# Infonegocios | Impulsa Mipymes

Web estática (HTML + CSS + JS puro, sin frameworks ni backend) que
muestra perfiles de mipymes paraguayas con foto de producto, foto
de perfil, rubro, ubicación, promoción y botón directo a WhatsApp /
Instagram. Al costado se muestran banners de marcas que ofrecen
beneficios a esas mipymes. Más abajo hay una sección para que un
emprendedor pida aparecer, y una sección de la Cédula Mipymes (MIC).

No tiene base de datos ni panel de administración público: **solo
vos, editando los archivos del repositorio, podés cargar o quitar
una mipyme.** El usuario que visita la web solo puede hacer clic en
botones (WhatsApp, Instagram, links del MIC, contacto).

---

## 1. Estructura de carpetas

```
infonegocios/
├── index.html                  → página única, todas las secciones
├── css/
│   └── styles.css              → todos los estilos
├── js/
│   ├── config.js                → tu WhatsApp/email de contacto (¡editar antes de publicar!)
│   ├── mipymes-data.js          → ⭐ ACÁ AGREGÁS/QUITÁS MIPYMES
│   ├── banners-data.js          → ⭐ ACÁ AGREGÁS/QUITÁS BANNERS
│   └── app.js                   → lógica de renderizado (no hace falta tocarlo)
├── admin/
│   └── generador-mipyme.html    → formulario local que arma el bloque de código de una mipyme
├── assets/
│   └── img/                     → carpeta para tus propias imágenes (si no usás URLs externas)
├── .htaccess                    → cache/compresión (útil en hosting Apache, ej. Hostinger)
├── .gitignore
└── README.md                    → este archivo
```

---

## 2. Previsualizar en tu computadora

No hace falta instalar nada para verla: podés abrir `index.html`
directo con doble clic. Si preferís un servidor local (recomendado,
evita algunos problemas de rutas):

```bash
cd infonegocios
python3 -m http.server 8000
```

Y abrís `http://localhost:8000` en el navegador.

---

## 3. Cómo cargar una mipyme nueva (vos, como admin)

Tenés dos formas, hacen exactamente lo mismo:

### Opción A — Formulario (más fácil)

1. Abrí `admin/generador-mipyme.html` en el navegador (doble clic).
2. Completá los datos de la mipyme.
3. Copiá el bloque de código generado.
4. Pegalo dentro de `js/mipymes-data.js`, adentro del array
   `MIPYMES_DATA`, antes del corchete final `]`.
5. Guardá el archivo.

### Opción B — Editar el archivo a mano

Abrí `js/mipymes-data.js` y copiá/pegá un bloque como este dentro
del array, completando los datos:

```js
{
    nombre: "Nombre de la mipyme",
    categoria: "Categoría",
    descripcion: "Descripción breve",
    ubicacion: "Ciudad, Paraguay",
    whatsapp: "595981000000",
    instagram: "https://instagram.com/usuario",
    productoImagen: "https://...",
    perfilImagen: "https://...",
    promocion: "Texto de la promoción (opcional)"
},
```

Para **quitar** una mipyme, borrás su bloque completo.
Para cargar un banner nuevo, el mismo proceso pero en
`js/banners-data.js`.

Los cambios se ven apenas guardás el archivo y recargás la página
en local. Para que se vean en la web publicada, hay que subir los
cambios (paso 5).

---

## 4. Antes de publicar: configurá tu contacto

Abrí `js/config.js` y reemplazá:

- `whatsapp`: tu número real de WhatsApp de Infonegocios.
- `email`: tu email real de contacto.

Estos datos son los que usan los botones **"Quiero aparecer"** y
**"Contactar con Infonegocios"**.

> Ahora mismo esos campos tienen valores de ejemplo — si no los
> cambiás, los botones van a apuntar a un número/WhatsApp que no
> existe.

---

## 5. Crear el repositorio (Git)

Si todavía no tenés Git instalado, descargalo de
[git-scm.com](https://git-scm.com/).

Desde la carpeta `infonegocios/`:

```bash
git init
git add .
git commit -m "Primera versión de Infonegocios"
```

Creá un repositorio vacío en GitHub (botón "New repository", sin
README ni licencia) y conectalo:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/infonegocios.git
git push -u origin main
```

De ahí en adelante, cada vez que agregues una mipyme o un banner:

```bash
git add .
git commit -m "Agrego mipyme: Nombre de la mipyme"
git push
```

---

## 6. Publicar la web

Elegí la opción que prefieras (las tres son gratis):

### Opción A — GitHub Pages (la más simple si ya usás GitHub)

1. En tu repositorio de GitHub, andá a **Settings → Pages**.
2. En "Source" elegí la rama `main` y la carpeta `/ (root)`.
3. Guardá. En un par de minutos la web queda disponible en
   `https://TU_USUARIO.github.io/infonegocios/`.
4. Cada `git push` que hagas actualiza la web automáticamente.

### Opción B — Hostinger (o cualquier hosting con FTP/File Manager)

1. Comprimí el contenido de la carpeta `infonegocios/` en un `.zip`
   (el `.zip` debe contener `index.html` en la raíz, no una carpeta
   contenedora).
2. Entrá al **File Manager** de Hostinger (o cliente FTP) y subí
   todo el contenido a `public_html/`.
3. El archivo `.htaccess` ya incluido se encarga del cache y la
   compresión — no hace falta tocarlo.
4. Cada vez que cambies algo local, volvé a subir los archivos
   modificados (`mipymes-data.js`, `banners-data.js`, etc.).

### Opción C — Netlify (arrastrar y soltar, sin Git)

1. Entrá a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastrá la carpeta `infonegocios/` completa.
3. Netlify te da un link público al instante.

---

## 7. Notas importantes

- **Fotos de ejemplo**: los 3 perfiles que vienen cargados usan
  fotos de stock (Unsplash) solo para probar el diseño. Reemplazalas
  por fotos reales de cada mipyme antes de publicar en serio, o
  subilas a `assets/img/` y usá esa ruta en vez de una URL externa.
- **Cédula Mipymes**: los links al MIC ya están cargados
  correctamente:
  - Sitio del MIC: <https://www.mipymes.gov.py/>
  - Solicitud de Cédula Mipymes: <https://www.mipymes.gov.py/avanza/>
- **Sin base de datos**: si en el futuro querés que las mipymes se
  puedan cargar solas desde un formulario público (sin que vos
  edites el código a mano), eso ya requiere un backend/base de
  datos — es un paso distinto al de esta versión estática.


---

## Diseño actual: "Oscuro premium"

El sitio usa el diseño **Oscuro premium** (negro, líneas finas y un acento celeste), con **modo oscuro y modo claro**.

- **Modo oscuro / claro:** el botón de luna/sol del encabezado cambia de modo. La primera vez se usa el modo del dispositivo del visitante; después se guarda su elección. Lo maneja `js/theme-init.js` (el modo inicial) y `js/theme.js` (el botón), como antes.
- **Luces del modo claro ("Amanecer"):** en modo claro, el hero, el panel "Queremos que tu negocio sea parte" y el footer son blancos con un resplandor rojo-rosa que sube desde abajo. En modo oscuro esas mismas zonas son negras, sin luces. Las luces se ajustan con las variables `--luz-hero`, `--luz-box`, `--luz-footer`, `--luz-acento`, `--luz-borde` y `--luz-sombra` (al final de `css/styles.css`, bloque `MODO CLARO: LUCES DIFUSAS "AMANECER"`). El footer lleva dos logos: el blanco (modo oscuro) y el a color (modo claro); el CSS muestra el que corresponde.
- **Siempre oscuros, en ambos modos:** la tarjeta de foto del spotlight y la tarjeta de la cédula, para que contrasten.
- **Tipografías:** Manrope (títulos y texto) y JetBrains Mono (etiquetas de categoría y secciones). Se cargan desde Google Fonts en `index.html` y `ficha.html`. Poppins se sigue usando solo en la marca "infoNEGOCIOS".
- **Dónde está:** al final de `css/styles.css`, en el bloque `DISEÑO "OSCURO PREMIUM"` (modo oscuro) y su `VARIANTE CLARA`. Todo depende de `data-tema="dk"` en la etiqueta `<html>`.
- **Colores por categoría:** cada categoría recibe un puntito de color automático (`tonoDeCategoria()` en `js/app.js`). Si agregás una categoría nueva en `js/mipymes-data.js`, toma su color sola.
- **Volver al diseño anterior:** sacar `data-tema="dk"` de la etiqueta `<html>` en `index.html` y `ficha.html`. El resto del código no cambia.


---

## SEO (para que Google y las redes muestren bien el sitio)

**Ícono de la pestaña:** el logo de Impulsa Mipymes (la "i" y la "m" sobre rojo de marca) está en `favicon.ico` y en `assets/favicon/` (tamaños para pestaña, iPhone, Android y Google). Se enlaza en el `<head>` de `index.html` y `ficha.html`. Para cambiarlo, reemplazá esos archivos manteniendo los nombres.

**Qué tiene cada página:**
- `index.html`: título, descripción, dirección canónica, etiquetas para compartir en redes (WhatsApp, Facebook, LinkedIn, X) y datos estructurados de Google (organización, sitio y lista de mipymes). La imagen que aparece al compartir es `assets/img/og-impulsa-mipymes.jpg` (1200 × 630).
- `ficha.html`: cada ficha arma sola su título, descripción, dirección canónica, imagen para redes y datos estructurados (`LocalBusiness`) a partir de `js/mipymes-data.js`, en `js/ficha.js`. Si el link no corresponde a ninguna mipyme, se marca `noindex` para que Google no la guarde.
- Las tarjetas de la lista tienen un link real en el nombre (antes solo se podían abrir con un clic de JavaScript, y Google no las podía seguir).

**Cada vez que agregues, cambies o borres una mipyme**, corré en la carpeta del proyecto:

    node tools/generar-seo.js

Eso regenera `sitemap.xml` (la lista de páginas para Google) y la lista de enlaces de `index.html` para quienes no ejecutan JavaScript. Después subí `sitemap.xml` e `index.html`. Solo hace falta tener Node.js.

**Una sola vez:** dar de alta el sitio en Google Search Console (https://search.google.com/search-console) y enviar `https://www.impulsamipymes.com.py/sitemap.xml`.

**Otros archivos de SEO:** `robots.txt` (permite todo salvo `/admin/` y `/tools/` y avisa dónde está el sitemap), `site.webmanifest` (nombre e íconos para el celular) y `.htaccess` (compresión, caché y cabeceras de seguridad, para hosting Apache).

**Fotos:** para que el sitio cargue rápido (la velocidad cuenta para Google), las fotos deben pesar poco. Al cargar fotos nuevas conviene achicarlas a unos 1600 px de largo y 80-85 % de calidad (las de cámara pueden pesar 10 MB o más); los avatares de perfil, a unos 500 px.


**Foto de la tarjeta de la lista (marco vertical de 280 px de ancho):** el alto del marco no es fijo: depende de cuánto texto tenga la tarjeta y del ancho de la pantalla, y la proporción va de unos 0,4 a 0,6 (por ejemplo 280 × 467 en escritorio y 280 × 700 en un iPad horizontal). La imagen se recorta al centro para llenarlo, y la **altura de la foto también estira la tarjeta**: una imagen más angosta que 0,6 la hace más alta. Para un logo o una imagen con texto conviene armarla en proporción **0,6 : 1** (por ejemplo 840 × 1400 px), con el logo en el centro y que ocupe como mucho el 60 % del ancho, rodeado del mismo color de fondo.

**Foto distinta para celular en la tarjeta de la lista (opcional):** en pantallas de hasta 600 px la tarjeta pasa a una sola columna y la foto se ve entera, con su proporción original. Si la foto principal es muy vertical (como la de un logo), se puede sumar en los datos de la mipyme `productoImagenMovil: "./assets/img/<carpeta>/foto-movil.jpg"` (por ejemplo una versión cuadrada): en esas pantallas se usa esa foto y en las demás la principal. La portada rotativa siempre usa la principal. Las mipymes que no tienen este campo no cambian en nada.

**Encuadre de las fotos del carrusel de cada ficha:** el marco mide 900 × 540 px en escritorio, 690 × 450 en tablet y 350 × 330 en celular, y la foto se recorta al centro para llenarlo. Si la foto es de personas, conviene recortarla antes con una proporción de unos **1,6 : 1** (por ejemplo 1300 × 800 px), con las caras en el tercio de arriba y dejando un margen sobre la cabeza. Las caras tienen que quedar hacia el centro de la foto (no pegadas a los costados), porque en celular se recortan los lados. La foto principal (`productoImagen`) se ve en la tarjeta de la lista y en la portada, con otros marcos: para personas funciona bien una foto casi cuadrada.


---

## Publicidad (banners GIF)

Hay 7 espacios publicitarios. Todo se maneja desde **`js/ads-data.js`** (ahí está la explicación paso a paso); el código que los muestra es `js/ads.js` y no hace falta tocarlo.

| Espacio (`slot`) | Página | Medida en PC | Medida en celular | Dónde está |
|---|---|---|---|---|
| `tope` | las dos | 970 × 90 | 320 × 50 | franja arriba de todo, sobre el encabezado |
| `despues-hero` | portada | 728 × 90 | 320 × 100 | debajo de la portada |
| `sidebar` | portada | 300 × 250 | 300 × 250 | columna derecha, sobre "Empresas que apoyan a las Mipymes" |
| `en-lista` | portada | 728 × 90 | 320 × 100 | entre las tarjetas (después de la 2ª, en cada página) |
| `antes-footer` | las dos | 728 × 90 | 320 × 100 | antes del pie de página |
| `ficha-fotos` | ficha | 728 × 90 | 320 × 100 | debajo de las fotos de la mipyme |
| `ficha-contacto` | ficha | 300 × 250 | 300 × 250 | debajo del contacto |

**Para poner un banner:** guardá el GIF en `assets/ads/` (con la medida exacta y, si se puede, hasta 150 KB) y agregá un bloque en el espacio que corresponda de `js/ads-data.js`. Cada bloque tiene el nombre del anunciante, el GIF de PC y el de celular, a dónde lleva el clic, y fechas de inicio y fin opcionales (`desde`, `hasta`).

- **Fechas:** un banner fuera de fecha deja de mostrarse solo. Si un espacio se queda sin banners vigentes, desaparece (no deja un hueco).
- **Rotación:** si en un espacio hay varios banners vigentes, se elige uno al azar cada vez que alguien entra (`peso` para que uno aparezca más que otro).
- **Pausar:** `activo: false` en un banner; o `ADS_CONFIG.activos = false` para sacar toda la publicidad.
- **Avisos propios:** hoy los espacios muestran avisos de ejemplo que invitan a anunciar y llevan al WhatsApp de Infonegocios (`assets/ads/demo-*.gif`). Se reemplazan por los de cada anunciante cuando los haya.
- **Accesibilidad:** si cargás `fijo` / `fijoMovil` (una imagen quieta), la ven las personas con "reducir movimiento" activado.
- **Medición:** los enlaces llevan solos `utm_source`, `utm_medium=banner`, `utm_campaign` (el anunciante) y `utm_content` (el espacio), para que el anunciante vea las visitas en su Analytics. Si el sitio tiene Google Analytics, cada banner informa `ad_impression` y `ad_click` con el espacio y el anunciante, para armar informes.
- **Etiquetas:** todos los banners dicen "Publicidad" y llevan `rel="sponsored"`.
- **Reserva de espacio:** cada espacio mantiene su tamaño exacto aunque el GIF no haya cargado, para que la página no se mueva.


---

## Guía de mipymes (directorio gratuito)

Una lista de nombres de mipymes que **no pagaron** por aparecer, agrupadas por rubro. Cada nombre es un link a la red social que eligió el emprendedor (Instagram, Facebook, WhatsApp, TikTok o sitio web). Se ve entre "Mipymes destacadas" y la cédula, con el menú "Directorio" y un buscador.

**Importante: mientras la lista esté vacía, la sección NO se muestra** (ni el enlace "Directorio" del menú y del pie). Aparece sola con el primer nombre que cargues.

**Cómo agregar mipymes:** se cargan en **`js/directorio-data.js`**, una línea por mipyme (ahí hay una explicación paso a paso):

    { nombre: "Sabores del Chaco", rubro: "Gastronomía", red: "instagram", usuario: "sabores.del.chaco" },

- `red`: `instagram`, `facebook`, `tiktok`, `whatsapp` o `web`.
- `usuario`: el usuario sin @ (Instagram, TikTok), lo que va después de facebook.com/ (Facebook), o el número con código de país, sin + ni espacios (WhatsApp, ej. `595981123456`). Para `web` (o links largos) se usa `link: "https://..."`.
- Para no equivocarte, abrí **`admin/generador-directorio.html`**: completás los datos, te muestra el link que se va a abrir y arma la línea lista para pegar.
- El orden de la lista no importa (la web ordena de la A a la Z). Para sacar una mipyme, se borra su línea.
- Los rubros están en `DIRECTORIO_RUBROS` (arriba de ese mismo archivo). Un rubro nuevo se crea solo con usarlo.
- Las líneas mal cargadas (sin nombre o rubro, o con un link inválido) **no se muestran**; la consola del navegador (F12) dice cuál se omitió y por qué.

**Para probar cómo queda llena:** copiá las líneas de `tools/directorio-ejemplo.js` (son nombres inventados) dentro de `DIRECTORIO_DATA`, mirá la web y **volvé a vaciar la lista antes de publicar**.

**Reglas que ya cumple la guía:**
- Todos los links se abren en una pestaña nueva con `rel="nofollow noopener noreferrer"` (no son pagos y no avalamos esas páginas).
- Solo se aceptan links `http://` y `https://`: cualquier otra cosa (por ejemplo `javascript:`) se rechaza. El texto de los nombres nunca se interpreta como código.
- Si el sitio tiene Google Analytics, cada clic se informa como `directorio_click` (con nombre, rubro y red).
- Al final de la sección hay dos invitaciones: **"Quiero estar en la guía"** (abre tu WhatsApp con un mensaje armado, editable en `mensajeQuieroEstarEnLaGuia` de `js/config.js`) y **"Conocé cómo aparecer destacada"** (lleva a "participar").
- Se ven 14 nombres al principio y el resto con "Ver las N mipymes restantes" (se cambia en `filasIniciales`); con búsqueda o filtros se ven todos.

**Después de cargar mipymes**, corré `node tools/generar-seo.js`: además del sitemap, actualiza la versión de la guía "sin JavaScript" (la que leen algunos buscadores).


---

## Mipyme verificada (la palomita azul)

Un sello azul con tilde, como el de las redes sociales, que identifica a las **mipymes que pagaron por estar destacadas**.

**La regla:**
- **Toda mipyme que está en `js/mipymes-data.js` (las destacadas) lleva la palomita**, sin hacer nada. En su bloque figura `verificada: true`, y si te olvidás de la línea, también la lleva.
- Si alguna vez una destacada **no** debe llevarla, se escribe `verificada: false`.
- **En la guía de mipymes**, una fila lleva la palomita cuando esa mipyme también está en destacadas (se comparan los **nombres**, sin importar mayúsculas, tildes ni espacios de más). Las que están **solo en la guía** (la lista gratuita) **nunca** la llevan, aunque se escriba `verificada: true` en su línea.
- **Las destacadas entran solas a la guía:** si una destacada todavía no está cargada en `js/directorio-data.js`, aparece igual, con su palomita y el link de su Instagram (o su WhatsApp si no tiene). No hace falta cargarla dos veces. Se ubica en el rubro que diga la tabla `DIRECTORIO_EQUIVALENCIAS_RUBRO` de `js/directorio-data.js` (por ejemplo, "Servicios contables empresariales" → "Servicios contables"), o en un rubro con el nombre de su categoría. Una destacada puede traer `rubroGuia: "..."` para elegir el rubro. Para que **no** entren solas: `incluirDestacadas: false` en `DIRECTORIO_CONFIG`.

**Dónde aparece (sola, junto al nombre):** la portada rotativa, las tarjetas de "Mipymes destacadas", la ficha de la mipyme y la guía de mipymes (también al buscar o filtrar).

**Globo de ayuda:** al pasar el mouse (o al tocarla, o llegar con el teclado) dice «Mipyme verificada por Infonegocios». Para cambiar ese texto, agregá en `js/config.js`: `textoMipymeVerificada: "tu texto",`. Los lectores de pantalla la leen como «Mipyme verificada».

**Dónde está el diseño:** el dibujo y la lógica, en `js/verificada.js`; los colores y el tamaño, al final de `css/styles.css` (bloque `PALOMITA DE "MIPYME VERIFICADA"`, variables `--verif-fondo` y `--verif-tilde`). Se cambia en un solo lugar y vale para los cuatro sitios. La regla de la guía, en `js/directorio-enlaces.js`.

**Importante:** "verificada" le dice al público que alguien comprobó que el negocio es real. Conviene definir qué se revisa antes de dar la palomita (por ejemplo, Cédula Mipyme y contacto comprobado) y mantenerlo.


---

## Orden de las mipymes destacadas (turnos parejos)

Las mipymes de "Mipymes destacadas" **rotan por turnos**: cada día todas se corren un lugar hacia arriba y la que estaba primera pasa al final. Con 10 mipymes y 3 por página, cada una está en la primera página 3 de cada 10 días, y a lo largo de 10 días pasa exactamente una vez por cada posición. Es un reparto exacto, sin suerte de por medio.

**Cómo funciona:**
- **El día cambia a las 00:00 de Paraguay**, sin importar desde dónde se mire la web.
- **Todos los visitantes ven el mismo orden durante todo el día.**
- **El orden no cambia mientras alguien está mirando:** se calcula al abrir la página, por eso la página 2 siempre sigue a la 1 (aunque pase la medianoche con la página abierta).
- **El orden base es el de `js/mipymes-data.js`.** El día de inicio abre la primera de esa lista, al día siguiente la segunda, y así.
- **La portada rotativa** arranca con la mipyme que quedó primera ese día y recorre el mismo orden.
- **No rotan:** la guía de mipymes (sigue de la A a la Z), el color de cada categoría ni la lista de mipymes que lee Google.

**Ajustes (opcionales), en `js/config.js`:**

    ordenDestacadas: "manual",      // vuelve al orden fijo de mipymes-data.js
    ordenInicio: "2026-11-02",      // el día en que abre la primera de la lista (por defecto, el 2 de noviembre de 2026)

**Para ver cómo queda otro día** (sirve para mostrarle a una mipyme cuándo va a salir primera), agregá a la dirección de la web:

    ?orden=2026-11-05      → el orden de ese día
    ?orden=manual          → el orden fijo de mipymes-data.js

Solo lo ve quien escribe la dirección: no cambia nada para el público.

**Al agregar o sacar una mipyme:** la vuelta completa pasa a tener otra cantidad de días (por ejemplo, 11 en vez de 10) y el orden de ese día se reacomoda. A partir de ahí el reparto vuelve a ser exacto en cada vuelta. Una mipyme nueva se agrega al final de `mipymes-data.js` y entra sola a los turnos.

**Qué no hace:** no ordena por clics ni por plan de pago. Si más adelante se quiere dar más presencia a algún plan, se puede hacer con turnos (por ejemplo, que entre dos veces por vuelta) y no con sorteo, para que el reparto siga siendo previsible.


---

## Buscador, páginas por rubro y ciudad, y vista previa en WhatsApp

### 1) Buscador y filtros (arriba de "Mipymes destacadas")
Una sola búsqueda para toda la página: buscador de texto, filtro por **rubro** y filtro por **ciudad**. Filtra a la vez las tarjetas de las destacadas y la guía de mipymes.

- **Busca por palabras sueltas, en cualquier orden y sin importar tildes ni mayúsculas:** "asuncion gastronomia" encuentra las mipymes de gastronomía de Asunción. Busca en el nombre, rubro, ciudad y (en las destacadas) en la descripción.
- **Los contadores acompañan lo que elegiste:** si elegís "Asunción", cada rubro muestra cuántas mipymes tiene *en Asunción*. Las opciones sin resultados quedan apagadas.
- **Queda en la dirección de la web:** `?q=luna&rubro=Gastronomía&ciudad=Asunción`. Sirve para compartir una búsqueda con un link.
- **El orden por turnos se mantiene** dentro de lo que se filtra.
- **La ciudad de cada mipyme:** las destacadas la toman de su `ubicacion` (lo que va antes de la coma: "Asunción, Paraguay" → Asunción). Las de la guía gratuita pueden tener un campo opcional `ciudad` en `js/directorio-data.js` (el generador de la guía, `admin/generador-directorio.html`, tiene el casillero). Las que no tienen ciudad aparecen igual, salvo cuando se filtra por una ciudad.

### 2) Páginas fijas por mipyme (vista previa en WhatsApp)
WhatsApp, Facebook, X y LinkedIn no ejecutan JavaScript: para mostrar la foto y el nombre al compartir un link, leen el HTML tal cual. Por eso cada mipyme destacada tiene **su propia página fija en `mipymes/<nombre>/`**, igual a la ficha pero con su título, descripción e imagen escritos en el HTML.

- La web, el sitemap y los links nuevos apuntan a esa página. Los links viejos (`ficha.html?mipyme=...`) siguen funcionando y llevan solos a la página nueva.
- **La imagen de la vista previa** (1200×630) se guarda en `assets/og/<nombre>.jpg`. Se crea con `admin/imagen-compartir.html`: elegís la mipyme, descargás la imagen y la guardás en esa carpeta. Si una mipyme no tiene la suya, se usa su foto principal.
- **WhatsApp guarda una copia de cada link** durante un tiempo: si cambiás la imagen y el link ya se había compartido, puede seguir mostrando la vieja un rato. Para ver el cambio al instante, pegá el link con algo extra al final (por ejemplo `?v=2`).

### 3) Páginas por rubro y por ciudad
`rubros/gastronomia/`, `ciudades/asuncion/` y `rubros/gastronomia/asuncion/`: la lista de mipymes de cada rubro, ciudad y combinación. Sirven para que Google las encuentre ("gastronomía en Asunción") y para compartir un link directo.

- Las destacadas van primero (con la **rotación por turnos** de la portada) y después las de la guía, de la A a la Z.
- Una combinación rubro + ciudad solo se arma con 2 mipymes o más.
- **Una página con una sola mipyme se puede visitar, pero no se le pide a Google que la guarde** (`noindex`, y no entra al sitemap). Apenas tiene 2 mipymes, pasa a ser indexable sola.
- En la portada, debajo del buscador, hay enlaces "Por rubro" y "Por ciudad" a todas estas páginas. Cada ficha enlaza a las de su rubro y ciudad.

### Cómo se actualiza todo
Cada vez que agregues, cambies o borres una mipyme o un nombre de la guía:

    node tools/generar-seo.js

Después subí **todo** lo que cambió (`git add .`, commit y push): `index.html`, `sitemap.xml`, `js/paginas-generadas.js` y las carpetas `mipymes/`, `rubros/` y `ciudades/`.

- Las carpetas `mipymes/`, `rubros/` y `ciudades/` las maneja por completo el script: se borran y se escriben de nuevo cada vez. **No las edites a mano.** Si una de esas carpetas ya existiera y no la hubiera creado el script, no se borra: avisa y se detiene.
- **Si cambiás `ficha.html`, `css/` o `js/`, volvé a correr el script.** Las páginas generadas copian los números de versión de esos archivos (`?v=...`); sin volver a generarlas, los navegadores podrían seguir usando una copia vieja hasta 7 días.
- **Si te olvidás de correr el script** después de cargar una mipyme nueva, no se rompe nada: su tarjeta enlaza a la ficha de siempre (`ficha.html?mipyme=...`) y funciona igual; solo que sin vista previa propia en WhatsApp hasta que corras el script.

