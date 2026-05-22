<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value),
  },
  to: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'button',
  },
})

defineEmits(['click'])
</script>

<template>
  <RouterLink v-if="to" class="base-button" :class="`is-${variant}`" :to="to">
    <slot />
  </RouterLink>
  <button v-else class="base-button" :class="`is-${variant}`" :type="type" @click="$emit('click')">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  min-width: 148px;
  padding: 0 28px;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 900;
  line-height: 1;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  transform: translateY(0) scale(1);
  transition:
    transform 180ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background 180ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.base-button:hover {
  transform: translateY(-2px) scale(1.015);
}

.base-button:focus-visible {
  outline: 0;
  box-shadow:
    0 0 0 4px rgba(20, 184, 166, 0.18),
    0 18px 38px rgba(15, 23, 42, 0.12);
}

.is-primary {
  color: #ffffff;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  box-shadow:
    0 16px 34px rgba(15, 118, 110, 0.28),
    0 0 0 8px rgba(20, 184, 166, 0.09);
}

.is-primary:hover {
  background: linear-gradient(135deg, #0d9488, #2dd4bf);
  box-shadow:
    0 22px 44px rgba(15, 118, 110, 0.34),
    0 0 0 9px rgba(20, 184, 166, 0.12);
}

.is-secondary {
  border-color: rgba(148, 163, 184, 0.2);
  color: #0f172a;
  background: rgba(255, 255, 255, 0.68);
  box-shadow:
    0 14px 30px rgba(15, 23, 42, 0.08),
    0 1px 0 rgba(255, 255, 255, 0.75) inset;
  backdrop-filter: blur(18px);
}

.is-secondary:hover {
  border-color: rgba(20, 184, 166, 0.24);
  background: rgba(255, 255, 255, 0.9);
  box-shadow:
    0 18px 38px rgba(15, 23, 42, 0.11),
    0 1px 0 rgba(255, 255, 255, 0.86) inset;
}

@media (max-width: 560px) {
  .base-button {
    width: 100%;
    min-width: 0;
  }
}
</style>
