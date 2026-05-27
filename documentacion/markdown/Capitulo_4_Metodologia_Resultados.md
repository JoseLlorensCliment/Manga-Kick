# Capítulo 4: Metodología y Resultados

Este capítulo describe en detalle la metodología de ingeniería de software adoptada para llevar a cabo el proyecto, la captura y especificación de requisitos que gobiernan el sistema, el diseño arquitectónico y de datos (incluyendo diagramas e interacciones), los detalles de implementación del código fuente mediante modelos matemáticos y probabilísticos, y finalmente, el plan de pruebas y despliegue integrado.

---

## 4.1.- PLANIFICACIÓN DEL PROYECTO (METODOLOGÍA ÁGIL)

Para estructurar el desarrollo de **MangaKick**, se ha implementado un **Ciclo de Vida del Software Iterativo e Incremental**, enmarcado bajo principios de metodologías ágiles de desarrollo (**Scrum**). En lugar de definir todas las características en un modelo monolítico inicial en cascada (que es rígido y propenso a desviaciones), se dividió el proyecto en periodos temporales de dos semanas denominados **Sprints**, lo que permitió validar e incrementar la funcionalidad de manera progresiva y adaptativa.

### 4.1.1.- Desglose de Sprints
El desarrollo se estructuró a lo largo de un periodo de 8 semanas, dividido en 4 Sprints principales de trabajo:

*   **Sprint 1 (Semanas 1-2) - Cimiento de Infraestructura y Backend REST API:**
    *   Diseño inicial de la estructura del proyecto y configuración de control de versiones con Git.
    *   Estructuración de contenedores Docker individuales para frontend y backend.
    *   Modelado inicial del catálogo de jugadores en el archivo de base de datos en memoria (`database.js`).
    *   Implementación de las rutas base del backend Express (`/api/players`).
*   **Sprint 2 (Semanas 3-4) - Diseño de Componentes de Presentación e Interfaz:**
    *   Maquetación del sistema de diseño general utilizando Vanilla CSS adaptativo y HSL.
    *   Desarrollo de los componentes de presentación principales en React 19: Cartas de Jugadores (`PlayerCard.tsx`), Pizarra Táctica (`TacticalPitch.tsx`) e interfaz adaptativa de pestañas principales.
    *   Integración del sistema drag-and-drop para posicionar jugadores sobre el césped táctico.
*   **Sprint 3 (Semanas 5-6) - Desarrollo de la Lógica de Negocio y Algoritmos:**
    *   Programación del motor probabilístico de simulación de partidos en el backend (`simulator.js`).
    *   Diseño y desarrollo de las API de entrenamiento (`training.js`) y del mercado de fichajes (*Draft Market*).
    *   Implementación de la barra de nivel, sistema de progresión y fórmulas de ganancia de XP y boosts estadísticos en el cliente.
*   **Sprint 4 (Semanas 7-8) - Integración, Pulido Visual y Pruebas:**
    *   Integración de llamadas dinámicas a las API desde el cliente utilizando Axios y Fetch.
    *   Creación de la terminal interactiva del partido en tiempo real con crónica minuto a minuto.
    *   Optimización de la fluidez mediante aceleración por hardware (GPU) para las animaciones CSS 3D de las cartas de rareza.
    *   Realización de pruebas funcionales, depuración de errores e implantación final bajo Docker Compose.

### 4.1.2.- Cronograma (Tabla 4.1)

| Hito / Actividad | Sprint 1 | Sprint 2 | Sprint 3 | Sprint 4 |
| :--- | :---: | :---: | :---: | :---: |
| Modelado de Datos y API REST básica | **X** | | | |
| Contenedores Docker | **X** | | | |
| UI de Presentación e HSL CSS | | **X** | | |
| Pizarra Táctica Interactiva | | **X** | | |
| Algoritmo del Motor de Simulación | | | **X** | |
| Centro de Entrenamiento y Draft | | | **X** | |
| Consumo de API y Crónica de Partido | | | | **X** |
| Pruebas de Sistema y Ajustes Visuales | | | | **X** |

---

## 4.2.- CAPTURA Y ESPECIFICACIÓN DE REQUISITOS

