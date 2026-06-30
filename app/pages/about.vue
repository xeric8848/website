<script setup lang="ts">
const { t, tm, rt } = useI18n()
useHead(() => ({ title: t('about.title') }))

const { reveal } = useReveal()
const pageRoot = ref<HTMLElement | null>(null)

const valueIcons = ['🎮', '⚡', '🌍', '🛡️']
const values = computed(() =>
  valueIcons.map((icon, i) => ({
    icon,
    title: t(`about.values.items.${i}.title`),
    desc: t(`about.values.items.${i}.desc`),
  }))
)

const teamInitials = ['R', 'K', 'M', 'A']
const team = computed(() =>
  teamInitials.map((initial, i) => ({
    initial,
    name: t(`about.team.members.${i}.name`),
    role: t(`about.team.members.${i}.role`),
  }))
)

const timeline = computed(() =>
  (tm('about.timeline.items') as { year: unknown; text: unknown }[]).map((it) => ({
    year: rt(it.year as never),
    text: rt(it.text as never),
  }))
)

onMounted(() => reveal(pageRoot.value))
</script>

<template>
  <div ref="pageRoot">
    <section class="phero">
      <ParticleField :density="55" />
      <div class="phero__bg" />
      <div class="container">
        <span class="eyebrow reveal">{{ $t('about.hero.eyebrow') }}</span>
        <h1 class="phero__title reveal" data-delay="0.05">
          {{ $t('about.hero.titlePre') }}<span class="glitch gradient-text" :data-text="$t('about.hero.titleHl')">{{ $t('about.hero.titleHl') }}</span>{{ $t('about.hero.titleSuf') }}
        </h1>
        <p class="phero__sub reveal" data-delay="0.1">
          {{ $t('about.hero.sub') }}
        </p>
      </div>
    </section>

    <section class="section">
      <div class="container split">
        <div class="split__text">
          <span class="eyebrow reveal">{{ $t('about.mission.eyebrow') }}</span>
          <h2 class="section-title reveal" data-delay="0.05">
            {{ $t('about.mission.titleLine1') }}<br />{{ $t('about.mission.titleLine2') }}
          </h2>
          <p class="section-sub reveal" data-delay="0.1">
            {{ $t('about.mission.p1') }}
          </p>
          <p class="section-sub reveal" data-delay="0.15">
            {{ $t('about.mission.p2') }}
          </p>
        </div>
        <div class="split__visual reveal" data-from="right">
          <div class="visual-card" v-tilt="10">
            <img
              src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=75&w=900"
              :alt="$t('about.mission.imgAlt')"
              loading="lazy"
            />
            <div class="visual-badge">{{ $t('about.mission.badge') }}</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section values-section">
      <div class="container">
        <div class="head">
          <span class="eyebrow reveal">{{ $t('about.values.eyebrow') }}</span>
          <SplitText tag="h2" class="section-title" :text="$t('about.values.title')" />
        </div>
        <div class="values">
          <div
            v-for="(v, i) in values"
            :key="i"
            v-tilt="8"
            class="value neon-card reveal"
            data-from="scale"
            data-cursor
            :data-delay="0.06 * i"
          >
            <span class="value__icon">{{ v.icon }}</span>
            <h3>{{ v.title }}</h3>
            <p>{{ v.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="head">
          <span class="eyebrow reveal">{{ $t('about.timeline.eyebrow') }}</span>
          <SplitText tag="h2" class="section-title" :text="$t('about.timeline.title')" />
        </div>
        <div class="timeline">
          <div
            v-for="(t, i) in timeline"
            :key="i"
            class="tl-item reveal"
            data-from="left"
            :data-delay="0.05 * i"
          >
            <div class="tl-dot" />
            <div class="tl-year gradient-text">{{ t.year }}</div>
            <p>{{ t.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section team-section">
      <div class="container">
        <div class="head">
          <span class="eyebrow reveal">{{ $t('about.team.eyebrow') }}</span>
          <SplitText tag="h2" class="section-title" :text="$t('about.team.title')" />
        </div>
        <div class="team">
          <div
            v-for="(m, i) in team"
            :key="i"
            v-tilt="10"
            class="member neon-card reveal"
            data-from="scale"
            data-cursor
            :data-delay="0.06 * i"
          >
            <div class="member__avatar">{{ m.initial }}</div>
            <h3>{{ m.name }}</h3>
            <p>{{ m.role }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.phero {
  position: relative;
  padding: 190px 0 100px;
  overflow: hidden;
}
.phero__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 0%, rgba(168, 85, 255, 0.22), transparent 45%),
    radial-gradient(circle at 90% 30%, rgba(0, 229, 255, 0.16), transparent 45%);
}
.phero__title {
  position: relative;
  font-size: clamp(38px, 7vw, 76px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1.5px;
  max-width: 900px;
}
.phero__sub {
  position: relative;
  color: var(--text-dim);
  font-size: clamp(16px, 2.2vw, 20px);
  max-width: 660px;
  margin-top: 24px;
}

.split {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 56px;
  align-items: center;
}
.split__text .section-title {
  margin: 14px 0;
}
.visual-card {
  position: relative;
  border-radius: 22px;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.5);
}
.visual-card img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
}
.visual-badge {
  position: absolute;
  bottom: 16px;
  left: 16px;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(7, 6, 15, 0.75);
  border: 1px solid var(--border);
  font-size: 13px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.head {
  max-width: 720px;
  margin-bottom: 48px;
}

.values-section {
  background: var(--bg-soft);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.values {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.value {
  padding: 30px;
  transform-style: preserve-3d;
}
.value__icon {
  font-size: 32px;
}
.value h3 {
  margin: 14px 0 8px;
  font-size: 19px;
}
.value p {
  color: var(--text-dim);
  font-size: 15px;
}

.timeline {
  position: relative;
  display: grid;
  gap: 4px;
  padding-left: 28px;
}
.timeline::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 6px;
  bottom: 6px;
  width: 2px;
  background: linear-gradient(var(--primary), var(--cyan));
}
.tl-item {
  position: relative;
  padding: 18px 0 18px 24px;
}
.tl-dot {
  position: absolute;
  left: -28px;
  top: 24px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--primary);
  box-shadow: 0 0 0 4px rgba(168, 85, 255, 0.25), 0 0 14px var(--primary);
}
.tl-year {
  font-size: 24px;
  font-weight: 800;
}
.tl-item p {
  color: var(--text-dim);
  margin-top: 4px;
}

.team-section {
  background: var(--bg-soft);
  border-top: 1px solid var(--border);
}
.team {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.member {
  text-align: center;
  padding: 32px 20px;
  transform-style: preserve-3d;
}
.member__avatar {
  width: 84px;
  height: 84px;
  margin: 0 auto 16px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  font-size: 32px;
  font-weight: 800;
  color: #fff;
  background: var(--gradient);
  box-shadow: var(--glow);
}
.member h3 {
  font-size: 18px;
}
.member p {
  color: var(--text-dim);
  font-size: 14px;
  margin-top: 4px;
}

@media (max-width: 980px) {
  .values,
  .team {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .phero {
    padding: 150px 0 70px;
  }
  .split {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}
@media (max-width: 520px) {
  .values,
  .team {
    grid-template-columns: 1fr;
  }
}
</style>
