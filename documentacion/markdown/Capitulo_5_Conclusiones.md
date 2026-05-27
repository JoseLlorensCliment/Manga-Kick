# Capítulo 5: Conclusiones y Trabajo Futuro

El desarrollo integral de **MangaKick** ha representado un reto de ingeniería y diseño de software muy enriquecedor. Este capítulo sintetiza las conclusiones principales derivadas de la consecución de las metas establecidas al inicio del Trabajo Fin de Grado y proyecta las líneas de investigación, ampliación y trabajo futuro que permitirían dotar a la plataforma de mayores prestaciones y robustez tecnológica en el mercado real.

---

## 5.1.- CONCLUSIONES DEL PROYECTO

La finalización con éxito del desarrollo de la aplicación web y su correspondiente infraestructura de contenedores permite extraer las siguientes conclusiones clave estructuradas en base a los objetivos propuestos:

**1. Logro del Objetivo Principal:**
Se ha diseñado, implementado y desplegado de forma estable una plataforma web interactiva de simulación táctica híbrida. MangaKick cumple de forma fluida y coherente con las expectativas planteadas: permite gestionar una plantilla híbrida de deportistas de anime y de la élite real, someterlos a entrenamientos lógicos e interactivos que incrementan su nivel y sus atributos individuales, alinearlos dinámicamente en una pizarra táctica sobre el césped de juego y lanzar simulaciones matemáticas de partidos de fútbol contra equipos generados por inteligencia artificial.

**2. Cumplimiento de los Objetivos Secundarios de Ingeniería:**
*   **El Motor Probabilístico (Match Engine):** El algoritmo desarrollado en el backend cumple rigurosamente con los principios de probabilidad y confrontación estadística. Las pruebas automatizadas demuestran que las victorias, la posesión del balón y la cantidad de goles anotados reflejan de manera realista las diferencias estadísticas entre las plantillas confrontadas, integrando el uso de habilidades especiales mediante coeficientes justos y balanceados.
*   **Interfaz Dinámica Premium (UI/UX):** La maquetación en Vanilla CSS y HSL proporciona una estética visual contemporánea de alto impacto (*Premium Dark Mode* con resplandores por rareza de carta y glassmorphism) manteniendo un consumo de recursos en memoria extraordinariamente bajo. El sistema responde de manera perfectamente adaptativa (responsive) a diferentes tamaños de dispositivos móviles y de escritorio.
*   **API REST y Estructuración Limpia:** La separación cliente-servidor se ha materializado en un backend en Node.js y Express con rutas desacopladas y middleware de procesamiento robusto. El tipado estricto con TypeScript en el cliente ha actuado como una malla protectora que ha prevenido de raíz la aparición de excepciones en tiempo de ejecución.
*   **Infraestructura DevOps Aislada:** La virtualización ligera mediante Docker y Docker Compose ha demostrado ser una solución idónea para simplificar el despliegue del proyecto. Cualquier usuario, examinador o desarrollador externo puede levantar y validar el sistema completo en local con un único comando en consola, eliminando la necesidad de instalar dependencias de Node locales o servidores Nginx manualmente en su máquina anfitrión.

**3. Cumplimiento de los Objetivos Personales:**
Como alumno del Grado en Ingeniería Informática, la realización de MangaKick me ha permitido consolidar y unificar de forma práctica conocimientos transversales adquiridos a lo largo de la carrera en disciplinas clave:
*   *Ingeniería del Software:* Aplicación de ciclos de vida de software iterativos (Scrum), metodologías ágiles de planificación, captura sistemática de requisitos funcionales y no funcionales, y documentación formal.
*   *Tecnologías Web:* Dominio práctico del desarrollo frontend avanzado con React 19 y TypeScript, optimización de bundles con Vite, y diseño de hojas de estilo eficientes con Vanilla CSS.
*   *Sistemas Operativos e Infraestructura:* Aprendizaje práctico y consolidado del paradigma de la contenedorización y la orquestación ligera con Docker.

En resumen, MangaKick no solo se posiciona como una demostración de software interactivo divertida e innovadora para el sector del entretenimiento digital casual, sino que representa una sólida ratificación del valor de las prácticas modernas de ingeniería y desarrollo full-stack en la web contemporánea.

