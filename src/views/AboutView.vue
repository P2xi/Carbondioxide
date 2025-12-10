<script setup></script>

<template>
  <main class="page">
    <section class="card">
      <h2>Carbondioxide Hakkında</h2>
      <p>
        Bu uygulama, dijital alışkanlıklarımızın (spam e-postalar ve gereksiz bulut depolama
        kullanımı) karbon ayak izi üzerindeki etkisini göstermek için geliştirilmiş bir prototiptir.
      </p>
      <p>
        Kullanıcılar günlük spam mail sayılarını ve silecekleri gereksiz bulut alanını girerek,
        yıllık yaklaşık CO₂ tasarrufu ve bu tasarrufun ağaç eşdeğeri cinsinden karşılığını
        görebilir.
      </p>
    </section>

    <section class="card">
      <h3>Hesaplama Varsayımları</h3>
      <ul>
        <li>1 spam e-posta ≈ 0.3 g CO₂</li>
        <li>1 GB bulut depolama (1 yıl) ≈ 2 kg CO₂</li>
        <li>1 ağaç (1 yıl) ≈ 20 kg CO₂ tutar.</li>
      </ul>
      <p class="note">
        Bu değerler, literatürde ve popüler bilimsel kaynaklarda verilen ortalama tahminlere
        dayanmaktadır ve yaklaşık sonuçlar üretmek için kullanılır.
      </p>
    </section>

    <section class="card">
      <h3>Bilimsel Amaç</h3>
      <p>
        Projenin amacı, görünmez gibi duran dijital karbon ayak izini somutlaştırmak ve
        kullanıcıları dijital temizlik (spam silme, gereksiz dosyaları kaldırma) konusunda teşvik
        etmektir.
      </p>
      <p>
        Toplanan anonim veriler, kullanıcıların dijital temizlik davranışlarının toplu etkisini
        incelemek için istatistiksel analizlerde kullanılabilir.
      </p>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 640px;
  margin: 0 auto;
  padding: 1.5rem 1rem 2rem;
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

h2 {
  font-size: 1.4rem;
  margin-bottom: 0.75rem;
}

h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

p {
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: #0f172a;
}

ul {
  padding-left: 1.1rem;
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
}

.note {
  font-size: 0.85rem;
  color: #64748b;
}
</style>
