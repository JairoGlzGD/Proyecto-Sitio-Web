========================================================================
FLSM LAB & GUIDE — SUBNETEO IPV4 EN CINCO PASOS
Sitio Web Educativo e Interactivo desarrollado bajo la Metodología
de Maybel Gil Álvarez para la materia de Programación Web (2026)
========================================================================

DESCRIPCIÓN DEL PROYECTO
Recurso didáctico interactivo que explica de manera clara, rigurosa y visual
el método de subneteo FLSM (Fixed Length Subnet Mask) en redes IPv4.
Integra HTML5 semántico, CSS3 modular responsivo sin frameworks, y Vanilla
JavaScript para cálculo matemático bit a bit, simulación de subredes,
visualización interactiva de 32 bits y evaluación formativa con retroalimentación.

CÓMO EJECUTAR EL PROYECTO
1. Descomprime la carpeta del proyecto.
2. Abre "index.html" directamente con cualquier navegador web moderno
   (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari, Brave).
3. No requiere NodeJS, dependencias npm, compiladores ni servidor web backend;
   funciona 100% de manera autónoma y local (offline).
4. Opcional: Si utilizas Visual Studio Code, puedes servirlo con la extensión
   "Live Server".

ESTRUCTURA DE ARCHIVOS
- index.html                   Estructura semántica accesible (HTML5) con las 9 secciones
                               didácticas, calculadora, inspector de 32 bits y evaluación.
- css/estilo.css               Sistema de diseño CSS3 profesional (tokens, Grid, Flexbox,
                               modo claro y modo consola oscura, diseño adaptable y WCAG AA).
- js/cuestionario.js           Lógica interactiva (Vanilla JS): control de tema, guía de
                               5 pasos, inspector de 32 bits, calculadora FLSM y cuestionario.
- DOCUMENTACION_PROYECTO_FLSM.md  Memoria técnica completa basada en la Metodología de
                               Maybel Gil Álvarez (11 puntos: EDT, cronograma Gantt, matriz
                               de pruebas, bitácora de ajustes y arquitectura).
- README.txt                   Esta ficha de especificación y entrega.

CARACTERÍSTICAS Y MÓDULOS PRINCIPALES
1. Fundamentos y Conceptos:
   Explicación de IPv4, CIDR, dirección de red, broadcast, salto de red y hosts útiles.
2. Guía Interactiva en 5 Pasos:
   Navegación por pestañas, atajos de teclado (flechas izquierda/derecha), barra de progreso
   y fórmulas matemáticas formateadas.
3. Caso de Estudio Resuelto:
   Red 192.168.5.0/24 dividida en 8 subredes /27 (máscara 255.255.255.224, salto 32, 30 hosts
   útiles), diferenciando 5 subredes operativas de 3 subredes de reserva.
4. Inspector Binario de 32 Bits en Vivo:
   Visualiza los 4 octetos en tiempo real con código de colores: Azul (Red base),
   Ámbar (Bits prestados de subred) y Verde (Bits de host), con selector de prefijo CIDR.
5. Simulador y Calculadora Dinámica FLSM:
   Permite ingresar cualquier red IPv4 y prefijo (/8 a /30) o cargar presets típicos,
   calculando en tiempo real la máscara, salto y generando la tabla completa con opción
   de copiar al portapapeles.
6. Cuestionario de Autoevaluación Formativa:
   5 reactivos con corrección inmediata, explicaciones pedagógicas individuales por
   pregunta y calificación porcentual.
7. Glosario Técnico Interactivo:
   Acordeón accesible con respuestas a dudas habituales sobre subneteo.
8. Selector de Tema:
   Alterna instantáneamente entre Modo Claro y Modo Consola Oscura (estética de ingeniería).
9. Sección de Metodología y EDT:
   Resumen de las 7 fases de la metodología de Maybel Gil Álvarez y acceso a la memoria técnica.

METODOLOGÍA DE DESARROLLO (MAYBEL GIL ÁLVAREZ)
El proyecto fue gestionado siguiendo las fases formales:
- Fase 1.0: Análisis y Definición (Delimitación temática, perfil de usuarios, fuentes RFC).
- Fase 2.0: Planificación y Gestión (Estructura de Desglose del Trabajo - EDT y Cronograma Gantt).
- Fase 3.0: Diseño Instruccional y Navegación (Guion pedagógico, caso 192.168.5.0/24).
- Fase 4.0: Diseño UI/UX No Genérico (Tokens de diseño, tipografía monoespaciada para octetos).
- Fase 5.0: Desarrollo Frontend (HTML5 semántico, CSS3 modular, JavaScript puro).
- Fase 6.0: Aseguramiento de Calidad (Matriz de 10 casos de prueba y contraste con Python ipaddress).
- Fase 7.0: Documentación y Entrega (Bitácora de incidencias, memoria técnica y empaquetado).

FUENTES TÉCNICAS Y NORMATIVAS (IETF RFC)
- RFC 791: Internet Protocol Specification (Arquitectura IPv4).
- RFC 950: Internet Standard Subnetting Procedure.
- RFC 1878: Variable Length Subnet Table For IPv4.
- RFC 3021: Using 31-Bit Prefixes on IPv4 Point-to-Point Links.
========================================================================
