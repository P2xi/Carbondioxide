<script setup>
import { ref, onMounted, computed } from 'vue'
import { calcTotalSaving, calcTreesEquivalent } from '../utils/carbonCalculator'
import { supabase } from '../supabaseClient'

// --- Hesap (kullanıcı) bilgileri ---
const accountName = ref('')
const accountEmailInput = ref('')

const userName = ref('')
const userEmail = ref('')
const isRegistered = ref(false)

// Sekme durumu: "calculator" veya "profile"
const activeTab = ref('calculator')

// --- Hesaplayıcı formu ---
const dailySpam = ref(0)
const cloudDeletedGb = ref(0)

const spamSavingKg = ref(null)
const cloudSavingKg = ref(null)
const totalSavingKg = ref(null)
const treesEquivalent = ref(null)

const savingCalculated = ref(false)
const saveLoading = ref(false)
const saveSuccess = ref(false)
const saveError = ref('')

// --- Hesap açma hatası ---
const accountError = ref('')

// --- Geçmiş hesaplamalar (Profil sekmesi) ---
const historyLoading = ref(false)
const historyError = ref('')
const calculations = ref([])

// Uygulama açıldığında localStorage'dan kullanıcıyı oku
onMounted(() => {
  const storedEmail = localStorage.getItem('cd_email')
  const storedName = localStorage.getItem('cd_name')
  if (storedEmail) {
    userEmail.value = storedEmail
    userName.value = storedName || ''
    isRegistered.value = true
  }
})

// Hesap oluşturma (ilk ekran)
function createAccount() {
  accountError.value = ''

  if (!accountEmailInput.value) {
    accountError.value = 'Lütfen geçerli bir e-posta gir.'
    return
  }

  userEmail.value = accountEmailInput.value
  userName.value = accountName.value

  // LocalStorage'a yaz
  localStorage.setItem('cd_email', userEmail.value)
  localStorage.setItem('cd_name', userName.value || '')

  isRegistered.value = true
}

// Hesaplama
function onCalculate() {
  const result = calcTotalSaving(Number(dailySpam.value || 0), Number(cloudDeletedGb.value || 0))

  spamSavingKg.value = result.spamSavingKg
  cloudSavingKg.value = result.cloudSavingKg
  totalSavingKg.value = result.totalSavingKg
  treesEquivalent.value = calcTreesEquivalent(result.totalSavingKg)

  savingCalculated.value = true
  saveSuccess.value = false
  saveError.value = ''
}

// Formu sıfırlama
function resetForm() {
  dailySpam.value = 0
  cloudDeletedGb.value = 0
  spamSavingKg.value = null
  cloudSavingKg.value = null
  totalSavingKg.value = null
  treesEquivalent.value = null
  savingCalculated.value = false
  saveSuccess.value = false
  saveError.value = ''
}

// Supabase'e kaydetme
async function onSave() {
  if (!savingCalculated.value) return
  if (!userEmail.value) {
    saveError.value = 'Kullanıcı e-postası bulunamadı.'
    return
  }

  saveLoading.value = true
  saveSuccess.value = false
  saveError.value = ''

  const { error } = await supabase.from('calculations').insert({
    email: userEmail.value,
    daily_spam: Number(dailySpam.value || 0),
    cloud_deleted_gb: Number(cloudDeletedGb.value || 0),
    spam_saving_kg: spamSavingKg.value,
    cloud_saving_kg: cloudSavingKg.value,
    total_saving_kg: totalSavingKg.value,
  })

  saveLoading.value = false

  if (error) {
    saveError.value = error.message
  } else {
    saveSuccess.value = true
  }
}

// Profil sekmesi için Supabase'ten geçmiş hesaplamaları çek
async function loadHistory() {
  if (!userEmail.value) return

  historyLoading.value = true
  historyError.value = ''

  const { data, error } = await supabase
    .from('calculations')
    .select('*')
    .eq('email', userEmail.value)
    .order('created_at', { ascending: false })
    .limit(50)

  historyLoading.value = false

  if (error) {
    historyError.value = error.message
  } else {
    calculations.value = data || []
  }
}

// Sekme değiştirme
function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'profile') {
    loadHistory()
  }
}

