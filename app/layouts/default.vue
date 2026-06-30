<script setup lang="ts">
const route = useRoute()
const { locale, setLocale } = useI18n()
const scrolled = ref(false)
const menuOpen = ref(false)

const links = [
  { to: '/', key: 'home' },
  { to: '/about', key: 'about' },
  { to: '/contact', key: 'contact' },
]

function toggleLang() {
  setLocale(locale.value === 'zh' ? 'en' : 'zh')
}

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
    <BackToTop />

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
            {{ $t('nav.' + l.key) }}
          </NuxtLink>
          <button class="lang-toggle" :aria-label="$t('lang.switch')" @click="toggleLang">
            <span class="lang-toggle__icon">🌐</span>
            <span class="lang-toggle__text">{{ locale === 'zh' ? $t('lang.en') : $t('lang.zh') }}</span>
          </button>
          <button v-magnetic class="btn btn-primary nav__cta">{{ $t('nav.download') }}</button>
        </nav>

        <div class="nav__mobile">
          <button class="lang-toggle lang-toggle--mobile" :aria-label="$t('lang.switch')" @click="toggleLang">
            <span class="lang-toggle__icon">🌐</span>
            <span class="lang-toggle__text">{{ locale === 'zh' ? $t('lang.en') : $t('lang.zh') }}</span>
          </button>
          <button class="burger" :class="{ open: menuOpen }" :aria-label="$t('nav.menu')" @click="menuOpen = !menuOpen">
            <span /><span /><span />
          </button>
        </div>
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
          <p>{{ $t('footer.tagline') }}</p>
          <div class="socials">
            <a v-for="s in ['🎮', '💬', '📺', '🐦']" :key="s" href="#" class="social" data-cursor>{{ s }}</a>
          </div>
        </div>

        <div class="footer__col">
          <h4>{{ $t('footer.games.title') }}</h4>
          <NuxtLink to="/">{{ $t('footer.games.hot') }}</NuxtLink>
          <NuxtLink to="/">{{ $t('footer.games.new') }}</NuxtLink>
          <NuxtLink to="/">{{ $t('footer.games.sale') }}</NuxtLink>
          <NuxtLink to="/">{{ $t('footer.games.free') }}</NuxtLink>
        </div>
        <div class="footer__col">
          <h4>{{ $t('footer.platform.title') }}</h4>
          <NuxtLink to="/about">{{ $t('footer.platform.about') }}</NuxtLink>
          <NuxtLink to="/about">{{ $t('footer.platform.membership') }}</NuxtLink>
          <NuxtLink to="/contact">{{ $t('footer.platform.contact') }}</NuxtLink>
          <NuxtLink to="/contact">{{ $t('footer.platform.join') }}</NuxtLink>
        </div>
        <div class="footer__col">
          <h4>{{ $t('footer.support.title') }}</h4>
          <a href="mailto:support@nexus.gg">support@nexus.gg</a>
          <NuxtLink to="/contact">{{ $t('footer.support.help') }}</NuxtLink>
          <NuxtLink to="/contact">{{ $t('footer.support.dev') }}</NuxtLink>
        </div>
      </div>
      <div class="container footer__bottom">
        <span>{{ $t('footer.copyright') }}</span>
        <span>{{ $t('footer.icp') }}</span>
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
  white-space: nowrap;
}
.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--border);
  color: var(--text-dim);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  white-space: nowrap;
  transition: color 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}
.lang-toggle:hover {
  color: var(--text);
  border-color: var(--primary);
  background: rgba(168, 130, 255, 0.1);
}
.lang-toggle__icon {
  font-size: 14px;
  line-height: 1;
}
.nav__mobile {
  display: none;
  align-items: center;
  gap: 8px;
}
.burger {
  display: flex;
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
  .nav__mobile {
    display: flex;
  }
  /* 移动端用栏内独立的语言按钮，隐藏下拉菜单里的那个，避免重复 */
  .nav__links .lang-toggle {
    display: none;
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
