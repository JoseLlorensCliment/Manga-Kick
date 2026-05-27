# RESUMEN

El presente Trabajo Fin de Grado describe el diseño, desarrollo e implementación de **MangaKick**, una innovadora aplicación web híbrida que fusiona la gestión táctica de fútbol con el universo del anime y los futbolistas de la élite real. El sistema permite a los usuarios actuar como directores técnicos de un equipo personalizado, permitiéndoles fichar deportistas emblemáticos reales (como Lionel Messi, Cristiano Ronaldo o Erling Haaland) y personajes icónicos de populares series animadas de temática futbolística e hiperfantástica (como *Blue Lock*, *Captain Tsubasa*, *Inazuma Eleven*, *Dragon Ball* y *Naruto*).

A nivel tecnológico, el proyecto se ha estructurado bajo una arquitectura de tres capas utilizando el stack moderno de JavaScript/TypeScript. En el frontend, se ha desarrollado una interfaz de usuario inmersiva, interactiva y de alta calidad visual utilizando **React 19**, **Vite** y **TypeScript**, estandarizando estilos premium con **Vanilla CSS** responsivo para garantizar una experiencia óptima en cualquier dispositivo. En el backend, se ha construido un servidor robusto en **Node.js** con el framework **Express**, que implementa una API REST para gestionar operaciones esenciales como la simulación matemática y probabilística de encuentros de fútbol (teniendo en cuenta estadísticas y habilidades especiales de cada jugador), el mercado de fichajes (*Draft Market*) y el centro de entrenamiento (*Training Center*).

La solución de infraestructura se ha completado mediante la contenedorización de ambos servicios a través de **Docker** y **Docker Compose**, simplificando drásticamente el despliegue del entorno y garantizando su portabilidad absoluta. Los resultados demuestran la viabilidad técnica de combinar algoritmos de simulación deportiva con interfaces dinámicas enriquecidas, logrando un producto funcional de alto impacto visual y rendimiento óptimo que sirve como excelente demostración práctica de ingeniería de software.

**Palabras clave:** Simulador Táctico, Fútbol, Anime, React 19, Node.js, TypeScript, API REST, Docker, Simulación Probabilística.

---

# ABSTRACT

This Bachelor's Thesis presents the design, development, and implementation of **MangaKick**, an innovative hybrid web application that merges tactical football management with the anime universe and real-world elite footballers. The system allows users to act as technical directors of a custom team, enabling them to sign legendary real-world athletes (such as Lionel Messi, Cristiano Ronaldo, or Erling Haaland) alongside iconic characters from popular sports and fantasy anime series (such as *Blue Lock*, *Captain Tsubasa*, *Inazuma Eleven*, *Dragon Ball*, and *Naruto*).

From a technological standpoint, the project is structured under a three-tier architecture utilizing the modern JavaScript/TypeScript stack. The frontend features an immersive, interactive, and visually premium user interface built with **React 19**, **Vite**, and **TypeScript**, relying on responsive **Vanilla CSS** to guarantee an optimal user experience across all devices. On the backend, a robust server has been developed using **Node.js** and the **Express** framework, implementing a REST API to manage core operations. These operations include a mathematical and probabilistic match simulation engine—factoring in players' individual stats and signature special abilities—a transfer market (*Draft Market*), and a player progression center (*Training Center*).

The infrastructure solution is completed through containerization using **Docker** and **Docker Compose**, drastically simplifying environment deployment and guaranteeing absolute portability. The results demonstrate the technical viability of combining sports simulation algorithms with rich dynamic interfaces, delivering a highly visual and high-performance functional product that serves as an excellent practical demonstration of software engineering principles.

**Keywords:** Tactical Simulator, Football, Anime, React 19, Node.js, TypeScript, REST API, Docker, Probabilistic Simulation.

---

# AGRADECIMIENTOS

Quiero expresar mi sincero agradecimiento a todas las personas que han hecho posible la realización de este Trabajo Fin de Grado.

En primer lugar, a la **Universidad Miguel Hernández de Elche** y, de forma particular, a la **Escuela Politécnica Superior de Elche**, por proporcionarme las herramientas, la formación y el entorno académico necesarios durante estos años de grado. Las asignaturas de Ingeniería del Software, Tecnologías Web y Arquitectura de Sistemas han sido pilares fundamentales para el planteamiento técnico de este proyecto.

A mis compañeros de carrera, con quienes he compartido largas horas de estudio, proyectos grupales y debates apasionantes que han enriquecido enormemente mi aprendizaje.

