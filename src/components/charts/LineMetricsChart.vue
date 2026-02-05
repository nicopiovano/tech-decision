<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'

const props = defineProps({
  /**
   * Historial del store: array de snapshots `{ step, metrics, ... }`.
   * Este componente NO conoce Pinia: recibe datos.
   */
  history: { type: Array, required: true },

  /**
   * Qué métricas mostrar. Si no se pasa, se muestran todas las que existan en el primer snapshot.
   */
  metricKeys: { type: Array, default: null },
})

const LABELS = {
  technicalDebt: 'Deuda técnica (↓)',
  velocity: 'Velocidad',
  maintainability: 'Mantenibilidad',
  stability: 'Estabilidad',
  teamMorale: 'Morale',
  timeToMarket: 'Time-to-market (↓)',
}

const COLORS = {
  technicalDebt: '#f97316',
  velocity: '#22c55e',
  maintainability: '#60a5fa',
  stability: '#a78bfa',
  teamMorale: '#f472b6',
  timeToMarket: '#eab308',
}

const keys = computed(() => {
  if (props.metricKeys?.length) return props.metricKeys
  const first = props.history?.[0]?.metrics || {}
  return Object.keys(first)
})

const labels = computed(() => props.history.map((h) => `#${h.step}`))

const chartData = computed(() => ({
  labels: labels.value,
  datasets: keys.value.map((k) => ({
    label: LABELS[k] || k,
    data: props.history.map((h) => Number(h.metrics?.[k] ?? 0)),
    borderColor: COLORS[k] || '#94a3b8',
    backgroundColor: 'transparent',
    tension: 0.35,
    borderWidth: 2,
    pointRadius: 2,
    pointHoverRadius: 5,
  })),
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#cbd5e1', boxWidth: 10, boxHeight: 10 },
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      ticks: { color: '#94a3b8' },
      grid: { color: 'rgba(148,163,184,0.12)' },
    },
    y: {
      min: 0,
      max: 100,
      ticks: { color: '#94a3b8' },
      grid: { color: 'rgba(148,163,184,0.12)' },
    },
  },
}))
</script>

<template>
  <div class="h-72">
    <Line :data="chartData" :options="options" />
  </div>
</template>

