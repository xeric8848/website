<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const { reveal } = useReveal()
const pageRoot = ref<HTMLElement | null>(null)
const statsRoot = ref<HTMLElement | null>(null)

const games = [
  { title: '霓虹深渊', genre: '动作射击', rating: '9.6', price: '免费', image: '1538481199705-c710c4e965fc', badge: '热门' },
  { title: '星界裂痕', genre: '开放世界 RPG', rating: '9.8', price: '￥199', image: '1593305841991-05c297ba4575', badge: '首发' },
  { title: '机甲先锋', genre: 'MOBA 竞技', rating: '9.4', price: '免费', image: '1511512578047-dfb367046420' },
  { title: '极速回廊', genre: '竞速', rating: '9.1', price: '￥98', image: '1547394765-185e1e68f34e' },
  { title: '幽影森林', genre: '冒险解谜', rating: '9.3', price: '￥68', image: '1542751110-97427bbecf20', badge: '-40%' },
  { title: '王座之争', genre: '策略', rating: '9.0', price: '免费', image: '1542038784456-1ea8e935640e' },
]

const genres = [
  { name: '动作射击', count: '1,280+', icon: '🔫', image: '1552820728-8b83bb6b773f' },
  { name: '角色扮演', count: '960+', icon: '⚔️', image: '1486572788966-cfd3df1f5b42' },
  { name: '竞速驾驶', count: '420+', icon: '🏎️', image: '1547394765-185e1e68f34e' },
  { name: '策略经营', count: '730+', icon: '♟️', image: '1611996575749-79a3a250f948' },
]

const stats = [
  { value: 8000, suffix: '+', label: '游戏总量' },
  { value: 120, suffix: 'M', label: '注册玩家' },
  { value: 3.5, suffix: 'M', label: '同时在线', decimals: 1 },
  { value: 99.9, suffix: '%', label: '云端稳定性', decimals: 1 },
]

const features = [
  { icon: '☁️', title: '云端即玩', desc: '无需下载，无需高配置，点开即玩 3A 大作，最高 4K 120 帧串流。' },
  { icon: '🔄', title: '跨设备接力', desc: 'PC、手机、平板、电视无缝切换，进度云端同步，随时接着玩。' },
  { icon: '🏆', title: '成就与排行', desc: '全平台统一成就系统，登顶全球排行榜，赢取专属奖励与徽章。' },
  { icon: '👥', title: '社区与开黑', desc: '内置语音、组队、直播与好友动态，和百万玩家一起开黑。' },
]

const tickerGames = ['霓虹深渊', '星界裂痕', '机甲先锋', '极速回廊', '幽影森林', '王座之争', '深空猎手', '像素勇者']

function runStatsAnim() {
  if (!statsRoot.value) return
  statsRoot.value.querySelectorAll<HTMLElement>('.stat__num').forEach((el) => {
    const target = Number(el.dataset.value)
    const decimals = Number(el.dataset.decimals ?? 0)
    const obj = { v: 0 }
    gsap.to(obj, {
      v: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = obj.v.toFixed(decimals)),
    })
  })
}

onMounted(() => {
  reveal(pageRoot.value)
  runStatsAnim()
  ScrollTrigger.refresh()
})
</script>

