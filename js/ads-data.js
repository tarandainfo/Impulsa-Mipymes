// ==========================================
// DATOS DE PUBLICIDAD (BANNERS GIF)
// ==========================================
//
// ⚠️ ESTE ES EL ÚNICO ARCHIVO QUE EL ADMINISTRADOR
// EDITA PARA PONER, CAMBIAR O SACAR UN BANNER.
//
// ------------------------------------------
// DÓNDE SE MUESTRA CADA ESPACIO ("slot")
// ------------------------------------------
//
//  slot              página     medida PC   medida celular
//  ----------------  ---------  ----------  --------------
//  "tope"            las dos    970 × 90    320 × 50      franja arriba de todo
//  "despues-hero"    portada    728 × 90    320 × 100     debajo de la portada
//  "sidebar"         portada    300 × 250   300 × 250     columna derecha
//  "en-lista"        portada    728 × 90    320 × 100     entre las tarjetas (después de la 2ª)
//  "antes-footer"    las dos    728 × 90    320 × 100     antes del pie de página
//  "ficha-fotos"     ficha      728 × 90    320 × 100     debajo de las fotos
//  "ficha-contacto"  ficha      300 × 250   300 × 250     debajo del contacto
//
// ------------------------------------------
// CÓMO PONER UN BANNER NUEVO
// ------------------------------------------
//
//  1) Guardá el GIF del anunciante en la carpeta assets/ads/
//     (con la medida exacta del espacio y, si se puede, de
//     hasta 150 KB: un GIF más pesado hace lenta la página).
//
//  2) Agregá un bloque como este dentro del espacio que quieras:
//
//     {
//         id: "marca-x-noviembre",          // un nombre único (sirve para los informes)
//         anunciante: "Marca X",            // nombre del anunciante
//         alt: "Marca X: 20% de descuento", // lo que dice la imagen (para lectores de pantalla)
//         imagen: "./assets/ads/marca-x.gif",           // GIF de escritorio
//         imagenMovil: "./assets/ads/marca-x-movil.gif", // GIF para celular (opcional)
//         fijo: "./assets/ads/marca-x-fijo.jpg",         // imagen quieta (opcional, ver abajo)
//         fijoMovil: "./assets/ads/marca-x-movil-fijo.jpg",
//         link: "https://www.marca-x.com.py/",           // a dónde lleva el clic
//         desde: "2026-11-01",              // primer día que se muestra (opcional)
//         hasta: "2026-11-30",              // último día que se muestra (opcional)
//         peso: 1,                          // opcional: si hay varios, cuánto aparece (2 = el doble)
//         activo: true                      // false = pausado, sin borrarlo
//     }
//
//  3) Si en un mismo espacio cargás varios banners vigentes,
//     se elige uno distinto al azar cada vez que alguien entra
//     (rotan). Si no queda ninguno vigente, el espacio
//     desaparece solo (no queda un hueco).
//
// ------------------------------------------
// COSAS A SABER
// ------------------------------------------
//
//  • "fijo" / "fijoMovil": una imagen quieta (JPG o PNG, por
//    ejemplo el último cuadro del GIF). La ven las personas que
//    tienen activado "reducir movimiento" en su dispositivo.
//    Es una cuestión de accesibilidad: si no la cargás, a esas
//    personas les aparece igual el GIF en movimiento.
//
//  • Todos los banners llevan la etiqueta "Publicidad" y el
//    enlace "sponsored" (lo piden Google y las normas de
//    publicidad): no hace falta hacer nada.
//
//  • Los enlaces a sitios web llevan solos los datos de
//    seguimiento (utm_source, utm_medium...) para que el
//    anunciante vea las visitas que le mandás en su Google
//    Analytics. Se pueden apagar en ADS_CONFIG.
//
//  • Si el sitio tiene Google Analytics, cada banner informa solo
//    sus impresiones ("ad_impression") y sus clics ("ad_click"),
//    con el espacio y el anunciante, para armar el informe.
//
//  • Para sacar TODA la publicidad de golpe:
//    ADS_CONFIG.activos = false
// ==========================================

const ADS_CONFIG = {

    // true = se muestran los banners. false = no se muestra ninguno.
    activos: true,

    // true = agrega utm_source / utm_medium / utm_campaign / utm_content
    // a los enlaces de los anunciantes (no a los de WhatsApp).
    utm: true,

    // Nombre del sitio que aparece en utm_source
    nombreSitio: "impulsamipymes.com.py"

};

