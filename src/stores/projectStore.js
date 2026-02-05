import { defineStore } from 'pinia'

import { getDecisionById, getOptionById, getStartDecisionId } from '../data/decisionsRepo'
import { applyEffects, buildHistoryEntry, getMetricKeys } from '../engine/decisionEngine'
import { isOptionAvailable } from '../engine/availability'

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

    // Snapshot inicial para poder recalcular historial al editar respuestas.
    baselineMetrics: { ...DEFAULT_METRICS },

    // Historial de snapshots (para charts + post-mortem).
    history: [],

    // Si al recalcular una edición, una decisión posterior queda inválida, forzamos el "siguiente" a revisar.
    overrideNextDecisionId: null,
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
      if (state.overrideNextDecisionId) return state.overrideNextDecisionId
      if (!this.lastDecisionEntry) return getStartDecisionId()

      const lastDecision = getDecisionById(this.lastDecisionEntry.decisionId)
      return lastDecision?.nextDecisionId ?? null
    },
    isFinished() {
      return this.isInitialized && this.nextDecisionId === null
    },
    decisionsHistory(state) {
      // Historial de decisiones reales (sin baseline).
      return state.history.filter((h) => h.decisionId !== 'init')
    },
  },

  actions: {
    reset() {
      this.isInitialized = false
      this.projectName = ''
      this.teamSize = 0
      this.domain = ''
      this.metrics = { ...DEFAULT_METRICS }
      this.baselineMetrics = { ...DEFAULT_METRICS }
      this.history = []
      this.overrideNextDecisionId = null
    },

    initProject({ projectName, teamSize, domain }) {
      this.reset()
      this.isInitialized = true
      this.projectName = projectName
      this.teamSize = teamSize
      this.domain = domain

      this.baselineMetrics = { ...this.metrics }

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

      // Si veníamos de una edición que invalidó el futuro, al tomar una decisión válida seguimos normal.
      this.overrideNextDecisionId = null

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

    /**
     * Editar una decisión ya tomada (por step).
     *
     * Estrategia:
     * - Re-armamos el historial desde baseline para mantener consistencia.
     * - Re-aplicamos decisiones previas y posteriores.
     * - Si una decisión posterior queda inválida (por availableIf), truncamos y forzamos nextDecisionId a esa decisión.
     */
    reviseDecision({ step, decisionId, optionId }) {
      if (!this.isInitialized) {
        throw new Error('Project not initialized. Call initProject() first.')
      }

      const targetStep = Number(step)
      if (!Number.isFinite(targetStep) || targetStep < 1) {
        throw new Error('Invalid step. Must be >= 1.')
      }

      const selections = this.history
        .filter((h) => h.decisionId !== 'init')
        .map((h) => ({ step: h.step, decisionId: h.decisionId, optionId: h.optionId }))
        .sort((a, b) => a.step - b.step)

      const idx = selections.findIndex((s) => s.step === targetStep)
      if (idx === -1) {
        throw new Error(`Cannot revise: step not found (${targetStep}).`)
      }

      // Sanity: el step corresponde al mismo decisionId (evita editar accidentalmente otra cosa).
      if (selections[idx].decisionId !== decisionId) {
        throw new Error(`Step ${targetStep} is ${selections[idx].decisionId}, not ${decisionId}.`)
      }

      selections[idx] = { step: targetStep, decisionId, optionId }

      // Rebuild desde baseline
      let metrics = { ...this.baselineMetrics }
      const nextHistory = [
        buildHistoryEntry({
          step: 0,
          phase: 'setup',
          decisionId: 'init',
          optionId: 'baseline',
          optionLabel: 'Inicio del proyecto',
          metrics,
        }),
      ]

      this.overrideNextDecisionId = null

      for (let i = 0; i < selections.length; i += 1) {
        const sel = selections[i]
        const decision = getDecisionById(sel.decisionId)
        const option = decision ? getOptionById(decision, sel.optionId) : null

        if (!decision || !option) {
          // Si el JSON cambió y ya no existe, cortamos sin romper.
          this.overrideNextDecisionId = sel.decisionId
          break
        }

        // Validación de disponibilidad (reglas data-driven)
        if (!isOptionAvailable(option, metrics)) {
          this.overrideNextDecisionId = sel.decisionId
          break
        }

        metrics = applyEffects(metrics, option.effects)
        nextHistory.push(
          buildHistoryEntry({
            step: nextHistory.length,
            phase: decision.phase,
            decisionId: decision.id,
            optionId: option.id,
            optionLabel: option.label,
            metrics,
          }),
        )
      }

      this.metrics = metrics
      this.history = nextHistory
    },
  },
})

