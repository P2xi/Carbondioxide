<script setup>
import { computed, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import { BRANDING } from '../constants/branding'
import { CALCULATION_ASSUMPTIONS } from '../constants/carbonFactors'
import { calculateDigitalCarbonSavings } from '../utils/carbonCalculator'
import { supabase } from '../supabaseClient'
import DashboardPreview from './DashboardPreview.vue'
import HeroStatsPreview from './HeroStatsPreview.vue'
import ResultExperience from './ResultExperience.vue'
import StepProgress from './StepProgress.vue'

const emit = defineEmits(['account-updated'])

const steps = [
  { title: 'Kullanıcı', kicker: 'Adım 1', heading: 'Profilini hazırlayalım.' },
  { title: 'E-posta', kicker: 'Adım 2', heading: 'E-posta temizliği etkini hesapla.' },
  { title: 'Bulut', kicker: 'Adım 3', heading: 'Bulut depolama alanını netleştir.' },
  { title: 'Medya', kicker: 'Adım 4', heading: 'Medya arşivindeki yükü azalt.' },
  { title: 'Sonuç', kicker: 'Adım 5', heading: 'Çevresel etkin hazır.' },
]

const currentStep = ref(0)
const direction = ref('forward')
const saveLoading = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')
const validationError = ref('')
const wizardCardRef = ref(null)

const accountName = ref('')
const accountEmail = ref('')

const form = ref({
  spamDaily: 0,
  emailMonthly: 0,
  cloudGb: 0,
  mediaGb: 0,
  appCleanupGb: 0,
  weeklyCleanup: true,
})

const result = computed(() => calculateDigitalCarbonSavings(form.value))
const activeStep = computed(() => steps[currentStep.value])
const heroTitleParts = computed(() => {
  const title = BRANDING.heroTitle.toLocaleUpperCase('tr-TR')
  return {
    before: title.replace('ANALİZİ', '').trim(),
    highlight: 'ANALİZİ',
  }
})

onMounted(() => {
  accountName.value = localStorage.getItem('cd_name') || ''
  accountEmail.value = localStorage.getItem('cd_email') || ''

  const storedInput = localStorage.getItem('cd_latest_input')
  if (storedInput) {
    try {
      form.value = { ...form.value, ...JSON.parse(storedInput) }
    } catch {
      localStorage.removeItem('cd_latest_input')
    }
  }
})

function friendlyError(message) {
  if (!message) return 'Beklenmeyen bir bağlantı sorunu oluştu. Lütfen tekrar dene.'
  if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
    return 'Supabase bağlantısı kurulamadı. İnternet bağlantını ve proje ayarlarını kontrol et.'
  }
  if (message.includes('calculations')) {
    return 'Veritabanı tablosu hazır görünmüyor. Migration dosyasını Supabase SQL editörde çalıştır.'
  }
  return 'İşlem tamamlanamadı: ' + message
}

function persistAccount() {
  localStorage.setItem('cd_email', accountEmail.value.trim())
  localStorage.setItem('cd_name', accountName.value.trim())
  emit('account-updated', {
    name: accountName.value.trim(),
    email: accountEmail.value.trim(),
  })
}

function persistLatest() {
  localStorage.setItem('cd_latest_input', JSON.stringify(form.value))
  localStorage.setItem('cd_latest_result', JSON.stringify(result.value))
  localStorage.setItem('cd_latest_saved_at', new Date().toISOString())
}

function validateStep() {
  validationError.value = ''

  if (currentStep.value === 0) {
    const email = accountEmail.value.trim()
    if (!email || !email.includes('@')) {
      validationError.value = 'Lütfen geçerli bir e-posta adresi gir.'
      return false
    }
    persistAccount()
  }

  return true
}

function goNext() {
  if (!validateStep()) return
  if (currentStep.value >= steps.length - 1) return

  direction.value = 'forward'
  currentStep.value += 1

  if (currentStep.value === steps.length - 1) {
    persistLatest()
  }
}

