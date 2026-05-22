<script setup>
import { BRANDING } from '../constants/branding'
import { CALCULATION_ASSUMPTIONS } from '../constants/carbonFactors'

const sections = [
  {
    title: 'Projenin amacı',
    text: 'Görünmeyen Çöp, e-posta kutuları, bulut depolama alanları, medya arşivleri ve uygulama verileriyle büyüyen dijital atık sorununu görünür kılar. Platform, veri birikiminin enerji tüketimiyle ilişkisini sade bir dijital çevre analizine dönüştürür.',
  },
  {
    title: 'Dijital atık nedir?',
    text: 'Dijital atık; kullanılmayan dosyalar, gereksiz e-postalar, tekrar eden fotoğraflar, eski yedekler ve unutulmuş uygulama verileri gibi depolama alanı tüketen dijital kalıntıları ifade eder. Bu veriler görünmez olsa da sunucular, ağlar ve cihazlar üzerinden enerji talebi oluşturur.',
  },
  {
    title: 'Görünmeyen enerji tüketimi',
    text: 'Bulutta saklanan her veri parçası fiziksel veri merkezlerinde tutulur. Veri merkezleri elektrik, soğutma ve ağ altyapısı kullanır. Bu nedenle dijital alışkanlıklar, doğrudan görülmeyen fakat ölçülebilir bir çevresel etki üretir.',
  },
  {
    title: 'Karbon farkındalığı',
    text: 'Platformun amacı kesin bir emisyon raporu üretmek değil, kullanıcıya hangi dijital davranışların daha fazla çevresel etki oluşturduğunu anlaşılır göstergelerle anlatmaktır. Böylece karbon farkındalığı günlük dijital alışkanlıklara bağlanır.',
  },
  {
    title: 'Dijital sürdürülebilirlik',
    text: 'Dijital sürdürülebilirlik; veri saklama, paylaşma ve temizleme alışkanlıklarını daha bilinçli yönetmeyi hedefler. Görünmeyen Çöp, bu yaklaşımı ölçüm, öneri, rozet ve dashboard deneyimiyle destekleyen modern bir çevre platformudur.',
  },
]
</script>

<template>
  <main class="about-page">
    <section class="about-hero">
      <span>{{ BRANDING.heroEyebrow }}</span>
      <h1>{{ BRANDING.aboutTitle }}</h1>
      <p>{{ BRANDING.aboutDescription }}</p>
    </section>

    <section class="content-grid">
      <article v-for="section in sections" :key="section.title" class="info-card">
        <h2>{{ section.title }}</h2>
        <p>{{ section.text }}</p>
      </article>

      <article class="info-card assumptions">
        <h2>Analiz varsayımları</h2>
        <p>
          Sonuçlar kesin emisyon ölçümü değil, farklı dijital atık davranışlarını karşılaştırmak
          için kullanılan yaklaşık çevresel etki tahminleridir.
        </p>
        <ul>
          <li v-for="item in CALCULATION_ASSUMPTIONS" :key="item">{{ item }}</li>
        </ul>
      </article>
    </section>
  </main>
</template>

<style scoped>
.about-page {
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: clamp(0.9rem, 3vw, 1.5rem);
}

.about-hero {
  position: relative;
  min-height: 380px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1.5rem, 6vw, 4rem);
  border: 1px solid rgba(255, 255, 255, 0.38);
  border-radius: 30px;
  background:
    linear-gradient(135deg, rgba(15, 23, 42, 0.62), rgba(15, 118, 110, 0.58)),
    radial-gradient(circle at 72% 16%, rgba(250, 204, 21, 0.24), transparent 25rem),
    url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80');
  background-size: cover;
  background-position: center;
  color: white;
  box-shadow: 0 32px 86px rgba(15, 23, 42, 0.18);
}

.about-hero span {
  color: #facc15;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.about-hero h1 {
  max-width: 820px;
  margin: 0.65rem 0 0;
  font-size: clamp(2.6rem, 7vw, 5.7rem);
  font-weight: 950;
  letter-spacing: 0;
  line-height: 0.95;
  text-shadow: 0 18px 48px rgba(15, 23, 42, 0.28);
}

.about-hero p {
  max-width: 740px;
  margin: 1rem 0 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.08rem;
  line-height: 1.7;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.info-card {
  padding: 1.25rem;
  border: 1px solid rgba(15, 118, 110, 0.12);
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface) 82%, transparent);
  box-shadow: 0 18px 44px var(--shadow);
  backdrop-filter: blur(16px);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease;
}

.info-card:hover {
  border-color: rgba(20, 184, 166, 0.24);
  box-shadow: 0 28px 62px rgba(15, 23, 42, 0.1);
  transform: translateY(-2px);
}

.info-card h2 {
  margin: 0 0 0.55rem;
  color: var(--text);
  font-size: 1.12rem;
}

.info-card p,
.info-card li {
  color: var(--muted);
  line-height: 1.72;
}

.info-card p {
  margin: 0;
}

.assumptions {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, var(--accent-soft), var(--surface));
}

.assumptions ul {
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
}

@media (max-width: 760px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .about-hero {
    min-height: 320px;
    border-radius: 24px;
  }
}
</style>
