// ==========================================
// FICHA.JS
// ==========================================
//
// Arma la página de una mipyme a partir del
// parámetro "?mipyme=" en la URL, buscándola
// en MIPYMES_DATA (js/mipymes-data.js), y
// controla el carrusel de fotos.
// ==========================================


// ==========================================
// ARMAR EL "SLUG" A PARTIR DEL NOMBRE
// (el mismo texto que usa app.js para armar
// el link desde cada tarjeta)
// ==========================================

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


// ==========================================
// BUSCAR LA MIPYME SEGÚN LA URL
// ==========================================

function obtenerMipymeDesdeURL() {

    // En las páginas fijas (mipymes/<nombre>/) la mipyme viene escrita en la página
    // (window.MIPYME_SLUG); en la ficha de siempre, en la dirección (?mipyme=...)
    const params = new URLSearchParams(window.location.search);
    const slug = window.MIPYME_SLUG || params.get("mipyme");

    if (!slug || typeof MIPYMES_DATA === "undefined") return null;

    return MIPYMES_DATA.find(function (m) {
        return crearSlug(m.nombre) === slug;
    }) || null;

}


// ==========================================
// SEO DE CADA FICHA
// ==========================================
//
// Cada mipyme tiene su propio título, descripción, dirección
// "canónica", imagen para compartir en redes (WhatsApp, Facebook,
// X, LinkedIn) y datos estructurados para Google. Todo sale de
// js/mipymes-data.js: no hay que escribir nada a mano.
// ==========================================

const SEO_SITIO = "https://www.impulsamipymes.com.py";

function seoPonerMeta(clave, valor, esProperty) {

    const atributo = esProperty ? "property" : "name";

    let el = document.querySelector(`meta[${atributo}="${clave}"]`);

    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(atributo, clave);
        document.head.appendChild(el);
    }

    el.setAttribute("content", valor);

}

function seoCanonical(url) {

    let el = document.querySelector('link[rel="canonical"]');

    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", "canonical");
        document.head.appendChild(el);
    }

    el.setAttribute("href", url);

}

function seoUrlAbsoluta(ruta) {

    try {
        return new URL(ruta, SEO_SITIO + "/").href;
    } catch (e) {
        return "";
    }

}

// Corta un texto sin partir palabras (Google muestra ~155 caracteres)
function seoRecortar(texto, maximo) {

    const t = String(texto || "").replace(/\s+/g, " ").trim();

    if (t.length <= maximo) return t;

    const corte = t.lastIndexOf(" ", maximo - 1);

    return t.slice(0, corte > 60 ? corte : maximo - 1).replace(/[\s,.;:–-]+$/, "") + "…";

}

function seoPonerJsonLd(id, datos) {

    let el = document.getElementById(id);

    if (!el) {
        el = document.createElement("script");
        el.type = "application/ld+json";
        el.id = id;
        document.head.appendChild(el);
    }

    el.textContent = JSON.stringify(datos);

}

