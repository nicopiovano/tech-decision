import { defineStore } from 'pinia'

import { getDecisionById, getOptionById, getStartDecisionId } from '../data/decisionsRepo'
import { applyEffects, buildHistoryEntry, getMetricKeys } from '../engine/decisionEngine'

const DEFAULT_METRICS = {
  technicalDebt: 35,
  velocity: 55,
  maintainability: 55,
  stability: 55,
  teamMorale: 65,
  timeToMarket: 50,
}

const PHASES = [
  { key: 'setup', label: 'Setup' },
  { key: 'mvp', label: 'MVP' },
  { key: 'growth', label: 'Growth' },
  { key: 'scale', label: 'Scale' },
  { key: 'crisis', label: 'Crisis' },
]

/**
 * Store central del producto.
 * - Una sola fuente de verdad para métricas + historial.
 * - La UI consulta/comanda aquí.
 * - El motor (engine) aplica efectos de decisiones sin saber nada de UI.
 */
export const useProjectStore = defineStore('project', {
  state: () => ({
    isInitialized: false,

    // Contexto del "proyecto simulado"
    projectName: '',
    teamSize: 0,
    domain: '',

    // Métricas actuales (0-100). Interpretación:
    // - technicalDebt: más alto = peor.
    // - timeToMarket: más alto = más lento (peor).
    metrics: { ...DEFAULT_METRICS },

    // Historial de snapshots (para charts + post-mortem).
    history: [],
  }),

  getters: {
    phases() {
      return PHASES
    },
    metricKeys() {
      return getMetricKeys()
    },
    lastDecisionEntry(state) {
      // El primer snapshot puede ser baseline (decisionId: 'init').
      for (let i = state.history.length - 1; i >= 0; i -= 1) {
        const h = state.history[i]
        if (h.decisionId !== 'init') return h
      }
      return null
    },
    currentPhaseKey() {
      return this.lastDecisionEntry?.phase || 'setup'
    },
    nextDecisionId(state) {
      if (!state.isInitialized) return null
      if (!this.lastDecisionEntry) return getStartDecisionId()

      const lastDecision = getDecisionById(this.lastDecisionEntry.decisionId)
      return lastDecision?.nextDecisionId ?? null
    },
    isFinished() {
      return this.isInitialized && this.nextDecisionId === null
    },
  },

  actions: {
    reset() {
      this.isInitialized = false
      this.projectName = ''
      this.teamSize = 0
      this.domain = ''
      this.metrics = { ...DEFAULT_METRICS }
      this.history = []
    },

    initProject({ projectName, teamSize, domain }) {
      this.reset()
      this.isInitialized = true
      this.projectName = projectName
      this.teamSize = teamSize
      this.domain = domain

      // Baseline para charts (step 0): estado inicial antes de decidir.
      this.history = [
        buildHistoryEntry({
          step: 0,
          phase: 'setup',
          decisionId: 'init',
          optionId: 'baseline',
          optionLabel: 'Inicio del proyecto',
          metrics: this.metrics,
        }),
      ]
    },

    /**
     * Aplica una opción de una decisión:
     * - busca decision/option en JSON
     * - aplica efectos con el engine
     * - agrega snapshot a history
     */
    applyDecision({ decisionId, optionId }) {
      if (!this.isInitialized) {
        throw new Error('Project not initialized. Call initProject() first.')
      }

      const decision = getDecisionById(decisionId)
      if (!decision) {
        throw new Error(`Decision not found: ${decisionId}`)
      }

      const option = getOptionById(decision, optionId)
      if (!option) {
        throw new Error(`Option not found: ${decisionId} / ${optionId}`)
      }

      const nextMetrics = applyEffects(this.metrics, option.effects)
      this.metrics = nextMetrics

      const step = this.history.length // baseline es step 0, primera decisión => 1
      this.history.push(
        buildHistoryEntry({
          step,
          phase: decision.phase,
          decisionId: decision.id,
          optionId: option.id,
          optionLabel: option.label,
          metrics: nextMetrics,
        }),
      )
    },
  },
})

