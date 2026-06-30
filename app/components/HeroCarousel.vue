<script setup lang="ts">
import { gsap } from 'gsap'

interface Slide {
  kicker: string
  title: string
  highlight: string
  desc: string
  cta: string
  tags: string[]
  rating: string
  slug: string
  bg: string
}

const { t, tm, rt } = useI18n()

// 本地图片：/public/images/hero/<slug>-<宽>.<webp|jpg>，已统一裁成 16:9 并压缩
const hero = (slug: string, w: number, ext: 'webp' | 'jpg') =>
  `/images/hero/${slug}-${w}.${ext}`

// 非文案元数据保留在代码里，文案从 i18n 按索引取
const slideMeta = [
  { highlight: 'NEON ABYSS', rating: '9.6', slug: 'neon-abyss', bg: 'linear-gradient(135deg, #1a0b2e, #07060f)' },
  { highlight: 'ASTRAL RIFT', rating: '9.8', slug: 'astral-rift', bg: 'linear-gradient(135deg, #0b1a2e, #07060f)' },
  { highlight: 'MECH VANGUARD', rating: '9.4', slug: 'mech-vanguard', bg: 'linear-gradient(135deg, #2e0b1f, #07060f)' },
]

const slides = computed<Slide[]>(() =>
  slideMeta.map((m, i) => ({
    ...m,
    kicker: t(`hero.slides.${i}.kicker`),
    title: t(`hero.slides.${i}.title`),
    desc: t(`hero.slides.${i}.desc`),
    cta: t(`hero.slides.${i}.cta`),
    tags: (tm(`hero.slides.${i}.tags`) as unknown[]).map((m) => rt(m as never)),
  }))
)

const current = ref(0)
const root = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

// 仅首图随初始 DOM 渲染并参与 LCP；其余图懒挂载，切到时才进 DOM，
// 避免初始加载窗口里和首图抢带宽、以及未切换的大图提前成为 LCP 候选。
const loaded = ref(new Set<number>([0]))
function ensureLoaded(i: number) {
  if (loaded.value.has(i)) return
  loaded.value.add(i)
  loaded.value = new Set(loaded.value)
}

// 用 preload 让首图尽早抢跑，并交给预加载扫描器（优先级高于 hydration）
const firstSlug = slideMeta[0].slug
useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      type: 'image/webp',
      href: hero(firstSlug, 1920, 'webp'),
      imagesrcset: `${hero(firstSlug, 1280, 'webp')} 1280w, ${hero(firstSlug, 1920, 'webp')} 1920w`,
      imagesizes: '100vw',
      fetchpriority: 'high',
    },
  ],
})

function animateIn() {
  if (!root.value) return
  const active = root.value.querySelector('.slide.is-active')
  if (!active) return
  gsap.fromTo(
    active.querySelectorAll('.anim'),
    { opacity: 0, y: 40, filter: 'blur(8px)' },
    {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
    }
  )
}

function go(i: number) {
  current.value = (i + slides.value.length) % slides.value.length
  ensureLoaded(current.value)
  nextTick(animateIn)
}
function next() {
  go(current.value + 1)
}
function start() {
  stop()
  timer = setInterval(next, 7000)
}
function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 首图之后再预载其余 slide：避免和 LCP 首图抢带宽，又能让自动轮播切换顺滑。
// 三张图渲染尺寸完全一致，即便提前加载也不会成为"更大"的 LCP 候选。
let restTimer: ReturnType<typeof setTimeout> | null = null
function preloadRest() {
  slideMeta.forEach((_, i) => ensureLoaded(i))
}
function schedulePreloadRest() {
  const run = () => {
    const ric = (window as any).requestIdleCallback
    if (ric) ric(preloadRest, { timeout: 2000 })
    else restTimer = setTimeout(preloadRest, 1200)
  }
  if (document.readyState === 'complete') run()
  else window.addEventListener('load', run, { once: true })
}

onMounted(() => {
  animateIn()
  schedulePreloadRest()
  // 自动轮播：满屏首图是稳定的 LCP 元素，三张图尺寸一致，
  // 切图不会画出"更大"的内容，因此自动播放不会刷新/推后 LCP。
  start()
})
onBeforeUnmount(() => {
  stop()
  if (restTimer) clearTimeout(restTimer)
})
</script>

