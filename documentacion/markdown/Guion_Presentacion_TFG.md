# 📢 Estructura y Guion para la Defensa del TFG: MangaKick

Esta guía está diseñada estratégicamente para estructurar una presentación de **10 a 15 minutos** ante el tribunal de evaluación de la **Universidad Miguel Hernández de Elche**. 

Para un tiempo de 10-15 minutos, la regla de oro en ingeniería de software es utilizar **10 diapositivas** limpias y directas, destinando aproximadamente **1 minuto a 1.5 minutos por diapositiva**.

---

## ⏱️ Distribución de Tiempos Recomendada

```mermaid
gantt
    title Plan de Exposición (12 Minutos Totales)
    dateFormat  s
    axisFormat %M:%S
    
    section Introducción
    Portada & Contexto (1.5m)       :active, 0, 90s
    Objetivos (1m)                  :90s, 150s
    section Análisis
    Estado del Arte (1.5m)          :150s, 240s
    Arquitectura & Tecnologías (2m) :240s, 360s
    section Núcleo Técnico
    Motor de Partidos (2m)          :360s, 480s
    Entrenamiento & Sincronización (1.5m) :480s, 570s
    section Validación
    Pruebas & Despliegue Docker (1.5m) :570s, 660s
    Conclusiones & Cierre (1m)      :660s, 720s
```

---

## 🛝 Estructura Diapositiva a Diapositiva

### Diapositiva 1: Portada y Presentación
*   **Contenido Visual de la Diapositiva:**
    *   Logotipo de la Universidad Miguel Hernández / EPS Elche.
    *   Título: **MangaKick — Diseño e Implementación de un Simulador Táctico de Fútbol Web Híbrido**.
    *   Autor: **José Luis Llorens Climent**.
    *   Convocatoria: **Mayo de 2026**.
*   **Guion de Exposición (Tiempo sugerido: 45s):**
    > *"Buenos días, distinguidos miembros del tribunal. Mi nombre es José Luis Llorens Climent y comparezco ante ustedes para presentar la defensa de mi Trabajo Fin de Grado titulado 'MangaKick: Diseño e Implementación de un Simulador Táctico de Fútbol Web Híbrido'. Este trabajo ha sido desarrollado con el objetivo de proponer una solución tecnológica innovadora y de alto rendimiento en el ámbito de los videojuegos web y la simulación deportiva, aplicando las mejores prácticas modernas de ingeniería del software, DevOps y desarrollo full-stack que he adquirido a lo largo de mis estudios en esta universidad."*

---

### Diapositiva 2: Contexto y Justificación (El Problema)
*   **Contenido Visual de la Diapositiva:**
    *   *Punto 1:* **Brecha de mercado:** Simuladores hiperrealistas áridos vs. juegos arcade rápidos sin factor táctico.
    *   *Punto 2:* **Vacío creativo:** Restricciones de licencias comerciales que impiden la interacción de futbolistas reales con personajes ficticios de anime.
    *   *Punto 3:* **Sobrecarga web habitual:** Aplicaciones web pesadas (WebAssembly o motores 3D) que penalizan el rendimiento.
*   **Guion de Exposición (Tiempo sugerido: 1m 15s):**
    > *"Para contextualizar el proyecto, debemos observar el panorama actual de los videojuegos deportivos. Por un lado, tenemos simuladores de una profundidad matemática apabullante pero con interfaces frías y monótonas de difícil acceso para el usuario casual. Por otro lado, los juegos basados en licencias de anime deportivo se centran únicamente en la acción en tiempo real, ignorando la planificación estratégica. Además, debido a restricciones comerciales, es imposible que personajes del anime interactúen con futbolistas reales bajo un sistema común.
    >
    > Frente a esto, MangaKick nace como una respuesta innovadora: un simulador táctico híbrido y ultra-ligero que combina futbolistas reales e iconos de la animación japonesa bajo reglas estadísticas justas y equilibradas, accesible directamente desde el navegador web al instante y sin necesidad de instalaciones pesadas."*

---

### Diapositiva 3: Objetivos del Proyecto
*   **Contenido Visual de la Diapositiva:**
    *   **Objetivo Principal:** Diseñar, implementar y desplegar una plataforma web interactiva y modular para simulación táctica de fútbol híbrida con despliegue dockerizado.
    *   **Objetivos Específicos:**
        *   Programar un motor probabilístico balanceado en el backend.
        *   Construir una interfaz SPA premium, adaptativa y fluida.
        *   Diseñar una API REST desacoplada y un modelo de persistencia local robusto.
        *   Contenedorizar la infraestructura para un despliegue inmediato de un solo comando (`Docker Compose`).
