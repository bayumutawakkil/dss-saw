import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipe data database
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

export type PenilaianWithRelations = Penilaian & {
  alternatif: Alternatif
  kriteria: Kriteria
}
