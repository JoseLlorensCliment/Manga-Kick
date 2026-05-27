# Capítulo 3: Hipótesis de Trabajo y Stack Tecnológico

El desarrollo técnico de **MangaKick** se fundamenta en un conjunto estructurado de hipótesis de ingeniería y decisiones de diseño arquitectónico. En el ámbito del desarrollo de software contemporáneo, la elección de las tecnologías y los patrones arquitectónicos no solo determina la viabilidad del desarrollo inicial, sino que condiciona críticamente el rendimiento, la mantenibilidad, la escalabilidad y la portabilidad del producto final. En este capítulo se detallan y justifican las herramientas, lenguajes, frameworks y entornos que conforman el núcleo tecnológico del proyecto.

---

## 3.1.- ARQUITECTURA GENERAL DEL SISTEMA

Para dar soporte a las necesidades de MangaKick, se ha optado por un **patrón de arquitectura desacoplada Cliente-Servidor (Frontend-Backend)**, estructurada en tres capas funcionales diferenciadas e independientes:

1.  **Capa de Presentación (Cliente/Frontend):** Una aplicación de página única (SPA, Single Page Application) interactiva encargada exclusivamente del renderizado visual, la gestión de eventos de usuario, el control del estado de la interfaz gráfica y la interactividad fluida.
2.  **Capa de Negocio (Servidor/Backend):** Una API RESTful ligera que procesa las solicitudes lógicas del cliente, calcula los algoritmos matemáticos complejos de la simulación deportiva, gestiona las transacciones de compra/venta de jugadores en el draft y computa el progreso de experiencia del entrenamiento.
3.  **Capa de Datos y Persistencia:** Un motor de base de datos relacional y de objetos estructurado directamente en la memoria caché de la capa de negocio, diseñado para proporcionar tiempos de acceso ultra-bajos sin penalizaciones por latencia de red.

```mermaid
flowchart TD
    subgraph Capa_Cliente ["CAPA DE PRESENTACIÓN - CLIENTE"]
        A["React 19 SPA (Vite)<br>• TypeScript & Vanilla CSS<br>• LocalStorage Auto-Login<br>• Hook Reactivo Auto-Sync"]
    end

    subgraph Capa_Servidor ["CAPA DE NEGOCIO - SERVIDOR"]
        B["Servidor Express REST API (Node.js)<br>• routes/users.js (Auth & Sync)<br>• routes/training.js (User-Aware)<br>• routes/simulator.js (Math Match Engine)"]
    end

    subgraph Capa_Datos ["CAPA DE PERSISTENCIA - DATOS"]
        C[("Caché en Memoria RAM<br>(Acceso en Microsegundos)")]
        D[{"Archivo users.json (Local Host)<br>(Escritura Asíncrona a Disco)"}]
    end

    A <-->|"Peticiones HTTP (JSON)<br>Cabecera: x-username"| B
    B <-->|"Lectura/Escritura síncrona en RAM"| C
    B -->|"Persistencia física asíncrona"| D

    %% Estilos personalizados
    style A fill:#0d2f4f,stroke:#00d4ff,stroke-width:2px,color:#fff
    style B fill:#1c0f30,stroke:#b24dff,stroke-width:2px,color:#fff
    style C fill:#0f3a1a,stroke:#39ff14,stroke-width:2px,color:#fff
    style D fill:#2a1b00,stroke:#ffd700,stroke-width:2px,color:#fff
    classDef subgraphTitle fill:#181b28,stroke:#5e6578,stroke-width:1px,color:#eef0f6,font-weight:bold
    class Capa_Cliente,Capa_Servidor,Capa_Datos subgraphTitle
```

El desacoplamiento completo de la capa de presentación respecto a la lógica de negocio aporta múltiples ventajas académicas y profesionales:
*   **Independencia Tecnológica:** El cliente no conoce los detalles internos del servidor; únicamente consume un contrato de API documentado en formato JSON. En el futuro, el backend podría migrarse por completo a otro lenguaje (como Rust, Python o Go) sin alterar una sola línea de código del frontend.
*   **Optimización del Ancho de Banda:** Las comunicaciones entre cliente y servidor se limitan a cadenas ligeras de texto JSON con datos atómicos, evitando la recarga innecesaria de plantillas HTML completas del lado del servidor.
*   **Facilidad de Despliegue Isolado:** Cada capa puede escalarse de manera independiente en entornos de contenedores virtuales y balanceadores de carga en la nube.

---

## 3.2.- TECNOLOGÍAS DEL CLIENTE (FRONTEND)

