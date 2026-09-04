// ==========================================
// DATOS DE MIPYMES
// ==========================================
//
// ⚠️ ESTE ES EL ÚNICO ARCHIVO QUE EL ADMINISTRADOR
// EDITA PARA CARGAR UNA MIPYME NUEVA.
//
// El usuario de la web NUNCA puede agregar, editar
// ni borrar mipymes: no hay ningún formulario público
// para eso. Los visitantes solo pueden hacer clic en
// una mipyme (abre su ficha) o en los botones de
// WhatsApp / Instagram.
//
// Para agregar una mipyme nueva:
//   1) Copiá uno de los bloques { ... } de abajo.
//   2) Pegalo antes del corchete final "]".
//   3) Completá los datos de la mipyme nueva.
//   4) Guardá, subí los cambios al repositorio
//      (git add / commit / push) y publicá de nuevo.
//
// Tip: también podés usar admin/generador-mipyme.html
// para armar el bloque completando un formulario.
//
// CAMPOS:
//   - productoImagen: la foto que se ve en la tarjeta
//     de la lista principal (index.html).
//   - fotosCarrusel: entre 1 y 5 fotos para el carrusel
//     de la ficha de la mipyme (su propia página).
//   - descripcionLarga: 2 párrafos para la ficha
//     (si no se completa, se usa "descripcion").
//   - notaPeriodistica: link a la nota/artículo sobre
//     la mipyme. Si no tiene, dejalo como "" y ese link
//     no se muestra en la ficha.
// ==========================================

