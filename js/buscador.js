// ==========================================
// BUSCADOR.JS — búsqueda general + filtro por rubro y ciudad
// ==========================================
//
// No hace falta tocar este archivo.
//
// Hay UNA sola búsqueda para toda la página: la barra de arriba de
// "Mipymes destacadas" (buscador, rubro y ciudad) filtra a la vez las
// tarjetas de las destacadas y la guía de mipymes.
//
// Cómo busca:
//   • Sin importar mayúsculas ni tildes ("asuncion" encuentra "Asunción").
//   • Por palabras sueltas, en cualquier orden: "panadería san lorenzo"
//     encuentra las mipymes que tengan esas tres palabras entre su
//     nombre, rubro, ciudad y (las destacadas) su descripción.
//
// De dónde salen el rubro y la ciudad de cada mipyme:
//   • Destacadas: el rubro es el de su fila en la guía (o su categoría)
//     y la ciudad es lo que va antes de la coma en su "ubicacion".
//   • Gratuitas (solo en la guía): el rubro de su línea y, si la
//     cargaron, su "ciudad" (ver js/directorio-data.js).
//
// La búsqueda queda en la dirección de la web (?q=...&rubro=...&ciudad=...),
// así se puede compartir una búsqueda con un link.
// ==========================================

(function () {

    "use strict";

    const ENLACES = window.DirectorioEnlaces;

    if (!ENLACES || typeof MIPYMES_DATA === "undefined" || !MIPYMES_DATA.length) return;


    // ---------- la lista unificada (destacadas + guía) ----------

    const config = Object.assign(
        { incluirDestacadas: true },
        (typeof DIRECTORIO_CONFIG !== "undefined") ? DIRECTORIO_CONFIG : {}
    );

    const resultado = ENLACES.normalizarEntradas(
        (typeof DIRECTORIO_DATA !== "undefined") ? DIRECTORIO_DATA : [],
        (typeof DIRECTORIO_RUBROS !== "undefined") ? DIRECTORIO_RUBROS : [],
        {
            mipymes: MIPYMES_DATA,
            incluir: config.incluirDestacadas !== false,
            equivalencias: (typeof DIRECTORIO_EQUIVALENCIAS_RUBRO !== "undefined") ? DIRECTORIO_EQUIVALENCIAS_RUBRO : {}
        }
    );

    // Avisar (en la consola) de lo que no se pudo mostrar y por qué
    resultado.omitidas.forEach(function (o) {
        console.warn("[Directorio] Se omitió «" + o.nombre + "»: " + o.motivo);
    });

    const norm = ENLACES.claveNombre;

    // Cada mipyme destacada → su fila de la guía (de ahí salen su rubro y su ciudad)
    const entradaDeDestacada = {};

    resultado.entradas.forEach(function (e) {
        if (e.destacada) entradaDeDestacada[norm(e.nombre)] = e;
    });

    // Una destacada que no figura en la guía (por ejemplo si se apagó
    // incluirDestacadas) igual se puede buscar, con su categoría y su ubicación
    function entradaDe(mipyme) {

        const clave = norm(String(mipyme.nombre).trim().replace(/\s+/g, " "));

        if (entradaDeDestacada[clave]) return entradaDeDestacada[clave];

        const ciudad = ENLACES.ciudadDeUbicacion(mipyme.ubicacion);

        return {
            nombre: mipyme.nombre,
            rubro: String(mipyme.categoria || "").trim(),
            ciudad: ciudad,
            texto: [mipyme.nombre, mipyme.categoria, ciudad, mipyme.descripcion].join(" ")
        };

    }


    // ---------- el estado de la búsqueda ----------

    const estado = { q: "", rubro: "", ciudad: "" };

    let palabras = [];
    const oyentes = [];

    function recalcularPalabras() {

        palabras = norm(estado.q).split(/\s+/).filter(Boolean);

    }

    // ¿Esta mipyme cumple la búsqueda actual?
    // "ignorar" (rubro o ciudad) sirve para contar cuántas habría si ese filtro no estuviera.
    function coincide(entrada, ignorar) {

        if (ignorar !== "rubro" && estado.rubro && entrada.rubro !== estado.rubro) return false;

        if (ignorar !== "ciudad" && estado.ciudad && norm(entrada.ciudad || "") !== norm(estado.ciudad)) return false;

        if (palabras.length) {

            const texto = norm(entrada.texto || "");

            for (let i = 0; i < palabras.length; i++) {
                if (texto.indexOf(palabras[i]) < 0) return false;
            }

        }

        return true;

    }

    function filtrarDestacadas(lista) {

        return lista.filter(function (m) {
            return coincide(entradaDe(m));
        });

    }

    function hayFiltros() {

        return !!(estado.q.trim() || estado.rubro || estado.ciudad);

    }

    // Cuántas mipymes habría en cada rubro (o ciudad) con el resto de la búsqueda aplicada
    function contar(campo) {

        const cuentas = {};

        resultado.entradas.forEach(function (e) {

            if (!coincide(e, campo)) return;

            const valor = campo === "rubro" ? e.rubro : e.ciudad;

            if (valor) cuentas[valor] = (cuentas[valor] || 0) + 1;

        });

        return cuentas;

    }

    function totales() {

        let todas = 0;
        let destacadas = 0;

        resultado.entradas.forEach(function (e) {

            if (!coincide(e)) return;

            todas++;
            if (e.destacada) destacadas++;

        });

        return { todas: todas, destacadas: destacadas };

    }

    function avisar() {

        oyentes.slice().forEach(function (fn) { fn(); });

    }

    function suscribir(fn) {

        oyentes.push(fn);

    }


    // ---------- la dirección de la web (?q=&rubro=&ciudad=) ----------

    function leerDireccion() {

        let p;

        try {
            p = new URLSearchParams(window.location.search);
        } catch (error) {
            return;
        }

        estado.q = String(p.get("q") || "").slice(0, 80);

        const rubro = String(p.get("rubro") || "");
        const ciudad = String(p.get("ciudad") || "");

        // Solo valen rubros y ciudades que existen (si no, se ignoran)
        estado.rubro = resultado.rubros.filter(function (r) { return norm(r) === norm(rubro); })[0] || "";
        estado.ciudad = resultado.ciudades.filter(function (c) { return norm(c) === norm(ciudad); })[0] || "";

    }

    function escribirDireccion() {

        try {

            const p = new URLSearchParams(window.location.search);

            ["q", "rubro", "ciudad"].forEach(function (clave) {

                const valor = estado[clave].trim();

                if (valor) p.set(clave, valor);
                else p.delete(clave);

            });

            const texto = p.toString();

            window.history.replaceState(null, "", window.location.pathname + (texto ? "?" + texto : "") + window.location.hash);

        } catch (error) { /* sin historial: no pasa nada */ }

    }

    let temporizadorDireccion = null;

    function cambiar(parcial) {

        if (Object.prototype.hasOwnProperty.call(parcial, "q")) estado.q = String(parcial.q || "").slice(0, 80);
        if (Object.prototype.hasOwnProperty.call(parcial, "rubro")) estado.rubro = parcial.rubro || "";
        if (Object.prototype.hasOwnProperty.call(parcial, "ciudad")) estado.ciudad = parcial.ciudad || "";

        recalcularPalabras();
        avisar();

        clearTimeout(temporizadorDireccion);
        temporizadorDireccion = setTimeout(escribirDireccion, 150);

    }

    function limpiar() {

        cambiar({ q: "", rubro: "", ciudad: "" });

    }

    leerDireccion();
    recalcularPalabras();


    // ---------- la barra de arriba de "Mipymes destacadas" ----------

    function esc(texto) {

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }

    function iniciarBarra() {

        const barra = document.getElementById("buscador");

        if (!barra) return;

        // Con una sola mipyme no hay nada que filtrar
        if (resultado.entradas.length < 2) {
            barra.hidden = true;
            return;
        }

        const campoQ = document.getElementById("buscador-q");
        const selRubro = document.getElementById("buscador-rubro");
        const selCiudad = document.getElementById("buscador-ciudad");
        const botonLimpiar = document.getElementById("buscador-limpiar");
        const estadoEl = document.getElementById("buscador-estado");

        // "Todas las ciudades" solo tiene sentido si hay ciudades cargadas
        const filaCiudad = selCiudad ? selCiudad.closest(".buscador-sel") : null;
        if (filaCiudad && !resultado.ciudades.length) filaCiudad.hidden = true;

        function pintarSelect(select, titulo, valores, cuentas, elegido) {

            if (!select) return;

            const total = Object.keys(cuentas).reduce(function (suma, k) { return suma + cuentas[k]; }, 0);

            let html = '<option value="">' + esc(titulo) + '</option>';

            valores.forEach(function (v) {

                const n = cuentas[v] || 0;
                const apagada = n === 0 && v !== elegido;

                html += '<option value="' + esc(v) + '"' + (v === elegido ? " selected" : "") + (apagada ? " disabled" : "") + '>' +
                    esc(v) + " (" + n + ")</option>";

            });

            select.innerHTML = html;
            select.value = elegido || "";

            return total;

        }

        function pintar() {

            // el campo de texto: solo se reescribe si lo cambió otra parte de la página
            if (campoQ && document.activeElement !== campoQ && campoQ.value !== estado.q) campoQ.value = estado.q;

            pintarSelect(selRubro, "Todos los rubros", resultado.rubros, contar("rubro"), estado.rubro);
            pintarSelect(selCiudad, "Todas las ciudades", resultado.ciudades, contar("ciudad"), estado.ciudad);

            const t = totales();

            if (!hayFiltros()) {

                estadoEl.textContent = resultado.entradas.length + " mipymes en " + resultado.rubros.length +
                    (resultado.rubros.length === 1 ? " rubro" : " rubros") +
                    (resultado.ciudades.length ? " y " + resultado.ciudades.length + (resultado.ciudades.length === 1 ? " ciudad" : " ciudades") : "");

            } else if (t.todas === 0) {

                estadoEl.textContent = "No encontramos mipymes con esa búsqueda. Probá con otra palabra o limpiá los filtros.";

            } else {

                estadoEl.textContent = t.todas + (t.todas === 1 ? " mipyme encontrada" : " mipymes encontradas") +
                    (t.destacadas ? " · " + t.destacadas + (t.destacadas === 1 ? " destacada" : " destacadas") : "");

            }

            if (botonLimpiar) botonLimpiar.hidden = !hayFiltros();

        }

        if (campoQ) {

            campoQ.addEventListener("input", function () { cambiar({ q: campoQ.value }); });

            campoQ.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && campoQ.value) {
                    e.preventDefault();
                    campoQ.value = "";          // el campo está en uso: hay que vaciarlo acá, no lo reescribe la barra
                    cambiar({ q: "" });
                }
            });

        }

        if (selRubro) selRubro.addEventListener("change", function () { cambiar({ rubro: selRubro.value }); });
        if (selCiudad) selCiudad.addEventListener("change", function () { cambiar({ ciudad: selCiudad.value }); });
        if (botonLimpiar) botonLimpiar.addEventListener("click", function () { limpiar(); if (campoQ) campoQ.focus(); });

        suscribir(pintar);

        if (campoQ) campoQ.value = estado.q;

        pintar();

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarBarra);
    } else {
        iniciarBarra();
    }


    window.Buscador = {
        resultado: resultado,
        entradas: resultado.entradas,
        rubros: resultado.rubros,
        ciudades: resultado.ciudades,
        obtener: function () { return { q: estado.q, rubro: estado.rubro, ciudad: estado.ciudad }; },
        palabras: function () { return palabras.slice(); },
        coincide: coincide,
        filtrarDestacadas: filtrarDestacadas,
        hayFiltros: hayFiltros,
        contar: contar,
        totales: totales,
        cambiar: cambiar,
        limpiar: limpiar,
        suscribir: suscribir
    };

})();
