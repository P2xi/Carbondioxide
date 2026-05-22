export const CARBON_FACTORS = {
  spamEmailKg: 0.0003,
  cleanedEmailKg: 0.0002,
  cloudStorageGbYearKg: 2,
  mediaStorageGbYearKg: 2.4,
  appDataGbYearKg: 1.5,
  weeklyHabitBonusKg: 8,
  treeAbsorptionKgYear: 20,
}

export const SCORE_LIMITS = {
  excellentKg: 80,
  strongKg: 45,
  developingKg: 18,
}

export const CALCULATION_ASSUMPTIONS = [
  '1 spam e-posta yaklasik 0.3 g CO2 etkisi olusturur.',
  '1 gereksiz e-posta yaklasik 0.2 g CO2 etkisi olusturur.',
  '1 GB bulut depolama alani yilda yaklasik 2 kg CO2 ile iliskilendirilir.',
  'Video ve fotograf arsivleri daha yogun depolama kullandigi icin 1 GB icin 2.4 kg CO2 katsayisi kullanilir.',
  '1 agacin 1 yilda ortalama 20 kg CO2 tuttugu varsayilir.',
]