*   **Guion de Exposición (Tiempo sugerido: 1m):**
    > *"El objetivo principal que ha guiado este desarrollo ha sido diseñar, implementar y desplegar una plataforma web robusta, interactiva y de alto impacto visual. Para cumplir con esta meta, nos propusimos varios objetivos secundarios específicos de ingeniería: en primer lugar, codificar un motor probabilístico calibrado y balanceado en el servidor; en segundo lugar, construir una interfaz de página única atractiva que responda de forma adaptativa a cualquier dispositivo; en tercer lugar, estructurar una API REST modular con persistencia de datos segura; y, por último, asegurar que todo el ecosistema sea dockerizado para garantizar su portabilidad absoluta en cualquier máquina de evaluación."*

---

### Diapositiva 4: Estado del Arte y Cuadro Comparativo
*   **Contenido Visual de la Diapositiva:**
    *   Tabla comparativa resumida:
        *   *Football Manager* (Hipercomplejo, caro, nativo pesado).
        *   *Captain Tsubasa* (Arcade, exclusivo de consolas, sin táctica).
        *   *Inazuma Eleven* (Foco RPG, plataforma cerrada).
        *   **MangaKick** (Acceso web instantáneo, consumo ultra-bajo, gratis, base de datos híbrida, equilibrio táctico).
*   **Guion de Exposición (Tiempo sugerido: 1m 15s):**
    > *"Antes de proceder con el diseño, realizamos un exhaustivo análisis del estado del arte. Evaluamos los referentes más importantes: 'Football Manager' como líder estratégico, 'Captain Tsubasa: Rise of New Champions' como referente visual, e 'Inazuma Eleven' en la progresión RPG.
    >
    > Como se puede observar en la tabla, todos los competidores comerciales operan en entornos cerrados, exigen descargas de decenas de gigabytes o requieren tarjetas gráficas dedicadas. Nuestra propuesta de valor reside en ofrecer portabilidad absoluta a través del navegador web con un consumo de recursos en hardware extremadamente bajo, integrando mecánicas de progresión y jugabilidad de manera completamente equilibrada e intuitiva."*

---

### Diapositiva 5: Arquitectura del Sistema (Tres Capas)
*   **Contenido Visual de la Diapositiva:**
    *   Esquema gráfico de la arquitectura (Figura 3.1):
        *   **Capa Cliente:** React 19, TypeScript, Vanilla CSS (Auto-sync reactivo, Auto-login).
        *   **Capa de Negocio:** Express REST API en Node.js (Rutas modularizadas).
        *   **Capa de Persistencia:** Gestión híbrida en memoria RAM y sincronización asíncrona local a `users.json`.
*   **Guion de Exposición (Tiempo sugerido: 1m 45s):**
    > *"A nivel técnico, la aplicación se ha estructurado bajo una arquitectura desacoplada de tres capas cliente-servidor.
    > 
    > En el cliente, utilizamos React 19 y TypeScript para una lógica limpia y libre de errores en tiempo de ejecución. Los estilos se han maquetado con Vanilla CSS avanzado para maximizar el rendimiento gráfico mediante HSL y aceleración de hardware de la GPU.
    > En la capa de negocio, el servidor Express en Node.js procesa de manera asíncrona no bloqueante las peticiones y simula los partidos en menos de 50 milisegundos.
    > Finalmente, para la capa de datos, se ha diseñado un modelo de Persistencia Híbrida Local: las operaciones críticas de registro, balance de saldo, progresión y pizarra táctica se gestionan en caché RAM para eliminar latencias de red, sincronizándose de forma asíncrona contra un archivo estructurado local 'users.json' en disco. Esta decisión de ingeniería garantiza que el examinador pueda levantar el sistema al instante sin la sobrecarga de instalar bases de datos tradicionales en su ordenador."*

---

### Diapositiva 6: Lógica del Motor de Simulación (Match Engine)
*   **Contenido Visual de la Diapositiva:**
    *   Fórmula de Posesión: confrontación colectiva de Pase y Regate.
    *   Fórmula de Tiro (`ShotChance`): probabilidad basada en tiro, velocidad y habilidad especial.
    *   Fórmula de Parada del Portero (`SaveChance`): confrontación directa y penalización por habilidades especiales.
    *   Habilidades Especiales: boosts de $+10$ y $+15$ en estadísticas y log de eventos narrativo.
