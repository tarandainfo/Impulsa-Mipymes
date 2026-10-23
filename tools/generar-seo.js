#!/usr/bin/env node
// ==========================================
// GENERAR-SEO.JS
// ==========================================
//
// Se corre cada vez que agregues, cambies o borres una mipyme (o un nombre
// de la guía). Actualiza, a partir de js/mipymes-data.js y js/directorio-data.js:
//
//   1) Una página fija por mipyme destacada: mipymes/<nombre>/
//      (con su propia vista previa al compartir el link por WhatsApp).
//   2) Las páginas por rubro, por ciudad y por rubro + ciudad:
//      rubros/..., ciudades/...  ("Gastronomía en Asunción").
//   3) sitemap.xml            → la lista de páginas que se le da a Google
//   4) js/paginas-generadas.js → qué páginas fijas existen
//   5) en index.html, entre las marcas:
//        SEO:LISTA-INICIO / FIN        la lista "sin JavaScript" de fichas
//        SEO:DIRECTORIO-INICIO / FIN   la guía "sin JavaScript"
//        SEO:EXPLORAR-INICIO / FIN     los enlaces "Explorá por rubro y ciudad"
//
// CÓMO USARLO:
//
//     node tools/generar-seo.js
//
// Después subí TODO lo que haya cambiado (git add . / commit / push): además
// de sitemap.xml e index.html, las carpetas mipymes/, rubros/ y ciudades/ y
// el archivo js/paginas-generadas.js.
//
// No necesita instalar nada: solo tener Node.js.
// ==========================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");
const SITIO = "https://www.impulsamipymes.com.py";

const enlaces = require(path.join(RAIZ, "js", "directorio-enlaces.js"));
const crearSlug = enlaces.crearSlug;

