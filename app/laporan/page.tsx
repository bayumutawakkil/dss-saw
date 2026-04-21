'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'
import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface Result {
  alternatifId: number
  alternatifName: string
  rawScores: number[]
  normalizedScores: number[]
  finalScore: number
  rank: number
}

export default function LaporanPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([])
  const [alternatif, setAlternatif] = useState<Alternatif[]>([])
  const [penilaian, setPenilaian] = useState<Penilaian[]>([])
  const [loading, setLoading] = useState(true)
  const [showNormalized, setShowNormalized] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [{ data: k }, { data: a }, { data: p }] = await Promise.all([
          supabase.from('kriteria').select('*').order('id'),
          supabase.from('alternatif').select('*').order('id'),
          supabase.from('penilaian').select('*'),
        ])
        setKriteria(k ?? [])
        setAlternatif(a ?? [])
        setPenilaian(p ?? [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const calculateResults = (): Result[] => {
    if (kriteria.length === 0 || alternatif.length === 0 || penilaian.length === 0) return []

    const getRawScore = (altId: number, kriId: number): number => {
      const p = penilaian.find((x) => x.alternatif_id === altId && x.kriteria_id === kriId)
      return p?.nilai ?? 0
    }

    const rawMatrix: number[][] = []
    alternatif.forEach((alt) => {
      const row: number[] = []
      kriteria.forEach((k) => {
        row.push(getRawScore(alt.id, k.id))
      })
      rawMatrix.push(row)
    })

    const maxValues: number[] = []
    const minValues: number[] = []
    kriteria.forEach((_, kriIdx) => {
      let max = 0
      let min = Infinity
      alternatif.forEach((_, altIdx) => {
        const val = rawMatrix[altIdx][kriIdx]
        if (val > max) max = val
        if (val > 0 && val < min) min = val
      })
      maxValues.push(max)
      minValues.push(min === Infinity ? 0 : min)
    })

    const results: Result[] = alternatif.map((alt, altIdx) => {
      const rawScores = rawMatrix[altIdx]
      const normalizedScores = rawScores.map((score, kriIdx) => {
        if (score === 0) return 0
        if (kriteria[kriIdx].jenis === 'benefit') {
          return maxValues[kriIdx] === 0 ? 0 : score / maxValues[kriIdx]
        } else {
          return minValues[kriIdx] === 0 || score === 0 ? 0 : minValues[kriIdx] / score
        }
      })

      let finalScore = 0
      normalizedScores.forEach((normScore, kriIdx) => {
        finalScore += kriteria[kriIdx].bobot * normScore
      })

      return {
        alternatifId: alt.id,
        alternatifName: alt.nama_mata_kuliah,
        rawScores,
        normalizedScores,
        finalScore: Math.round(finalScore * 10000) / 10000,
        rank: 0,
      }
    })

    results.sort((a, b) => b.finalScore - a.finalScore)
    results.forEach((r, idx) => {
      r.rank = idx + 1
    })

    return results
  }

  const results = calculateResults()
  const medals = ['🥇 1st', '🥈 2nd', '🥉 3rd']

  if (loading) {
    return (
      <ProtectedPage>
        <div className="py-12 text-center text-slate-900 font-semibold">Memuat laporan...</div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <PageHeader
        title="Laporan Hasil Keputusan"
        description="Hasil evaluasi algoritma Simple Additive Weighting (SAW) berdasarkan data matriks terkini"
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m32 4v-2a4 4 0 00-4-4h-5a4 4 0 00-4 4v2m12-9a4 4 0 11-8 0 4 4 0 018 0zM9 3h.01M21 21h.01M3 21h.01M12 3h.01" />
          </svg>
        }
      />

      <div className="px-8 pb-8">
        {/* Section 1: Raw Matrix */}
        <Card className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950">1. Matriks Keputusan Awal (X)</h2>
            <p className="text-sm text-slate-700 mt-1">Data skor mentah dari setiap alternatif kriteria</p>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-5 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider min-w-56">
                    Alternatif
                  </th>
                  {kriteria.map((k) => (
                    <th key={k.id} className="px-4 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wider">
                      C{k.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-950">
                {results.map((r) => (
                  <tr key={r.alternatifId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-semibold bg-slate-50 border-r border-slate-100">
                      {r.alternatifName}
                    </td>
                    {r.rawScores.map((score, idx) => (
                      <td key={idx} className="px-4 py-4 text-center font-medium">
                        {score.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-slate-900 text-white font-bold">
                  <td className="px-5 py-4 text-xs uppercase tracking-wider">Nilai Maksimal (Max)</td>
                  {kriteria.map((_, kriIdx) => {
                    let max = 0
                    results.forEach((r) => {
                      if (r.rawScores[kriIdx] > max) max = r.rawScores[kriIdx]
                    })
                    return (
                      <td key={kriIdx} className="px-4 py-4 text-center font-bold">
                        {max.toFixed(2)}
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Section 2: Normalized Matrix */}
        <Card className="mb-8">
          <button
            onClick={() => setShowNormalized(!showNormalized)}
            className="w-full flex items-center justify-between group"
          >
            <div className="text-left">
              <h2 className="text-xl font-bold text-slate-950">2. Matriks Normalisasi (R)</h2>
              <p className="text-sm text-slate-700 mt-1">Hasil konversi nilai mentah menggunakan rumus Benefit/Cost</p>
            </div>
            <span className="text-slate-950 group-hover:translate-y-1 transition-transform">{showNormalized ? '▲' : '▼'}</span>
          </button>

          {showNormalized && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs font-bold text-blue-900 uppercase mb-1 tracking-wider">Rumus Benefit</p>
                  <p className="text-slate-900 font-semibold italic">Rij = Nilai Mentah / Nilai Maksimal</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                  <p className="text-xs font-bold text-slate-300 uppercase mb-1 tracking-wider">Rumus Cost</p>
                  <p className="text-white font-semibold italic">Rij = Nilai Minimal / Nilai Mentah</p>
                </div>
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">Alternatif</th>
                      {kriteria.map((k) => (
                        <th key={k.id} className="px-4 py-4 text-center text-xs font-bold text-slate-900 uppercase tracking-wider">
                          <div>C{k.id}</div>
                          <div className="text-[10px] font-normal text-slate-600">W: {k.bobot}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-950">
                    {results.map((r) => (
                      <tr key={r.alternatifId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-semibold bg-slate-50 border-r border-slate-100">{r.alternatifName}</td>
                        {r.normalizedScores.map((score, idx) => (
                          <td key={idx} className="px-4 py-4 text-center font-bold text-blue-800">
                            {score.toFixed(2)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>

        {/* Section 3: Final Results */}
        <Card className="mb-8 shadow-lg border-slate-200">
          <button
            onClick={() => setShowResults(!showResults)}
            className="w-full flex items-center justify-between group"
          >
            <div className="text-left">
              <h2 className="text-xl font-bold text-slate-950">3. Perankingan Akhir</h2>
              <p className="text-sm text-slate-700 mt-1">Urutan prioritas berdasarkan akumulasi bobot dan nilai normalisasi</p>
            </div>
            <span className="text-slate-950 group-hover:translate-y-1 transition-transform">{showResults ? '▲' : '▼'}</span>
          </button>

          {showResults && (
            <div className="mt-8 space-y-10 animate-in fade-in duration-500">
              {/* Podium View */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.slice(0, 3).map((r, idx) => (
                  <div
                    key={r.alternatifId}
                    className={`rounded-2xl p-8 border-2 border-slate-950 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      idx === 0 ? 'bg-indigo-50' : 'bg-white'
                    }`}
                  >
                    <div className="text-5xl mb-4">{medals[idx].split(' ')[0]}</div>
                    <div className="text-sm font-bold text-black uppercase tracking-widest mb-1">
                      {idx === 0 ? 'Peringkat 1' : `Peringkat ${idx + 1}`}
                    </div>
                    <div className="text-xl font-bold text-black mb-3">{r.alternatifName}</div>
                    <div className="text-4xl font-black text-indigo-900 border-t-2 border-slate-200 pt-3 inline-block">
                      {r.finalScore.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Result Table */}
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-950 text-white text-left">
                      <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider">Rank</th>
                      <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider">Alternatif</th>
                      <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider hidden lg:table-cell">Kalkulasi ∑(W × R)</th>
                      <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider text-right">Skor Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-slate-100 text-slate-950 font-medium">
                    {results.map((r) => {
                      let calcStr = ''
                      kriteria.forEach((k, idx) => {
                        if (idx > 0) calcStr += ' + '
                        calcStr += `(${k.bobot.toFixed(2)}×${r.normalizedScores[idx].toFixed(2)})`
                      })

                      return (
                        <tr key={r.alternatifId} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-5">
                            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-slate-950 font-bold text-slate-950">
                              {r.rank}
                            </span>
                          </td>
                          <td className="px-6 py-5 font-bold text-base">{r.alternatifName}</td>
                          <td className="px-6 py-5 text-xs font-mono text-slate-700 hidden lg:table-cell">
                            {calcStr}
                          </td>
                          <td className="px-6 py-5 text-right">
                            <span className="text-xl font-black text-indigo-900 border-b-2 border-indigo-200">
                              {r.finalScore.toFixed(4)}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </ProtectedPage>
  )
}