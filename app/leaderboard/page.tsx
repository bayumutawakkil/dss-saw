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

// Warna medali yang disesuaikan untuk tema gelap
const medalColors: Record<number, string> = {
  1: 'bg-amber-400 text-amber-950 shadow-[0_0_15px_rgba(251,191,36,0.4)]',
  2: 'bg-slate-300 text-slate-900 shadow-[0_0_15px_rgba(203,213,225,0.3)]',
  3: 'bg-orange-400 text-orange-950 shadow-[0_0_15px_rgba(251,146,60,0.3)]',
}

// Background baris tabel agar tidak transparan (memperbaiki keluhan sebelumnya)
const rowBg: Record<number, string> = {
  1: 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20',
  2: 'bg-slate-400/10 border-slate-400/20 hover:bg-slate-400/20',
  3: 'bg-orange-500/10 border-orange-500/20 hover:bg-orange-500/20',
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

    const kriteriaSub = supabase.channel('leaderboard-kriteria').on('postgres_changes', { event: '*', schema: 'public', table: 'kriteria' }, () => loadData()).subscribe()
    const alternatifSub = supabase.channel('leaderboard-alternatif').on('postgres_changes', { event: '*', schema: 'public', table: 'alternatif' }, () => loadData()).subscribe()
    const penilaianSub = supabase.channel('leaderboard-penilaian').on('postgres_changes', { event: '*', schema: 'public', table: 'penilaian' }, () => loadData()).subscribe()

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
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-400"></div>
            <p className="mt-4 text-blue-300 animate-pulse">Menghitung peringkat...</p>
          </div>
        </div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <PageHeader
          title="Leaderboard Hasil SAW"
          description="Hasil perankingan otomatis berdasarkan bobot kriteria yang telah ditentukan"
          icon={
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          }
        />

        <div className="px-4 lg:px-8 pb-8 space-y-6">
          {/* Section: Bobot Kriteria (Info Panel) */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400 mb-4">Informasi Bobot Kriteria</h3>
            <div className="flex flex-wrap gap-3">
              {kriteriaList.map((k) => (
                <div key={k.id} className="flex items-center gap-3 bg-blue-950/40 border border-blue-800/50 rounded-xl px-4 py-2.5 transition-all hover:border-cyan-500/50">
                  <span className="flex items-center justify-center w-7 h-7 bg-cyan-500/20 text-cyan-400 rounded-lg text-[10px] font-black">C{k.id}</span>
                  <div>
                    <p className="text-[11px] text-slate-400 font-medium leading-none mb-1">{k.nama_kriteria}</p>
                    <p className="text-xs font-bold text-white">W = {k.bobot}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Main Leaderboard Table */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-200 tracking-wide">Peringkat Alternatif</h2>
              <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] font-bold rounded-full border border-cyan-500/20 uppercase">Real-time Update</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-950/60 text-left">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest w-20">Rank</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Alternatif (Mata Kuliah)</th>
                    {kriteriaList.map((k) => (
                      <th key={k.id} className="px-4 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">R(C{k.id})</th>
                    ))}
                    <th className="px-6 py-4 text-[11px] font-bold text-cyan-500 uppercase tracking-widest text-right">Skor Akhir (Vi)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {hasil.map((h) => (
                    <tr
                      key={h.alternatif.id}
                      className={`transition-all duration-200 ${
                        h.peringkat <= 3 ? rowBg[h.peringkat] : 'bg-transparent hover:bg-white/[0.03]'
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center">
                          {h.peringkat <= 3 ? (
                            <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${medalColors[h.peringkat]}`}>
                              {h.peringkat}
                            </span>
                          ) : (
                            <span className="text-slate-500 font-bold ml-2">{h.peringkat}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-200">{h.alternatif.nama_mata_kuliah}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">ID: {h.alternatif.id}</p>
                      </td>
                      {kriteriaList.map((k) => (
                        <td key={k.id} className="px-4 py-5 text-center">
                          <span className="font-mono text-xs text-slate-400 bg-black/20 px-2 py-1 rounded">
                            {(h.nilaiNormalisasi[k.id] ?? 0).toFixed(4)}
                          </span>
                        </td>
                      ))}
                      <td className="px-6 py-5 text-right">
                        <span className={`text-sm font-black ${h.peringkat === 1 ? 'text-cyan-400' : 'text-white'}`}>
                          {h.skorAkhir.toFixed(4)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  )
}