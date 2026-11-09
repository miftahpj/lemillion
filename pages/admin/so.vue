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
          <p class="font-mono text-[9px] tracking-[0.5em] uppercase mb-2" style="color:rgba(255,59,59,0.4);">// Kelola · halaman /so</p>
          <h1 class="font-display text-3xl uppercase tracking-wide gold-text">Tugas SO</h1>
        </div>
        <div class="flex items-center gap-5">
          <p class="font-body text-sm" style="color:rgba(244,247,249,0.3);">{{ items.length }} tugas · {{ liveCount }} live</p>
          <button @click="openNew" class="font-mono text-[10px] tracking-[0.3em] uppercase px-5 py-3 transition-all" style="background:linear-gradient(135deg,#FF3B3B,#F5C518,#FF3B3B);color:#1D1F27;font-weight:700;">＋ Tambah Tugas</button>
        </div>
      </div>
      <div class="h-px mb-8 opacity-15" style="background:linear-gradient(to right,transparent,#FF3B3B,transparent);" />

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="w-px h-16" style="background:linear-gradient(to bottom,#FF3B3B,transparent);" />
      </div>
      <div v-else class="space-y-3">
        <div v-for="t in items" :key="t.id" class="border p-5 flex items-start gap-5 flex-wrap" :class="{ 'opacity-60': !t.is_published }" style="border-color:rgba(255,59,59,0.10); background:rgba(255,255,255,0.01);">
          <div class="flex-1 min-w-[220px]">
            <p class="font-mono text-[8px] tracking-widest uppercase mb-1" style="color:rgba(255,59,59,0.45);">
              {{ t.deadline ? 'Deadline ' + t.deadline : 'Tanpa deadline' }} · urutan {{ t.sort_order }}
              <span v-if="!t.is_published"> · Draft</span>
            </p>
            <p class="font-display text-xl uppercase tracking-wide" style="color:#F4F7F9;">{{ t.title }}</p>
            <p class="font-body text-xs mt-1 line-clamp-2" style="color:rgba(244,247,249,0.35);">{{ t.description }}</p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button @click="openEdit(t)" class="btn-sm" style="color:#F4F7F9;border-color:rgba(255,255,255,0.18);">✎ Edit</button>
            <button @click="toggle(t, 'is_done')" class="btn-sm" :style="t.is_done ? 'color:#F5C518;border-color:rgba(245,197,24,0.4);' : 'color:rgba(244,247,249,0.3);border-color:rgba(255,255,255,0.1);'">{{ t.is_done ? '✓ Selesai' : '○ Belum' }}</button>
            <button @click="toggle(t, 'is_published')" class="btn-sm" :style="t.is_published ? 'color:rgba(52,211,153,0.7);border-color:rgba(52,211,153,0.25);' : 'color:rgba(244,247,249,0.2);border-color:rgba(255,255,255,0.06);'">{{ t.is_published ? '✓ Live' : '○ Draft' }}</button>
            <button @click="remove(t)" class="btn-sm" style="color:#f87171;border-color:rgba(248,113,113,0.3);">🗑 Hapus</button>
          </div>
        </div>
        <p v-if="!items.length" class="font-mono text-[10px] tracking-widest uppercase mt-8" style="color:rgba(244,247,249,0.3);">Belum ada tugas — klik "Tambah Tugas" untuk mulai.</p>
      </div>
      <p v-if="actionError" class="font-mono text-[10px] mt-5" style="color:#f87171;">{{ actionError }}</p>
    </main>

    <!-- ══ FORM TAMBAH / EDIT TUGAS ══ -->
    <Transition name="modal">
      <div v-if="showForm" class="fixed inset-0 z-50 overflow-y-auto px-4 py-8" style="background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);" @click.self="closeForm">
        <form class="w-full max-w-2xl mx-auto border p-7" style="background:#14151A;border-color:rgba(255,59,59,0.2);" @submit.prevent="save" @dragover.prevent @drop.prevent>
          <p class="font-mono text-[9px] tracking-[0.4em] uppercase mb-2" style="color:rgba(255,59,59,0.5);">// {{ editingId ? 'Edit Tugas' : 'Tugas Baru' }}</p>
          <h2 class="font-display text-2xl uppercase tracking-wide gold-text mb-6 truncate">{{ form.title || 'Tanpa judul' }}</h2>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label><span class="lab">Judul *</span><input v-model="form.title" required class="fld" placeholder="Tugas 3" /></label>
            <label><span class="lab">Deadline</span><input v-model="form.deadline" type="date" class="fld" /></label>

            <label class="sm:col-span-2">
              <span class="lab">Soal / deskripsi tugas</span>
              <textarea v-model="form.description" rows="9" class="fld" style="font-family:'Share Tech Mono',ui-monospace,monospace;" />
              <span class="hint">Baris kosong = paragraf · **tebal** · *miring* · `kode` · "- item" atau "1. item" untuk daftar (spasi di depan = sub-daftar) · tabel: | kolom | kolom |</span>
              <div v-if="form.description.trim()" class="rich pv" v-html="renderRich(form.description)" />
            </label>

            <label class="sm:col-span-2">
              <span class="lab">Jawaban (opsional — tampil sebagai bagian "Jawaban" yang bisa dibuka)</span>
              <textarea v-model="form.answer" rows="6" class="fld" style="font-family:'Share Tech Mono',ui-monospace,monospace;" />
              <div v-if="form.answer.trim()" class="rich pv" v-html="renderRich(form.answer)" />
            </label>

            <div class="sm:col-span-2">
              <span class="lab">Gambar ({{ form.images.length }})</span>
              <div class="dz flex flex-wrap gap-3 p-4" :class="{ 'dz-over': dragOver }"
                @dragenter.prevent="dragOver = true" @dragover.prevent="dragOver = true" @dragleave.prevent="leave" @drop.prevent="drop">
                <div v-for="(g, i) in form.images" :key="g + i" class="relative w-24 h-24 border overflow-hidden" style="border-color:rgba(255,255,255,0.12);">
                  <img :src="g" alt="" class="w-full h-full object-cover" />
                  <button type="button" class="absolute top-1 right-1 w-6 h-6 text-xs" style="background:#14151Acc;color:#f87171;" aria-label="Hapus gambar" @click="form.images.splice(i, 1)">✕</button>
                </div>
                <button type="button" class="upl w-24 h-24 flex flex-col items-center justify-center gap-1" @click="fileInput?.click()"><span class="text-2xl leading-none">＋</span><span>Tambah</span></button>
                <p class="self-center font-body text-xs" style="color:rgba(244,247,249,0.3);">{{ dragOver ? 'Lepaskan untuk upload…' : 'Drag & drop gambar ke sini (dikompres otomatis)' }}</p>
                <input ref="fileInput" type="file" accept="image/*" multiple class="hidden" @change="pick" />
              </div>
            </div>
            <p v-if="uploading" class="sm:col-span-2 font-mono text-[10px] tracking-widest uppercase" style="color:#F5C518;">Mengunggah {{ uploading }} gambar…</p>

            <label><span class="lab">Urutan (sort order)</span><input v-model="form.sort_order" type="number" class="fld" placeholder="Kosong = paling akhir" /></label>
            <div class="flex flex-col gap-3 justify-end">
              <label class="flex items-center gap-3 cursor-pointer"><input v-model="form.is_done" type="checkbox" class="accent-[#FF3B3B]" /><span class="lab !mb-0">Sudah selesai</span></label>
              <label class="flex items-center gap-3 cursor-pointer"><input v-model="form.is_published" type="checkbox" class="accent-[#FF3B3B]" /><span class="lab !mb-0">Tampilkan di /so (Live)</span></label>
            </div>
          </div>

          <p v-if="formError" class="font-mono text-[10px] mt-5" style="color:#f87171;">{{ formError }}</p>
          <div class="flex gap-3 mt-6">
            <button type="submit" :disabled="saving || uploading > 0" class="flex-1 font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3 transition-all disabled:opacity-50" style="background:linear-gradient(135deg,#FF3B3B,#F5C518,#FF3B3B);color:#1D1F27;font-weight:700;">{{ saving ? 'Menyimpan…' : editingId ? 'Simpan Perubahan' : 'Tambah Tugas' }}</button>
            <button type="button" @click="closeForm" class="font-mono text-[10px] tracking-[0.3em] uppercase px-6 py-3 border transition-all" style="border-color:rgba(255,255,255,0.12);color:rgba(244,247,249,0.4);">Batal</button>
          </div>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false, middleware: ['auth'] })
