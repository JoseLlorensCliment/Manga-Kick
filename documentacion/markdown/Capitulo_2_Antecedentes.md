# Capítulo 2: Antecedentes y Estado de la Cuestión

## 2.1.- SITUACIÓN ACTUAL Y PROBLEMÁTICA DEL SECTOR

En la actualidad, el ámbito de los videojuegos de fútbol está dominado de forma hegemónica por grandes producciones comerciales de presupuestos multimillonarios. Franquicias consagradas como *EA Sports FC* (anteriormente conocido como *FIFA*) o *eFootball* (antiguo *Pro Evolution Soccer*) acaparan la práctica totalidad del mercado. Estas producciones centran sus esfuerzos de desarrollo en dos pilares fundamentales: el fotorrealismo gráfico tridimensional de última generación y los modelos de monetización agresivos basados en la adquisición de sobres de cromos virtuales (*Ultimate Team*).

Esta coyuntura del sector plantea tres problemáticas esenciales que motivan la concepción de una alternativa como MangaKick:

1.  **Exclusión del Juego Casual y Dependencia de Hardware de Gama Alta:** Las superproducciones de fútbol actuales requieren consolas de videojuegos especializadas de última generación (PlayStation 5, Xbox Series X/S) o tarjetas gráficas de gama alta en ordenadores personales para poder ejecutarse. Además, sus archivos ocupan más de 100 gigabytes de almacenamiento en disco y exigen actualizaciones masivas constantes. Esto excluye por completo al usuario casual que dispone de un ordenador de oficina ligero o un dispositivo móvil y desea disfrutar de una partida rápida sin tiempos de descarga ni requisitos técnicos prohibitivos.
2.  **Ruptura Abrupta entre Realismo y Fantasía Deportiva:** Los simuladores tácticos puros, liderados por la saga *Football Manager*, ofrecen bases de datos realistas de dimensiones colosales, pero su estética visual es extremadamente fría, semejante a hojas de cálculo de oficina, careciendo de elementos de dinamismo visual, épica y fantasía. Por contra, los juegos basados en franquicias de anime (como *Inazuma Eleven*) relegan el realismo estratégico y estadístico en favor de una jugabilidad meramente fantástica infantil, sin ofrecer ningún vínculo con el fútbol de la élite real contemporánea.
3.  **Hermetismo en Licencias y Crossovers Creativos:** Debido a restricciones contractuales y comerciales muy estrictas, los jugadores de fútbol real nunca interactúan con los personajes de ficción en las plataformas comerciales. Los usuarios se ven obligados a jugar en universos separados. Un jugador apasionado por la táctica de Pep Guardiola y, al mismo tiempo, por el análisis analítico de Yoichi Isagi en *Blue Lock* no dispone de ningún canal digital donde experimentar la simbiosis táctica de ambos mundos bajo reglas comunes.

Ante este panorama, la problemática reside en la falta de un **sistema web de acceso libre, ligero, interactivo y visualmente inmersivo** que ofrezca un entorno de simulación táctica híbrido. MangaKick se propone resolver este vacío sectorial proporcionando una aplicación web modular que se ejecuta directamente desde cualquier navegador estándar en milisegundos, democratizando el acceso a los juegos de gestión estratégica y posibilitando el crossover definitivo entre el fútbol real y el de animación japonesa.

---

## 2.2.- HERRAMIENTAS DISPONIBLES EN EL MERCADO

A fin de situar a MangaKick en el espectro tecnológico actual, se ha llevado a cabo una investigación analítica de las principales herramientas y videojuegos de gestión o fútbol que operan actualmente en el mercado y que guardan relación conceptual o técnica con nuestro proyecto.

### 2.2.1.- Football Manager (Sports Interactive / SEGA)

*Football Manager* es indiscutiblemente el referente absoluto en el sector de la simulación de gestión deportiva. Esta herramienta cuenta con una base de datos de cientos de miles de futbolistas reales actualizada minuciosamente por una red global de ojeadores profesionales.

