import { supabase } from '@/lib/supabase'
import { calculateSAW, formatNilai } from '@/lib/calculateSAW'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'

async function getLeaderboardData() {
  const [
    { data: kriteriaList, error: e1 },
    { data: alternatifList, error: e2 },
    { data: penilaianList, error: e3 },
  ] = await Promise.all([
    supabase.from('kriteria').select('*').order('id'),
    supabase.from('alternatif').select('*').order('id'),
    supabase.from('penilaian').select('*'),
  ])

  if (e1 || e2 || e3) {
    throw new Error('Gagal mengambil data dari Supabase')
  }

  return {
    kriteriaList: (kriteriaList ?? []) as Kriteria[],
    alternatifList: (alternatifList ?? []) as Alternatif[],
    penilaianList: (penilaianList ?? []) as Penilaian[],
  }
}

const medalColors: Record<number, string> = {
  1: 'bg-amber-400 text-amber-900',
  2: 'bg-slate-300 text-slate-700',
  3: 'bg-orange-300 text-orange-800',
}

const rowBg: Record<number, string> = {
  1: 'bg-amber-50 border-amber-200',
  2: 'bg-slate-50 border-slate-200',
  3: 'bg-orange-50 border-orange-200',
}

export default async function LeaderboardPage() {
  const { kriteriaList, alternatifList, penilaianList } = await getLeaderboardData()

  const hasil = calculateSAW(alternatifList, kriteriaList, penilaianList)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Leaderboard Hasil SAW</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Perankingan mata kuliah berdasarkan metode Simple Additive Weighting (V<sub>i</sub> = Σ W<sub>j</sub> × R<sub>ij</sub>)
        </p>
      </div>

      {/* Info bobot kriteria */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Bobot Kriteria</p>
        <div className="flex flex-wrap gap-3">
          {kriteriaList.map((k) => (
            <div key={k.id} className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-3 py-2">
              <span className="text-xs font-bold text-indigo-600">C{k.id}</span>
              <span className="text-xs text-slate-600">{k.nama_kriteria}</span>
              <span className="ml-1 text-xs font-semibold text-indigo-700 bg-indigo-100 rounded px-1.5 py-0.5">
                W = {k.bobot}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tabel hasil */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Hasil Perankingan</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                  Rank
                </th>
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mata Kuliah
                </th>
                {kriteriaList.map((k) => (
                  <th key={k.id} className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                    R(C{k.id})
                  </th>
                ))}
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Skor Akhir (V<sub>i</sub>)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hasil.map((h) => (
                <tr
                  key={h.alternatif.id}
                  className={`transition-colors ${rowBg[h.peringkat] ?? 'hover:bg-slate-50'} border-l-4 ${
                    h.peringkat <= 3 ? '' : 'border-transparent'
                  }`}
                >
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
                        medalColors[h.peringkat] ?? 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {h.peringkat}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {h.alternatif.nama_mata_kuliah}
                  </td>
                  {kriteriaList.map((k) => (
                    <td key={k.id} className="px-4 py-4 text-center text-slate-600 font-mono text-xs">
                      {formatNilai(h.nilaiNormalisasi[k.id] ?? 0)}
                    </td>
                  ))}
                  <td className="px-5 py-4 text-right">
                    <span
                      className={`font-bold font-mono text-base ${
                        h.peringkat === 1
                          ? 'text-amber-600'
                          : h.peringkat === 2
                          ? 'text-slate-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {formatNilai(h.skorAkhir)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Penjelasan langkah */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
          Langkah Perhitungan SAW
        </p>
        <ol className="space-y-2 text-sm text-slate-600 list-decimal list-inside">
          <li>Buat matriks keputusan X dari nilai setiap alternatif pada setiap kriteria.</li>
          <li>
            Normalisasi: R<sub>ij</sub> = X<sub>ij</sub> / max(X<sub>ij</sub>) untuk kriteria <em>benefit</em>.
          </li>
          <li>
            Hitung skor akhir: V<sub>i</sub> = Σ (W<sub>j</sub> × R<sub>ij</sub>).
          </li>
          <li>Urutkan V<sub>i</sub> secara descending — nilai terbesar mendapat peringkat 1.</li>
        </ol>
      </div>
    </div>
  )
}
