<script setup>
import { computed, onMounted, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { getDecisionById } from '@/data/decisionsRepo'
import { isOptionAvailable } from '@/engine/availability'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()
const error = ref('')

/* ─────────────────────────────
   Edit mode (from timeline)
───────────────────────────── */
const editStep = computed(() => {
  const raw = route.query.editStep
  if (raw === undefined || raw === null || raw === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
})

const isEditMode = computed(() => editStep.value !== null)

/* ─────────────────────────────
   Guards
───────────────────────────── */
onMounted(() => {
  if (!projectStore.isInitialized) {
    router.replace('/setup')
  }
})

// Si el usuario vuelve hacia atrás con el navegador, evitamos que pueda "re-contestar" decisiones.
watchEffect(() => {
  if (!projectStore.isInitialized) return
  if (isEditMode.value) return

  if (projectStore.isFinished) {
    router.replace('/post-mortem')
    return
  }

  const expected = projectStore.nextDecisionId
  const current = String(route.params.id || '')
  if (expected && current !== expected) {
    router.replace(`/decision/${expected}`)
  }
})

/* ─────────────────────────────
   Decision
───────────────────────────── */
const decision = computed(() =>
  getDecisionById(route.params.id)
)

const currentSelectionId = computed(() => {
  if (!isEditMode.value) return null
  const entry = projectStore.history.find((h) => h.step === editStep.value)
  return entry?.optionId || null
})

const metricsBeforeDecision = computed(() => {
  if (!isEditMode.value) return projectStore.metrics
  const prev = projectStore.history.find((h) => h.step === editStep.value - 1)
  return prev?.metrics || projectStore.baselineMetrics
})

/* ─────────────────────────────
   Available options (real logic)
───────────────────────────── */
const availableOptions = computed(() => {
  if (!decision.value) return []
  return decision.value.options.filter(opt =>
    isOptionAvailable(opt, metricsBeforeDecision.value)
  )
})

/* ─────────────────────────────
   Actions
───────────────────────────── */
function selectOption(optionId) {
  error.value = ''
  if (isEditMode.value) {
    projectStore.reviseDecision({
      step: editStep.value,
      decisionId: decision.value.id,
      optionId,
    })
    router.push('/timeline')
    return
  }

  try {
    projectStore.applyDecision({ decisionId: decision.value.id, optionId })
    if (projectStore.isFinished) router.push('/post-mortem')
    else router.push(`/decision/${projectStore.nextDecisionId}`)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'No se pudo aplicar la decisión.'
  }
}
</script>

<template>
  <section class="space-y-5">
    <!-- Header -->
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        {{ decision?.title || 'Decisión no encontrada' }}
      </h1>
      <p v-if="decision" class="text-sm text-zinc-300">
        {{ decision.prompt }}
      </p>
      <p class="text-xs text-zinc-500">
        Decision ID: {{ route.params.id }}
      </p>
      <p v-if="isEditMode" class="text-xs text-zinc-300">
        Editando respuesta del paso #{{ editStep }} (se recalcula el historial).
      </p>
    </header>

    <div
      v-if="error"
      class="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200"
    >
      {{ error }}
    </div>

    <!-- Decision missing -->
    <div v-if="!decision" class="space-y-3">
      <p class="text-sm text-zinc-300">
        No existe un JSON para este ID.
      </p>
      <RouterLink
        to="/timeline"
        class="inline-flex rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-900"
      >
        Volver a timeline
      </RouterLink>
    </div>

    <!-- Options -->
    <div v-else class="grid gap-3">
      <button
        v-for="opt in availableOptions"
        :key="opt.id"
        class="text-left rounded-lg border bg-zinc-900/40 p-4 transition hover:bg-zinc-900"
        :class="[
          opt.id === currentSelectionId ? 'border-zinc-500/70' : 'border-zinc-800 hover:border-zinc-600',
        ]"
        @click="selectOption(opt.id)"
      >
        <div class="text-sm font-semibold">
          {{ opt.label }}
        </div>
        <div class="text-xs text-zinc-400">
          {{ opt.description }}
        </div>
      </button>

      <!-- UX magic -->
      <p
        v-if="availableOptions.length === 0"
        class="text-sm text-zinc-400 italic"
      >
        No hay opciones disponibles con el estado actual del proyecto.
        Cada decisión previa pesa.
      </p>
    </div>
  </section>
</template>
