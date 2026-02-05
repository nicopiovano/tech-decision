<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

import { useProjectStore } from '../stores/projectStore'
import { getDecisionTitle } from '../data/decisionsRepo'

const router = useRouter()
const project = useProjectStore()

if (!project.isInitialized) {
  router.replace('/setup')
}

const phases = computed(() => {
  const counts = project.history.reduce((acc, h) => {
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
</script>

<template>
  <section class="space-y-6">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">Timeline del proyecto</h1>
      <p class="text-sm text-slate-300">
        Recorré fases y tomá decisiones. Cada elección impacta métricas globales (store) y se guarda en historial
        (charts + post‑mortem).
      </p>
    </header>

    <div class="grid gap-3">
      <div
        v-for="p in phases"
        :key="p.key"
        class="rounded-lg border bg-slate-900/40 p-4"
        :class="p.isActive ? 'border-indigo-500/60' : 'border-slate-800'"
      >
        <div class="flex items-center justify-between gap-3">
          <div>
            <div class="text-sm font-semibold">{{ p.label }}</div>
            <div class="text-xs text-slate-400">Decisiones tomadas: {{ p.count }}</div>
          </div>
          <div class="text-xs" :class="p.isActive ? 'text-indigo-300' : 'text-slate-500'">
            {{ p.isActive ? 'Fase actual' : '—' }}
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <template v-if="nextDecisionId">
        <RouterLink
          :to="`/decision/${nextDecisionId}`"
          class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Siguiente: {{ nextDecisionTitle }}
        </RouterLink>
      </template>
      <template v-else>
        <RouterLink
          to="/post-mortem"
          class="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400"
        >
          Ver post‑mortem
        </RouterLink>
      </template>
      <RouterLink
        to="/dashboard"
        class="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900"
      >
        Ver dashboard
      </RouterLink>
    </div>
  </section>
</template>

