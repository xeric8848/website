<script setup lang="ts">
const props = withDefaults(defineProps<{ density?: number }>(), { density: 70 })

const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let parts: { x: number; y: number; vx: number; vy: number }[] = []
let w = 0
let h = 0
const mouse = { x: -999, y: -999 }

function resize() {
  const el = canvas.value
  if (!el || !el.parentElement) return
  const rect = el.parentElement.getBoundingClientRect()
  w = el.width = rect.width
  h = el.height = rect.height
  const count = Math.min(props.density, Math.floor((w * h) / 14000))
  parts = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
  }))
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  for (const p of parts) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > w) p.vx *= -1
    if (p.y < 0 || p.y > h) p.vy *= -1
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(168, 130, 255, 0.8)'
    ctx.fill()
  }
  // 连线
  for (let i = 0; i < parts.length; i++) {
    for (let j = i + 1; j < parts.length; j++) {
      const a = parts[i]!
      const b = parts[j]!
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      if (d < 120) {
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.12 * (1 - d / 120)})`
        ctx.stroke()
      }
    }
    // 鼠标连线
    const a = parts[i]!
    const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y)
    if (dm < 160) {
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(mouse.x, mouse.y)
      ctx.strokeStyle = `rgba(255, 46, 147, ${0.25 * (1 - dm / 160)})`
      ctx.stroke()
    }
  }
  raf = requestAnimationFrame(draw)
}

function onMouse(e: MouseEvent) {
  if (!canvas.value) return
  const rect = canvas.value.getBoundingClientRect()
  mouse.x = e.clientX - rect.left
  mouse.y = e.clientY - rect.top
}

onMounted(async () => {
  await nextTick()
  if (!canvas.value) return
  ctx = canvas.value.getContext('2d')
  if (!ctx) return
  resize()
  draw()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', onMouse, { passive: true })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouse)
})
</script>

<template>
  <canvas ref="canvas" class="particles" aria-hidden="true" />
</template>

<style scoped>
.particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
