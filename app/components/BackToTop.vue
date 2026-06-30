<script setup lang="ts">
const { t } = useI18n()
const visible = ref(false)
const progress = ref(0)

function onScroll() {
  const h = document.documentElement
  const max = h.scrollHeight - h.clientHeight
  // 滚动超过半屏高度才显示
  visible.value = h.scrollTop > h.clientHeight * 0.5
  progress.value = max > 0 ? (h.scrollTop / max) * 100 : 0
}

function toTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <Transition name="btt">
    <button
      v-show="visible"
      class="back-to-top"
      :aria-label="t('backToTop')"
      :title="t('backToTop')"
      data-cursor
      :style="{ '--p': progress }"
      @click="toTop"
    >
      <span class="back-to-top__ring" aria-hidden="true" />
      <svg class="back-to-top__arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 28px;
  bottom: 28px;
  z-index: 150;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: var(--text);
  background: rgba(20, 18, 42, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid var(--border);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
  cursor: pointer;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, color 0.25s ease;
}
.back-to-top:hover {
  color: #fff;
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: var(--glow), 0 8px 28px rgba(0, 0, 0, 0.45);
}
/* 用 conic-gradient 把滚动进度画成发光描边 */
.back-to-top__ring {
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  padding: 1.5px;
  background: conic-gradient(
    from -90deg,
    var(--primary) 0%,
    var(--pink) calc(var(--p) * 0.5%),
    var(--cyan) calc(var(--p) * 1%),
    rgba(168, 130, 255, 0.12) calc(var(--p) * 1%)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}
.back-to-top__arrow {
  width: 22px;
  height: 22px;
  position: relative;
  z-index: 1;
  transition: transform 0.25s ease;
}
.back-to-top:hover .back-to-top__arrow {
  transform: translateY(-2px);
}

/* 进入/离开动画 */
.btt-enter-active,
.btt-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.btt-enter-from,
.btt-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.85);
}

@media (max-width: 768px) {
  .back-to-top {
    right: 16px;
    bottom: 16px;
    width: 46px;
    height: 46px;
  }
  .back-to-top__arrow {
    width: 20px;
    height: 20px;
  }
}
</style>