function actualizarSEO(m) {

    // La página fija (mipymes/<nombre>/) ya trae el título, la descripción, la imagen para
    // compartir y los datos estructurados escritos en el HTML: no hay nada que reemplazar.
    if (window.MIPYME_SLUG) return;

    const nombre = String(m.nombre).trim();
    const slug = crearSlug(m.nombre);
    const url = `${SEO_SITIO}/ficha.html?mipyme=${slug}`;

    let titulo = `${nombre} | ${m.categoria} | Impulsa Mipymes`;

    if (titulo.length > 70) titulo = `${nombre} | Impulsa Mipymes`;

    const descripcion = seoRecortar(m.descripcion, 155);
    const imagen = seoUrlAbsoluta(m.productoImagen);

    document.title = titulo;

    seoPonerMeta("description", descripcion);
    seoPonerMeta("robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    seoCanonical(url);

    // Redes sociales
    seoPonerMeta("og:type", "website", true);
    seoPonerMeta("og:url", url, true);
    seoPonerMeta("og:title", titulo, true);
    seoPonerMeta("og:description", descripcion, true);
    seoPonerMeta("og:image", imagen, true);
    seoPonerMeta("og:image:alt", `Producto de ${nombre}`, true);
    seoPonerMeta("twitter:title", titulo);
    seoPonerMeta("twitter:description", descripcion);
    seoPonerMeta("twitter:image", imagen);
    seoPonerMeta("twitter:image:alt", `Producto de ${nombre}`);

    // las medidas de la imagen genérica ya no corresponden
    ["og:image:width", "og:image:height", "og:image:type"].forEach(function (clave) {
        const el = document.querySelector(`meta[property="${clave}"]`);
        if (el) el.remove();
    });

    // Datos estructurados
    const fotos = [m.productoImagen, m.perfilImagen].concat(m.fotosCarrusel || [])
        .filter(Boolean)
        .map(seoUrlAbsoluta)
        .filter(function (f, i, todas) { return f && todas.indexOf(f) === i; })
        .slice(0, 6);

    const negocio = {
        "@type": "LocalBusiness",
        "@id": `${url}#negocio`,
        "name": nombre,
        "description": String(m.descripcion || "").replace(/\s+/g, " ").trim(),
        "url": url,
        "image": fotos,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": String(m.ubicacion || "").split(",")[0].trim(),
            "addressCountry": "PY"
        },
        "areaServed": { "@type": "Country", "name": "Paraguay" }
    };

    if (m.instagram) negocio.sameAs = [m.instagram];

    if (m.whatsapp && /^\d{9,15}$/.test(String(m.whatsapp))) {
        negocio.telephone = "+" + m.whatsapp;
    }

    seoPonerJsonLd("jsonld-ficha", {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebPage",
                "@id": url,
                "url": url,
                "name": titulo,
                "description": descripcion,
                "inLanguage": "es-PY",
                "isPartOf": { "@id": `${SEO_SITIO}/#website` },
                "primaryImageOfPage": { "@type": "ImageObject", "url": imagen },
                "breadcrumb": { "@id": `${url}#migas` },
                "about": { "@id": `${url}#negocio` }
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${url}#migas`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Impulsa Mipymes", "item": `${SEO_SITIO}/` },
                    { "@type": "ListItem", "position": 2, "name": nombre, "item": url }
                ]
            },
            negocio
        ]
    });

}

// Si el link no corresponde a ninguna mipyme, que Google no la guarde
function marcarFichaNoEncontrada() {

    document.title = "Mipyme no encontrada | Impulsa Mipymes";

    seoPonerMeta("robots", "noindex, follow");

    const canonica = document.querySelector('link[rel="canonical"]');
    if (canonica) canonica.remove();

}


// ==========================================
// ARMAR LA FICHA EN PANTALLA
// ==========================================