El desarrollo del lado del cliente se ha estructurado con el objetivo de ofrecer una interfaz rica, interactiva y con un alto nivel de fluidez gráfica, minimizando el tamaño del paquete descargado por el usuario.

### 3.2.1.- React 19 y Vite

Para la construcción de la interfaz dinámica se ha seleccionado **React 19**, una de las librerías de JavaScript más avanzadas para la creación de interfaces de usuario basadas en componentes declarativos y reactivos.

*   **¿Por qué React?:** React implementa un paradigma de renderizado declarativo sustentado en un **DOM Virtual (Virtual DOM)**. En lugar de manipular directamente el árbol del DOM del navegador (una operación computacionalmente costosa y lenta), React realiza las modificaciones en memoria, calcula el diferencial de cambios mínimos indispensables (*reconciliation algorithm*) y los aplica de golpe en el DOM real. Esto permite que pantallas altamente dinámicas, como la pizarra táctica con arrastre de jugadores o el simulador de partidos con logs actualizándose cada pocos milisegundos, funcionen sin parpadeos ni ralentizaciones.
*   **Novedades de React 19:** La inclusión de React 19 en el proyecto permite beneficiarse de mejoras significativas en la gestión síncrona y asíncrona de transacciones de UI, soporte nativo optimizado para transiciones, y una inyección más eficiente de metadatos SEO en la cabecera de la página.
*   **¿Por qué Vite?:** Tradicionalmente, los proyectos de React se inicializaban con *Create React App* (CRA), un entorno pesado basado en Webpack que compila y empaqueta todo el código en tiempo de desarrollo de manera extremadamente lenta. Para MangaKick se ha seleccionado **Vite** como entorno de construcción (*build tool*). Vite revoluciona el flujo de trabajo utilizando módulos ES nativos (ESM) del navegador en desarrollo, soportando recarga rápida en caliente (HMR, Hot Module Replacement) instantánea mediante el motor escrito en Go **esbuild**. Para producción, Vite utiliza **Rollup**, optimizando la compilación mediante técnicas avanzadas de eliminación de código muerto (*tree-shaking*) y división de código (*code-splitting*).

### 3.2.2.- TypeScript

El frontend de MangaKick se ha desarrollado íntegramente utilizando **TypeScript**, un superconjunto de JavaScript de código abierto desarrollado por Microsoft que añade tipado estático opcional y programación orientada a objetos.

*   **Prevención de Errores en Tiempo de Compilación:** En JavaScript convencional, un error de tipado (como pasar un objeto en lugar de un array, o acceder a una propiedad inexistente de un jugador) solo se manifiesta cuando el usuario está interactuando con la aplicación. Con TypeScript, la definición de contratos mediante **Interfaces** (como `Player`, `MatchStats`, `Drill` o `Squad`) asegura que cualquier incoherencia lógica sea detectada y bloqueada por el compilador inmediatamente durante la escritura del código.
*   **Documentación Autogenerada y Productividad:** El tipado estricto actúa como documentación viva en el editor de código. Gracias a la autocompletación inteligente (*IntelliSense*), es posible conocer instantáneamente qué atributos posee una carta de jugador (por ejemplo, `player.stats.pace`, `player.rarity`) sin necesidad de recurrir a archivos externos o inspeccionar respuestas de red.

### 3.2.3.- HSL CSS y Microanimaciones Dinámicas con Vanilla CSS

En lugar de utilizar frameworks de utilidades de diseño populares como Tailwind CSS (que saturan las etiquetas HTML con cientos de clases de utilidad dificultando la lectura y aumentan el tamaño del bundle inicial), se ha apostado por **Vanilla CSS puro** bajo estándares modernos.

*   **Modelo de Color HSL (Hue, Saturation, Lightness):** MangaKick implementa un sistema de diseño cromático dinámico basado en variables CSS estructuradas mediante la escala HSL. HSL representa los colores mediante su matriz de tono (0-360 grados), saturación (0-100%) y luminosidad (0-100%). Esto facilita enormemente la creación de gradientes armónicos y el control de la rareza de las cartas:
    *   *Común (Gris):* `hsl(210, 10%, 60%)`
    *   *Raro (Azul):* `hsl(210, 80%, 50%)`
    *   *Épico (Púrpura):* `hsl(280, 85%, 60%)`
    *   *Legendario (Dorado):* `hsl(45, 95%, 55%)`
