// ==========================================
// DATOS DE BANNERS / ANUNCIANTES
// ==========================================
//
// Marcas que ofrecen beneficios a las mipymes.
// Se muestran en la columna derecha, uno abajo
// del otro, al lado del listado de mipymes.
//
// Igual que con las mipymes: solo el administrador
// edita este archivo para agregar o quitar un banner.
//
// "imagen": URL de la foto/logo de la marca. Si la
// dejás vacía (""), se muestra un color de fondo con
// el nombre de la marca en texto, como respaldo.
//
// "colorClase" acepta "banner-image" (celeste) o
// "banner-image-two" (amarillo) — se usa como fondo
// mientras carga la imagen o si no hay imagen cargada.
// ==========================================

const BANNERS_DATA = [

    {
        marca: "MARCA",
        imagen: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=800&q=80",
        colorClase: "banner-image",
        etiqueta: "BENEFICIO",
        titulo: "Soluciones para tu negocio",
        texto: "Descubrí beneficios exclusivos para tu emprendimiento.",
        link: "#"
    },

    {
        marca: "MARCA",
        imagen: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800&q=80",
        colorClase: "banner-image-two",
        etiqueta: "PROMOCIÓN",
        titulo: "Impulsá tu emprendimiento",
        texto: "Encontrá soluciones pensadas para las Mipymes.",
        link: "#"
    }

];
