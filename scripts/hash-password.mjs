// Jalankan: node scripts/hash-password.mjs "password_rahasia_kamu"
// Copy output-nya ke ADMIN_PASSWORD_HASH di file .env
import { randomBytes, scryptSync } from 'node:crypto'

const password = process.argv[2]

if (!password) {
  console.error('Pemakaian: node scripts/hash-password.mjs "password_kamu"')
  process.exit(1)
}

const salt = randomBytes(16).toString('hex')
const hash = scryptSync(password, salt, 64).toString('hex')

console.log('\nTambahkan baris ini ke file .env kamu:\n')
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}\n`)
