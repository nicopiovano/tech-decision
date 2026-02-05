<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()

import { getDecisionById } from '../data/decisionsRepo'
import { useProjectStore } from '../stores/projectStore'

const project = useProjectStore()
if (!project.isInitialized) {
  router.replace('/setup')
}

const id = computed(() => String(route.params.id || ''))
const decision = computed(() => getDecisionById(id.value))
const error = ref('')

function choose(optionId) {
  error.value = ''
  try {
    project.applyDecision({ decisionId: id.value, optionId })
    router.push(project.isFinished ? '/post-mortem' : '/timeline')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Error aplicando decisión'
  }
}
</script>

<template>
  <section class="space-y-5">
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">{{ decision?.title || 'Decisión no encontrada' }}</h1>
      <p class="text-sm text-slate-300" v-if="decision">{{ decision.prompt }}</p>
      <p class="text-xs text-slate-500">Decision ID: {{ id }}</p>
    </header>

    <div v-if="error" class="rounded-lg border border-rose-900/50 bg-rose-950/30 p-3 text-sm text-rose-200">
      {{ error }}
    </div>

    <div v-if="!decision" class="space-y-3">
      <p class="text-sm text-slate-300">No existe un JSON para este ID.</p>
      <RouterLink
        to="/timeline"
        class="inline-flex rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-900"
      >
        Volver a timeline
      </RouterLink>
    </div>

    <div v-else class="grid gap-3">
      <button
        v-for="opt in decision.options"
        :key="opt.id"
        class="text-left rounded-lg border border-slate-800 bg-slate-900/40 p-4 hover:border-slate-700"
        @click="choose(opt.id)"
      >
        <div class="text-sm font-semibold">{{ opt.label }}</div>
        <div class="text-xs text-slate-400">{{ opt.description }}</div>
      </button>
    </div>
  </section>
</template>

