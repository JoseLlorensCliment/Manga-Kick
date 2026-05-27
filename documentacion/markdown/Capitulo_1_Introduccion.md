# Capítulo 1: Introducción y Objetivos

## 1.1.- ENTORNO DE APLICACIÓN Y CONTEXTO DEL SECTOR

El sector del entretenimiento interactivo y los videojuegos ha experimentado un crecimiento exponencial en la última década, consolidándose como la industria cultural más lucrativa a nivel global. Dentro de este vasto ecosistema, los simuladores de gestión deportiva (particularmente los mánagers de fútbol como *Football Manager*) y los videojuegos basados en franquicias de animación japonesa (*anime*) representan dos nichos de mercado extraordinariamente rentables, pero tradicionalmente disjuntos.

Por un lado, los simuladores tácticos de fútbol comercializados actualmente se caracterizan por una altísima complejidad matemática, menús repletos de texto y un enfoque hiperrealista que a menudo resulta árido o intimidante para el usuario casual. Por otro lado, los videojuegos basados en licencias de anime deportivo como *Captain Tsubasa* (Oliver y Benji), *Inazuma Eleven* o el reciente fenómeno de masas *Blue Lock* apuestan casi exclusivamente por dinámicas de acción puramente *arcade*, velocidad frenética y mecánicas de juego en tiempo real que dejan de lado el factor de planificación estratégica y análisis estadístico minucioso.

El entorno de aplicación de este proyecto, bautizado como **MangaKick**, se sitúa precisamente en la intersección de estas dos vertientes. MangaKick se concibe como un **Simulador Táctico Web Híbrido** que extrae el rigor estratégico de los simuladores clásicos y lo fusiona con la narrativa épica y visualmente espectacular del anime deportivo. El proyecto no se concibe para una empresa externa específica, sino como un producto de software libre de distribución digital dirigido al sector de entretenimiento de consumo masivo, con un fuerte enfoque educativo dentro del Grado en Ingeniería Informática de la Universidad Miguel Hernández.

Para hacer viable este desarrollo, se ha dispuesto de un entorno técnico y tecnológico moderno, compuesto por:
1.  **Estaciones de Trabajo Locales:** Equipos equipados con sistemas operativos modernos (Windows/Linux) optimizados para el desarrollo ágil de software.
2.  **Entorno de Desarrollo Integrado (IDE):** Visual Studio Code como herramienta central, potenciada con extensiones de linting, tipado y formateo automático de código.
3.  **Motor de Ejecución de Javascript:** Node.js como núcleo para la gestión de dependencias locales y la ejecución del servidor de la API en el backend.
4.  **Plataforma de Contenedores:** Docker y Docker Desktop, permitiendo la virtualización ligera y aislada del servidor Express y del cliente Vite/React, garantizando que el software funcione de manera idéntica en cualquier máquina sin necesidad de configurar manualmente dependencias del sistema operativo anfitrión.

---

## 1.2.- JUSTIFICACIÓN DEL PROYECTO

La decisión de diseñar e implementar MangaKick responde a una serie de necesidades técnicas, motivaciones conceptuales y justificaciones académicas que dotan de pleno sentido al desarrollo de este Trabajo Fin de Grado. 

Desde una perspectiva técnica, el desarrollo de aplicaciones web de alto rendimiento se enfrenta hoy al reto de la saturación de librerías y frameworks pesados que ralentizan la carga y penalizan la experiencia del usuario. Tradicionalmente, los juegos y simuladores interactivos se han desarrollado utilizando motores pesados como Unity o Unreal Engine compilados para la web mediante WebAssembly, lo que se traduce en tiempos de descarga de cientos de megabytes y un consumo excesivo de memoria en los navegadores de los usuarios. **MangaKick se justifica técnicamente como una alternativa ultraligera**: una SPA (Single Page Application) desarrollada con tecnologías web estándar puras (**React 19, TypeScript y Vanilla CSS**) capaz de cargar de forma instantánea en menos de un segundo y de ejecutar simulaciones complejas de partidos con un consumo mínimo de recursos de CPU.

