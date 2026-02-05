export function isOptionAvailable(option, metrics) {
    if (!option.availableIf) return true

    return Object.entries(option.availableIf).every(([metric, rule]) => {
        const value = metrics[metric]

        if (rule.lte !== undefined && value > rule.lte) return false
        if (rule.gte !== undefined && value < rule.gte) return false

        return true
    })
}
