<script setup lang="ts">
const { t, tm, rt } = useI18n()
useHead(() => ({ title: t('contact.title') }))

const { reveal } = useReveal()
const pageRoot = ref<HTMLElement | null>(null)

const form = reactive({
  name: '',
  contact: '',
  topic: 0, // 用索引存储，切换语言不影响选中态
  message: '',
})
const topics = computed(() => (tm('contact.topics') as unknown[]).map((m) => rt(m as never)))
const submitted = ref(false)
const error = ref('')

// 图标/邮箱/链接等非文案信息保留在代码里（邮箱含 @，不能放进 i18n 消息）
const channelMeta = [
  { icon: '🎧', href: 'mailto:support@nexus.gg', value: 'support@nexus.gg' },
  { icon: '🤝', href: 'mailto:partners@nexus.gg', value: 'partners@nexus.gg' },
  { icon: '🕹️', href: 'mailto:dev@nexus.gg', value: 'dev@nexus.gg' },
  { icon: '💬', href: null as string | null, value: '' },
]
const channels = computed(() =>
  channelMeta.map((m, i) => ({
    ...m,
    // 社区频道(无邮箱)的展示文案随语言变化
    value: m.value || t('contact.discord'),
    label: t(`contact.channels.${i}.label`),
    note: t(`contact.channels.${i}.note`),
  }))
)

function submit() {
  error.value = ''
  if (!form.name.trim() || !form.contact.trim() || !form.message.trim()) {
    error.value = t('contact.form.validation')
    return
  }
  submitted.value = true
}

onMounted(() => reveal(pageRoot.value))
</script>

<template>
  <div ref="pageRoot">
    <section class="phero">
      <ParticleField :density="55" />
      <div class="phero__bg" />
      <div class="container">
        <span class="eyebrow reveal">{{ $t('contact.hero.eyebrow') }}</span>
        <h1 class="phero__title reveal" data-delay="0.05">
          {{ $t('contact.hero.titlePre') }}<span class="gradient-text">{{ $t('contact.hero.titleHl') }}</span>
        </h1>
        <p class="phero__sub reveal" data-delay="0.1">
          {{ $t('contact.hero.sub') }}
        </p>
      </div>
    </section>

    <section class="section contact-main">
      <div class="container grid">
        <div class="form-card glass reveal" data-from="left">
          <template v-if="!submitted">
            <h2>{{ $t('contact.form.title') }}</h2>
            <p class="form-card__hint">{{ $t('contact.form.hint') }}</p>

            <div class="field-row">
              <label class="field">
                <span>{{ $t('contact.form.name') }}</span>
                <input v-model="form.name" type="text" :placeholder="$t('contact.form.namePlaceholder')" />
              </label>
              <label class="field">
                <span>{{ $t('contact.form.contact') }}</span>
                <input v-model="form.contact" type="text" :placeholder="$t('contact.form.contactPlaceholder')" />
              </label>
            </div>

            <label class="field">
              <span>{{ $t('contact.form.topic') }}</span>
              <div class="chips">
                <button
                  v-for="(tp, i) in topics"
                  :key="i"
                  type="button"
                  class="chip"
                  :class="{ active: form.topic === i }"
                  @click="form.topic = i"
                >
                  {{ tp }}
                </button>
              </div>
            </label>

            <label class="field">
              <span>{{ $t('contact.form.message') }}</span>
              <textarea v-model="form.message" rows="4" :placeholder="$t('contact.form.messagePlaceholder')" />
            </label>

            <p v-if="error" class="error">{{ error }}</p>
            <button v-magnetic class="btn btn-primary submit" @click="submit">{{ $t('contact.form.submit') }}</button>
          </template>

          <div v-else class="success">
            <div class="success__icon">✓</div>
            <h2>{{ $t('contact.form.successTitle') }}</h2>
            <p>{{ $t('contact.form.successDesc', { name: form.name }) }}</p>
            <button class="btn btn-ghost" @click="submitted = false">{{ $t('contact.form.again') }}</button>
          </div>
        </div>

        <div class="info">
          <div
            v-for="(c, i) in channels"
            :key="i"
            v-tilt="6"
            class="info-item neon-card reveal"
            data-from="right"
            data-cursor
            :data-delay="0.05 * i"
          >
            <span class="info-item__icon">{{ c.icon }}</span>
            <div class="info-item__main">
              <span class="info-item__label">{{ c.label }}<i>{{ c.note }}</i></span>
              <a v-if="c.href" :href="c.href" class="info-item__value">{{ c.value }}</a>
              <span v-else class="info-item__value">{{ c.value }}</span>
            </div>
          </div>

          <div class="hours glass reveal" data-from="right" data-delay="0.2">
            <span class="hours__pulse" />
            <div>
              <strong>{{ $t('contact.hours.title') }}</strong>
              <p>{{ $t('contact.hours.desc') }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.phero {
  position: relative;
  padding: 190px 0 80px;
  overflow: hidden;
}
.phero__bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 80% 0%, rgba(0, 229, 255, 0.18), transparent 45%),
    radial-gradient(circle at 10% 40%, rgba(168, 85, 255, 0.2), transparent 45%);
}
.phero__title {
  position: relative;
  font-size: clamp(38px, 7vw, 70px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -1.5px;
}
.phero__sub {
  position: relative;
  color: var(--text-dim);
  font-size: clamp(16px, 2.2vw, 20px);
  max-width: 620px;
  margin-top: 22px;
}

.contact-main {
  padding-top: 0;
}
.grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 32px;
  align-items: start;
}

