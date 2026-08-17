// ==========================================
// APP.JS — LÓGICA DE RENDERIZADO
// ==========================================
//
// No hace falta tocar este archivo para agregar
// una mipyme o un banner nuevo: eso se hace en
// mipymes-data.js y banners-data.js.
// ==========================================


// ==========================================
// SLUG (para armar el link a la ficha de
// cada mipyme). Misma lógica que ficha.js.
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
// CONTENEDORES
// ==========================================

const mipymesList = document.getElementById("mipymes-list");
const bannersList = document.getElementById("banners-list");
const btnAparecer = document.getElementById("btn-aparecer");


// ==========================================
// MOSTRAR MIPYMES
// ==========================================

function mostrarMipymes() {

    if (!mipymesList) return;

    mipymesList.innerHTML = "";

    MIPYMES_DATA.forEach(function (mipyme) {

        const card = document.createElement("article");

        card.classList.add("mipyme-card");

        card.innerHTML = `

            <div class="mipyme-product-image">

                <img
                    src="${mipyme.productoImagen}"
                    alt="Producto de ${mipyme.nombre}"
                    loading="lazy"
                >

            </div>


            <div class="mipyme-info">

                <div class="mipyme-header">

                    <img
                        class="mipyme-profile-image"
                        src="${mipyme.perfilImagen}"
                        alt="Perfil de ${mipyme.nombre}"
                        loading="lazy"
                    >

                    <div>

                        <span class="mipyme-category">
                            ${mipyme.categoria}
                        </span>

                        <h3>
                            ${mipyme.nombre}
                        </h3>

                    </div>

                </div>


                <p class="mipyme-description">
                    ${mipyme.descripcion}
                </p>


                <p class="mipyme-location">
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C7.86 2 4.5 5.36 4.5 9.5c0 5.25 6.24 11.34 6.5 11.6a1.4 1.4 0 0 0 2 0c.26-.26 6.5-6.35 6.5-11.6C19.5 5.36 16.14 2 12 2zm0 10.3a2.8 2.8 0 1 1 0-5.6 2.8 2.8 0 0 1 0 5.6z"/></svg>
                    ${mipyme.ubicacion}
                </p>


                ${mipyme.promocion ? `
                <div class="mipyme-promotion">

                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.4 11.2 12.8 2.6a2 2 0 0 0-1.4-.6H4a2 2 0 0 0-2 2v7.4c0 .53.21 1.04.6 1.4l8.6 8.6a2 2 0 0 0 2.8 0l7.4-7.4a2 2 0 0 0 0-2.8zM7 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>

                    <div>

                        <strong>
                            PROMOCIÓN
                        </strong>

                        <p>
                            ${mipyme.promocion}
                        </p>

                    </div>

                </div>
                ` : ""}


                <div class="mipyme-actions">

                    <a
                        href="https://wa.me/${mipyme.whatsapp}"
                        target="_blank"
                        rel="noopener"
                        class="whatsapp-btn">

                        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.24-.45.06-.98.08-1.58-.1-.36-.11-.83-.27-1.43-.53-2.52-1.09-4.16-3.63-4.29-3.8-.13-.17-1.03-1.37-1.03-2.61 0-1.24.65-1.85.88-2.1.22-.25.49-.31.65-.31.16 0 .33 0 .47.01.15.01.35-.06.55.42.2.49.69 1.68.75 1.8.06.12.1.27.02.44-.08.17-.12.27-.24.42-.12.15-.25.33-.36.44-.12.12-.24.25-.1.49.14.24.61 1.01 1.32 1.63.91.8 1.67 1.05 1.91 1.17.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.21.08 1.36.64 1.6.76.24.12.4.18.46.28.06.11.06.61-.16 1.23z"/></svg>
                        WhatsApp

                    </a>


                    <a
                        href="${mipyme.instagram}"
                        target="_blank"
                        rel="noopener"
                        class="instagram-btn">

                        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>
                        Instagram

                    </a>

                </div>

            </div>

        `;

        mipymesList.appendChild(card);

        // Clickear la tarjeta lleva a la ficha de la mipyme,
        // excepto si el click fue en los botones de contacto.
        card.addEventListener("click", function (e) {

            if (e.target.closest(".mipyme-actions")) return;

            window.location.href = `ficha.html?mipyme=${crearSlug(mipyme.nombre)}`;

        });

    });

}


