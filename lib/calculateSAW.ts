import type { Kriteria, Alternatif, Penilaian } from './supabase'

export type MatriksNilai = {
  alternatif: Alternatif
  nilai: Record<number, number> // kriteria_id -> nilai
}

export type HasilSAW = {
  peringkat: number
  alternatif: Alternatif
  nilaiNormalisasi: Record<number, number>
  skorAkhir: number
}

/**
 * Menghitung normalisasi matriks menggunakan metode SAW.
 * Untuk kriteria Benefit: R_ij = X_ij / max(X_ij)
 * Untuk kriteria Cost:    R_ij = min(X_ij) / X_ij
 */
export function hitungNormalisasi(
  matriks: MatriksNilai[],
  kriteriaList: Kriteria[]
): MatriksNilai[] {
  const normalized: MatriksNilai[] = matriks.map((m) => ({
    alternatif: m.alternatif,
    nilai: { ...m.nilai },
  }))

  for (const kriteria of kriteriaList) {
    const kId = kriteria.id
    const nilaiKolom = matriks.map((m) => m.nilai[kId] ?? 0)

    if (kriteria.jenis === 'benefit') {
      const maxNilai = Math.max(...nilaiKolom)
      normalized.forEach((m) => {
        m.nilai[kId] = maxNilai === 0 ? 0 : (m.nilai[kId] ?? 0) / maxNilai
      })
    } else {
      // cost - untuk cost, nilai lebih kecil lebih baik
      // R_ij = min(X_j) / X_ij
      // Jika ada nilai 0, gunakan nilai positif terkecil sebagai minimum
      const nilaiPositif = nilaiKolom.filter(v => v > 0)
      const minNilai = nilaiPositif.length > 0 ? Math.min(...nilaiPositif) : 1
      
      normalized.forEach((m) => {
        const v = m.nilai[kId] ?? 0
        m.nilai[kId] = v === 0 ? 0 : minNilai / v
      })
    }
  }

  return normalized
}

/**
 * Menghitung skor akhir SAW berdasarkan normalisasi dan bobot.
 * V_i = Σ (W_j × R_ij)
 */
export function hitungSkorAkhir(
  normalized: MatriksNilai[],
  kriteriaList: Kriteria[]
): HasilSAW[] {
  const hasil: Omit<HasilSAW, 'peringkat'>[] = normalized.map((m) => {
    let skorAkhir = 0
    const nilaiNormalisasi: Record<number, number> = {}

    for (const kriteria of kriteriaList) {
      const kId = kriteria.id
      const nilaiR = m.nilai[kId] ?? 0
      nilaiNormalisasi[kId] = nilaiR
      skorAkhir += kriteria.bobot * nilaiR
    }

    return {
      alternatif: m.alternatif,
      nilaiNormalisasi,
      skorAkhir: parseFloat(skorAkhir.toFixed(4)),
    }
  })

  // Urutkan descending berdasarkan skor akhir
  hasil.sort((a, b) => b.skorAkhir - a.skorAkhir)

  // Tambahkan peringkat
  return hasil.map((h, i) => ({ ...h, peringkat: i + 1 }))
}

/**
 * Fungsi utama: menerima data mentah dan mengembalikan hasil perankingan SAW.
 */
export function calculateSAW(
  alternatifList: Alternatif[],
  kriteriaList: Kriteria[],
  penilaianList: Penilaian[]
): HasilSAW[] {
  // Susun matriks keputusan
  const matriks: MatriksNilai[] = alternatifList.map((alt) => {
    const nilaiMap: Record<number, number> = {}
    for (const k of kriteriaList) {
      const p = penilaianList.find(
        (p) => p.alternatif_id === alt.id && p.kriteria_id === k.id
      )
      nilaiMap[k.id] = p?.nilai ?? 0
    }
    return { alternatif: alt, nilai: nilaiMap }
  })

  const normalized = hitungNormalisasi(matriks, kriteriaList)
  return hitungSkorAkhir(normalized, kriteriaList)
}

/**
 * Format nilai ke 4 desimal
 */
export function formatNilai(nilai: number): string {
  return nilai.toFixed(4)
}
