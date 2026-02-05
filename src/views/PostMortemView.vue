<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useProjectStore } from '../stores/projectStore'
import MetricCard from '../components/MetricCard.vue'

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

function restart() {
  project.reset()
  router.push('/intro')
}
</script>

<template>
  <section class="space-y-5">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">Post‑mortem</h1>
      <p class="text-sm text-slate-300">
        Resumen final del proyecto: decisiones tomadas, métricas finales, y aprendizaje.
      </p>
    </header>

    <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
      <div class="flex flex-wrap items-center gap-3 text-xs text-slate-400">
        <span><span class="text-slate-500">Proyecto:</span> {{ project.projectName }}</span>
        <span>·</span>
        <span><span class="text-slate-500">Equipo:</span> {{ project.teamSize }}</span>
        <span>·</span>
        <span><span class="text-slate-500">Dominio:</span> {{ project.domain }}</span>
      </div>
      <div class="mt-2">
        Tomaste <span class="font-semibold text-slate-100">{{ project.history.length }}</span> decisiones.
      </div>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard v-for="m in metricCards" :key="m.key" :label="m.label" :value="m.value" :hint="m.hint" />
    </div>

    <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div class="text-sm font-semibold">Decisiones tomadas</div>
      <ol class="mt-3 space-y-2 text-sm text-slate-300">
        <li v-for="h in project.history" :key="h.step" class="flex gap-3">
          <div class="w-7 shrink-0 text-right tabular-nums text-slate-500">{{ h.step }}.</div>
          <div>
            <div class="text-xs text-slate-500">{{ h.phase }} · {{ h.decisionId }}</div>
            <div class="font-medium text-slate-100">{{ h.optionLabel }}</div>
          </div>
        </li>
      </ol>
    </div>

    <div class="flex items-center gap-3">
      <RouterLink
        to="/timeline"
        class="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900"
      >
        Volver a timeline
      </RouterLink>
      <RouterLink
        to="/dashboard"
        class="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900"
      >
        Ver Gráficos
      </RouterLink>

      <button class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400" @click="restart">
        Reiniciar
      </button>
    </div>
  </section>
</template>