---

## 5.2.- POSIBLES DESARROLLOS FUTUROS

MangaKick se ha concebido bajo una arquitectura altamente modular y escalable, sentando una excelente base de software sobre la cual es posible implementar importantes ampliaciones y mejoras en el futuro. Se identifican las siguientes líneas de trabajo y desarrollos futuros prioritarios:

### 5.2.1.- Transición a un Sistema Gestor de Base de Datos Externa (SGBD)
La implementación actual mediante persistencia híbrida local (archivo JSON físico `users.json` en disco y caché RAM gestionada en `usersManager.js`) es ideal para garantizar la inmediatez, el rendimiento y una portabilidad absoluta sin dependencias externas complejas. No obstante, para convertir la aplicación en un producto comercial altamente escalable, el siguiente paso consistiría en transicionar la persistencia local a un SGBD dedicado:
*   **Bases de Datos Documentales (MongoDB):** Al almacenar la información de las cartas y alineaciones en documentos JSON flexibles, MongoDB se integra de forma transparente con el stack de Node.js, facilitando la escalabilidad horizontal.
*   **Bases de Datos Relacionales (PostgreSQL):** La adopción de PostgreSQL proporcionaría un modelo rígido altamente seguro mediante transacciones ACID, ideal para gestionar cuentas de usuario únicas, historiales de partidos, saldo de monedas virtuales y transacciones del mercado de fichajes con total consistencia a nivel empresarial.

### 5.2.2.- Multijugador Síncrono en Tiempo Real mediante WebSockets
La ampliación a partidas multijugador aportaría un inmenso valor de entretenimiento. En lugar de simular exclusivamente partidos contra una inteligencia artificial oponente que genera plantillas estáticas:
*   Se desarrollará una infraestructura de red bidireccional y síncrona utilizando **WebSockets** (mediante la librería **Socket.io** en Node).
*   Esto posibilitará que dos directores técnicos reales se conecten simultáneamente a una misma sesión de juego, interactúen intercambiando tácticas en directo y sometan sus plantillas personalizadas a confrontación directa en tiempo real bajo un servidor central que arbitre las probabilidades de gol de manera imparcial.

### 5.2.3.- Renderizado y Visualización Gráfica 2D del Partido
Para enriquecer significativamente la inmersión visual del usuario durante el transcurso del encuentro (que actualmente se rige por un log textual y un panel táctico):
*   Se prevé integrar un motor gráfico ligero basado en tecnologías web nativas como **HTML5 Canvas** o **WebGL** (mediante librerías optimizadas como **Pixi.js** o **Phaser**).
*   Esto permitiría representar gráficamente a los futbolistas como pequeños iconos o avatars bidimensionales (2D) moviéndose y disputándose el balón sobre el campo de juego, reproduciendo efectos especiales de partículas y resplandores dinámicos cuando un jugador active su habilidad especial ("Tiger Shot", "God Hand", etc.).

### 5.2.4.- Inteligencia Artificial Táctica Avanzada y Cambios en Directo
Para incrementar sustancialmente el desafío estratégico en el modo monojugador contra la IA:
*   Se diseñará un sistema de IA dinámico que analice la evolución del marcador del partido minuto a minuto.
*   Si la IA va perdiendo el encuentro en la segunda mitad, el sistema tomará decisiones tácticas complejas en tiempo real: reubicará sus jugadores en la pizarra hacia formaciones ofensivas agresivas, aumentará la probabilidad de tiro forzado de sus delanteros o realizará sustituciones estratégicas introduciendo centrocampistas frescos con mayor nivel y XP de su banquillo.

### 5.2.5.- Sistema de Temporadas, Ligas y Clasificación Global
Finalmente, para fomentar la fidelización y retención de los usuarios a largo plazo, se contempla la estructuración de un ecosistema competitivo estructurado:
*   Implementación de un sistema de **Ligas Tácticas Semanales** con emparejamientos dinámicos basados en niveles de plantilla equilibrados.
*   Construcción de una **Clasificación Global (*Leaderboard*)** que premie a los directores técnicos con mayor ratio de victorias acumulado, otorgándoles recompensas virtuales en forma de monedas o desbloqueo de personajes de rareza Legendaria exclusivos para sus alineaciones.
