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
  const highIsBad = key === 'technicalDebt' || key === 'timeToMarket'

  // Umbrales simples (producto): "muy mal" y "muy bien" para destacar extremos.
  // Ajustable más adelante con calibración.
  if (highIsBad) {
    if (v >= 70) return 'bad'
    if (v <= 30) return 'good'
    return 'neutral'
  }

  if (v <= 30) return 'bad'
  if (v >= 70) return 'good'
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
      <p class="text-sm text-emerald-100/80">
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
          class="text-sm text-emerald-50"
        >
          {{ insight }}
        </li>
      </ul>
    </section>

    <!-- Contexto del proyecto -->
    <div class="rounded-lg border border-emerald-900 bg-emerald-900/20 p-4 text-sm text-emerald-100/80">
      <div class="flex flex-wrap items-center gap-3 text-xs text-emerald-200/60">
        <span><span class="text-emerald-200/50">Proyecto:</span> {{ project.projectName }}</span>
        <span>·</span>
        <span><span class="text-emerald-200/50">Equipo:</span> {{ project.teamSize }}</span>
        <span>·</span>
        <span><span class="text-emerald-200/50">Dominio:</span> {{ project.domain }}</span>
      </div>
      <div class="mt-2">
        Tomaste <span class="font-semibold text-emerald-50">{{ decisionCount }}</span> decisiones.
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
      <div class="rounded-lg border border-emerald-900 bg-emerald-900/20 p-4">
        <div class="text-sm font-semibold">Evolución (métricas)</div>
        <div class="mt-3">
          <LineMetricsChart :history="project.history" :metric-keys="project.metricKeys" />
        </div>
      </div>
      <div class="rounded-lg border border-emerald-900 bg-emerald-900/20 p-4">
        <div class="text-sm font-semibold">Salud actual</div>
        <div class="mt-3">
          <RadarHealthChart :metrics="project.metrics" />
        </div>
      </div>
    </div>

    <!-- Timeline de decisiones (solo si hay decisiones reales) -->
    <div v-if="decisionCount > 0" class="rounded-lg border border-emerald-900 bg-emerald-900/20 p-4">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm font-semibold">Decisiones tomadas</div>
        <div class="rounded-full border border-emerald-800 bg-emerald-950/60 px-2 py-0.5 text-xs text-emerald-100/80">
          {{ decisionCount }}
        </div>
      </div>

      <ol class="mt-3 space-y-2 text-sm text-emerald-100/80">
        <li v-for="h in decisionsHistoryEnriched" :key="h.step" class="flex gap-3">
          <div class="w-7 shrink-0 text-right tabular-nums text-emerald-200/60">{{ h.step }}.</div>

          <div>
            <div class="text-xs text-emerald-200/60">{{ h.decisionTitle }}</div>

            <!-- Marca visual de decisiones críticas -->
            <div
              class="font-medium"
              :class="{
                'text-red-400': h.metrics.technicalDebt > 80,
                'text-emerald-50': h.metrics.technicalDebt <= 80,
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
        class="rounded-md border border-emerald-800 px-4 py-2 text-sm font-medium text-emerald-50 hover:bg-emerald-900/30"
      >
        Volver al timeline
      </RouterLink>

      <button
        class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        @click="restart"
      >
        Reiniciar
      </button>
    </div>

  </section>
</template>
