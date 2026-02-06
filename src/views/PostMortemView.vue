<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { generateInsights } from '@/engine/insights'
import { useProjectStore } from '@/stores/projectStore'
import MetricCard from '@/components/MetricCard.vue'
import LineMetricsChart from '@/components/charts/LineMetricsChart.vue'
import RadarHealthChart from '@/components/charts/RadarHealthChart.vue'
import { getDecisionById } from '@/data/decisionsRepo'

const router = useRouter()
const project = useProjectStore()

// Guardia simple: no hay post-mortem sin proyecto
if (!project.isInitialized) {
  router.replace('/setup')
}

/**
 * Frases incómodas finales (magia narrativa)
 */
const insights = computed(() =>
  generateInsights(project.metrics)
)

/**
 * Métricas finales (estado actual)
 */
function toneForMetric(key, value) {
  const v = Number(value ?? 0)
  // - technicalDebt y timeToMarket: valores altos son “buenos” (verde).
  // - el resto de métricas: valores altos son “malos” (rojo).
  const highIsGood = key === 'technicalDebt' || key === 'timeToMarket'

  // Umbrales simples (producto): "muy mal" y "muy bien" para destacar extremos.
  // Ajustable más adelante con calibración.
  if (highIsGood) {
    if (v >= 70) return 'good'
    if (v <= 30) return 'bad'
    return 'neutral'
  }

  if (v >= 70) return 'bad'
  if (v <= 30) return 'good'
  return 'neutral'
}

const metricCards = computed(() => [
  {
    key: 'technicalDebt',
    label: 'Deuda técnica',
    hint: 'Más alto = peor',
    value: project.metrics.technicalDebt,
    tone: toneForMetric('technicalDebt', project.metrics.technicalDebt),
  },
  {
    key: 'velocity',
    label: 'Velocidad',
    hint: 'Capacidad de entrega',
    value: project.metrics.velocity,
    tone: toneForMetric('velocity', project.metrics.velocity),
  },
  {
    key: 'maintainability',
    label: 'Mantenibilidad',
    hint: 'Facilidad de cambio',
    value: project.metrics.maintainability,
    tone: toneForMetric('maintainability', project.metrics.maintainability),
  },
  {
    key: 'stability',
    label: 'Estabilidad',
    hint: 'Fiabilidad en producción',
    value: project.metrics.stability,
    tone: toneForMetric('stability', project.metrics.stability),
  },
  {
    key: 'teamMorale',
    label: 'Moral del equipo',
    hint: 'Energía y motivación',
    value: project.metrics.teamMorale,
    tone: toneForMetric('teamMorale', project.metrics.teamMorale),
  },
  {
    key: 'timeToMarket',
    label: 'Time-to-market',
    hint: 'Más alto = más lento',
    value: project.metrics.timeToMarket,
    tone: toneForMetric('timeToMarket', project.metrics.timeToMarket),
  },
])

/**
 * Historial sin baseline (step 0)
 */
const decisionsHistory = computed(() =>
  project.history.filter(h => h.decisionId !== 'init')
)

const decisionsHistoryEnriched = computed(() =>
  decisionsHistory.value.map((h) => ({
    ...h,
    decisionTitle: getDecisionById(h.decisionId)?.title || h.decisionId,
  })),
)

/**
 * Conteo real de decisiones
 */
const decisionCount = computed(() => decisionsHistory.value.length)

/**
 * Reiniciar simulación
 */
function restart() {
  project.reset()
  router.push('/intro')
}
</script>

<template>
  <section class="space-y-6">

    <!-- Header -->
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">Post-mortem</h1>
      <p class="text-sm text-zinc-300">
        Evaluación final del proyecto: decisiones tomadas, impacto acumulado y consecuencias.
      </p>
    </header>

    <!-- Insights incómodos -->
    <section class="space-y-3">
      <h2 class="text-lg font-semibold">Conclusiones</h2>
      <ul class="space-y-2">
        <li
          v-for="(insight, i) in insights"
          :key="i"
          class="text-sm text-zinc-200"
        >
          {{ insight }}
        </li>
      </ul>
    </section>

    <!-- Contexto del proyecto -->
    <div class="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 text-sm text-zinc-300">
      <div class="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        <span><span class="text-zinc-500">Proyecto:</span> {{ project.projectName }}</span>
        <span>·</span>
        <span><span class="text-zinc-500">Equipo:</span> {{ project.teamSize }}</span>
        <span>·</span>
        <span><span class="text-zinc-500">Dominio:</span> {{ project.domain }}</span>
      </div>
      <div class="mt-2">
        Tomaste <span class="font-semibold text-zinc-100">{{ decisionCount }}</span> decisiones.
      </div>
    </div>

    <!-- Métricas finales -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <MetricCard
        v-for="m in metricCards"
        :key="m.key"
        :label="m.label"
        :value="m.value"
        :hint="m.hint"
        :tone="m.tone"
      />
    </div>

    <!-- Gráficos (mismo lugar donde está toda la data) -->
    <div class="grid gap-3 md:grid-cols-2">
      <div class="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <div class="text-sm font-semibold">Evolución (métricas)</div>
        <div class="mt-3">
          <LineMetricsChart :history="project.history" :metric-keys="project.metricKeys" />
        </div>
      </div>
      <div class="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <div class="text-sm font-semibold">Salud actual</div>
        <div class="mt-3">
          <RadarHealthChart :metrics="project.metrics" />
        </div>
      </div>
    </div>

    <!-- Timeline de decisiones (solo si hay decisiones reales) -->
    <div v-if="decisionCount > 0" class="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm font-semibold">Decisiones tomadas</div>
        <div class="rounded-full border border-zinc-700 bg-zinc-950/60 px-2 py-0.5 text-xs text-zinc-300">
          {{ decisionCount }}
        </div>
      </div>

      <ol class="mt-3 space-y-2 text-sm text-zinc-300">
        <li v-for="h in decisionsHistoryEnriched" :key="h.step" class="flex gap-3">
          <div class="w-7 shrink-0 text-right tabular-nums text-zinc-500">{{ h.step }}.</div>

          <div>
            <div class="text-xs text-zinc-500">{{ h.decisionTitle }}</div>

            <!-- Marca visual de decisiones críticas -->
            <div
              class="font-medium"
              :class="{
                'text-red-400': h.metrics.technicalDebt > 80,
                'text-zinc-100': h.metrics.technicalDebt <= 80,
              }"
            >
              {{ h.optionLabel }}
            </div>
          </div>
        </li>
      </ol>
    </div>

    <!-- Acciones -->
    <div class="flex items-center gap-3">
      <RouterLink
        to="/timeline"
        class="rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-900"
      >
        Volver al timeline
      </RouterLink>

      <button
        class="rounded-md bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
        @click="restart"
      >
        Reiniciar
      </button>
    </div>

  </section>
</template>
