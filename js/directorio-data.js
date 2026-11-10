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
//   ciudad   (Opcional) La ciudad de la mipyme, ej.: "Asunción". Sirve para el filtro por
//            ciudad y para la página de cada ciudad. Si falta, igual aparece en la guía
//            (solo que no sale cuando se filtra por una ciudad). Escribila siempre igual
//            ("Asunción", no "asuncion"); las destacadas la toman de su "ubicacion".
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
    {nombre: "Eventos Paraguay", rubro: "Servicios para eventos", red: "Instagram", usuario: "eventosparaguay_"},
    {nombre: "Fabricante Muebles", rubro: "Artesanía", red: "Instagram", usuario: "fabricante_muebles"},

    // ----- Ingresantes: comentarios del posteo de Instagram (guía gratuita, sin palomita) -----
    {nombre: "Bel Fiore", rubro: "Moda y diseño", red: "Instagram", usuario: "belfiorepy"},
    {nombre: "Naturella", rubro: "Gastronomía", red: "Instagram", usuario: "naturella.py"},
    {nombre: "Nesaya LED", rubro: "Publicidad e impresiones", red: "Instagram", usuario: "nesaya.led"},
    {nombre: "Bema Publicitaria", rubro: "Publicidad e impresiones", red: "Instagram", usuario: "bemapublicitariapy"},
    {nombre: "ACOCO", rubro: "Moda y diseño", red: "Instagram", usuario: "acoco_py"},
    {nombre: "Bendita Tierra", rubro: "Artesanía", red: "Instagram", usuario: "benditatierrapy"},
    {nombre: "Moda Sport", rubro: "Moda y diseño", red: "Instagram", usuario: "modasportoficial"},
    {nombre: "Ya Impresiones", rubro: "Publicidad e impresiones", red: "Instagram", usuario: "yaimpresionespy"},
    {nombre: "Ele Bé Studio Branding", rubro: "Moda y diseño", red: "Instagram", usuario: "elebeestudiobranding"},
    {nombre: "Guay Goods", rubro: "Moda y diseño", red: "Instagram", usuario: "guaygoods.py"},
    {nombre: "Wine Garden", rubro: "Gastronomía", red: "Instagram", usuario: "winegarden_py"},
    {nombre: "TAJOS Barberos", rubro: "Belleza y cuidado personal", red: "Instagram", usuario: "tajosbarberos"},
    {nombre: "Bombones Marité", rubro: "Gastronomía", red: "Instagram", usuario: "bombones_marite"},
    {nombre: "Lala Kids Clothing", rubro: "Moda y diseño", red: "Instagram", usuario: "lala.kidsclothing"},
    {nombre: "Aglox", rubro: "Artesanía", red: "Instagram", usuario: "aglox.py"},
    {nombre: "Eepiscinas", rubro: "Oficios y construcción", red: "Instagram", usuario: "eepiscinas"},
    {nombre: "La Casa del Repuesto", rubro: "Oficios y construcción", red: "Instagram", usuario: "lacasadelrepuesto_23"},
    {nombre: "Sofía's Librería", rubro: "Artesanía", red: "Instagram", usuario: "sofias_libreria"},
    {nombre: "Porto Bello Villamorra", rubro: "Gastronomía", red: "Instagram", usuario: "portobelovillamorra"},
    {nombre: "Frío Sabor", rubro: "Gastronomía", red: "Instagram", usuario: "frio_sabor_py"},
    {nombre: "Minerva Clothing", rubro: "Moda y diseño", red: "Instagram", usuario: "minervaclothing.py"},
    {nombre: "The Outcome Studio", rubro: "Servicios", red: "Instagram", usuario: "theoutcomestudio"},
    {nombre: "Happier", rubro: "Gastronomía", red: "Instagram", usuario: "happierpy"},
    {nombre: "Creaciones Danis", rubro: "Servicios", red: "Instagram", usuario: "creacionesdanis"},
    {nombre: "Proyack", rubro: "Moda y diseño", red: "Instagram", usuario: "proyack"},
    {nombre: "CLOTI | Bikinis & More", rubro: "Moda y diseño", red: "Instagram", usuario: "cloti.py"},
    {nombre: "Ilpa San Lorenzo", rubro: "Gastronomía", red: "Instagram", usuario: "ilpasanlorenzo"},
    {nombre: "MVP Games", rubro: "Comercio", red: "Instagram", usuario: "mvpgames.py"},
    {nombre: "Luces de Alelí", rubro: "Artesanía", red: "Instagram", usuario: "lucesdealeli"},
    {nombre: "Msolfere", rubro: "Artesanía", red: "Instagram", usuario: "msolfere"},
    {nombre: "Marisol Fere", rubro: "Servicios", red: "Instagram", usuario: "marisolfere"},
    {nombre: "Valentina Store", rubro: "Comercio", red: "Instagram", usuario: "valentinastore.0821"},
    {nombre: "Shop Bazar", rubro: "Comercio", red: "Instagram", usuario: "shopbazarpy"},
    {nombre: "F15 Bikes", rubro: "Comercio", red: "Instagram", usuario: "f15bikes"},
    {nombre: "Tejilen", rubro: "Moda y diseño", red: "Instagram", usuario: "tejilen.py"},
    {nombre: "La Red Agroecológica", rubro: "Comercio", red: "Instagram", usuario: "laredagroecologicapy"},
    {nombre: "En Positivo", rubro: "Medio de comunicación", red: "Instagram", usuario: "enpositivopy"},
    {nombre: "Mosaicarte Fusión", rubro: "Artesanía", red: "Instagram", usuario: "mosaicartefusion.py"},
    {nombre: "Lissi Nails", rubro: "Belleza", red: "Instagram", usuario: "lissi_nailspy"},
    {nombre: "COBS", rubro: "Comercio", red: "Instagram", usuario: "cobspy"},
    {nombre: "Pequekiids", rubro: "Servicios", red: "Instagram", usuario: "pequekiids"},
    {nombre: "Ramy Fashion Boutique", rubro: "Moda y diseño", red: "Instagram", usuario: "ramyfashionboutique"},
    {nombre: "Amart Papelería con Amor", rubro: "Comercio", red: "Instagram", usuario: "amartpapeleriaconamor"},
    {nombre: "Bar Do JG", rubro: "Gastronomía", red: "Instagram", usuario: "bar.do.jg"},
    {nombre: "Privilege Odontología Integral", rubro: "Servicios", red: "Instagram", usuario: "privilege.odontologiaintegral"},
    {nombre: "Radiodent", rubro: "Servicios", red: "Instagram", usuario: "radiodentpy"},
    {nombre: "AIM Agencia de Inteligencia en Marketing", rubro: "Servicios", red: "Instagram", usuario: "aimagencia"},
    {nombre: "Renta Paraguay", rubro: "Servicios", red: "Instagram", usuario: "rentaparaguay"},
    {nombre: "Tiny Cher Paraguay", rubro: "Moda y diseño", red: "Instagram", usuario: "tinycher.py"},
    {nombre: "Mimados Pet", rubro: "Servicios", red: "Instagram", usuario: "mima2_petshop"},
    {nombre: "F-Tech", rubro: "Comercio", red: "Instagram", usuario: "f_techpy "},
    {nombre: "SSC Consulting", rubro: "Servicios", red: "Instagram", usuario: "sscpy"},
    {nombre: "E_T Producciones", rubro: "Servicios", red: "Instagram", usuario: "et_producciones"},
    {nombre: "Nigui Regalos", rubro: "Artesanía", red: "Instagram", usuario: "niguipy"},
    {nombre: "Ka'avo Resãi", rubro: "Gastronomía", red: "Instagram", usuario: "kaavoresai"},
    {nombre: "Pan & carne", rubro: "Gastronomía", red: "Instagram", usuario: "panycarne24"},
    {nombre: "El Ahumadero", rubro: "Gastronomía", red: "Instagram", usuario: "elahumaderopy"},
    {nombre: "Ciempar Agro", rubro: "Agro", red: "Instagram", usuario: "ciemparagro"},
    {nombre: "Áurea Lab 3D", rubro: "Artesanía", red: "Instagram", usuario: "aurea.lab3d"},
    {nombre: "Patty Pastry", rubro: "Gastronomía", red: "Instagram", usuario: "patty.pastry.py"}


    // PENDIENTE (el usuario figura «por verificar» en la planilla): descomentá la línea cuando se confirme
    // {nombre: "Encantada Chic", rubro: "Moda y diseño", red: "Instagram", usuario: "encantadachic"},

    // PENDIENTE (el rubro figura «por confirmar» en la planilla): descomentá la línea cuando se confirme
    // {nombre: "Nigui", rubro: "Regalos y detalles", red: "Instagram", usuario: "niguipy"},


];