<template>
  <section ref="root" class="hero">
    <div
      v-for="(s, i) in slides"
      :key="i"
      class="slide"
      :class="{ 'is-active': i === current }"
      :style="{ background: s.bg }"
    >
      <picture v-if="loaded.has(i)">
        <source
          type="image/webp"
          :srcset="`${hero(s.slug, 1280, 'webp')} 1280w, ${hero(s.slug, 1920, 'webp')} 1920w`"
          sizes="100vw"
        />
        <img
          class="slide__img"
          :src="hero(s.slug, 1920, 'jpg')"
          :srcset="`${hero(s.slug, 1280, 'jpg')} 1280w, ${hero(s.slug, 1920, 'jpg')} 1920w`"
          sizes="100vw"
          :alt="s.title"
          :loading="i === 0 ? 'eager' : 'lazy'"
          :fetchpriority="i === 0 ? 'high' : 'auto'"
        />
      </picture>
      <div class="slide__scrim" />
      <div class="slide__scan" />

      <div class="container slide__content">
        <span class="kicker anim">{{ s.kicker }}</span>
        <h1 class="title anim">
          <span class="glitch" :data-text="s.highlight">{{ s.highlight }}</span>
        </h1>
        <div class="cn-title anim">{{ s.title }}</div>
        <p class="desc anim">{{ s.desc }}</p>
        <div class="meta anim">
          <span class="rating">★ {{ s.rating }}</span>
          <span v-for="t in s.tags" :key="t" class="tag">{{ t }}</span>
        </div>
        <div class="actions anim">
          <button v-magnetic class="btn btn-primary">{{ s.cta }} ▶</button>
          <NuxtLink to="/about" class="btn btn-ghost">{{ $t('hero.learnMore') }}</NuxtLink>
        </div>
      </div>
    </div>

    <ParticleField :density="60" />

    <button class="arrow arrow-prev" aria-label="上一张" @click="go(current - 1)">‹</button>
    <button class="arrow arrow-next" aria-label="下一张" @click="go(current + 1)">›</button>

    <!-- 缩略导航 -->
    <div class="thumbs">
      <button
        v-for="(s, i) in slides"
        :key="i"
        class="thumb"
        :class="{ active: i === current }"
        :aria-label="s.title"
        @click="go(i)"
      >
        <span class="thumb__name">{{ s.title }}</span>
        <span class="thumb__bar"><span class="thumb__fill" /></span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  min-height: 640px;
  overflow: hidden;
}
.slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.9s ease, visibility 0.9s;
}
.slide.is-active {
  opacity: 1;
  visibility: visible;
}
.slide__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  transform: scale(1.12);
}
.slide.is-active .slide__img {
  animation: kenburns 8s ease-out forwards;
}
@keyframes kenburns {
  from {
    transform: scale(1.12) translate(0, 0);
  }
  to {
    transform: scale(1) translate(1%, -1%);
  }
}
.slide__scrim {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(90deg, rgba(7, 6, 15, 0.95) 0%, rgba(7, 6, 15, 0.55) 50%, rgba(7, 6, 15, 0.2) 100%),
    linear-gradient(0deg, rgba(7, 6, 15, 0.95) 0%, transparent 45%);
}
/* 扫描线赛博质感 */
.slide__scan {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.025) 0px,
    rgba(255, 255, 255, 0.025) 1px,
    transparent 2px,
    transparent 4px
  );
  pointer-events: none;
}
.slide__content {
  position: relative;
  z-index: 3;
  max-width: 720px;
}
.kicker {
  display: inline-block;
  padding: 8px 18px;
  border-radius: 999px;
  background: rgba(255, 46, 147, 0.15);
  border: 1px solid rgba(255, 46, 147, 0.4);
  color: var(--pink);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
  margin-bottom: 22px;
}
.title {
  font-size: clamp(48px, 9vw, 120px);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -2px;
  text-transform: uppercase;
  color: #fff;
}
.cn-title {
  font-size: clamp(22px, 3vw, 34px);
  font-weight: 700;
  color: var(--cyan);
  letter-spacing: 6px;
  margin-top: 8px;
}
.desc {
  margin-top: 22px;
  font-size: clamp(15px, 2vw, 19px);
  color: var(--text-dim);
  max-width: 560px;
}
.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 22px;
}
.rating {
  color: var(--lime);
  font-weight: 800;
  font-size: 17px;
}
.actions {
  display: flex;
  gap: 14px;
  margin-top: 32px;
  flex-wrap: wrap;
}

.arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(168, 130, 255, 0.1);
  border: 1px solid var(--border);
  color: #fff;
  font-size: 28px;
  line-height: 1;
  backdrop-filter: blur(6px);
  transition: background 0.25s ease, transform 0.25s ease;
}
.arrow:hover {
  background: rgba(168, 85, 255, 0.4);
}
.arrow-prev {
  left: 28px;
}
.arrow-next {
  right: 28px;
}

.thumbs {
  position: absolute;
  bottom: 38px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  gap: 14px;
}
.thumb {
  min-width: 120px;
  text-align: left;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}
.thumb.active {
  opacity: 1;
}
.thumb__name {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
  letter-spacing: 1px;
}
.thumb__bar {
  display: block;
  height: 3px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  overflow: hidden;
}
.thumb__fill {
  display: block;
  height: 100%;
  width: 100%;
  background: var(--gradient);
  transform: scaleX(0);
  transform-origin: left;
}
.thumb.active .thumb__fill {
  animation: fill 7s linear forwards;
}
@keyframes fill {
  to {
    transform: scaleX(1);
  }
}

@media (max-width: 768px) {
  .hero {
    height: 92vh;
  }
  .arrow {
    display: none;
  }
  .title {
    letter-spacing: -1px;
  }
  .cn-title {
    letter-spacing: 3px;
  }
  .thumbs {
    width: 100%;
    padding: 0 16px;
    justify-content: center;
    overflow-x: auto;
  }
  .thumb {
    min-width: 92px;
  }
  .thumb__name {
    font-size: 12px;
  }
}
</style>
