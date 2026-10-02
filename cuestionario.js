/* ==========================================================================
   FLSM LAB & GUIDE — LÓGICA E INTERACTIVIDAD (VANILLA JAVASCRIPT)
   Navegación de pasos, Inspector de 32 bits, Simulador FLSM y Cuestionario.
   Cumple estándares W3C y accesibilidad WCAG 2.1 AA. Sin librerías externas.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
    // ----------------------------------------------------------------------
    // 1. GESTIÓN DE TEMA (MODO CLARO / MODO CONSOLA OSCURA)
    // ----------------------------------------------------------------------
    const btnTema = document.getElementById("btnTema");
    const iconoTema = document.getElementById("iconoTema");
    
    function aplicarTema(tema) {
        if (tema === "dark") {
            document.documentElement.setAttribute("data-theme", "dark");
            if (iconoTema) iconoTema.textContent = "☀️";
            if (btnTema) btnTema.setAttribute("aria-label", "Cambiar a modo claro");
        } else {
            document.documentElement.removeAttribute("data-theme");
            if (iconoTema) iconoTema.textContent = "🌙";
            if (btnTema) btnTema.setAttribute("aria-label", "Cambiar a modo consola oscura");
        }
        localStorage.setItem("flsm_tema", tema);
    }
    
    const temaGuardado = localStorage.getItem("flsm_tema");
    const prefiereOscuro = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (temaGuardado) {
        aplicarTema(temaGuardado);
    } else if (prefiereOscuro) {
        aplicarTema("dark");
    }
    
    if (btnTema) {
        btnTema.addEventListener("click", function () {
            const esOscuro = document.documentElement.getAttribute("data-theme") === "dark";
            aplicarTema(esOscuro ? "light" : "dark");
        });
    }

    // ----------------------------------------------------------------------
    // 2. PROCEDIMIENTO GUIADO DE 5 PASOS
    // ----------------------------------------------------------------------
    const pasos = document.querySelectorAll(".paso");
    const enlacesPasos = document.querySelectorAll(".boton-paso");
    const anterior = document.getElementById("btnAnterior");
    const siguiente = document.getElementById("btnSiguiente");
    const textoProgreso = document.getElementById("progreso");
    let pasoActual = 0;

    function mostrarPaso(numero, moverFoco) {
        if (numero < 0 || numero >= pasos.length) return;
        pasoActual = numero;

        for (let i = 0; i < pasos.length; i++) {
            const activo = i === pasoActual;
            pasos[i].hidden = !activo;
            enlacesPasos[i].classList.toggle("activo", activo);

            if (activo) {
                enlacesPasos[i].setAttribute("aria-current", "step");
            } else {
                enlacesPasos[i].removeAttribute("aria-current");
            }
        }

        if (anterior) anterior.disabled = pasoActual === 0;
        if (siguiente) siguiente.disabled = pasoActual === pasos.length - 1;
        if (textoProgreso) textoProgreso.textContent = "Paso " + (pasoActual + 1) + " de " + pasos.length;

        if (moverFoco && pasos[pasoActual]) {
            const titulo = pasos[pasoActual].querySelector("h3");
            if (titulo) titulo.focus();
        }
    }

    function abrirPasoDesdeEnlace() {
        for (let i = 0; i < pasos.length; i++) {
            if (window.location.hash === "#" + pasos[i].id) {
                mostrarPaso(i, true);
                return;
            }
        }
    }

    if (pasos.length > 0) {
        const controles = document.getElementById("controlesPasos");
        if (controles) controles.hidden = false;
        mostrarPaso(0, false);
        abrirPasoDesdeEnlace();
        window.addEventListener("hashchange", abrirPasoDesdeEnlace);

        enlacesPasos.forEach((enlace, index) => {
            enlace.addEventListener("click", function (e) {
                e.preventDefault();
                mostrarPaso(index, true);
            });
        });

        if (anterior) {
            anterior.addEventListener("click", function () {
                if (pasoActual > 0) mostrarPaso(pasoActual - 1, true);
            });
        }

        if (siguiente) {
            siguiente.addEventListener("click", function () {
                if (pasoActual < pasos.length - 1) mostrarPaso(pasoActual + 1, true);
            });
        }

        // Navegación con teclado dentro del área de pasos (flechas izquierda/derecha)
        const seccionPasos = document.getElementById("pasos");
        if (seccionPasos) {
            seccionPasos.addEventListener("keydown", function (e) {
                if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
                if (e.key === "ArrowRight" && pasoActual < pasos.length - 1) {
                    mostrarPaso(pasoActual + 1, true);
                } else if (e.key === "ArrowLeft" && pasoActual > 0) {
                    mostrarPaso(pasoActual - 1, true);
                }
            });
        }
    }

    // ----------------------------------------------------------------------
    // 3. INSPECTOR INTERACTIVO DE 32 BITS EN VIVO
    // ----------------------------------------------------------------------
    const sliderCidr = document.getElementById("sliderCidr");
    const valCidr = document.getElementById("valCidr");
    const octetosContainer = document.getElementById("octetosContainer");
    const mascaraCalculada = document.getElementById("mascaraCalculada");
    const subredesGeneradasBits = document.getElementById("subredesGeneradasBits");
    const hostsUtilesBits = document.getElementById("hostsUtilesBits");

    const pesobits = [128, 64, 32, 16, 8, 4, 2, 1];

    function actualizarInspector(cidrBase, cidrNuevo) {
        if (!octetosContainer) return;
        octetosContainer.innerHTML = "";

        // Calcular máscara decimal
        const mascaraOctetos = [0, 0, 0, 0];
        for (let i = 0; i < 32; i++) {
            if (i < cidrNuevo) {
                const octIndex = Math.floor(i / 8);
                const bitIndex = i % 8;
                mascaraOctetos[octIndex] += pesobits[bitIndex];
            }
        }

        const mascaraStr = mascaraOctetos.join(".");
        if (mascaraCalculada) mascaraCalculada.textContent = mascaraStr;

        const bitsPrestados = Math.max(0, cidrNuevo - cidrBase);
        const bitsHost = Math.max(0, 32 - cidrNuevo);
        const totalSubredes = Math.pow(2, bitsPrestados);
        const totalHosts = bitsHost > 1 ? Math.pow(2, bitsHost) - 2 : 0;

        if (subredesGeneradasBits) subredesGeneradasBits.textContent = totalSubredes.toLocaleString();
        if (hostsUtilesBits) hostsUtilesBits.textContent = totalHosts.toLocaleString();

        // Renderizar los 4 octetos con sus 8 bits
        for (let o = 0; o < 4; o++) {
            const octetoDiv = document.createElement("div");
            octetoDiv.className = "octeto-caja";

            const header = document.createElement("div");
            header.className = "octeto-header";
            header.innerHTML = `<span>Octeto ${o + 1}</span><span>${mascaraOctetos[o]}</span>`;
            octetoDiv.appendChild(header);

            const bitsGrid = document.createElement("div");
            bitsGrid.className = "octeto-bits";

            for (let b = 0; b < 8; b++) {
                const bitGlobal = o * 8 + b;
                const bitChip = document.createElement("div");
                let claseTipo = "bit-host";
                let valorBit = "0";

                if (bitGlobal < cidrBase) {
                    claseTipo = "bit-red";
                    valorBit = "1";
                } else if (bitGlobal < cidrNuevo) {
                    claseTipo = "bit-subred";
                    valorBit = "1";
                }

                bitChip.className = `bit-chip ${claseTipo}`;
                bitChip.title = `Bit ${bitGlobal + 1} (peso ${pesobits[b]}): ${claseTipo.replace("bit-", "").toUpperCase()}`;
                bitChip.innerHTML = `${valorBit}<small>${pesobits[b]}</small>`;
                bitsGrid.appendChild(bitChip);
            }

            octetoDiv.appendChild(bitsGrid);

            const pie = document.createElement("div");
            pie.className = "octeto-decimal";
            pie.textContent = `${mascaraOctetos[o]} / 255`;
            octetoDiv.appendChild(pie);

            octetosContainer.appendChild(octetoDiv);
        }
    }

    if (sliderCidr) {
        sliderCidr.addEventListener("input", function () {
            const nuevoCidr = parseInt(this.value, 10);
            if (valCidr) valCidr.textContent = "/" + nuevoCidr;
            // Tomamos /24 como base estándar del ejemplo
            actualizarInspector(24, nuevoCidr);
        });
        // Inicializar inspector en /27 (el caso del ejercicio)
        actualizarInspector(24, 27);
    }

    // ----------------------------------------------------------------------
    // 4. CALCULADORA Y SIMULADOR FLSM DINÁMICO
    // ----------------------------------------------------------------------
    const calcIp = document.getElementById("calcIp");
    const calcCidrBase = document.getElementById("calcCidrBase");
    const calcModo = document.getElementById("calcModo");
    const calcCantidad = document.getElementById("calcCantidad");
    const btnCalcular = document.getElementById("btnCalcular");
    const simuladorMensaje = document.getElementById("simuladorMensaje");
    const tablaDinamicaCuerpo = document.getElementById("tablaDinamicaCuerpo");
    const btnCopiarTabla = document.getElementById("btnCopiarTabla");

    // Métricas
    const resNuevoCidr = document.getElementById("resNuevoCidr");
    const resNuevaMascara = document.getElementById("resNuevaMascara");
    const resSalto = document.getElementById("resSalto");
    const resTotalSubredes = document.getElementById("resTotalSubredes");
    const resHostsPorSubred = document.getElementById("resHostsPorSubred");

    function ipAEntero(ipStr) {
        return ipStr.split(".").reduce((acc, oct) => (acc << 8) + parseInt(oct, 10), 0) >>> 0;
    }

    function enteroAIp(intVal) {
        return [
            (intVal >>> 24) & 255,
            (intVal >>> 16) & 255,
            (intVal >>> 8) & 255,
            intVal & 255
        ].join(".");
    }

    function cidrAMascaraOctetos(cidr) {
        const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
        return [
            (mask >>> 24) & 255,
            (mask >>> 16) & 255,
            (mask >>> 8) & 255,
            mask & 255
        ];
    }

    function ejecutarCalculoFLSM() {
        if (!calcIp || !calcCidrBase || !calcCantidad) return;
        const ipStr = calcIp.value.trim();
        const cidrBase = parseInt(calcCidrBase.value, 10);
        const modo = calcModo.value;
        const cantidad = parseInt(calcCantidad.value, 10);

        if (simuladorMensaje) simuladorMensaje.textContent = "";

        // Validar IP
        const partesIp = ipStr.split(".");
        if (partesIp.length !== 4 || partesIp.some(p => isNaN(p) || p === "" || parseInt(p, 10) < 0 || parseInt(p, 10) > 255)) {
            if (simuladorMensaje) {
                simuladorMensaje.textContent = "Error: Ingresa una dirección IPv4 válida (ej. 192.168.5.0).";
                simuladorMensaje.hidden = false;
            }
            return;
        }

        if (isNaN(cantidad) || cantidad <= 0) {
            if (simuladorMensaje) {
                simuladorMensaje.textContent = "Error: Ingresa una cantidad válida requerida mayor a cero.";
                simuladorMensaje.hidden = false;
            }
            return;
        }

        const bitsDisponibles = 32 - cidrBase;
        let bitsPrestados = 0;
        let bitsHost = 0;

        if (modo === "subredes") {
            // 2^n >= cantidad
            while (Math.pow(2, bitsPrestados) < cantidad) {
                bitsPrestados++;
            }
            bitsHost = bitsDisponibles - bitsPrestados;
        } else {
            // Por hosts: 2^h - 2 >= cantidad
            while (Math.pow(2, bitsHost) - 2 < cantidad) {
                bitsHost++;
            }
            bitsPrestados = bitsDisponibles - bitsHost;
        }

        if (bitsPrestados < 0 || bitsHost < 2 || (cidrBase + bitsPrestados) > 30) {
            if (simuladorMensaje) {
                simuladorMensaje.textContent = `Imposible realizar FLSM: El requerimiento excede la capacidad de la red /${cidrBase}. Máximo prefijo admisible /30 (mínimo 2 hosts por subred).`;
                simuladorMensaje.hidden = false;
            }
            return;
        }

        const nuevoCidr = cidrBase + bitsPrestados;
        const octetosMascara = cidrAMascaraOctetos(nuevoCidr);
        const mascaraStr = octetosMascara.join(".");
        const totalSubredes = Math.pow(2, bitsPrestados);
        const hostsUtiles = Math.pow(2, bitsHost) - 2;
        const tamBloque = Math.pow(2, bitsHost);

        // Identificar salto y octeto afectado
        let octetoAfectado = Math.floor((nuevoCidr - 1) / 8);
        let salto = 256 - octetosMascara[octetoAfectado];

        // Actualizar métricas
        if (resNuevoCidr) resNuevoCidr.textContent = `/${nuevoCidr}`;
        if (resNuevaMascara) resNuevaMascara.textContent = mascaraStr;
        if (resSalto) resSalto.textContent = `${salto} (en octeto ${octetoAfectado + 1})`;
        if (resTotalSubredes) resTotalSubredes.textContent = `${totalSubredes} (${bitsPrestados} bits)`;
        if (resHostsPorSubred) resHostsPorSubred.textContent = `${hostsUtiles} útiles`;

        // Generar tabla dinámica de subredes
        if (tablaDinamicaCuerpo) {
            tablaDinamicaCuerpo.innerHTML = "";
            let ipBaseEntero = (ipAEntero(ipStr) & (cidrAMascaraOctetos(cidrBase).reduce((acc, oct) => (acc << 8) + oct, 0) >>> 0)) >>> 0;

            // Renderizamos hasta un máximo razonable para la interfaz (ej. 64)
            const limiteVisual = Math.min(totalSubredes, 64);

            for (let i = 0; i < limiteVisual; i++) {
                const subredRedInt = (ipBaseEntero + (i * tamBloque)) >>> 0;
                const primerHostInt = (subredRedInt + 1) >>> 0;
                const broadcastInt = (subredRedInt + tamBloque - 1) >>> 0;
                const ultimoHostInt = (broadcastInt - 1) >>> 0;

                const esReserva = (modo === "subredes" && i >= cantidad);

                const tr = document.createElement("tr");
                if (esReserva) tr.className = "reserva";

                tr.innerHTML = `
                    <th scope="row">${i + 1} ${esReserva ? '<small>Reserva</small>' : ''}</th>
                    <td><strong>${enteroAIp(subredRedInt)}/${nuevoCidr}</strong></td>
                    <td>${enteroAIp(primerHostInt)}</td>
                    <td>${enteroAIp(ultimoHostInt)}</td>
                    <td>${enteroAIp(broadcastInt)}</td>
                `;
                tablaDinamicaCuerpo.appendChild(tr);
            }

            if (totalSubredes > limiteVisual) {
                const trAviso = document.createElement("tr");
                trAviso.innerHTML = `<td colspan="5" style="text-align:center; padding:12px; color:var(--text-muted);">... Mostrando las primeras ${limiteVisual} de ${totalSubredes} subredes calculadas.</td>`;
                tablaDinamicaCuerpo.appendChild(trAviso);
            }
        }

        // Sincronizar también el inspector visual
        if (sliderCidr) {
            sliderCidr.value = nuevoCidr;
            if (valCidr) valCidr.textContent = `/${nuevoCidr}`;
            actualizarInspector(cidrBase, nuevoCidr);
        }
    }

    if (btnCalcular) {
        btnCalcular.addEventListener("click", ejecutarCalculoFLSM);
    }

    // Presets rápidos
    const presetBtns = document.querySelectorAll(".preset-btn");
    presetBtns.forEach(btn => {
        btn.addEventListener("click", function () {
            const ip = this.dataset.ip;
            const cidr = this.dataset.cidr;
            const modo = this.dataset.modo;
            const cant = this.dataset.cant;

            if (calcIp) calcIp.value = ip;
            if (calcCidrBase) calcCidrBase.value = cidr;
            if (calcModo) calcModo.value = modo;
            if (calcCantidad) calcCantidad.value = cant;

            ejecutarCalculoFLSM();
        });
    });

    // Copiar tabla al portapapeles
    if (btnCopiarTabla) {
        btnCopiarTabla.addEventListener("click", function () {
            const filas = document.querySelectorAll("#tablaDinamica tbody tr");
            if (filas.length === 0) return;

            let texto = "Subred\tDirección de Red\tPrimer Host\tÚltimo Host\tBroadcast\n";
            filas.forEach(fila => {
                const celdas = fila.querySelectorAll("th, td");
                const linea = Array.from(celdas).map(c => c.textContent.trim()).join("\t");
                texto += linea + "\n";
            });

            navigator.clipboard.writeText(texto).then(() => {
                const textoOriginal = btnCopiarTabla.textContent;
                btnCopiarTabla.textContent = "✓ ¡Tabla copiada!";
                setTimeout(() => {
                    btnCopiarTabla.textContent = textoOriginal;
                }, 2000);
            }).catch(() => {
                alert("No se pudo copiar automáticamente. Puedes seleccionar el texto de la tabla.");
            });
        });
    }

    // ----------------------------------------------------------------------
    // 5. CUESTIONARIO DE AUTOEVALUACIÓN FORMATIVA
    // ----------------------------------------------------------------------
    const formulario = document.getElementById("formFLSM");
    const resultado = document.getElementById("resultado");
    const preguntas = document.querySelectorAll(".pregunta");
    const correctas = ["V", "F", "3", "224", "95"];
    const explicaciones = [
        "En FLSM (Fixed Length Subnet Mask), todas las subredes comparten exactamente el mismo prefijo y máscara.",
        "Un prefijo /27 posee 32 direcciones totales; por norma IPv4 se descuentan 2 (red y difusión), quedando 30 hosts útiles.",
        "Se prestan 3 bits porque 2³ = 8 ≥ 5 subredes. Con 2 bits solo tendríamos 4 subredes, insuficiente.",
        "La máscara /27 equivale a 255.255.255.224 en decimal (11100000 en binario: 128 + 64 + 32 = 224).",
        "El bloque va de .64 a .95. El primer host es .65, el último host es .94 y el broadcast es 192.168.5.95."
    ];

    function limpiarResultado() {
        if (!resultado) return;
        resultado.textContent = "";
        for (let i = 0; i < preguntas.length; i++) {
            preguntas[i].classList.remove("correcta", "incorrecta");
            const mensaje = document.getElementById("respuesta" + (i + 1));
            if (mensaje) {
                mensaje.textContent = "";
                mensaje.hidden = true;
            }
        }
    }

    function verificarCuestionario(evento) {
        evento.preventDefault();
        limpiarResultado();

        const p1 = document.querySelector('input[name="p1"]:checked');
        const p2 = document.querySelector('input[name="p2"]:checked');
        const p3 = document.getElementById("p3") ? document.getElementById("p3").value : "";
        const p4 = document.getElementById("p4") ? document.getElementById("p4").value : "";
        const p5 = document.querySelector('input[name="p5"]:checked');

        if (!p1 || !p2 || p3 === "" || p4 === "" || !p5) {
            resultado.textContent = "Por favor responde las cinco preguntas antes de verificar.";
            resultado.hidden = false;
            return;
        }

        const respuestas = [p1.value, p2.value, p3, p4, p5.value];
        let aciertos = 0;

        for (let i = 0; i < respuestas.length; i++) {
            const esCorrecta = respuestas[i] === correctas[i];
            const mensaje = document.getElementById("respuesta" + (i + 1));

            if (esCorrecta) aciertos++;
            preguntas[i].classList.add(esCorrecta ? "correcta" : "incorrecta");

            if (mensaje) {
                mensaje.innerHTML = (esCorrecta ? "<strong>✓ Correcto: </strong>" : "<strong>✗ Revisa tu respuesta: </strong>") + explicaciones[i];
                mensaje.hidden = false;
            }
        }

        const porcentaje = Math.round((aciertos / 5) * 100);
        let mensajeGlobal = "";
        if (aciertos === 5) {
            mensajeGlobal = `🎯 ¡Puntaje perfecto! ${aciertos}/5 aciertos (${porcentaje}%). Dominas los 5 pasos del subneteo FLSM.`;
        } else if (aciertos >= 3) {
            mensajeGlobal = `👍 Buen intento: obtuviste ${aciertos} de 5 correctas (${porcentaje}%). Revisa las explicaciones de los errores para consolidar el tema.`;
        } else {
            mensajeGlobal = `📚 Obtuviste ${aciertos} de 5 correctas (${porcentaje}%). Te sugerimos repasar los pasos 2, 3 y 4 en la guía antes de intentar de nuevo.`;
        }

        resultado.textContent = mensajeGlobal;
        resultado.hidden = false;
        resultado.focus();
    }

    if (formulario) {
        formulario.addEventListener("submit", verificarCuestionario);
        formulario.addEventListener("reset", function () {
            limpiarResultado();
            if (resultado) resultado.hidden = true;
        });
        formulario.addEventListener("change", function () {
            if (resultado && resultado.textContent !== "") {
                limpiarResultado();
                resultado.hidden = true;
            }
        });
    }

    // ----------------------------------------------------------------------
    // 6. ACORDEÓN INTERACTIVO DEL GLOSARIO TÉCNICO
    // ----------------------------------------------------------------------
    const headersGlosario = document.querySelectorAll(".glosario-header");
    headersGlosario.forEach(header => {
        header.addEventListener("click", function () {
            const expandido = this.getAttribute("aria-expanded") === "true";
            this.setAttribute("aria-expanded", !expandido);
            const cuerpo = this.nextElementSibling;
            if (cuerpo) {
                cuerpo.hidden = expandido;
            }
        });
    });

    // Disparar cálculo inicial del simulador con los valores por defecto
    ejecutarCalculoFLSM();
});