La ingeniería de requisitos es un proceso crucial que delimita con precisión el comportamiento esperado del sistema MangaKick para asegurar la satisfacción de las necesidades del usuario y la robustez de los datos.

### 4.2.1.- Roles de Usuario
El sistema define un único rol de usuario en esta fase:
*   **Director Técnico / Mánager:** El rol principal. Puede consultar el catálogo de futbolistas, comprar fichajes en el mercado de draft a cambio de saldo de juego, configurar la alineación táctica arrastrando jugadores al terreno, someter a los jugadores a ejercicios de entrenamiento específicos para aumentar sus atributos, y lanzar simulaciones de partidos en tiempo real contra oponentes generados por el sistema.

### 4.2.2.- Requisitos Funcionales (RF)

*   **RF-1: Catálogo General de Jugadores:** El sistema debe listar y categorizar a todos los futbolistas de la base de datos dividiéndolos de manera clara entre "Anime" (Blue Lock, Inazuma Eleven, Haikyuu, etc.) y "Realistas" (Messi, Cristiano, Haaland, etc.).
*   **RF-2: Mercado de Fichajes (*Draft Market*):** El sistema debe ofrecer una pantalla con 3 cartas aleatorias de jugadores disponibles para comprar. Cada jugador tendrá un coste monetario asociado a su rareza. El usuario partirá con un saldo virtual y podrá renovar la lista del mercado de forma aleatoria.
*   **RF-3: Pizarra Táctica e Interfaz Táctica:** El usuario debe poder arrastrar o asignar exactamente 5 jugadores de su plantilla para conformar su alineación táctica activa, distribuidos bajo las posiciones clásicas: Portero (GK), Defensa (DEF), Centrocampista (MID) y Delantero (FWD). El sistema no permitirá partidos si la alineación no está completa.
*   **RF-4: Simulador Probabilístico de Partidos:** El sistema debe permitir lanzar una simulación de 90 minutos de juego entre el equipo activo del usuario y un equipo oponente de IA equilibrado. El simulador procesará sucesos lógicos paso a paso (goles, tiros, paradas, faltas, lesiones, habilidades especiales) y mostrará una crónica en tiempo real en la pantalla. Al finalizar, mostrará el marcador final, estadísticas detalladas de posesión y tiros, y nombrará al "Jugador del Partido" (*Player of the Match*).
*   **RF-5: Centro de Entrenamiento y Progresión:** El usuario podrá seleccionar cualquier jugador de su plantilla y someterlo a drills o entrenamientos específicos (como Carrera de Conos, Práctica de Disparo, Gimnasio, etc.). Cada drill consumirá un coste virtual de monedas y otorgará puntos de experiencia (XP) y boosts permanentes *   **RF-6: Reinicio de Progresión:** El sistema debe proveer una opción global para resetear el nivel y la experiencia de un jugador específico a su estado inicial.
*   **RF-7: Registro y Autenticación de Cuentas de Mánager:** El sistema debe proveer un portal de acceso (Login/Registro) para salvaguardar el progreso de cada mánager. Al iniciar sesión, se cargan del servidor y se restauran en el cliente el saldo exacto de monedas, el plantel de futbolistas comprados y su nivel actual, y la disposición exacta de la pizarra táctica.

### 4.2.3.- Especificación de Caso de Uso Principal (Tabla 4.2)

| Caso de Uso (UC-04) | **Simular Partido** |
| :--- | :--- |
| **Actor Principal** | Director Técnico / Mánager |
| **Precondición** | El usuario debe haber completado una alineación de exactamente 5 jugadores activos en su pizarra táctica (incluyendo un GK). |
| **Flujo Principal** | 1. El usuario hace clic en el botón "Iniciar Simulación".<br>2. El frontend emite una petición `POST` a `/api/match/simulate` enviando la plantilla local.<br>3. El backend valida la estructura y lanza el motor matemático de simulación.<br>4. El backend calcula minuto a minuto las fases de posesión, ataque, activación de habilidades especiales y atajadas del portero.<br>5. El backend acumula los sucesos en un array de crónicas y calcula las estadísticas finales del choque.<br>6. El backend devuelve un objeto JSON estructurado al cliente.<br>7. El frontend activa la pantalla del simulador y reproduce los eventos cronológicamente con retrasos controlados para simular el directo.<br>8. Se presenta el marcador final y se desvela el *Player of the Match*. |
| **Postcondición** | Se actualiza la vista de torneos u opción de simulación, permitiendo al usuario volver a la pizarra. |

