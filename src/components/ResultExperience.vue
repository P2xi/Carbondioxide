<script setup>
import { computed } from 'vue'
import { BRANDING } from '../constants/branding'
import ImpactCharts from './ImpactCharts.vue'
import MetricCard from './MetricCard.vue'

const props = defineProps({
  result: {
    type: Object,
    required: true,
  },
  userName: {
    type: String,
    default: '',
  },
  saveLoading: {
    type: Boolean,
    default: false,
  },
  saveSuccess: {
    type: Boolean,
    default: false,
  },
  saveError: {
    type: String,
    default: '',
  },
})

defineEmits(['save'])

const impactLevel = computed(() => {
  const total = Number(props.result.totalCo2Saved || 0)
  if (total >= 80) return 'Çok yüksek etki'
  if (total >= 45) return 'Yüksek etki'
  if (total >= 18) return 'Gelişen etki'
  return 'Başlangıç etkisi'
})

const cleanerLevel = computed(() => {
  const score = Number(props.result.digitalCleanupScore || 0)
  if (score >= 85) return 'Carbon Guardian'
  if (score >= 65) return 'Dijital Minimalist'
  if (score >= 35) return 'Temizleyici'
  return 'Başlangıç'
})

const badges = computed(() => {
  const result = props.result
  const earned = ['Dijital Temizleyici']

  if (Number(result.totalCo2Saved || 0) >= 25) earned.push('CO2 Avcısı')
  if (Number(result.treeEquivalent || 0) >= 2) earned.push('Ağaç Dostu')
  if (Number(result.digitalCleanupScore || 0) >= 75) earned.push('Minimalist Mod')

  return earned
})

const monthlySaving = computed(() => Number(props.result.totalCo2Saved || 0) / 12)

function impactPercent(value) {
  const total = Number(props.result.totalCo2Saved || 0)
  if (!total) return 0
  return Math.round((Number(value || 0) / total) * 100)
}
</script>

<template>
  <section class="result-experience">
    <div class="result-hero">
      <div>
        <span class="eyebrow">Sonuç ekranı</span>
        <h2>{{ userName ? `${userName}, ${BRANDING.resultTitle}` : BRANDING.resultTitle }}</h2>
        <p>{{ BRANDING.resultDescription }}</p>
      </div>

      <div class="level-panel">
        <span>Temizleyici seviyesi</span>
        <strong>{{ cleanerLevel }}</strong>
        <small>Çevresel etki seviyesi: {{ impactLevel }}</small>
      </div>
    </div>

    <div class="metric-grid">
      <MetricCard
        icon="CO2"
        label="Yıllık CO2 tasarrufu"
        :value="result.totalCo2Saved"
        suffix="kg"
        :digits="2"
      />
      <MetricCard
        icon="TR"
        label="Ağaç eşdeğeri"
        :value="result.treeEquivalent"
        suffix="ağaç"
        :digits="1"
        tone="gold"
      />
      <MetricCard
        icon="%"
        label="Dijital skor"
        :value="result.digitalCleanupScore"
        suffix="/100"
        tone="blue"
      />
    </div>

    <section class="glass-panel gamification">
      <div>
        <span class="eyebrow">Gamification</span>
        <h3>Bu ay {{ monthlySaving.toFixed(2) }} kg CO2 tasarrufu yaptın</h3>
        <p>
          Rozetlerin ve seviyen, düzenli dijital temizlik alışkanlığı oluşturdukça güçlenir.
        </p>
      </div>
      <div class="badge-list">
        <span v-for="badge in badges" :key="badge">{{ badge }}</span>
      </div>
    </section>

    <ImpactCharts :items="result.breakdown" />

    <section class="insight-grid">
      <article class="glass-panel">
        <span class="eyebrow">Haftalık gelişim</span>
        <h3>Öneriler</h3>
        <ul>
          <li v-for="item in result.recommendations" :key="item">{{ item }}</li>
        </ul>
      </article>

      <article class="glass-panel">
        <span class="eyebrow">Kaynak bazlı dağılım</span>
        <h3>Etki yüzdeleri</h3>
        <div class="impact-list">
          <div v-for="item in result.breakdown" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>
              {{ impactPercent(item.value) }}%
            </strong>
          </div>
        </div>
      </article>
    </section>

    <div class="result-actions">
      <button class="primary-button" type="button" :disabled="saveLoading" @click="$emit('save')">
        {{ saveLoading ? 'Kaydediliyor...' : 'Sonuçları kaydet' }}
      </button>
      <RouterLink class="secondary-link" to="/dashboard">Dashboard'a git</RouterLink>
    </div>

    <p v-if="saveSuccess" class="message success">Hesaplama başarıyla kaydedildi.</p>
    <p v-if="saveError" class="message error">{{ saveError }}</p>
  </section>