function goBack() {
  if (currentStep.value <= 0) return
  direction.value = 'back'
  currentStep.value -= 1
}

function updateNumber(key, value) {
  form.value[key] = Number(value || 0)
}

function startAnalysis() {
  currentStep.value = 0
  const target = wizardCardRef.value?.$el || wizardCardRef.value
  target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function saveCalculation() {
  saveLoading.value = true
  saveSuccess.value = false
  saveError.value = ''
  persistAccount()
  persistLatest()

  try {
    const { error } = await supabase.from('calculations').insert({
      user_email: accountEmail.value.trim(),
      user_name: accountName.value.trim() || null,
      spam_daily: Number(form.value.spamDaily || 0),
      email_monthly: Number(form.value.emailMonthly || 0),
      cloud_gb: Number(form.value.cloudGb || 0),
      media_gb: Number(form.value.mediaGb || 0),
      app_cleanup_gb: Number(form.value.appCleanupGb || 0),
      total_co2_saved: result.value.totalCo2Saved,
      tree_equivalent: result.value.treeEquivalent,
      digital_cleanup_score: result.value.digitalCleanupScore,
    })

    if (error) throw error

    saveSuccess.value = true
    localStorage.setItem('cd_latest_saved_at', new Date().toISOString())
  } catch (error) {
    saveError.value = friendlyError(error.message)
  } finally {
    saveLoading.value = false
  }
}
</script>

<template>
  <section class="wizard-shell">
    <div class="wizard-header">
      <div class="hero-copy">
        <motion.span
          class="eyebrow"
          :initial="{ opacity: 0, y: 18 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.64, delay: 0.04, ease: [0.16, 1, 0.3, 1] }"
        >
          {{ BRANDING.heroEyebrow }}
        </motion.span>
        <motion.h1
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.78, delay: 0.12, ease: [0.16, 1, 0.3, 1] }"
        >
          {{ heroTitleParts.before }}
          <span class="title-highlight">{{ heroTitleParts.highlight }}</span>
        </motion.h1>
        <motion.p
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.68, delay: 0.22, ease: [0.16, 1, 0.3, 1] }"
        >
          {{ BRANDING.tagline }}
        </motion.p>
        <motion.div
          class="hero-actions"
          :initial="{ opacity: 0, y: 18 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.68, delay: 0.32, ease: [0.16, 1, 0.3, 1] }"
        >
          <span class="hero-chip">
            <span class="chip-full">{{ BRANDING.projectChip }}</span>
            <span class="chip-short">Görünmeyen Çöp</span>
          </span>
          <button class="hero-cta-button primary" type="button" @click="startAnalysis">
            Analize Başla
          </button>
          <RouterLink class="hero-cta-button secondary" to="/dashboard">Dashboard</RouterLink>
        </motion.div>
      </div>
      <HeroStatsPreview :result="result" />
    </div>

    <DashboardPreview :result="result" />

    <motion.div
      ref="wizardCardRef"
      class="wizard-card"
      :initial="{ opacity: 0, y: 32 }"
      :while-in-view="{ opacity: 1, y: 0 }"
      :viewport="{ once: true, amount: 0.2 }"
      :transition="{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }"
    >
      <StepProgress :steps="steps" :current-step="currentStep" />

      <Transition :name="direction === 'forward' ? 'step-forward' : 'step-back'" mode="out-in">
        <section :key="currentStep" class="step-panel">
          <template v-if="currentStep < 4">
            <div class="step-copy">
              <span class="eyebrow">{{ activeStep.kicker }}</span>
              <h2>{{ activeStep.heading }}</h2>
            </div>

            <div v-if="currentStep === 0" class="field-stack">
              <label>
                Adın
                <input v-model="accountName" type="text" placeholder="Ad Soyad" autocomplete="name" />
              </label>
              <label>
                E-posta adresin
                <input
                  v-model="accountEmail"
                  type="email"
                  placeholder="ornek@mail.com"
                  autocomplete="email"
                />
              </label>
            </div>

            <div v-else-if="currentStep === 1" class="step-fields-grid">
              <label class="field-group">
                Günlük silinen spam e-posta
                <input
                  :value="form.spamDaily"
                  type="number"
                  min="0"
                  step="1"
                  @input="updateNumber('spamDaily', $event.target.value)"
                />
              </label>
              <label class="field-group">
                Aylık temizlenen gereksiz e-posta
                <input
                  :value="form.emailMonthly"
                  type="number"
                  min="0"
                  step="1"
                  @input="updateNumber('emailMonthly', $event.target.value)"
                />
              </label>
            </div>

            <div v-else-if="currentStep === 2" class="field-stack">
              <label>
                Silinen bulut dosyası boyutu (GB)
                <input
                  :value="form.cloudGb"
                  type="number"
                  min="0"
                  step="0.1"
                  @input="updateNumber('cloudGb', $event.target.value)"
                />
              </label>
              <div class="assumption-box">
                1 GB bulut depolama alanı yılda yaklaşık 2 kg CO2 ile ilişkilendirilir.
              </div>
            </div>

            <div v-else class="field-grid">
              <label>
                Temizlenen video-fotoğraf arşivi (GB)
                <input
                  :value="form.mediaGb"
                  type="number"
                  min="0"
                  step="0.1"
                  @input="updateNumber('mediaGb', $event.target.value)"
                />
              </label>
              <label>
                Gereksiz uygulama/veri temizliği (GB)
                <input
                  :value="form.appCleanupGb"
                  type="number"
                  min="0"
                  step="0.1"
                  @input="updateNumber('appCleanupGb', $event.target.value)"
                />
              </label>
              <label class="toggle-field">
                <input v-model="form.weeklyCleanup" type="checkbox" />
                <span>Haftalık dijital temizlik alışkanlığım var</span>
              </label>
            </div>

            <p v-if="validationError" class="message error">{{ validationError }}</p>

            <div class="assumption-list">
              <span v-for="item in CALCULATION_ASSUMPTIONS.slice(0, 3)" :key="item">{{ item }}</span>
            </div>
          </template>

          <ResultExperience
            v-else
            :result="result"
            :user-name="accountName"
            :save-loading="saveLoading"
            :save-success="saveSuccess"
            :save-error="saveError"
            @save="saveCalculation"
          />
        </section>
      </Transition>

      <div class="wizard-actions">
        <button class="secondary-button" type="button" :disabled="currentStep === 0" @click="goBack">
          Geri
        </button>
        <button v-if="currentStep < 4" class="primary-button" type="button" @click="goNext">
          {{ currentStep === 3 ? 'Sonucu gör' : 'Devam et' }}
        </button>
      </div>
    </motion.div>
  </section>