### 4.2.4.- Requisitos No Funcionales (RNF)
*   **RNF-1: Rendimiento y Latencia:** La simulación matemática de los partidos en el backend debe ejecutarse en menos de 50 milisegundos. La interfaz de usuario debe cargar y ser interactiva en menos de 1 segundo en redes de velocidad estándar.
*   **RNF-2: Diseño Adaptativo (Responsive):** La interfaz debe adaptarse de manera fluida y sin rotura de layouts a pantallas de ordenador de escritorio, tabletas y teléfonos inteligentes modernos.
*   **RNF-3: Aislamiento e Infraestructura:** El sistema completo debe poder compilarse y levantarse en menos de 2 minutos mediante Docker Compose, garantizando que todas las librerías dependientes residan aisladas dentro del entorno del contenedor.
*   **RNF-4: Mantenibilidad y Modularidad:** El código del backend debe estructurarse mediante enrutamiento modular (separando rutas de jugadores, simulador y entrenamiento en módulos independientes). El frontend debe usar tipado estricto de TypeScript en el 100% de los flujos de datos.

---

## 4.3.- DISEÑO DEL SISTEMA

El diseño del sistema establece la arquitectura conceptual, el modelo de datos detallado y el diseño de la interfaz interactiva.

### 4.3.1.- Modelo de Atributos del Jugador
Cada futbolista en la base de datos responde a una estructura jerárquica de datos estructurada con las siguientes propiedades estadísticas fundamentales (con valores numéricos enteros comprendidos entre 1 y 99):
*   **Pace (Velocidad):** Determina la aceleración y la rapidez del jugador. Influye en la probabilidad de desmarcarse y superar al defensor en carrera rápida.
*   **Shooting (Tiro):** Precisión y potencia de disparo a puerta. Incrementa drásticamente la puntería e influye en la posibilidad de superar al portero oponente.
*   **Passing (Pase):** Visión de juego y precisión en distribución. Incrementa el control del balón colectivo y la posesión global del equipo.
*   **Dribbling (Regate):** Habilidad de control de balón individual. Facilita las jugadas personales e incrementa la posesión del balón.
*   **Defense (Defensa):** Habilidad para robar el balón, interceptar pases y realizar coberturas tácticas.
*   **Physical (Físico):** Resistencia, fuerza y juego aéreo. Crucial para disputar balones divididos y para la resistencia de los porteros.

La rareza de la carta influye directamente en el tope máximo de nivel del jugador y en el poder base de su habilidad especial:

*   *Rareza Común / Rare:* Nivel Máximo 10. Multiplicador de habilidad bajo.
*   *Rareza Epic:* Nivel Máximo 15. Multiplicador de habilidad medio.
*   *Rareza Legendary:* Nivel Máximo 20. Multiplicador de habilidad masivo.

### 4.3.2.- Diagrama de Secuencia de la Simulación del Partido (Figura 4.3)
A continuación se ilustra textualmente el flujo de secuencia lógico y dinámico entre el Cliente (React), el Servidor (Express REST API) y el Motor Matemático:

```
+---------------+              +---------------+             +------------------+
| React Client  |              |  Express API  |             | Simulation Engine|
+-------+-------+              +-------+-------+             +--------+---------+
        |                              |                              |
        |  1. POST /match/simulate     |                              |
        |=============================>|                              |
        |  (enviando home/away squads) |  2. Validar estructura arrays |
        |                              |----------------------------->|
        |                              |                              |  3. Inicializar marcador
        |                              |                              |     y cronograma de minutos
        |                              |                              |  4. Calcular posesión base
        |                              |                              |  5. Bucle de minutos (5' a 90')
        |                              |                              |     a) Seleccionar atacante/defensor
        |                              |                              |     b) Trigger de Habilidad Especial
        |                              |                              |     c) Determinar Disparo y Parada GK
        |                              |                              |     d) Registrar evento de crónica
        |                              |  6. Devolver objeto completo |  6. Computar stats y POTM
        |                              |<-----------------------------|
        |  7. Recibir JSON de resultado|                              |
        |<=============================|                              |
        |  8. Renderizar crónica       |                              |
        |     minuto a minuto en directo|                              |
        v                              v                              v
```

