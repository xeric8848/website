import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * 滚动动画集合：
 * - .reveal             淡入上移（可用 data-delay / data-from="left|right|scale" 定制）
 * - [data-parallax]     滚动视差位移（data-parallax 数值越大移动越多）
 */
export function useReveal() {
  const triggers: ScrollTrigger[] = []
  const track = (t?: ScrollTrigger | null) => {
    if (t) triggers.push(t)
  }

  function reveal(scope?: HTMLElement | null) {
    if (!import.meta.client) return
    const root = scope ?? document.body

    gsap.utils.toArray<HTMLElement>(root.querySelectorAll('.reveal')).forEach((el) => {
      const delay = Number(el.dataset.delay ?? 0)
      const from = el.dataset.from ?? 'up'
      const fromVars: gsap.TweenVars = { opacity: 0 }
      if (from === 'up') fromVars.y = 44
      else if (from === 'down') fromVars.y = -44
      else if (from === 'left') fromVars.x = -60
      else if (from === 'right') fromVars.x = 60
      else if (from === 'scale') {
        fromVars.scale = 0.85
        fromVars.y = 30
      }

      const tween = gsap.fromTo(el, fromVars, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.95,
        delay,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 86%', toggleActions: 'play none none none' },
      })
      track(tween.scrollTrigger)
    })

    // 视差
    gsap.utils.toArray<HTMLElement>(root.querySelectorAll('[data-parallax]')).forEach((el) => {
      const amount = Number(el.dataset.parallax ?? 80)
      const tween = gsap.to(el, {
        y: amount,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
      track(tween.scrollTrigger)
    })
  }

  onBeforeUnmount(() => triggers.forEach((t) => t.kill()))

  return { reveal }
}
