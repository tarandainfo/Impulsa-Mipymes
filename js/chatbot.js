// ==========================================
// CHATBOT.JS — widget de ayuda (preguntas frecuentes)
// ==========================================
//
// No hace falta tocar este archivo para cambiar
// las preguntas: eso se hace en
// js/chatbot-preguntas.js.
//
// Arma todo el HTML del widget por JavaScript,
// así alcanza con incluir este script (y
// chatbot-preguntas.js) en cualquier página del
// sitio para que aparezca.
// ==========================================


// ==========================================
// MASCOTA "INFOBOT" EN 3D
// ==========================================
//
// Robotcito con traje negro y grafito (corbata roja y pin
// "IN" de Infonegocios) y auricular de atención.
//
// El efecto 3D es real: cada parte (cuerpo, brazos,
// cabeza, antena) es una capa SVG separada, apiladas
// en profundidad con CSS 3D. Al inclinar la figura
// (siguiendo al mouse) las capas se separan como en
// un objeto de verdad. Las animaciones están en
// styles.css (clases "ib-...").
// ==========================================

// Colores y brillos que usan todas las capas
// (se definen una sola vez para toda la página).
// Paleta: negro y grafito, con un toque de azul acero,
// celeste suave en los ojos y el rojo de la marca solo en
// la corbata.
const IB_DEFS = `
<svg class="ib-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
        <linearGradient id="ib-g-cabeza" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#3A4252"/>
            <stop offset="0.5" stop-color="#1B2029"/>
            <stop offset="1" stop-color="#090B10"/>
        </linearGradient>
        <linearGradient id="ib-g-borde" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#C5CEDC" stop-opacity="0.85"/>
            <stop offset="0.5" stop-color="#7B869B" stop-opacity="0.5"/>
            <stop offset="1" stop-color="#2A303D" stop-opacity="0.1"/>
        </linearGradient>
        <linearGradient id="ib-g-visor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#050609"/>
            <stop offset="1" stop-color="#121620"/>
        </linearGradient>
        <linearGradient id="ib-g-ojo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#EAFBFF"/>
            <stop offset="0.55" stop-color="#8FDDF2"/>
            <stop offset="1" stop-color="#4DB4D4"/>
        </linearGradient>
        <linearGradient id="ib-g-traje" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0" stop-color="#2E3544"/>
            <stop offset="0.5" stop-color="#161A23"/>
            <stop offset="1" stop-color="#08090D"/>
        </linearGradient>
        <linearGradient id="ib-g-solapa" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#434B5E"/>
            <stop offset="1" stop-color="#1A1E28"/>
        </linearGradient>
        <linearGradient id="ib-g-camisa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#F6F8FB"/>
            <stop offset="1" stop-color="#C6CEDB"/>
        </linearGradient>
        <linearGradient id="ib-g-corbata" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#E5203F"/>
            <stop offset="0.55" stop-color="#B00C25"/>
            <stop offset="1" stop-color="#6D0716"/>
        </linearGradient>
        <linearGradient id="ib-g-metal" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#9AA5B8"/>
            <stop offset="1" stop-color="#3A4252"/>
        </linearGradient>
        <linearGradient id="ib-g-auricular" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#4A5266"/>
            <stop offset="1" stop-color="#12151C"/>
        </linearGradient>
        <radialGradient id="ib-g-mano" cx="35%" cy="28%" r="80%">
            <stop offset="0" stop-color="#5A6379"/>
            <stop offset="1" stop-color="#1B2029"/>
        </radialGradient>
        <radialGradient id="ib-g-antena" cx="35%" cy="30%" r="75%">
            <stop offset="0" stop-color="#F2FCFF"/>
            <stop offset="0.5" stop-color="#8FDDF2"/>
            <stop offset="1" stop-color="#3C9FC2"/>
        </radialGradient>
    </defs>
</svg>
`;

// Cada pieza del robot (la usa tanto la figura completa
// como el avatar chiquito del encabezado del chat).

const IB_ANTENA = `
    <rect x="58.6" y="10" width="2.8" height="16" rx="1.4" fill="url(#ib-g-metal)"/>
    <circle class="ib-ping" cx="60" cy="8.5" r="5" fill="none" stroke="#8FDDF2" stroke-width="1.6"/>
    <circle class="ib-bola" cx="60" cy="8.5" r="4.6" fill="url(#ib-g-antena)"/>
`;