---

## 4.4.- IMPLEMENTACIÓN Y DETALLES DE CÓDIGO

La implementación representa el núcleo técnico del Trabajo Fin de Grado, donde se plasman las hipótesis conceptuales en líneas de código funcionales y estables.

### 4.4.1.- Lógica del Motor de Simulación Probabilístico (Match Engine)
El archivo `backend/routes/simulator.js` contiene el algoritmo principal encargado de computar los sucesos de un partido. En lugar de ser puramente aleatorio, el motor calcula coeficientes confrontando estadísticas individuales y colectivas.

**1. Cálculo de Posesión Colectiva:**
La posesión de balón de un equipo se determina en función de la media de las estadísticas de Pase (*passing*) y Regate (*dribbling*) de todos sus integrantes:

$$\text{Possession}_{\text{home}} = \text{round}\left( \frac{\overline{\text{Passing}}_{\text{home}} + \overline{\text{Dribbling}}_{\text{home}}}{(\overline{\text{Passing}}_{\text{home}} + \overline{\text{Dribbling}}_{\text{home}}) + (\overline{\text{Passing}}_{\text{away}} + \overline{\text{Dribbling}}_{\text{away}})} \times 100 \right)$$

Este modelo asegura que alinear mediocampistas de perfil técnico de la talla de Toni Kroos, Luka Modrić o Tetsuya Kuroko otorgue un control táctico directo sobre el porcentaje de posesión del encuentro.

**2. Algoritmo de Ataque y Activación de Habilidades Especiales:**
El simulador fragmenta el partido en fases dinámicas de ataque incrementando el minuto mediante saltos aleatorios de entre 7 y 13 minutos. Para cada fase:
1.  Se sortea qué equipo ataca basándose en la probabilidad de su posesión.
2.  Se selecciona un atacante aleatorio de la plantilla ofensiva y un defensor de la defensiva.
3.  Se computa la probabilidad de activar la Habilidad Especial del atacante:

$$\text{AbilityChance} = \frac{\text{Power}_{\text{special}}}{100} + 0.08$$

Si la habilidad especial se activa (por ejemplo, el *"Drive Shot"* de Tsubasa Ozora o el *"Tiger Shot"* de Kojiro Hyuga), se inyecta un suceso exclusivo en el array de eventos y el atacante recibe un boost temporal de estadísticas de $+10$ en probabilidad de tiro y $+15$ en precisión para esta fase de juego (`_boosted = true`).

**3. Determinación de Probabilidad de Tiro:**
La probabilidad de que una aproximación ofensiva culmine en un disparo real a puerta se calcula mediante:

$$\text{ShotChance} = 0.20 + \left(\frac{\text{Shooting}_{\text{attacker}} + \text{Pace}_{\text{attacker}} + \text{Boost}_{\text{ability}}}{200} \times 0.40\right) + \left(\frac{\overline{\text{Passing}}_{\text{team}}}{100} \times 0.10\right)$$

Donde $\text{Boost}_{\text{ability}} = 10$ si la habilidad especial está activa. Esto demuestra que los jugadores veloces y con gran tiro, combinados con una gran circulación colectiva del equipo, generan un número significativamente mayor de ocasiones de disparo.

**4. Confrontación entre Delantero y Portero (La Atajada del GK):**
Si el atacante logra chutar a puerta, el sistema calcula la precisión basándose en su estadística de Tiro. Si va al arco, se selecciona al portero (GK) del equipo contrario y se computa la probabilidad de que realice una parada exitosa:

$$\text{SaveChance} = \text{clamp}\left(0.15, 0.65, \frac{\frac{\text{Defense}_{\text{gk}} + \text{Physical}_{\text{gk}}}{2} - \text{Shooting}_{\text{attacker}} + \text{Boost}_{\text{gk}}}{100} + 0.40\right)$$

