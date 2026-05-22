<script setup>
import { computed, onMounted, ref } from 'vue'
import ImpactCharts from '../components/ImpactCharts.vue'
import MetricCard from '../components/MetricCard.vue'
import { BRANDING } from '../constants/branding'
import { calcTreesEquivalent } from '../utils/carbonCalculator'
import { supabase } from '../supabaseClient'

const userName = ref('')
const userEmail = ref('')
const latestResult = ref(null)
const latestSavedAt = ref('')
const calculations = ref([])
const loading = ref(false)
const error = ref('')

onMounted(() => {
  userName.value = localStorage.getItem('cd_name') || ''
  userEmail.value = localStorage.getItem('cd_email') || ''
  latestSavedAt.value = localStorage.getItem('cd_latest_saved_at') || ''

  const storedResult = localStorage.getItem('cd_latest_result')
  if (storedResult) {
    try {
      latestResult.value = JSON.parse(storedResult)
    } catch {
      localStorage.removeItem('cd_latest_result')
    }
  }

  loadHistory()
})

function friendlyError(message) {
  if (!message) return 'Geçmiş hesaplamalar yüklenemedi.'
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Supabase bağlantısı kurulamadı. Dashboard yerel son hesaplamayı gösteriyor.'
  }
  return 'Dashboard verisi alınamadı: ' + message
}

async function loadHistory() {
  if (!userEmail.value) return

  loading.value = true
  error.value = ''

  try {
    const { data, error: fetchError } = await supabase
      .from('calculations')
      .select('*')
      .eq('user_email', userEmail.value)
      .order('created_at', { ascending: false })
      .limit(50)

    if (fetchError) throw fetchError
    calculations.value = data || []
  } catch (fetchError) {
    error.value = friendlyError(fetchError.message)
  } finally {
    loading.value = false
  }
}

function formatDate(isoString) {
  if (!isoString) return 'Henüz kayıt yok'
  return new Date(isoString).toLocaleString('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function formatMetric(value, digits = 2) {
  return Number(value || 0).toFixed(digits)
}

const totalSaving = computed(() => {
  if (calculations.value.length) {
    return calculations.value.reduce((sum, item) => sum + Number(item.total_co2_saved || 0), 0)
  }

  return Number(latestResult.value?.totalCo2Saved || 0)
})

const monthlySaving = computed(() => totalSaving.value / 12)
const totalTrees = computed(() => calcTreesEquivalent(totalSaving.value))

const biggestArea = computed(() => {
  const items = latestResult.value?.breakdown || []
  if (!items.length) return null

  return items.reduce((best, item) => (Number(item.value || 0) > Number(best.value || 0) ? item : best))
})

const trendItems = computed(() => {
  const source = calculations.value.length
    ? calculations.value.slice(0, 6).reverse()
    : latestResult.value
      ? [{ total_co2_saved: latestResult.value.totalCo2Saved, created_at: latestSavedAt.value }]
      : []

  const max = Math.max(...source.map((item) => Number(item.total_co2_saved || 0)), 1)

  return source.map((item) => ({
    label: item.created_at
      ? new Date(item.created_at).toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' })
      : 'Son',
    value: Number(item.total_co2_saved || 0),
    height: Math.max(8, (Number(item.total_co2_saved || 0) / max) * 100),
  }))
})

const recentCalculations = computed(() => calculations.value.slice(0, 5))
</script>

<template>
  <main class="dashboard-page">
    <section class="dashboard-hero">
      <div>
        <span class="eyebrow">Dashboard</span>
        <h1>{{ BRANDING.dashboardTitle }}</h1>
        <p>{{ BRANDING.dashboardDescription }}</p>
      </div>
      <RouterLink class="primary-link" to="/">Yeni hesaplama</RouterLink>
    </section>

    <section v-if="latestResult" class="metric-grid">
      <MetricCard
        icon="CO2"
        label="Toplam tasarruf"
        :value="totalSaving"
        suffix="kg"
        :digits="2"
      />
      <MetricCard
        icon="TR"
        label="Ağaç eşdeğeri"
        :value="totalTrees"
        suffix="ağaç"
        :digits="1"
        tone="gold"
      />
      <MetricCard
        icon="%"
        label="Son dijital skor"
        :value="latestResult.digitalCleanupScore"
        suffix="/100"
        tone="blue"
      />
    </section>

    <section v-if="latestResult" class="dashboard-grid">
      <article class="glass-panel trend-panel">
        <div class="panel-heading">
          <span class="eyebrow">Aylık trend</span>
          <h2>{{ monthlySaving.toFixed(2) }} kg CO2 / ay</h2>
        </div>
        <div class="trend-bars">
          <div v-for="item in trendItems" :key="`${item.label}-${item.value}`">
            <span class="bar" :style="{ height: `${item.height}%` }"></span>
            <small>{{ item.label }}</small>
          </div>
        </div>
      </article>

      <article class="glass-panel insight-panel">
        <span class="eyebrow">Özet</span>
        <h2>{{ biggestArea?.label || 'Veri yok' }}</h2>
        <p>En büyük tasarruf alanı</p>
        <dl>
          <div>
            <dt>Son temizlik tarihi</dt>
            <dd>{{ formatDate(latestSavedAt || recentCalculations[0]?.created_at) }}</dd>
          </div>
          <div>
            <dt>Bu ay tasarruf</dt>
            <dd>{{ monthlySaving.toFixed(2) }} kg CO2</dd>
          </div>
          <div>
            <dt>Kayıt sayısı</dt>
            <dd>{{ calculations.length || (latestResult ? 1 : 0) }}</dd>
          </div>
        </dl>
      </article>
    </section>

    <ImpactCharts v-if="latestResult" :items="latestResult.breakdown" />

    <section class="glass-panel history-panel">
      <div class="panel-heading">
        <div>
          <span class="eyebrow">Son hesaplamalar</span>
          <h2>Geçmiş</h2>
        </div>
        <button type="button" :disabled="loading" @click="loadHistory">
          {{ loading ? 'Yükleniyor...' : 'Yenile' }}
        </button>
      </div>

      <p v-if="error" class="message error">{{ error }}</p>

      <div v-if="recentCalculations.length" class="history-list">
        <article v-for="calc in recentCalculations" :key="calc.id" class="history-item">
          <div>
            <strong>{{ formatMetric(calc.total_co2_saved) }} kg CO2</strong>
            <span>{{ formatDate(calc.created_at) }}</span>
          </div>
          <div>
            <strong>{{ formatMetric(calc.tree_equivalent, 1) }}</strong>
            <span>ağaç</span>
          </div>
        </article>
      </div>

      <p v-else class="empty-state">
        Kayıtlı hesaplama bulunamadı. İlk sonucu oluşturduğunda dashboard otomatik dolacak.
      </p>
    </section>
  </main>
</template>

<style scoped>
.dashboard-page {
  display: grid;
  gap: 1.35rem;
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: clamp(0.9rem, 3vw, 1.5rem);
}

.dashboard-hero,
.glass-panel {
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 26px;
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  box-shadow: 0 28px 80px var(--shadow);
  backdrop-filter: blur(20px);
}

.dashboard-hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  padding: clamp(1.6rem, 5vw, 3rem);
}