*   **Guion de Exposición (Tiempo sugerido: 2m):**
    > *"El corazón lógico del backend es el motor de simulación de partidos, el cual se rige por un estricto modelado matemático probabilístico y no por pura aleatoriedad.
    >
    > En primer lugar, la posesión del balón se determina confrontando la media de las estadísticas de Pase y Regate de los jugadores alineados en el césped. 
    > En segundo lugar, durante cada fase de ataque, se calcula la probabilidad de disparo ('ShotChance') ponderando los atributos de Tiro y Velocidad del atacante. Si se activa la habilidad especial del futbolista —como el icónico disparo de Tsubasa Ozora— se inyecta una crónica exclusiva en el partido y el jugador recibe un boost temporal de estadísticas para esa jugada.
    > Por último, la probabilidad de parada del portero ('SaveChance') se calcula basándose en su Defensa y Físico, restando la capacidad de tiro del delantero y aplicando una severa penalización si el tiro viene potenciado por una habilidad especial de anime. La función está acotada matemáticamente para evitar escenarios imposibles y asegurar un partido dinámico e impredecible."*

---

### Diapositiva 7: Sistemas de Progresión y Sincronización Reactiva
*   **Contenido Visual de la Diapositiva:**
    *   **Progresión (XP):** Entrenamientos específicos (drills) que consumen monedas, otorgan XP y otorgan boosts de atributos (pace, shooting, etc.). Fórmula lineal de subida de nivel.
    *   **Sincronización Automática (Auto-Sync Hook):** Hook reactivo `useEffect` que detecta mutaciones en la interfaz y emite peticiones `POST` seguras con cabecera `x-username`.
    *   **Control de Estado e Invitado:** Prevención de colisiones al cargar perfiles y aislamiento para el modo temporal de Invitado.
*   **Guion de Exposición (Tiempo sugerido: 1m 30s):**
    > *"Otro de los pilares del desarrollo son las dinámicas de progresión y la persistencia de perfiles. En el centro de entrenamiento, los directores técnicos pueden someter a sus futbolistas a drills específicos para aumentar atributos individuales. Al ganar experiencia (XP) y subir de nivel, los futbolistas reciben un bonus armónico de +1 en todas sus estadísticas básicas.
    >
    > Para comunicar la sesión de React en el navegador con el backend de forma segura y transparente, implementamos un Hook de Sincronización Reactiva. Cuando el hook detecta que el saldo de monedas, la plantilla o la pizarra táctica cambian, despacha de forma asíncrona una petición HTTP sincronizando el estado con el servidor a través de la cabecera 'x-username'. Asimismo, incorporamos cerraduras lógicas que previenen sobreescrituras accidentales durante el arranque de sesión y aislamos completamente el estado dinámico del cliente cuando se decide ingresar en el Modo Invitado."*

---

### Diapositiva 8: Pruebas, DevOps y Despliegue con Docker
*   **Contenido Visual de la Diapositiva:**
    *   **Pruebas Funcionales:** Simulaciones masivas de partidos (1000 iteraciones en bucle) certificando un balance estadístico lógico. Pruebas de límites de atributos (tope estricto en 99).
    *   **Despliegue Docker Compose:** Levantado de servicios frontend y backend aislados mediante `docker-compose up --build`.
    *   **Nginx Integrado:** Cliente web compilado estáticamente y servido con Nginx ligero.
*   **Guion de Exposición (Tiempo sugerido: 1m 30s):**
    > *"Con el fin de garantizar la calidad y robustez del software, realizamos un exhaustivo plan de validación. Llevamos a cabo pruebas de balance táctico automatizadas ejecutando mil simulaciones continuas, confirmando que la distribución de victorias seguía una progresión lógica respecto al nivel del equipo. También comprobamos los límites de atributos para evitar desbordamientos de datos de las estadísticas.
    >
    > El despliegue de MangaKick se ha automatizado por completo mediante Docker y Docker Compose. A través del manifiesto 'docker-compose.yml', el backend compila su imagen ligera en Node alpine y expone el puerto 5000. Por su parte, el frontend compila su bundle estático optimizado de React y lo inyecta dentro de un servidor web Nginx de alto rendimiento, exponiendo el puerto 80 mapeado al puerto local 5173. Ambos contenedores operan de forma aislada en su propia red interna, garantizando un despliegue limpio y portable en cualquier máquina."*

---

