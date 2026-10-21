<template>
  <div class="min-h-screen bg-[#0C0D10] flex font-body">
    <aside class="w-56 min-h-screen bg-[#14151A] border-r fixed left-0 top-0 flex flex-col z-40" style="border-color:rgba(255,59,59,0.08);">
      <div class="px-6 py-7 border-b" style="border-color:rgba(255,59,59,0.08);">
        <NuxtLink to="/"><p class="font-display text-base tracking-[0.35em] gold-text uppercase">Lemillion</p></NuxtLink>
      </div>
      <nav class="flex-1 py-4 px-3 space-y-0.5">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to" class="flex items-center gap-3 px-4 py-3 transition-all font-mono text-[10px] tracking-widest uppercase" active-class="bg-[#FF3B3B]/8 border border-[#FF3B3B]/15 text-[#FF3B3B]" style="color:rgba(244,247,249,0.25);">
          <span class="text-base select-none">{{ item.icon }}</span>{{ item.label }}
        </NuxtLink>
      </nav>
      <div class="px-6 py-5 border-t" style="border-color:rgba(255,59,59,0.08);">
        <button @click="signOut" class="font-mono text-[9px] tracking-widest uppercase hover:text-[#FF3B3B] transition-colors" style="color:rgba(255,59,59,0.35);">Sign Out →</button>
      </div>
    </aside>
    <main class="ml-56 flex-1 p-8">
      <div class="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style="color:rgba(255,59,59,0.4);">// Kelola</p>
          <h1 class="font-display text-3xl uppercase tracking-wide gold-text">Portfolio</h1>
        </div>
        <div class="flex items-center gap-5">
          <p class="font-body text-sm" style="color:rgba(244,247,249,0.3);">{{ items.length }} karya · {{ publishedCount }} live</p>
          <button @click="openNew" class="font-mono text-[10px] tracking-[0.3em] uppercase px-5 py-3 transition-all" style="background:linear-gradient(135deg,#FF3B3B,#F5C518,#FF3B3B);color:#1D1F27;font-weight:700;">＋ Tambah Karya</button>
        </div>
      </div>
      <div class="h-px mb-8 opacity-15" style="background:linear-gradient(to right,transparent,#FF3B3B,transparent);" />
      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-px h-16" style="background:linear-gradient(to bottom,#FF3B3B,transparent);" />
      </div>
      <template v-else>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <button @click="openNew" class="add-tile aspect-[4/5] flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-all" style="border-color:rgba(255,59,59,0.35);color:#FF3B3B;">
            <span class="text-4xl leading-none">＋</span>
            <span class="font-mono text-[9px] tracking-widest uppercase">Tambah karya baru</span>
          </button>
          <div v-for="item in items" :key="item.id" class="group relative border overflow-hidden" :class="{ 'opacity-60': !item.is_published }" style="border-color:rgba(255,255,255,0.05);">
            <div class="aspect-[4/5] relative" style="background:linear-gradient(135deg,#1D1F27,#262830,#1D1F27);">
              <img v-if="getImageUrl(item.cover_url)" :src="getImageUrl(item.cover_url)" :alt="item.title" class="w-full h-full object-cover" @error="($event.target as HTMLImageElement).style.display='none'" />
              <span v-if="!item.is_published" class="absolute top-2 left-2 font-mono text-[8px] tracking-widest uppercase px-2 py-1" style="background:#14151A;color:rgba(244,247,249,0.6);border:1px solid rgba(255,255,255,0.15);">Draft</span>
              <div class="absolute inset-0 bg-gradient-to-t from-[#0C0D10]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end gap-2 pb-4">
                <button @click="openEdit(item)" class="font-mono text-[8px] px-3 py-1 border transition-all" style="color:#F4F7F9;border-color:rgba(255,255,255,0.18);">✎ Edit</button>
                <div class="flex gap-2">
                  <button @click="toggleFeatured(item)" class="font-mono text-[8px] px-2 py-1 border transition-all" :style="item.is_featured ? 'color:#FF3B3B;border-color:rgba(255,59,59,0.4);' : 'color:rgba(244,247,249,0.3);border-color:rgba(255,255,255,0.1);'">★ Featured</button>
                  <button @click="togglePublished(item)" class="font-mono text-[8px] px-2 py-1 border transition-all" :style="item.is_published ? 'color:rgba(52,211,153,0.7);border-color:rgba(52,211,153,0.25);' : 'color:rgba(244,247,249,0.2);border-color:rgba(255,255,255,0.06);'">{{ item.is_published ? '✓ Live' : '○ Draft' }}</button>
                </div>
              </div>
            </div>
            <div class="p-3">
              <p class="font-mono text-[8px] tracking-widest uppercase mb-0.5" style="color:rgba(255,59,59,0.4);">{{ item.categories?.name ?? '—' }} · {{ item.year }}</p>
              <p class="font-body text-xs truncate" style="color:rgba(244,247,249,0.55);">{{ item.title }}</p>
              <p class="font-mono text-[8px] mt-1 truncate" :style="item.demo_url ? 'color:rgba(52,211,153,0.6);' : 'color:rgba(244,247,249,0.15);'">{{ item.demo_url ? '🔗 ' + item.demo_url : 'Belum ada link demo' }}</p>
            </div>
          </div>
        </div>
        <p v-if="!items.length" class="font-mono text-[10px] tracking-widest uppercase mt-8" style="color:rgba(244,247,249,0.3);">Belum ada karya — klik "Tambah Karya" untuk mulai.</p>
      </template>
    </main>

    <!-- ══ FORM TAMBAH / EDIT KARYA ══ -->
    <Transition name="modal">
      <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto px-4 py-8" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);" @click.self="closeForm">
        <form class="w-full max-w-2xl mx-auto border p-7" style="background:#14151A;border-color:rgba(255,59,59,0.2);" @submit.prevent="save" @dragover.prevent @drop.prevent>
          <p class="font-mono text-[9px] tracking-[0.4em] uppercase mb-2" style="color:rgba(255,59,59,0.5);">// {{ editingId ? 'Edit Karya' : 'Karya Baru' }}</p>
          <h2 class="font-display text-2xl uppercase tracking-wide gold-text mb-6 truncate">{{ form.title || 'Tanpa judul' }}</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="sm:col-span-2"><span class="lab">Judul *</span><input v-model="form.title" required class="fld" placeholder="Nama proyek" /></label>
            <label><span class="lab">Kategori</span>
              <select v-model="form.category_id" class="fld"><option value="">— Tanpa kategori —</option><option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option></select>
            </label>
            <label><span class="lab">Tahun</span><input v-model="form.year" type="number" min="2000" max="2100" class="fld" /></label>
            <label class="sm:col-span-2"><span class="lab">Deskripsi singkat</span><textarea v-model="form.description" rows="2" class="fld" /></label>
            <label class="sm:col-span-2"><span class="lab">Cerita / studi kasus</span><textarea v-model="form.story" rows="4" class="fld" /></label>

            <div class="sm:col-span-2">
              <span class="lab">Foto cover</span>
              <div
                class="dz flex items-center gap-4 p-4" :class="{ 'dz-over': dragCover }"
                @click="coverInput?.click()"
                @dragenter.prevent="dragCover = true" @dragover.prevent="dragCover = true"
                @dragleave.prevent="leaveCover" @drop.prevent="dropCover"
              >
                <div class="w-28 h-36 border flex items-center justify-center overflow-hidden shrink-0" style="border-color:rgba(255,255,255,0.12);background:#1D1F27;">
                  <img v-if="getImageUrl(form.cover_url)" :src="getImageUrl(form.cover_url)" alt="" class="w-full h-full object-cover" />
                  <span v-else class="font-mono text-[8px] tracking-widest uppercase text-center px-2" style="color:rgba(244,247,249,0.3);">Belum ada foto</span>
                </div>
                <div class="flex flex-col gap-2 items-start">
                  <p class="font-mono text-[10px] tracking-widest uppercase" :style="dragCover ? 'color:#FF3B3B;' : 'color:rgba(244,247,249,0.7);'">{{ dragCover ? 'Lepaskan foto di sini' : 'Drag & drop foto ke sini' }}</p>
                  <p class="font-body text-xs" style="color:rgba(244,247,249,0.3);">atau klik area ini untuk pilih dari perangkat · JPG, PNG, WebP, GIF · dikompres otomatis</p>
                  <button v-if="form.cover_url" type="button" class="upl" style="color:#f87171;border-color:rgba(248,113,113,0.3);" @click.stop="form.cover_url = ''">✕ Hapus foto</button>
                </div>
                <input ref="coverInput" type="file" accept="image/*" class="hidden" @click.stop @change="pickCover" />
              </div>
            </div>
            <div class="sm:col-span-2">
              <span class="lab">Galeri ({{ form.gallery_urls.length }} foto)</span>
              <div
                class="dz flex flex-wrap gap-3 p-4" :class="{ 'dz-over': dragGallery }"
                @dragenter.prevent="dragGallery = true" @dragover.prevent="dragGallery = true"
                @dragleave.prevent="leaveGallery" @drop.prevent="dropGallery"
              >
                <div v-for="(g, i) in form.gallery_urls" :key="g + i" class="relative w-24 h-24 border overflow-hidden" style="border-color:rgba(255,255,255,0.12);">
                  <img :src="getImageUrl(g)" alt="" class="w-full h-full object-cover" />
                  <button type="button" class="absolute top-1 right-1 w-6 h-6 text-xs" style="background:#14151Acc;color:#f87171;" aria-label="Hapus foto" @click="form.gallery_urls.splice(i, 1)">✕</button>
                </div>
                <button type="button" class="upl w-24 h-24 flex flex-col items-center justify-center gap-1" @click="galleryInput?.click()"><span class="text-2xl leading-none">＋</span><span>Tambah</span></button>
                <p class="self-center font-body text-xs" style="color:rgba(244,247,249,0.3);">{{ dragGallery ? 'Lepaskan untuk upload…' : 'Drag & drop beberapa foto sekaligus ke area ini' }}</p>
                <input ref="galleryInput" type="file" accept="image/*" multiple class="hidden" @change="pickGallery" />
              </div>
            </div>
            <p v-if="uploading" class="sm:col-span-2 font-mono text-[10px] tracking-widest uppercase" style="color:#F5C518;">Mengunggah {{ uploading }} foto…</p>

            <label><span class="lab">Tags (pisahkan koma)</span><input v-model="form.tags" class="fld" placeholder="Nuxt, Tailwind" /></label>
            <label><span class="lab">Tech stack</span><input v-model="form.tech_stack" class="fld" placeholder="Nuxt, PostgreSQL, Vercel" /></label>
            <label><span class="lab">Client</span><input v-model="form.client" class="fld" /></label>
            <label><span class="lab">Role</span><input v-model="form.role" class="fld" /></label>
            <label><span class="lab">Lokasi</span><input v-model="form.location" class="fld" /></label>
            <label><span class="lab">Urutan (sort order)</span><input v-model="form.sort_order" type="number" class="fld" placeholder="Kosong = paling akhir" /></label>
            <label><span class="lab">Live Demo URL</span><input v-model="form.demo_url" type="url" class="fld" placeholder="https://contoh-proyek.com" /></label>
            <label><span class="lab">Source Code URL</span><input v-model="form.repo_url" type="url" class="fld" placeholder="https://github.com/user/repo" /></label>
            <label class="sm:col-span-2"><span class="lab">Slug (opsional)</span><input v-model="form.slug" class="fld" placeholder="Kosong = dibuat otomatis dari judul" /></label>

            <label class="flex items-center gap-3 cursor-pointer"><input v-model="form.is_featured" type="checkbox" class="accent-[#FF3B3B]" /><span class="lab !mb-0">★ Featured</span></label>
            <label class="flex items-center gap-3 cursor-pointer"><input v-model="form.is_published" type="checkbox" class="accent-[#FF3B3B]" /><span class="lab !mb-0">Tampilkan di website (Live)</span></label>
          </div>

          <p v-if="formError" class="font-mono text-[10px] mt-5" style="color:#f87171;">{{ formError }}</p>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="saving || uploading > 0" class="flex-1 font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3 transition-all disabled:opacity-50" style="background:linear-gradient(135deg,#FF3B3B,#F5C518,#FF3B3B);color:#1D1F27;font-weight:700;">{{ saving ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Tambah Karya' }}</button>
            <button type="button" @click="closeForm" class="font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3 border transition-all" style="border-color:rgba(255,255,255,0.12);color:rgba(244,247,249,0.4);">Batal</button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Portfolio — Admin Lemillion' })
const { logout } = useAuth()
const { items, loading, lastError, fetchPortfolio, createPortfolioItem, updatePortfolioItem, uploadImage, getImageUrl } = usePortfolio()
const navItems = [
  { to: '/admin', icon: '◈', label: 'Overview' }, { to: '/admin/inquiries', icon: '✉️', label: 'Inquiries' },
  { to: '/admin/portfolio', icon: '🖼️', label: 'Portfolio' }, { to: '/admin/availability', icon: '📅', label: 'Kalender' }, { to: '/admin/profile', icon: '👤', label: 'Profil' },
]
const signOut         = async () => { await logout(); navigateTo('/login') }
const toggleFeatured  = (item: any) => updatePortfolioItem(item.id, { is_featured: !item.is_featured })
const togglePublished = (item: any) => updatePortfolioItem(item.id, { is_published: !item.is_published })
const publishedCount  = computed(() => items.value.filter((i: any) => i.is_published).length)

const categories = ref<any[]>([])
onMounted(async () => {
  fetchPortfolio()
  try { categories.value = await $fetch('/api/categories') } catch { categories.value = [] }
})

// ── Form tambah / edit (semua kolom portfolio) ──
const blank = () => ({
  title: '', slug: '', category_id: '', year: new Date().getFullYear() as number | string, description: '', story: '',
  cover_url: '', gallery_urls: [] as string[], tags: '', tech_stack: '', client: '', role: '', location: '',
  demo_url: '', repo_url: '', sort_order: '' as number | string, is_featured: false, is_published: true,
})
const form      = reactive(blank())
const showForm  = ref(false)
const editingId = ref<string | null>(null)
const saving    = ref(false)
const formError = ref('')
const origCover = ref(''), uploading = ref(0)
const coverInput = ref<HTMLInputElement>(), galleryInput = ref<HTMLInputElement>()
const uploadError = (err: any) => err?.data?.statusMessage || err?.message || 'Upload gagal. Coba lagi.'
const uploadCover = async (file: File) => {
  uploading.value++; formError.value = ''
  try { form.cover_url = await uploadImage(file) } catch (err) { formError.value = uploadError(err) } finally { uploading.value-- }
}
const uploadGallery = async (files: File[]) => {
  formError.value = ''
  for (const file of files) {
    uploading.value++
    try { form.gallery_urls.push(await uploadImage(file)) } catch (err) { formError.value = uploadError(err) } finally { uploading.value-- }
  }
}
const pickCover = async (e: Event) => {
  const input = e.target as HTMLInputElement, file = input.files?.[0]
  input.value = ''
  if (file) await uploadCover(file)
}
const pickGallery = async (e: Event) => {
  const input = e.target as HTMLInputElement, files = [...(input.files ?? [])]
  input.value = ''
  await uploadGallery(files)
}

// ── Drag & drop dari perangkat ──
const dragCover = ref(false), dragGallery = ref(false)
// dragleave ikut terpicu saat kursor pindah ke elemen anak → abaikan supaya highlight tidak berkedip
const stillInside = (e: DragEvent) => (e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)
const leaveCover = (e: DragEvent) => { if (!stillInside(e)) dragCover.value = false }
const leaveGallery = (e: DragEvent) => { if (!stillInside(e)) dragGallery.value = false }
const imagesFrom = (e: DragEvent) => [...(e.dataTransfer?.files ?? [])].filter((f) => f.type.startsWith('image/'))
const dropCover = async (e: DragEvent) => {
  dragCover.value = false
  const files = imagesFrom(e)
  if (!files.length) { formError.value = 'File harus berupa gambar (JPG, PNG, WebP, GIF).'; return }
  await uploadCover(files[0])
}
const dropGallery = async (e: DragEvent) => {
  dragGallery.value = false
  const files = imagesFrom(e)
  if (!files.length) { formError.value = 'File harus berupa gambar (JPG, PNG, WebP, GIF).'; return }
  await uploadGallery(files)
}

const openNew = () => { Object.assign(form, blank()); editingId.value = null; formError.value = ''; showForm.value = true }
const openEdit = (item: any) => {
  Object.assign(form, {
    title: item.title ?? '', slug: item.slug ?? '', category_id: item.category_id ?? '', year: item.year ?? '',
    description: item.description ?? '', story: item.story ?? '', cover_url: item.cover_url ?? '',
    gallery_urls: [...(item.gallery_urls ?? [])], tags: (item.tags ?? []).join(', '), tech_stack: item.tech_stack ?? '',
    client: item.client ?? '', role: item.role ?? '', location: item.location ?? '',
    demo_url: item.demo_url ?? '', repo_url: item.repo_url ?? '', sort_order: item.sort_order ?? '',
    is_featured: !!item.is_featured, is_published: !!item.is_published,
  })
  editingId.value = item.id; origCover.value = item.cover_url ?? ''; formError.value = ''; showForm.value = true
}
const closeForm = () => { showForm.value = false }

const save = async () => {
  if (!form.title.trim()) { formError.value = 'Judul wajib diisi.'; return }
  if (uploading.value) { formError.value = 'Tunggu sampai upload foto selesai.'; return }
  saving.value = true
  formError.value = ''
  const payload: Record<string, any> = {
    ...form,
    year: form.year === '' ? undefined : Number(form.year),
    sort_order: form.sort_order === '' ? undefined : Number(form.sort_order),
  }
  if (editingId.value && form.cover_url !== origCover.value) payload.image_url = form.cover_url // cover diganti → samakan image_url
  if (!String(form.slug).trim()) delete payload.slug   // kosong = jangan timpa slug yang ada / buat otomatis
  const ok = editingId.value ? await updatePortfolioItem(editingId.value, payload) : await createPortfolioItem(payload)
  saving.value = false
  if (ok) closeForm()
  else formError.value = lastError.value || 'Gagal menyimpan. Coba lagi.'
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.lab { display: block; margin-bottom: 6px; font-family: 'Share Tech Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: rgba(244,247,249,0.45); }
.fld { width: 100%; padding: 11px 14px; font-size: 14px; background: transparent; color: #F4F7F9; border: 1px solid rgba(255,255,255,0.12); outline: none; transition: border-color .2s; }
.fld:focus { border-color: #FF3B3B; }
.fld option { color: #14151A; }
.add-tile:hover { background: rgba(255,59,59,0.08); }
.upl { font-family: 'Share Tech Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; padding: 9px 14px; border: 1px solid rgba(255,255,255,0.18); color: #F4F7F9; background: transparent; cursor: pointer; transition: all .2s; }
.dz { border: 2px dashed rgba(255,255,255,0.14); background: rgba(255,255,255,0.015); transition: all .2s; }
.dz-over { border-color: #FF3B3B; background: rgba(255,59,59,0.07); }
.upl:hover { border-color: #FF3B3B; color: #FF3B3B; }
</style>
