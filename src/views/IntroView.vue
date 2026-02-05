<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="space-y-5">
    <header class="space-y-2">
      <h1 class="text-2xl font-semibold">Simulador de decisiones técnicas</h1>
      <p class="text-emerald-100/80">
        Simulás un proyecto de software atravesando fases (setup, MVP, growth, scale, crisis). En cada fase tomás
        decisiones que impactan métricas internas como deuda técnica, velocidad, estabilidad y moral del equipo.
      </p>
    </header>

    <div class="rounded-lg border border-emerald-900 bg-emerald-900/20 p-4">
      <p class="text-sm text-emerald-100/80">
        Esta base está pensada como producto: estado global en Pinia, motor de decisiones desacoplado (data‑driven),
        y visualización con Chart.js.
      </p>
    </div>

    <div class="flex items-center gap-3">
      <RouterLink
        to="/setup"
        class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
      >
        Empezar
      </RouterLink>
      <RouterLink
        to="/timeline"
        class="rounded-md border border-emerald-800 px-4 py-2 text-sm font-medium text-emerald-50 hover:bg-emerald-900/30"
      >
        Ir directo a timeline
      </RouterLink>
    </div>
  </section>
</template>

