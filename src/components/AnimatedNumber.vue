<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    default: 0,
  },
  digits: {
    type: Number,
    default: 0,
  },
  duration: {
    type: Number,
    default: 900,
  },
})

const displayValue = ref(0)
let frameId = 0

function animate() {
  cancelAnimationFrame(frameId)

  const startValue = displayValue.value
  const endValue = Number(props.value || 0)
  const startTime = performance.now()

  function tick(now) {
    const progress = Math.min((now - startTime) / props.duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)

    displayValue.value = startValue + (endValue - startValue) * eased

    if (progress < 1) {
      frameId = requestAnimationFrame(tick)
    }
  }

  frameId = requestAnimationFrame(tick)
}

onMounted(animate)
watch(() => props.value, animate)

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId)
})
</script>

<template>
  <span>{{ displayValue.toFixed(digits) }}</span>
</template>