useHead({ title: 'Tugas SO — Admin Lemillion', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { logout } = useAuth()
const { items, loading, lastError, fetchTasks, createTask, updateTask, deleteTask } = useTasks()
const { uploadImage } = usePortfolio()

const navItems = [
  { to: '/admin', icon: '◈', label: 'Overview' }, { to: '/admin/inquiries', icon: '✉️', label: 'Inquiries' },
  { to: '/admin/portfolio', icon: '🖼️', label: 'Portfolio' }, { to: '/admin/availability', icon: '📅', label: 'Kalender' },
  { to: '/admin/so', icon: '📝', label: 'Tugas SO' }, { to: '/admin/profile', icon: '👤', label: 'Profil' },
]
const signOut = async () => { await logout(); navigateTo('/login') }
const liveCount = computed(() => items.value.filter((t: any) => t.is_published).length)
onMounted(() => fetchTasks())

const actionError = ref('')
const toggle = async (t: any, key: 'is_done' | 'is_published') => {
  actionError.value = ''
  if (!(await updateTask(t.id, { [key]: !t[key] }))) actionError.value = lastError.value
}
const remove = async (t: any) => {
  if (!confirm(`Hapus "${t.title}"? Tindakan ini tidak bisa dibatalkan.`)) return
  actionError.value = ''
  if (!(await deleteTask(t.id))) actionError.value = lastError.value
}

// ── Form tambah / edit ──
const blank = () => ({
  title: '', deadline: '', description: '', answer: '', images: [] as string[],
  sort_order: '' as number | string, is_done: false, is_published: true,
})
const form = reactive(blank())
const showForm = ref(false)
const editingId = ref<string | null>(null)
const saving = ref(false)
const formError = ref('')
const uploading = ref(0)
const fileInput = ref<HTMLInputElement>()

const uploadFiles = async (files: File[]) => {
  formError.value = ''
  for (const file of files) {
    uploading.value++
    try { form.images.push(await uploadImage(file)) }
    catch (err: any) { formError.value = err?.data?.statusMessage || err?.message || 'Upload gagal. Coba lagi.' }
    finally { uploading.value-- }
  }
}
const pick = async (e: Event) => {
  const input = e.target as HTMLInputElement, files = [...(input.files ?? [])]
  input.value = ''
  await uploadFiles(files)
}
const dragOver = ref(false)
const leave = (e: DragEvent) => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) dragOver.value = false }
const drop = async (e: DragEvent) => {
  dragOver.value = false
  const files = [...(e.dataTransfer?.files ?? [])].filter((f) => f.type.startsWith('image/'))
  if (!files.length) { formError.value = 'File harus berupa gambar (JPG, PNG, WebP, GIF).'; return }
  await uploadFiles(files)
}

