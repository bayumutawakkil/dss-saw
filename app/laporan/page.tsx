'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'
import ProtectedPage from '@/components/ProtectedPage'

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
        <div className="p-8 text-center text-black font-semibold">Memuat Laporan...</div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <div className="p-8 bg-white min-h-screen">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-bold bg-blue-700 text-white px-3 py-1 rounded-full">
              ANALISIS DATA TERBARU
            </span>
          </div>
          {/* Warna hitam pekat, ketebalan normal bold */}
          <h1 className="text-4xl font-bold text-black tracking-tight">Laporan Hasil Keputusan</h1>
          <p className="text-slate-900 mt-2 text-lg">
            Evaluasi algoritma Simple Additive Weighting (SAW) berdasarkan parameter kriteria dan alternatif.
          </p>
        </div>

        {/* Section 1: Raw Matrix */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-black text-white rounded font-bold flex items-center justify-center">1</div>
            <h2 className="text-2xl font-bold text-black">Matriks Keputusan Awal (X)</h2>
          </div>

          <div className="bg-white rounded-xl border-2 border-black overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100 border-b-2 border-black text-left">
                    <th className="px-6 py-4 font-bold text-black uppercase">Alternatif</th>
                    {kriteria.map((k) => (
                      <th key={k.id} className="px-4 py-4 text-center font-bold text-black">C{k.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {results.map((r) => (
                    <tr key={r.alternatifId}>
                      <td className="px-6 py-4 font-semibold text-black bg-slate-50/50">{r.alternatifName}</td>
                      {r.rawScores.map((score, idx) => (
                        <td key={idx} className="px-4 py-4 text-center text-black font-medium">
                          {score.toFixed(4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-black text-white">
                    <td className="px-6 py-4 font-bold uppercase text-xs">Nilai Maksimal (Max)</td>
                    {kriteria.map((_, kriIdx) => {
                      let max = 0
                      results.forEach((r) => {
                        if (r.rawScores[kriIdx] > max) max = r.rawScores[kriIdx]
                      })
                      return (
                        <td key={kriIdx} className="px-4 py-4 text-center font-bold">
                          {max.toFixed(4)}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 2: Normalized Matrix */}
        <div className="mb-12">
          <button
            onClick={() => setShowNormalized(!showNormalized)}
            className="flex items-center gap-3 mb-5 p-5 w-full rounded-xl border-2 border-black hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 bg-black text-white rounded font-bold flex items-center justify-center">2</div>
            <h2 className="text-2xl font-bold text-black">Matriks Normalisasi (R)</h2>
            <span className="ml-auto text-black font-bold">{showNormalized ? '▲' : '▼'}</span>
          </button>

          {showNormalized && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-blue-800 bg-blue-50 p-4 rounded-lg">
                  <span className="text-xs font-bold text-blue-800 uppercase block mb-1">Kriteria Benefit</span>
                  <p className="text-black font-semibold italic text-base">Rᵢⱼ = Nilai Mentah / Nilai Maksimal</p>
                </div>
                <div className="border-2 border-slate-800 bg-slate-50 p-4 rounded-lg">
                  <span className="text-xs font-bold text-slate-800 uppercase block mb-1">Kriteria Cost</span>
                  <p className="text-black font-semibold italic text-base">Rᵢⱼ = Nilai Minimal / Nilai Mentah</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-black overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 border-b-2 border-black text-left">
                      <th className="px-6 py-4 font-bold text-black">Alternatif</th>
                      {kriteria.map((k) => (
                        <th key={k.id} className="px-4 py-4 text-center font-bold text-black">
                          <div>C{k.id}</div>
                          <div className="text-[10px] uppercase opacity-70">W: {k.bobot}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.map((r) => (
                      <tr key={r.alternatifId}>
                        <td className="px-6 py-4 font-semibold text-black">{r.alternatifName}</td>
                        {r.normalizedScores.map((score, idx) => (
                          <td key={idx} className="px-4 py-4 text-center text-blue-900 font-bold">
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
        </div>

        {/* Section 3: Final Results */}
        <div className="mb-8">
          <button
            onClick={() => setShowResults(!showResults)}
            className="flex items-center gap-3 mb-5 p-5 w-full rounded-xl border-2 border-black hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 bg-black text-white rounded font-bold flex items-center justify-center">3</div>
            <h2 className="text-2xl font-bold text-black">Hasil Perankingan Akhir</h2>
            <span className="ml-auto text-black font-bold">{showResults ? '▲' : '▼'}</span>
          </button>

          {showResults && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Podium yang lebih kontras */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.slice(0, 3).map((r, idx) => (
                  <div
                    key={r.alternatifId}
                    className={`rounded-2xl p-8 border-2 border-black text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                      idx === 0 ? 'bg-yellow-50' : 'bg-white'
                    }`}
                  >
                    <div className="text-4xl mb-4">{medals[idx].split(' ')[0]}</div>
                    <div className="text-sm font-bold text-black uppercase tracking-widest mb-1">
                      {idx === 0 ? 'Peringkat 1' : `Peringkat ${idx + 1}`}
                    </div>
                    <div className="text-xl font-bold text-black mb-3">{r.alternatifName}</div>
                    <div className="text-4xl font-bold text-black border-t-2 border-black pt-3 inline-block">
                      {r.finalScore.toFixed(4)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Tabel Utama Hasil Akhir */}
              <div className="bg-white rounded-xl border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-black text-white text-left">
                        <th className="px-6 py-5 font-bold uppercase tracking-wider">Rank</th>
                        <th className="px-6 py-5 font-bold uppercase tracking-wider">Alternatif</th>
                        <th className="px-6 py-5 font-bold uppercase tracking-wider hidden lg:table-cell">Kalkulasi ∑(W × R)</th>
                        <th className="px-6 py-5 font-bold uppercase tracking-wider text-center">Skor Akhir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-slate-100">
                      {results.map((r) => {
                        let calcStr = ''
                        kriteria.forEach((k, idx) => {
                          if (idx > 0) calcStr += ' + '
                          calcStr += `(${k.bobot.toFixed(2)}×${r.normalizedScores[idx].toFixed(2)})`
                        })

                        return (
                          <tr key={r.alternatifId} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5">
                              <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 border-black font-bold text-black text-base">
                                {r.rank}
                              </span>
                            </td>
                            <td className="px-6 py-5 font-bold text-black text-base">{r.alternatifName}</td>
                            <td className="px-6 py-5 text-xs font-semibold text-slate-800 font-mono hidden lg:table-cell">
                              {calcStr}
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className="text-xl font-bold text-black bg-slate-100 px-4 py-2 rounded border border-black">
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
            </div>
          )}
        </div>
      </div>
    </ProtectedPage>
  )
}