*   **Optimización del Rendimiento Visual:** El diseño utiliza técnicas avanzadas de maquetación mediante **CSS Flexbox** y **CSS Grid** para asegurar una respuesta fluida a pantallas de cualquier proporción (*responsive design*).
*   **Microanimaciones Inmersivas:** Para lograr que la interfaz se sienta "viva", se han diseñado microanimaciones dinámicas que aprovechan la aceleración de hardware de la GPU del ordenador:
    *   Efectos de resplandor (*glowing*) intermitente en las cartas legendarias mediante animaciones de fotogramas clave (*keyframes*).
    *   Efectos de desenfoque de fondo (*glassmorphic backdrop filters*) en diálogos modales.
    *   Transiciones suaves de escala y rotación 3D en elementos interactivos cuando el cursor se posiciona sobre ellos (*hover effects*).

---

## 3.3.- TECNOLOGÍAS DEL SERVIDOR (BACKEND)

El backend de la aplicación se encarga de servir las peticiones de datos de forma estable, segura y veloz, asumiendo la responsabilidad del procesamiento de las reglas físicas y lógicas del simulador táctico.

### 3.3.1.- Node.js y Express

Para la capa del servidor se ha optado por **Node.js** complementado con el framework minimalista **Express**.

*   **¿Por qué Node.js?:** Node.js es un entorno de ejecución de JavaScript de código abierto y multiplataforma, basado en el motor de JavaScript V8 de Google Chrome. Su principal característica de ingeniería es su **bucle de eventos de hilo único (Single-Threaded Event Loop)** con un modelo de entrada/salida no bloqueante y asíncrono. Mientras que los servidores tradicionales basados en lenguajes como Java o PHP abren un nuevo hilo de ejecución en el sistema operativo por cada petición recibida (consumiendo mucha memoria y saturando la CPU bajo carga intensa), Node.js atiende miles de peticiones concurrentes sobre un único hilo principal mediante callbacks y promesas asíncronas. Esto lo convierte en el entorno ideal para aplicaciones web de respuesta inmediata y tiempo real.
*   **Express Middleware Pipeline:** **Express** dota al servidor de una capa delgada de utilidades para estructurar la API mediante rutas modulares y procesar flujos de datos a través de una tubería de intermediarios (*middlewares*). Se han configurado middlewares clave para:
    *   **CORS (Cross-Origin Resource Sharing):** Permitir la comunicación segura entre el dominio del frontend (`localhost:5173`) y el del backend (`localhost:5000`).
    *   **Express.json():** Parsear y procesar payloads entrantes en formato JSON de manera nativa.

### 3.3.2.- Base de Datos Híbrida (Caché en Memoria con Persistencia Local JSON)

Para garantizar la máxima velocidad posible de la aplicación, simplificar el despliegue del proyecto académico en entornos locales sin requerir instalaciones pesadas de sistemas gestores de bases de datos tradicionales, MangaKick implementa un **motor de persistencia híbrido (In-Memory Cache with Local JSON Persistence)** desarrollado mediante un gestor centralizado (`usersManager.js`).

*   **El Enfoque Híbrido:** El módulo de persistencia almacena en memoria los datos originales y mutables de los jugadores de anime y reales, los entrenamientos aplicables y el estado de la sesión de juego. Para posibilitar la persistencia multiusuario sin incurrir en dependencias pesadas, se ha introducido un modelo que almacena las cuentas de usuario en un archivo estructurado local (`backend/data/users.json`).
*   **Funcionamiento Técnico:**
    1.  *Lectura Inicial:* Al arrancar el servidor backend, el administrador de usuarios (`usersManager.js`) carga en memoria RAM la totalidad de los perfiles y estados de juego guardados en el archivo `users.json`.
    2.  *Operaciones a Velocidad RAM:* Todas las operaciones y transacciones (iniciar sesión, registrarse, comprar cartas en el draft o aplicar entrenamientos específicos) se ejecutan de manera síncrona en memoria a la velocidad de la RAM (microsegundos), eliminando latencias asociadas a motores externos.
    3.  *Escritura en Disco:* Cada vez que se modifica un estado crítico del usuario (se completa una sesión de entrenamiento, se adquiere un jugador o se reestructura el once táctico), el backend escribe de forma asíncrona los cambios actualizados de vuelta al archivo físico `users.json`.