const IB_CABEZA = `
    <g class="ib-cabeceo">
        ${IB_ANTENA}

        <rect x="19" y="24" width="82" height="64" rx="28" fill="url(#ib-g-cabeza)"/>
        <rect x="19.8" y="24.8" width="80.4" height="62.4" rx="27.2" fill="none" stroke="url(#ib-g-borde)" stroke-width="1.6"/>

        <rect x="28" y="34" width="64" height="44" rx="20" fill="url(#ib-g-visor)"/>
        <rect x="28" y="34" width="64" height="44" rx="20" fill="none" stroke="#8FDDF2" stroke-opacity="0.22" stroke-width="1.2"/>
        <path d="M34 44 C40 38 54 36 66 37 C54 40 42 44 36 54 Z" fill="#FFFFFF" opacity="0.07"/>

        <g class="ib-ojos">
            <g class="ib-ojos-mirar">
                <rect class="ib-ojo" x="40.5" y="45" width="9" height="17" rx="4.5" fill="url(#ib-g-ojo)"/>
                <rect class="ib-ojo" x="70.5" y="45" width="9" height="17" rx="4.5" fill="url(#ib-g-ojo)"/>
            </g>
        </g>

        <g class="ib-cejas">
            <path d="M39 41.5 Q45 38.5 51 41.5" fill="none" stroke="#8FDDF2" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>
            <path d="M69 41.5 Q75 38.5 81 41.5" fill="none" stroke="#8FDDF2" stroke-opacity="0.6" stroke-width="2" stroke-linecap="round"/>
        </g>

        <path class="ib-boca-sonrisa" d="M50 66 Q60 77.5 70 66 Z" fill="#8FDDF2"/>
        <path class="ib-boca" d="M52 68.5 Q60 73.5 68 68.5" fill="none" stroke="#8FDDF2" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>
        <ellipse class="ib-boca-habla" cx="60" cy="69.5" rx="5" ry="3.2" fill="#8FDDF2"/>

        <path d="M21 54 C20 14 100 14 99 54" fill="none" stroke="#0B0D12" stroke-width="4.4" stroke-linecap="round"/>
        <path d="M23 50 C25 20 62 15 80 22" fill="none" stroke="#C5CEDC" stroke-opacity="0.35" stroke-width="1.2" stroke-linecap="round"/>

        <rect x="9.5" y="45" width="12" height="25" rx="6" fill="url(#ib-g-auricular)" stroke="#0B0D12" stroke-width="1.6"/>
        <rect x="14.2" y="52" width="2.6" height="11" rx="1.3" fill="#8FDDF2" opacity="0.85"/>
        <rect x="98.5" y="45" width="12" height="25" rx="6" fill="url(#ib-g-auricular)" stroke="#0B0D12" stroke-width="1.6"/>
        <rect x="103.2" y="52" width="2.6" height="11" rx="1.3" fill="#8FDDF2" opacity="0.85"/>

        <path d="M15.5 70 C15.5 88 30 94 45 92" fill="none" stroke="#0B0D12" stroke-width="2.6" stroke-linecap="round"/>
        <rect x="43" y="88.6" width="10" height="6.4" rx="3.2" fill="url(#ib-g-auricular)" stroke="#0B0D12" stroke-width="1.4"/>
    </g>
`;

const IB_CUERPO = `
    <g class="ib-resp">
        <rect x="52" y="82" width="16" height="16" rx="5" fill="url(#ib-g-metal)"/>

        <path d="M22 148 C18 118 30 97 60 95 C90 97 102 118 98 148 C86 154 34 154 22 148 Z" fill="url(#ib-g-traje)"/>
        <path d="M60 95 C90 97 102 118 98 148" fill="none" stroke="#C5CEDC" stroke-opacity="0.45" stroke-width="1.2"/>
        <path d="M26 140 C24 118 32 102 50 98 C40 108 36 124 38 146 Z" fill="#FFFFFF" opacity="0.07"/>

        <path d="M47 96 L60 128 L73 96 Z" fill="url(#ib-g-camisa)"/>
        <path d="M47 96 L36 101 L51 134 L60 128 Z" fill="url(#ib-g-solapa)"/>
        <path d="M73 96 L84 101 L69 134 L60 128 Z" fill="url(#ib-g-solapa)"/>
        <path d="M47 95 L58 99 L56 108 L49 101 Z" fill="#FFFFFF"/>
        <path d="M73 95 L62 99 L64 108 L71 101 Z" fill="#FFFFFF"/>

        <path d="M56 100 L64 100 L62.5 108 L57.5 108 Z" fill="url(#ib-g-corbata)"/>
        <path d="M57.5 108 L62.5 108 L66 134 L60 142 L54 134 Z" fill="url(#ib-g-corbata)"/>
        <path d="M60 110 L61.6 134 L60 140 Z" fill="#000000" opacity="0.18"/>

        <circle cx="40" cy="121" r="5.6" fill="#0B0D12" stroke="#C5CEDC" stroke-width="0.9"/>
        <text x="40" y="123.3" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="6" fill="#FFFFFF">IN</text>

        <path d="M79 118 L89 116 L88.4 119.6 L79.6 121 Z" fill="#E8ECF2"/>
    </g>
`;