</template>

<style scoped>
.wizard-shell {
  display: grid;
  gap: clamp(1.25rem, 3vw, 1.8rem);
}

.wizard-header {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 0.96fr) minmax(420px, 0.74fr);
  align-items: center;
  gap: clamp(1rem, 4vw, 3rem);
  padding: clamp(2.2rem, 7vw, 5.2rem) clamp(0.4rem, 2vw, 1rem);
}

.wizard-header::before {
  position: absolute;
  inset: 9% 6% auto auto;
  width: min(420px, 46vw);
  height: min(420px, 46vw);
  border-radius: 999px;
  background:
    radial-gradient(circle, rgba(20, 184, 166, 0.24), transparent 60%),
    radial-gradient(circle at 70% 28%, rgba(250, 204, 21, 0.16), transparent 46%);
  filter: blur(24px);
  pointer-events: none;
  content: '';
}

.wizard-header::after {
  position: absolute;
  inset: 6% auto auto 12%;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  background: rgba(250, 204, 21, 0.09);
  filter: blur(36px);
  pointer-events: none;
  content: '';
}

.hero-copy {
  position: relative;
  z-index: 1;
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
  max-width: 900px;
  margin-top: 0.7rem;
  color: var(--text);
  font-size: clamp(3.1rem, 7.4vw, 6.15rem);
  font-weight: 950;
  letter-spacing: -0.015em;
  line-height: 0.94;
}