// ==========================================
// MOSTRAR BANNERS
// ==========================================

function mostrarBanners() {

    if (!bannersList) return;

    bannersList.innerHTML = "";

    BANNERS_DATA.forEach(function (banner) {

        const item = document.createElement("div");

        item.classList.add("banner");

        item.innerHTML = `

            <div class="banner-image ${banner.colorClase || ""}">
                ${banner.imagen
                    ? `<img src="${banner.imagen}" alt="${banner.marca}" loading="lazy">`
                    : banner.marca}
            </div>

            <div class="banner-content">

                <span>
                    ${banner.etiqueta}
                </span>

                <h4>
                    ${banner.titulo}
                </h4>

                <p>
                    ${banner.texto}
                </p>

                <a href="${banner.link}" target="_blank" rel="noopener" class="banner-link">
                    Conocer más →
                </a>

            </div>

        `;

        bannersList.appendChild(item);

    });

}


// ==========================================
// BOTONES DE CONTACTO (Infonegocios)
// ==========================================

function configurarBotonesContacto() {

    if (typeof INFONEGOCIOS_CONFIG === "undefined") return;

    if (btnAparecer) {

        btnAparecer.href =
            `https://wa.me/${INFONEGOCIOS_CONFIG.whatsapp}?text=${encodeURIComponent(INFONEGOCIOS_CONFIG.mensajeQuieroAparecer)}`;

    }

}


// ==========================================
// SCROLL SUAVE (arriba/abajo según la sección)
// ==========================================
//
// Anima el scroll a mano con requestAnimationFrame,
// en vez de depender del scroll-behavior del navegador.
// Funciona para cualquier link que apunte a un "#id"
// de la misma página (nav, botones, etc).
// ==========================================