.dashboard-hero::after {
  position: absolute;
  inset: auto 5% -38% auto;
  width: 360px;
  height: 360px;
  border-radius: 999px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.18), transparent 64%);
  filter: blur(18px);
  content: '';
}

.eyebrow {
  color: var(--accent-strong);
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1,
h2,
p {
  margin: 0;
}

h1 {
  max-width: 820px;
  margin-top: 0.55rem;
  color: var(--text);
  font-size: clamp(2.7rem, 7vw, 5.8rem);
  font-weight: 950;
  line-height: 0.92;
}

h2 {
  color: var(--text);
  font-size: clamp(1.4rem, 3vw, 2rem);
}

p {
  max-width: 620px;
  margin-top: 1rem;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.65;
}

.primary-link,
button {
  display: inline-grid;
  place-items: center;
  min-height: 46px;
  padding: 0.76rem 1.18rem;
  border: 1px solid transparent;
  border-radius: 999px;
  color: #ffffff;
  background: linear-gradient(135deg, var(--accent-strong), var(--accent));
  box-shadow:
    0 14px 28px rgba(15, 118, 110, 0.24),
    0 0 0 7px rgba(20, 184, 166, 0.08);
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  line-height: 1;
  text-decoration: none;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease,
    border-color 160ms ease;
}

.primary-link:hover,
button:hover {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  box-shadow:
    0 18px 36px rgba(15, 118, 110, 0.3),
    0 0 0 8px rgba(20, 184, 166, 0.11);
  transform: translateY(-2px);
}

.metric-grid,
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.dashboard-grid {
  grid-template-columns: minmax(0, 1fr) minmax(320px, 0.42fr);
}

.glass-panel {
  padding: 1.2rem;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.glass-panel:hover {
  border-color: rgba(20, 184, 166, 0.24);
  box-shadow: 0 34px 86px rgba(15, 23, 42, 0.12);
  transform: translateY(-2px);
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.trend-bars {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  align-items: end;
  gap: 0.75rem;
  height: 220px;
  margin-top: 1.5rem;
  padding-top: 1rem;
}

.trend-bars div {
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 0.55rem;
  height: 100%;
  text-align: center;
}

.bar {
  align-self: end;
  min-height: 8px;
  border-radius: 999px 999px 10px 10px;
  background: linear-gradient(180deg, #14b8a6, #0f766e);
  box-shadow: 0 12px 24px rgba(15, 118, 110, 0.18);
}

.trend-bars small {
  color: var(--muted);
  font-weight: 800;
}

.insight-panel dl {
  display: grid;
  gap: 0.8rem;
  margin: 1rem 0 0;
}

.insight-panel div,
.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(148, 163, 184, 0.18);
}

dt,
.history-item span {
  color: var(--muted);
  font-size: 0.85rem;
  font-weight: 800;
}

dd {
  margin: 0;
  color: var(--text);
  font-weight: 900;
  text-align: right;
}

.history-list {
  display: grid;
  gap: 0.8rem;
  margin-top: 1rem;
}

.history-item {
  padding: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 18px;
  background: color-mix(in srgb, var(--surface) 78%, transparent);
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.history-item strong,
.history-item span {
  display: block;
}

.message,
.empty-state {
  margin: 1rem 0 0;
  font-weight: 800;
}

.error {
  color: #b91c1c;
}

.empty-state {
  color: var(--muted);
}

@media (max-width: 900px) {
  .dashboard-hero,
  .panel-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .metric-grid,
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .trend-bars {
    gap: 0.45rem;
  }

  .history-item,
  .insight-panel div {
    align-items: flex-start;
    flex-direction: column;
  }

  dd {
    text-align: left;
  }
}
</style>
