// ==========================================
// DIRECTORIO — ARMADO Y VALIDACIÓN DE LINKS
// ==========================================
//
// No hace falta tocar este archivo.
//
// A partir de lo que se carga en js/directorio-data.js
// (nombre, rubro, red y usuario o link), arma el link final
// de cada mipyme y descarta lo que esté mal cargado.
//
// Lo usan la web (js/directorio.js) y el script
// tools/generar-seo.js, así el link sale igual en los dos.
//
// SEGURIDAD: solo se aceptan links http:// o https://.
// Cualquier otra cosa (por ejemplo "javascript:...") se rechaza.
// ==========================================

(function (raiz) {

    "use strict";

    const REDES = {

        instagram: {
            nombre: "Instagram",
            usuario: /^[A-Za-z0-9._]{1,30}$/,
            url: function (u) { return "https://www.instagram.com/" + u + "/"; }
        },

        facebook: {
            nombre: "Facebook",
            usuario: /^[A-Za-z0-9.\-]{3,80}$/,
            url: function (u) { return "https://www.facebook.com/" + u; }
        },

        tiktok: {
            nombre: "TikTok",
            usuario: /^[A-Za-z0-9._]{2,30}$/,
            url: function (u) { return "https://www.tiktok.com/@" + u; }
        },

        whatsapp: {
            nombre: "WhatsApp",
            // con código de país (595...), sin 0 inicial: 8 a 15 números
            usuario: /^[1-9]\d{7,14}$/,
            url: function (u) { return "https://wa.me/" + u; }
        },

        web: {
            nombre: "Sitio web"
        }

    };

    // Si cargan un link y no dicen la red, se detecta por el dominio
    const DOMINIOS = [
        [/(^|\.)instagram\.com$/, "instagram"],
        [/(^|\.)facebook\.com$|(^|\.)fb\.com$|(^|\.)fb\.me$/, "facebook"],
        [/(^|\.)tiktok\.com$/, "tiktok"],
        [/(^|\.)wa\.me$|(^|\.)whatsapp\.com$/, "whatsapp"]
    ];

    const LARGO_MAXIMO_NOMBRE = 80;


    function limpiarUsuario(texto) {

        return String(texto == null ? "" : texto)
            .trim()
            .replace(/^@+/, "")
            .replace(/\s+/g, "");

    }

    // Devuelve un objeto URL si el link es http(s) válido; si no, null.
    function urlSegura(texto) {

        let t = String(texto == null ? "" : texto).trim();

        if (!t) return null;

        // Sin "https://" adelante: se lo agregamos
        if (!/^[a-z][a-z0-9+.\-]*:/i.test(t)) t = "https://" + t;

        let u;

        try {
            u = new URL(t);
        } catch (e) {
            return null;
        }

        if (u.protocol !== "https:" && u.protocol !== "http:") return null;
        if (!u.hostname || u.hostname.indexOf(".") < 0) return null;

        return u;

    }

    // Arma el link de una entrada.
    // Devuelve { ok: true, red, url }  o  { ok: false, motivo }.
    function armarEnlace(entrada) {

        if (!entrada || typeof entrada !== "object") {
            return { ok: false, motivo: "la entrada está vacía" };
        }

        let red = String(entrada.red || "").toLowerCase().trim();

        if (red && !REDES[red]) {
            return {
                ok: false,
                motivo: "red desconocida «" + entrada.red + "» (usar instagram, facebook, tiktok, whatsapp o web)"
            };
        }

        // 1) Con link completo
        if (entrada.link) {

            const u = urlSegura(entrada.link);

            if (!u) {
                return { ok: false, motivo: "el link no es válido (tiene que ser una dirección web, por ejemplo https://...)" };
            }

            if (!red) {
                red = "web";
                for (let i = 0; i < DOMINIOS.length; i++) {
                    if (DOMINIOS[i][0].test(u.hostname)) {
                        red = DOMINIOS[i][1];
                        break;
                    }
                }
            }

            return { ok: true, red: red, url: u.href };

        }

        // 2) Con usuario (o número de WhatsApp)
        if (!red) {
            return { ok: false, motivo: "falta la red social (o el link)" };
        }

        if (red === "web") {
            return { ok: false, motivo: "para «web» hay que poner el link" };
        }

        let usuario = limpiarUsuario(entrada.usuario != null ? entrada.usuario : entrada.numero);

        // Si pegaron el link entero en "usuario", se usa como link
        if (/^https?:\/\//i.test(usuario)) {
            return armarEnlace({ red: red, link: usuario });
        }

        if (red === "whatsapp") {
            usuario = usuario.replace(/^\+/, "").replace(/[-().]/g, "");
        }

        if (!usuario) {
            return { ok: false, motivo: "falta el usuario o el número" };
        }

        if (!REDES[red].usuario.test(usuario)) {
            return {
                ok: false,
                motivo: red === "whatsapp"
                    ? "el número de WhatsApp tiene que llevar el código de país y no empezar con 0 (por ejemplo 595981123456)"
                    : "el usuario no tiene un formato válido para " + REDES[red].nombre
            };
        }

        return { ok: true, red: red, url: REDES[red].url(usuario) };

    }

    function claveNombre(texto) {

        return String(texto)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

    }

    // Revisa toda la lista cargada.
    // Devuelve:
    //   entradas  → las válidas, ya con su link: { nombre, rubro, red, url }
    //   rubros    → los rubros que tienen al menos una mipyme, en orden
    //   omitidas  → las que se descartaron y por qué: { nombre, motivo }
    function normalizarEntradas(datos, rubrosEnOrden) {

        const entradas = [];
        const omitidas = [];
        const vistas = {};

        (Array.isArray(datos) ? datos : []).forEach(function (e) {

            const nombre = String((e && e.nombre) || "").trim().replace(/\s+/g, " ");
            const rubro = String((e && e.rubro) || "").trim().replace(/\s+/g, " ");

            if (!nombre) {
                omitidas.push({ nombre: "(sin nombre)", motivo: "falta el nombre" });
                return;
            }

            if (nombre.length > LARGO_MAXIMO_NOMBRE) {
                omitidas.push({ nombre: nombre.slice(0, 30) + "…", motivo: "el nombre es demasiado largo (máximo " + LARGO_MAXIMO_NOMBRE + " letras)" });
                return;
            }

            if (!rubro) {
                omitidas.push({ nombre: nombre, motivo: "falta el rubro" });
                return;
            }

            const clave = claveNombre(nombre) + "|" + claveNombre(rubro);

            if (vistas[clave]) {
                omitidas.push({ nombre: nombre, motivo: "está repetida en el mismo rubro" });
                return;
            }

            const enlace = armarEnlace(e);

            if (!enlace.ok) {
                omitidas.push({ nombre: nombre, motivo: enlace.motivo });
                return;
            }

            vistas[clave] = true;

            entradas.push({ nombre: nombre, rubro: rubro, red: enlace.red, url: enlace.url });

        });

        // Orden de los rubros: primero los de la lista del administrador, después los demás
        const conMipymes = [];

        entradas.forEach(function (e) {
            if (conMipymes.indexOf(e.rubro) < 0) conMipymes.push(e.rubro);
        });

        const rubros = [];

        (rubrosEnOrden || []).forEach(function (r) {
            if (conMipymes.indexOf(r) >= 0 && rubros.indexOf(r) < 0) rubros.push(r);
        });

        conMipymes.forEach(function (r) {
            if (rubros.indexOf(r) < 0) rubros.push(r);
        });

        return { entradas: entradas, rubros: rubros, omitidas: omitidas };

    }

    const comparador = (typeof Intl !== "undefined" && Intl.Collator)
        ? new Intl.Collator("es", { sensitivity: "base", numeric: true })
        : null;

    // Orden alfabético (sin distinguir tildes ni mayúsculas)
    function ordenar(entradas) {

        return entradas.slice().sort(function (a, b) {
            return comparador ? comparador.compare(a.nombre, b.nombre) : a.nombre.localeCompare(b.nombre);
        });

    }

    // Letra con la que se agrupa un nombre ("#" si empieza con número o símbolo)
    function letraDe(nombre) {

        const l = claveNombre(String(nombre).trim().charAt(0)).toUpperCase();

        return /^[A-Z]$/.test(l) ? l : "#";

    }

    const API = {
        REDES: REDES,
        armarEnlace: armarEnlace,
        normalizarEntradas: normalizarEntradas,
        ordenar: ordenar,
        letraDe: letraDe,
        claveNombre: claveNombre
    };

    if (typeof module !== "undefined" && module.exports) {
        module.exports = API;
    }

    raiz.DirectorioEnlaces = API;

})(typeof window !== "undefined" ? window : globalThis);
