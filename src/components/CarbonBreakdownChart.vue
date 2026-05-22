<script setup>
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

Chart.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
})

const canvasRef = ref(null)
let chart = null

const chartItems = computed(() => props.items.filter((item) => Number(item.value) > 0))

function renderChart() {
  if (!canvasRef.value) return

  if (chart) {
    chart.destroy()
  }

  const labels = chartItems.value.map((item) => item.label)
  const values = chartItems.value.map((item) => item.value)
  const colors = chartItems.value.map((item) => item.color)

  chart = new Chart(canvasRef.value, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: '#ffffff',
          borderWidth: 3,
          hoverOffset: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 12,
            boxHeight: 12,
            color: '#334155',
            font: {
              size: 12,
              family: 'system-ui',
            },
          },
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.label}: ${Number(context.raw).toFixed(2)} kg CO2/yil`
            },
          },
        },
      },
      cutout: '62%',
    },
  })
}

onMounted(() => nextTick(renderChart))

watch(
  chartItems,
  () => {
    nextTick(renderChart)
  },
  { deep: true },
)

onBeforeUnmount(() => {
  if (chart) {
    chart.destroy()
  }
})
</script>

<template>
  <div class="chart-card">
    <div v-if="chartItems.length" class="chart-frame">
      <canvas ref="canvasRef" aria-label="CO2 tasarrufu kaynak dagilimi" role="img"></canvas>
    </div>
    <p v-else class="empty-chart">Grafik icin en az bir alana deger gir.</p>
  </div>
</template>

<style scoped>
.chart-card {
  min-height: 260px;
}

.chart-frame {
  height: 260px;
  width: 100%;
}

.empty-chart {
  margin: 0;
  padding: 2rem 1rem;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #64748b;
  text-align: center;
  background: #f8fafc;
}
</style>
