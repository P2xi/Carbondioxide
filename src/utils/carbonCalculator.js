// src/utils/carbonCalculator.js

// 1 spam mail ≈ 0.3 g CO₂ = 0.0003 kg
export const CO2_PER_SPAM_KG = 0.0003

// 1 GB bulut (1 yıl) ≈ 2 kg CO₂
export const CO2_PER_GB_YEAR_KG = 2

// 1 ağacın 1 yılda tuttuğu CO₂ ≈ 20 kg (yaklaşık)
export const CO2_PER_TREE_YEAR_KG = 20

export function calcSpamSaving(dailySpam) {
  const perYear = dailySpam * 365
  return perYear * CO2_PER_SPAM_KG
}

export function calcCloudSaving(deletedGb) {
  return deletedGb * CO2_PER_GB_YEAR_KG
}

export function calcTotalSaving(dailySpam, deletedGb) {
  const spam = calcSpamSaving(dailySpam)
  const cloud = calcCloudSaving(deletedGb)
  return {
    spamSavingKg: spam,
    cloudSavingKg: cloud,
    totalSavingKg: spam + cloud,
  }
}

export function calcTreesEquivalent(totalSavingKg) {
  if (!totalSavingKg || totalSavingKg <= 0) return 0
  return totalSavingKg / CO2_PER_TREE_YEAR_KG
}
