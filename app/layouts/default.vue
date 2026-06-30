<script setup lang="ts">
const route = useRoute()
const scrolled = ref(false)
const menuOpen = ref(false)

const links = [
  { to: '/', label: '首页' },
  { to: '/about', label: '关于我们' },
  { to: '/contact', label: '联系我们' },
]

function onScroll() {
  scrolled.value = window.scrollY > 30
}
watch(() => route.fullPath, () => (menuOpen.value = false))

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <div class="app">
    <ScrollProgress />
    <CursorGlow />

    <header class="nav" :class="{ 'nav--solid': scrolled }">
      <div class="container nav__inner">
        <NuxtLink to="/" class="brand" data-cursor>
          <span class="brand__mark">N</span>
          <span class="brand__text">NEXUS<span class="brand__dot">.</span></span>
        </NuxtLink>

        <nav class="nav__links" :class="{ open: menuOpen }">
          <NuxtLink
            v-for="l in links"
            :key="l.to"
            :to="l.to"
            class="nav__link"
            :class="{ active: route.path === l.to }"
          >
            {{ l.label }}
          </NuxtLink>
          <button v-magnetic class="btn btn-primary nav__cta">下载客户端</button>
        </nav>

        <button class="burger" :class="{ open: menuOpen }" aria-label="菜单" @click="menuOpen = !menuOpen">
          <span /><span /><span />
        </button>
      </div>
    </header>

    <main>
      <slot />
    </main>

    <footer class="footer">
      <div class="container footer__inner">
        <div class="footer__brand">
          <div class="brand">
            <span class="brand__mark">N</span>
            <span class="brand__text">NEXUS<span class="brand__dot">.</span></span>
          </div>
          <p>次世代云游戏平台。<br />一个账号，畅玩万款游戏，跨设备无缝接力。</p>
          <div class="socials">
            <a v-for="s in ['🎮', '💬', '📺', '🐦']" :key="s" href="#" class="social" data-cursor>{{ s }}</a>
          </div>
        </div>

        <div class="footer__col">
          <h4>游戏</h4>
          <NuxtLink to="/">热门榜单</NuxtLink>
          <NuxtLink to="/">新品首发</NuxtLink>
          <NuxtLink to="/">限时折扣</NuxtLink>
          <NuxtLink to="/">免费畅玩</NuxtLink>
        </div>
        <div class="footer__col">
          <h4>平台</h4>
          <NuxtLink to="/about">关于我们</NuxtLink>
          <NuxtLink to="/about">会员订阅</NuxtLink>
          <NuxtLink to="/contact">联系我们</NuxtLink>
          <NuxtLink to="/contact">加入我们</NuxtLink>
        </div>
        <div class="footer__col">
          <h4>支持</h4>
          <a href="mailto:support@nexus.gg">support@nexus.gg</a>
          <NuxtLink to="/contact">帮助中心</NuxtLink>
          <NuxtLink to="/contact">开发者合作</NuxtLink>
        </div>
      </div>
      <div class="container footer__bottom">
        <span>© 2026 NEXUS 游戏平台 · 保留所有权利</span>
        <span>沪ICP备 0000000 号（demo）</span>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 100;
  transition: background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease;
  border-bottom: 1px solid transparent;
}
.nav--solid {
  background: rgba(7, 6, 15, 0.7);
  backdrop-filter: blur(16px);
  border-bottom-color: var(--border);
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 74px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 800;
  font-size: 22px;
  letter-spacing: 1px;
}
.brand__mark {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 18px;
  background: var(--gradient);
  box-shadow: 0 0 18px rgba(168, 85, 255, 0.6);
}
.brand__dot {
  color: var(--cyan);
}
.nav__links {
  display: flex;
  align-items: center;
  gap: 6px;
}
.nav__link {
  padding: 8px 16px;
  border-radius: 10px;
  color: var(--text-dim);
  font-weight: 600;
  font-size: 15px;
  transition: color 0.2s ease, background 0.2s ease;
}
.nav__link:hover {
  color: var(--text);
}
.nav__link.active {
  color: var(--text);
  background: rgba(168, 130, 255, 0.1);
}
.nav__cta {
  margin-left: 12px;
  padding: 11px 22px;
  font-size: 14px;
}
.burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 8px;
}
.burger span {
  width: 24px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.burger.open span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.burger.open span:nth-child(2) {
  opacity: 0;
}
.burger.open span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

.footer {
  position: relative;
  border-top: 1px solid var(--border);
  background: var(--bg-soft);
  padding-top: 64px;
}
.footer__inner {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 44px;
}
.footer__brand p {
  color: var(--text-dim);
  margin-top: 16px;
  font-size: 15px;
}
.socials {
  display: flex;
  gap: 12px;
  margin-top: 18px;
}
.social {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  transition: transform 0.25s ease, border-color 0.25s ease;
}
.social:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
}
.footer__col h4 {
  font-size: 14px;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
}
.footer__col a {
  display: block;
  color: var(--text-dim);
  font-size: 15px;
  margin-bottom: 10px;
  transition: color 0.2s ease;
}
.footer__col a:hover {
  color: var(--primary);
}
.footer__bottom {
  display: flex;
  justify-content: space-between;
  padding: 22px 24px;
  border-top: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 13px;
}

@media (max-width: 768px) {
  .burger {
    display: flex;
  }
  .nav__links {
    position: fixed;
    inset: 74px 0 auto 0;
    flex-direction: column;
    align-items: stretch;
    gap: 4px;
    padding: 20px;
    background: rgba(7, 6, 15, 0.97);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    transform: translateY(-130%);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.35s ease, opacity 0.35s ease;
  }
  .nav__links.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .nav__link {
    padding: 14px 16px;
    font-size: 17px;
  }
  .nav__cta {
    margin: 8px 0 0;
    justify-content: center;
  }
  .footer__inner {
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }
  .footer__brand {
    grid-column: 1 / -1;
  }
  .footer__bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