### Diapositiva 9: Demostración Práctica (Vídeo o Capturas)
*   **Contenido Visual de la Diapositiva:**
    *   Capturas de pantalla o un vídeo corto (1 minuto) de la aplicación funcionando:
        *   Panel de Bienvenida (Registro, Login y Acceso como Invitado).
        *   Pantalla Principal: la Pizarra Táctica de 5 ranuras con drag & drop.
        *   Mercado de Fichajes y Centro de Entrenamiento interactivo.
        *   Consola de simulación de partidos minuto a minuto.
*   **Guion de Exposición (Tiempo sugerido: 1m):**
    > *"A continuación, me gustaría mostrarles brevemente el comportamiento real de la aplicación. [Si tienes vídeo, ponlo y nárralo; si no, señala las capturas]. Al iniciar, la interfaz presenta una tarjeta glassmórfica que permite registrarse, iniciar sesión con credenciales persistentes o acceder al instante como Invitado. Una vez dentro, la pizarra táctica permite arrastrar libremente a los futbolistas para conformar nuestro quinteto de juego. El mercado de fichajes y el centro de entrenamiento reaccionan de inmediato con microanimaciones suaves en CSS. Al pulsar 'Iniciar Simulación', el motor de Express calcula el partido al instante y el frontend reproduce la crónica en tiempo real con una experiencia visual fluida y atractiva."*

---

### Diapositiva 10: Conclusiones y Trabajo Futuro
*   **Contenido Visual de la Diapositiva:**
    *   **Conclusiones:**
        *   Objetivos principales y específicos plenamente alcanzados.
        *   Logro de un simulador deportivo web robusto y de alto impacto estético.
        *   Consolidación práctica de metodologías ágiles, DevOps e ingeniería de software.
    *   **Trabajo Futuro:**
        *   Migración del almacén local JSON a un SGBD dedicado (PostgreSQL o MongoDB).
        *   Juego competitivo online a través de WebSockets (Socket.io).
        *   Renderizado en Canvas 2D/WebGL del campo de juego interactivo.
*   **Guion de Exposición (Tiempo sugerido: 1m):**
    > *"Como conclusión, considero que se han alcanzado con éxito la totalidad de los objetivos planteados. MangaKick demuestra la viabilidad técnica de desarrollar aplicaciones de juego web altamente eficientes, ligeras y con un diseño estético contemporáneo sobresaliente. Personalmente, este proyecto me ha permitido unificar conocimientos teóricos de la carrera en ingeniería del software, virtualización y tecnologías web de alto rendimiento.
    >
    > Como líneas de desarrollo futuro, el sistema está perfectamente preparado para escalar, contemplando la migración del almacenamiento JSON a bases de datos relacionales robustas, la integración de juego multijugador en tiempo real con WebSockets y el renderizado gráfico interactivo del partido mediante motores 2D ligeros. Muchas gracias por su atención. Quedo a su entera disposición para responder a cualquier pregunta o aclaración que deseen realizar."*

---

## 💡 Consejos de Oro para Triunfar en la Defensa

1.  **Mantén la calma y el ritmo:** Practica la presentación en casa con un cronómetro. Es preferible hablar pausado y claro que atropellarse para meter demasiada información. El tiempo límite de 15 minutos se respeta de forma muy estricta en los tribunales universitarios.
2.  **No leas las diapositivas:** Las diapositivas deben contener palabras clave y elementos visuales (diagramas, capturas de pantalla). El tribunal te mirará a ti; tu discurso debe complementar lo que se muestra en la pantalla, no repetirlo textualmente.
3.  **Destaca las decisiones de ingeniería:** Al tribunal no le interesa únicamente que el juego sea "divertido", sino **cómo lo has resuelto técnicamente**. Haz énfasis en las fórmulas matemáticas del simulador, en por qué decidiste usar Vanilla CSS en vez de Tailwind (rendimiento, optimización del bundle), y en el uso de Docker para garantizar la portabilidad.
4.  **Sé honesto ante las preguntas:** Si un miembro del tribunal te hace una pregunta difícil o sugiere una crítica sobre el sistema de persistencia o la simulación, no te pongas a la defensiva. Responde siempre con madurez profesional: *"Es una observación excelente. En esta fase de desarrollo priorizamos la portabilidad e inmediatez local, pero de cara a un entorno de producción masivo, su propuesta de usar X base de datos/tecnología es sin duda el camino de desarrollo idóneo que contemplamos en el trabajo futuro."*
