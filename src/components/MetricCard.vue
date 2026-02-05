<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  hint: { type: String, default: '' },
  /**
   * Estado visual:
   * - neutral: sin colorear (default)
   * - good: verde más claro
   * - bad: rojo
   */
  tone: { type: String, default: 'neutral' },
})
</script>

<template>
  <div
    class="rounded-lg border p-4"
    :class="[
      tone === 'bad'
        ? 'border-rose-500/50 bg-rose-500/10'
        : tone === 'good'
          ? 'border-emerald-400/50 bg-emerald-400/10'
          : 'border-zinc-800 bg-zinc-900/40',
    ]"
  >
    <div class="flex items-baseline justify-between gap-3">
      <div
        class="text-xs font-medium"
        :class="tone === 'bad' ? 'text-rose-200' : tone === 'good' ? 'text-emerald-200' : 'text-zinc-300'"
      >
        {{ label }}
      </div>
      <div
        class="text-lg font-semibold tabular-nums"
        :class="tone === 'bad' ? 'text-rose-100' : tone === 'good' ? 'text-emerald-100' : ''"
      >
        {{ value }}
      </div>
    </div>
    <div
      v-if="hint"
      class="mt-1 text-xs"
      :class="tone === 'bad' ? 'text-rose-200/70' : tone === 'good' ? 'text-emerald-200/70' : 'text-zinc-500'"
    >
      {{ hint }}
    </div>
  </div>
</template>

