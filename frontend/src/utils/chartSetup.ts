import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

/**
 * O Chart.js é modular: cada tipo de gráfico/elemento precisa ser
 * registrado explicitamente. Fazemos isso uma única vez aqui (importado
 * no main.ts) em vez de em cada componente, e só registramos o que
 * realmente usamos — o bundle final fica menor do que importando
 * `chart.js/auto`.
 */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)
