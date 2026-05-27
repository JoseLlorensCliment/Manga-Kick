# ⚽ MangaKick — Simulador Táctico de Fútbol Híbrido (Anime & Real)

¡Bienvenido a **MangaKick**! Una innovadora plataforma web híbrida diseñada para fusionar el rigor y la estrategia de los simuladores de gestión deportiva clásicos con la narrativa épica, el dinamismo visual y las habilidades fantásticas del universo del anime japonés.

Este proyecto ha sido desarrollado por **José Luis Llorens Climent** en el marco de su **Trabajo Fin de Grado (TFG)** para la **Universidad Miguel Hernández de Elche (UMH)**, presentado en **Mayo de 2026**.

---

## 🌟 Características Principales

*   **Plantilla Híbrida Única:** Ficha y alinea a las superestrellas de la élite real (como Lionel Messi, Cristiano Ronaldo, Erling Haaland) en simbiosis con personajes legendarios de tus series de animación preferidas (*Blue Lock*, *Inazuma Eleven*, *Captain Tsubasa*, *Dragon Ball*, *Naruto*).
*   **Motor de Simulación Probabilístico (Match Engine):** Algoritmo avanzado en el servidor que computa confrontaciones tácticas minuto a minuto basándose en las estadísticas de velocidad, pase, regate, defensa y físico de los futbolistas.
*   **Habilidades Especiales Epic/Legendary:** Desata jugadas emblemáticas icónicas del anime (como el *"Drive Shot"* de Tsubasa Ozora o el *"Tiger Shot"* de Kojiro Hyuga) que inyectan boosts temporales de estadísticas y dificultan las paradas del portero rival.
*   **Pizarra Táctica Interactiva:** Configura tu alineación de 5 jugadores arrastrando las cartas al terreno de juego sobre las posiciones clásicas (GK, DEF, MID, FWD).
*   **Mercado de Fichajes (Draft Market):** Renueva cartas aleatorias y amplía tu plantel de estrellas utilizando tu saldo virtual de monedas.
*   **Centro de Entrenamiento y Progresión (XP):** Somete a tus jugadores a ejercicios específicos (drills) para subir permanentemente sus estadísticas básicas y su nivel de jugador.
*   **Cuentas de Mánager y Sincronización Automática:** Regístrate de forma segura para guardar tus monedas, tu plantel personalizado y tu pizarra táctica. Los datos se sincronizan automáticamente con el servidor en caliente gracias a un sistema reactivo y auto-login silencioso con `localStorage`.
*   **Modo Invitado (Guest Mode):** Disfruta de la experiencia táctica completa al instante sin necesidad de registro previo.

---

## 🛠️ Stack Tecnológico Premium

### Capa de Presentación (Frontend)
*   **React 19 & TypeScript:** Estructura modular basada en componentes altamente eficientes con tipado estricto.
*   **Vite:** Herramienta de compilación ultrarrápida y recarga en caliente instantánea (HMR).
*   **Vanilla CSS avanzado (HSL & Glassmorphism):** Estética visual futurista impecable (*Premium Dark Mode*, resplandores cromáticos por rareza de carta y filtros de desenfoque suaves) sin la sobrecarga de librerías externas.

### Capa de Negocio (Backend)
*   **Node.js & Express:** API REST desacoplada, ligera y eficiente de hilo único asíncrono no bloqueante.
*   **Rutas Modulares:** Controladores aislados e independientes para jugadores (`players.js`), simulación de partidos (`match.js`), entrenamientos (`training.js`) y gestión de mánagers (`users.js`).

### Capa de Datos y Persistencia
*   **Persistencia Híbrida Local:** Unifica la inmediatez de la memoria caché RAM con la seguridad física de un archivo de datos local indexado (`backend/data/users.json`). Guarda todo el progreso entre reinicios de forma asíncrona sin necesidad de instalar bases de datos externas.

### Infraestructura (DevOps)
*   **Docker & Docker Compose:** Virtualización ligera y orquestación multi-contenedor que encapsula tanto el cliente web (servido de forma ultra-eficiente mediante **Nginx**) como el servidor API REST.

