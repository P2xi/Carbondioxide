<script setup>
import { computed } from 'vue'
import { motion } from 'motion-v'
import AnimatedNumber from './AnimatedNumber.vue'

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
})

const metrics = computed(() => [
  {
    label: 'Yıllık tasarruf',
    value: Number(props.result.totalCo2Saved || 0),
    suffix: 'kg CO2',
    tone: 'teal',
    digits: 1,
  },
  {
    label: 'Ağaç eşdeğeri',
    value: Number(props.result.treeEquivalent || 0),
    suffix: 'ağaç',
    tone: 'gold',
    digits: 1,
  },
  {
    label: 'Dijital etki skoru',
    value: Number(props.result.digitalCleanupScore || 0),
    suffix: '/100',
    tone: 'blue',
    digits: 0,
  },
])

const distribution = computed(() => {
  const items = props.result.breakdown || []
  const total = items.reduce((sum, item) => sum + Number(item.value || 0), 0)

  return items.map((item) => ({
    ...item,
    percent: total ? Math.round((Number(item.value || 0) / total) * 100) : 0,
  }))
})

const ringGradient = computed(() => {
  let cursor = 0
  const segments = distribution.value
    .map((item) => {
      const start = cursor
      cursor += item.percent
      return `${item.color} ${start}% ${cursor}%`
    })
    .join(', ')

  return segments || '#e2e8f0 0% 100%'
})
</script>

<template>
  <motion.aside
    class="hero-preview"
    :initial="{ opacity: 0, y: 26, scale: 0.98 }"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :transition="{ duration: 0.72, ease: [0.22, 1, 0.36, 1], delay: 0.12 }"
  >
    <div class="preview-orbit" aria-hidden="true"></div>

    <motion.div
      v-for="(metric, index) in metrics"
      :key="metric.label"
      class="floating-card"
      :class="`tone-${metric.tone}`"
      :initial="{ opacity: 0, y: 18 }"
      :animate="{ opacity: 1, y: [0, -6 - index * 1.5, 0] }"
      :while-hover="{ y: -6, scale: 1.02 }"
      :transition="{
        opacity: { duration: 0.52, delay: 0.18 + index * 0.08, ease: [0.16, 1, 0.3, 1] },
        y: {
          duration: 5.4 + index * 0.7,
          delay: 0.42 + index * 0.18,
          repeat: Infinity,
          ease: 'easeInOut',
        },
      }"
    >
      <span>{{ metric.label }}</span>
      <strong>
        <AnimatedNumber :value="metric.value" :digits="metric.digits" :duration="620" />
      </strong>
      <small>{{ metric.suffix }}</small>
    </motion.div>

    <motion.section
      class="insight-card"
      :initial="{ opacity: 0, y: 22 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.62, delay: 0.38, ease: [0.22, 1, 0.36, 1] }"
    >
      <div class="insight-heading">
        <span>Canlı analiz</span>
        <strong>Kaynak dağılımı</strong>
      </div>
      <div
        class="mini-ring"
        aria-hidden="true"
        :style="{ '--ring-gradient': ringGradient }"
      ></div>
      <div class="distribution">
        <div v-for="item in distribution" :key="item.label">
          <span>{{ item.label }}</span>
          <div>
            <i :style="{ width: `${item.percent}%`, background: item.color }"></i>
          </div>
          <strong>{{ item.percent }}%</strong>
        </div>
      </div>
    </motion.section>
  </motion.aside>
</template>

<style scoped>
.hero-preview {
  position: relative;
  min-height: 520px;
  isolation: isolate;
}

.preview-orbit {
  position: absolute;
  inset: 7% 9% 8% 4%;
  border: 1px solid rgba(15, 118, 110, 0.12);
  border-radius: 36px;
  background:
    radial-gradient(circle at 74% 18%, rgba(250, 204, 21, 0.18), transparent 28%),
    linear-gradient(145deg, var(--surface), var(--surface-soft));
  box-shadow: 0 30px 100px var(--shadow);
  backdrop-filter: blur(24px);
  z-index: -1;
  animation: panelBreath 9s ease-in-out infinite alternate;
}

.floating-card,
.insight-card {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.58);
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  box-shadow: 0 24px 60px var(--shadow);
  backdrop-filter: blur(22px);
}

.floating-card {
  display: grid;
  gap: 0.24rem;
  width: min(220px, 47%);
  padding: 1.08rem;
  border-radius: 24px;
  transition:
    border-color 180ms ease,
    box-shadow 180ms ease;
  will-change: transform;
}

.floating-card:hover,
.insight-card:hover {
  border-color: color-mix(in srgb, var(--accent) 32%, transparent);
  box-shadow: 0 30px 74px var(--shadow);
}

.floating-card:nth-of-type(2) {
  top: 10%;
  left: 4%;
}

.floating-card:nth-of-type(3) {
  top: 2%;
  right: 8%;
}

.floating-card:nth-of-type(4) {
  top: 38%;
  right: 0;
}

.floating-card span,
.floating-card small,
.insight-heading span {
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 850;
}

.floating-card strong {
  color: var(--text);
  font-size: clamp(2rem, 4vw, 2.55rem);
  font-weight: 950;
  line-height: 1;
}

.floating-card small {
  opacity: 0.78;
}

.tone-teal {
  border-color: rgba(20, 184, 166, 0.28);
}

.tone-gold {
  border-color: rgba(250, 204, 21, 0.38);
}

.tone-blue {
  border-color: rgba(37, 99, 235, 0.22);
}

.insight-card {
  left: 8%;
  right: 8%;
  bottom: 6%;
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-radius: 28px;
  transition:
    border-color 200ms ease,
    box-shadow 200ms ease,
    background 200ms ease;
}

@keyframes panelBreath {
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.018);
  }
}

.insight-heading {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.insight-heading strong {
  color: var(--text);
  font-size: 0.94rem;
}

.mini-ring {
  width: 108px;
  aspect-ratio: 1;
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(255, 255, 255, 0.95) 0 48%, transparent 49%),
    conic-gradient(var(--ring-gradient));
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
  transition: background 420ms ease;
}

.distribution {
  display: grid;
  gap: 0.55rem;
}

.distribution div {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) 38px;
  gap: 0.5rem;
  align-items: center;
}

.distribution span,
.distribution strong {
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 850;
}

.distribution div div {
  display: block;
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background: color-mix(in srgb, var(--muted) 18%, transparent);
}

.distribution i {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 520ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 980px) {
  .hero-preview {
    min-height: 430px;
  }
}

@media (max-width: 620px) {
  .hero-preview {
    min-height: 390px;
  }

  .floating-card {
    width: 48%;
  }

  .insight-card {
    left: 0;
    right: 0;
    grid-template-columns: 1fr;
  }

  .mini-ring {
    display: none;
  }
}
</style>
