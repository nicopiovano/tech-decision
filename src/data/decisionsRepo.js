import decisionsDb from './decisions.json'

/**
 * Pequeño "repositorio" in-memory para mantener el simulador data-driven.
 * La UI no "conoce" el contenido: solo pide decisions por id.
 */

export function getStartDecisionId() {
  return decisionsDb.startDecisionId
}

export function getAllDecisions() {
  return decisionsDb.decisions
}

export function getDecisionById(id) {
  return decisionsDb.decisions.find((d) => d.id === id) || null
}

export function getOptionById(decision, optionId) {
  if (!decision) return null
  return decision.options.find((o) => o.id === optionId) || null
}

export function getDecisionTitle(id) {
  const d = getDecisionById(id)
  return d ? d.title : id
}

