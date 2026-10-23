// ==========================================
// PAGINA-LISTA.JS — turnos parejos en las páginas por rubro y ciudad
// ==========================================
//
// No hace falta tocar este archivo.
//
// Las páginas rubros/..., ciudades/... listan primero las mipymes
// destacadas. Para que ninguna quede siempre primera, acá se les aplica
// la misma rotación por turnos de la portada (js/orden.js): cada día todas
// suben un lugar. La guía (las gratuitas) sigue de la A a la Z.
// ==========================================

(function () {

    "use strict";

    const lista = document.querySelector("[data-rotar]");

    if (!lista || !window.OrdenDestacadas) return;

    const destacadas = Array.prototype.slice.call(lista.children).filter(function (li) {
        return li.hasAttribute("data-destacada");
    });

    if (destacadas.length < 2) return;

    // Volver a agregarlas en el orden de hoy (las mueve, no las duplica)
    window.OrdenDestacadas.ordenar(destacadas).forEach(function (li) {
        lista.appendChild(li);
    });

})();
