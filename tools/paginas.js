// ==========================================
// PAGINAS.JS — arma las páginas fijas del sitio
// ==========================================
//
// Lo usa tools/generar-seo.js (no se corre solo). Genera:
//
//   1) mipymes/<nombre>/index.html
//        Una página fija por mipyme destacada. Es igual a ficha.html, pero con
//        el título, la descripción y la imagen de ESA mipyme escritos en el
//        HTML. Eso es lo que lee WhatsApp (y Facebook, X, LinkedIn…) para
//        mostrar la vista previa al compartir el link: esas apps no ejecutan
//        JavaScript, por eso la ficha dinámica de siempre no alcanza.
//
//   2) rubros/<rubro>/index.html            "Gastronomía en Paraguay"
//      ciudades/<ciudad>/index.html         "Mipymes en Asunción"
//      rubros/<rubro>/<ciudad>/index.html   "Gastronomía en Asunción"
//        Páginas con la lista de mipymes de cada rubro, ciudad o combinación.
//        Sirven para que Google las encuentre ("gastronomía en Asunción") y
//        para compartir un link directo a un rubro o una ciudad.
//
//   3) js/paginas-generadas.js
//        La lista de páginas que existen, para que la web enlace a ellas
//        solo cuando ya están armadas.
//
// Las carpetas mipymes/, rubros/ y ciudades/ las maneja por completo este
// script: se borran y se vuelven a escribir en cada corrida. No editar a mano.
// ==========================================

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const crypto = require("crypto");

// Una página con menos mipymes que esto se arma igual (se puede visitar), pero
// le pedimos a Google que no la guarde ("noindex") hasta que tenga más contenido.
const MINIMO_PARA_GOOGLE = 2;

// Una combinación rubro + ciudad solo se arma si tiene al menos tantas mipymes.
const MINIMO_COMBINADA = 2;

const CARPETAS_GENERADAS = ["mipymes", "rubros", "ciudades"];
const MARCA = "LEEME-GENERADO.txt";


