// ==========================================
// TRANSICIÓN ENTRE PÁGINAS
// ==========================================
//
// Controla la pantalla de carga con el logo
// (el div#page-loader que está al principio
// del <body>, en index.html y ficha.html).
//
// Se muestra en dos casos:
//
//   1) Al entrar a la página: ya viene visible
//      desde el HTML (para que no haya un
//      "flash" del contenido sin cargar), y
//      este script la oculta con un fundido
//      suave apenas todo terminó de cargar.
//
//   2) Al hacer clic en un link que lleva a
//      OTRA página del sitio (ej: click en una
//      mipyme, o en "Volver a Mipymes"): se
//      vuelve a mostrar antes de navegar, para
//      que la transición se sienta continua.
//
// NO se activa con: anchors dentro de la misma
// página (#...), links externos, links con
// target="_blank", mailto:, tel:, ni con el
// clic en una mipyme desde la ficha.js (eso
// no existe, pero por las dudas se cubre
// cualquier link con destino a otro dominio).
// ==========================================

(function () {

    const loader = document.getElementById("page-loader");

    if (!loader) return;

    const DURACION_MINIMA_MS = 320;
    const DEMORA_ANTES_DE_NAVEGAR_MS = 260;

    const inicio = performance.now();


    // ==========================================
    // OCULTAR EL LOADER (página ya cargada)
    // ==========================================

    function ocultarLoader() {

        const transcurrido = performance.now() - inicio;
        const espera = Math.max(DURACION_MINIMA_MS - transcurrido, 0);

        setTimeout(function () {
            loader.classList.add("page-loader-oculto");
        }, espera);

    }

    if (document.readyState === "complete") {
        ocultarLoader();
    } else {
        window.addEventListener("load", ocultarLoader);
    }


    // ==========================================
    // MOSTRAR EL LOADER ANTES DE NAVEGAR
    // ==========================================

    // Devuelve true solo si el link apunta a otra
    // página HTML dentro del mismo sitio (no un
    // ancla, no un link externo, no target="_blank").
    function esNavegacionAOtraPagina(link) {

        if (!link) return false;

        if (link.target && link.target !== "_self") return false;
        if (link.hasAttribute("download")) return false;

        const href = link.getAttribute("href");

        if (!href) return false;
        if (href.startsWith("#")) return false;
        if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

        let destino;

        try {
            destino = new URL(href, window.location.href);
        } catch (e) {
            return false;
        }

        if (destino.origin !== window.location.origin) return false;

        // Mismo archivo + mismo hash → es solo un
        // ancla dentro de la página actual, no una
        // navegación real. (Ej: en index.html, un
        // link a "#mipymes" ya se filtró arriba,
        // pero por las dudas lo cubrimos también acá
        // para "./index.html#mipymes" estando ya en
        // index.html).
        const mismoArchivo = destino.pathname === window.location.pathname;

        if (mismoArchivo && destino.hash) return false;

        return true;

    }

    document.addEventListener("click", function (evento) {

        const link = evento.target.closest("a");

        if (!esNavegacionAOtraPagina(link)) return;

        evento.preventDefault();

        loader.classList.remove("page-loader-oculto");

        setTimeout(function () {
            window.location.href = link.href;
        }, DEMORA_ANTES_DE_NAVEGAR_MS);

    });


    // ==========================================
    // FUNCIÓN GLOBAL PARA NAVEGACIONES HECHAS
    // DESDE JS (no desde un <a>), como el click
    // en una tarjeta de mipyme en app.js.
    // ==========================================

    window.transicionAPagina = function (url) {

        loader.classList.remove("page-loader-oculto");

        setTimeout(function () {
            window.location.href = url;
        }, DEMORA_ANTES_DE_NAVEGAR_MS);

    };

})();