function escaparHtml(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escaparXml(t) {
    return escaparHtml(t).replace(/'/g, "&apos;");
}

function escaparRegex(t) {
    return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

// Reemplaza lo que hay entre dos marcas de index.html
function reemplazarEntreMarcas(html, inicio, fin, bloque) {
    return html.replace(new RegExp(escaparRegex(inicio) + "[\\s\\S]*?" + escaparRegex(fin)), function () { return bloque; });
}

// ---------- leer los datos ----------
let mipymes;

try {
    mipymes = vm.runInNewContext(fs.readFileSync(path.join(RAIZ, "js", "mipymes-data.js"), "utf8") + "\n;MIPYMES_DATA");
} catch (error) {
    console.error("No se pudo leer js/mipymes-data.js:", error.message);
    process.exit(1);
}

if (!Array.isArray(mipymes) || !mipymes.length) {
    console.error("js/mipymes-data.js no tiene mipymes cargadas.");
    process.exit(1);
}

let datos;

try {
    datos = vm.runInNewContext(
        fs.readFileSync(path.join(RAIZ, "js", "directorio-data.js"), "utf8") +
        "\n;({ rubros: DIRECTORIO_RUBROS, datos: DIRECTORIO_DATA, config: (typeof DIRECTORIO_CONFIG !== 'undefined' ? DIRECTORIO_CONFIG : {}), equivalencias: (typeof DIRECTORIO_EQUIVALENCIAS_RUBRO !== 'undefined' ? DIRECTORIO_EQUIVALENCIAS_RUBRO : {}) })"
    );
} catch (error) {
    console.error("No se pudo leer la guía (js/directorio-data.js):", error.message);
    process.exit(1);
}

// Las destacadas (las que pagaron) llevan la palomita y entran solas a la guía
const resultado = enlaces.normalizarEntradas(datos.datos, datos.rubros, {
    mipymes: mipymes,
    incluir: datos.config.incluirDestacadas !== false,
    equivalencias: datos.equivalencias
});

resultado.omitidas.forEach(function (o) {
    console.warn("[Guía] Se omitió «" + o.nombre + "»: " + o.motivo);
});

const hoy = new Date().toISOString().slice(0, 10);


// ---------- 1 y 2) las páginas fijas ----------
let paginas;

try {
    paginas = require("./paginas.js")({ RAIZ: RAIZ, SITIO: SITIO, mipymes: mipymes, resultado: resultado, enlaces: enlaces, escaparHtml: escaparHtml });
} catch (error) {
    console.error("No se pudieron generar las páginas:", error.message);
    process.exit(1);
}

const indexables = paginas.paginasLanding.filter(function (p) { return !p.noindex; });
const finas = paginas.paginasLanding.filter(function (p) { return p.noindex; });

console.log(`Páginas generadas: ${paginas.fichas.length} fichas (mipymes/), ${paginas.paginasLanding.length} páginas por rubro y ciudad.`);

if (finas.length) {
    console.log(`  ${finas.length} página(s) por rubro o ciudad tienen una sola mipyme: se pueden visitar, pero no se le piden a Google hasta que tengan más (${finas.map(function (p) { return p.ruta; }).join(", ")}).`);
}


// ---------- 3) sitemap.xml ----------
const urls = [{ loc: SITIO + "/", prioridad: "1.0" }]
    .concat(paginas.fichas.map(function (slug) { return { loc: SITIO + "/mipymes/" + slug + "/", prioridad: "0.8" }; }))
    .concat(indexables.map(function (p) { return { loc: SITIO + "/" + p.ruta, prioridad: p.prioridad }; }));

const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(function (u) {
        return `  <url>\n    <loc>${escaparXml(u.loc)}</loc>\n    <lastmod>${hoy}</lastmod>\n    <priority>${u.prioridad}</priority>\n  </url>`;
    }),
    "</urlset>",
    ""
].join("\n");

fs.writeFileSync(path.join(RAIZ, "sitemap.xml"), sitemap, "utf8");
console.log(`sitemap.xml actualizado: ${urls.length} páginas (la portada, ${paginas.fichas.length} fichas y ${indexables.length} páginas por rubro y ciudad).`);


// ---------- 4 y 5) index.html y ficha.html ----------
const archivoIndex = path.join(RAIZ, "index.html");
const archivoFicha = path.join(RAIZ, "ficha.html");
let html = fs.readFileSync(archivoIndex, "utf8");

// el número de versión de js/paginas-generadas.js (cambia solo cuando cambia el archivo)
[archivoIndex, archivoFicha].forEach(function (archivo) {

    let contenido = archivo === archivoIndex ? html : fs.readFileSync(archivo, "utf8");

    contenido = contenido.replace(/(\.\/js\/paginas-generadas\.js\?v=)[0-9a-z\-]+/, "$1" + paginas.version);

    if (archivo === archivoIndex) html = contenido;
    else fs.writeFileSync(archivo, contenido, "utf8");

});

// La dirección de cada ficha: la página fija si existe
function direccionFicha(m) {

    const slug = crearSlug(m.nombre);

    return paginas.fichas.indexOf(slug) >= 0 ? "mipymes/" + slug + "/" : "ficha.html?mipyme=" + slug;

}

// ----- lista "sin JavaScript" de fichas -----
(function () {

    const INICIO = "<!-- SEO:LISTA-INICIO -->";
    const FIN = "<!-- SEO:LISTA-FIN -->";

    if (!html.includes(INICIO) || !html.includes(FIN)) {
        console.warn("index.html no tiene las marcas SEO:LISTA-INICIO / SEO:LISTA-FIN; se omitió la lista sin JavaScript.");
        return;
    }

    const items = mipymes.map(function (m) {
        const detalle = [m.categoria, m.ubicacion].filter(Boolean).join(" · ");
        return `                    <li><a href="${direccionFicha(m)}">${escaparHtml(m.nombre.trim())}</a>${detalle ? " — " + escaparHtml(detalle) : ""}</li>`;
    }).join("\n");

    html = reemplazarEntreMarcas(html, INICIO, FIN, `${INICIO}
        <noscript>
            <section class="container" style="padding: 40px 0;">
                <h2>Mipymes de Paraguay</h2>
                <ul>
${items}
                </ul>
                <p>Activá JavaScript para ver el sitio completo.</p>
            </section>
        </noscript>
        ${FIN}`);

    console.log(`index.html actualizado: lista sin JavaScript con ${mipymes.length} mipymes.`);

})();

// ----- guía de mipymes "sin JavaScript" -----
(function () {

    const INICIO = "<!-- SEO:DIRECTORIO-INICIO -->";
    const FIN = "<!-- SEO:DIRECTORIO-FIN -->";

    if (!html.includes(INICIO) || !html.includes(FIN)) {
        console.warn("index.html no tiene las marcas SEO:DIRECTORIO-INICIO / SEO:DIRECTORIO-FIN; se omitió la guía sin JavaScript.");
        return;
    }

    let bloque;

    if (!resultado.entradas.length) {

        // Sin nombres: no se escribe nada (la sección tampoco se ve en la web)
        bloque = `${INICIO}\n        ${FIN}`;

    } else {

        const grupos = resultado.rubros.map(function (rubro) {

            const items = enlaces.ordenar(resultado.entradas.filter(function (e) { return e.rubro === rubro; }))
                .map(function (e) {
                    return `                        <li><a href="${escaparHtml(e.url)}" target="_blank" rel="nofollow noopener noreferrer">${escaparHtml(e.nombre)}</a>${e.verificada ? " (mipyme verificada)" : ""}${e.ciudad ? " — " + escaparHtml(e.ciudad) : ""} — ${escaparHtml(enlaces.REDES[e.red].nombre)}</li>`;
                }).join("\n");

            return `                    <h3>${escaparHtml(rubro)}</h3>\n                    <ul>\n${items}\n                    </ul>`;

        }).join("\n");

        bloque = `${INICIO}
        <noscript>
            <section class="container" style="padding: 40px 0;">
                <h2>Guía de mipymes</h2>
                <div>
${grupos}
                </div>
            </section>
        </noscript>
        ${FIN}`;

    }

    html = reemplazarEntreMarcas(html, INICIO, FIN, bloque);

    console.log(resultado.entradas.length
        ? `index.html actualizado: guía sin JavaScript con ${resultado.entradas.length} mipymes en ${resultado.rubros.length} rubros.`
        : "index.html: la guía está vacía (no se muestra nada).");

})();

// ----- "Explorá por rubro y ciudad" (enlaces a las páginas por rubro y ciudad) -----
(function () {

    const INICIO = "<!-- SEO:EXPLORAR-INICIO -->";
    const FIN = "<!-- SEO:EXPLORAR-FIN -->";

    if (!html.includes(INICIO) || !html.includes(FIN)) {
        console.warn("index.html no tiene las marcas SEO:EXPLORAR-INICIO / SEO:EXPLORAR-FIN; se omitieron los enlaces por rubro y ciudad.");
        return;
    }

    const enlace = function (x) { return `<a href="${x.ruta}">${escaparHtml(x.nombre)}</a>`; };
    const conRuta = function (x) { return x.ruta; };

    const filas = [];

    if (paginas.rubros.filter(conRuta).length) filas.push(`                        <p><strong>Por rubro</strong> ${paginas.rubros.filter(conRuta).map(enlace).join(" ")}</p>`);
    if (paginas.ciudades.filter(conRuta).length) filas.push(`                        <p><strong>Por ciudad</strong> ${paginas.ciudades.filter(conRuta).map(enlace).join(" ")}</p>`);

    const bloque = filas.length
        ? `${INICIO}
                    <nav class="buscador-explorar" aria-label="Explorar por rubro y por ciudad">
${filas.join("\n")}
                    </nav>
                    ${FIN}`
        : `${INICIO}\n                    ${FIN}`;

    html = reemplazarEntreMarcas(html, INICIO, FIN, bloque);

    console.log(`index.html actualizado: enlaces para explorar por rubro (${paginas.rubros.length}) y por ciudad (${paginas.ciudades.length}).`);

})();

fs.writeFileSync(archivoIndex, html, "utf8");