*   **API RESTful:** La comunicación se rige estrictamente por los principios de la arquitectura REST (Representational State Transfer), utilizando verbos estándar de protocolo HTTP:
    *   `GET /api/players`: Recupera el catálogo completo de futbolistas disponibles.
    *   `POST /api/users/register`: Registra un nuevo mánager en el sistema.
    *   `POST /api/users/login`: Autentica credenciales y devuelve el estado persistido (monedas, plantilla, alineación y formación).
    *   `POST /api/users/sync`: Sincroniza en caliente el saldo y plantilla activa desde el cliente hacia la base de datos del servidor.
    *   `POST /api/training/train`: Ejecuta una sesión de entrenamiento incrementando la XP y estadísticas de un jugador (asociado a la cuenta mediante la cabecera `x-username`).

A continuación, se resume una comparativa de la hipótesis de persistencia híbrida en memoria respecto a otros paradigmas evaluados durante el diseño del sistema:

| Criterio de Selección | Bases de Datos SQL (PostgreSQL) | Bases de Datos NoSQL (MongoDB) | **Persistencia Híbrida Local (MangaKick)** |
| :--- | :--- | :--- | :--- |
| **Velocidad de Lectura** | Media (Milisegundos de red + disco) | Alta (Milisegundos de red + caché) | **Instantánea (Microsegundos de RAM)** |
| **Facilidad de Configuración**| Baja (Requiere servidor y esquemas) | Media (Requiere cluster o servicio) | **Máxima (Sin configuración externa)** |
| **Consumo de Almacenamiento**| Alto | Medio-Alto | **Extremadamente Bajo (JSON optimizado)** |
| **Complejidad de Despliegue** | Alta (Requiere volumen Docker y red)| Alta (Requiere variables de conexión) | **Nula (Integrado en el propio proceso)** |
| **Persistencia a Largo Plazo**| Máxima (Persistencia física robusta) | Máxima (Persistencia física documental)| **Alta (Persiste tras apagados y reinicios)** |

*Valoración técnica:* Dado que el entorno didáctico y casual de MangaKick prioriza la inmediatez, la agilidad de juego de una sola sesión y la extrema sencillez en el despliegue por parte de un examinador o usuario externo, pero requería de una **persistencia de cuentas real** para guardar plantillas y saldo, la balanza de ingeniería se decantó de forma definitiva por la **Persistencia Híbrida Local JSON**, la cual unifica las ventajas de velocidad de la memoria RAM con la permanencia física de un archivo de datos local.

---

## 3.4.- ENTORNO DE DESPLIEGUE Y CONTENEDORES (DOCKER)

Para asegurar que MangaKick pueda ejecutarse e instalarse de forma instantánea en cualquier ordenador, eliminando el clásico problema de ingeniería de *"en mi máquina funciona pero en la tuya no"*, se ha integrado una infraestructura basada en contenedores de software.

### 3.4.1.- Docker y Virtualización Ligera

MangaKick utiliza **Docker** para empaquetar tanto la aplicación frontend como el servidor backend dentro de contenedores independientes y ligeros.

*   **Virtualización a nivel de SO:** A diferencia de las máquinas virtuales tradicionales que replican un sistema operativo completo (con su kernel y sus drivers, consumiendo gigabytes de memoria RAM innecesaria), Docker comparte el kernel del sistema operativo del anfitrión y aísla únicamente los binarios y dependencias requeridas por el software.
*   **Dockerfiles Personalizados:**
    *   *Backend Dockerfile:* Utiliza una imagen base alpina de Node.js (`node:20-alpine`), copia el código fuente, instala las dependencias de producción y expone el puerto `5000`.
    *   *Frontend Dockerfile:* Levanta un entorno de Node.js para compilar la versión de producción optimizada mediante Vite. El bundle estático generado se inyecta en una imagen de servidor web ultra-eficiente como **Nginx**, configurado para servir la aplicación SPA y exponer el puerto `80` (mapeado externamente al puerto `5173`).

### 3.4.2.- Orquestación con Docker Compose

Para simplificar al máximo la inicialización y administración de los dos contenedores que componen el sistema, se ha desarrollado un manifiesto de orquestación a través de **Docker Compose** (`docker-compose.yml`).

Docker Compose define en un único archivo declarativo YAML la configuración de ambos servicios (backend y frontend), gestionando automáticamente:
*   La compilación de las imágenes locales a partir de los respectivos Dockerfiles.
*   La configuración del mapeo de puertos de red (`5000:5000` para backend y `5173:80` para frontend).
*   La declaración de dependencias operativas, asegurando que el backend inicialice por completo antes de que el frontend comience a recibir solicitudes (`depends_on`).
*   La creación de una red virtual privada interna para posibilitar la interconexión transparente entre ambos servicios de manera aislada del tráfico de la red pública.
