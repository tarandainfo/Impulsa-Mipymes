// ==========================================
// VERIFICADA.JS — palomita de "mipyme verificada"
// ==========================================
//
// No hace falta tocar este archivo.
//
// La palomita (un sello azul con tilde, como el de las redes
// sociales) es para las mipymes que pagaron por estar
// destacadas. REGLA:
//
//   • Toda mipyme que está en js/mipymes-data.js (las destacadas)
//     lleva la palomita, sin tener que hacer nada.
//   • Si alguna vez una destacada NO debe llevarla, se le agrega
//     en sus datos la línea:   verificada: false,
//   • En la guía de mipymes, una fila lleva la palomita cuando esa
//     mipyme también está en destacadas. Las que están SOLO en la
//     guía (la lista gratuita) nunca la llevan. Eso lo resuelve
//     js/directorio-enlaces.js comparando los nombres.
//
// La palomita aparece sola junto al nombre en: la portada
// rotativa, las tarjetas de "Mipymes destacadas", la ficha
// y la guía de mipymes.
//
// Al pasar el mouse (o tocarla) muestra un globo con el texto de
// ayuda. Para cambiar ese texto, agregá en js/config.js:
//
//     textoMipymeVerificada: "Mipyme verificada por Infonegocios",
//
// ==========================================