const openNew = () => { Object.assign(form, blank()); editingId.value = null; formError.value = ''; showForm.value = true }
const openEdit = (t: any) => {
  Object.assign(form, {
    title: t.title ?? '', deadline: t.deadline ?? '', description: t.description ?? '', answer: t.answer ?? '',
    images: [...(t.images ?? [])], sort_order: t.sort_order ?? '', is_done: !!t.is_done, is_published: !!t.is_published,
  })
  editingId.value = t.id; formError.value = ''; showForm.value = true
}
const closeForm = () => { showForm.value = false }

const save = async () => {
  if (!form.title.trim()) { formError.value = 'Judul wajib diisi.'; return }
  if (uploading.value) { formError.value = 'Tunggu sampai upload gambar selesai.'; return }
  saving.value = true
  formError.value = ''
  const payload: Record<string, any> = {
    ...form,
    sort_order: form.sort_order === '' ? undefined : Number(form.sort_order),
  }
  const ok = editingId.value ? await updateTask(editingId.value, payload) : await createTask(payload)
  saving.value = false
  if (ok) closeForm()
  else formError.value = lastError.value || 'Gagal menyimpan. Coba lagi.'
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.lab { display: block; margin-bottom: 6px; font-family: 'Share Tech Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; color: rgba(244,247,249,0.45); }
.hint { display: block; margin-top: 6px; font-family: 'Share Tech Mono', ui-monospace, monospace; font-size: 9px; color: rgba(244,247,249,0.28); }
.fld { width: 100%; padding: 11px 14px; font-size: 14px; background: transparent; color: #F4F7F9; border: 1px solid rgba(255,255,255,0.12); outline: none; transition: border-color .2s; }
.fld:focus { border-color: #FF3B3B; }
.upl { font-family: 'Share Tech Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: .15em; text-transform: uppercase; padding: 9px 14px; border: 1px solid rgba(255,255,255,0.18); color: #F4F7F9; background: transparent; cursor: pointer; transition: all .2s; }
.upl:hover { border-color: #FF3B3B; color: #FF3B3B; }
.dz { border: 2px dashed rgba(255,255,255,0.14); background: rgba(255,255,255,0.015); transition: all .2s; }
.dz-over { border-color: #FF3B3B; background: rgba(255,59,59,0.07); }
.btn-sm { font-family: 'Share Tech Mono', ui-monospace, monospace; font-size: 9px; letter-spacing: .1em; padding: 8px 12px; border: 1px solid; background: transparent; cursor: pointer; transition: all .2s; }
.pv { margin-top: 10px; padding: 12px 14px; border: 1px dashed rgba(255,255,255,0.14); font-size: 14px; }
</style>
