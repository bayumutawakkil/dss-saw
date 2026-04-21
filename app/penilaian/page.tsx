import { supabase } from '@/lib/supabase'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'

async function getPenilaianData() {
  const [
    { data: kriteriaList },
    { data: alternatifList },
    { data: penilaianList },
  ] = await Promise.all([
    supabase.from('kriteria').select('*').order('id'),
    supabase.from('alternatif').select('*').order('id'),
    supabase.from('penilaian').select('*'),
  ])

  return {
    kriteriaList: (kriteriaList ?? []) as Kriteria[],
    alternatifList: (alternatifList ?? []) as Alternatif[],
    penilaianList: (penilaianList ?? []) as Penilaian[],
  }
}

export default async function PenilaianPage() {
  const { kriteriaList, alternatifList, penilaianList } = await getPenilaianData()

  function getNilai(altId: number, kriId: number): number | null {
    const p = penilaianList.find(
      (p) => p.alternatif_id === altId && p.kriteria_id === kriId
    )
    return p?.nilai ?? null
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Matriks Penilaian</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Nilai setiap alternatif (mata kuliah) pada masing-masing kriteria — matriks keputusan awal sebelum dinormalisasi
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Matriks Keputusan (X)</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Mata Kuliah / Kriteria
                </th>
                {kriteriaList.map((k) => (
                  <th key={k.id} className="px-4 py-3 text-center">
                    <div>
                      <p className="text-xs font-bold text-slate-600">C{k.id}</p>
                      <p className="text-[10px] text-slate-400 font-normal">{k.nama_kriteria}</p>
                      <p className="text-[10px] font-semibold text-indigo-500">W = {k.bobot}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {alternatifList.map((alt) => (
                <tr key={alt.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-medium text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">A{alt.id}</span>
                      {alt.nama_mata_kuliah}
                    </div>
                  </td>
                  {kriteriaList.map((k) => {
                    const nilai = getNilai(alt.id, k.id)
                    return (
                      <td key={k.id} className="px-4 py-4 text-center">
                        {nilai !== null ? (
                          <span className="inline-block bg-indigo-50 text-indigo-700 font-mono font-semibold text-sm rounded-lg px-3 py-1">
                            {nilai}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        * Nilai di atas adalah nilai mentah (raw value) sebelum proses normalisasi SAW. Lihat hasil normalisasi di halaman Leaderboard.
      </p>
    </div>
  )
}