function mostrarFicha() {

    const mipyme = obtenerMipymeDesdeURL();
    const contenedor = document.querySelector(".ficha-container");

    if (!mipyme) {

        marcarFichaNoEncontrada();

        if (contenedor) {

            contenedor.innerHTML = `
                <a href="./index.html#mipymes" class="ficha-volver">← Volver a Mipymes</a>
                <p class="ficha-no-encontrada">
                    No encontramos esa mipyme. Puede que el link esté
                    mal escrito o que ya no esté disponible.
                </p>
            `;

        }

        return;

    }

    // Un link viejo (ficha.html?mipyme=...) de una mipyme que ya tiene su página fija se lleva a ella,
    // así lo que se copia y comparte desde la barra del navegador ya muestra la vista previa en WhatsApp.
    const slugDeEsta = crearSlug(mipyme.nombre);

    if (!window.MIPYME_SLUG && typeof PAGINAS_GENERADAS !== "undefined" && PAGINAS_GENERADAS.fichas.indexOf(slugDeEsta) >= 0) {
        window.location.replace("./mipymes/" + slugDeEsta + "/" + window.location.hash);
        return;
    }

    actualizarSEO(mipyme);

    // ---------- encabezado ----------
    const encabezado = document.getElementById("ficha-header");

    // Palomita de "mipyme verificada" (solo si en los datos dice  verificada: true)
    const insigniaVerificada = (window.Verificada && window.Verificada.esVerificada(mipyme))
        ? window.Verificada.html(true)
        : "";

    if (encabezado) {

        encabezado.innerHTML = `
            <img class="ficha-perfil-img" src="${mipyme.perfilImagen}" alt="Perfil de ${mipyme.nombre}">
            <div>
                <span class="mipyme-category">${mipyme.categoria}</span>
                <h1>${mipyme.nombre}${insigniaVerificada}</h1>
                <p class="mipyme-location"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.25 6.24 11.34 6.5 11.6a1.4 1.4 0 0 0 2 0c.26-.26 6.5-6.35 6.5-11.6C19.5 5.36 16.14 2 12 2zm0 10.3a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z"/></svg>${mipyme.ubicacion}</p>
            </div>
        `;

    }

    // ---------- carrusel ----------
    const fotos = (mipyme.fotosCarrusel && mipyme.fotosCarrusel.length)
        ? mipyme.fotosCarrusel.slice(0, 5)
        : [mipyme.productoImagen];

    const track = document.getElementById("carrusel-track");
    const puntosContenedor = document.getElementById("carrusel-puntos");

    if (track) {

        track.innerHTML = fotos.map(function (foto, i) {

            return `
                <div class="carrusel-slide">
                    <img src="${foto}" alt="Foto ${i + 1} de ${mipyme.nombre}" loading="lazy">
                </div>
            `;

        }).join("");

    }

    if (puntosContenedor) {

        puntosContenedor.innerHTML = fotos.map(function (_, i) {

            return `<button class="carrusel-punto${i === 0 ? " activo" : ""}" data-indice="${i}" aria-label="Ir a la foto ${i + 1}"></button>`;

        }).join("");

    }

    // ---------- descripción (2 párrafos) ----------
    const descripcionEl = document.getElementById("ficha-descripcion");

    if (descripcionEl) {

        const parrafos = (mipyme.descripcionLarga && mipyme.descripcionLarga.length)
            ? mipyme.descripcionLarga
            : [mipyme.descripcion];

        descripcionEl.innerHTML = parrafos.map(function (parrafo) {
            return `<p>${parrafo}</p>`;
        }).join("");

    }

    // ---------- nota periodística ----------
    const notaEl = document.getElementById("ficha-nota");

    if (notaEl) {

        if (mipyme.notaPeriodistica) {
            notaEl.href = mipyme.notaPeriodistica;
        } else {
            notaEl.style.display = "none";
        }

    }

    // ---------- contacto ----------
    const accionesEl = document.getElementById("ficha-actions");

    if (accionesEl) {

        accionesEl.innerHTML = `
            <a href="https://wa.me/${mipyme.whatsapp}" target="_blank" rel="noopener" class="whatsapp-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.24-.45.06-.98.08-1.58-.1-.36-.11-.83-.27-1.43-.53-2.52-1.09-4.16-3.63-4.29-3.8-.13-.17-1.03-1.37-1.03-2.61 0-1.24.65-1.85.88-2.1.22-.25.49-.31.65-.31.16 0 .33 0 .47.01.15.01.35-.06.55.42.2.49.69 1.68.75 1.8.06.12.1.27.02.44-.08.17-.12.27-.24.42-.12.15-.25.33-.36.44-.12.12-.24.25-.1.49.14.24.61 1.01 1.32 1.63.91.8 1.67 1.05 1.91 1.17.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.21.08 1.36.64 1.6.76.24.12.4.18.46.28.06.11.06.61-.16 1.23z"/></svg>
                WhatsApp
            </a>
            <a href="${mipyme.instagram}" target="_blank" rel="noopener" class="instagram-btn">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>
                Instagram
            </a>
        `;

    }

    agregarMasMipymes(mipyme, contenedor);

    activarCarrusel(fotos.length);

}