.form-card {
  padding: 36px;
  border-radius: 22px;
}
.form-card h2 {
  font-size: 24px;
  font-weight: 800;
}
.form-card__hint {
  color: var(--text-dim);
  font-size: 14px;
  margin: 6px 0 24px;
}
.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.field {
  display: block;
  margin-bottom: 18px;
}
.field > span {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
.field input,
.field textarea {
  width: 100%;
  padding: 13px 16px;
  border-radius: 12px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text);
  font-family: inherit;
  font-size: 15px;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.field input:focus,
.field textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(168, 85, 255, 0.22);
}
.field input::placeholder,
.field textarea::placeholder {
  color: var(--text-dim);
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.chip {
  padding: 9px 18px;
  border-radius: 999px;
  background: var(--bg);
  border: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 14px;
  transition: all 0.2s ease;
}
.chip:hover {
  color: var(--text);
}
.chip.active {
  background: var(--gradient);
  color: #fff;
  border-color: transparent;
}
.error {
  color: #ff7a7a;
  font-size: 14px;
  margin-bottom: 14px;
}
.submit {
  width: 100%;
  justify-content: center;
  margin-top: 6px;
}

.success {
  text-align: center;
  padding: 30px 0;
}
.success__icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 34px;
  color: #fff;
  background: var(--gradient);
  box-shadow: var(--glow);
  animation: pop 0.5s ease;
}
@keyframes pop {
  from {
    transform: scale(0);
  }
}
.success h2 {
  font-size: 24px;
}
.success p {
  color: var(--text-dim);
  margin: 10px 0 24px;
}

.info {
  display: grid;
  gap: 14px;
}
.info-item {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  transform-style: preserve-3d;
}
.info-item__icon {
  font-size: 26px;
}
.info-item__label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-dim);
  margin-bottom: 2px;
}
.info-item__label i {
  font-style: normal;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: rgba(0, 229, 255, 0.12);
  color: var(--cyan);
}
.info-item__value {
  font-size: 16px;
  font-weight: 700;
  transition: color 0.2s ease;
}
a.info-item__value:hover {
  color: var(--primary);
}

.hours {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px;
  border-radius: var(--radius);
}
.hours strong {
  font-size: 16px;
}
.hours p {
  color: var(--text-dim);
  font-size: 13px;
}
.hours__pulse {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--lime);
  box-shadow: 0 0 0 0 rgba(182, 255, 60, 0.6);
  animation: pulse 1.8s infinite;
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(182, 255, 60, 0.6);
  }
  100% {
    box-shadow: 0 0 0 14px rgba(182, 255, 60, 0);
  }
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .phero {
    padding: 150px 0 50px;
  }
}
@media (max-width: 480px) {
  .field-row {
    grid-template-columns: 1fr;
  }
  .form-card {
    padding: 24px;
  }
}
</style>