// Mientras no haya anunciantes, los espacios muestran avisos propios que
// invitan a anunciar (llevan al WhatsApp de Infonegocios).
const ADS_LINK_ANUNCIAR =
    "https://wa.me/" +
    ((typeof INFONEGOCIOS_CONFIG !== "undefined" && INFONEGOCIOS_CONFIG.whatsapp) ? INFONEGOCIOS_CONFIG.whatsapp : "") +
    "?text=" + encodeURIComponent("Hola! Quiero anunciar en Impulsa Mipymes.");

const ADS_DATA = {

    // ---------- franja de arriba de todo (las dos páginas) ----------
    "tope": [
        {
            id: "propio-tope",
            anunciante: "Impulsa Mipymes",
            alt: "Publicidad: tu negocio a la vista. Anunciá en Impulsa Mipymes",
            imagen: "./assets/ads/demo-tope.gif",
            imagenMovil: "./assets/ads/demo-tope-movil.gif",
            fijo: "./assets/ads/demo-tope-fijo.jpg",
            fijoMovil: "./assets/ads/demo-tope-movil-fijo.jpg",
            link: ADS_LINK_ANUNCIAR,
            activo: true
        }
    ],

    // ---------- debajo de la portada (arriba de "Mipymes destacadas") ----------
    "despues-hero": [
        {
            id: "propio-hero",
            anunciante: "Impulsa Mipymes",
            alt: "Publicidad: tu marca, acá. Anunciá con nosotros",
            imagen: "./assets/ads/demo-hero.gif",
            imagenMovil: "./assets/ads/demo-hero-movil.gif",
            fijo: "./assets/ads/demo-hero-fijo.jpg",
            fijoMovil: "./assets/ads/demo-hero-movil-fijo.jpg",
            link: ADS_LINK_ANUNCIAR,
            activo: true
        }
    ],

    // ---------- columna derecha, arriba de "Empresas que apoyan a las Mipymes" ----------
    "sidebar": [
        {
            id: "propio-lateral",
            anunciante: "Impulsa Mipymes",
            alt: "Publicidad: tu marca, acá. Anunciá con nosotros",
            imagen: "./assets/ads/demo-lateral.gif",
            fijo: "./assets/ads/demo-lateral-fijo.jpg",
            link: ADS_LINK_ANUNCIAR,
            activo: true
        }
    ],

    // ---------- entre las tarjetas de mipymes (después de la 2ª) ----------
    "en-lista": [
        {
            id: "propio-lista",
            anunciante: "Impulsa Mipymes",
            alt: "Publicidad: tu negocio a la vista. Quiero anunciar",
            imagen: "./assets/ads/demo-lista.gif",
            imagenMovil: "./assets/ads/demo-lista-movil.gif",
            fijo: "./assets/ads/demo-lista-fijo.jpg",
            fijoMovil: "./assets/ads/demo-lista-movil-fijo.jpg",
            link: ADS_LINK_ANUNCIAR,
            activo: true
        }
    ],

    // ---------- antes del pie de página (las dos páginas) ----------
    "antes-footer": [
        {
            id: "propio-pie",
            anunciante: "Impulsa Mipymes",
            alt: "Publicidad: espacio disponible. Anunciá tu marca en Impulsa Mipymes",
            imagen: "./assets/ads/demo-pie.gif",
            imagenMovil: "./assets/ads/demo-pie-movil.gif",
            fijo: "./assets/ads/demo-pie-fijo.jpg",
            fijoMovil: "./assets/ads/demo-pie-movil-fijo.jpg",
            link: ADS_LINK_ANUNCIAR,
            activo: true
        }
    ],

    // ---------- ficha de cada mipyme: debajo de las fotos ----------
    "ficha-fotos": [
        {
            id: "propio-ficha-fotos",
            anunciante: "Impulsa Mipymes",
            alt: "Publicidad: tu negocio a la vista. Quiero anunciar",
            imagen: "./assets/ads/demo-lista.gif",
            imagenMovil: "./assets/ads/demo-lista-movil.gif",
            fijo: "./assets/ads/demo-lista-fijo.jpg",
            fijoMovil: "./assets/ads/demo-lista-movil-fijo.jpg",
            link: ADS_LINK_ANUNCIAR,
            activo: true
        }
    ],

    // ---------- ficha de cada mipyme: debajo del contacto ----------
    "ficha-contacto": [
        {
            id: "propio-ficha-contacto",
            anunciante: "Impulsa Mipymes",
            alt: "Publicidad: tu marca, acá. Anunciá con nosotros",
            imagen: "./assets/ads/demo-lateral.gif",
            fijo: "./assets/ads/demo-lateral-fijo.jpg",
            link: ADS_LINK_ANUNCIAR,
            activo: true
        }
    ]

};