<template>
  <div ref="pageRoot">
    <HeroCarousel />

    <!-- 跑马灯 -->
    <section class="ticker">
      <Marquee :items="tickerGames" :speed="28" />
    </section>

    <!-- 热门游戏 -->
    <section class="section">
      <div class="container">
        <div class="head">
          <div>
            <span class="eyebrow reveal">热门游戏</span>
            <h2 class="section-title reveal" data-delay="0.05">
              本周<span class="gradient-text">玩家都在玩</span>
            </h2>
          </div>
          <NuxtLink to="/" class="head__more reveal" data-delay="0.1">查看全部榜单 →</NuxtLink>
        </div>

        <div class="games-grid">
          <div
            v-for="(g, i) in games"
            :key="g.title"
            class="reveal"
            data-from="scale"
            :data-delay="0.05 * i"
          >
            <GameCard v-bind="g" />
          </div>
        </div>
      </div>
    </section>

    <!-- 游戏分类 -->
    <section class="section genres-section">
      <div class="container">
        <div class="head">
          <div>
            <span class="eyebrow reveal">海量品类</span>
            <h2 class="section-title reveal" data-delay="0.05">
              总有一款<span class="gradient-text">为你而生</span>
            </h2>
          </div>
        </div>
        <div class="genres">
          <NuxtLink
            v-for="(g, i) in genres"
            :key="g.name"
            to="/"
            v-tilt="6"
            class="genre reveal"
            data-cursor
            :data-delay="0.06 * i"
            :style="{ backgroundImage: `url(https://images.unsplash.com/photo-${g.image}?auto=format&fit=crop&q=70&w=800)` }"
          >
            <div class="genre__overlay" />
            <div class="genre__body">
              <span class="genre__icon">{{ g.icon }}</span>
              <h3>{{ g.name }}</h3>
              <span class="genre__count">{{ g.count }} 款游戏</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- 数据 -->
    <section ref="statsRoot" class="stats-section">
      <ParticleField :density="40" />
      <div class="container stats">
        <div v-for="s in stats" :key="s.label" class="stat reveal" data-from="scale">
          <div class="stat__value">
            <span class="stat__num" :data-value="s.value" :data-decimals="s.decimals ?? 0">0</span>
            <span class="stat__suffix">{{ s.suffix }}</span>
          </div>
          <div class="stat__label">{{ s.label }}</div>
        </div>
      </div>
    </section>

    <!-- 云游戏特色：视差 -->
    <section class="section feat-section">
      <div class="container feat">
        <div class="feat__text">
          <span class="eyebrow reveal">为何选择 NEXUS</span>
          <h2 class="section-title reveal" data-delay="0.05">
            把游戏厅<br /><span class="gradient-text">装进你的口袋</span>
          </h2>
          <p class="section-sub reveal" data-delay="0.1">
            强大的云端算力，让任何设备都能秒变游戏主机。告别下载、更新与硬件焦虑，纯粹享受游戏本身。
          </p>
          <div class="feat__list">
            <div
              v-for="(f, i) in features"
              :key="f.title"
              class="feat__item reveal"
              data-from="left"
              :data-delay="0.06 * i"
            >
              <span class="feat__icon">{{ f.icon }}</span>
              <div>
                <h3>{{ f.title }}</h3>
                <p>{{ f.desc }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="feat__visual reveal" data-from="right">
          <div class="feat__device" data-parallax="-50">
            <img
              src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?auto=format&fit=crop&q=75&w=900"
              alt="云游戏"
              loading="lazy"
            />
            <div class="feat__device-glow" />
          </div>
          <div class="feat__chip feat__chip--1" data-parallax="40">4K · 120FPS</div>
          <div class="feat__chip feat__chip--2" data-parallax="-30">延迟 &lt; 15ms</div>
        </div>
      </div>
    </section>

    <!-- 会员订阅 CTA -->
    <section class="section">
      <div class="container">
        <div class="cta reveal" data-from="scale">
          <ParticleField :density="50" />
          <div class="cta__inner">
            <span class="tag" style="margin-bottom: 16px">NEXUS+ 会员</span>
            <h2>加入 <span class="gradient-text">NEXUS+</span>，畅玩整个游戏宇宙</h2>
            <p>每月新增数十款大作，云端畅玩、专属折扣、抢先体验，一价全包。</p>
            <div class="cta__price">
              <span class="cta__num">￥38</span>
              <span class="cta__unit">/ 月起</span>
            </div>
            <div class="cta__actions">
              <button v-magnetic class="btn btn-primary">免费试用 7 天 ▶</button>
              <NuxtLink to="/contact" class="btn btn-ghost">联系我们</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ticker {
  padding: 28px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--bg-soft);
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
  gap: 20px;
}
.head__more {
  color: var(--cyan);
  font-weight: 600;
  white-space: nowrap;
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.genres-section {
  background: var(--bg-soft);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.genres {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.genre {
  position: relative;
  height: 260px;
  border-radius: var(--radius);
  overflow: hidden;
  background-size: cover;
  background-position: center;
  border: 1px solid var(--border);
  display: flex;
  align-items: flex-end;
  transform-style: preserve-3d;
  transition: border-color 0.3s ease;
}
.genre:hover {
  border-color: var(--primary);
}
.genre__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(0deg, rgba(7, 6, 15, 0.95), rgba(7, 6, 15, 0.2) 60%, transparent);
  transition: background 0.3s ease;
}
.genre:hover .genre__overlay {
  background: linear-gradient(0deg, rgba(168, 85, 255, 0.55), rgba(7, 6, 15, 0.3) 60%, transparent);
}
.genre__body {
  position: relative;
  padding: 22px;
}
.genre__icon {
  font-size: 30px;
}
.genre__body h3 {
  font-size: 21px;
  font-weight: 800;
  margin: 8px 0 4px;
}
.genre__count {
  color: var(--text-dim);
  font-size: 14px;
}

.stats-section {
  position: relative;
  padding: 80px 0;
  border-bottom: 1px solid var(--border);
  background: radial-gradient(circle at 50% 50%, rgba(168, 85, 255, 0.08), transparent 70%);
  overflow: hidden;
}
.stats {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  text-align: center;
}
.stat__value {
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 800;
}
.stat__num {
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.stat__suffix {
  font-size: 0.5em;
  margin-left: 4px;
  color: var(--cyan);
}
.stat__label {
  color: var(--text-dim);
  font-size: 15px;
  margin-top: 8px;
}

.feat {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
}
.feat__list {
  margin-top: 36px;
  display: grid;
  gap: 22px;
}
.feat__item {
  display: flex;
  gap: 16px;
}
.feat__icon {
  flex-shrink: 0;
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
}
.feat__item h3 {
  font-size: 18px;
  margin-bottom: 4px;
}
.feat__item p {
  color: var(--text-dim);
  font-size: 14px;
}
.feat__visual {
  position: relative;
}
.feat__device {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
}
.feat__device img {
  width: 100%;
  display: block;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
.feat__device-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent, rgba(168, 85, 255, 0.25));
  mix-blend-mode: screen;
}
.feat__chip {
  position: absolute;
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 800;
  font-size: 14px;
  background: rgba(20, 18, 42, 0.85);
  border: 1px solid var(--border);
  backdrop-filter: blur(8px);
  box-shadow: var(--glow);
}
.feat__chip--1 {
  top: 18px;
  right: -14px;
  color: var(--cyan);
}
.feat__chip--2 {
  bottom: 24px;
  left: -14px;
  color: var(--lime);
}

.cta {
  position: relative;
  text-align: center;
  padding: 80px 32px;
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(168, 85, 255, 0.18), rgba(0, 229, 255, 0.12)),
    var(--surface);
  border: 1px solid var(--border);
}
.cta__inner {
  position: relative;
  z-index: 2;
}
.cta h2 {
  font-size: clamp(26px, 4vw, 42px);
  font-weight: 800;
}
.cta p {
  color: var(--text-dim);
  margin: 16px auto 0;
  max-width: 520px;
}
.cta__price {
  margin: 24px 0 28px;
}
.cta__num {
  font-size: 44px;
  font-weight: 800;
  background: var(--gradient);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cta__unit {
  color: var(--text-dim);
  margin-left: 6px;
}
.cta__actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 980px) {
  .games-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .genres {
    grid-template-columns: repeat(2, 1fr);
  }
  .feat {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
@media (max-width: 600px) {
  .games-grid {
    grid-template-columns: 1fr;
  }
  .stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px 16px;
  }
  .head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
