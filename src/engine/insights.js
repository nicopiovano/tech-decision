export function generateInsights(metrics) {
    const insights = []

    if (metrics.technicalDebt > 80 && metrics.velocity < 40) {
        insights.push(
            'El sistema se ralentizó mucho antes de que el equipo lo reconociera.'
        )
    }

    if (metrics.teamMorale < 30) {
        insights.push(
            'La moral del equipo colapsó silenciosamente, hasta que comenzó a afectar la entrega.'
        )
    }

    if (metrics.stability > 70 && metrics.timeToMarket > 70) {
        insights.push(
            'El sistema era estable, pero el mercado no esperó.'
        )
    }

    if (metrics.velocity > 70 && metrics.maintainability < 40) {
        insights.push(
            'La velocidad a corto plazo creó fragilidad a largo plazo.'
        )
    }

    if (insights.length === 0) {
        insights.push(
            'El proyecto evitó un fracaso catastrófico, pero no sin trade-offs.'
        )
    }

    return insights
}
