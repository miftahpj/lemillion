// utils/rich.ts
// Pemformat teks ringan untuk isi tugas (aman untuk v-html: semua HTML di-escape dulu).
// Didukung: paragraf (baris kosong), **tebal**, *miring*, `kode`, # judul, daftar (- / 1. / a.)
// dengan sub-daftar (indentasi), tabel | kolom |, dan link http(s).
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const inline = (s: string) => {
  let t = esc(s)
  t = t.replace(/`([^`]+)`/g, '<code>$1</code>')
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  t = t.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>')
  t = t.replace(/\bhttps?:\/\/[^\s<]*[^\s<.,;:!?)]/g, (u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`)
  return t
}

const LIST_RE = /^(\s*)([-*•]|\d+[.)]|[a-zA-Z][.)])\s+(.*)$/
const isRow = (l: string) => /^\s*\|.*\|\s*$/.test(l)
const isSep = (l: string) => isRow(l) && /^[\s|:-]+$/.test(l) && l.includes('-')
const cells = (l: string) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim())

type Item = { indent: number; marker: string; text: string; kids: Item[] }

const listTag = (marker: string, first = true) => {
  if (/^\d/.test(marker)) {
    const n = parseInt(marker, 10)
    return first && n > 1 ? `<ol start="${n}">` : '<ol>'
  }
  if (/^[a-zA-Z]/.test(marker)) return '<ol type="a">'
  return '<ul>'
}
const listEnd = (marker: string) => (/^[-*•]$/.test(marker) ? '</ul>' : '</ol>')

const renderItems = (items: Item[]): string => {
  if (!items.length) return ''
  const m = items[0].marker
  const body = items
    .map((it) => `<li>${inline(it.text)}${it.kids.length ? renderItems(it.kids) : ''}</li>`)
    .join('')
  return `${listTag(m)}${body}${listEnd(m)}`
}

export const renderRich = (src: string | null | undefined): string => {
  const lines = String(src ?? '').replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }

    // tabel
    if (isRow(line)) {
      const rows: string[][] = []
      let hasHead = false
      while (i < lines.length && isRow(lines[i])) {
        if (isSep(lines[i])) { if (rows.length === 1) hasHead = true }
        else rows.push(cells(lines[i]))
        i++
      }
      const [head, ...rest] = rows
      const bodyRows = hasHead ? rest : rows
      out.push(
        `<div class="tbl"><table>${hasHead ? `<thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>` : ''}` +
        `<tbody>${bodyRows.map((r) => `<tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`
      )
      continue
    }

    // judul
    const h = line.match(/^#{1,3}\s+(.*)$/)
    if (h) { out.push(`<h4>${inline(h[1])}</h4>`); i++; continue }

    // daftar (dengan satu tingkat sub-daftar lewat indentasi)
    if (LIST_RE.test(line)) {
      const flat: Item[] = []
      while (i < lines.length && LIST_RE.test(lines[i])) {
        const m = lines[i].match(LIST_RE)!
        flat.push({ indent: m[1].replace(/\t/g, '  ').length, marker: m[2], text: m[3], kids: [] })
        i++
      }
      const base = Math.min(...flat.map((f) => f.indent))
      const top: Item[] = []
      for (const it of flat) {
        if (it.indent > base && top.length) top[top.length - 1].kids.push(it)
        else top.push(it)
      }
      out.push(renderItems(top))
      continue
    }

    // paragraf
    const buf: string[] = []
    while (i < lines.length && lines[i].trim() && !isRow(lines[i]) && !LIST_RE.test(lines[i]) && !/^#{1,3}\s/.test(lines[i])) {
      buf.push(inline(lines[i].trim()))
      i++
    }
    out.push(`<p>${buf.join('<br>')}</p>`)
  }
  return out.join('')
}
