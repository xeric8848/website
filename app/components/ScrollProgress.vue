<script setup lang="ts">
const progress = ref(0)
function onScroll() {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  progress.value = max > 0 ? (h.scrollTop / max) * 100 : 0
}
onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="scroll-progress" :style="{ width: progress + '%' }" />
</template>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  z-index: 200;
  background: var(--gradient);
  box-shadow: 0 0 12px rgba(168, 85, 255, 0.8);
  transition: width 0.1s linear;
}
</style>
