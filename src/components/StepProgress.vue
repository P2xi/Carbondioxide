<script setup>
defineProps({
  steps: {
    type: Array,
    required: true,
  },
  currentStep: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="step-progress" aria-label="Hesaplama adımları">
    <div class="progress-track">
      <span class="progress-fill" :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }" />
    </div>

    <ol>
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        :class="{ active: index === currentStep, complete: index < currentStep }"
      >
        <span class="step-dot">{{ index < currentStep ? '✓' : index + 1 }}</span>
        <span class="step-label">{{ step.title }}</span>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.step-progress {
  display: grid;
  gap: 1.15rem;
  padding: 0.9rem;
  border: 1px solid var(--border);
  border-radius: 22px;
  background: color-mix(in srgb, var(--surface) 70%, transparent);
  box-shadow: 0 18px 46px var(--shadow);
  backdrop-filter: blur(18px);
}

.progress-track {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.14);
}

.progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #0f766e, #14b8a6, #facc15);
  box-shadow: 0 0 28px rgba(20, 184, 166, 0.32);
  transition: width 680ms cubic-bezier(0.22, 1, 0.36, 1);
}

ol {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.7rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

li {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 800;
  text-align: center;
  transition:
    color 180ms ease,
    transform 180ms ease;
}

li:hover {
  color: var(--text);
  transform: translateY(-1px);
}

.step-dot {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  border-radius: 999px;
  background: color-mix(in srgb, var(--surface) 86%, transparent);
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.04);
  transition:
    transform 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease,
    box-shadow 180ms ease,
    color 180ms ease;
}

li.active,
li.complete {
  color: var(--text);
}

li.active .step-dot {
  color: #ffffff;
  border-color: transparent;
  background: #0f766e;
  box-shadow:
    0 14px 30px rgba(15, 118, 110, 0.26),
    0 0 0 7px rgba(20, 184, 166, 0.09);
  animation:
    stepScale 320ms cubic-bezier(0.16, 1, 0.3, 1),
    activePulse 2.2s ease-in-out infinite;
  transform: translateY(-2px) scale(1.04);
}

li.complete .step-dot {
  color: #0f766e;
  border-color: rgba(20, 184, 166, 0.32);
  background: rgba(236, 253, 245, 0.9);
  box-shadow: 0 12px 26px rgba(15, 118, 110, 0.1);
  animation: checkPop 360ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes stepScale {
  from {
    transform: translateY(0) scale(0.9);
  }

  to {
    transform: translateY(-2px) scale(1.04);
  }
}

@keyframes checkPop {
  from {
    opacity: 0.6;
    transform: scale(0.82);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes activePulse {
  0%,
  100% {
    box-shadow:
      0 14px 30px rgba(15, 118, 110, 0.26),
      0 0 0 7px rgba(20, 184, 166, 0.09);
  }

  50% {
    box-shadow:
      0 18px 34px rgba(15, 118, 110, 0.3),
      0 0 0 10px rgba(20, 184, 166, 0.13);
  }
}

@media (max-width: 700px) {
  ol {
    grid-template-columns: repeat(5, 1fr);
  }

  .step-label {
    display: none;
  }
}
</style>