Desde un punto de vista conceptual, existe un vacío claro en el mercado de simuladores. Los fans del fútbol táctico no disponen de una plataforma donde poner a prueba teorías como: *"¿Qué ocurriría si alineo a Yoichi Isagi (de Blue Lock) con Lionel Messi en un sistema de doble delantero, apoyados por el pase perfecto de Tetsuya Kuroko en el centro del campo?"*. MangaKick proporciona este espacio de experimentación mediante una simulación que analiza matemáticamente el rendimiento de deportistas reales y de ficción bajo un mismo conjunto de reglas físicas y estadísticas homogeneizadas.

### 1.2.1.- Justificación Académica e Ingeniería del Software
A nivel académico, este proyecto justifica la aplicación práctica de metodologías avanzadas de Ingeniería del Software adquiridas durante la carrera. La estructuración de una arquitectura desacoplada cliente-servidor (Frontend-Backend), la implementación de patrones de diseño de software (como el patrón creador, experto en información y alta cohesión/bajo acoplamiento), y la aplicación de tipado estricto con TypeScript justifican la calidad del código. Asimismo, el uso de Docker y la orquestación mediante Docker Compose reflejan las prácticas modernas de DevOps indispensables en la industria actual del desarrollo de software.

### 1.2.2.- Justificación de Viabilidad Comercial y Producto Explotable
Aunque este Trabajo Fin de Grado tiene una finalidad primordialmente educativa y no comercial debido a los derechos de propiedad intelectual de los personajes incluidos, la arquitectura interna de MangaKick se ha diseñado de forma que sea **100% modular y escalable**. Esto significa que las interfaces y el motor de simulación están completamente desacoplados de los datos de los jugadores. En un escenario de explotación comercial, bastaría con sustituir las imágenes y nombres bajo propiedad intelectual por assets licenciados o de creación propia para convertir MangaKick en un juego listo para su monetización a través de publicidad integrada, microtransacciones (adquisición de sobres de jugadores o drills de entrenamiento) o un modelo de suscripción premium.

### 1.2.3.- Justificación del Enfoque Visual y la Experiencia del Usuario (UI/UX)
El desarrollo web moderno exige que los interfaces de usuario dejen de ser meros formularios estáticos y pasen a ser entornos visuales inmersivos. MangaKick justifica la investigación y el uso de **Vanilla CSS avanzado y HSL** (Hue, Saturation, Lightness) para crear una estética premium sin la sobrecarga de dependencias como Tailwind CSS. Al diseñar efectos de glassmorphism, gradientes lineales dinámicos y microanimaciones de cartas de jugadores en CSS puro, se demuestra que se pueden alcanzar cotas de excelencia visual sobresalientes manteniendo el rendimiento y la mantenibilidad a largo plazo.

---

## 1.3.- OBJETIVOS DEL PROYECTO

Para guiar el desarrollo de MangaKick y permitir una evaluación objetiva de sus resultados al finalizar el proyecto, se han establecido metas divididas en tres categorías diferenciadas: objetivos principales, objetivos secundarios y objetivos personales del autor.

### 1.3.1.- Objetivo Principal
El objetivo principal del proyecto consiste en **diseñar, implementar y desplegar una plataforma web interactiva y modular para la simulación táctica de fútbol**, que permita la creación de equipos híbridos (personajes de anime y futbolistas reales), su entrenamiento funcional, la configuración táctica detallada de alineaciones y la simulación matemática probabilística de partidos en tiempo real, garantizando un despliegue simplificado mediante contenedores virtuales.

### 1.3.2.- Objetivos Secundarios
Para dar cumplimiento al objetivo principal, se desglosan los siguientes objetivos específicos o secundarios de ingeniería:
1.  **Desarrollo del Motor de Simulación Probabilístico (Match Engine):** Programar un algoritmo en el backend que calcule las dinámicas de un partido minuto a minuto, analizando las estadísticas confrontadas de ataque y defensa de los jugadores en el campo, resolviendo el uso de habilidades especiales mediante coeficientes probabilísticos y generando una crónica textual dinámica de los sucesos clave (goles, faltas, intervenciones del portero).
2.  **Construcción de una Interfaz Dinámica Premium (Frontend):** Diseñar una interfaz interactiva tipo Single Page Application (SPA) que contemple pantallas de Gestión de Plantilla, Pizarra Táctica (arrastrar y posicionar jugadores), Mercado de Fichajes (*Draft Market*) con filtros por tipo de jugador, y un Centro de Entrenamiento funcional.
3.  **Estructuración de una API REST Coherente (Backend):** Crear un servicio backend desacoplado que exponga endpoints estructurados para el consumo de datos de jugadores, ejecución de simulaciones, y entrenamiento con persistencia temporal durante la sesión del usuario.
4.  **Implementación de Contenedores de Infraestructura (DevOps):** Crear archivos Dockerfile optimizados para las tecnologías utilizadas y configurar un manifiesto de Docker Compose que levante tanto el cliente de React en Vite como el servidor Express mediante un único comando en consola (`docker-compose up --build`).
5.  **Aseguramiento de la Calidad y Robustez del Código:** Aplicar tipado estricto en el frontend mediante TypeScript para evitar errores en tiempo de ejecución y estructurar el backend siguiendo buenas prácticas de modularidad de rutas y controladores de Express.