.title-highlight {
  display: inline-block;
  background: linear-gradient(110deg, var(--text), var(--accent), var(--text));
  background-size: 220% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: titleSheen 7s ease-in-out infinite;
}

@keyframes titleSheen {
  0%,
  100% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }
}

h2 {
  color: var(--text);
  font-size: clamp(1.75rem, 4vw, 3.2rem);
  line-height: 1;
}

p {
  max-width: 620px;
  margin-top: 1rem;
  color: var(--muted);
  font-size: clamp(1rem, 1.7vw, 1.15rem);
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 1.35rem;
  max-width: 100%;
}

.hero-chip {
  flex-shrink: 0;
  width: auto;
  min-width: max-content;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 18px;
  border: 1px solid rgba(15, 118, 110, 0.12);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 62%, transparent);
  color: var(--muted);
  box-shadow: 0 12px 28px var(--shadow);
  font-size: 0.82rem;
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  backdrop-filter: blur(16px);
}

.chip-short {
  display: none;
}

.hero-actions :deep(.hero-cta-button),
.hero-cta-button {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  min-width: 132px;
  padding: 0 22px;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.92rem;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  appearance: none;
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    background 180ms ease;
}

.hero-actions :deep(.hero-cta-button.primary),
.hero-cta-button.primary {
  color: #ffffff;
  background: linear-gradient(135deg, #0f8f82, #12b5a3);
  box-shadow: 0 14px 30px rgba(15, 143, 130, 0.24);
}

.hero-actions :deep(.hero-cta-button.secondary),
.hero-cta-button.secondary {
  color: #0f172a;
  border-color: rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.08);
}

.hero-actions :deep(.hero-cta-button:hover),
.hero-cta-button:hover {
  box-shadow:
    0 20px 44px rgba(15, 143, 130, 0.18),
    0 0 0 8px rgba(22, 199, 167, 0.08);
  transform: translateY(-3px);
}

.hero-cta-button:active {
  transform: translateY(-1px) scale(0.98);
}

.hero-actions :deep(.hero-cta-button.secondary:hover),
.hero-actions :deep(.hero-cta-button.secondary:visited),
.hero-cta-button.secondary:hover,
.hero-cta-button.secondary:visited {
  color: #0f172a;
  text-decoration: none;
}

.wizard-card {
  display: grid;
  gap: 1.7rem;
  min-height: 620px;
  padding: clamp(1rem, 3vw, 1.65rem);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 28px;
  background:
    linear-gradient(135deg, var(--surface), var(--surface-soft)),
    radial-gradient(circle at 12% 0, var(--accent-soft), transparent 32rem);
  box-shadow:
    0 34px 94px var(--shadow),
    0 1px 0 rgba(255, 255, 255, 0.86) inset;
  backdrop-filter: blur(20px);
  transition:
    transform 240ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 240ms ease,
    box-shadow 240ms ease,
    background 240ms ease;
}

.wizard-card:hover {
  border-color: color-mix(in srgb, var(--accent) 32%, transparent);
  box-shadow:
    0 40px 108px var(--shadow),
    0 0 0 1px color-mix(in srgb, var(--accent) 10%, transparent) inset;
  transform: translateY(-4px);
}

.step-panel {
  display: grid;
  align-content: start;
  gap: 1.25rem;
  min-height: 410px;
}

.step-copy {
  display: grid;
  gap: 0.55rem;
}

.field-stack,
.field-grid {
  display: grid;
  gap: 1rem;
}

.step-fields-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
}

.field-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.field-group {
  min-width: 0;
}

label {
  display: grid;
  gap: 0.65rem;
  color: var(--text);
  font-size: 0.9rem;
  font-weight: 800;
  transition: color 180ms ease;
}