</template>

<style scoped>
.result-experience {
  display: grid;
  gap: 1.15rem;
}

.result-experience > * {
  animation: resultReveal 620ms cubic-bezier(0.16, 1, 0.3, 1) both;
}

.result-experience > *:nth-child(2) {
  animation-delay: 80ms;
}

.result-experience > *:nth-child(3) {
  animation-delay: 140ms;
}

.result-experience > *:nth-child(4) {
  animation-delay: 200ms;
}

.result-experience > *:nth-child(5) {
  animation-delay: 260ms;
}

@keyframes resultReveal {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.result-hero,
.glass-panel {
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 24px;
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  box-shadow: 0 24px 70px var(--shadow);
  backdrop-filter: blur(18px);
}

.result-hero {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(240px, 0.35fr);
  gap: 1.25rem;
  align-items: center;
  padding: clamp(1.35rem, 4vw, 2rem);
}

.eyebrow {
  color: var(--accent-strong);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h2,
h3,
p {
  margin: 0;
}

h2 {
  margin-top: 0.5rem;
  color: var(--text);
  font-size: clamp(2.15rem, 5vw, 4.4rem);
  line-height: 1;
}

p {
  margin-top: 0.75rem;
  max-width: 680px;
  color: var(--muted);
  line-height: 1.65;
}

.level-panel {
  padding: 1rem;
  border: 1px solid rgba(20, 184, 166, 0.22);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(236, 253, 245, 0.9), rgba(255, 255, 255, 0.78));
}

.level-panel span,
.level-panel small {
  display: block;
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 800;
}

.level-panel strong {
  display: block;
  margin: 0.45rem 0;
  color: var(--text);
  font-size: 1.45rem;
}

.metric-grid,
.insight-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.insight-grid {
  grid-template-columns: 1fr 1fr;
}

.glass-panel {
  padding: 1.2rem;
}

.gamification {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.55rem;
}

.badge-list span {
  padding: 0.55rem 0.75rem;
  border: 1px solid rgba(20, 184, 166, 0.22);
  border-radius: 999px;
  background: #ecfdf5;
  color: #0f766e;
  font-size: 0.82rem;
  font-weight: 900;
}

ul {
  margin: 0.8rem 0 0;
  padding-left: 1.15rem;
  color: var(--muted);
}

li {
  margin-bottom: 0.45rem;
}

.impact-list {
  display: grid;
  gap: 0.75rem;
  margin-top: 0.9rem;
}

.impact-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

.impact-list span {
  color: var(--muted);
  font-weight: 800;
}

.impact-list strong {
  color: var(--text);
}

.result-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  align-items: center;
}

.primary-button,
.secondary-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  min-width: 168px;
  padding: 0 24px;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 0.94rem;
  font-weight: 900;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease,
    border-color 160ms ease;
}

.primary-button {
  color: #ffffff;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  box-shadow:
    0 14px 28px rgba(15, 118, 110, 0.24),
    0 0 0 7px rgba(20, 184, 166, 0.08);
}

.primary-button:hover,
.secondary-link:hover {
  transform: translateY(-2px);
}

.primary-button:active,
.secondary-link:active {
  transform: translateY(-1px) scale(0.98);
}

.primary-button:hover {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  box-shadow:
    0 18px 36px rgba(15, 118, 110, 0.3),
    0 0 0 8px rgba(20, 184, 166, 0.11);
}

.secondary-link {
  color: var(--text);
  border-color: var(--border);
  background: color-mix(in srgb, var(--surface) 72%, transparent);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
}

.secondary-link:hover {
  border-color: rgba(20, 184, 166, 0.22);
  background: color-mix(in srgb, var(--surface) 90%, transparent);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

.message {
  margin: 0;
  font-weight: 800;
}

.success {
  color: #15803d;
}

.error {
  color: #b91c1c;
}

@media (max-width: 900px) {
  .result-hero,
  .gamification {
    grid-template-columns: 1fr;
  }

  .metric-grid,
  .insight-grid {
    grid-template-columns: 1fr;
  }

  .badge-list {
    justify-content: flex-start;
  }
}
</style>