---

## 🚀 Cómo Levantar el Proyecto en Local

Existen dos vías para ejecutar el proyecto en tu máquina de desarrollo. Antes de comenzar, clona el repositorio:

```bash
git clone https://github.com/JoseLlorensCliment/Manga-Kick.git
cd Manga-Kick
```

### Opción A: Despliegue Automatizado con Docker (Recomendada)
Esta opción levantará todo el entorno de producción (Frontend y Backend enlazados en red virtual privada) de forma instantánea sin necesidad de instalar dependencias locales de Node ni configurar puertos manualmente.

1.  Asegúrate de tener instalado **Docker** y **Docker Desktop** activo.
2.  Ejecuta el siguiente comando en la raíz del proyecto:
    ```bash
    docker-compose up --build
    ```
3.  ¡Listo! Accede a la aplicación web a través de tu navegador favorito en:
    *   **Frontend:** `http://localhost:5173`
    *   **Backend API REST:** `http://localhost:5000`

---

### Opción B: Ejecución Manual en Desarrollo
Si deseas modificar el código en caliente y ejecutar las herramientas nativas:

#### 1. Iniciar el Servidor API (Backend)
1.  Navega a la carpeta del backend:
    ```bash
    cd backend
    ```
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
3.  Inicia el servidor en modo desarrollo:
    ```bash
    npm run dev
    ```
    *(El servidor comenzará a escuchar peticiones en `http://localhost:5000`)*

#### 2. Iniciar la Interfaz Web (Frontend)
1.  Abre una nueva terminal en la raíz del proyecto y navega a la carpeta del cliente:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias necesarias:
    ```bash
    npm install
    ```
3.  Levanta el servidor de desarrollo de Vite:
    ```bash
    npm run dev
    ```
    *(La SPA estará disponible en `http://localhost:5173` con recarga automática)*

---

## 📂 Documentación Académica (TFG)

Toda la memoria académica detallada del Trabajo Fin de Grado está redactada en castellano y se encuentra estructurada dentro de la carpeta `/documentacion/markdown/`:

*   [Capítulo 0.1: Portada](file:///documentacion/markdown/Capitulo_0.1_Portada.md)
*   [Capítulo 0.2: Resumen e Índices](file:///documentacion/markdown/Capitulo_0.2_Resumen_Indices.md)
*   [Capítulo 1: Introducción y Objetivos](file:///documentacion/markdown/Capitulo_1_Introduccion.md) (Contexto del sector, justificación e ingeniería del software).
*   [Capítulo 2: Antecedentes](file:///documentacion/markdown/Capitulo_2_Antecedentes.md) (Estado del arte y tabla comparativa del mercado).
*   [Capítulo 3: Hipótesis de Trabajo](file:///documentacion/markdown/Capitulo_3_Hipotesis.md) (Arquitectura de tres capas y stack tecnológico con diagramas Mermaid).
*   [Capítulo 4: Metodología y Resultados](file:///documentacion/markdown/Capitulo_4_Metodologia_Resultados.md) (Casos de uso, ciclo de vida ágil, lógica de los motores matemáticos de simulación, fórmulas y pruebas).
*   [Capítulo 5: Conclusiones y Trabajo Futuro](file:///documentacion/markdown/Capitulo_5_Conclusiones.md) (Evaluación de metas y escalabilidad comercial).
*   [Capítulo 6: Bibliografía](file:///documentacion/markdown/Capitulo_6_Bibliografia.md) (Referencias académicas).
*   **[Memoria_TFG_Completa.md](file:///documentacion/markdown/Memoria_TFG_Completa.md):** Archivo unificado de toda la tesis integrado mediante script y listo para compilar a PDF/Word.

---

## 👤 Autor

*   **José Luis Llorens Climent**
*   *Universidad Miguel Hernández de Elche (UMH)*
*   *Escuela Politécnica Superior de Elche (EPSE)*
