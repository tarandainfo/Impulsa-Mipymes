// ==========================================
// ORDEN DE LAS MIPYMES DESTACADAS: TURNOS PAREJOS
// ==========================================
//
// Las mipymes destacadas se muestran por turnos: cada día todas
// se corren un lugar hacia arriba, y la que estaba primera pasa al
// final. Así, con el tiempo, TODAS pasan la misma cantidad de días
// arriba (por ejemplo, con 10 mipymes y 3 por página, cada una está
// en la primera página 3 de cada 10 días).
//
// Reglas:
//   • El día cambia a las 00:00 de Paraguay (zona "America/Asuncion"),
//     sin importar desde dónde se mire la web.
//   • Todos los visitantes ven el mismo orden durante todo el día.
//   • El orden no cambia mientras alguien está mirando la página:
//     se calcula al abrirla. Por eso la página 2 siempre sigue a la 1.
//   • El orden "de base" es el de js/mipymes-data.js: el día de
//     inicio (más abajo) abre la primera de esa lista; al día
//     siguiente, la segunda; y así.
//   • La portada rotativa arranca con la que quedó primera ese día.
//   • La guía de mipymes NO rota: sigue de la A a la Z.
//
// Para cambiarlo (opcional), en js/config.js:
//   ordenDestacadas: "manual",      → vuelve al orden fijo de mipymes-data.js
//   ordenInicio: "2026-11-02",      → el día en que abre la primera de la lista
//
// Para ver cómo queda otro día, agregá a la dirección de la web:
//   ?orden=2026-11-05               → el orden de ese día
//   ?orden=manual                   → el orden fijo
// (solo lo ve quien lo escribe; no cambia nada para el público).
// ==========================================

const ORDEN_INICIO_POR_DEFECTO = "2026-11-02";
const ZONA_HORARIA_ORDEN = "America/Asuncion";

// Fecha de hoy en Paraguay, como "AAAA-MM-DD"
function hoyEnParaguay() {

    try {

        return new Intl.DateTimeFormat("en-CA", {
            timeZone: ZONA_HORARIA_ORDEN,
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }).format(new Date());

    } catch (error) {

        // Si el navegador no sabe de zonas horarias: se usa la fecha del dispositivo
        const d = new Date();

        return d.getFullYear() + "-" +
            String(d.getMonth() + 1).padStart(2, "0") + "-" +
            String(d.getDate()).padStart(2, "0");

    }

}

// ¿Es una fecha "AAAA-MM-DD" que existe de verdad?
function fechaValida(texto) {

    if (typeof texto !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;

    const p = texto.split("-").map(Number);
    const d = new Date(Date.UTC(p[0], p[1] - 1, p[2]));

    return d.getUTCFullYear() === p[0] && d.getUTCMonth() === p[1] - 1 && d.getUTCDate() === p[2];

}

// Días enteros desde 1970 hasta esa fecha (sin horas: solo el calendario)
function diasDelCalendario(fecha) {

    const p = fecha.split("-").map(Number);

    return Math.round(Date.UTC(p[0], p[1] - 1, p[2]) / 86400000);

}

// Devuelve la lista de mipymes en el orden de hoy (no modifica la original)
function ordenarDestacadas(lista) {

    const config = (typeof INFONEGOCIOS_CONFIG !== "undefined") ? INFONEGOCIOS_CONFIG : {};

    // ?orden=AAAA-MM-DD  o  ?orden=manual  (para probar)
    let pedido = null;

    try {
        pedido = new URLSearchParams(window.location.search).get("orden");
    } catch (error) { /* sin parámetros */ }

    const modo = (pedido === "manual")
        ? "manual"
        : String(config.ordenDestacadas || "turnos").toLowerCase();

    if (modo === "manual" || lista.length < 2) return lista.slice();

    const inicio = fechaValida(config.ordenInicio) ? config.ordenInicio : ORDEN_INICIO_POR_DEFECTO;
    const hoy = fechaValida(pedido) ? pedido : hoyEnParaguay();

    const n = lista.length;
    const dias = diasDelCalendario(hoy) - diasDelCalendario(inicio);
    const corrimiento = ((dias % n) + n) % n;     // sirve también si la fecha es anterior al inicio

    return lista.slice(corrimiento).concat(lista.slice(0, corrimiento));

}

// Lo usan app.js, las páginas por rubro y ciudad, y las pruebas
window.OrdenDestacadas = {
    ordenar: ordenarDestacadas,
    hoyEnParaguay: hoyEnParaguay,
    fechaValida: fechaValida
};
