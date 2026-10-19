#!/usr/bin/env node
// ==========================================
// GENERAR-SEO.JS
// ==========================================
//
// Actualiza, a partir de js/mipymes-data.js:
//
//   1) sitemap.xml            → la lista de páginas que se le da a Google
//   2) la lista "sin JavaScript" al final de index.html
//      (entre las marcas SEO:LISTA-INICIO y SEO:LISTA-FIN), que les
//      muestra los links de cada ficha a los buscadores y a las
//      redes que no ejecutan JavaScript.
////   3) la guía de mipymes "sin JavaScript" (entre las marcas
//      SEO:DIRECTORIO-INICIO y SEO:DIRECTORIO-FIN), armada con lo que
//      haya en js/directorio-data.js.
//
// CÓMO USARLO (cada vez que agregues, cambies o borres una mipyme,
// o un nombre de la guía):
//
//     node tools/generar-seo.js
//
// Después subí los archivos cambiados (sitemap.xml e index.html).
// No necesita instalar nada: solo tener Node.js.
// ==========================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RAIZ = path.resolve(__dirname, "..");
const SITIO = "https://www.impulsamipymes.com.py";

// ---------- leer las mipymes ----------
const codigo = fs.readFileSync(path.join(RAIZ, "js", "mipymes-data.js"), "utf8");
let mipymes;

try {
    mipymes = vm.runInNewContext(codigo + "\n;MIPYMES_DATA");
} catch (error) {
    console.error("No se pudo leer js/mipymes-data.js:", error.message);
    process.exit(1);
}

if (!Array.isArray(mipymes) || !mipymes.length) {
    console.error("js/mipymes-data.js no tiene mipymes cargadas.");
    process.exit(1);
}

// Mismo cálculo que crearSlug() en js/app.js y js/ficha.js
function crearSlug(texto) {
    return texto
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function escaparHtml(t) {
    return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function escaparXml(t) {
    return escaparHtml(t).replace(/'/g, "&apos;");
}

const hoy = new Date().toISOString().slice(0, 10);

// ---------- 1) sitemap.xml ----------
const urls = [{ loc: `${SITIO}/`, prioridad: "1.0" }].concat(
    mipymes.map(function (m) {
        return { loc: `${SITIO}/ficha.html?mipyme=${crearSlug(m.nombre)}`, prioridad: "0.8" };
    })
);

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
console.log(`sitemap.xml actualizado: ${urls.length} páginas (la portada y ${mipymes.length} fichas).`);

// ---------- 2) lista "sin JavaScript" en index.html ----------
const archivoIndex = path.join(RAIZ, "index.html");
let html = fs.readFileSync(archivoIndex, "utf8");
const INICIO = "<!-- SEO:LISTA-INICIO -->";
const FIN = "<!-- SEO:LISTA-FIN -->";

if (html.includes(INICIO) && html.includes(FIN)) {

    const items = mipymes.map(function (m) {
        const detalle = [m.categoria, m.ubicacion].filter(Boolean).join(" · ");
        return `                    <li><a href="ficha.html?mipyme=${crearSlug(m.nombre)}">${escaparHtml(m.nombre.trim())}</a>${detalle ? " — " + escaparHtml(detalle) : ""}</li>`;
    }).join("\n");

    const bloque = `${INICIO}
        <noscript>
            <section class="container" style="padding: 40px 0;">
                <h2>Mipymes de Paraguay</h2>
                <ul>
${items}
                </ul>
                <p>Activá JavaScript para ver el sitio completo.</p>
            </section>
        </noscript>
        ${FIN}`;

    const re = new RegExp(INICIO.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "[\\s\\S]*?" + FIN.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
    html = html.replace(re, bloque);
    fs.writeFileSync(archivoIndex, html, "utf8");
    console.log(`index.html actualizado: lista sin JavaScript con ${mipymes.length} mipymes.`);

} else {

    console.warn("index.html no tiene las marcas SEO:LISTA-INICIO / SEO:LISTA-FIN; se omitió la lista sin JavaScript.");

}


// ---------- 3) guía de mipymes "sin JavaScript" en index.html ----------
(function () {

    const INICIO_D = "<!-- SEO:DIRECTORIO-INICIO -->";
    const FIN_D = "<!-- SEO:DIRECTORIO-FIN -->";

    let html2 = fs.readFileSync(archivoIndex, "utf8");

    if (!html2.includes(INICIO_D) || !html2.includes(FIN_D)) {
        console.warn("index.html no tiene las marcas SEO:DIRECTORIO-INICIO / SEO:DIRECTORIO-FIN; se omitió la guía sin JavaScript.");
        return;
    }

    let enlaces;
    let datos;

    try {
        enlaces = require(path.join(RAIZ, "js", "directorio-enlaces.js"));
        datos = vm.runInNewContext(
            fs.readFileSync(path.join(RAIZ, "js", "directorio-data.js"), "utf8") +
            "\n;({ rubros: DIRECTORIO_RUBROS, datos: DIRECTORIO_DATA })"
        );
    } catch (error) {
        console.error("No se pudo leer la guía (js/directorio-data.js):", error.message);
        return;
    }

    const resultado = enlaces.normalizarEntradas(datos.datos, datos.rubros);

    resultado.omitidas.forEach(function (o) {
        console.warn("[Guía] Se omitió «" + o.nombre + "»: " + o.motivo);
    });

    let bloque;

    if (!resultado.entradas.length) {

        // Sin nombres: no se escribe nada (la sección tampoco se ve en la web)
        bloque = `${INICIO_D}\n        ${FIN_D}`;

    } else {

        const grupos = resultado.rubros.map(function (rubro) {

            const items = enlaces.ordenar(resultado.entradas.filter(function (e) { return e.rubro === rubro; }))
                .map(function (e) {
                    return `                        <li><a href="${escaparHtml(e.url)}" target="_blank" rel="nofollow noopener noreferrer">${escaparHtml(e.nombre)}</a> — ${escaparHtml(enlaces.REDES[e.red].nombre)}</li>`;
                }).join("\n");

            return `                    <h3>${escaparHtml(rubro)}</h3>\n                    <ul>\n${items}\n                    </ul>`;

        }).join("\n");

        bloque = `${INICIO_D}
        <noscript>
            <section class="container" style="padding: 40px 0;">
                <h2>Guía de mipymes</h2>
                <div>
${grupos}
                </div>
            </section>
        </noscript>
        ${FIN_D}`;

    }

    const re2 = new RegExp(INICIO_D.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "[\\s\\S]*?" + FIN_D.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));

    html2 = html2.replace(re2, bloque);
    fs.writeFileSync(archivoIndex, html2, "utf8");

    console.log(resultado.entradas.length
        ? `index.html actualizado: guía sin JavaScript con ${resultado.entradas.length} mipymes en ${resultado.rubros.length} rubros.`
        : "index.html: la guía está vacía (no se muestra nada).");

})();

