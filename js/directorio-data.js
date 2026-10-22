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
// MIPYMES DESTACADAS (las que pagaron) EN LA GUÍA
// ------------------------------------------
//
//  • Las mipymes que están en js/mipymes-data.js (las destacadas)
//    SON las que pagaron: en la guía llevan la palomita azul de
//    "mipyme verificada" junto al nombre.
//  • La palomita se asigna comparando los NOMBRES (sin importar
//    mayúsculas, tildes ni espacios de más): si una línea de la guía
//    tiene el mismo nombre que una destacada, lleva la palomita.
//    Las que están SOLO acá (la lista gratuita) nunca la llevan.
//  • Si una mipyme destacada todavía no está en la guía, entra
//    sola (con su Instagram, o su WhatsApp si no tiene). No hace
//    falta cargarla dos veces. Para desactivarlo:
//    incluirDestacadas: false  (más abajo).
//  • Al entrar sola, la mipyme se ubica en el rubro que diga la
//    tabla DIRECTORIO_EQUIVALENCIAS_RUBRO (más abajo) o, si no
//    figura ahí, en un rubro con el nombre de su categoría. Una
//    destacada también puede traer en sus datos  rubroGuia: "..."
//    para elegir el rubro de la guía.
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
    "Tecnología",
    "Salud y bienestar",
    "Educación y clases",
    "Oficios y construcción",
    "Mascotas"
];

const DIRECTORIO_CONFIG = {

    // Cuántas mipymes se ven al principio. El resto se abre con el
    // botón "Ver las N mipymes restantes". (Con búsqueda o filtros se ven todas.)
    filasIniciales: 14,

    // true = las mipymes destacadas que falten en la guía entran solas (con su palomita).
    // false = solo aparecen las que cargues a mano en DIRECTORIO_DATA.
    incluirDestacadas: true

};

// Cuando una mipyme destacada entra sola a la guía, su "categoría" se traduce
// al rubro de la guía con esta tabla. Formato:  "categoría de destacadas": "rubro de la guía"
// (si una categoría no está acá, se usa con su mismo nombre como rubro).
const DIRECTORIO_EQUIVALENCIAS_RUBRO = {

    "Servicios contables empresariales": "Servicios contables"

};

const DIRECTORIO_DATA = [

    {nombre: "Pedacitos de Luna", rubro: "Gastronomía", red: "Instagram", usuario: "pedacitos_de_luna__"},
    {nombre: "MAP Crochet", rubro: "Moda y diseño", red: "Instagram", usuario: "map_crochet"},
    {nombre: "El Fogón del Patio", rubro: "Decoración y productos para exteriores", red: "Instagram", usuario: "elfogondelpatio"},
    {nombre: "Creaciones Pascuala", rubro: "Moda y diseño", red: "Instagram", usuario: "creacionesdepascuala"},
    {nombre: "Che Retã Resto Café", rubro: "Gastronomía", red: "Instagram", usuario: "cheretacafe_"},
    {nombre: "Rubén Cardus Fotografía", rubro: "Servicios audiovisuales", red: "Instagram", usuario: "rubencardusfotografo"},
    {nombre: "Hey", rubro: "Moda y diseño", red: "Instagram", usuario: "hey.megusta"},
    {nombre: "AG Organización Contable", rubro: "Servicios contables", red: "Instagram", usuario: "agorganizacioncontable"},
    {nombre: "Fátima Sosa Organización y ambientación de eventos", rubro: "Organización de eventos", red: "Instagram", usuario: "fatimasosaeventos"},
    {nombre: "Báez Maldonado y Bolla Consulting", rubro: "Consultoría", red: "Instagram", usuario: "bmbconsulting"},
    {nombre: "Eventos Paraguay", rubro: "Servicios para eventos", red: "Instagram", usuario: "eventosparaguay_"}

];
