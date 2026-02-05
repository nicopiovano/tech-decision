# 🧠 Simulador de decisiones técnicas (Vue 3)

Simulador **100% frontend** donde recorrés un proyecto de software por fases (setup → MVP → growth → scale → crisis) y tomás decisiones técnicas.
Cada decisión aplica **efectos determinísticos** sobre métricas internas (deuda técnica, velocidad, estabilidad, moral, etc.) y se guarda un **historial** que alimenta los gráficos y el post‑mortem.

---

## 🛠 Stack

| Tecnología | Uso |
|------------|-----|
| **Vue 3** | UI (Composition API, `script setup`) |
| **Vite** | Dev server + build |
| **Pinia** | Estado global (métricas + historial) |
| **Vue Router** | Navegación por pantallas |
| **Chart.js + vue-chartjs** | Line chart (evolución) + Radar (salud actual) |
| **Tailwind CSS** | UI simple y clara (sin framework pesado) |

---

## 📋 Requisitos

- **Node.js** 18+ (recomendado 20+)
- **npm**

---

## 🚀 Cómo levantar el proyecto

### 1) Instalar dependencias

```bash
npm install
```

### 2) Modo desarrollo

```bash
npm run dev
```

Vite te imprime la URL (por defecto suele ser `http://localhost:5173`).

### 3) Build para producción

```bash
npm run build
```

### 4) Preview del build

```bash
npm run preview
```

---

## 🧭 Pantallas

- `/intro`: explicación breve del simulador
- `/setup`: formulario inicial del proyecto
- `/timeline`: fases + historial de decisiones (con opción **Modificar**)
- `/decision/:id`: tomar una decisión (o editar una anterior)
- `/post-mortem`: resumen final + métricas + gráficos

---

## 🧩 Arquitectura (pensada como producto)

### Principios

- **Data‑driven**: las decisiones viven en JSON, no hardcodeadas en UI.
- **Motor puro**: el engine solo aplica efectos y genera snapshots; no sabe nada de UI.
- **Single source of truth**: Pinia concentra el estado del proyecto.
- **Historial inmutable**: cada respuesta genera un snapshot (ideal para charts y post‑mortem).

### Flujo (en simple)

1. El usuario elige una opción.
2. Esa opción trae `effects` (deltas numéricos por métrica).
3. El engine suma esos deltas numéricos y modifica entre 0 y 100 las variables.
4. El store guarda un snapshot en `history`.
5. Los charts leen `history` y lo dibujan.

---

## 🗂 Datos: decisiones en JSON

Archivo: `src/data/decisions.json`

- Cada `decision` tiene `id`, `phase`, `title`, `prompt`, `options`.
- Cada `option` tiene `effects` con deltas por métrica.

Ejemplo (resumido):

```json
{
  "id": "setup-001",
  "phase": "setup",
  "title": "Base técnica inicial",
  "prompt": "¿Cómo equilibrás velocidad hoy vs mantenibilidad mañana?",
  "options": [
    {
      "id": "monolith-pragmatic",
      "label": "Monolito simple + buenas prácticas",
      "effects": { "technicalDebt": -5, "velocity": 8, "stability": 4 }
    }
  ]
}
```

---

## 📈 Visualizaciones

- **Evolución (métricas)**: line chart derivado de `history`.
- **Salud actual**: radar chart que normaliza para que “alto sea mejor” (invierte deuda técnica y time‑to‑market).

---

## ✏️ Modificar decisiones anteriores (Timeline)

En `/timeline` podés tocar **Modificar** en un paso ya respondido.

- Al editar una respuesta, el store **reconstruye el historial desde el baseline** (para que todo quede consistente).

---

## 📁 Estructura principal

```txt
src/
  charts/             // Registro único de Chart.js
  components/
    charts/           // Line + Radar (desacoplados del store)
  data/               // decisions.json + helpers de acceso (repo)
  engine/             // Motor puro (aplica efectos)
  layouts/            // Shell (header + contenido)
  router/             // Rutas
  stores/             // Store central (métricas + historial)
  views/              // Pantallas
```

Archivos clave:

- `src/stores/projectStore.js`: estado global y acciones (`applyDecision`, `reviseDecision`)
- `src/engine/decisionEngine.js`: `applyEffects` + snapshots
- `src/data/decisions.json`: decisiones y efectos
- `src/components/charts/LineMetricsChart.vue`: evolución por step

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Build para producción |
| `npm run preview` | Preview del build |

---

## 💡 Notas

- No hay backend: todo corre en el navegador.
- El simulador es **determinístico**: a mismas decisiones, mismo resultado.
- Los charts se derivan del historial: no se recalculan “a mano” desde UI.
