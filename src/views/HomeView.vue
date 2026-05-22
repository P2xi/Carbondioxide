<script setup>
import MultiStepCalculator from '../components/MultiStepCalculator.vue'
</script>

<template>
  <main class="page">
    <MultiStepCalculator />
  </main>
</template>

<style scoped>
.page {
  width: min(1240px, 100%);
  margin: 0 auto;
  padding: clamp(0.9rem, 3vw, 1.5rem);
}
</style>
