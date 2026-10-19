// ==========================================
// DIRECTORIO GRATUITO — GUÍA DE MIPYMES
// ==========================================
//
// ⚠️ ESTE ES EL ÚNICO ARCHIVO QUE EL ADMINISTRADOR
// EDITA PARA AGREGAR, CAMBIAR O SACAR UN NOMBRE DE LA GUÍA.
//
// La guía es la lista gratuita de mipymes: solo el nombre,
// el rubro y un link a la red social que elija el emprendedor.
// (Las mipymes destacadas, con ficha y fotos, siguen
// cargándose en js/mipymes-data.js.)
//
// IMPORTANTE: mientras la lista de abajo esté vacía, la
// sección "Guía de mipymes" NO se muestra en la web (ni
// aparece en el menú). Aparece sola con el primer nombre.
//
// ------------------------------------------
// CÓMO AGREGAR UNA MIPYME
// ------------------------------------------
//
// Agregá una línea dentro de DIRECTORIO_DATA, con coma al final:
//
//     { nombre: "Sabores del Chaco", rubro: "Gastronomía", red: "instagram", usuario: "sabores.del.chaco" },
//
//   nombre   El nombre de la mipyme (hasta 80 letras).
//   rubro    Uno de la lista DIRECTORIO_RUBROS de abajo (o uno nuevo: se crea solo).
//   red      Una de estas: "instagram", "facebook", "tiktok", "whatsapp", "web".
//   usuario  Según la red:
//              instagram / tiktok → el usuario, sin @   (ej.: "sabores.del.chaco")
//              facebook           → lo que va después de facebook.com/   (ej.: "saboresdelchaco")
//              whatsapp           → el número con código de país, sin + ni espacios   (ej.: "595981123456")
//   link     Alternativa a "usuario": el link completo (siempre empieza con https://).
//              Sirve para "web" y para páginas de Facebook con link largo.
//              Si ponés "link", no hace falta "usuario" (y a veces ni "red": se detecta sola).
//
// Ejemplos:
//     { nombre: "Café Jazmín",      rubro: "Gastronomía",  red: "instagram", usuario: "cafejazmin.py" },
//     { nombre: "Manos de Seda",    rubro: "Belleza y cuidado personal", red: "whatsapp", usuario: "595981123456" },
//     { nombre: "Pixel Guaraní",    rubro: "Tecnología y diseño web",    red: "web", link: "https://pixelguarani.com.py" },
//
// Para ayudarte, abrí admin/generador-directorio.html: completás
// los datos y te arma la línea lista para pegar.
//
// ------------------------------------------
// COSAS A SABER
// ------------------------------------------
//
//  • Las líneas mal cargadas (falta el nombre, el rubro, o el
//    link no es válido) NO se muestran. Si no aparece una
//    mipyme, abrí la consola del navegador (F12): ahí dice
//    cuál se omitió y por qué.
//  • Solo se aceptan links que empiecen con http:// o https://.
//  • Todos los links se abren en una pestaña nueva y llevan
//    rel="nofollow" (no son pagos y no avalamos esas páginas).
//  • El orden de la lista no importa: la web los ordena de la
//    A a la Z. Para borrar una mipyme, borrá su línea.
//  • Después de agregar mipymes, corré  node tools/generar-seo.js
//    para actualizar la versión "sin JavaScript" de la guía
//    (la que leen algunos buscadores).
// ==========================================

// Rubros, en el orden en que se muestran en la lista de la izquierda.
// (Los que no tengan ninguna mipyme no se muestran.)
const DIRECTORIO_RUBROS = [
    "Gastronomía",
    "Moda y diseño",
    "Belleza y cuidado personal",
    "Hogar y decoración",
    "Servicios profesionales",
    "Eventos y fotografía",
    "Tecnología y diseño web",
    "Salud y bienestar",
    "Educación y clases",
    "Oficios y construcción",
    "Mascotas"
];

const DIRECTORIO_CONFIG = {

    // Cuántas mipymes se ven al principio. El resto se abre con el
    // botón "Ver las N mipymes restantes". (Con búsqueda o filtros se ven todas.)
    filasIniciales: 14

};

const DIRECTORIO_DATA = [

    // Agregá acá las mipymes de la guía (ver explicación de arriba).

];
