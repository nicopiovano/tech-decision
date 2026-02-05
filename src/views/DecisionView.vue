<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'
import { getDecisionById } from '@/data/decisionsRepo'
import { isOptionAvailable } from '@/engine/availability'

const route = useRoute()
const router = useRouter()
const projectStore = useProjectStore()

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
  if (isEditMode.value) {
    projectStore.reviseDecision({
      step: editStep.value,
      decisionId: decision.value.id,
      optionId,
    })
    router.push('/timeline')
    return
  }

  projectStore.applyDecision({ decisionId: decision.value.id, optionId })

  if (projectStore.isFinished) router.push('/post-mortem')
  else router.push(`/decision/${projectStore.nextDecisionId}`)
}
</script>

<template>
  <section class="space-y-5">
    <!-- Header -->
    <header class="space-y-2">
      <h1 class="text-xl font-semibold">
        {{ decision?.title || 'Decisión no encontrada' }}
      </h1>
      <p v-if="decision" class="text-sm text-emerald-100/80">
        {{ decision.prompt }}
      </p>
      <p class="text-xs text-emerald-200/60">
        Decision ID: {{ route.params.id }}
      </p>
      <p v-if="isEditMode" class="text-xs text-emerald-200">
        Editando respuesta del paso #{{ editStep }} (se recalcula el historial).
      </p>
    </header>

    <!-- Decision missing -->
    <div v-if="!decision" class="space-y-3">
      <p class="text-sm text-emerald-100/80">
        No existe un JSON para este ID.
      </p>
      <RouterLink
        to="/timeline"
        class="inline-flex rounded-md border border-emerald-800 px-4 py-2 text-sm font-medium text-emerald-50 hover:bg-emerald-900/30"
      >
        Volver a timeline
      </RouterLink>
    </div>

    <!-- Options -->
    <div v-else class="grid gap-3">
      <button
        v-for="opt in availableOptions"
        :key="opt.id"
        class="text-left rounded-lg border bg-emerald-900/20 p-4 transition hover:bg-emerald-900/30"
        :class="[
          opt.id === currentSelectionId ? 'border-emerald-500/70' : 'border-emerald-900 hover:border-emerald-800',
        ]"
        @click="selectOption(opt.id)"
      >
        <div class="text-sm font-semibold">
          {{ opt.label }}
        </div>
        <div class="text-xs text-emerald-200/70">
          {{ opt.description }}
        </div>
      </button>

      <!-- UX magic -->
      <p
        v-if="availableOptions.length === 0"
        class="text-sm text-emerald-200/60 italic"
      >
        No hay opciones disponibles con el estado actual del proyecto.
        Cada decisión previa pesa.
      </p>
    </div>
  </section>
</template>
