<script setup>
const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div class="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
    <div class="flex items-baseline justify-between gap-3">
      <div class="text-xs font-medium text-slate-300">{{ label }}</div>
      <div class="text-lg font-semibold tabular-nums">{{ value }}</div>
    </div>
    <div v-if="hint" class="mt-1 text-xs text-slate-500">{{ hint }}</div>
  </div>
</template>