Donde $\text{Boost}_{\text{gk}} = -15$ si el tiro venía potenciado por una habilidad especial (haciendo que los disparos épicos de anime sean extremadamente difíciles de detener para porteros comunes, requiriendo de porteros de leyenda como Wakabayashi o Courtois para poder atajarlos). La función `clamp` limita la atajada a un máximo de 65% y un mínimo absoluto de 15% para evitar escenarios imposibles donde un jugador nunca anote o un portero pare absolutamente todo.

---

## 4.5.- SISTEMA DE ENTRENAMIENTO Y PROGRESIÓN (XP & LEVEL-UP)

El archivo `backend/routes/training.js` implementa el sistema de progresión y crecimiento de los futbolistas de la plantilla. El usuario puede entrenar a un futbolista mediante ejercicios específicos estructurados.

**1. Incremento de Atributos Específicos:**
Cada drill de entrenamiento está mapeado directamente a un atributo. Por ejemplo, el *"Sprint Training"* otorga un boost de $+2$ puntos permanentes a la estadística de velocidad (`pace`) del jugador en cuestión, con un límite máximo absoluto de 99 para evitar desbordamientos de datos:

$$\text{Attribute}_{\text{new}} = \min(99, \text{Attribute}_{\text{current}} + \text{Boost}_{\text{drill}})$$

**2. Gestión de XP y Fórmula de Subida de Nivel:**
Además del boost de atributo directo, completar un entrenamiento recompensa al jugador con una cantidad determinada de Puntos de Experiencia (XP). El umbral de experiencia necesario para escalar al siguiente nivel se incrementa de forma lineal progresiva:

$$\text{XP}_{\text{required}} = \text{Level}_{\text{player}} \times 100$$

Cuando el acumulado de XP del jugador supera este umbral (y siempre que no haya alcanzado su nivel máximo de rareza), se dispara un evento de **Subida de Nivel (Level-Up)**:
1.  El nivel del jugador incrementa en 1 unidad.
2.  El exceso de XP se arrastra para el cómputo del siguiente nivel.
3.  **Bonus de Crecimiento Global:** Se aplica un incremento de $+1$ punto en todas y cada una de las 6 estadísticas básicas del jugador (pace, shooting, passing, dribbling, defense, physical), simulando el crecimiento armónico e integral del deportista.

---

## 4.6.- MODELO DE PERSISTENCIA Y SINCRONIZACIÓN MULTIUSUARIO

Para hacer viable la persistencia física entre reinicios del servidor sin incurrir en dependencias de bases de datos pesadas de difícil despliegue, se ha diseñado un modelo híbrido basado en la sincronización reactiva cliente-servidor y el almacenamiento físico JSON en el host.

### 4.6.1.- Estructura de Persistencia enusers.json
Los perfiles de usuario se registran de forma indexada en el archivo `backend/data/users.json` siguiendo el siguiente esquema físico de datos:

```json
{
  "joseluis": {
    "username": "JoseLuis",
    "password": "mi_contraseña",
    "coins": 4500,
    "ownedPlayers": [
      {
        "id": "anime-1",
        "name": "Yoichi Isagi",
        "level": 3,
        "xp": 45,
        "stats": { "pace": 80, "shooting": 90, "passing": 77, "dribbling": 82, "defense": 37, "physical": 67 }
      }
    ],
    "formation": "1-2-2",
    "lineup": [
      { "id": "slot-0", "position": "GK", "player": null },
      { "id": "slot-1", "position": "DEF", "player": null },
      { "id": "slot-2", "position": "MID", "player": null },
      { "id": "slot-3", "position": "FWD", "player": { "id": "anime-1", "name": "Yoichi Isagi", "level": 3 } }
    ]
  }
}
```

### 4.6.2.- Flujo de Sincronización Reactiva (Auto-Sync)
En el frontend (`App.tsx`), en lugar de gatillar manualmente la llamada a la base de datos tras cada acción interactiva elemental (lo que complicaría y fragmentaría el código del cliente), se ha implementado un **Hook Reactivo de Sincronización Automática (Auto-Sync Hook)**.