label:focus-within {
  color: color-mix(in srgb, var(--accent) 78%, var(--text));
}

input {
  box-sizing: border-box;
  width: 100%;
  min-height: 52px;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 0.78rem 0.95rem;
  background: var(--input-bg);
  color: var(--text);
  font: inherit;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.035);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    background-color 160ms ease;
}

input::placeholder {
  color: #9aa7b8;
}

input:focus {
  border-color: #14b8a6;
  background: color-mix(in srgb, var(--surface) 88%, #ffffff 12%);
  outline: 0;
  box-shadow:
    0 0 0 4px rgba(20, 184, 166, 0.16),
    0 16px 34px rgba(15, 23, 42, 0.08);
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
}

input[type='number'] {
  -moz-appearance: textfield;
}

.toggle-field {
  grid-column: 1 / -1;
  grid-template-columns: auto 1fr;
  align-items: center;
  min-height: 54px;
  padding: 0.85rem;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: color-mix(in srgb, var(--surface) 78%, transparent);
}

.toggle-field input {
  width: 20px;
  min-height: 20px;
}

.assumption-box,
.assumption-list span {
  border: 1px solid rgba(20, 184, 166, 0.2);
  border-radius: 16px;
  background: rgba(236, 253, 245, 0.8);
  color: color-mix(in srgb, var(--accent) 70%, var(--text));
}

.assumption-box {
  padding: 1rem;
  font-weight: 800;
}

.assumption-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.assumption-list span {
  padding: 0.5rem 0.65rem;
  font-size: 0.78rem;
  font-weight: 800;
}

.wizard-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.primary-button,
.secondary-button {
  min-width: 132px;
  display: inline-grid;
  place-items: center;
  min-height: 46px;
  padding: 0.76rem 1.18rem;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 0.92rem;
  font-weight: 900;
  line-height: 1;
  text-align: center;
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

.secondary-button {
  color: var(--text);
  border-color: var(--border);
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
}

.primary-button:hover,
.secondary-button:hover {
  transform: translateY(-2px);
}

.primary-button:hover {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  box-shadow:
    0 18px 36px rgba(15, 118, 110, 0.3),
    0 0 0 8px rgba(20, 184, 166, 0.11);
}

.secondary-button:hover {
  border-color: rgba(20, 184, 166, 0.22);
  background: color-mix(in srgb, var(--surface) 88%, transparent);
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}

button:disabled {
  cursor: default;
  opacity: 0.5;
  transform: none;
}

.message {
  margin: 0;
  font-weight: 800;
}

.error {
  color: #b91c1c;
}

.step-forward-enter-active,
.step-forward-leave-active,
.step-back-enter-active,
.step-back-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.step-forward-enter-from,
.step-back-leave-to {
  opacity: 0;
  transform: translateX(18px);
}

.step-forward-leave-to,
.step-back-enter-from {
  opacity: 0;
  transform: translateX(-18px);
}

@media (max-width: 900px) {
  .wizard-header {
    align-items: flex-start;
    grid-template-columns: 1fr;
    padding-top: 1.7rem;
  }

  .step-fields-grid,
  .field-grid {
    grid-template-columns: 1fr;
  }

  .wizard-card {
    border-radius: 22px;
  }

}

@media (max-width: 560px) {
  .wizard-card {
    min-height: auto;
    padding: 1rem;
  }

  h1 {
    font-size: clamp(2.3rem, 12vw, 4rem);
    line-height: 1;
  }

  .hero-actions {
    flex-wrap: wrap;
  }

  .chip-full {
    display: none;
  }

  .chip-short {
    display: inline;
  }

  .wizard-actions {
    flex-direction: column-reverse;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
  }

  .hero-chip {
    width: 100%;
    min-width: 0;
  }

  .hero-actions :deep(.hero-cta-button),
  .hero-cta-button {
    flex: 1 1 calc(50% - 6px);
    min-width: 0;
  }
}
</style>
