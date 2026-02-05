<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useProjectStore } from '../stores/projectStore'
import { getDecisionById, getDecisionTitle } from '../data/decisionsRepo'

const router = useRouter()
const project = useProjectStore()

if (!project.isInitialized) {
  router.replace('/setup')
}

const phases = computed(() => {
  const counts = project.history.reduce((acc, h) => {
    if (h.decisionId === 'init') return acc
    acc[h.phase] = (acc[h.phase] || 0) + 1
    return acc
  }, {})

  return project.phases.map((p) => ({
    ...p,
    count: counts[p.key] || 0,
    isActive: p.key === project.currentPhaseKey,
  }))
})

const nextDecisionId = computed(() => project.nextDecisionId)
const nextDecisionTitle = computed(() => (nextDecisionId.value ? getDecisionTitle(nextDecisionId.value) : 'Fin'))

const decisions = computed(() =>
  project.decisionsHistory.map((h) => ({
    ...h,
    decisionTitle: getDecisionById(h.decisionId)?.title || h.decisionId,
  })),
)
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">Timeline del proyecto</h1>
      <p class="text-sm text-emerald-100/80">
        Recorré fases y tomá decisiones. Cada elección impacta métricas globales (store) y se guarda en historial
        (charts + post‑mortem).
      </p>
    </header>

    <div class="grid gap-3">
      <div
        v-for="p in phases"
        :key="p.key"
        class="rounded-lg border bg-emerald-900/20 p-4"
        :class="p.isActive ? 'border-emerald-500/60' : 'border-emerald-900'"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-sm font-semibold">{{ p.label }}</div>
            <div class="text-xs text-emerald-200/70">Decisiones tomadas: {{ p.count }}</div>
          </div>
          <div class="text-xs" :class="p.isActive ? 'text-emerald-200' : 'text-emerald-200/60'">
            {{ p.isActive ? 'Fase actual' : '—' }}
          </div>
        </div>
      </div>
    </div>

    <!-- Decisiones tomadas (con opción de editar) -->
    <div v-if="decisions.length > 0" class="rounded-lg border border-emerald-900 bg-emerald-900/20 p-4">
      <div class="flex items-center justify-between gap-3">
        <div class="text-sm font-semibold">Decisiones</div>
        <div class="rounded-full border border-emerald-800 bg-emerald-950/60 px-2 py-0.5 text-xs text-emerald-100/80">
          {{ decisions.length }}
        </div>
      </div>

      <ol class="mt-3 space-y-2 text-sm text-emerald-100/80">
        <li v-for="h in decisions" :key="h.step" class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-xs text-emerald-200/60">#{{ h.step }} · {{ h.phase }} · {{ h.decisionId }}</div>
            <div class="truncate font-medium text-emerald-50">{{ h.decisionTitle }}</div>
            <div class="text-xs text-emerald-200/70">{{ h.optionLabel }}</div>
          </div>

          <RouterLink
            :to="{ path: `/decision/${h.decisionId}`, query: { editStep: String(h.step) } }"
            class="shrink-0 rounded-md border border-emerald-800 px-3 py-1.5 text-xs font-medium text-emerald-50 hover:bg-emerald-900/30"
          >
            Modificar
          </RouterLink>
        </li>
      </ol>
    </div>

    <div class="flex items-center gap-3">
      <template v-if="nextDecisionId">
        <RouterLink
          :to="`/decision/${nextDecisionId}`"
          class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        >
          Siguiente: {{ nextDecisionTitle }}
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink
          to="/post-mortem"
          class="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-emerald-950 hover:bg-emerald-400"
        >
          Ver post‑mortem
        </RouterLink>
      </template>
    </div>
  </section>
</template>