### 1.3.3.- Objetivos Personales
Adicionalmente, como autor del Trabajo Fin de Grado, persigo los siguientes hitos de crecimiento profesional y académico:
1.  **Dominio Completo del Ecosistema de React 19 y Vite:** Comprender e implementar las últimas directrices de optimización en la renderización de componentes funcionales y la gestión avanzada del estado local sin recurrir a complejas librerías externas de terceros.
2.  **Profundización en Diseño Web con CSS Puro:** Demostrar habilidad en el diseño de interfaces modernas aplicando técnicas de flexbox, grid, animaciones de transición fluidas, efectos de desenfoque y diseño adaptativo a pantallas de móviles, tabletas y ordenadores sin el soporte de utilidades prefabricadas.
3.  **Adopción de Prácticas Profesionales de Despliegue (Docker):** Familiarizarme de manera práctica con la tecnología de contenedores y los flujos de trabajo de integración y despliegue continuos (CI/CD), una competencia altamente demandada en el mercado laboral actual.
4.  **Desarrollo de un Algoritmo Matemático Complejo:** Enfrentarme al desafío de programar un motor de simulación equilibrado y justo, ajustando coeficientes matemáticos para que los partidos reflejen con coherencia la superioridad o debilidad estadística de los equipos confrontados.

---

## 1.4.- LÍMITES DEL PROYECTO

Con el fin de delimitar el alcance del proyecto y evitar una desviación de recursos que comprometa la entrega del Trabajo Fin de Grado, se definen explícitamente los límites de MangaKick en esta fase de desarrollo:

1.  **Inexistencia de Multijugador en Tiempo Real Online:** El sistema está diseñado para un único usuario local en cada sesión. Las partidas y torneos se juegan contra la inteligencia artificial (IA) del sistema (que genera alineaciones enemigas coherentes de forma automática). La implementación de juego online síncrono mediante tecnologías como WebSockets queda fuera del alcance de este TFG.
2.  **Persistencia Híbrida Local (Sin Motor Externo):** Para maximizar la velocidad de respuesta, simplificar el despliegue del entorno y evitar la sobrecarga que supone configurar y administrar un motor de base de datos externo pesado (como PostgreSQL o MongoDB) en máquinas cliente, la aplicación utiliza un sistema de persistencia híbrido. El backend opera sobre la memoria RAM (caché) para garantizar tiempos de respuesta en microsegundos y sincroniza de forma asíncrona los perfiles y el progreso de los mánagers en un archivo local indexado en disco (`backend/data/users.json`). La adopción de un sistema gestor de bases de datos relacional o documental dedicado en la nube queda fuera del alcance de este proyecto y se pospone para futuras iteraciones.
3.  **Restricción de Licencias y Assets:** MangaKick es un proyecto con fines puramente académicos y demostrativos. Las imágenes, logos y nombres de los personajes de anime y futbolistas profesionales se utilizan bajo la doctrina del *"Fair Use"* (Uso Legítimo) para fines educativos. Por lo tanto, el software no incluye ningún sistema de monetización real ni pasarelas de pago, y no está destinado a su publicación en tiendas oficiales de aplicaciones ni a su explotación comercial bajo esta marca.
4.  **Ausencia de Simulación Gráfica 2D/3D Compleja del Partido:** Durante el transcurso de los partidos, la visualización se realiza a través de un panel táctico interactivo que representa la distribución del campo y un log o crónica textual detallada generada dinámicamente que describe las jugadas minuto a minuto. No se incluye en este proyecto la renderización gráfica animada en dos o tres dimensiones (2D/3D) de los futbolistas corriendo por el campo de juego.
