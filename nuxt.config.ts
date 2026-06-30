// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'NEXUS · 次世代云游戏平台',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'NEXUS 次世代云游戏平台 —— 一个账号畅玩万款游戏，跨设备无缝接力，随时随地开玩。',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
        },
      ],
      // 首屏关键样式：随 HTML 同步、阻塞渲染地生效，
      // 避免移动端布局 scoped CSS 加载前导航横排溢出、菜单图标被顶出视口的闪烁。
      style: [
        {
          children:
            'html{overflow-x:clip}body{overflow-x:hidden}' +
            '.nav{position:fixed;inset:0 0 auto 0;z-index:100}' +
            '.nav__inner{display:flex;align-items:center;justify-content:space-between;height:74px}' +
            '.nav__links{display:flex;align-items:center;gap:6px}' +
            '.burger{display:none;flex-direction:column;gap:5px;padding:8px}' +
            '@media (max-width:768px){' +
            '.burger{display:flex}' +
            '.nav__links{position:fixed;inset:74px 0 auto 0;flex-direction:column;align-items:stretch;' +
            'transform:translateY(-130%);opacity:0;pointer-events:none}' +
            '.nav__links.open{transform:translateY(0);opacity:1;pointer-events:auto}' +
            '}',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
})