(function () {

    "use strict";

    const config = (typeof INFONEGOCIOS_CONFIG !== "undefined") ? INFONEGOCIOS_CONFIG : {};

    const AYUDA = config.textoMipymeVerificada || "Mipyme verificada por Infonegocios";

    // Lo que leen los lectores de pantalla
    const ETIQUETA = "Mipyme verificada";

    function esc(texto) {

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

    }

    // Sello festoneado de 8 lóbulos + tilde
    const SVG =
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<path class="verif-fondo" d="M23.50 12.00 L23.48 12.30 L23.41 12.60 L23.29 12.89 L23.14 13.17 L22.96 13.44 L22.74 13.70 L22.52 13.95 L22.28 14.18 L22.04 14.41 L21.80 14.63 L21.59 14.84 L21.39 15.05 L21.22 15.26 L21.07 15.48 L20.96 15.71 L20.88 15.95 L20.82 16.21 L20.80 16.48 L20.79 16.77 L20.79 17.07 L20.80 17.39 L20.81 17.72 L20.81 18.06 L20.80 18.39 L20.77 18.73 L20.71 19.05 L20.61 19.36 L20.49 19.64 L20.33 19.90 L20.13 20.13 L19.90 20.33 L19.64 20.49 L19.36 20.61 L19.05 20.71 L18.73 20.77 L18.39 20.80 L18.06 20.81 L17.72 20.81 L17.39 20.80 L17.07 20.79 L16.77 20.79 L16.48 20.80 L16.21 20.82 L15.95 20.88 L15.71 20.96 L15.48 21.07 L15.26 21.22 L15.05 21.39 L14.84 21.59 L14.63 21.80 L14.41 22.04 L14.18 22.28 L13.95 22.52 L13.70 22.74 L13.44 22.96 L13.17 23.14 L12.89 23.29 L12.60 23.41 L12.30 23.48 L12.00 23.50 L11.70 23.48 L11.40 23.41 L11.11 23.29 L10.83 23.14 L10.56 22.96 L10.30 22.74 L10.05 22.52 L9.82 22.28 L9.59 22.04 L9.37 21.80 L9.16 21.59 L8.95 21.39 L8.74 21.22 L8.52 21.07 L8.29 20.96 L8.05 20.88 L7.79 20.82 L7.52 20.80 L7.23 20.79 L6.93 20.79 L6.61 20.80 L6.28 20.81 L5.94 20.81 L5.61 20.80 L5.27 20.77 L4.95 20.71 L4.64 20.61 L4.36 20.49 L4.10 20.33 L3.87 20.13 L3.67 19.90 L3.51 19.64 L3.39 19.36 L3.29 19.05 L3.23 18.73 L3.20 18.39 L3.19 18.06 L3.19 17.72 L3.20 17.39 L3.21 17.07 L3.21 16.77 L3.20 16.48 L3.18 16.21 L3.12 15.95 L3.04 15.71 L2.93 15.48 L2.78 15.26 L2.61 15.05 L2.41 14.84 L2.20 14.63 L1.96 14.41 L1.72 14.18 L1.48 13.95 L1.26 13.70 L1.04 13.44 L0.86 13.17 L0.71 12.89 L0.59 12.60 L0.52 12.30 L0.50 12.00 L0.52 11.70 L0.59 11.40 L0.71 11.11 L0.86 10.83 L1.04 10.56 L1.26 10.30 L1.48 10.05 L1.72 9.82 L1.96 9.59 L2.20 9.37 L2.41 9.16 L2.61 8.95 L2.78 8.74 L2.93 8.52 L3.04 8.29 L3.12 8.05 L3.18 7.79 L3.20 7.52 L3.21 7.23 L3.21 6.93 L3.20 6.61 L3.19 6.28 L3.19 5.94 L3.20 5.61 L3.23 5.27 L3.29 4.95 L3.39 4.64 L3.51 4.36 L3.67 4.10 L3.87 3.87 L4.10 3.67 L4.36 3.51 L4.64 3.39 L4.95 3.29 L5.27 3.23 L5.61 3.20 L5.94 3.19 L6.28 3.19 L6.61 3.20 L6.93 3.21 L7.23 3.21 L7.52 3.20 L7.79 3.18 L8.05 3.12 L8.29 3.04 L8.52 2.93 L8.74 2.78 L8.95 2.61 L9.16 2.41 L9.37 2.20 L9.59 1.96 L9.82 1.72 L10.05 1.48 L10.30 1.26 L10.56 1.04 L10.83 0.86 L11.11 0.71 L11.40 0.59 L11.70 0.52 L12.00 0.50 L12.30 0.52 L12.60 0.59 L12.89 0.71 L13.17 0.86 L13.44 1.04 L13.70 1.26 L13.95 1.48 L14.18 1.72 L14.41 1.96 L14.63 2.20 L14.84 2.41 L15.05 2.61 L15.26 2.78 L15.48 2.93 L15.71 3.04 L15.95 3.12 L16.21 3.18 L16.48 3.20 L16.77 3.21 L17.07 3.21 L17.39 3.20 L17.72 3.19 L18.06 3.19 L18.39 3.20 L18.73 3.23 L19.05 3.29 L19.36 3.39 L19.64 3.51 L19.90 3.67 L20.13 3.87 L20.33 4.10 L20.49 4.36 L20.61 4.64 L20.71 4.95 L20.77 5.27 L20.80 5.61 L20.81 5.94 L20.81 6.28 L20.80 6.61 L20.79 6.93 L20.79 7.23 L20.80 7.52 L20.82 7.79 L20.88 8.05 L20.96 8.29 L21.07 8.52 L21.22 8.74 L21.39 8.95 L21.59 9.16 L21.80 9.37 L22.04 9.59 L22.28 9.82 L22.52 10.05 L22.74 10.30 L22.96 10.56 L23.14 10.83 L23.29 11.11 L23.41 11.40 L23.48 11.70Z"/>' +
        '<path class="verif-tilde" d="M7.4 12.6l3 3.1 6.2-7" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>';

    // conFoco = true  → se puede llegar con el teclado (o tocar en el celular) para ver el globo.
    // conFoco = false → para usar DENTRO de un link, donde no puede haber controles anidados.
    function html(conFoco) {

        return '<span class="verif" data-tip="' + esc(AYUDA) + '"' +
            (conFoco ? ' tabindex="0"' : '') +
            ' role="img" aria-label="' + ETIQUETA + '">' + SVG + '</span>';

    }

    // Toda mipyme destacada lleva la palomita, salvo que sus datos digan  verificada: false
    function esVerificada(mipyme) {

        return !!mipyme && mipyme.verificada !== false;

    }

    window.Verificada = {
        html: html,
        esVerificada: esVerificada
    };

})();