module.exports = function generarPaginas(ctx) {

    const { RAIZ, SITIO, mipymes, resultado, enlaces, escaparHtml } = ctx;
    const crearSlug = enlaces.crearSlug;

    const leer = function (rel) { return fs.readFileSync(path.join(RAIZ, rel), "utf8"); };
    const existe = function (rel) { return fs.existsSync(path.join(RAIZ, rel)); };

    // ---------- piezas comunes ----------

    // El texto de ayuda de la palomita (el mismo de js/verificada.js / config.js)
    let textoAyuda = "Mipyme verificada por Infonegocios";

    try {
        const config = vm.runInNewContext(leer("js/config.js") + "\n;INFONEGOCIOS_CONFIG");
        if (config && config.textoMipymeVerificada) textoAyuda = config.textoMipymeVerificada;
    } catch (error) { /* se usa el texto de siempre */ }

    // El dibujo de la palomita sale de js/verificada.js, así hay un solo diseño en todo el sitio
    const dibujo = (leer("js/verificada.js").match(/class="verif-fondo" d="([^"]+)"/) || [])[1];

    if (!dibujo) throw new Error("No se encontró el dibujo de la palomita en js/verificada.js");

    function palomita(conFoco) {

        return '<span class="verif" data-tip="' + escaparHtml(textoAyuda) + '"' + (conFoco ? ' tabindex="0"' : "") +
            ' role="img" aria-label="Mipyme verificada"><svg viewBox="0 0 24 24" aria-hidden="true">' +
            '<path class="verif-fondo" d="' + dibujo + '"/>' +
            '<path class="verif-tilde" d="M7.4 12.6l3 3.1 6.2-7" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';

    }

    function recortar(texto, maximo) {

        const t = String(texto || "").replace(/\s+/g, " ").trim();

        if (t.length <= maximo) return t;

        const corte = t.lastIndexOf(" ", maximo - 1);

        return t.slice(0, corte > 60 ? corte : maximo - 1).replace(/[\s,.;:–-]+$/, "") + "…";

    }

    function urlAbsoluta(ruta) {

        try {
            return new URL(ruta, SITIO + "/").href;
        } catch (error) {
            return "";
        }

    }

    function jsonLd(datos) {

        // "<" se escribe como \u003c para que nada dentro del texto pueda cerrar el <script>
        return '<script type="application/ld+json" id="@ID@">\n' + JSON.stringify(datos, null, 2).replace(/</g, "\\u003c") + "\n    </script>";

    }

    function marcar(rel) {

        return "Esta carpeta la genera tools/generar-seo.js a partir de js/mipymes-data.js y js/directorio-data.js.\n" +
            "NO la edites a mano: se borra y se vuelve a escribir cada vez que se corre el script.\n";

    }

    // ---------- trabajar sobre el HTML de ficha.html ----------

    const plantilla = leer("ficha.html");

    function unico(texto, regex, reemplazo, nombre) {

        const coincidencias = texto.match(new RegExp(regex.source, regex.flags.replace("g", "") + "g")) || [];

        if (coincidencias.length !== 1) {
            throw new Error("ficha.html cambió y no se pudo armar la página: «" + nombre + "» aparece " + coincidencias.length + " veces (tendría que aparecer 1). Avisá para ajustar tools/paginas.js.");
        }

        return texto.replace(regex, function () { return typeof reemplazo === "function" ? reemplazo.apply(null, arguments) : reemplazo; });

    }

    function ponerMeta(html, clave, valor) {

        const re = new RegExp('(<meta (?:property|name)="' + clave.replace(/[:]/g, ":") + '" content=")[^"]*(">)');

        return unico(html, re, function (_, a, b) { return a + escaparHtml(valor) + b; }, "meta " + clave);

    }

    function quitarMeta(html, clave) {

        const re = new RegExp('[ \\t]*<meta (?:property|name)="' + clave + '" content="[^"]*">\\n');

        return unico(html, re, "", "meta " + clave);

    }

    // Convierte ficha.html en una página con otros datos de SEO
    function adaptarCabecera(html, d) {

        let h = html;

        h = unico(h, /<!DOCTYPE html>/i, "<!DOCTYPE html>\n<!-- GENERADO por tools/generar-seo.js a partir de ficha.html. No editar a mano: se pisa en la próxima corrida. -->", "doctype");

        // las direcciones relativas (./css, ./js, ./assets…) siguen valiendo desde cualquier profundidad
        h = unico(h, /(<meta charset="UTF-8">)/, function (_, a) { return a + '\n\n    <base href="' + d.base + '">'; }, "meta charset");

        // el comentario de ficha.html habla de los valores genéricos: en estas páginas ya son los propios
        h = unico(h, /<!-- =+ SEO =+[\s\S]*?-->/, "<!-- ================= SEO =================\n         Título, descripción, dirección canónica, imagen para compartir y datos estructurados\n         de ESTA página, escritos por tools/generar-seo.js. -->", "comentario de SEO");

        h = unico(h, /<title>[^<]*<\/title>/, "<title>" + escaparHtml(d.titulo) + "</title>", "title");
        h = ponerMeta(h, "description", d.descripcion);
        h = unico(h, /(<meta name="robots" content=")[^"]*(">)/, function (_, a, b) { return a + d.robots + b + '\n    <link rel="canonical" href="' + escaparHtml(d.canonica) + '">'; }, "meta robots");

        h = ponerMeta(h, "og:url", d.canonica);
        h = ponerMeta(h, "og:title", d.titulo);
        h = ponerMeta(h, "og:description", d.descripcion);
        h = ponerMeta(h, "og:image", d.imagen);
        h = ponerMeta(h, "og:image:alt", d.imagenAlt);
        h = ponerMeta(h, "twitter:title", d.titulo);
        h = ponerMeta(h, "twitter:description", d.descripcion);
        h = ponerMeta(h, "twitter:image", d.imagen);
        h = ponerMeta(h, "twitter:image:alt", d.imagenAlt);

        if (!d.imagenConMedidas) {
            h = quitarMeta(h, "og:image:type");
            h = quitarMeta(h, "og:image:width");
            h = quitarMeta(h, "og:image:height");
        }

        // datos estructurados propios de esta página, justo después de los del sitio
        h = unico(h, /(<script type="application\/ld\+json" id="jsonld-sitio">[\s\S]*?<\/script>)/, function (_, a) {
            return a + "\n\n    " + jsonLd(d.estructurados).replace("@ID@", d.idEstructurados);
        }, "datos estructurados del sitio");

        return h;

    }

    function quitarScripts(html, nombres) {

        let h = html;

        nombres.forEach(function (n) {
            h = unico(h, new RegExp('[ \\t]*<script src="\\./js/' + n.replace(".", "\\.") + '\\?v=[^"]*" defer></script>\\n'), "", "script " + n);
        });

        return h;

    }

    // ---------- los datos de cada mipyme ----------

    const entradas = resultado.entradas;
    const destacadas = entradas.filter(function (e) { return e.destacada; });

    const porRubro = {};
    const porCiudad = {};
    const porCombinada = {};
    const avisos = [];

    function agrupar(mapa, clave, nombre, entrada, extra) {

        if (!mapa[clave]) mapa[clave] = Object.assign({ clave: clave, nombre: nombre, entradas: [] }, extra || {});

        // dos nombres que dan la misma dirección (por ejemplo "Moda y diseño" y "Moda & diseño") no se pueden separar
        if (mapa[clave].nombre !== nombre && avisos.indexOf(nombre) < 0) {
            avisos.push(nombre);
            console.warn("[Páginas] «" + nombre + "» y «" + mapa[clave].nombre + "» dan la misma dirección (" + clave + "): se juntan en una sola página.");
        }

        mapa[clave].entradas.push(entrada);

    }

    entradas.forEach(function (e) {

        const rs = crearSlug(e.rubro);
        const cs = e.ciudad ? crearSlug(e.ciudad) : "";

        if (rs) agrupar(porRubro, rs, e.rubro, e);
        if (cs) agrupar(porCiudad, cs, e.ciudad, e);
        if (rs && cs) agrupar(porCombinada, rs + "/" + cs, e.rubro + " en " + e.ciudad, e, { rubro: e.rubro, ciudad: e.ciudad, rs: rs, cs: cs });

    });

    // Las combinaciones con pocas mipymes no se arman
    Object.keys(porCombinada).forEach(function (k) {
        if (porCombinada[k].entradas.length < MINIMO_COMBINADA) delete porCombinada[k];
    });

    // Orden de las listas: las destacadas primero (en el orden de js/mipymes-data.js), después las de la guía de la A a la Z
    const ordenDestacadas = {};
    mipymes.forEach(function (m, i) { ordenDestacadas[crearSlug(m.nombre)] = i; });

    function ordenarGrupo(lista) {

        const dest = lista.filter(function (e) { return e.destacada; })
            .sort(function (a, b) { return ordenDestacadas[a.slug] - ordenDestacadas[b.slug]; });

        const libres = enlaces.ordenar(lista.filter(function (e) { return !e.destacada; }));

        return { destacadas: dest, libres: libres };

    }

    const rubrosOrdenados = resultado.rubros.filter(function (r) { return porRubro[crearSlug(r)]; });
    const ciudadesOrdenadas = resultado.ciudades.filter(function (c) { return porCiudad[crearSlug(c)]; });

    const paginasLanding = [];     // {ruta, noindex}

    // ---------- 1) las fichas fijas ----------

    function sacarCarpeta(nombre) {

        const dir = path.join(RAIZ, nombre);

        if (fs.existsSync(dir)) {

            if (!fs.existsSync(path.join(dir, MARCA))) {
                throw new Error("La carpeta «" + nombre + "/» ya existe y no la creó este script. Para no borrar algo tuyo, no se generaron las páginas. Si es una carpeta vieja que ya no usás, borrala o cambiale el nombre y volvé a correr el script.");
            }

            fs.rmSync(dir, { recursive: true, force: true });

        }

    }

    function escribirPagina(rutaRelativa, contenido) {

        const destino = path.join(RAIZ, rutaRelativa, "index.html");

        fs.mkdirSync(path.dirname(destino), { recursive: true });
        fs.writeFileSync(destino, contenido, "utf8");

    }

    CARPETAS_GENERADAS.forEach(sacarCarpeta);
    CARPETAS_GENERADAS.forEach(function (c) {
        fs.mkdirSync(path.join(RAIZ, c), { recursive: true });
        fs.writeFileSync(path.join(RAIZ, c, MARCA), marcar(c), "utf8");
    });

    const infoDestacadas = {};
    const sinImagenPropia = [];
    const fichasGeneradas = [];

    // qué páginas de rubro / ciudad existen (para enlazar a ellas)
    function rutaRubro(rs) { return porRubro[rs] ? "rubros/" + rs + "/" : ""; }
    function rutaCiudad(cs) { return porCiudad[cs] ? "ciudades/" + cs + "/" : ""; }
    function rutaCombinada(rs, cs) { return porCombinada[rs + "/" + cs] ? "rubros/" + rs + "/" + cs + "/" : ""; }

    const slugsVistos = {};

    destacadas.forEach(function (e) {

        const m = e.mipyme;
        const slug = e.slug;

        // dos mipymes con nombres que dan la misma dirección (por ejemplo "Hey" y "HEY!") se pisarían la página
        if (slugsVistos[slug]) {
            console.warn("[Páginas] «" + String(m.nombre).trim() + "» da la misma dirección que «" + slugsVistos[slug] + "» (" + slug + "): no se generó su página. Cambiá el nombre de una de las dos para que sean distintos.");
            return;
        }

        slugsVistos[slug] = String(m.nombre).trim();
        const nombre = String(m.nombre).trim();
        const url = SITIO + "/mipymes/" + slug + "/";

        let titulo = nombre + " | " + m.categoria + " | Impulsa Mipymes";
        if (titulo.length > 70) titulo = nombre + " | Impulsa Mipymes";

        const descripcion = recortar(m.descripcion, 155);

        // Imagen para compartir: la propia de esta mipyme (assets/og/<nombre>.jpg, de 1200×630) si existe;
        // si no, su foto principal.
        const tieneOg = existe("assets/og/" + slug + ".jpg");
        const imagen = tieneOg ? SITIO + "/assets/og/" + slug + ".jpg" : urlAbsoluta(m.productoImagen);

        if (!tieneOg) sinImagenPropia.push(nombre);

        const rs = crearSlug(e.rubro);
        const cs = e.ciudad ? crearSlug(e.ciudad) : "";

        infoDestacadas[slug] = {
            rubro: rutaRubro(rs) ? { nombre: e.rubro, ruta: rutaRubro(rs) } : null,
            ciudad: cs && rutaCiudad(cs) ? { nombre: e.ciudad, ruta: rutaCiudad(cs) } : null,
            combinada: cs && rutaCombinada(rs, cs) ? { nombre: e.rubro + " en " + e.ciudad, ruta: rutaCombinada(rs, cs) } : null
        };

        const migas = [{ "@type": "ListItem", "position": 1, "name": "Impulsa Mipymes", "item": SITIO + "/" }];

        if (infoDestacadas[slug].rubro) migas.push({ "@type": "ListItem", "position": 2, "name": e.rubro, "item": SITIO + "/" + infoDestacadas[slug].rubro.ruta });

        migas.push({ "@type": "ListItem", "position": migas.length + 1, "name": nombre, "item": url });

        const fotos = [m.productoImagen, m.perfilImagen].concat(m.fotosCarrusel || [])
            .filter(Boolean).map(urlAbsoluta)
            .filter(function (f, i, todas) { return f && todas.indexOf(f) === i; }).slice(0, 6);

        const negocio = {
            "@type": "LocalBusiness",
            "@id": url + "#negocio",
            "name": nombre,
            "description": String(m.descripcion || "").replace(/\s+/g, " ").trim(),
            "url": url,
            "image": fotos,
            "address": { "@type": "PostalAddress", "addressLocality": e.ciudad || "", "addressCountry": "PY" },
            "areaServed": { "@type": "Country", "name": "Paraguay" }
        };

        if (m.instagram) negocio.sameAs = [m.instagram];
        if (m.whatsapp && /^\d{9,15}$/.test(String(m.whatsapp))) negocio.telephone = "+" + m.whatsapp;

        let h = adaptarCabecera(plantilla, {
            base: "../../",
            titulo: titulo,
            descripcion: descripcion,
            robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
            canonica: url,
            imagen: imagen,
            imagenAlt: tieneOg ? nombre + " en Impulsa Mipymes" : "Foto de " + nombre,
            imagenConMedidas: tieneOg,
            idEstructurados: "jsonld-ficha",
            estructurados: {
                "@context": "https://schema.org",
                "@graph": [
                    { "@type": "WebPage", "@id": url, "url": url, "name": titulo, "description": descripcion, "inLanguage": "es-PY",
                      "isPartOf": { "@id": SITIO + "/#website" }, "primaryImageOfPage": { "@type": "ImageObject", "url": imagen },
                      "breadcrumb": { "@id": url + "#migas" }, "about": { "@id": url + "#negocio" } },
                    { "@type": "BreadcrumbList", "@id": url + "#migas", "itemListElement": migas },
                    negocio
                ]
            }
        });

        // la ficha le dice a ficha.js qué mipyme es (no depende de ?mipyme=)
        h = unico(h, /([ \t]*<script src="\.\/js\/config\.js\?v=[^"]*" defer><\/script>)/, function (_, a) { return '    <script>window.MIPYME_SLUG = ' + JSON.stringify(slug) + ';</script>\n' + a; }, "script config.js");

        // resumen para quien no ejecuta JavaScript (el resto lo dibuja js/ficha.js)
        const enlacesResumen = [];
        if (m.whatsapp && /^\d{9,15}$/.test(String(m.whatsapp))) enlacesResumen.push('<a href="https://wa.me/' + escaparHtml(m.whatsapp) + '" rel="noopener">WhatsApp</a>');
        if (m.instagram) enlacesResumen.push('<a href="' + escaparHtml(m.instagram) + '" rel="noopener">Instagram</a>');

        const resumen =
            '        <noscript>\n            <section class="container ficha-container">\n' +
            '                <p><a href="./index.html#mipymes">← Volver a Mipymes</a></p>\n' +
            '                <h1>' + escaparHtml(nombre) + '</h1>\n' +
            '                <p>' + escaparHtml([m.categoria, m.ubicacion].filter(Boolean).join(" · ")) + '</p>\n' +
            '                <p>' + escaparHtml(String(m.descripcion || "").trim()) + '</p>\n' +
            (enlacesResumen.length ? '                <p>' + enlacesResumen.join(" · ") + '</p>\n' : "") +
            '            </section>\n        </noscript>\n';

        h = unico(h, /(\n\s*<\/main>)/, function (_, a) { return "\n" + resumen.replace(/\s+$/, "") + a; }, "cierre de main");

        escribirPagina("mipymes/" + slug, h);
        fichasGeneradas.push(slug);

    });

    if (sinImagenPropia.length) {
        console.warn("[Páginas] " + sinImagenPropia.length + " mipyme(s) no tienen imagen propia para compartir y en WhatsApp se va a ver su foto principal: " +
            sinImagenPropia.join(", ") + ". Se crean en admin/imagen-compartir.html y se guardan en assets/og/<nombre>.jpg.");
    }

    // ---------- 2) páginas por rubro, ciudad y combinación ----------

    function itemDestacada(e) {

        const m = e.mipyme;
        const nombre = escaparHtml(String(m.nombre).trim());
        const ficha = "mipymes/" + e.slug + "/";

        const redes = [];

        if (m.whatsapp && /^\d{9,15}$/.test(String(m.whatsapp))) {
            redes.push('<a class="lp-red" href="https://wa.me/' + escaparHtml(m.whatsapp) + '" target="_blank" rel="sponsored noopener noreferrer">WhatsApp</a>');
        }

        if (m.instagram) {
            redes.push('<a class="lp-red" href="' + escaparHtml(m.instagram) + '" target="_blank" rel="sponsored noopener noreferrer">Instagram</a>');
        }

        return '                <li class="lp-item lp-item-destacada" data-destacada>\n' +
            (m.perfilImagen ? '                    <img class="lp-avatar" src="' + escaparHtml(m.perfilImagen) + '" alt="" width="56" height="56" loading="lazy">\n' : '                    <span class="lp-avatar lp-inicial" aria-hidden="true">' + escaparHtml(nombre.charAt(0)) + '</span>\n') +
            '                    <div class="lp-info">\n' +
            '                        <h2 class="lp-nombre"><a href="' + ficha + '">' + nombre + '</a>' + (e.verificada ? palomita(true) : "") + '</h2>\n' +
            '                        <p class="lp-meta">' + escaparHtml([e.rubro, e.ciudad].filter(Boolean).join(" · ")) + '</p>\n' +
            '                        <p class="lp-desc">' + escaparHtml(recortar(m.descripcion, 170)) + '</p>\n' +
            '                    </div>\n' +
            '                    <div class="lp-acciones">\n' +
            '                        <a class="btn btn-primary lp-ver" href="' + ficha + '">Ver ficha</a>\n' +
            (redes.length ? '                        <span class="lp-redes">' + redes.join("") + '</span>\n' : "") +
            '                    </div>\n' +
            '                </li>';

    }

    function itemLibre(e) {

        const nombre = escaparHtml(e.nombre);
        const red = enlaces.REDES[e.red].nombre;

        return '                <li class="lp-item">\n' +
            '                    <span class="lp-avatar lp-inicial" aria-hidden="true">' + escaparHtml(e.nombre.charAt(0)) + '</span>\n' +
            '                    <div class="lp-info">\n' +
            '                        <h2 class="lp-nombre"><a href="' + escaparHtml(e.url) + '" target="_blank" rel="nofollow noopener noreferrer">' + nombre + '<span class="vh"> — en ' + escaparHtml(red) + ' (se abre en una pestaña nueva)</span></a></h2>\n' +
            '                        <p class="lp-meta">' + escaparHtml([e.rubro, e.ciudad].filter(Boolean).join(" · ")) + '</p>\n' +
            '                    </div>\n' +
            '                    <div class="lp-acciones">\n' +
            '                        <span class="lp-redes"><a class="lp-red" href="' + escaparHtml(e.url) + '" target="_blank" rel="nofollow noopener noreferrer" tabindex="-1" aria-hidden="true">' + escaparHtml(red) + '</a></span>\n' +
            '                    </div>\n' +
            '                </li>';

    }

    function chips(lista) {

        return lista.filter(function (c) { return c.ruta; }).map(function (c) {
            return '<a href="' + c.ruta + '">' + escaparHtml(c.texto) + '</a>';
        }).join("\n                    ");

    }

    // Arma una página de lista. "d" trae el título, la dirección, las mipymes y los enlaces relacionados.
    function paginaDeLista(d) {

        const grupo = ordenarGrupo(d.entradas);
        const n = d.entradas.length;
        const noindex = n < MINIMO_PARA_GOOGLE;
        const url = SITIO + "/" + d.ruta;
        const nombres = grupo.destacadas.concat(grupo.libres).slice(0, 3).map(function (e) { return e.nombre.trim(); });

        const descripcion = recortar(
            "Conocé " + n + (n === 1 ? " mipyme" : " mipymes") + " de " + d.descripcionDe + ": " + nombres.join(", ") + (n > 3 ? " y más" : "") +
            ". Contactalas directo por WhatsApp o Instagram.", 155);

        const migas = [{ "@type": "ListItem", "position": 1, "name": "Impulsa Mipymes", "item": SITIO + "/" }]
            .concat(d.migas.map(function (mg, i) { return { "@type": "ListItem", "position": i + 2, "name": mg.texto, "item": SITIO + "/" + mg.ruta }; }));

        let h = adaptarCabecera(plantilla, {
            base: d.base,
            titulo: d.titulo,
            descripcion: descripcion,
            robots: noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
            canonica: url,
            imagen: SITIO + "/assets/img/og-impulsa-mipymes.jpg",
            imagenAlt: "Impulsa Mipymes: emprendimientos y pequeñas empresas de Paraguay",
            imagenConMedidas: true,
            idEstructurados: "jsonld-lista-pagina",
            estructurados: {
                "@context": "https://schema.org",
                "@graph": [
                    { "@type": "CollectionPage", "@id": url, "url": url, "name": d.titulo, "description": descripcion, "inLanguage": "es-PY",
                      "isPartOf": { "@id": SITIO + "/#website" }, "breadcrumb": { "@id": url + "#migas" } },
                    { "@type": "BreadcrumbList", "@id": url + "#migas", "itemListElement": migas },
                    { "@type": "ItemList", "numberOfItems": grupo.destacadas.length,
                      "itemListElement": grupo.destacadas.map(function (e, i) { return { "@type": "ListItem", "position": i + 1, "name": e.nombre.trim(), "url": SITIO + "/mipymes/" + e.slug + "/" }; }) }
                ]
            }
        });

        // esta página no es una ficha: sin ficha.js ni los datos de las mipymes; con la rotación por turnos
        h = quitarScripts(h, ["verificada.js", "mipymes-data.js", "paginas-generadas.js", "ficha.js"]);
        h = unico(h, /([ \t]*<script src="\.\/js\/theme\.js\?v=[^"]*" defer><\/script>)/, function (_, a) { return '    <script src="./js/orden.js?v=@V@" defer></script>\n    <script src="./js/pagina-lista.js?v=@V@" defer></script>\n' + a; }, "script theme.js");

        const bloqueDestacadas = grupo.destacadas.length
            ? (grupo.libres.length ? '            <h2 class="lp-subtitulo">Mipymes destacadas</h2>\n' : "") +
              '            <ul class="lp-lista" data-rotar>\n' + grupo.destacadas.map(itemDestacada).join("\n") + '\n            </ul>\n'
            : "";

        const bloqueLibres = grupo.libres.length
            ? (grupo.destacadas.length ? '            <h2 class="lp-subtitulo">También en la guía</h2>\n' : "") +
              '            <ul class="lp-lista lp-lista-guia">\n' + grupo.libres.map(itemLibre).join("\n") + '\n            </ul>\n'
            : "";

        const migasHtml = [{ texto: "Inicio", ruta: "index.html" }].concat(d.migas).map(function (mg, i, todas) {
            return i === todas.length - 1
                ? '<span aria-current="page">' + escaparHtml(mg.texto) + '</span>'
                : (mg.ruta ? '<a href="' + mg.ruta + '">' + escaparHtml(mg.texto) + '</a>' : '<span>' + escaparHtml(mg.texto) + '</span>');
        }).join('<span class="lp-sep" aria-hidden="true">›</span>');

        const relacionados = d.relacionados.filter(function (g) { return g.enlaces.some(function (c) { return c.ruta; }); }).map(function (g) {
            return '            <div class="lp-grupo">\n                <h3>' + escaparHtml(g.titulo) + '</h3>\n                <p class="lp-chips">\n                    ' + chips(g.enlaces) + '\n                </p>\n            </div>';
        }).join("\n");

        const principal =
            '    <main>\n\n' +
            '        <section class="lp-section">\n' +
            '            <div class="container lp-container">\n\n' +
            '                <nav class="lp-migas" aria-label="Ruta de navegación">' + migasHtml + '</nav>\n\n' +
            '                <h1>' + escaparHtml(d.h1) + '</h1>\n\n' +
            '                <p class="lp-intro">' + escaparHtml(d.intro) + '</p>\n\n' +
            bloqueDestacadas + bloqueLibres + '\n' +
            '                <div class="lp-mas">\n' +
            '                    <h2 class="lp-subtitulo">Seguí explorando</h2>\n' + relacionados + '\n' +
            '                    <p class="lp-todas"><a href="./index.html#mipymes">Ver todas las mipymes y usar el buscador →</a></p>\n' +
            '                </div>\n\n' +
            '                <div class="lp-cta">\n' +
            '                    <strong>¿Tenés una mipyme?</strong>\n' +
            '                    <p>Sumate gratis a la guía o conocé cómo aparecer destacada, con ficha propia, fotos y botón de contacto directo.</p>\n' +
            '                    <a class="btn btn-primary" href="./index.html#participar">Quiero ser parte</a>\n' +
            '                </div>\n\n' +
            '            </div>\n        </section>\n\n    </main>';

        h = unico(h, /<main>[\s\S]*<\/main>/, function () { return principal; }, "main");

        // los anuncios de la ficha no corresponden acá (el de arriba de todo y el de antes del pie sí)
        escribirPagina(d.ruta.replace(/\/$/, ""), h);
        paginasLanding.push({ ruta: d.ruta, noindex: noindex, cantidad: n, prioridad: d.prioridad });

    }

    const mayus1 = function (t) { return t.charAt(0).toLowerCase() + t.slice(1); };

    // ----- por rubro -----
    rubrosOrdenados.forEach(function (rubro) {

        const rs = crearSlug(rubro);
        const g = porRubro[rs];
        const ciudadesDelRubro = ciudadesOrdenadas.filter(function (c) {
            return g.entradas.some(function (e) { return e.ciudad && crearSlug(e.ciudad) === crearSlug(c); });
        });

        paginaDeLista({
            ruta: "rubros/" + rs + "/",
            base: "../../",
            titulo: rubro + " en Paraguay | Impulsa Mipymes",
            h1: rubro + " en Paraguay",
            intro: "Estas son las mipymes de " + mayus1(rubro) + " que forman parte de Impulsa Mipymes: " + g.entradas.length +
                (g.entradas.length === 1 ? " emprendimiento" : " emprendimientos") + " de Paraguay para conocer y contactar directo por WhatsApp o Instagram.",
            descripcionDe: mayus1(rubro) + " en Paraguay",
            entradas: g.entradas,
            migas: [{ texto: rubro, ruta: "" }],
            prioridad: "0.7",
            relacionados: [
                { titulo: "Este rubro, por ciudad", enlaces: ciudadesDelRubro.map(function (c) {
                    const cs = crearSlug(c);
                    return { ruta: rutaCombinada(rs, cs) || rutaCiudad(cs), texto: c };
                }) },
                { titulo: "Otros rubros", enlaces: rubrosOrdenados.filter(function (r) { return r !== rubro; }).map(function (r) { return { ruta: rutaRubro(crearSlug(r)), texto: r }; }) }
            ]
        });

    });

    // ----- por ciudad -----
    ciudadesOrdenadas.forEach(function (ciudad) {

        const cs = crearSlug(ciudad);
        const g = porCiudad[cs];
        const rubrosDeLaCiudad = rubrosOrdenados.filter(function (r) {
            return g.entradas.some(function (e) { return crearSlug(e.rubro) === crearSlug(r); });
        });

        paginaDeLista({
            ruta: "ciudades/" + cs + "/",
            base: "../../",
            titulo: "Mipymes en " + ciudad + " | Impulsa Mipymes",
            h1: "Mipymes en " + ciudad,
            intro: "Estas son las mipymes de " + ciudad + " que forman parte de Impulsa Mipymes: " + g.entradas.length +
                (g.entradas.length === 1 ? " emprendimiento" : " emprendimientos") + " para conocer y contactar directo por WhatsApp o Instagram.",
            descripcionDe: ciudad,
            entradas: g.entradas,
            migas: [{ texto: ciudad, ruta: "" }],
            prioridad: "0.7",
            relacionados: [
                { titulo: "Rubros en " + ciudad, enlaces: rubrosDeLaCiudad.map(function (r) {
                    const rs = crearSlug(r);
                    return { ruta: rutaCombinada(rs, cs) || rutaRubro(rs), texto: r };
                }) },
                { titulo: "Otras ciudades", enlaces: ciudadesOrdenadas.filter(function (c) { return c !== ciudad; }).map(function (c) { return { ruta: rutaCiudad(crearSlug(c)), texto: c }; }) }
            ]
        });

    });

    // ----- rubro + ciudad -----
    Object.keys(porCombinada).sort().forEach(function (clave) {

        const g = porCombinada[clave];

        paginaDeLista({
            ruta: "rubros/" + g.rs + "/" + g.cs + "/",
            base: "../../../",
            titulo: g.rubro + " en " + g.ciudad + " | Impulsa Mipymes",
            h1: g.rubro + " en " + g.ciudad,
            intro: "Mipymes de " + mayus1(g.rubro) + " en " + g.ciudad + " que forman parte de Impulsa Mipymes: " + g.entradas.length +
                " emprendimientos para conocer y contactar directo por WhatsApp o Instagram.",
            descripcionDe: mayus1(g.rubro) + " en " + g.ciudad,
            entradas: g.entradas,
            migas: [{ texto: g.rubro, ruta: rutaRubro(g.rs) }, { texto: g.ciudad, ruta: "" }],
            prioridad: "0.6",
            relacionados: [
                { titulo: "Más de " + mayus1(g.rubro), enlaces: [{ ruta: rutaRubro(g.rs), texto: g.rubro + " en Paraguay" }] },
                { titulo: "Más en " + g.ciudad, enlaces: [{ ruta: rutaCiudad(g.cs), texto: "Mipymes en " + g.ciudad }] }
            ]
        });

    });

    // ---------- 3) la lista de lo generado ----------

    const generadas = {
        fichas: fichasGeneradas,
        rubros: {},
        ciudades: {},
        combinadas: {},
        destacadas: infoDestacadas
    };

    rubrosOrdenados.forEach(function (r) { generadas.rubros[crearSlug(r)] = r; });
    ciudadesOrdenadas.forEach(function (c) { generadas.ciudades[crearSlug(c)] = c; });
    Object.keys(porCombinada).forEach(function (k) { generadas.combinadas[k] = porCombinada[k].nombre; });

    const contenidoLista = "// Archivo generado por tools/generar-seo.js: no editar a mano.\n" +
        "// Dice qué páginas fijas existen (fichas, rubros, ciudades) para que la web enlace solo a las que ya están armadas.\n" +
        "const PAGINAS_GENERADAS = " + JSON.stringify(generadas, null, 2) + ";\n";

    fs.writeFileSync(path.join(RAIZ, "js", "paginas-generadas.js"), contenidoLista, "utf8");

    // Un número que cambia cuando cambia el archivo: así los navegadores no usan una copia vieja
    const version = crypto.createHash("md5").update(contenidoLista).digest("hex").slice(0, 8);

    // las páginas de lista usan orden.js y pagina-lista.js: se les pone el mismo número de versión de siempre
    const versionJs = (leer("index.html").match(/\.\/js\/orden\.js\?v=([0-9a-z\-]+)/) || [])[1] || "1";

    paginasLanding.forEach(function (p) {

        const archivo = path.join(RAIZ, p.ruta, "index.html");

        fs.writeFileSync(archivo, fs.readFileSync(archivo, "utf8").replace(/@V@/g, versionJs), "utf8");

    });

    return {
        version: version,
        fichas: fichasGeneradas,
        rubros: rubrosOrdenados.map(function (r) { return { nombre: r, ruta: rutaRubro(crearSlug(r)), cantidad: porRubro[crearSlug(r)].entradas.length }; }),
        ciudades: ciudadesOrdenadas.map(function (c) { return { nombre: c, ruta: rutaCiudad(crearSlug(c)), cantidad: porCiudad[crearSlug(c)].entradas.length }; }),
        paginasLanding: paginasLanding,
        hay: fichasGeneradas.length + paginasLanding.length
    };

};
