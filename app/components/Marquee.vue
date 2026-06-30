<script setup lang="ts">
const props = withDefaults(defineProps<{ items: string[]; reverse?: boolean; speed?: number }>(), {
  reverse: false,
  speed: 30,
})
</script>

<template>
  <div class="marquee" :style="{ '--dur': speed + 's' }">
    <div class="marquee__track" :class="{ reverse }">
      <span v-for="(it, i) in [...items, ...items]" :key="i" class="marquee__item">
        {{ it }}
        <span class="marquee__sep">✦</span>
      </span>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  white-space: nowrap;
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}
.marquee__track {
  display: inline-flex;
  animation: scroll var(--dur) linear infinite;
}
.marquee__track.reverse {
  animation-direction: reverse;
}
.marquee:hover .marquee__track {
  animation-play-state: paused;
}
.marquee__item {
  display: inline-flex;
  align-items: center;
  font-size: clamp(28px, 5vw, 56px);
  font-weight: 800;
  letter-spacing: -0.5px;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(168, 130, 255, 0.4);
  text-transform: uppercase;
}
.marquee__sep {
  margin: 0 28px;
  -webkit-text-stroke: 0;
  color: var(--cyan);
  font-size: 0.5em;
}
@keyframes scroll {
  to {
    transform: translateX(-50%);
  }
}
</style>
