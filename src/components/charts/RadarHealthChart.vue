<script setup>
import { computed } from 'vue'
import { Radar } from 'vue-chartjs'

const props = defineProps({
  /**
   * Métricas actuales del store (0-100).
   * Este componente NO conoce Pinia: recibe datos.
   */
  metrics: { type: Object, required: true },
})

function clamp(v) {
  return Math.max(0, Math.min(100, Number(v) || 0))
}

/**
 * “Salud” busca que alto sea bueno, por eso invertimos las métricas donde alto es malo.
 * - debtHealth = 100 - technicalDebt
 * - ttmHealth  = 100 - timeToMarket (alto = lento)
 */
const health = computed(() => ({
  'Deuda técnica (invertida)': 100 - clamp(props.metrics.technicalDebt),
  Velocidad: clamp(props.metrics.velocity),
  Mantenibilidad: clamp(props.metrics.maintainability),
  Estabilidad: clamp(props.metrics.stability),
  Morale: clamp(props.metrics.teamMorale),
  'Time-to-market (invertido)': 100 - clamp(props.metrics.timeToMarket),
}))

const chartData = computed(() => ({
  labels: Object.keys(health.value),
  datasets: [
    {
      label: 'Salud del proyecto',
      data: Object.values(health.value),
      borderColor: '#60a5fa',
      backgroundColor: 'rgba(96,165,250,0.15)',
      pointBackgroundColor: '#60a5fa',
      borderWidth: 2,
    },
  ],
}))

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { color: '#cbd5e1', boxWidth: 10, boxHeight: 10 },
    },
  },
  scales: {
    r: {
      min: 0,
      max: 100,
      ticks: { display: false },
      grid: { color: 'rgba(148,163,184,0.18)' },
      angleLines: { color: 'rgba(148,163,184,0.18)' },
      pointLabels: { color: '#cbd5e1', font: { size: 11 } },
    },
  },
}))
</script>

<template>
  <div class="h-72">
    <Radar :data="chartData" :options="options" />
  </div>
</template>

