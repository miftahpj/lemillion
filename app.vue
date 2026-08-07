<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// JSON-LD (Person + WebSite) global — bantu Google paham identitas
// "Miftah Pauzan Jamil" / "Lemillion" langsung dari hasil pencarian
// (rich result / knowledge panel), bukan cuma dari teks halaman.
const { profile, fetchProfile } = useSiteData()
const config = useRuntimeConfig()

if (!profile.value) await fetchProfile()

useHead(() => {
  const p = profile.value
  const siteUrl = config.public.siteUrl
  const sameAs = [p?.github, p?.linkedin, p?.website].filter(Boolean)

  return {
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [
            {
              '@type': 'Person',
              '@id': `${siteUrl}/#person`,
              name: p?.name || 'Miftah Pauzan Jamil',
              alternateName: 'Lemillion',
              jobTitle: p?.tagline || 'Web Developer',
              description: p?.bio || undefined,
              url: siteUrl,
              image: p?.avatar_url || undefined,
              email: p?.email ? `mailto:${p.email}` : undefined,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Tasikmalaya',
                addressRegion: 'Jawa Barat',
                addressCountry: 'ID',
              },
              sameAs: sameAs.length ? sameAs : undefined,
            },
            {
              '@type': 'WebSite',
              '@id': `${siteUrl}/#website`,
              name: 'Miftah Pauzan Jamil — Lemillion',
              url: siteUrl,
              inLanguage: 'id-ID',
              publisher: { '@id': `${siteUrl}/#person` },
            },
          ],
        }),
      },
    ],
  }
})
</script>
