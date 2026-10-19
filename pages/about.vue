<template>
  <div class="arc">
    <ArcFx />
    <PageHero label="▮▮ Character select" title="Player|One." :sub="profile?.tagline || undefined">
      <div class="art" aria-hidden="true">
        <svg viewBox="0 0 200 260"><path d="M60 10h55l-38 240H22zM130 10h55l-38 240H92z" /></svg>
        <img v-if="heroUrl" :src="heroUrl" alt="" @error="heroFailed = true">
      </div>
    </PageHero>
    <section class="dark">
      <div class="about">
        <div class="portrait"><img v-if="avatarUrl" :src="avatarUrl" :alt="profile?.name" @error="avatarFailed = true"><span class="lbl">P1 · {{ profile?.location }}</span></div>
        <div class="bio">
          <p class="lead">{{ profile?.bio }}</p>
          <p v-for="(t, i) in bioParagraphs" :key="i">{{ t }}</p>
          <img v-if="signUrl" class="sign" :src="signUrl" alt="">
          <div class="stats big"><div v-for="(s, i) in profileStats" :key="s.label"><span class="lbl">{{ s.label }} {{ s.value }}</span><i :style="{ '--n': 4 + (i % 3) }" /></div></div>
          <div class="row"><a v-for="s in socialLinks" :key="s.label" class="btn" :href="s.href" target="_blank" rel="noopener">{{ s.label }} ↗</a></div>
        </div>
      </div>
    </section>
    <section v-if="awards.length" class="dark">
      <h2 class="gl">Achievements<br>unlocked.</h2>
      <div class="ach" style="margin-top: 6vh"><div v-for="a in awards" :key="a.id" class="it" style="--c: #F5C518"><span class="lbl">{{ a.year }} · {{ a.organization }}</span><b>{{ a.title }}</b><p v-if="a.description">{{ a.description }}</p></div></div>
    </section>
    <section class="red cta"><p class="lbl">Final round</p><h2 class="gl">Let’s build<br>something.</h2><NuxtLink class="btn s" to="/contact">Start your campaign ↗</NuxtLink></section>
  </div>
</template>

<script setup lang="ts">
const { profile, awards, fetchProfile, fetchAwards, getProfileImageUrl } = useSiteData()
await Promise.all([fetchProfile(), fetchAwards()])

const avatarFailed = ref(false), heroFailed = ref(false)
const avatarUrl = computed(() => (avatarFailed.value ? '' : getProfileImageUrl(profile.value?.avatar_url)))
const heroUrl = computed(() => (heroFailed.value ? '' : getProfileImageUrl(profile.value?.hero_image_url || profile.value?.avatar_url)))
const signUrl = computed(() => getProfileImageUrl(profile.value?.signature_url))
const bioParagraphs = computed(() => String(profile.value?.bio_extended ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean))
const profileStats = computed(() => [
  { value: `${profile.value?.years_experience ?? '—'}+`, label: 'Years' },
  { value: `${profile.value?.projects_count ?? '—'}+`, label: 'Projects' },
  { value: `${profile.value?.certifications_count ?? '—'}`, label: 'Certificates' },
  { value: `${profile.value?.clients_count ?? '—'}+`, label: 'Clients' },
])
const url = (v: string, base: string) => (/^https?:/.test(v) ? v : base + v.replace(/^@/, ''))
const socialLinks = computed(() => {
  const p: any = profile.value || {}
  return [{ label: 'GitHub', href: p.github && url(p.github, 'https://github.com/') }, { label: 'LinkedIn', href: p.linkedin && url(p.linkedin, 'https://linkedin.com/in/') },
    { label: 'Website', href: p.website && url(p.website, 'https://') }].filter((s) => s.href)
})
useSeoMeta(() => ({
  title: `Tentang ${profile.value?.name ?? 'Miftah Pauzan Jamil'} (Lemillion) — Web Developer`,
  description: `Kenali ${profile.value?.name ?? 'Miftah Pauzan Jamil'} — sering juga dicari dengan ejaan Miftah Fauzan Jamil — dikenal sebagai Lemillion, Web Developer di Tasikmalaya. Pengalaman, sertifikasi, dan pencapaian selengkapnya.`,
  ogTitle: `Tentang ${profile.value?.name ?? 'Miftah Pauzan Jamil'} (Lemillion)`,
}))
</script>
