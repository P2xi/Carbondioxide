<script setup>
import AnimatedNumber from './AnimatedNumber.vue'

defineProps({
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  suffix: {
    type: String,
    default: '',
  },
  digits: {
    type: Number,
    default: 0,
  },
  tone: {
    type: String,
    default: 'teal',
  },
})
</script>

<template>
  <article class="metric-card" :class="`tone-${tone}`">
    <span class="metric-icon">{{ icon }}</span>
    <span class="metric-label">{{ label }}</span>
    <strong>
      <AnimatedNumber :value="value" :digits="digits" />
      <small>{{ suffix }}</small>
    </strong>
  </article>
</template>

<style scoped>
.metric-card {
  position: relative;
  min-height: 170px;
  overflow: hidden;
  padding: 1.25rem;
  border: 1px solid rgba(255, 255, 255, 0.56);
  border-radius: 22px;
  color: #ffffff;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  box-shadow: 0 22px 54px rgba(15, 23, 42, 0.14);
  transition:
    transform 180ms ease,
    box-shadow 180ms ease;
}

.metric-card::after {
  position: absolute;
  inset: auto -22% -42% 22%;
  height: 150px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  filter: blur(26px);
  content: '';
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.18);
}

.tone-gold {
  background: linear-gradient(135deg, #b45309, #facc15);
}

.tone-blue {
  background: linear-gradient(135deg, #2563eb, #22d3ee);
}

.metric-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 1.35rem;
}

.metric-label {
  display: block;
  margin-top: 1.25rem;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.83rem;
  font-weight: 800;
  text-transform: uppercase;
}

strong {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-top: 0.4rem;
  font-size: clamp(2.2rem, 6vw, 3.35rem);
  line-height: 1;
}

small {
  font-size: 0.95rem;
}
</style>
