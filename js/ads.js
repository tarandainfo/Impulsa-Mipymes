// ==========================================
// ADS.JS — muestra los banners de publicidad
// ==========================================
//
// No hace falta tocar este archivo para poner o sacar
// banners: eso se hace en js/ads-data.js (ahí hay una
// explicación paso a paso).
//
// Qué hace:
//   - Llena los espacios publicitarios de la página
//     (los que tienen  data-ad-slot="..."  en el HTML).
//   - Elige qué banner mostrar: solo los vigentes (activos y
//     dentro de sus fechas). Si hay varios, rota al azar.
//   - Si un espacio no tiene ningún banner vigente, lo oculta.
//   - Pone el banner de celular o de PC según el ancho de pantalla.
//   - Respeta "reducir movimiento": muestra la imagen quieta.
//   - Informa impresiones y clics a Google Analytics (si el
//     sitio lo tiene) y agrega datos UTM a los enlaces.
// ==========================================

(function () {

    "use strict";

    if (typeof ADS_DATA === "undefined") return;

    const CONFIG = Object.assign(
        { activos: true, utm: true, nombreSitio: "impulsamipymes.com.py" },
        (typeof ADS_CONFIG !== "undefined") ? ADS_CONFIG : {}
    );

    // Medidas de cada espacio (ancho × alto en PC) y el ancho de pantalla
    // por debajo del cual se usa la versión de celular.
    const MEDIDAS = {
        "tope":           { w: 970, h: 90 },
        "despues-hero":   { w: 728, h: 90 },
        "sidebar":        { w: 300, h: 250 },
        "en-lista":       { w: 728, h: 90 },
        "antes-footer":   { w: 728, h: 90 },
        "ficha-fotos":    { w: 728, h: 90 },
        "ficha-contacto": { w: 300, h: 250 }
    };

    const CORTE_CELULAR = 700;


    // ---------- qué banners están vigentes hoy ----------

    function dos(n) {
        return n < 10 ? "0" + n : String(n);
    }

    function hoyISO() {
        const d = new Date();
        return d.getFullYear() + "-" + dos(d.getMonth() + 1) + "-" + dos(d.getDate());
    }

    function vigente(anuncio, hoy) {

        if (!anuncio || anuncio.activo === false) return false;
        if (!anuncio.imagen) return false;
        if (anuncio.desde && hoy < anuncio.desde) return false;
        if (anuncio.hasta && hoy > anuncio.hasta) return false;

        return true;

    }

    // Elige uno de los vigentes, al azar y según su "peso".
    function elegir(lista, hoy, azar) {

        const vigentes = (lista || []).filter(function (a) {
            return vigente(a, hoy);
        });

        if (!vigentes.length) return null;

        const pesoDe = function (a) {
            return a.peso > 0 ? a.peso : 1;
        };

        const total = vigentes.reduce(function (suma, a) {
            return suma + pesoDe(a);
        }, 0);

        let sorteo = (azar || Math.random)() * total;

        for (let i = 0; i < vigentes.length; i++) {
            sorteo -= pesoDe(vigentes[i]);
            if (sorteo < 0) return vigentes[i];
        }

        return vigentes[vigentes.length - 1];

    }


    // ---------- enlace con datos de seguimiento ----------

    function slugCampania(texto) {

        return String(texto || "anuncio")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

    }

    function urlFinal(anuncio, slot) {

        const link = anuncio.link || "#";

        if (!CONFIG.utm) return link;

        try {

            const url = new URL(link, window.location.href);

            const esWeb = url.protocol === "http:" || url.protocol === "https:";
            const esWhatsapp = /(^|\.)wa\.me$/.test(url.hostname);

            // WhatsApp no usa UTM; y si el anunciante ya puso los suyos, se respetan.
            if (!esWeb || esWhatsapp || url.searchParams.has("utm_source")) return url.href;

            url.searchParams.set("utm_source", CONFIG.nombreSitio);
            url.searchParams.set("utm_medium", "banner");
            url.searchParams.set("utm_campaign", slugCampania(anuncio.anunciante || anuncio.id));
            url.searchParams.set("utm_content", slot);

            return url.href;

        } catch (e) {

            return link;

        }

    }


    // ---------- informes (Google Analytics, si está) ----------

    function reportar(evento, anuncio, slot) {

        const datos = {
            ad_slot: slot,
            ad_id: anuncio.id || "",
            ad_anunciante: anuncio.anunciante || ""
        };

        if (typeof window.gtag === "function") {
            window.gtag("event", evento, datos);
        }

        if (Array.isArray(window.dataLayer)) {
            window.dataLayer.push(Object.assign({ event: evento }, datos));
        }

        // Para quien quiera enganchar otro sistema de medición
        document.dispatchEvent(new CustomEvent("publicidad", {
            detail: Object.assign({ evento: evento }, datos)
        }));

    }

    const observador = ("IntersectionObserver" in window)
        ? new IntersectionObserver(function (entradas) {

            entradas.forEach(function (entrada) {

                if (!entrada.isIntersecting) return;

                const el = entrada.target;

                observador.unobserve(el);

                reportar("ad_impression", el._anuncio, el.dataset.adSlot);

            });

        }, { threshold: 0.5 })
        : null;


    // ---------- armar el banner ----------

    function fuente(picture, media, ruta) {

        const s = document.createElement("source");

        s.setAttribute("media", media);
        s.setAttribute("srcset", ruta);

        picture.appendChild(s);

    }

    function construirEnlace(anuncio, slot) {

        const medida = MEDIDAS[slot] || { w: 728, h: 90 };

        const enlace = document.createElement("a");

        enlace.className = "ad-enlace";
        enlace.href = urlFinal(anuncio, slot);
        enlace.target = "_blank";
        enlace.rel = "sponsored noopener";

        const picture = document.createElement("picture");

        // Con "reducir movimiento": imagen quieta (si el anunciante la cargó).
        if (anuncio.fijoMovil && anuncio.imagenMovil) {
            fuente(picture, "(prefers-reduced-motion: reduce) and (max-width: " + CORTE_CELULAR + "px)", anuncio.fijoMovil);
        }

        if (anuncio.fijo) {
            fuente(picture, "(prefers-reduced-motion: reduce)", anuncio.fijo);
        }

        // Celular: la versión chica
        if (anuncio.imagenMovil) {
            fuente(picture, "(max-width: " + CORTE_CELULAR + "px)", anuncio.imagenMovil);
        }

        const img = document.createElement("img");

        img.src = anuncio.imagen;
        img.width = medida.w;
        img.height = medida.h;
        img.alt = anuncio.alt || ("Publicidad de " + (anuncio.anunciante || "un anunciante"));
        img.decoding = "async";

        // Lo que se ve apenas se abre la página carga enseguida; el resto, cuando se acerca.
        img.loading = (slot === "tope" || slot === "despues-hero") ? "eager" : "lazy";

        picture.appendChild(img);
        enlace.appendChild(picture);

        enlace.addEventListener("click", function () {
            reportar("ad_click", anuncio, slot);
        });

        return enlace;

    }

    // Llena un espacio publicitario (un <aside data-ad-slot="...">)
    function llenarEspacio(contenedor) {

        const slot = contenedor.dataset.adSlot;

        if (!CONFIG.activos) {
            contenedor.hidden = true;
            return;
        }

        const anuncio = elegir(ADS_DATA[slot], hoyISO());

        if (!anuncio) {
            contenedor.hidden = true;
            return;
        }

        const reserva = contenedor.querySelector(".ad-reserva");
        const enlace = construirEnlace(anuncio, slot);

        if (reserva) {
            reserva.replaceWith(enlace);
        } else {
            contenedor.appendChild(enlace);
        }

        contenedor._anuncio = anuncio;

        if (observador) observador.observe(contenedor);

    }


    // ---------- espacio dentro de la lista de mipymes ----------
    //
    // Lo llama app.js cada vez que se dibuja una página de la lista.
    // Pone el banner después de la 2ª tarjeta.

    function enLista(listaEl) {

        if (!listaEl) return;

        listaEl.querySelectorAll('[data-ad-slot="en-lista"]').forEach(function (e) {
            e.remove();
        });

        if (!CONFIG.activos) return;

        const tarjetas = listaEl.querySelectorAll(".mipyme-card");

        if (tarjetas.length < 2) return;

        const anuncio = elegir(ADS_DATA["en-lista"], hoyISO());

        if (!anuncio) return;

        const aside = document.createElement("aside");

        aside.className = "ad-slot ad-728x90 ad-fila-lista";
        aside.dataset.adSlot = "en-lista";
        aside.setAttribute("aria-label", "Publicidad");

        const etiqueta = document.createElement("span");

        etiqueta.className = "ad-etiqueta";
        etiqueta.textContent = "Publicidad";

        aside.appendChild(etiqueta);
        aside.appendChild(construirEnlace(anuncio, "en-lista"));
        aside._anuncio = anuncio;

        tarjetas[1].insertAdjacentElement("afterend", aside);

        if (observador) observador.observe(aside);

    }


    // ---------- arrancar ----------

    function iniciar() {

        document.querySelectorAll(".ad-slot[data-ad-slot]").forEach(llenarEspacio);

    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }

    // Lo que usa app.js (y lo que permite probar la lógica)
    window.Publicidad = {
        enLista: enLista,
        vigente: vigente,
        elegir: elegir,
        urlFinal: urlFinal
    };

})();