const MIPYMES_DATA = [

    {
        nombre: "Hey",
        categoria: "Moda y diseño",

        descripcion:
            "Estudio creativo que desarrolla regalos y experiencias personalizadas para personas y empresas, diseñando cada propuesta según la ocasión, identidad y presupuesto del cliente.",

        descripcionLarga: [
            "Hey es un emprendimiento creado por las amigas Maira Jemima Cañete y Belén Sanabria, que decidieron unir creatividad y regalos personalizados. Con una inversión inicial cercana a G. 6 millones, comenzaron desarrollando propuestas a medida para particulares y empresas, sin trabajar con un catálogo predeterminado y buscando que cada obsequio tenga un significado especial.",
            "Uno de sus proyectos más recordados fue la personalización de 10 pares de championes Nike para Bancard, intervenidos a mano con el logotipo de la empresa y acompañados de un packaging especialmente diseñado. Actualmente, Hey trabaja de manera 100% online, recibe pedidos a través de redes sociales y realiza envíos y delivery, mientras proyecta contar con un taller propio para atender clientes de forma presencial."
        ],

        ubicacion: "Asunción, Paraguay",

        whatsapp: "595972390058",

        instagram: "https://www.instagram.com/hey.megusta?igsh=Nmh0bnJ4MnRkc29m",

        productoImagen:
            "./assets/img/hey/foto-principal-producto.jpeg",

        perfilImagen:
            "./assets/img/hey/foto-perfil.JPEG",

        fotosCarrusel: [
            "./assets/img/hey/foto-principal-producto.jpeg",
            "./assets/img/hey/foto-dos.jpeg",
            "./assets/img/hey/foto-tres.jpg",
            "./assets/img/hey/foto-cuatro.jpg",
            "./assets/img/hey/foto-cinco.jpg"
        ],

        promocion:
            "Consultá por los servicios disponibles.",

        notaPeriodistica: ""

    },

    {
        nombre: "Rubén Cardus Fotografía",
        categoria: "Servicios audiovisuales",

        descripcion:
            "Servicio audiovisual especializado en fotografía y video para eventos sociales, creación de contenido, manejo de redes sociales y fotografía gastronómica.",

        descripcionLarga: [
            "Ruben Angel Cardus Famoso comenzó su camino en el mundo audiovisual a los 18 años, trabajando como secretario de luces y adquiriendo experiencia desde adentro de la producción. Con el tiempo, esa primera aproximación se convirtió en una profesión y en su propio emprendimiento, enfocado principalmente en la fotografía y cobertura audiovisual de eventos sociales como bodas, cumpleaños, bautismos y otras celebraciones.",
            "Actualmente, además de la cobertura de eventos, ofrece servicios de manejo de redes sociales, creación de contenido y fotografía gastronómica para empresas y emprendimientos. Para mejorar la calidad de sus trabajos, fue incorporando equipos profesionales, tecnología y capacitación constante, con el objetivo de consolidar su emprendimiento, ampliar sus servicios y formar un equipo que le permita asumir proyectos de mayor envergadura."
        ],

        ubicacion: "Asunción, Paraguay",

        whatsapp: "595982451062",

        instagram: "https://www.instagram.com/rubencardusfotografo/",

        productoImagen:
            "./assets/img/ruben-cardus/foto-foto-principal.jpg",

        perfilImagen:
            "",

        fotosCarrusel: [
            "./assets/img/ruben-cardus/foto-foto-principal.jpg",
            "./assets/img/ruben-cardus/foto-dos.jpg",
            "./assets/img/ruben-cardus/foto-tres.jpg",
            "./assets/img/ruben-cardus/foto-cuatro.jpg",
            "./assets/img/ruben-cardus/foto-cinco.jpg"
        ],

        promocion:
            "Consultá por los servicios disponibles.",

        notaPeriodistica: ""

    },

    {
        nombre: "El Fogón del Patio",
        categoria: "Decoración y productos para exteriores",

        descripcion:
            "Emprendimiento dedicado a la fabricación y comercialización de fogoneros, parrillas y productos para disfrutar y decorar espacios exteriores.",

        descripcionLarga: [
            "El Fogón del Patio, creado por Enrique Román Helbing durante la pandemia, nació a partir de una fogata improvisada en el patio de su casa. Tras fabricar un fogonero para uso personal y compartirlo en redes sociales, comenzó a recibir pedidos y decidió convertir la idea en un negocio.",
            "Con el tiempo, amplió su propuesta a fogoneros, parrillas, mesas rústicas, espejos decorativos y accesorios para espacios exteriores. Actualmente comercializa principalmente de forma online, cuenta con puntos de venta aliados y realiza envíos a todo el país, buscando ofrecer no solo productos, sino una experiencia para compartir alrededor del fuego."
        ],

        ubicacion: "Asunción, Paraguay",

        whatsapp: "595982754850",

        instagram: "https://www.instagram.com/elfogondelpatio?igsh=MXNydjhlNW5wNWxmeg%3D%3D",

        productoImagen:
            "./assets/img/el-fogon-del-patio/portada-y-foto-1.png",

        perfilImagen:
            "./assets/img/el-fogon-del-patio/foto-de-perfil.jpg",

        fotosCarrusel: [
            "./assets/img/el-fogon-del-patio/portada-y-foto-1.png",
            "./assets/img/el-fogon-del-patio/foto-3.jpeg",
            "./assets/img/el-fogon-del-patio/foto-4.png"
        ],

        promocion:
            "No hay promociones activas actualmente.",

        notaPeriodistica: ""

    },


    {
        nombre: "MAP Crochet",
        categoria: "Moda y diseño",

        descripcion:
            "Emprendimiento dedicado a la elaboración artesanal de prendas de crochet.",

        descripcionLarga: [
            "MAP Crochet nació de la pasión de María Ávalos por el crochet, un conocimiento que aprendió de su madre y que comenzó a utilizar para generar ingresos mientras buscaba la forma de cumplir su sueño de estudiar cine. Con el tiempo, pasó de elaborar gorros y bufandas a especializarse en prendas de verano como bikinis, tops, faldas, pareos y vestidos.",
            "En 2015, el emprendimiento le permitió solventar sus gastos mientras estudiaba Cine y Audiovisual en Brasil, carrera de la que se recibió en 2019. Actualmente, MAP Crochet está formalizado, cuenta con tienda online, trabaja con pedidos personalizados y mantiene prendas en stock, mientras busca ampliar su mercado y llegar a clientes del exterior."
        ],

        ubicacion: "Asunción, Paraguay",

        whatsapp: "595971965636",

        instagram: "https://www.instagram.com/map_crochet/?hl=es",

        productoImagen:
            "./assets/img/map-crochet/portada-y-foto-1.jpeg",

        perfilImagen:
            "./assets/img/map-crochet/perfil.jpeg",

        fotosCarrusel: [
            "./assets/img/map-crochet/portada-y-foto-1.jpeg",
            "./assets/img/map-crochet/foto-2.jpg",
            "./assets/img/map-crochet/foto-3.jpeg",
            "./assets/img/map-crochet/foto-4.jpg",
            "./assets/img/map-crochet/foto-5.webp"
        ],

        promocion:
            "Consultá por los servicios disponibles.",

        notaPeriodistica: ""

    },

    {
        nombre: "Creaciones Pascuala",
        categoria: "Moda y diseño",

        descripcion:
            "Emprendimiento artesanal dedicado a la confección de bolsos, cartucheras, individuales, fundas y otros artículos de tela.",

        descripcionLarga: [
            "Creaciones Pascuala nació cuando María Pascuala González, a los 76 años, retomó su pasión por la costura después de la pérdida de su esposo. Lo que comenzó como una forma de ocupar su tiempo y sobrellevar el duelo se transformó en un emprendimiento desde su hogar en San Lorenzo, donde confecciona bolsos, cartucheras, individuales, fundas y otros productos de tela.",
            "Con el apoyo de su nieta Sandra, quien creó las redes sociales y comenzó a mostrar sus trabajos en Instagram, Pascuala empezó a recibir pedidos de diferentes puntos del país. Actualmente trabaja de manera artesanal y realiza envíos mediante delivery o encomienda, destacándose especialmente por sus bolsones de tela y cartucheras."
        ],

        ubicacion: "San Lorenzo, Paraguay",

        whatsapp: "595985846621",

        instagram: "https://www.instagram.com/creacionesdepascuala/",

        productoImagen:
            "./assets/img/creaciones-pascuala/foto-producto-principal.jpeg",

        perfilImagen:
            "./assets/img/creaciones-pascuala/foto-perfil.jpeg",

        fotosCarrusel: [
            "./assets/img/creaciones-pascuala/foto-producto-principal.jpeg",
            "./assets/img/creaciones-pascuala/foto-dos.jpeg",
            "./assets/img/creaciones-pascuala/foto-tres.jpeg",
            "./assets/img/creaciones-pascuala/foto-cuatro.jpeg"
        ],

        promocion:
            "Consultá por los servicios disponibles.",

        notaPeriodistica: ""

    },
    
    {
        nombre: "Pedacitos de Luna",
        categoria: "Gastronomía",

        descripcion:
            "Emprendimiento gastronómico dedicado a la elaboración y venta de productos dulces y salados en el microcentro de Asunción.",

        descripcionLarga: [
            "Pedacitos de Luna nació en 2023 por Milagros Ríos y Ever Alfonso. Comenzaron con una inversión de apenas G. 150.000, con la que elaboraron 100 medialunas artesanales para una feria por el Día de los Enamorados. En menos de seis horas lograron vender toda la producción, dando inicio a un proyecto que continúa creciendo.",
            "Las medialunas artesanales continúan siendo el producto insignia, pero con el tiempo ampliaron su propuesta con opciones dulces y saladas. Entre sus productos más reconocidos se encuentran los churrasquitos mixtos, preparados con carne y pollo desmechado en pan caliente. También realizan pedidos especiales para eventos."
        ],

        ubicacion: "Asunción, Paraguay",

        // Solo números, sin "+", formato 595 9XX XXXXXX
        whatsapp: "595991305649",

        instagram: "https://www.instagram.com/pedacitos_de_luna__/",

        productoImagen:
            "./assets/img/pedacitos-de-luna/pedacitos-de-luna-foto-de-presentacion.jpeg",

        perfilImagen:
            "./assets/img/pedacitos-de-luna/pedacitos-de-luna-foto-de-perfil.jpeg",

        fotosCarrusel: [
            "./assets/img/pedacitos-de-luna/pedacitos-de-luna-foto-de-presentacion.jpeg",
            "./assets/img/pedacitos-de-luna/pedacitos-de-luna-pancho.jpeg",
            "./assets/img/pedacitos-de-luna/pedacitos-de-luna-empanada.jpeg",
            "./assets/img/pedacitos-de-luna/pedacitos-de-luna-medialuna.jpeg"
        ],

        promocion:
            "No hay promociones activas actualmente.",

        notaPeriodistica: ""

    }
];