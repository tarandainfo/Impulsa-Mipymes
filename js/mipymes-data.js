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
        nombre: "Dulce Paraguay",
        categoria: "Gastronomía",

        descripcion:
            "Emprendimiento dedicado a la elaboración de productos dulces y artesanales.",

        descripcionLarga: [
            "Dulce Paraguay nació en 2019 en la cocina de la familia Ortiz, en Asunción, con la idea de rescatar recetas tradicionales paraguayas y darles una vuelta más artesanal. Hoy elaboran dulces, alfeñiques y conservas con frutas de estación, trabajando con productores locales de la zona.",
            "Además de la venta directa, participan de ferias de emprendedores y ya despachan pedidos a todo Gran Asunción. Su objetivo a corto plazo es abrir un local propio y sumar una línea de productos sin azúcar."
        ],

        ubicacion: "Asunción, Paraguay",

        // Solo números, sin "+", formato 595 9XX XXXXXX
        whatsapp: "595981000000",

        instagram: "https://instagram.com/",

        productoImagen:
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",

        perfilImagen:
            "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=400&q=80",

        fotosCarrusel: [
            "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1481391319762-47dff72954d9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519996529931-28324d5a630e?auto=format&fit=crop&w=1200&q=80"
        ],

        promocion:
            "10% de descuento para nuevos clientes.",

        notaPeriodistica: ""

    },


    {
        nombre: "Artesanías Guaraní",
        categoria: "Artesanía",

        descripcion:
            "Productos artesanales paraguayos elaborados de manera independiente.",

        descripcionLarga: [
            "Artesanías Guaraní reúne el trabajo de un grupo de artesanos de Luque que elaboran piezas en madera, ñandutí y ao po'i, combinando técnicas heredadas de generación en generación con diseños pensados para el uso diario.",
            "Cada pieza se hace por encargo o en pequeños lotes, lo que permite personalizar colores y tamaños. Actualmente envían a todo el Gran Asunción y están evaluando sumar envíos al interior del país."
        ],

        ubicacion: "Luque, Paraguay",

        whatsapp: "595982000000",

        instagram: "https://instagram.com/",

        productoImagen:
            "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=800&q=80",

        perfilImagen:
            "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=400&q=80",

        fotosCarrusel: [
            "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&w=1200&q=80"
        ],

        promocion:
            "Envíos disponibles dentro de Gran Asunción.",

        notaPeriodistica: ""

    },


    {
        nombre: "Diseño PY",
        categoria: "Servicios",

        descripcion:
            "Servicios creativos y soluciones digitales para pequeños negocios.",

        descripcionLarga: [
            "Diseño PY es un estudio creativo de San Lorenzo formado por tres diseñadores que trabajan con pymes y emprendedores paraguayos: identidad visual, diseño de redes, sitios web simples y material para punto de venta.",
            "Nacieron en 2021 ayudando a comercios de barrio a mejorar su presencia digital, y hoy ya trabajaron con más de 40 negocios en distintos rubros. Ofrecen paquetes mensuales pensados especialmente para mipymes que recién arrancan."
        ],

        ubicacion: "San Lorenzo, Paraguay",

        whatsapp: "595983000000",

        instagram: "https://instagram.com/",

        productoImagen:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=800&q=80",

        perfilImagen:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",

        fotosCarrusel: [
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1483058712412-4245e9b90334?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
        ],

        promocion:
            "Consultá por los servicios disponibles.",

        notaPeriodistica: ""

    }

];
