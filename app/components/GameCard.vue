<script setup lang="ts">
defineProps<{
  title: string
  genre: string
  rating: number | string
  price: string
  image: string
  badge?: string
}>()

const img = (id: string, w: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}`
</script>

<template>
  <article v-tilt="8" class="game neon-card" data-cursor>
    <div class="game__media">
      <img
        :src="img(image, 800)"
        :srcset="`${img(image, 600)} 600w, ${img(image, 900)} 900w`"
        sizes="(max-width: 768px) 90vw, 380px"
        :alt="title"
        loading="lazy"
      />
      <span v-if="badge" class="game__badge">{{ badge }}</span>
      <div class="game__shine" />
      <button class="game__play" :aria-label="$t('game.play')">▶</button>
    </div>
    <div class="game__body">
      <div class="game__top">
        <span class="game__genre">{{ genre }}</span>
        <span class="game__rating">★ {{ rating }}</span>
      </div>
      <h3 class="game__title">{{ title }}</h3>
      <div class="game__bottom">
        <span class="game__price">{{ price }}</span>
        <span class="game__cta">{{ $t('game.play') }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.game {
  cursor: pointer;
}
.game__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
}
.game__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}
.game:hover .game__media img {
  transform: scale(1.08);
}
/* 跟随鼠标的高光，--mx/--my 由 v-tilt 写入 */
.game__shine {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--mx, 50%) var(--my, 50%),
    rgba(255, 255, 255, 0.25),
    transparent 45%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}
.game:hover .game__shine {
  opacity: 1;
}
.game__badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #07060f;
  background: var(--lime);
  box-shadow: 0 0 16px rgba(182, 255, 60, 0.6);
}
.game__play {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 18px;
  color: #fff;
  background: rgba(168, 85, 255, 0.85);
  box-shadow: 0 0 24px rgba(168, 85, 255, 0.8);
  transform: translate(-50%, -50%) scale(0);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.game:hover .game__play {
  transform: translate(-50%, -50%) scale(1);
}
.game__body {
  padding: 18px;
}
.game__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.game__genre {
  color: var(--cyan);
  font-weight: 600;
}
.game__rating {
  color: var(--lime);
  font-weight: 700;
}
.game__title {
  font-size: 19px;
  font-weight: 800;
  margin: 8px 0 14px;
}
.game__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.game__price {
  font-weight: 800;
  font-size: 17px;
  background: var(--gradient-2);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.game__cta {
  font-size: 13px;
  color: var(--text-dim);
  transition: color 0.2s ease;
}
.game:hover .game__cta {
  color: var(--text);
}
</style>
