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
//   - La guía es DESPLEGABLE: cerrada muestra solo el buscador y
//     los rubros. Se abre sola al escribir en su buscador, al tocar
//     un rubro, o al llegar desde el menú "Directorio" (#directorio).
//     Para que arranque abierta, en js/directorio-data.js, dentro de
//     DIRECTORIO_CONFIG, agregá:   abiertaAlCargar: true,
// ==========================================

(function () {

    "use strict";

    const seccion = document.getElementById("directorio");

    if (!seccion || typeof DIRECTORIO_DATA === "undefined" || !window.DirectorioEnlaces) return;

    const ENLACES = window.DirectorioEnlaces;

    const config = Object.assign(
        { filasIniciales: 14, incluirDestacadas: true, abiertaAlCargar: false },
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

    // La parte desplegable (si falta en el HTML, la guía queda siempre abierta, como antes)
    const toggle = document.getElementById("dir-toggle");
    const toggleTxt = document.getElementById("dir-toggle-txt");
    const cerrarBtn = document.getElementById("dir-cerrar");
    const chipsRubros = document.getElementById("dir-chips");
    const hayDesplegable = !!(toggle && toggleTxt && chipsRubros);

    if (!hayDesplegable) seccion.classList.remove("is-cerrada");

    // Lo único propio de la guía: el filtro por red social y el "Ver las N restantes"
    const estado = { red: "todas", verTodo: false };

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
        const tope = config.filasIniciales;
        const visibles = (sinFiltros && !estado.verTodo) ? lista.slice(0, tope) : lista;

        // ----- rubros (columna izquierda) -----
        const cuentasRubro = BUSC.contar("rubro");
        const totalRubros = Object.keys(cuentasRubro).reduce(function (suma, k) { return suma + cuentasRubro[k]; }, 0);

        actualizarChips(cuentasRubro, busqueda.rubro);

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

        // ----- botón "Ver las N restantes" -----
        let verMas = "";

        if (sinFiltros && lista.length > tope) {

            verMas =
                '<button type="button" class="dir-vermas" aria-expanded="' + estado.verTodo + '">' +
                (estado.verTodo ? "Ver menos" : "Ver las " + (lista.length - tope) + " mipymes restantes") +
                "</button>";

        }

        cuerpo.className = "dir-b";

        cuerpo.innerHTML =
            '<div class="dir-filtros"><h3>Rubros</h3><div class="dir-rubros">' + botonesRubro + '</div></div>' +
            '<div class="dir-panel">' +
            '<div class="dir-redes" role="group" aria-label="Filtrar por red social">' + chips + '</div>' +
            html + verMas +
            '</div>';

        // ----- contador y mensaje de "sin resultados" -----
        contador.textContent = !sinFiltros
            ? lista.length + (lista.length === 1 ? " resultado" : " resultados")
            : ENTRADAS.length + (ENTRADAS.length === 1 ? " mipyme" : " mipymes") + " en " + RUBROS.length + (RUBROS.length === 1 ? " rubro" : " rubros");

        vacio.hidden = lista.length > 0;

        ultimo = { cantidad: lista.length, sinFiltros: sinFiltros };
        actualizarBoton();

    }

    // ----- los rubros como botones (se ven con la guía cerrada) -----
    // Se arman una sola vez y después solo se actualizan: así no se pierde el lugar
    // de la fila deslizable en el celular cada vez que se escribe una letra.
    function prepararChips() {

        if (!chipsRubros) return;

        chipsRubros.innerHTML = RUBROS.map(function (r) {
            return '<button type="button" class="dir-chip dd-c-chip" data-rubro-chip="' + esc(r) + '" aria-pressed="false">' + esc(r) + ' <span>0</span></button>';
        }).join("");

    }

    function actualizarChips(cuentas, elegido) {

        if (!chipsRubros) return;

        Array.prototype.forEach.call(chipsRubros.children, function (b) {

            const r = b.getAttribute("data-rubro-chip");
            const n = cuentas[r] || 0;

            b.setAttribute("aria-pressed", elegido === r ? "true" : "false");
            b.disabled = n === 0 && elegido !== r;
            b.lastElementChild.textContent = n;

        });

    }

    // ----- abrir y cerrar la guía -----
    const reducirMovimiento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let temporizador = null;
    let ultimo = { cantidad: ENTRADAS.length, sinFiltros: true };

    function estaCerrada() {

        return seccion.classList.contains("is-cerrada");

    }

    // El texto del botón: "Ver toda la guía", "Ver los 3 resultados" o "Ocultar la lista"
    function actualizarBoton() {

        if (!hayDesplegable) return;

        if (!estaCerrada()) {
            toggleTxt.textContent = "Ocultar la lista";
        } else if (!ultimo.sinFiltros && ultimo.cantidad > 0) {
            toggleTxt.textContent = ultimo.cantidad === 1 ? "Ver el resultado" : "Ver los " + ultimo.cantidad + " resultados";
        } else {
            toggleTxt.textContent = "Ver toda la guía";
        }

    }

    function poner(abrir, opciones) {

        if (!hayDesplegable) return;

        opciones = opciones || {};

        if (abrir === !estaCerrada()) return;

        clearTimeout(temporizador);

        if (opciones.sinAnimar) {
            // sin animación (por ejemplo, al llegar con #directorio): se apaga un instante
            seccion.classList.add("dd-medir");
            requestAnimationFrame(function () { requestAnimationFrame(function () { seccion.classList.remove("dd-medir"); }); });
        }

        if (abrir) {

            seccion.classList.remove("is-cerrada");

            // cuando termina de abrirse, el contenido deja de recortarse (así la columna de rubros puede quedar fija al bajar)
            temporizador = setTimeout(function () { seccion.classList.add("dd-fin"); }, (opciones.sinAnimar || reducirMovimiento) ? 0 : 620);

        } else {

            seccion.classList.remove("dd-fin");
            seccion.classList.add("is-cerrada");

            // si al cerrar el comienzo de la sección quedó arriba, fuera de la pantalla, se vuelve a él
            if (opciones.volver && seccion.getBoundingClientRect().top < 0) {
                seccion.scrollIntoView({ block: "start", behavior: reducirMovimiento ? "auto" : "smooth" });
            }

        }

        toggle.setAttribute("aria-expanded", abrir ? "true" : "false");
        actualizarBoton();

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

        // al escribir en el buscador de la guía, la lista se abre sola
        if (e.target.value.trim()) poner(true);

    });

    buscador.addEventListener("keydown", function (e) {

        if (e.key === "Escape" && buscador.value) {
            e.preventDefault();
            buscador.value = "";
            BUSC.cambiar({ q: "" });
        }

    });

    BUSC.suscribir(function () {

        const q = BUSC.obtener().q;

        if (document.activeElement !== buscador && buscador.value !== q) buscador.value = q;

        dibujar();

    });

    buscador.value = BUSC.obtener().q;

    seccion.addEventListener("click", function (e) {

        // un rubro de la fila de arriba: filtra y, si se eligió uno, abre la lista
        const chipRubro = e.target.closest(".dd-c-chip");

        if (chipRubro) {

            if (chipRubro.disabled) return;

            const r = chipRubro.getAttribute("data-rubro-chip");
            const nuevo = BUSC.obtener().rubro === r ? "" : r;

            BUSC.cambiar({ rubro: nuevo });

            if (nuevo) poner(true);

            return;

        }

        const enlace = e.target.closest("a.dir-enlace");

        if (enlace) {
            reportar(enlace);
            return;
        }

        const verMas = e.target.closest(".dir-vermas");

        if (verMas) {
            estado.verTodo = !estado.verTodo;
            dibujar();
            devolverFoco(".dir-vermas");
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
            dibujar();
            devolverFoco('.dir-chip[aria-pressed="true"]');
        }

    });


    // ---------- abrir y cerrar a mano ----------

    if (hayDesplegable) {

        toggle.addEventListener("click", function () { poner(estaCerrada()); });

        if (cerrarBtn) {
            cerrarBtn.addEventListener("click", function () {
                poner(false, { volver: true });
                toggle.focus({ preventScroll: true });
            });
        }

    }

    // Llegar con el enlace #directorio (menú, pie de página o un link compartido) abre la guía
    function abrirSiPidenElDirectorio(alCargar) {

        if (window.location.hash !== "#directorio") return;

        poner(true, { sinAnimar: alCargar });

        if (alCargar) seccion.scrollIntoView({ block: "start" });

    }

    window.addEventListener("hashchange", function () { abrirSiPidenElDirectorio(false); });

    // tocar de nuevo un enlace a #directorio cuando la dirección ya lo tiene (no cambia el hash, pero tiene que abrir)
    document.addEventListener("click", function (e) {

        const a = e.target.closest && e.target.closest('a[href="#directorio"]');

        if (a) poner(true);

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


    // ---------- mostrar la sección y su enlace del menú ----------

    seccion.hidden = false;

    document.querySelectorAll("[data-dir-nav]").forEach(function (a) {
        a.hidden = false;
    });

    prepararChips();
    dibujar();

    if (config.abiertaAlCargar) poner(true, { sinAnimar: true });

    abrirSiPidenElDirectorio(true);

    // Para poder probar la lógica
    window.Directorio = {
        entradas: ENTRADAS,
        rubros: RUBROS,
        abrir: function () { poner(true); },
        cerrar: function () { poner(false); },
        estaCerrada: estaCerrada
    };

})();