Y, por último, pero más importante, a mi familia y seres queridos, cuyo apoyo incondicional, paciencia y aliento constante han sido mi mayor motivación para culminar con éxito esta etapa de mi vida académica. A todos ellos les dedico este trabajo.

---

# ÍNDICE GENERAL

*   **Capítulo 1: Introducción**
    *   1.1. Entorno de Aplicación y Sector
    *   1.2. Justificación del Proyecto
    *   1.3. Objetivos
        *   1.3.1. Objetivo Principal
        *   1.3.2. Objetivos Secundarios
        *   1.3.3. Objetivos Personales
    *   1.4. Límites del Proyecto
*   **Capítulo 2: Antecedentes y Estado de la Cuestión**
    *   2.1. Situación Actual y Problemática
    *   2.2. Herramientas Disponibles en el Mercado
        *   2.2.1. Football Manager
        *   2.2.2. Captain Tsubasa: Rise of New Champions
        *   2.2.3. Inazuma Eleven: Victory Road
    *   2.3. Cuadro Comparativo y Valoración
*   **Capítulo 3: Hipótesis de Trabajo y Tecnologías**
    *   3.1. Arquitectura del Sistema
    *   3.2. Tecnologías del Cliente (Frontend)
        *   3.2.1. React 19 y Vite
        *   3.2.2. TypeScript
        *   3.2.3. HSL CSS y Microanimaciones Dinámicas
    *   3.3. Tecnologías del Servidor (Backend)
        *   3.3.1. Node.js y Express
        *   3.3.2. Base de Datos en Memoria y API REST
    *   3.4. Entorno de Despliegue y Contenedores (Docker)
*   **Capítulo 4: Metodología y Resultados**
    *   4.1. Ciclo de Vida y Planificación (Metodología Ágil)
        *   4.1.1. Fases del Proyecto
        *   4.1.2. Diagrama de Gantt
    *   4.2. Captura y Especificación de Requisitos
        *   4.2.1. Roles de Usuario
        *   4.2.2. Casos de Uso del Sistema
        *   4.2.3. Requisitos No Funcionales
    *   4.3. Diseño del Sistema
        *   4.3.1. Diagrama de Arquitectura
        *   4.3.2. Modelo de Datos de Jugadores
        *   4.3.3. Diseño de la Interfaz Gráfica (UI/UX)
    *   4.4. Implementación y Detalles del Código
        *   4.4.1. Lógica del Simulador Probabilístico de Partidos
        *   4.4.2. Sistema de Entrenamiento y Progresión
        *   4.4.3. Integración de Imágenes y Carga Dinámica
    *   4.5. Pruebas y Despliegue Dockerizado
*   **Capítulo 5: Conclusiones y Trabajo Futuro**
    *   5.1. Conclusiones
    *   5.2. Posibles Desarrollos Futuros
*   **Capítulo 6: Bibliografía**

---

# ÍNDICE DE TABLAS

*   **Tabla 2.1:** Comparativa Detallada de Características entre MangaKick y Competidores Comerciales.
*   **Tabla 3.1:** Comparativa de Rendimiento y Portabilidad de Motores de Persistencia.
*   **Tabla 4.1:** Tabla de Planificación y Tiempos de Sprints del Desarrollo del Software.
*   **Tabla 4.2:** Tabla de Especificación del Caso de Uso "Simular Partido".
*   **Tabla 4.3:** Estructura de Atributos de los Jugadores en la Base de Datos.

---

# ÍNDICE DE FIGURAS

*   **Figura 3.1:** Diagrama de Arquitectura de Tres Capas (Frontend, Backend, Docker).
*   **Figura 4.1:** Cronograma y Diagrama de Gantt del Proyecto.
*   **Figura 4.2:** Diagrama de Casos de Uso UML del Sistema MangaKick.
*   **Figura 4.3:** Diagrama de Secuencia de la Simulación de un Partido.
*   **Figura 4.4:** Boceto de la Interfaz Principal y Pizarra Táctica (Wireframe).
*   **Figura 4.5:** Captura de Pantalla Real de la Alineación y Pizarra Táctica del Terreno de Juego.
*   **Figura 4.6:** Captura de Pantalla del Mercado de Fichajes (*Draft Market*).
*   **Figura 4.7:** Captura de Pantalla del Centro de Entrenamiento (*Training Center*).
*   **Figura 4.8:** Captura de Pantalla del Simulador de Partido en Tiempo Real.