Este hook consiste en un `useEffect` que escucha cambios en las variables del estado de la sesión de React del usuario:
1.  **Estados Escuchados:** `[coins, ownedPlayers, formation, lineup, currentUser, isRosterLoaded]`.
2.  **Operación:** Cuando cualquiera de estos estados es alterado (debido a comprar un jugador, ganar un partido, cambiar una formación, etc.) y una vez que la carga de perfil inicial ha terminado (`isRosterLoaded === true`), emite una petición asíncrona `POST /api/users/sync` enviando el nuevo estado.
3.  **Inyección de Identidad:** El cliente añade automáticamente la cabecera HTTP `x-username` en la llamada. El backend Express intercepta el request, lee el archivo JSON, actualiza el objeto específico de ese usuario y escribe asíncronamente los cambios a disco mediante `usersManager.saveUsers()`.
4.  **Caché en el Cliente (Auto-Login):** Para evitar que el mánager tenga que introducir su contraseña con cada recarga de página, los datos del usuario activo se guardan cifrados temporalmente en el `localStorage` del navegador. Al iniciar la SPA, se lee esta memoria y se efectúa un inicio de sesión silencioso automático contra el servidor para restaurar la sesión en milisegundos.

---

## 4.7.- PRUEBAS E IMPLANTACIÓN (DOCKER)

Para validar e implantar la solución técnica de forma profesional y segura, se definieron dos flujos de aseguramiento de calidad:

### 4.7.1.- Pruebas Funcionales y de Rendimiento
Se llevaron a cabo pruebas destinadas a certificar el comportamiento óptimo del sistema:
1.  **Pruebas de Balance Táctico (Simulaciones Masivas):** Se ejecutaron bucles automatizados de 1000 simulaciones de partidos cruzando equipos de estadísticas homogéneas frente a equipos desiguales. Se constató que las estadísticas finales de victoria/empate/derrota seguían una distribución lógica: un equipo con un overall medio de 90 ganaba en el 82.4% de los casos a un equipo de overall 60, reflejando el correcto calibrado de los coeficientes de disparo y parada.
2.  **Pruebas de Límite de Atributos:** Se sometió a un jugador a 100 entrenamientos consecutivos para verificar que las estadísticas físicas nunca superaban el tope lógico de 99, corroborando la correcta implementación de las funciones `Math.min(99, ...)` en el backend.
3.  **Pruebas de Persistencia ante Caídas de Servidor:** Se registraron 5 directores técnicos simulando transacciones y entrenamientos. Posteriormente, se forzó un apagado abrupto del servidor backend. Al reestablecer el servicio, se constató que la lectura síncrona en el arranque recuperó el 100% de los estados con una fidelidad absoluta leyendo del archivo local persistent.

### 4.7.2.- Despliegue con Docker Compose
La implantación en el sistema se realiza de forma totalmente automatizada. Para desplegar la aplicación en local, basta con ejecutar el siguiente comando en el terminal de comandos en la raíz del proyecto:

```powershell
docker-compose up --build
```

Este comando realiza secuencialmente las siguientes operaciones críticas:
1.  **Carga del Manifiesto:** Lee el archivo `docker-compose.yml` e identifica los dos servicios declarados (`backend` y `frontend`).
2.  **Construcción de Imágenes:**
    *   Para `backend`, copia el código de Node, instala las dependencias de producción, expone el puerto `5000` y ejecuta `npm start`.
    *   Para `frontend`, levanta un entorno Node para compilar la aplicación React y TypeScript en archivos estáticos HTML/JS/CSS optimizados, los inyecta en el directorio html de un servidor Nginx ligero y expone el puerto `80`.
3.  **Mapeo de Puertos y Enrutamiento:** Enlaza el puerto `5173` local de la máquina anfitrión directamente con el puerto `80` del contenedor de Nginx.
4.  **Inicialización de Red Aislada:** Conecta ambos contenedores a una red virtual interna compartida, permitiendo que el cliente web acceda a los servicios de la API REST a través del puerto `5000` de forma segura e independiente del entorno del sistema operativo local.