// "Más mipymes": enlaces a la página del rubro y de la ciudad de esta mipyme
// (solo a las que ya existen; las arma tools/generar-seo.js)
function agregarMasMipymes(mipyme, contenedor) {

    if (!contenedor || typeof PAGINAS_GENERADAS === "undefined" || !PAGINAS_GENERADAS.destacadas) return;

    const info = PAGINAS_GENERADAS.destacadas[crearSlug(mipyme.nombre)];

    if (!info) return;

    const enlaces = [];

    if (info.combinada) enlaces.push({ nombre: info.combinada.nombre, ruta: info.combinada.ruta });
    if (info.rubro) enlaces.push({ nombre: info.rubro.nombre + " en Paraguay", ruta: info.rubro.ruta });
    if (info.ciudad) enlaces.push({ nombre: "Mipymes en " + info.ciudad.nombre, ruta: info.ciudad.ruta });

    if (!enlaces.length) return;

    const escapar = function (t) {
        return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    const bloque = document.createElement("section");

    bloque.className = "ficha-mas";
    bloque.setAttribute("aria-label", "Más mipymes");

    bloque.innerHTML =
        "<h2>Más mipymes</h2>" +
        '<p class="lp-chips">' +
        enlaces.map(function (e) {
            return '<a href="' + escapar(e.ruta) + '">' + escapar(e.nombre) + "</a>";
        }).join("") +
        "</p>";

    contenedor.appendChild(bloque);

}


// ==========================================
// CARRUSEL: scroll manual + autoplay cada 10s
// ==========================================

function activarCarrusel(totalFotos) {

    const track = document.getElementById("carrusel-track");
    const flechaIzq = document.getElementById("flecha-izq");
    const flechaDer = document.getElementById("flecha-der");
    const puntosContenedor = document.getElementById("carrusel-puntos");

    if (!track) return;

    // Con una sola foto no hace falta ni flechas ni autoplay
    if (totalFotos <= 1) {

        if (flechaIzq) flechaIzq.style.display = "none";
        if (flechaDer) flechaDer.style.display = "none";
        if (puntosContenedor) puntosContenedor.style.display = "none";

        return;

    }

    const INTERVALO_AUTOPLAY = 10000; // 10 segundos

    let indiceActual = 0;
    let temporizador = null;
    let ignorarProximoScroll = false;

    function irASlide(indice) {

        indiceActual = ((indice % totalFotos) + totalFotos) % totalFotos;

        ignorarProximoScroll = true;

        track.scrollTo({
            left: track.clientWidth * indiceActual,
            behavior: "smooth"
        });

        actualizarPuntos();

    }

    function actualizarPuntos() {

        if (!puntosContenedor) return;

        const puntos = puntosContenedor.querySelectorAll(".carrusel-punto");

        puntos.forEach(function (punto, i) {
            punto.classList.toggle("activo", i === indiceActual);
        });

    }

    function reiniciarAutoplay() {

        if (temporizador) clearInterval(temporizador);

        temporizador = setInterval(function () {
            irASlide(indiceActual + 1);
        }, INTERVALO_AUTOPLAY);

    }

    // Flechas
    if (flechaDer) {

        flechaDer.addEventListener("click", function () {
            irASlide(indiceActual + 1);
            reiniciarAutoplay();
        });

    }

    if (flechaIzq) {

        flechaIzq.addEventListener("click", function () {
            irASlide(indiceActual - 1);
            reiniciarAutoplay();
        });

    }

    // Puntos
    if (puntosContenedor) {

        puntosContenedor.addEventListener("click", function (e) {

            const boton = e.target.closest(".carrusel-punto");

            if (!boton) return;

            irASlide(Number(boton.dataset.indice));
            reiniciarAutoplay();

        });

    }

    // Scroll manual del usuario (touch, trackpad, arrastre de la barra)
    let scrollTimeout = null;

    track.addEventListener("scroll", function () {

        // Si el scroll lo disparó nuestro propio irASlide(), no lo
        // contamos como interacción manual del usuario.
        if (ignorarProximoScroll) {
            ignorarProximoScroll = false;
        }

        indiceActual = Math.round(track.scrollLeft / track.clientWidth);
        actualizarPuntos();

        if (scrollTimeout) clearTimeout(scrollTimeout);

        scrollTimeout = setTimeout(function () {
            reiniciarAutoplay();
        }, 150);

    }, { passive: true });

    reiniciarAutoplay();

}


// ==========================================
// EJECUTAR
// ==========================================

mostrarFicha();