*   **Puntos Fuertes:** Su motor de simulación táctica es extremadamente maduro y simula la física del partido con gran precisión tridimensional o bidimensional. Ofrece una profundidad de gestión sin parangón, abarcando desde entrenamientos específicos, contratos de patrocinio, ruedas de prensa, hasta dinámicas psicológicas de vestuario.
*   **Puntos Débiles:** Su interfaz de usuario es densa, monótona y excesivamente analítica, orientada exclusivamente a un perfil de jugador entusiasta de la estadística pura. Su curva de aprendizaje es extremadamente pronunciada, requiriendo decenas de horas de aprendizaje básico. Además, carece por completo de elementos de animación estilizada o fantasía épica, y su coste de adquisición anual es elevado.

### 2.2.2.- Captain Tsubasa: Rise of New Champions (Tamsoft / Bandai Namco)

Lanzado en 2020 para consolas y PC, este título traslada el universo del clásico anime *Oliver y Benji* (Captain Tsubasa) a las tres dimensiones con una fidelidad visual notable mediante la técnica artística de *Cel Shading*.

*   **Puntos Fuertes:** Destaca por su espectacularidad visual. Las jugadas especiales de los protagonistas, como el famoso "Tiro del Tigre" de Mark Lenders (Kojiro Hyuga) o la "Catapulta Infernal" de los hermanos Derrick, se representan mediante espectaculares cinemáticas integradas que transmiten una inmensa sensación de poder e impacto emocional.
*   **Puntos Débiles:** Es un juego estrictamente *arcade* de fútbol en tiempo real enfocado en el manejo directo con mando de juego. Carece casi por completo de profundidad táctica: no existe la gestión estratégica de plantillas a largo plazo, ni pizarras tácticas dinámicas basadas en roles posicionales, ni progresión científica de estadísticas individuales. Su rendimiento requiere hardware de gama media-alta y su portabilidad en la web es inexistente.

### 2.2.3.- Inazuma Eleven: Victory Road (Level-5)

La franquicia *Inazuma Eleven* es el mayor exponente del género RPG de fútbol fantástico. Este último título unifica la jugabilidad táctica sobre la pantalla táctil con los partidos tradicionales de rol deportivo.

*   **Puntos Fuertes:** Posee un sistema de estadísticas muy estructurado y un sistema de progresión de personajes sobresaliente, donde el entrenamiento de los jugadores influye decisivamente en el poder de sus técnicas especiales. Las mecánicas de confrontación entre jugadores combinan elementos de rol con toma de decisiones rápidas.
*   **Puntos Débiles:** Es una plataforma comercial cerrada y exclusiva de consolas de sobremesa (Nintendo Switch, PlayStation) y dispositivos móviles nativos. No cuenta con ninguna conexión con la realidad del fútbol profesional real y el ecosistema está extremadamente orientado a un público infanto-juvenil. Además, su jugabilidad requiere mandos o pantallas táctiles de alta precisión, y sus tiempos de carga son considerables debido a la densidad de sus assets gráficos tridimensionales.

### 2.2.4.- Resumen y Cuadro Comparativo

Para sintetizar el estudio del estado del arte, se ha estructurado la siguiente tabla comparativa cruzando las características esenciales de las herramientas estudiadas frente a la propuesta de desarrollo de **MangaKick**:

