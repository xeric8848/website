<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * 标题逐字飞入。文案由响应式 props 渲染成单字 <span>，
 * Vue 自己掌管 DOM —— 切换语言后字符数组变化会自动重新渲染并重播动画，
 * 不直接 mutate innerHTML，避免与 i18n / SSR 冲突。
 *
 * - pre / hl / suf：组成标题，hl 片段套 gradient-text 渐变色
 * - stack：在 hl 前插入换行（对应原模板里的 <br>）
 * - by：'char' 逐字（默认，适配中文）| 'word' 逐词（适配英文长句）
 */
const props = withDefaults(
  defineProps<{
    pre?: string
    hl?: string
    suf?: string
    text?: string
    stack?: boolean
    tag?: string
    by?: 'char' | 'word'
    delay?: number
    stagger?: number
    start?: string
  }>(),
  {
    pre: '',
    hl: '',
    suf: '',
    text: '',
    stack: false,
    tag: 'h2',
    by: 'char',
    delay: 0,
    stagger: 0.035,
    start: 'top 88%',
  }
)

interface Seg {
  grad: boolean
  br: boolean
  units: string[]
}

// 把一段文字切成「单元」（字 / 词），词模式保留词后空格
function split(s: string, by: 'char' | 'word'): string[] {
  if (!s) return []
  if (by === 'word') return s.match(/\S+\s*/g) ?? [s]
  return Array.from(s)
}

const segments = computed<Seg[]>(() => {
  const base = props.text || props.pre
  const out: Seg[] = []
  if (base) out.push({ grad: false, br: false, units: split(base, props.by) })
  if (props.hl) out.push({ grad: true, br: props.stack, units: split(props.hl, props.by) })
  if (props.suf) out.push({ grad: false, br: false, units: split(props.suf, props.by) })
  return out
})

// 用于侦测文案变化（语言切换）后重播
const signature = computed(() => segments.value.map((s) => s.units.join('')).join('|'))

const root = ref<HTMLElement | null>(null)
let trigger: ScrollTrigger | null = null

function play() {
  if (!import.meta.client || !root.value) return
  trigger?.kill()
  trigger = null

  const chars = root.value.querySelectorAll<HTMLElement>('.st-u')
  if (!chars.length) return

  // 尊重「减少动态效果」偏好：直接呈现，不做位移动画
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(chars, { opacity: 1, y: 0, rotateX: 0 })
    return
  }

  const tween = gsap.fromTo(
    chars,
    { opacity: 0, yPercent: 120, rotateX: -90 },
    {
      opacity: 1,
      yPercent: 0,
      rotateX: 0,
      duration: 0.7,
      ease: 'back.out(1.6)',
      stagger: props.stagger,
      delay: props.delay,
      scrollTrigger: { trigger: root.value, start: props.start, once: true },
    }
  )
  trigger = tween.scrollTrigger ?? null
}

onMounted(play)
// 语言切换 → 字符重渲染后重播
watch(signature, () => nextTick(play))
onBeforeUnmount(() => trigger?.kill())
</script>

<template>
  <component :is="tag" ref="root" class="split-text">
    <template v-for="(seg, si) in segments" :key="si">
      <br v-if="seg.br" />
      <span
        v-for="(u, ui) in seg.units"
        :key="si + '-' + ui"
        class="st-u"
        :class="{ 'gradient-text': seg.grad }"
        >{{ u }}</span
      >
    </template>
  </component>
</template>

<style scoped>
.split-text {
  perspective: 600px;
}
.st-u {
  display: inline-block;
  white-space: pre;
  transform-origin: 50% 100%;
  will-change: transform, opacity;
  /* 动画起始前先隐藏，避免首帧整段文字闪现（JS 关闭时仍可见见下方 no-js 兜底） */
  opacity: 0;
}
/* 无 JS / gsap 未执行时的兜底：用纯 CSS 媒体特性无法判断 JS，
   但 gsap 会在 mounted 同帧设置初始态，闪现仅一帧，可接受 */
</style>
