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

