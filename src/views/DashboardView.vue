<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import MetricCard from '../components/MetricCard.vue'
import LineMetricsChart from '../components/charts/LineMetricsChart.vue'
import RadarHealthChart from '../components/charts/RadarHealthChart.vue'
import { useProjectStore } from '../stores/projectStore'

const router = useRouter()
const project = useProjectStore()
if (!project.isInitialized) {
  router.replace('/setup')
}

const metricCards = computed(() => [
  { key: 'technicalDebt', label: 'Deuda técnica', hint: 'Más alto = peor', value: project.metrics.technicalDebt },
  { key: 'velocity', label: 'Velocidad', hint: 'Capacidad de entrega', value: project.metrics.velocity },
  { key: 'maintainability', label: 'Mantenibilidad', hint: 'Facilidad de cambio', value: project.metrics.maintainability },
  { key: 'stability', label: 'Estabilidad', hint: 'Fiabilidad en prod', value: project.metrics.stability },
  { key: 'teamMorale', label: 'Morale del equipo', hint: 'Energía / motivación', value: project.metrics.teamMorale },
  { key: 'timeToMarket', label: 'Time-to-market', hint: 'Más alto = más lento', value: project.metrics.timeToMarket },
])
</script>

<template>
  <section class="space-y-5">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">Dashboard</h1>
      <p class="text-sm text-slate-300">
        Métricas actuales y su evolución. Los charts se alimentan del historial del store (data-driven por decisiones).
      </p>
    </header>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard v-for="m in metricCards" :key="m.key" :label="m.label" :value="m.value" :hint="m.hint" />
    </div>

    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <div class="text-sm font-semibold">Evolución (métricas)</div>
        <div v-if="project.history.length < 2" class="mt-2 text-xs text-slate-400">
          Tomá al menos una decisión para ver evolución.
        </div>
        <div class="mt-3">
          <LineMetricsChart :history="project.history" :metric-keys="project.metricKeys" />
        </div>
      </div>
      <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
        <div class="text-sm font-semibold">Salud actual (radar chart)</div>
        <div class="mt-3">
          <RadarHealthChart :metrics="project.metrics" />
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <RouterLink
        to="/timeline"
        class="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900"
      >
        Volver a timeline
      </RouterLink>
      <RouterLink
        to="/post-mortem"
        class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
      >
        Ver post‑mortem
      </RouterLink>
    </div>
  </section>
</template>

