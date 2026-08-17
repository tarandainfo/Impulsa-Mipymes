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
// MASCOTA "INFOBOT"
// (robotcito con la gorrita "IN" de Infonegocios)
// ==========================================

const INFOBOT_SVG = `
<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">

    <rect x="28" y="70" width="44" height="34" rx="14" fill="#FFFFFF" stroke="#1E2A44" stroke-width="3.5"/>
    <circle cx="50" cy="87" r="7" fill="#004884"/>
    <path d="M40,87 h-4 M64,87 h4" stroke="#DBE2EA" stroke-width="3" stroke-linecap="round"/>

    <path d="M50,80 L42,75.5 L42,84.5 Z" fill="#004884" stroke="#1E2A44" stroke-width="2" stroke-linejoin="round"/>
    <path d="M50,80 L58,75.5 L58,84.5 Z" fill="#004884" stroke="#1E2A44" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="50" cy="80" r="3" fill="#D2072A"/>

    <rect x="43" y="62" width="14" height="10" rx="3" fill="#DBE2EA" stroke="#1E2A44" stroke-width="2.5"/>

    <rect x="19" y="32" width="62" height="46" rx="19" fill="#FFFFFF" stroke="#1E2A44" stroke-width="3.5"/>

    <circle cx="17" cy="58" r="4.5" fill="#D2072A"/>

    <circle cx="39" cy="58" r="7" fill="#004884"/>
    <circle cx="61" cy="58" r="7" fill="#004884"/>
    <circle cx="41.5" cy="55.5" r="2.2" fill="#FFFFFF"/>
    <circle cx="63.5" cy="55.5" r="2.2" fill="#FFFFFF"/>

    <path d="M39,68 Q50,76 61,68" fill="none" stroke="#1E2A44" stroke-width="3.2" stroke-linecap="round"/>

    <path d="M14,37 C14,12 30,4 50,4 C70,4 86,12 86,37 Z"
        fill="#D2072A" stroke="#1E2A44" stroke-width="3"/>

    <ellipse cx="19" cy="38" rx="15" ry="5.5" fill="#D2072A" stroke="#1E2A44" stroke-width="3"
        transform="rotate(-12 19 38)"/>

    <text x="50" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900"
        font-size="19" fill="#FFFFFF">IN</text>

    <g class="infobot-brazo">
        <path d="M69,78 C86,76 92,58 87,42 C86,38 79,39 80,43 C83,56 78,68 66,71 Z"
            fill="#FFFFFF" stroke="#1E2A44" stroke-width="3.5" stroke-linejoin="round"/>
        <circle cx="85" cy="41" r="7.5" fill="#FFFFFF" stroke="#1E2A44" stroke-width="3.5"/>
    </g>

</svg>
`;


function crearWidgetChatbot() {

    if (typeof CHATBOT_PREGUNTAS === "undefined") return;

    const numeroWhatsapp =
        (typeof INFONEGOCIOS_CONFIG !== "undefined" && INFONEGOCIOS_CONFIG.whatsapp)
            ? INFONEGOCIOS_CONFIG.whatsapp
            : "";

    // ---------- armar el HTML ----------

    const raiz = document.createElement("div");
    raiz.id = "chatbot-widget";

    raiz.innerHTML = `
        <div class="chatbot-teaser" id="chatbot-teaser">

            <button class="chatbot-teaser-cerrar" id="chatbot-teaser-cerrar" aria-label="Cerrar mensaje">×</button>

            <p>¡Hola! Soy Infobot 👋 Estoy acá para resolver tus dudas.</p>

        </div>

        <button id="chatbot-toggle" aria-label="Abrir ayuda" class="chatbot-toggle">

            <span class="chatbot-icono-bot">${INFOBOT_SVG}</span>

            <svg class="chatbot-icono-cerrar" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.3 5.71 12 12.01l-6.3-6.3-1.41 1.41 6.3 6.3-6.3 6.29 1.41 1.41 6.3-6.29 6.3 6.29 1.41-1.41-6.3-6.29 6.3-6.3z"/>
            </svg>

        </button>

        <div id="chatbot-panel" class="chatbot-panel">

            <div class="chatbot-header">

                <span class="chatbot-header-avatar">${INFOBOT_SVG}</span>

                <div>
                    <strong>Infobot</strong>
                    <small>Asistente de Infonegocios</small>
                </div>

            </div>

            <div class="chatbot-mensajes" id="chatbot-mensajes">

                <div class="chatbot-burbuja chatbot-burbuja-bot">
                    ¡Hola! Soy Infobot y estoy acá para resolver tus dudas 👋 Elegí una pregunta de la lista de abajo.
                </div>

            </div>

            <div class="chatbot-preguntas" id="chatbot-preguntas"></div>

            ${numeroWhatsapp ? `
            <a
                href="https://wa.me/${595972277107}?text=${encodeURIComponent("Hola! Tengo una consulta sobre Infonegocios.")}"
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

    // ---------- pintar los botones de preguntas ----------

    CHATBOT_PREGUNTAS.forEach(function (item, indice) {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "chatbot-pregunta-btn";
        boton.textContent = item.pregunta;

        boton.addEventListener("click", function () {
            responderPregunta(indice);
        });

        preguntasCont.appendChild(boton);

    });

    // ---------- lógica de responder ----------

    function responderPregunta(indice) {

        const item = CHATBOT_PREGUNTAS[indice];

        if (!item) return;

        const burbujaUsuario = document.createElement("div");
        burbujaUsuario.className = "chatbot-burbuja chatbot-burbuja-usuario";
        burbujaUsuario.textContent = item.pregunta;
        mensajes.appendChild(burbujaUsuario);

        mensajes.scrollTop = mensajes.scrollHeight;

        const burbujaBot = document.createElement("div");
        burbujaBot.className = "chatbot-burbuja chatbot-burbuja-bot chatbot-burbuja-escribiendo";
        burbujaBot.textContent = "escribiendo...";
        mensajes.appendChild(burbujaBot);

        mensajes.scrollTop = mensajes.scrollHeight;

        // Pequeña pausa para que se sienta más natural, no instantáneo
        setTimeout(function () {

            burbujaBot.textContent = item.respuesta;
            burbujaBot.classList.remove("chatbot-burbuja-escribiendo");
            mensajes.scrollTop = mensajes.scrollHeight;

        }, 500);

    }

    // ---------- globito que aparece solo, sin clickear ----------

    function ocultarTeaser() {
        teaser.classList.remove("chatbot-teaser-visible");
    }

    setTimeout(function () {
        teaser.classList.add("chatbot-teaser-visible");
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

}


crearWidgetChatbot();
