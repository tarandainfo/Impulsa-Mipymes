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

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("mipyme");

    if (!slug || typeof MIPYMES_DATA === "undefined") return null;

    return MIPYMES_DATA.find(function (m) {
        return crearSlug(m.nombre) === slug;
    }) || null;

}


// ==========================================
// ARMAR LA FICHA EN PANTALLA
// ==========================================

function mostrarFicha() {

    const mipyme = obtenerMipymeDesdeURL();
    const contenedor = document.querySelector(".ficha-container");

    if (!mipyme) {

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

    document.title = `${mipyme.nombre} | Infonegocios`;

    // ---------- encabezado ----------
    const encabezado = document.getElementById("ficha-header");

    if (encabezado) {

        encabezado.innerHTML = `
            <img class="ficha-perfil-img" src="${mipyme.perfilImagen}" alt="Perfil de ${mipyme.nombre}">
            <div>
                <span class="mipyme-category">${mipyme.categoria}</span>
                <h1>${mipyme.nombre}</h1>
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

    activarCarrusel(fotos.length);

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
