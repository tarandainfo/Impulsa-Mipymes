// ==========================================
// THEME-INIT.JS
// ==========================================
//
// Se carga SIN "defer" y ANTES del <link> del
// CSS, para que el modo oscuro se aplique antes
// de que el navegador pinte la página (si no,
// se ve un flash blanco al cargar).
//
// Es el ÚNICO lugar donde se decide el tema
// inicial. Tanto index.html como ficha.html (y
// cualquier página nueva que se agregue) cargan
// este mismo archivo, así que siempre leen la
// misma preferencia guardada en localStorage.
// ==========================================

(function () {

    var tema = localStorage.getItem("tema");

    if (!tema) {

        tema = (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
            ? "dark"
            : "light";

    }

    if (tema === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
    }

})();
