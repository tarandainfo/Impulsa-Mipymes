// ==========================================
// THEME.JS
// ==========================================
//
// Maneja el botón de modo oscuro (#theme-toggle).
// El tema inicial ya lo aplica js/theme-init.js
// (corre antes, sin defer, para evitar el flash).
//
// Este es el ÚNICO lugar que guarda el cambio en
// localStorage. Antes esta misma lógica estaba
// copiada en app.js Y en ficha.js por separado:
// si un día se actualizaba una copia y no la otra,
// el toggle quedaba desincronizado entre secciones.
// Centralizando acá, todas las páginas (actuales y
// las que se agreguen) comparten la misma orden.
// ==========================================

function activarModoOscuro() {

    const boton = document.getElementById("theme-toggle");

    if (!boton) return;

    function aplicarTema(tema) {

        if (tema === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }

        localStorage.setItem("tema", tema);

    }

    boton.addEventListener("click", function () {

        const temaActual = document.documentElement.getAttribute("data-theme") === "dark"
            ? "dark"
            : "light";

        aplicarTema(temaActual === "dark" ? "light" : "dark");

    });

}

activarModoOscuro();
