<template>
  <div class="min-h-screen bg-[#0C0A07]">

    <!-- Hero -->
    <div class="relative min-h-[60vh] flex items-end overflow-hidden">
      <div class="absolute inset-0 z-0">
        <img v-if="heroUrl" :src="heroUrl" alt="About hero"
          class="w-full h-full object-cover object-top opacity-35"
          loading="lazy"
          @error="heroUrl = ''" />
        <div class="absolute inset-0" style="background:radial-gradient(ellipse at 60% 40%,rgba(201,150,58,0.08) 0%,transparent 60%),linear-gradient(135deg,#0C0A07 0%,#1a1208 50%,#0C0A07 100%);" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#0C0A07] via-[#0C0A07]/40 to-transparent" />
      </div>
      <div class="relative z-10 max-w-7xl mx-auto px-8 pb-20 pt-36 w-full">
        <div class="flex items-center gap-4 mb-6" data-aos="fade-up">
          <div class="h-px w-12" style="background:linear-gradient(to right,transparent,#C9963A);" />
          <span class="font-mono text-[9px] tracking-[0.5em] uppercase" style="color:rgba(201,150,58,0.55);">The Developer Behind The Code</span>
        </div>
        <h1 class="font-display uppercase leading-none gold-text" style="font-size:clamp(5rem,11vw,10rem);" data-aos="fade-up" data-aos-delay="100">
          {{ profile?.name?.split(' ')[0] ?? 'Miftah' }}<br/>{{ profile?.name?.split(' ').slice(1).join(' ') ?? 'Pauzan Jamil' }}
        </h1>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-7xl mx-auto px-8 py-20">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-16">

        <!-- Left: photo + stats + socials -->
        <div class="md:col-span-4 space-y-8">

          <div class="relative" data-aos="fade-right">
            <div class="absolute -inset-4 border z-0" style="border-color:rgba(201,150,58,0.08);" />
            <div class="relative z-10 aspect-[3/4] overflow-hidden" style="background:linear-gradient(135deg,#1a1208,#2a1e10,#1a1208);">
              <img v-if="avatarUrl" :src="avatarUrl" :alt="profile?.name"
                class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                loading="lazy"
                @error="avatarUrl = ''" />
              <div class="absolute inset-0 flex items-center justify-center" :class="avatarUrl ? 'opacity-0' : ''">
                <span class="font-display" style="font-size:9rem;color:rgba(201,150,58,0.07);">{{ profile?.name?.charAt(0) ?? 'M' }}</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-[#0C0A07]/40 via-transparent to-transparent" />
            </div>
            <svg class="absolute top-0 left-0 z-20" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M0 22V0H22" stroke="#C9963A" stroke-width="1.5" stroke-opacity="0.4"/></svg>
            <svg class="absolute bottom-0 right-0 z-20 rotate-180" width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M0 22V0H22" stroke="#C9963A" stroke-width="1.5" stroke-opacity="0.4"/></svg>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-px border" style="background:rgba(201,150,58,0.08);border-color:rgba(201,150,58,0.1);" data-aos="fade-up">
            <div v-for="s in profileStats" :key="s.label" class="bg-[#0C0A07] py-6 px-4 text-center">
              <span class="block font-display text-3xl mb-1 gold-text">{{ s.value }}</span>
              <span class="font-mono text-[8px] tracking-[0.25em] uppercase" style="color:rgba(245,240,232,0.2);">{{ s.label }}</span>
            </div>
          </div>

          <!-- Social links -->
          <div class="space-y-0" data-aos="fade-up">
            <p class="font-mono text-[9px] tracking-[0.4em] uppercase mb-5" style="color:rgba(201,150,58,0.4);">Connect</p>
            <template v-for="s in socialLinks" :key="s.label">
              <a v-if="s.url" :href="s.href" target="_blank" rel="noopener"
                class="flex items-center justify-between py-3.5 border-b group transition-colors duration-300 hover:text-[#C9963A]"
                style="border-color:rgba(201,150,58,0.07);color:rgba(245,240,232,0.28);">
                <span class="font-body text-sm">{{ s.label }}</span>
                <span class="text-xs transition-transform group-hover:translate-x-1 duration-300">→</span>
              </a>
            </template>
          </div>
        </div>

        <!-- Right: story + achievements -->
        <div class="md:col-span-8">
          <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-10" style="color:rgba(201,150,58,0.4);" data-aos="fade-up">// My Story</p>

          <div class="space-y-7 mb-14">
            <p v-if="profile?.bio" class="font-serif text-2xl italic leading-relaxed" style="color:rgba(245,240,232,0.58);" data-aos="fade-up" data-aos-delay="50">
              {{ profile.bio }}
            </p>
            <template v-if="bioParagraphs.length">
              <p
                v-for="(para, i) in bioParagraphs" :key="i"
                class="font-body text-base leading-relaxed"
                style="color:rgba(245,240,232,0.36);"
                data-aos="fade-up" :data-aos-delay="100 + Number(i) * 50"
              >{{ para }}</p>
            </template>
          </div>

          <div class="h-px opacity-10 my-12" style="background:linear-gradient(to right,transparent,#C9963A,transparent);" data-aos="fade-up" />

          <!-- Achievements / Certifications -->
          <div v-if="awards.length" data-aos="fade-up">
            <p class="font-mono text-[9px] tracking-[0.4em] uppercase mb-8" style="color:rgba(201,150,58,0.4);">// Achievements & Certifications</p>
            <div class="space-y-0">
              <div
                v-for="award in awards" :key="award.id"
                class="flex items-start gap-7 py-5 border-b group transition-colors"
                style="border-color:rgba(201,150,58,0.07);"
              >
                <span class="font-mono text-[9px] tracking-widest flex-shrink-0 pt-0.5" style="color:rgba(201,150,58,0.28);">{{ award.year }}</span>
                <div>
                  <p class="font-display text-sm tracking-wide uppercase group-hover:text-[#E8C96A] transition-colors" style="color:rgba(245,240,232,0.52);">{{ award.title }}</p>
                  <p class="font-body text-xs mt-1" style="color:rgba(245,240,232,0.2);">{{ award.organization }}</p>
                  <p v-if="award.description" class="font-body text-xs mt-1 italic" style="color:rgba(245,240,232,0.18);">{{ award.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <section class="relative py-28 bg-[#080604]">
      <div class="absolute inset-0" style="background:radial-gradient(ellipse at center,rgba(201,150,58,0.05) 0%,transparent 60%);" />
      <div class="relative z-10 max-w-3xl mx-auto px-8 text-center">
        <h2 class="font-display uppercase leading-none mb-8 gold-text" style="font-size:clamp(2.5rem,6vw,5rem);" data-aos="fade-up">Let's Build<br/>Together</h2>
        <div class="flex flex-wrap justify-center gap-5" data-aos="fade-up" data-aos-delay="100">
          <NuxtLink to="/contact" class="inline-flex items-center font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 transition-all hover:-translate-y-0.5" style="background:linear-gradient(135deg,#C9963A,#E8C96A,#C9963A);color:#1a1208;font-weight:700;">Diskusikan Proyek</NuxtLink>
          <NuxtLink to="/portfolio" class="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] uppercase px-10 py-4 border transition-all" style="border-color:rgba(201,150,58,0.32);color:#C9963A;">Lihat Portfolio →</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { profile, awards, fetchProfile, fetchAwards, getProfileImageUrl } = useSiteData()

const avatarUrl = ref('')
const heroUrl   = ref('')

const bioParagraphs = computed(() => {
  const bio = profile.value?.bio_extended ?? ''
  return bio.split('\n\n').map((p: string) => p.trim()).filter(Boolean)
})

const profileStats = computed(() => [
  { value: `${profile.value?.years_experience ?? '—'}+`,     label: 'Years' },
  { value: `${profile.value?.projects_count ?? '—'}+`,       label: 'Projects' },
  { value: `${profile.value?.certifications_count ?? '—'}`,  label: 'Certificates' },
  { value: `${profile.value?.clients_count ?? '—'}+`,        label: 'Clients' },
])

const socialLinks = computed(() => [
  { label: `GitHub · ${profile.value?.github ?? 'lemillion'}`, url: profile.value?.github, href: `https://github.com/${profile.value?.github ?? 'lemillion'}` },
  { label: `LinkedIn`,                                          url: profile.value?.linkedin, href: `https://linkedin.com/in/${profile.value?.linkedin ?? ''}` },
  { label: `Website`,                                           url: profile.value?.website,  href: profile.value?.website ?? '#' },
])

useSeoMeta(() => ({
  title: `Tentang ${profile.value?.name ?? 'Miftah Pauzan Jamil'} (Lemillion) — Web Developer`,
  description: `Kenali ${profile.value?.name ?? 'Miftah Pauzan Jamil'}, dikenal sebagai Lemillion — Web Developer di Tasikmalaya. Pengalaman, sertifikasi, dan pencapaian selengkapnya.`,
  ogTitle: `Tentang ${profile.value?.name ?? 'Miftah Pauzan Jamil'} (Lemillion)`,
}))

onMounted(async () => {
  await Promise.all([fetchProfile(), fetchAwards()])
  avatarUrl.value = getProfileImageUrl(profile.value?.avatar_url)
  heroUrl.value   = getProfileImageUrl(profile.value?.hero_image_url)
})
</script>
