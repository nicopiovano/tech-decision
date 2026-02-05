/**
 * Motor del simulador.
 * Responsabilidad: aplicar efectos a métricas y devolver un snapshot.
 *
 * Importante:
 * - No contiene lógica de UI.
 * - No decide navegación ni render.
 * - Es determinístico: mismo input => mismo output.
 */

const METRIC_KEYS = [
    'technicalDebt',
    'velocity',
    'maintainability',
    'stability',
    'teamMorale',
    'timeToMarket',
]

export function getMetricKeys() {
    return [...METRIC_KEYS]
}

export function clampMetric(value) {
    return Math.max(0, Math.min(100, Math.round(value)))
}

export function applyEffects(metrics, effects) {
    const next = { ...metrics }
    for (const key of METRIC_KEYS) {
        const delta = Number(effects?.[key] || 0)
        next[key] = clampMetric(Number(next[key] || 0) + delta)
    }
    return next
}

export function buildHistoryEntry({ step, phase, decisionId, optionId, optionLabel, metrics }) {
    return {
        step,
        phase,
        decisionId,
        optionId,
        optionLabel,
        metrics: { ...metrics },
        at: new Date().toISOString(),
    }
}