const IB_BRAZO_IZQ = `
    <g class="ib-brazo-izq">
        <path d="M30 100 C16 104 12 122 14 136 L28 139 C30 126 33 113 38 104 Z" fill="url(#ib-g-traje)"/>
        <path d="M14 136 L28 139 L27.6 143 L13.4 140 Z" fill="#E8ECF2"/>
        <circle cx="20.5" cy="147" r="7.2" fill="url(#ib-g-mano)"/>
    </g>
`;

const IB_BRAZO_DER = `
    <g class="ib-brazo">
        <path d="M90 103 C107 100 116 84 115 62" fill="none" stroke="#06070A" stroke-width="14" stroke-linecap="round"/>
        <path d="M90 103 C107 100 116 84 115 62" fill="none" stroke="url(#ib-g-traje)" stroke-width="11" stroke-linecap="round"/>
        <path d="M88 101 C104 97 112 84 111 66" fill="none" stroke="#FFFFFF" stroke-opacity="0.22" stroke-width="3" stroke-linecap="round"/>
        <g class="ib-mano">
            <path d="M115 66 L115 58" fill="none" stroke="#E8ECF2" stroke-width="13" stroke-linecap="butt"/>
            <circle cx="116" cy="47" r="8.6" fill="url(#ib-g-mano)"/>
            <circle cx="124" cy="52" r="3.4" fill="url(#ib-g-mano)"/>
        </g>
    </g>
`;


// Figura completa: capas SVG apiladas en profundidad
function infobotFiguraHTML() {

    const capa = function (clase, contenido) {
        return `<svg class="ib-capa ${clase}" viewBox="0 0 120 150" aria-hidden="true" focusable="false">${contenido}</svg>`;
    };

    return `
        <span class="ib-flota">
            <span class="ib-giro">
                <span class="ib-figura">
                    ${capa("ib-capa-cuerpo", IB_CUERPO)}
                    ${capa("ib-capa-brazoi", IB_BRAZO_IZQ)}
                    ${capa("ib-capa-brazod", IB_BRAZO_DER)}
                    ${capa("ib-capa-cabeza", IB_CABEZA)}
                </span>
            </span>
        </span>
    `;

}


// Solo la cabeza (avatar del encabezado del chat)
function infobotAvatarHTML() {

    return `
        <svg class="ib-avatar-svg" viewBox="6 0 108 100" aria-hidden="true" focusable="false">
            ${IB_CABEZA}
        </svg>
    `;

}