// Tarihi okunabilir formata çevir
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  return d.toLocaleString('tr-TR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

// --- Profil için özet metrikler ---

const totalHistorySaving = computed(() =>
  calculations.value.reduce((sum, c) => sum + Number(c.total_saving_kg || 0), 0),
)

const totalHistoryTrees = computed(() => calcTreesEquivalent(totalHistorySaving.value))

const avgDailySpam = computed(() => {
  if (!calculations.value.length) return 0
  const sum = calculations.value.reduce((s, c) => s + Number(c.daily_spam || 0), 0)
  return sum / calculations.value.length
})

const avgDeletedGb = computed(() => {
  if (!calculations.value.length) return 0
  const sum = calculations.value.reduce((s, c) => s + Number(c.cloud_deleted_gb || 0), 0)
  return sum / calculations.value.length
})
</script>

<template>
  <main class="page">
    <!-- 1) Kullanıcı kayıt ekranı (ilk açılışta) -->
    <section v-if="!isRegistered" class="card account-card">
      <h2>Hesap Oluştur</h2>
      <p class="subtitle">
        Uygulamayı kullanmak için basit bir hesap aç. Hesapların e-posta adresine göre tutulacak.
      </p>

      <label>
        Adın (opsiyonel)
        <input v-model="accountName" type="text" placeholder="Ad Soyad" />
      </label>

      <label>
        E-posta adresin
        <input v-model="accountEmailInput" type="email" placeholder="ornek@mail.com" />
      </label>

      <button @click="createAccount">Hesap aç</button>

      <p v-if="accountError" class="error">
        {{ accountError }}
      </p>

      <p class="note">
        E-posta adresin, Supabase veritabanında yaptığın hesaplamaları sana bağlamak için
        kullanılır.
      </p>
    </section>

    <!-- 2) Kullanıcı kayıtlıysa ana içerik + alt bar -->
    <section v-else class="app-content">
      <!-- Kullanıcı bilgi kartı -->
      <section class="card">
        <p class="welcome">Merhaba, {{ userName || userEmail }}</p>
        <p class="subtitle">
          Dijital karbon ayak izin için hesaplama yapabilir, geçmiş sonuçlarını görebilirsin.
        </p>
      </section>

      <!-- Hesaplayıcı sekmesi -->
      <section v-if="activeTab === 'calculator'" class="card">
        <h2>Hesaplayıcı</h2>

        <label>
          Günlük spam mail sayısı
          <input v-model.number="dailySpam" type="number" min="0" />
        </label>

        <label>
          Silmek istediğin gereksiz bulut alanı (GB)
          <input v-model.number="cloudDeletedGb" type="number" min="0" />
        </label>

        <div class="helper-box">
          <p class="helper-title">Hesaplama varsayımları</p>
          <ul>
            <li>1 spam mail ≈ 0.3 g CO₂</li>
            <li>1 GB bulut depolama (1 yıl) ≈ 2 kg CO₂</li>
            <li>1 ağaç (1 yıl) ≈ 20 kg CO₂ tutar.</li>
          </ul>
        </div>

        <div class="actions">
          <button @click="onCalculate">Hesapla</button>
          <button class="secondary" type="button" @click="resetForm">Sıfırla</button>
        </div>

        <section v-if="savingCalculated" class="results">
          <h3>Sonuçlar</h3>

          <p>
            Spam mail tasarrufu:
            <strong>{{ spamSavingKg.toFixed(2) }} kg CO₂ / yıl</strong>
          </p>

          <p>
            Bulut depolama tasarrufu:
            <strong>{{ cloudSavingKg.toFixed(2) }} kg CO₂ / yıl</strong>
          </p>

          <p class="total">
            Toplam tasarruf:
            <strong>{{ totalSavingKg.toFixed(2) }} kg CO₂ / yıl</strong>
          </p>

          <p class="trees" v-if="treesEquivalent !== null">
            Bu, yaklaşık
            <strong>{{ treesEquivalent.toFixed(1) }}</strong>
            ağacın 1 yılda tuttuğu CO₂ miktarına denktir.
          </p>

          <button class="save-button" @click="onSave" :disabled="saveLoading">
            {{ saveLoading ? 'Kaydediliyor...' : 'Sonuçları kaydet' }}
          </button>

          <p v-if="saveSuccess" class="success">Hesaplama Supabase veritabanına kaydedildi.</p>

          <p v-if="saveError" class="error">Hata: {{ saveError }}</p>

          <p class="note">
            Bu değerler literatürdeki ortalama tahminlere dayanır ve yaklaşık sonuçlardır.
          </p>
        </section>
      </section>

      <!-- Profil sekmesi -->
      <section v-else class="card">
        <h2>Profil &amp; Hesap Geçmişi</h2>

        <p>
          <strong>E-posta:</strong>
          {{ userEmail }}
        </p>
        <p v-if="userName">
          <strong>Ad:</strong>
          {{ userName }}
        </p>

        <!-- Özet metrikler -->
        <section class="summary" v-if="calculations.length">
          <h3>Özet</h3>
          <p>
            Toplam tasarruf:
            <strong>{{ totalHistorySaving.toFixed(2) }} kg CO₂ / yıl</strong>
          </p>
          <p>
            Ağaç eşdeğeri:
            <strong>{{ totalHistoryTrees.toFixed(1) }} ağaç / yıl</strong>
          </p>
          <p>
            Ortalama günlük spam:
            <strong>{{ avgDailySpam.toFixed(1) }} mail</strong>
          </p>
          <p>
            Ortalama silinen bulut alanı:
            <strong>{{ avgDeletedGb.toFixed(1) }} GB</strong>
          </p>
        </section>

        <button class="reload-button" @click="loadHistory" :disabled="historyLoading">
          {{ historyLoading ? 'Yükleniyor...' : 'Geçmişi yenile' }}
        </button>

        <p v-if="historyError" class="error">Hata: {{ historyError }}</p>

        <ul v-if="!historyLoading && calculations.length" class="history-list">
          <li v-for="calc in calculations" :key="calc.id" class="history-item">
            <div class="history-top">
              <span class="history-date">
                {{ formatDate(calc.created_at) }}
              </span>
              <span class="history-total">
                {{ calc.total_saving_kg.toFixed(2) }} kg CO₂ / yıl
              </span>
            </div>
            <div class="history-details">
              <span>Spam: {{ calc.daily_spam }} /gün</span>
              <span>Bulut: {{ calc.cloud_deleted_gb }} GB</span>
            </div>
          </li>
        </ul>

        <p v-else-if="!historyLoading" class="note">Henüz kayıtlı hesaplama yok.</p>
      </section>

      <!-- Alt bar (sekme butonları) -->
      <nav class="bottom-nav">
        <button
          class="nav-btn"
          :class="{ active: activeTab === 'calculator' }"
          @click="switchTab('calculator')"
        >
          Hesaplayıcı
        </button>
        <button
          class="nav-btn"
          :class="{ active: activeTab === 'profile' }"
          @click="switchTab('profile')"
        >
          Profil
        </button>
      </nav>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 480px;
  margin: 0 auto;
  padding: 1.5rem 1rem 4.5rem;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
}

