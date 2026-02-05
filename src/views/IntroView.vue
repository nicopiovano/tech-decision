<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="space-y-5">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">Simulador de decisiones técnicas</h1>
      <p class="text-slate-300">
        Simulás un proyecto de software atravesando fases (setup, MVP, growth, scale, crisis). En cada fase tomás
        decisiones que impactan métricas internas como deuda técnica, velocidad, estabilidad y morale del equipo.
      </p>
    </header>

    <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <p class="text-sm text-slate-300">
        Esta base está pensada como producto: estado global en Pinia, motor de decisiones desacoplado (data‑driven),
        y visualización con Chart.js.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <RouterLink
        to="/setup"
        class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
      >
        Empezar
      </RouterLink>
      <RouterLink
        to="/timeline"
        class="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900"
      >
        Ir directo a timeline
      </RouterLink>
    </div>
  </section>
</template>

