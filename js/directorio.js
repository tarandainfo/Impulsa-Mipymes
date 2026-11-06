// ==========================================
// DIRECTORIO.JS — "Guía de mipymes" (agenda A–Z)
// ==========================================
//
// No hace falta tocar este archivo: las mipymes de la guía
// se cargan en js/directorio-data.js (ahí hay una
// explicación paso a paso).
//
// Qué hace:
//   - Lee la lista, descarta lo mal cargado y arma los links.
//   - Dibuja la agenda: rubros a la izquierda, filtro por red
//     social, búsqueda, y los nombres de la A a la Z.
//   - Si la lista está vacía, la sección queda oculta (y su
//     enlace del menú también).
//   - La guía está OCULTA por completo hasta que alguien toca
//     "Guía de Mipymes" (en el menú de arriba, junto al buscador, en
//     el pie de página o con un link terminado en #directorio).
//     Entonces aparece, y el botón "Cerrar la guía" la vuelve a ocultar.
//     Para que esté siempre a la vista, en js/directorio-data.js, dentro
//     de DIRECTORIO_CONFIG, agregá:   visibleAlCargar: true,
// ==========================================

(function () {

    "use strict";

    const seccion = document.getElementById("directorio");

    if (!seccion || typeof DIRECTORIO_DATA === "undefined" || !window.DirectorioEnlaces) return;

    const ENLACES = window.DirectorioEnlaces;

    const config = Object.assign(
        { porPagina: 12, incluirDestacadas: true, visibleAlCargar: false },
        (typeof DIRECTORIO_CONFIG !== "undefined") ? DIRECTORIO_CONFIG : {}
    );

    // La lista (destacadas + guía) y la búsqueda las arma js/buscador.js: la misma
    // búsqueda (texto, rubro y ciudad) filtra las destacadas y esta guía a la vez.
    const BUSC = window.Buscador;

    if (!BUSC) {
        console.warn("[Directorio] Falta js/buscador.js: la guía no se puede mostrar.");
        return;
    }

    const resultado = BUSC.resultado;

    // Sin mipymes cargadas (ni destacadas): la sección no se muestra
    if (!resultado.entradas.length) return;

    const ENTRADAS = ENLACES.ordenar(resultado.entradas);
    const RUBROS = resultado.rubros;

    // Íconos de cada red
    const ICONOS = {

        instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.25" fill="currentColor"/></svg>',

        facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.7h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.5-1.5h1.6V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z"/></svg>',

        whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.24-.45.06-.98.08-1.58-.1-.36-.11-.83-.27-1.43-.53-2.52-1.09-4.16-3.63-4.29-3.8-.13-.17-1.03-1.37-1.03-2.61 0-1.24.65-1.85.88-2.1.22-.25.49-.31.65-.31.16 0 .33 0 .47.01.15.01.35-.06.55.42.2.49.69 1.68.75 1.8.06.12.1.27.02.44-.08.17-.12.27-.24.42-.12.15-.25.33-.36.44-.12.12-.24.25-.1.49.14.24.61 1.01 1.32 1.63.91.8 1.67 1.05 1.91 1.17.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.21.08 1.36.64 1.6.76.24.12.4.18.46.28.06.11.06.61-.16 1.23z"/></svg>',

        tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3c.3 2.3 1.6 3.7 3.9 3.9v2.8c-1.4.1-2.6-.3-3.9-1.1v5.9c0 3.4-2.3 5.7-5.5 5.7-3 0-5.4-2.3-5.4-5.3 0-3.2 2.6-5.6 5.9-5.2v2.9c-1.6-.4-3 .6-3 2.2 0 1.3 1 2.3 2.2 2.3 1.4 0 2.3-.9 2.3-2.5V3h3.5z"/></svg>',

        web: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c2.8 3 2.8 15 0 18M12 3c-2.8 3-2.8 15 0 18" fill="none" stroke="currentColor" stroke-width="2"/></svg>'

    };

    const cuerpo = document.getElementById("dir-cuerpo");
    const contador = document.getElementById("dir-contador");
    const vacio = document.getElementById("dir-vacio");
    const buscador = document.getElementById("dir-q");

    // Lo único propio de la guía: el filtro por red social y el "Ver las N restantes"
    const estado = { red: "todas", pagina: 1 };

    // Qué redes se usan (para armar los filtros de red)
    const redesUsadas = [];

    ENTRADAS.forEach(function (e) {
        if (redesUsadas.indexOf(e.red) < 0) redesUsadas.push(e.red);
    });

    const ORDEN_REDES = ["instagram", "facebook", "whatsapp", "tiktok", "web"];

    redesUsadas.sort(function (a, b) {
        return ORDEN_REDES.indexOf(a) - ORDEN_REDES.indexOf(b);
    });


    function esc(texto) {

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }

    // Texto sin tildes ni mayúsculas, letra por letra (así el largo no cambia)
    function normalizar(texto) {

        return Array.from(String(texto)).map(function (c) {
            return c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }).join("");

    }

    // Resalta en el nombre cada palabra buscada (sin importar tildes ni mayúsculas)
    function resaltar(nombre) {

        const palabras = BUSC.palabras();

        if (!palabras.length) return esc(nombre);

        const letras = Array.from(String(nombre));
        let normal = "";
        const dueno = [];                      // a qué letra del nombre pertenece cada letra del texto normalizado

        letras.forEach(function (c, i) {

            const n = c.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

            for (let k = 0; k < n.length; k++) dueno.push(i);

            normal += n;

        });

        const marcadas = letras.map(function () { return false; });
        let alguna = false;

        palabras.forEach(function (p) {

            let i = normal.indexOf(p);

            while (i >= 0) {

                for (let k = i; k < i + p.length; k++) marcadas[dueno[k]] = true;

                alguna = true;
                i = normal.indexOf(p, i + p.length);

            }

        });

        if (!alguna) return esc(nombre);

        let html = "";
        let abierta = false;

        letras.forEach(function (c, i) {

            if (marcadas[i] && !abierta) { html += "<mark>"; abierta = true; }
            if (!marcadas[i] && abierta) { html += "</mark>"; abierta = false; }

            html += esc(c);

        });

        return html + (abierta ? "</mark>" : "");

    }

    function filtrar() {

        return ENTRADAS.filter(function (e) {

            if (!BUSC.coincide(e)) return false;
            if (estado.red !== "todas" && e.red !== estado.red) return false;

            return true;

        });

    }

    function dibujar() {

        const lista = filtrar();

        const busqueda = BUSC.obtener();
        const sinFiltros = !BUSC.hayFiltros() && estado.red === "todas";

        // La lista se muestra de a "porPagina" (12). El paginador aparece solo si hay más de una página.
        const porPagina = Math.max(1, parseInt(config.porPagina, 10) || 12);
        const totalPaginas = Math.max(1, Math.ceil(lista.length / porPagina));

        if (estado.pagina > totalPaginas) estado.pagina = totalPaginas;
        if (estado.pagina < 1) estado.pagina = 1;

        const desde = (estado.pagina - 1) * porPagina;
        const visibles = lista.slice(desde, desde + porPagina);

        // ----- rubros (columna izquierda) -----
        const cuentasRubro = BUSC.contar("rubro");
        const totalRubros = Object.keys(cuentasRubro).reduce(function (suma, k) { return suma + cuentasRubro[k]; }, 0);

        let botonesRubro =
            '<button type="button" class="dir-btn" data-rubro="todos" aria-pressed="' + (!busqueda.rubro) + '">Todos <span>' + totalRubros + '</span></button>';

        RUBROS.forEach(function (r) {

            const n = cuentasRubro[r] || 0;
            const apagado = n === 0 && busqueda.rubro !== r;

            botonesRubro +=
                '<button type="button" class="dir-btn" data-rubro="' + esc(r) + '" aria-pressed="' + (busqueda.rubro === r) + '"' + (apagado ? " disabled" : "") + '>' +
                esc(r) + ' <span>' + n + '</span></button>';

        });

        // ----- redes (chips) -----
        let chips =
            '<button type="button" class="dir-chip" data-red="todas" aria-pressed="' + (estado.red === "todas") + '">Todas las redes</button>';

        redesUsadas.forEach(function (r) {
            chips +=
                '<button type="button" class="dir-chip" data-red="' + r + '" aria-pressed="' + (estado.red === r) + '">' +
                ICONOS[r] + esc(ENLACES.REDES[r].nombre) + '</button>';
        });

        // ----- nombres, agrupados por letra -----
        let html = "";
        let letraActual = "";
        let listaAbierta = false;

        visibles.forEach(function (e) {

            const letra = ENLACES.letraDe(e.nombre);

            if (letra !== letraActual) {

                if (listaAbierta) html += "</ul>";

                letraActual = letra;
                html += '<h3 class="dir-letra" aria-hidden="true">' + letra + '</h3><ul class="dir-lista">';
                listaAbierta = true;

            }

            const nombreRed = ENLACES.REDES[e.red].nombre;

            html +=
                '<li><a class="dir-enlace dir-fila" href="' + esc(e.url) + '" target="_blank" rel="nofollow noopener noreferrer"' +
                ' data-rubro="' + esc(e.rubro) + '" data-red="' + e.red + '" data-nombre="' + esc(e.nombre) + '">' +
                '<span class="dir-nombre">' + resaltar(e.nombre) + (e.verificada && window.Verificada ? window.Verificada.html(false) : '') + '</span>' +
                '<span class="dir-rubro-etq">' + esc(e.rubro) + (e.ciudad ? " · " + esc(e.ciudad) : "") + '</span>' +
                '<span class="dir-red">' + ICONOS[e.red] + esc(nombreRed) + '</span>' +
                '<span class="dir-flecha" aria-hidden="true">→</span>' +
                '<span class="vh"> — ' + esc(e.rubro) + (e.ciudad ? ", " + esc(e.ciudad) : "") + ', en ' + esc(nombreRed) + ' (se abre en una pestaña nueva)</span>' +
                '</a></li>';

        });

        if (listaAbierta) html += "</ul>";

        // ----- paginador (solo si hay más de una página) -----
        let paginador = "";
        let estadoPagina = "";

        if (totalPaginas > 1) {

            const hasta = Math.min(desde + porPagina, lista.length);

            estadoPagina =
                '<p class="dir-paginacion-estado" id="dir-paginacion-estado" tabindex="-1" role="status">' +
                "Mostrando " + (desde + 1) + " a " + hasta + " de " + lista.length + " mipymes" +
                "</p>";

            // 1 … anterior, actual, siguiente … última
            const mostrar = {};

            [1, totalPaginas, estado.pagina - 1, estado.pagina, estado.pagina + 1].forEach(function (n) {
                if (n >= 1 && n <= totalPaginas) mostrar[n] = true;
            });

            let numeros = "";
            let previo = 0;

            Object.keys(mostrar).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) {

                if (previo && n - previo > 1) numeros += '<span class="dir-pag-pts" aria-hidden="true">…</span>';

                numeros +=
                    '<button type="button" class="dir-pag dir-pag-num" data-pag="' + n + '"' +
                    (n === estado.pagina ? ' aria-current="page"' : "") +
                    ' aria-label="Página ' + n + ' de ' + totalPaginas + '">' + n + "</button>";

                previo = n;

            });

            paginador =
                '<nav class="dir-paginas" aria-label="Páginas de la guía">' +
                '<div class="dir-paginas-botones">' +
                '<button type="button" class="dir-pag dir-pag-flecha" data-pag="' + (estado.pagina - 1) + '"' + (estado.pagina === 1 ? " disabled" : "") + ' aria-label="Página anterior">‹<span class="dir-pag-txt"> Anterior</span></button>' +
                numeros +
                '<span class="dir-pag-estado" aria-hidden="true">Página ' + estado.pagina + " de " + totalPaginas + "</span>" +
                '<button type="button" class="dir-pag dir-pag-flecha" data-pag="' + (estado.pagina + 1) + '"' + (estado.pagina === totalPaginas ? " disabled" : "") + ' aria-label="Página siguiente"><span class="dir-pag-txt">Siguiente </span>›</button>' +
                "</div></nav>";

        }

        cuerpo.className = "dir-b";

        cuerpo.innerHTML =
            '<div class="dir-filtros"><h3>Rubros</h3><div class="dir-rubros">' + botonesRubro + '</div></div>' +
            '<div class="dir-panel">' +
            '<div class="dir-redes" role="group" aria-label="Filtrar por red social">' + chips + '</div>' +
            estadoPagina + html + paginador +
            '</div>';

        // ----- contador y mensaje de "sin resultados" -----
        contador.textContent = !sinFiltros
            ? lista.length + (lista.length === 1 ? " resultado" : " resultados")
            : ENTRADAS.length + (ENTRADAS.length === 1 ? " mipyme" : " mipymes") + " en " + RUBROS.length + (RUBROS.length === 1 ? " rubro" : " rubros");

        vacio.hidden = lista.length > 0;

    }

    // Después de volver a dibujar, el foco vuelve al botón que se tocó
    function devolverFoco(selector) {

        const el = cuerpo.querySelector(selector);

        if (el) el.focus();

    }

    function reportar(a) {

        const datos = {
            directorio_nombre: a.dataset.nombre || "",
            directorio_rubro: a.dataset.rubro || "",
            directorio_red: a.dataset.red || ""
        };

        if (typeof window.gtag === "function") {
            window.gtag("event", "directorio_click", datos);
        }

        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push(Object.assign({ event: "directorio_click" }, datos));
        }

        document.dispatchEvent(new CustomEvent("directorio", { detail: datos }));

    }


    // ---------- eventos ----------

    // El campo de búsqueda de la guía y la barra de arriba comparten la misma búsqueda
    buscador.addEventListener("input", function (e) {

        BUSC.cambiar({ q: e.target.value });

    });

    BUSC.suscribir(function () {

        const q = BUSC.obtener().q;

        if (document.activeElement !== buscador && buscador.value !== q) buscador.value = q;

        estado.pagina = 1;

        dibujar();

    });

    buscador.value = BUSC.obtener().q;

    seccion.addEventListener("click", function (e) {

        const enlace = e.target.closest("a.dir-enlace");

        if (enlace) {
            reportar(enlace);
            return;
        }

        const pag = e.target.closest(".dir-pag");

        if (pag) {

            if (pag.disabled) return;

            estado.pagina = parseInt(pag.dataset.pag, 10) || 1;
            dibujar();

            // Se vuelve al principio de la lista y el foco queda ahí ("Mostrando 13 a 24 de…")
            const panel = cuerpo.querySelector(".dir-panel");
            const aviso = document.getElementById("dir-paginacion-estado");

            if (panel) panel.scrollIntoView({ behavior: reducirMovimiento ? "auto" : "smooth", block: "start" });
            if (aviso) aviso.focus({ preventScroll: true });

            return;

        }

        const rubro = e.target.closest(".dir-btn");

        if (rubro) {
            if (rubro.disabled) return;
            BUSC.cambiar({ rubro: rubro.dataset.rubro === "todos" ? "" : rubro.dataset.rubro });
            devolverFoco('.dir-btn[aria-pressed="true"]');
            return;
        }

        const red = e.target.closest(".dir-chip");

        if (red) {
            estado.red = red.dataset.red;
            estado.pagina = 1;
            dibujar();
            devolverFoco('.dir-chip[aria-pressed="true"]');
        }

    });


    // ---------- botón "Quiero estar en la guía" (WhatsApp) ----------

    const unirse = document.getElementById("dir-unirse");

    if (unirse) {

        const config2 = (typeof INFONEGOCIOS_CONFIG !== "undefined") ? INFONEGOCIOS_CONFIG : {};
        const mensaje = config2.mensajeQuieroEstarEnLaGuia ||
            "Hola! Quiero que mi mipyme esté en la guía gratuita de Impulsa Mipymes.\nNombre: \nRubro: \nRed social (y link): ";

        if (config2.whatsapp) {
            unirse.href = "https://wa.me/" + config2.whatsapp + "?text=" + encodeURIComponent(mensaje);
        } else {
            unirse.hidden = true;
        }

    }


    // ---------- la guía: una línea que se despliega ----------
    //
    // Siempre se ve una sola línea ("Guía de mipymes · N mipymes · Desplegar"). Al tocarla se
    // despliega toda la guía. Los enlaces que también la abren (menú, pie de página y el que
    // está junto al buscador) se marcan con data-dir-nav.

    const enlacesGuia = Array.prototype.slice.call(document.querySelectorAll("[data-dir-nav]"));
    const cerrarBtn = document.getElementById("dir-cerrar");
    const linea = document.getElementById("dir-linea");
    const lineaTxt = document.getElementById("dir-linea-txt");
    const lineaN = document.getElementById("dir-linea-n");
    const contenido = document.getElementById("dir-contenido");
    const reducirMovimiento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let temporizador = null;

    if (lineaN) lineaN.textContent = ENTRADAS.length + (ENTRADAS.length === 1 ? " mipyme" : " mipymes");

    function estaAbierta() {
        return !contenido.hidden;
    }

    function marcar(abierta) {

        enlacesGuia.forEach(function (a) {
            a.setAttribute("aria-expanded", abierta ? "true" : "false");
        });

        if (linea) linea.setAttribute("aria-expanded", abierta ? "true" : "false");
        if (lineaTxt) lineaTxt.textContent = abierta ? "Plegar" : "Desplegar";

        seccion.classList.toggle("dir-abierta", abierta);

    }

    function mostrar() {

        marcar(true);

        if (estaAbierta()) return;

        contenido.hidden = false;

        if (!reducirMovimiento) {

            contenido.classList.add("dir-aparece");

            clearTimeout(temporizador);
            temporizador = setTimeout(function () { contenido.classList.remove("dir-aparece"); }, 700);

        }

    }

    function ocultar() {

        if (!estaAbierta()) return;

        // La línea queda donde estaba en la pantalla, para que al plegar la página no "salte".
        const antes = linea.getBoundingClientRect().top;

        contenido.hidden = true;
        marcar(false);

        if (window.location.hash === "#directorio") {
            try {
                window.history.replaceState(null, "", window.location.pathname + window.location.search);
            } catch (error) { /* sin historial: no pasa nada */ }
        }

        const lugar = Math.min(Math.max(antes, 96), Math.max(96, window.innerHeight - 140));

        window.scrollBy({ top: linea.getBoundingClientRect().top - lugar, behavior: "auto" });

        linea.focus({ preventScroll: true });

    }

    if (linea) {

        linea.addEventListener("click", function () {

            if (estaAbierta()) {
                ocultar();
                return;
            }

            mostrar();

            // Si la línea quedó abajo en la pantalla, se sube para que se vea la guía que se abrió
            const arriba = linea.getBoundingClientRect().top;

            if (arriba > window.innerHeight * 0.45) {
                window.scrollBy({ top: arriba - 96, behavior: reducirMovimiento ? "auto" : "smooth" });
            }

        });

    }

    if (cerrarBtn) cerrarBtn.addEventListener("click", ocultar);

    // Cualquier enlace a #directorio la despliega. Se escucha en la "fase de captura" (el último
    // parámetro, true) para que la guía ya esté abierta cuando el desplazamiento suave de
    // app.js calcule hasta dónde bajar.
    document.addEventListener("click", function (e) {

        const a = e.target.closest && e.target.closest('a[href="#directorio"]');

        if (a) mostrar();

    }, true);

    window.addEventListener("hashchange", function () {

        if (window.location.hash === "#directorio") mostrar();

    });

    enlacesGuia.forEach(function (a) {
        a.hidden = false;
    });

    dibujar();

    if (config.visibleAlCargar) mostrar();

    // Llegar con el link #directorio la despliega y baja hasta ella
    if (window.location.hash === "#directorio") {
        mostrar();
        seccion.scrollIntoView({ block: "start" });
    }

    // Para poder probar la lógica
    window.Directorio = {
        entradas: ENTRADAS,
        rubros: RUBROS,
        mostrar: mostrar,
        ocultar: ocultar,
        estaVisible: estaAbierta
    };

})();
