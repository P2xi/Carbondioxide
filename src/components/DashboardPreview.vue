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

const activities = computed(() => [
  {
    title: 'E-posta temizliği',
    value: Number(props.result.spamSavingKg || 0) + Number(props.result.emailSavingKg || 0),
    meta: 'canlı analiz',
  },
  {
    title: 'Bulut optimizasyonu',
    value: Number(props.result.cloudSavingKg || 0),
    meta: 'depolama etkisi',
  },
  {
    title: 'Medya arşivi',
    value: Number(props.result.mediaSavingKg || 0),
    meta: 'haftalık öneri',
  },
])

const trendBars = computed(() => {
  const total = Number(props.result.totalCo2Saved || 0)
  const score = Number(props.result.digitalCleanupScore || 0)
  const base = Math.max(total, 1)
  const multipliers = [0.32, 0.46, 0.42, 0.66, 0.58, Math.max(0.72, score / 100)]

  return multipliers.map((factor) => Math.max(10, Math.min(100, (base * factor * 100) / base)))
})

const scoreLevel = computed(() => {
  const score = Number(props.result.digitalCleanupScore || 0)
  if (score >= 85) return 'Carbon Guardian'
  if (score >= 65) return 'Dijital Minimalist'
  if (score >= 35) return 'Temizleyici'
  return 'Başlangıç'
})

const trendChange = computed(() => {
  const total = Number(props.result.totalCo2Saved || 0)
  return Math.max(0, Math.min(99, Math.round(total / 2)))
})
</script>

<template>
  <motion.section
    class="dashboard-preview"
    :initial="{ opacity: 0, y: 34 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :viewport="{ once: true, amount: 0.28 }"
    :transition="{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }"
  >
    <div class="preview-copy">
      <span>Ürün önizlemesi</span>
      <h2>Analizden sonra çevresel etki panelin otomatik oluşur.</h2>
      <p>
        Geçmiş hesaplamalar, karbon skoru ve en büyük tasarruf alanı tek ekranda takip edilir.
      </p>
    </div>

    <div class="preview-board">
      <motion.article
        class="score-card"
        :while-hover="{ y: -4, scale: 1.01 }"
        :transition="{ duration: 0.24 }"
      >
        <span>Carbon score</span>
        <strong>
          <AnimatedNumber :value="result.digitalCleanupScore" :duration="620" />
        </strong>
        <small>{{ scoreLevel }}</small>
      </motion.article>

      <section class="chart-card">
        <div class="chart-heading">
          <span>Canlı trend</span>
          <strong>+{{ trendChange }}%</strong>
        </div>
        <div class="bars">
          <i v-for="(bar, index) in trendBars" :key="index" :style="{ height: `${bar}%` }"></i>
        </div>
      </section>

      <section class="activity-list">
        <article v-for="activity in activities" :key="activity.title">
          <div>
            <strong>{{ activity.title }}</strong>
            <span>{{ activity.meta }}</span>
          </div>
          <b>
            <AnimatedNumber :value="activity.value" :digits="1" :duration="620" />
            kg
          </b>
        </article>
      </section>
    </div>
  </motion.section>
</template>

<style scoped>
.dashboard-preview {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(480px, 1fr);
  gap: clamp(1rem, 4vw, 2rem);
  align-items: center;
  padding: clamp(1.1rem, 4vw, 1.6rem);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 30px;
  background:
    linear-gradient(135deg, var(--surface), var(--surface-soft)),
    radial-gradient(circle at 90% 0, rgba(20, 184, 166, 0.13), transparent 28rem);
  box-shadow: 0 30px 90px var(--shadow);
  backdrop-filter: blur(22px);
}

.preview-copy span {
  color: var(--accent-strong);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.preview-copy h2 {
  max-width: 580px;
  margin: 0.55rem 0 0;
  color: var(--text);
  font-size: clamp(1.8rem, 4vw, 3.3rem);
  line-height: 0.98;
}

.preview-copy p {
  max-width: 520px;
  margin: 0.85rem 0 0;
  color: var(--muted);
  line-height: 1.7;
}

.preview-board {
  display: grid;
  grid-template-columns: 0.42fr 0.58fr;
  gap: 0.85rem;
}

.score-card,
.chart-card,
.activity-list {
  border: 1px solid rgba(255, 255, 255, 0.62);
  border-radius: 24px;
  background: color-mix(in srgb, var(--surface) 84%, transparent);
  box-shadow: 0 20px 54px var(--shadow);
  backdrop-filter: blur(18px);
  transition:
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 220ms ease,
    box-shadow 220ms ease,
    background 220ms ease;
}

.score-card:hover,
.chart-card:hover,
.activity-list:hover {
  border-color: color-mix(in srgb, var(--accent) 26%, transparent);
  box-shadow: 0 28px 68px var(--shadow);
  transform: translateY(-4px);
}

.score-card {
  display: grid;
  align-content: end;
  min-height: 190px;
  padding: 1rem;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  color: #ffffff;
}

.score-card span,
.score-card small {
  color: rgba(255, 255, 255, 0.78);
  font-weight: 850;
}

.score-card strong {
  font-size: 4rem;
  line-height: 0.9;
}

.chart-card {
  min-height: 190px;
  padding: 1rem;
}

.chart-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: var(--text);
  font-weight: 900;
}

.chart-heading span {
  color: var(--muted);
  font-size: 0.82rem;
}

.bars {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: end;
  gap: 0.5rem;
  height: 128px;
  margin-top: 1rem;
}

.bars i {
  border-radius: 999px 999px 10px 10px;
  background: linear-gradient(180deg, #facc15, #14b8a6 45%, #0f766e);
  box-shadow: 0 12px 20px rgba(15, 118, 110, 0.16);
  transform-origin: bottom;
  animation: barGrow 780ms cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: height 560ms cubic-bezier(0.22, 1, 0.36, 1);
}

.bars i:nth-child(2) {
  animation-delay: 80ms;
}

.bars i:nth-child(3) {
  animation-delay: 140ms;
}

.bars i:nth-child(4) {
  animation-delay: 200ms;
}

.bars i:nth-child(5) {
  animation-delay: 260ms;
}

.bars i:nth-child(6) {
  animation-delay: 320ms;
}

@keyframes barGrow {
  from {
    opacity: 0;
    transform: scaleY(0.18);
  }

  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

.activity-list {
  grid-column: 1 / -1;
  display: grid;
  gap: 0.55rem;
  padding: 0.8rem;
}

.activity-list article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem;
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  transition:
    background-color 160ms ease,
    transform 160ms ease;
}

.activity-list article:hover {
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  transform: translateY(-1px);
}

.activity-list strong,
.activity-list span {
  display: block;
}

.activity-list strong {
  color: var(--text);
}

.activity-list span {
  margin-top: 0.15rem;
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.activity-list b {
  color: #0f766e;
}

@media (max-width: 980px) {
  .dashboard-preview {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .dashboard-preview {
    border-radius: 24px;
  }

  .preview-board {
    grid-template-columns: 1fr;
  }

  .activity-list {
    grid-column: auto;
  }
}
</style>