| Dimensión / Característica | Football Manager | Captain Tsubasa: RoNC | Inazuma Eleven | **MangaKick (Propuesta)** |
| :--- | :--- | :--- | :--- | :--- |
| **Plataforma de Acceso** | PC nativo, Consolas, Móviles | PC nativo, Consolas | Consolas, Móviles nativos | **Web Navegador (Cualquier SO)** |
| **Consumo de Recursos** | Alto (CPU y Memoria masiva) | Muy Alto (GPU dedicada) | Medio-Alto (Consola/Móvil) | **Extremadamente Bajo (Ligero)** |
| **Instalación Requerida** | Sí (Decenas de Gigabytes) | Sí (Aprox. 37 Gigabytes) | Sí (Varios Gigabytes) | **No (Ejecución Instantánea)** |
| **Base de Datos Híbrida** | No (Solo realismo extremo) | No (Solo universo Tsubasa) | No (Solo universo Inazuma) | **Sí (Anime + Fútbol Real)** |
| **Complejidad Táctica** | Hipercompleja / Árida | Muy Baja (Acción Arcade) | Media (Foco en RPG) | **Equilibrada e Inmersiva** |
| **Progreso/Entrenamiento** | Científico y Numérico | Inexistente / Campaña | Alto (Foco en nivel y XP) | **Sí (XP, Stats, Drills y Nivel)** |
| **Habilidades Especiales** | No (Rasgos de juego reales) | Sí (Cinemáticas de acción) | Sí (Técnicas Fantásticas) | **Sí (Habilidades Activas por Stats)** |
| **Coste del Producto** | Alto pago anual | Pago completo de lanzamiento | Pago completo de lanzamiento | **100% Gratis y Libre (Académico)** |
| **Curva de Aprendizaje** | Muy pronunciada | Plana / Fácil | Media (Mecánicas de rol) | **Baja e Intuitiva** |

---

## 2.3.- VALORACIÓN Y PROPUESTA DE VALOR

El análisis detallado de las soluciones existentes revela un nicho desatendido y una oportunidad de ingeniería de software muy valiosa. Las herramientas del mercado obligan al usuario a elegir entre la complejidad técnica de la simulación hiperrealista (*Football Manager*), el entretenimiento arcade cerrado (*Captain Tsubasa*) o el RPG de plataformas exclusivas (*Inazuma Eleven*). Ninguna de ellas ofrece una solución para el navegador web ligera, accesible y unificada.

La propuesta de valor de **MangaKick** reside en los siguientes puntos diferenciales:

1.  **Simplicidad Operativa y Portabilidad Absoluta:** Al ejecutarse íntegramente sobre tecnologías web estándar, MangaKick elimina las barreras de entrada. No se requiere ninguna instalación de software, registro de cuentas de pago ni tarjetas gráficas sofisticadas. Basta con abrir una pestaña en cualquier navegador web contemporáneo para acceder al simulador de forma inmediata.
2.  **Simbiosis Estadística Coherente (El Motor Probabilístico):** MangaKick aporta valor técnico mediante la creación de un motor matemático que unifica bajo una misma escala numérica el rendimiento físico y táctico de un jugador real y el poder fantástico de un personaje de anime. Un disparo a puerta de Erling Haaland ("Viking Smash") se confronta de manera matemáticamente justa con la atajada mística de Mamoru Endou ("God Hand"), calculando dinámicamente coeficientes basados en el estado físico, entrenamiento y nivel de cada personaje.
3.  **Excelencia Visual sin Bloatware:** A diferencia de las interfaces complejas y frías del software de gestión o de los motores 3D que saturan la memoria del navegador, MangaKick implementa un diseño artístico inmersivo con una estética *Premium Dark Mode* inspirada en interfaces futuristas de videojuegos de consola. Utiliza gradientes HSL vibrantes, tarjetas dinámicas interactivas con giros 3D por hardware de CSS, y una disposición táctica intuitiva sobre el lienzo del terreno de juego.
4.  **Arquitectura Limpia y Despliegue DevOps:** Para el desarrollador y el ingeniero de sistemas, MangaKick ofrece una propuesta limpia: un repositorio git estructurado y dockerizado. Con un único comando, el sistema compila el cliente React en producción utilizando Vite (generando un bundle estático ultraligero) y levanta el servidor backend de Express de manera aislada, sentando las bases de una infraestructura moderna lista para escalar en servidores de nube.