.account-card {
  margin-top: 2rem;
}

h2 {
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
}

.subtitle {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.welcome {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
}

button {
  margin-top: 0.5rem;
  padding: 0.6rem 1.2rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  background: #0f766e;
  color: white;
}

button:hover:enabled {
  opacity: 0.95;
}

button:disabled {
  opacity: 0.7;
  cursor: default;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.results {
  margin-top: 1rem;
  border-top: 1px dashed #e2e8f0;
  padding-top: 0.75rem;
}

.results h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.total {
  margin-top: 0.75rem;
  font-size: 1.05rem;
}

.trees {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #0f172a;
}

.note {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #64748b;
}

.helper-box {
  margin-top: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  font-size: 0.85rem;
}

.helper-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.helper-box ul {
  padding-left: 1.1rem;
  margin: 0;
}

.helper-box li {
  margin-bottom: 0.1rem;
}

.save-button {
  background: #2563eb;
}

.reload-button {
  background: #334155;
  margin-top: 0.75rem;
}

.success {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #16a34a;
}

.error {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #dc2626;
}

/* Geçmiş liste stil */
.history-list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
}

.history-item {
  padding: 0.6rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.history-item:last-child {
  border-bottom: none;
}

.history-top {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
}

.history-date {
  color: #64748b;
}

.history-total {
  font-weight: 600;
}

.history-details {
  margin-top: 0.25rem;
  display: flex;
  gap: 0.75rem;
  font-size: 0.85rem;
  color: #475569;
}

/* Özet */
.summary {
  margin-top: 0.75rem;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  background: #f1f5f9;
  font-size: 0.9rem;
}

/* Alt navigation bar */
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 480px;
  margin: 0 auto;
  padding: 0.4rem 1rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-around;
  gap: 0.75rem;
}

.nav-btn {
  flex: 1;
  padding: 0.55rem 0.8rem;
  border-radius: 999px;
  background: #e2e8f0;
  color: #0f172a;
  font-size: 0.9rem;
}

.nav-btn.active {
  background: #0f766e;
  color: white;
}
</style>
