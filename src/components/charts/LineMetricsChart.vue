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
  // Paleta con alto contraste sobre fondo oscuro (tema verde), evitando tonos demasiado similares.
  // Intención: deuda/ttm resaltan como “riesgo” (cálidos); el resto va por gama fría/verde.
  technicalDebt: '#fb7185', // rose-400
  velocity: '#34d399', // emerald-400
  maintainability: '#22d3ee', // cyan-400
  stability: '#2dd4bf', // teal-400
  teamMorale: '#a3e635', // lime-400
  timeToMarket: '#fbbf24', // amber-400
}

const STYLES = {
  technicalDebt: { borderDash: [], pointStyle: 'triangle' },
  velocity: { borderDash: [], pointStyle: 'circle' },
  maintainability: { borderDash: [6, 4], pointStyle: 'rectRounded' },
  stability: { borderDash: [2, 3], pointStyle: 'rect' },
  teamMorale: { borderDash: [10, 4], pointStyle: 'star' },
  timeToMarket: { borderDash: [4, 2], pointStyle: 'crossRot' },
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
    borderDash: STYLES[k]?.borderDash || [],
    pointStyle: STYLES[k]?.pointStyle || 'circle',
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

