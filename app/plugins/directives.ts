import { gsap } from 'gsap'

/**
 * v-tilt      鼠标悬停时卡片 3D 倾斜 + 高光跟随
 * v-magnetic  鼠标靠近时元素被「磁吸」轻微跟随
 *
 * 注册为通用指令（SSR + CSR 都存在），交互逻辑只在客户端 mounted 执行，
 * 避免 SSR 阶段「Failed to resolve directive」与 getSSRProps 报错。
 */
const noopSSR = () => ({})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('tilt', {
    getSSRProps: noopSSR,
    mounted(el: HTMLElement, binding) {
      if (!import.meta.client || window.matchMedia('(hover: none)').matches) return
      const max = Number(binding.value ?? 10)
      el.style.transformStyle = 'preserve-3d'
      el.style.willChange = 'transform'

      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        gsap.to(el, {
          rotateY: px * max,
          rotateX: -py * max,
          duration: 0.4,
          ease: 'power2.out',
          transformPerspective: 800,
        })
        el.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
        el.style.setProperty('--my', `${(py + 0.5) * 100}%`)
      }
      const onLeave = () => {
        gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' })
      }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      ;(el as any).__tilt = { onMove, onLeave }
    },
    unmounted(el: HTMLElement) {
      const h = (el as any).__tilt
      if (h) {
        el.removeEventListener('mousemove', h.onMove)
        el.removeEventListener('mouseleave', h.onLeave)
      }
    },
  })

  nuxtApp.vueApp.directive('magnetic', {
    getSSRProps: noopSSR,
    mounted(el: HTMLElement, binding) {
      if (!import.meta.client || window.matchMedia('(hover: none)').matches) return
      const strength = Number(binding.value ?? 0.35)
      const onMove = (e: MouseEvent) => {
        const r = el.getBoundingClientRect()
        const x = e.clientX - (r.left + r.width / 2)
        const y = e.clientY - (r.top + r.height / 2)
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: 'power3.out' })
      }
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' })
      }
      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      ;(el as any).__mag = { onMove, onLeave }
    },
    unmounted(el: HTMLElement) {
      const h = (el as any).__mag
      if (h) {
        el.removeEventListener('mousemove', h.onMove)
        el.removeEventListener('mouseleave', h.onLeave)
      }
    },
  })
})
