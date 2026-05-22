import { CARBON_FACTORS, SCORE_LIMITS } from '../constants/carbonFactors'

function cleanNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : 0
}

function roundMetric(value, digits = 2) {
  return Number(value.toFixed(digits))
}

export function calcSpamSaving(spamDaily) {
  return cleanNumber(spamDaily) * 365 * CARBON_FACTORS.spamEmailKg
}

export function calcEmailSaving(emailMonthly) {
  return cleanNumber(emailMonthly) * 12 * CARBON_FACTORS.cleanedEmailKg
}

export function calcCloudSaving(cloudGb) {
  return cleanNumber(cloudGb) * CARBON_FACTORS.cloudStorageGbYearKg
}

export function calcMediaSaving(mediaGb) {
  return cleanNumber(mediaGb) * CARBON_FACTORS.mediaStorageGbYearKg
}

export function calcAppCleanupSaving(appCleanupGb) {
  return cleanNumber(appCleanupGb) * CARBON_FACTORS.appDataGbYearKg
}

export function calcHabitSaving(weeklyCleanup) {
  return weeklyCleanup ? CARBON_FACTORS.weeklyHabitBonusKg : 0
}

export function calcTreesEquivalent(totalCo2Saved) {
  const total = cleanNumber(totalCo2Saved)
  return total / CARBON_FACTORS.treeAbsorptionKgYear
}

export function calcDigitalCleanupScore(totalCo2Saved, weeklyCleanup) {
  const total = cleanNumber(totalCo2Saved)
  const baseScore = Math.min(90, Math.round((total / SCORE_LIMITS.excellentKg) * 90))
  const habitBonus = weeklyCleanup ? 10 : 0
  return Math.min(100, baseScore + habitBonus)
}

export function getScoreLabel(score) {
  if (score >= 85) return 'Cok guclu'
  if (score >= 60) return 'Guclu'
  if (score >= 35) return 'Gelisen'
  return 'Baslangic'
}

export function buildRecommendations(input, result) {
  const recommendations = []

  if (cleanNumber(input.spamDaily) > 0 || cleanNumber(input.emailMonthly) < 100) {
    recommendations.push('Haftada 1 kez gereksiz e-postalari temizle.')
  }

  if (cleanNumber(input.cloudGb) > 0) {
    recommendations.push('Bulut depolamada tekrar eden fotograflari sil.')
  }

  if (cleanNumber(input.mediaGb) > 0) {
    recommendations.push('Buyuk video dosyalarini duzenli arsivle.')
  }

  if (cleanNumber(input.appCleanupGb) > 0) {
    recommendations.push('Kullanmadigin uygulamalarin onbellek ve yedek verilerini temizle.')
  }

  if (!input.weeklyCleanup) {
    recommendations.push('Dijital temizlik icin haftalik bir hatirlatici olustur.')
  }

  if (result.totalCo2Saved >= SCORE_LIMITS.strongKg) {
    recommendations.push('En etkili temizlik alanini her ay tekrar kontrol et.')
  }

  return recommendations.slice(0, 5)
}

export function calculateDigitalCarbonSavings(input) {
  const spamSavingKg = calcSpamSaving(input.spamDaily)
  const emailSavingKg = calcEmailSaving(input.emailMonthly)
  const cloudSavingKg = calcCloudSaving(input.cloudGb)
  const mediaSavingKg = calcMediaSaving(input.mediaGb)
  const appCleanupSavingKg = calcAppCleanupSaving(input.appCleanupGb)
  const habitSavingKg = calcHabitSaving(input.weeklyCleanup)
  const totalCo2Saved =
    spamSavingKg +
    emailSavingKg +
    cloudSavingKg +
    mediaSavingKg +
    appCleanupSavingKg +
    habitSavingKg
  const treeEquivalent = calcTreesEquivalent(totalCo2Saved)
  const digitalCleanupScore = calcDigitalCleanupScore(totalCo2Saved, input.weeklyCleanup)

  const result = {
    spamSavingKg: roundMetric(spamSavingKg),
    emailSavingKg: roundMetric(emailSavingKg),
    cloudSavingKg: roundMetric(cloudSavingKg),
    mediaSavingKg: roundMetric(mediaSavingKg),
    appCleanupSavingKg: roundMetric(appCleanupSavingKg),
    habitSavingKg: roundMetric(habitSavingKg),
    totalCo2Saved: roundMetric(totalCo2Saved),
    treeEquivalent: roundMetric(treeEquivalent, 1),
    digitalCleanupScore,
    scoreLabel: getScoreLabel(digitalCleanupScore),
  }

  return {
    ...result,
    recommendations: buildRecommendations(input, result),
    breakdown: [
      { label: 'E-posta', value: roundMetric(spamSavingKg + emailSavingKg), color: '#0f766e' },
      { label: 'Bulut', value: roundMetric(cloudSavingKg), color: '#14b8a6' },
      { label: 'Medya', value: roundMetric(mediaSavingKg), color: '#facc15' },
      { label: 'Uygulama', value: roundMetric(appCleanupSavingKg + habitSavingKg), color: '#2563eb' },
    ],
  }
}
