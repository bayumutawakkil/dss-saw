'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { calculateSAW } from '@/lib/calculateSAW'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'
import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'

export const dynamic = 'force-dynamic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

export default function LeaderboardPage() {
  const [kriteriaList, setKriteriaList] = useState<Kriteria[]>([])
  const [alternatifList, setAlternatifList] = useState<Alternatif[]>([])
  const [penilaianList, setPenilaianList] = useState<Penilaian[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ data: k }, { data: a }, { data: p }] = await Promise.all([
          supabase.from('kriteria').select('*').order('id'),
          supabase.from('alternatif').select('*').order('id'),
          supabase.from('penilaian').select('*'),
        ])
        setKriteriaList(k ?? [])
        setAlternatifList(a ?? [])
        setPenilaianList(p ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Subscribe to real-time changes
    const kriteriaSub = supabase
      .channel('leaderboard-kriteria')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'kriteria' }, () => loadData())
      .subscribe()

    const alternatifSub = supabase
      .channel('leaderboard-alternatif')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alternatif' }, () => loadData())
      .subscribe()

    const penilaianSub = supabase
      .channel('leaderboard-penilaian')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'penilaian' }, () => loadData())
      .subscribe()

    return () => {
      supabase.removeChannel(kriteriaSub)
      supabase.removeChannel(alternatifSub)
      supabase.removeChannel(penilaianSub)
    }
  }, [])

  const hasil = calculateSAW(alternatifList, kriteriaList, penilaianList)

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
          </div>
        </div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <PageHeader
        title="Leaderboard Hasil SAW"
        description="Perankingan mata kuliah berdasarkan metode Simple Additive Weighting"
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        }
      />

      <div className="px-8 pb-8">
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
                    Skor Akhir (Vi)
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
                      {h.peringkat <= 3 ? (
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${medalColors[h.peringkat]}`}>
                          {h.peringkat}
                        </span>
                      ) : (
                        <span className="font-semibold text-slate-600">{h.peringkat}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800">{h.alternatif.nama_mata_kuliah}</td>
                    {kriteriaList.map((k) => (
                      <td key={k.id} className="px-4 py-4 text-center text-slate-700">
                        {(h.nilaiNormalisasi[k.id] ?? 0).toFixed(4)}
                      </td>
                    ))}
                    <td className="px-5 py-4 text-right font-semibold text-slate-800">{h.skorAkhir.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}
