<script setup lang="ts">
import { gsap } from 'gsap'

const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)
let enabled = false

function onMove(e: MouseEvent) {
  gsap.to(dot.value, { x: e.clientX, y: e.clientY, duration: 0.12, ease: 'power2.out' })
  gsap.to(ring.value, { x: e.clientX, y: e.clientY, duration: 0.4, ease: 'power3.out' })
}
function onOver(e: MouseEvent) {
  const t = e.target as HTMLElement
  const interactive = t.closest('a, button, [data-cursor]')
  gsap.to(ring.value, {
    scale: interactive ? 1.8 : 1,
    borderColor: interactive ? 'var(--cyan)' : 'var(--primary)',
    duration: 0.3,
  })
}
function onDown() {
  gsap.to(ring.value, { scale: 0.7, duration: 0.2 })
}
function onUp() {
  gsap.to(ring.value, { scale: 1, duration: 0.3 })
}

onMounted(() => {
  // 仅在带精确指针的设备启用
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
  enabled = true
  document.documentElement.classList.add('has-cursor-glow')
  window.addEventListener('mousemove', onMove, { passive: true })
  window.addEventListener('mouseover', onOver, { passive: true })
  window.addEventListener('mousedown', onDown)
  window.addEventListener('mouseup', onUp)
})

onBeforeUnmount(() => {
  if (!enabled) return
  document.documentElement.classList.remove('has-cursor-glow')
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('mouseover', onOver)
  window.removeEventListener('mousedown', onDown)
  window.removeEventListener('mouseup', onUp)
})
</script>

<template>
  <ClientOnly>
    <div class="cursor">
      <div ref="ring" class="cursor__ring" />
      <div ref="dot" class="cursor__dot" />
    </div>
  </ClientOnly>
</template>

<style scoped>
.cursor {
  display: none;
}
@media (hover: hover) and (pointer: fine) {
  .cursor {
    display: block;
  }
}
.cursor__dot,
.cursor__ring {
  position: fixed;
  top: 0;
  left: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: transform;
}
.cursor__dot {
  width: 7px;
  height: 7px;
  background: var(--cyan);
  box-shadow: 0 0 12px var(--cyan);
}
.cursor__ring {
  width: 36px;
  height: 36px;
  border: 1.5px solid var(--primary);
  box-shadow: 0 0 18px rgba(168, 85, 255, 0.5);
}
</style>
