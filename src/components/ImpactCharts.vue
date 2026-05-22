<script setup>
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

Chart.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const doughnutRef = ref(null)
const barRef = ref(null)
let doughnutChart = null
let barChart = null

const fallbackItems = [
  { label: 'E-posta', value: 35, color: '#0f766e' },
  { label: 'Bulut', value: 25, color: '#14b8a6' },
  { label: 'Medya', value: 30, color: '#facc15' },
  { label: 'Uygulama', value: 10, color: '#2563eb' },
]

const sourceItems = computed(() =>
  props.items.length
    ? props.items.map((item) => ({
        label: item.label,
        value: Number(item.value || 0),
        color: item.color,
      }))
    : fallbackItems,
)

const hasRealData = computed(() => sourceItems.value.some((item) => Number(item.value) > 0))
const chartItems = computed(() => (hasRealData.value ? sourceItems.value : fallbackItems))
const total = computed(() => chartItems.value.reduce((sum, item) => sum + Number(item.value || 0), 0))

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 900,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          color: '#475569',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label(context) {
            const value = Number(context.raw || 0)
            const percent = total.value ? Math.round((value / total.value) * 100) : 0
            return `${context.label}: ${value.toFixed(2)} kg CO2 (${percent}%)`
          },
        },
      },
    },
  }
}

function renderCharts() {
  if (!doughnutRef.value || !barRef.value) return

  doughnutChart?.destroy()
  barChart?.destroy()

  const labels = chartItems.value.map((item) => item.label)
  const values = chartItems.value.map((item) => item.value)
  const colors = chartItems.value.map((item) => item.color)

  doughnutChart = new Chart(doughnutRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 4,
          borderRadius: 8,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      ...chartOptions(),
      cutout: '68%',
      rotation: -90,
    },
  })

  barChart = new Chart(barRef.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: hasRealData.value ? 'kg CO2/yıl' : 'Demo dağılım',
          data: values,
          backgroundColor: colors,
          borderRadius: 14,
          maxBarThickness: 54,
        },
      ],
    },
    options: {
      ...chartOptions(),
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            color: '#64748b',
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(148, 163, 184, 0.18)',
          },
          ticks: {
            color: '#64748b',
          },
        },
      },
      animation: {
        duration: 920,
        easing: 'easeOutQuart',
      },
    },
  })
}

onMounted(() => nextTick(renderCharts))

watch(chartItems, () => nextTick(renderCharts), { deep: true })

onBeforeUnmount(() => {
  doughnutChart?.destroy()
  barChart?.destroy()
})
</script>

<template>
  <div class="charts-grid">
    <section class="chart-panel">
      <div>
        <span>Kaynak dağılımı</span>
        <h3>Doughnut chart</h3>
      </div>
      <div class="chart-frame">
        <canvas ref="doughnutRef" aria-label="Kaynak bazlı etki dağılımı" role="img"></canvas>
      </div>
    </section>

    <section class="chart-panel">
      <div>
        <span>Etki kıyaslaması</span>
        <h3>Bar chart</h3>
      </div>
      <div class="chart-frame">
        <canvas ref="barRef" aria-label="CO2 tasarrufu bar grafiği" role="img"></canvas>
      </div>
    </section>
  </div>
</template>

<style scoped>
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.chart-panel {
  display: grid;
  gap: 1rem;
  min-height: 360px;
  padding: 1.15rem;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 20px;
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  box-shadow: 0 18px 46px var(--shadow);
  backdrop-filter: blur(18px);
  transition:
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 220ms ease,
    box-shadow 220ms ease,
    background 220ms ease;
}

.chart-panel:hover {
  border-color: color-mix(in srgb, var(--accent) 28%, transparent);
  box-shadow: 0 26px 64px var(--shadow);
  transform: translateY(-4px);
}

.chart-panel span {
  color: var(--accent-strong);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chart-panel h3 {
  margin: 0.25rem 0 0;
  color: var(--text);
  font-size: 1rem;
}

.chart-frame {
  position: relative;
  width: 100%;
  height: 260px;
  min-width: 0;
}

.chart-frame canvas {
  animation: chartReveal 760ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes chartReveal {
  from {
    opacity: 0;
    transform: translateY(14px) rotate(-4deg) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg) scale(1);
  }
}

@media (max-width: 860px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
