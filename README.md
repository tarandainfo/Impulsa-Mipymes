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