function scrollSuaveHacia(destino) {

    const header = document.querySelector(".header");
    const alturaHeader = header ? header.offsetHeight : 0;

    const posicionDestino =
        destino.getBoundingClientRect().top +
        window.pageYOffset -
        alturaHeader -
        20;

    const posicionInicial = window.pageYOffset;
    const distancia = posicionDestino - posicionInicial;
    const duracion = 650;
    let inicioAnimacion = null;

    function easeInOutQuad(t) {
        return t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    function paso(marcaTiempo) {

        if (inicioAnimacion === null) inicioAnimacion = marcaTiempo;

        const transcurrido = marcaTiempo - inicioAnimacion;
        const progreso = Math.min(transcurrido / duracion, 1);

        window.scrollTo(0, posicionInicial + distancia * easeInOutQuad(progreso));

        if (transcurrido < duracion) {
            requestAnimationFrame(paso);
        }

    }

    requestAnimationFrame(paso);

}


function activarScrollSuave() {

    const linksInternos = document.querySelectorAll('a[href^="#"]');

    linksInternos.forEach(function (link) {

        const id = link.getAttribute("href").slice(1);

        if (!id) return;

        link.addEventListener("click", function (e) {

            const destino = document.getElementById(id);

            if (!destino) return;

            e.preventDefault();

            scrollSuaveHacia(destino);

        });

    });

}


// ==========================================
// HERO: logo grande arriba del todo,
// vuelve al diseño normal al scrollear
// ==========================================

function activarHeroLogoGrande() {

    const hero = document.querySelector(".hero");
    const circuloLogo = document.querySelector(".hero-logo-circle");
    const heroContent = document.querySelector(".hero-content");
    const circulosDecoracion = document.querySelectorAll(".hero-decoration .hero-circle");
    const logoHeader = document.querySelector(".header .logo img");

    if (!hero || !circuloLogo || !heroContent) return;

    // Cuántos píxeles de scroll dura toda la animación
    const RANGO_SCROLL = 420;

    // Margen extra (px) entre el borde de la circunferencia y el texto
    const MARGEN = 40;

    // Qué tan "atrás" va la animación respecto al scroll real.
    // Más chico = más lenta y suave. Más grande = más pegada al scroll.
    const SUAVIZADO = 0.09;

    let desplazamientoTexto = 0;
    let progresoObjetivo = 0;
    let progresoActual = 0;
    let loopActivo = false;

    function easeInOutQuad(t) {
        return t < 0.5
            ? 2 * t * t
            : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // Mide, con las posiciones reales de la pantalla, cuánto hay
    // que correr el texto para que no quede pisado por la circunferencia
    function calcularDesplazamiento() {

        if (window.innerWidth <= 900) {
            desplazamientoTexto = 0;
            return;
        }

        // texto en su posición normal, sin ningún desplazamiento aplicado
        heroContent.style.transform = "none";

        const heroRect = hero.getBoundingClientRect();
        const contentRect = heroContent.getBoundingClientRect();

        const bordeCirculo = heroRect.left + heroRect.width * 0.5;
        const distancia = bordeCirculo - contentRect.left + MARGEN;

        desplazamientoTexto = Math.max(distancia, 0);

        heroContent.style.transform = "";

    }

    // Aplica un valor de progreso (0 a 1) ya suavizado a todos los elementos
    function aplicarProgreso(valorSuavizado) {

        const progreso = easeInOutQuad(valorSuavizado);

        // Circunferencia: se achica hacia el borde izquierdo y se desvanece
        circuloLogo.style.opacity = String(1 - progreso);
        circuloLogo.style.transform = `scaleX(${1 - progreso * 0.92})`;

        // Texto: pasa de estar corrido a la derecha, a su lugar normal
        heroContent.style.transform =
            `translateX(${desplazamientoTexto * (1 - progreso)}px)`;

        // Círculos rojo/amarillo normales: aparecen
        circulosDecoracion.forEach(function (c) {
            c.style.opacity = String(progreso);
        });

        // Logo del header: aparece a medida que la circunferencia se va
        if (logoHeader) {
            logoHeader.style.opacity = String(progreso);
        }

    }

    // Loop continuo: en cada cuadro, el progreso "actual" se acerca
    // un poquito más al progreso "objetivo" (el que marca el scroll real).
    // Eso es lo que da la sensación de deslizamiento suave, en vez de
    // saltar exactamente lo que salta el scroll (que con mouse suele
    // avanzar a los tirones).
    function loop() {

        if (window.innerWidth <= 900) {
            heroContent.style.transform = "";
            if (logoHeader) logoHeader.style.opacity = "1";
            loopActivo = false;
            return;
        }

        progresoObjetivo = Math.min(window.scrollY / RANGO_SCROLL, 1);
        progresoActual += (progresoObjetivo - progresoActual) * SUAVIZADO;

        // Si ya casi llegó, lo dejamos exacto y frenamos el loop
        // (para no gastar CPU de más sin necesidad).
        if (Math.abs(progresoObjetivo - progresoActual) < 0.0015) {

            progresoActual = progresoObjetivo;
            aplicarProgreso(progresoActual);
            loopActivo = false;
            return;

        }

        aplicarProgreso(progresoActual);

        requestAnimationFrame(loop);

    }

    function iniciarLoop() {

        if (!loopActivo) {
            loopActivo = true;
            requestAnimationFrame(loop);
        }

    }

    function alRedimensionar() {
        calcularDesplazamiento();
        iniciarLoop();
    }

    calcularDesplazamiento();

    // Arranca ya en la posición correcta según el scroll actual
    // (por si la página carga con la vista ya corrida).
    progresoActual = Math.min(window.scrollY / RANGO_SCROLL, 1);
    progresoObjetivo = progresoActual;
    aplicarProgreso(progresoActual);

    window.addEventListener("scroll", iniciarLoop, { passive: true });
    window.addEventListener("resize", alRedimensionar);

}


// ==========================================
// EJECUTAR
// ==========================================

mostrarMipymes();
mostrarBanners();
configurarBotonesContacto();
activarScrollSuave();
activarHeroLogoGrande();