function crearWidgetChatbot() {

    if (typeof CHATBOT_PREGUNTAS === "undefined") return;

    const numeroWhatsapp =
        (typeof INFONEGOCIOS_CONFIG !== "undefined" && INFONEGOCIOS_CONFIG.whatsapp)
            ? INFONEGOCIOS_CONFIG.whatsapp
            : "";

    const menosMovimiento =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const hayMouse =
        window.matchMedia &&
        window.matchMedia("(pointer: fine)").matches;

    // ---------- armar el HTML ----------

    const raiz = document.createElement("div");
    raiz.id = "chatbot-widget";

    raiz.innerHTML = `

        ${IB_DEFS}

        <div class="chatbot-teaser" id="chatbot-teaser">

            <button class="chatbot-teaser-cerrar" id="chatbot-teaser-cerrar" aria-label="Cerrar mensaje">×</button>

            <p>¡Hola! Soy Infobot 👋 Estoy acá para resolver tus dudas.</p>

        </div>

        <button id="chatbot-toggle" aria-label="Abrir ayuda" class="chatbot-toggle">

            <span class="ib-sombra" aria-hidden="true"></span>

            <span class="chatbot-icono-bot ib-escena">${infobotFiguraHTML()}</span>

            <svg class="chatbot-icono-cerrar" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.29 1.41 1.41 6.3-6.29 6.3 6.29 1.41-1.41-6.3-6.29 6.3-6.3z"/>
            </svg>

        </button>

        <div id="chatbot-panel" class="chatbot-panel" role="dialog" aria-label="Ayuda de Infobot">

            <div class="chatbot-header">

                <span class="chatbot-header-avatar">
                    ${infobotAvatarHTML()}
                    <span class="chatbot-estado-online" aria-hidden="true"></span>
                </span>

                <div class="chatbot-header-texto">
                    <strong>Infobot</strong>
                    <small>En línea · Asistente de Infonegocios</small>
                </div>

                <button type="button" class="chatbot-cerrar-panel" id="chatbot-cerrar-panel" aria-label="Cerrar ayuda">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
                </button>

            </div>

            <div class="chatbot-mensajes" id="chatbot-mensajes">

                <div class="chatbot-burbuja chatbot-burbuja-bot">
                    ¡Hola! Soy Infobot y estoy acá para resolver tus dudas 👋 Elegí una pregunta de la lista de abajo.
                </div>

            </div>

            <div class="chatbot-preguntas" id="chatbot-preguntas"></div>

            ${numeroWhatsapp ? `
            <a
                href="https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent("Hola! Tengo una consulta sobre Infonegocios.")}"
                target="_blank"
                rel="noopener"
                class="chatbot-whatsapp">

                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.35 5.07L2 22l5.06-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.28 1.18-1.77 1.24-.45.06-.98.08-1.58-.1-.36-.11-.83-.27-1.43-.53-2.52-1.09-4.16-3.63-4.29-3.8-.13-.17-1.03-1.37-1.03-2.61 0-1.24.65-1.85.88-2.1.22-.25.49-.31.65-.31.16 0 .33 0 .47.01.15.01.35-.06.55.42.2.49.69 1.68.75 1.8.06.12.1.27.02.44-.08.17-.12.27-.24.42-.12.15-.25.33-.36.44-.12.12-.24.25-.1.49.14.24.61 1.01 1.32 1.63.91.8 1.67 1.05 1.91 1.17.24.12.38.1.52-.06.14-.16.6-.7.76-.94.16-.24.32-.2.53-.12.21.08 1.36.64 1.6.76.24.12.4.18.46.28.06.11.06.61-.16 1.23z"/></svg>
                ¿No encontraste tu duda? Escribinos por WhatsApp

            </a>
            ` : ""}

        </div>
    `;

    document.body.appendChild(raiz);

    // ---------- referencias ----------

    const toggle = document.getElementById("chatbot-toggle");
    const panel = document.getElementById("chatbot-panel");
    const mensajes = document.getElementById("chatbot-mensajes");
    const preguntasCont = document.getElementById("chatbot-preguntas");
    const teaser = document.getElementById("chatbot-teaser");
    const teaserCerrar = document.getElementById("chatbot-teaser-cerrar");
    const cerrarPanelBtn = document.getElementById("chatbot-cerrar-panel");
    const escena = raiz.querySelector(".ib-escena");

    // ---------- pintar los botones de preguntas ----------

    CHATBOT_PREGUNTAS.forEach(function (item, indice) {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "chatbot-pregunta-btn";
        boton.style.setProperty("--i", indice);
        boton.textContent = item.pregunta;

        boton.addEventListener("click", function () {
            responderPregunta(indice);
        });

        preguntasCont.appendChild(boton);

    });


    // ==========================================
    // MOVIMIENTO DE LA MASCOTA
    // ==========================================

    // 1) Mira y gira la cabeza hacia donde está el mouse
    //    (solo con mouse; en celular no hay a dónde mirar).

    function limitar(valor, min, max) {
        return Math.max(min, Math.min(max, valor));
    }

    if (hayMouse && !menosMovimiento) {

        let objetivoX = 0;
        let objetivoY = 0;
        let actualX = 0;
        let actualY = 0;
        let cuadro = null;

        function aplicarMirada(nx, ny) {

            raiz.style.setProperty("--ib-ry", (-nx * 20).toFixed(2));
            raiz.style.setProperty("--ib-rx", (-ny * 12).toFixed(2));
            raiz.style.setProperty("--ib-hy", (-nx * 16).toFixed(2));
            raiz.style.setProperty("--ib-hx", (-ny * 10).toFixed(2));
            raiz.style.setProperty("--ib-px", (nx * 3.4).toFixed(2));
            raiz.style.setProperty("--ib-py", (ny * 2.6).toFixed(2));

        }

        function animarMirada() {

            actualX += (objetivoX - actualX) * 0.14;
            actualY += (objetivoY - actualY) * 0.14;

            aplicarMirada(actualX, actualY);

            if (Math.abs(objetivoX - actualX) > 0.002 || Math.abs(objetivoY - actualY) > 0.002) {
                cuadro = requestAnimationFrame(animarMirada);
            } else {
                cuadro = null;
            }

        }

        window.addEventListener("pointermove", function (e) {

            const r = escena.getBoundingClientRect();

            objetivoX = limitar((e.clientX - (r.left + r.width / 2)) / (window.innerWidth * 0.45), -1, 1);
            objetivoY = limitar((e.clientY - (r.top + r.height * 0.4)) / (window.innerHeight * 0.45), -1, 1);

            if (!cuadro) cuadro = requestAnimationFrame(animarMirada);

        }, { passive: true });

        document.documentElement.addEventListener("mouseleave", function () {

            objetivoX = 0;
            objetivoY = 0;

            if (!cuadro) cuadro = requestAnimationFrame(animarMirada);

        });

    }


    // 2) GESTOS. Cada tanto (y cuando le pasás el mouse) hace uno:
    //    saluda moviendo la mano y diciendo "hola", sonríe con los
    //    ojitos entrecerrados, abre la boca como hablando, se sorprende
    //    con las cejas arriba, mira para los costados, inclina la cabeza
    //    o pega un saltito. Cada gesto es un grupo de clases CSS ("ib-...")
    //    que se prenden un rato y después se apagan solas.
    //    (Si el usuario pidió menos movimiento, no hace ninguno.)

    const GESTOS = {
        saludo:   { clases: ["ib-a-saludo", "ib-sonrie", "ib-parlotea"], ms: 2900 },
        sonrisa:  { clases: ["ib-sonrie", "ib-feliz"], ms: 2300 },
        parlotea: { clases: ["ib-sonrie", "ib-parlotea"], ms: 2000 },
        asombro:  { clases: ["ib-sorpresa"], ms: 1600 },
        mirar:    { clases: ["ib-a-mirar"], ms: 2700 },
        inclina:  { clases: ["ib-a-inclina", "ib-sonrie"], ms: 1800 },
        salto:    { clases: ["ib-a-salto", "ib-sonrie", "ib-feliz"], ms: 950 }
    };

    // Con el robot a la vista puede hacer de todo; con el chat abierto
    // (donde solo se ve la cara del encabezado) solo gestos de cara.
    const GESTOS_A_LA_VISTA = ["saludo", "sonrisa", "parlotea", "asombro", "mirar", "inclina", "salto", "saludo", "sonrisa"];
    const GESTOS_CON_CHAT = ["sonrisa", "parlotea", "asombro", "mirar"];

    let gestoActual = null;
    let temporizadorGesto = null;
    let ultimoGesto = "";

    function terminarGesto() {

        clearTimeout(temporizadorGesto);

        if (gestoActual) {

            gestoActual.clases.forEach(function (c) {
                raiz.classList.remove(c);
            });

            gestoActual = null;

        }

    }

    function lanzarGesto(nombre) {

        const gesto = GESTOS[nombre];

        if (!gesto || menosMovimiento) return;

        terminarGesto();

        gestoActual = gesto;
        ultimoGesto = nombre;

        gesto.clases.forEach(function (c) {
            raiz.classList.add(c);
        });

        temporizadorGesto = setTimeout(terminarGesto, gesto.ms);

    }

    function programarGesto() {

        setTimeout(function () {

            const chatAbierto = panel.classList.contains("chatbot-panel-abierto");

            // no interrumpe mientras "contesta" una pregunta ni con la pestaña oculta
            if (!document.hidden && !raiz.classList.contains("ib-hablando")) {

                const opciones = (chatAbierto ? GESTOS_CON_CHAT : GESTOS_A_LA_VISTA)
                    .filter(function (n) { return n !== ultimoGesto; });

                lanzarGesto(opciones[Math.floor(Math.random() * opciones.length)]);

            }

            programarGesto();

        }, 2600 + Math.random() * 2600);

    }


    // 3) PARPADEO al azar (a veces doble), como una persona.

    function parpadear() {

        raiz.classList.add("ib-parpadeando");

        setTimeout(function () {
            raiz.classList.remove("ib-parpadeando");
        }, 130);

    }

    function programarParpadeo() {

        setTimeout(function () {

            if (!document.hidden) {

                parpadear();

                // una de cada cinco veces parpadea dos veces seguidas
                if (Math.random() < 0.2) setTimeout(parpadear, 280);

            }

            programarParpadeo();

        }, 1800 + Math.random() * 3200);

    }

    if (!menosMovimiento) {

        programarGesto();
        programarParpadeo();

        // Cuando le pasás el mouse por encima: te saluda sonriendo
        toggle.addEventListener("mouseenter", function () {

            if (panel.classList.contains("chatbot-panel-abierto")) return;

            lanzarGesto("saludo");

        });

    }


    // ==========================================
    // LÓGICA DE RESPONDER
    // ==========================================

    let hablando = 0;

    function responderPregunta(indice) {

        const item = CHATBOT_PREGUNTAS[indice];

        if (!item) return;

        const burbujaUsuario = document.createElement("div");
        burbujaUsuario.className = "chatbot-burbuja chatbot-burbuja-usuario";
        burbujaUsuario.textContent = item.pregunta;
        mensajes.appendChild(burbujaUsuario);

        irAlFinal();

        // Mientras "escribe", muestra los 3 puntitos y la mascota mueve la boca
        const burbujaBot = document.createElement("div");
        burbujaBot.className = "chatbot-burbuja chatbot-burbuja-bot chatbot-burbuja-escribiendo";
        burbujaBot.setAttribute("aria-label", "Infobot está escribiendo");
        burbujaBot.innerHTML = `
            <span class="chatbot-puntito"></span>
            <span class="chatbot-puntito"></span>
            <span class="chatbot-puntito"></span>
        `;
        mensajes.appendChild(burbujaBot);

        hablando++;
        raiz.classList.add("ib-hablando");

        irAlFinal();

        // Pequeña pausa para que se sienta más natural, no instantáneo
        setTimeout(function () {

            burbujaBot.textContent = item.respuesta;
            burbujaBot.removeAttribute("aria-label");
            burbujaBot.classList.remove("chatbot-burbuja-escribiendo");
            irAlFinal();

            // sigue "hablando" un rato proporcional al largo de la respuesta
            setTimeout(function () {

                hablando = Math.max(0, hablando - 1);

                if (!hablando) raiz.classList.remove("ib-hablando");

            }, Math.min(2800, 500 + item.respuesta.length * 16));

        }, 800);

    }

    function irAlFinal() {

        if (mensajes.scrollTo) {
            mensajes.scrollTo({ top: mensajes.scrollHeight, behavior: menosMovimiento ? "auto" : "smooth" });
        } else {
            mensajes.scrollTop = mensajes.scrollHeight;
        }

    }


    // ---------- globito que aparece solo, sin clickear ----------

    function ocultarTeaser() {
        teaser.classList.remove("chatbot-teaser-visible");
    }

    setTimeout(function () {

        teaser.classList.add("chatbot-teaser-visible");

        lanzarGesto("saludo");

    }, 1200);

    teaserCerrar.addEventListener("click", function (e) {
        e.stopPropagation();
        ocultarTeaser();
    });

    teaser.addEventListener("click", function () {
        ocultarTeaser();
        abrirPanel();
    });

    // ---------- abrir / cerrar ----------

    function abrirPanel() {

        panel.classList.add("chatbot-panel-abierto");
        toggle.classList.add("chatbot-toggle-abierto");
        toggle.setAttribute("aria-label", "Cerrar ayuda");
        ocultarTeaser();

        lanzarGesto("parlotea");

    }

    function cerrarPanel() {

        panel.classList.remove("chatbot-panel-abierto");
        toggle.classList.remove("chatbot-toggle-abierto");
        toggle.setAttribute("aria-label", "Abrir ayuda");

    }

    toggle.addEventListener("click", function () {

        if (panel.classList.contains("chatbot-panel-abierto")) {
            cerrarPanel();
        } else {
            abrirPanel();
        }

    });

    cerrarPanelBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        cerrarPanel();
    });

    // Con la tecla Escape también se cierra
    document.addEventListener("keydown", function (e) {

        if (e.key === "Escape" && panel.classList.contains("chatbot-panel-abierto")) {
            cerrarPanel();
            toggle.focus();
        }

    });

}


crearWidgetChatbot();
