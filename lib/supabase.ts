import { createClient } from '@supabase/supabase-js'

// Menggunakan prefix NEXT_PUBLIC_ agar variabel dapat diakses di sisi client (browser) oleh Next.js
// Tanda seru (!) di akhir memberitahu TypeScript bahwa variabel ini pasti ada di environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Inisialisasi client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- Definisi Tipe Data Database ---

export type Kriteria = {
  id: number
  nama_kriteria: string
  bobot: number
  jenis: 'benefit' | 'cost'
}

export type Alternatif = {
  id: number
  nama_mata_kuliah: string
}

export type Penilaian = {
  id: number
  alternatif_id: number
  kriteria_id: number
  nilai: number
}

// Tipe data gabungan untuk keperluan join tabel (misal di halaman Leaderboard atau Matriks)
export type PenilaianWithRelations = Penilaian & {
  alternatif: Alternatif
  kriteria: Kriteria
}