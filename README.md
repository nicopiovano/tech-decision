# Simulador de decisiones tecnicas

Simulador 100% frontend sobre trade-offs tecnicos y sus consecuencias acumuladas.

Este proyecto no es sobre elegir "la arquitectura correcta".
Es sobre entender por que cada decision tecnica tiene un costo y como esos costos se componen con el tiempo.

Simulas un proyecto real, atravesas sus fases y tomas decisiones bajo presion.
El sistema no te juzga.
Solo lo recuerda.

---

## Que explora este proyecto

- Trade-offs entre velocidad, calidad y estabilidad
- Como se acumula la deuda tecnica
- Por que los atajos se sienten bien al principio y duelen despues
- Como las decisiones de proceso afectan el resultado
- Pensamiento sistemico aplicado a desarrollo de software

---

## Como funciona

1. Inicializas un proyecto (contexto, equipo, dominio)
2. Avanzas por fases realistas: Setup, MVP, Growth, Scale, Crisis
3. En cada fase elegis entre opciones tecnicas
4. Cada opcion impacta metricas internas
5. Se guarda un historial de snapshots (para charts y analisis)
6. Terminas con un post-mortem de tus decisiones

Toda la logica es deterministica y corre del lado del cliente (sin backend).

---

## Metricas

- technicalDebt (mas alto = peor)
- velocity
- maintainability
- stability
- teamMorale
- timeToMarket (mas alto = peor / mas lento)

---

## Arquitectura

Disenado como producto, no como demo.

Principios:

- Single source of truth del estado del proyecto (Pinia)
- Motor puro de decisiones (sin UI) que aplica efectos a metricas
- Decisiones data-driven (JSON)
- Snapshots inmutables de historial para charts y post-mortem

Stack:

- Vue 3 (Composition API, script setup)
- Vite
- Pinia
- Vue Router
- Chart.js + vue-chartjs
- Tailwind CSS (UI simple y clara)

---

## Estructura del proyecto

```txt
src/
  components/        // Componentes UI reutilizables
  components/charts/ // Charts desacoplados (Line + Radar)
  charts/            // Registro unico de Chart.js
  data/              // decisions.json + helpers de acceso
  engine/            // Motor puro (aplica efectos)
  layouts/           // Layout principal
  router/            // Rutas
  stores/            // Store central (metricas + historial)
  views/             // Pantallas (intro/setup/timeline/decision/dashboard/post-mortem)
```

Archivos clave:

- src/data/decisions.json: decisiones y efectos
- src/engine/decisionEngine.js: aplica efectos y genera snapshots
- src/stores/projectStore.js: estado global (metricas + historial)

---

## Visualizaciones

- Line chart: evolucion de metricas a lo largo del tiempo (history)
- Radar chart: salud actual del proyecto (normaliza para que alto sea mejor)

---

## Correr local

```bash
npm install
npm run dev
```

Build / preview:

```bash
npm run build
npm run preview
```
