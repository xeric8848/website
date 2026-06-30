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
  image: string
  bg: string
}

const img = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=${w}`

const slides: Slide[] = [
  {
    kicker: '本周热门 · 独家首发',
    title: '霓虹深渊',
    highlight: 'NEON ABYSS',
    desc: '潜入永不眠的赛博都市，在子弹与霓虹之间杀出一条生路。Roguelike × 弹幕射击，每一局都是全新的冒险。',
    cta: '免费开玩',
    tags: ['动作射击', 'Roguelike', '多人联机'],
    rating: '9.6',
    image: '1538481199705-c710c4e965fc',
    bg: 'linear-gradient(135deg, #1a0b2e, #07060f)',
  },
  {
    kicker: '年度巨制 · 开放世界',
    title: '星界裂痕',
    highlight: 'ASTRAL RIFT',
    desc: '横跨七大星系的史诗级开放世界。驾驶你的飞船，在星海间贸易、战斗、探索未知文明的遗迹。',
    cta: '进入星海',
    tags: ['开放世界', 'RPG', '太空'],
    rating: '9.8',
    image: '1593305841991-05c297ba4575',
    bg: 'linear-gradient(135deg, #0b1a2e, #07060f)',
  },
  {
    kicker: '电竞主推 · 全球公测',
    title: '机甲先锋',
    highlight: 'MECH VANGUARD',
    desc: '5v5 团队竞技，操控独一无二的机甲战将，在毫秒之间决出胜负。登顶全球排行榜，赢取百万奖池。',
    cta: '加入战场',
    tags: ['MOBA', '电竞', '团队竞技'],
    rating: '9.4',
    image: '1511512578047-dfb367046420',
    bg: 'linear-gradient(135deg, #2e0b1f, #07060f)',
  },
]

const current = ref(0)
const root = ref<HTMLElement | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

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
  current.value = (i + slides.length) % slides.length
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

onMounted(() => {
  animateIn()
  start()
})
onBeforeUnmount(stop)
</script>

<template>
  <section ref="root" class="hero" @mouseenter="stop" @mouseleave="start">
    <div
      v-for="(s, i) in slides"
      :key="i"
      class="slide"
      :class="{ 'is-active': i === current }"
      :style="{ background: s.bg }"
    >
      <img
        class="slide__img"
        :src="img(s.image, 2400)"
        :srcset="`${img(s.image, 1200)} 1200w, ${img(s.image, 2000)} 2000w, ${img(s.image, 2400)} 2400w`"
        sizes="100vw"
        :alt="s.title"
        :loading="i === 0 ? 'eager' : 'lazy'"
        :fetchpriority="i === 0 ? 'high' : 'auto'"
      />
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
          <NuxtLink to="/about" class="btn btn-ghost">了解平台</NuxtLink>
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
