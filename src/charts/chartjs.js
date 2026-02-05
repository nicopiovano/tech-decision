import { Chart as ChartJS, registerables } from 'chart.js'

/**
 * Registro centralizado de Chart.js.
 * Lo importamos una sola vez en `main.js` para evitar duplicar registros por componente.
 */
ChartJS.register(...registerables)

