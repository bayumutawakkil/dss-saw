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

    // Get raw scores for each alternatif-kriteria pair
    const getRawScore = (altId: number, kriId: number): number => {
      const p = penilaian.find((x) => x.alternatif_id === altId && x.kriteria_id === kriId)
      return p?.nilai ?? 0
    }

    // Build raw matrix
    const rawMatrix: number[][] = []
    alternatif.forEach((alt) => {
      const row: number[] = []
      kriteria.forEach((k) => {
        row.push(getRawScore(alt.id, k.id))
      })
      rawMatrix.push(row)
    })

    // Find max and min for each kriteria (for normalization)
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

    // Calculate normalized matrix and final scores
    const results: Result[] = alternatif.map((alt, altIdx) => {
      const rawScores = rawMatrix[altIdx]
      const normalizedScores = rawScores.map((score, kriIdx) => {
        if (score === 0) return 0
        if (kriteria[kriIdx].jenis === 'benefit') {
          // For benefit: R = score / max
          return maxValues[kriIdx] === 0 ? 0 : score / maxValues[kriIdx]
        } else {
          // For cost: R = min / score
          return minValues[kriIdx] === 0 || score === 0 ? 0 : minValues[kriIdx] / score
        }
      })

      // Calculate final score using SAW
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

    // Sort by final score and assign ranks
    results.sort((a, b) => b.finalScore - a.finalScore)
    results.forEach((r, idx) => {
      r.rank = idx + 1
    })

    return results
  }

  const results = calculateResults()
  const medals = ['1st', '2nd', '3rd']

  if (loading) {
    return (
      <ProtectedPage>
        <div className="p-8 text-center">Loading...</div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <div className="p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              Real-Time Analysis
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Hasil Keputusan</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Hasil evaluasi algoritma Simple Additive Weighting (SAW) berdasarkan data matriks terkini.
          </p>
        </div>

        {/* Section 1: Raw Matrix */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-indigo-600 text-white rounded font-bold text-sm flex items-center justify-center">
              1
            </div>
            <h2 className="text-lg font-bold text-slate-800">Matriks Keputusan Awal (X)</h2>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Alternatif
                    </th>
                    {kriteria.map((k) => (
                      <th key={k.id} className="px-4 py-3 text-center text-xs font-semibold text-slate-500">
                        C{k.id}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((r) => (
                    <tr key={r.alternatifId} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-medium text-slate-800">{r.alternatifName}</td>
                      {r.rawScores.map((score, idx) => (
                        <td key={idx} className="px-4 py-3 text-center text-sm">
                          {score.toFixed(4)}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-semibold">
                    <td className="px-5 py-3">Nilai Maksimal (Max)</td>
                    {kriteria.map((_, kriIdx) => {
                      let max = 0
                      results.forEach((r) => {
                        if (r.rawScores[kriIdx] > max) max = r.rawScores[kriIdx]
                      })
                      return (
                        <td key={kriIdx} className="px-4 py-3 text-center text-sm">
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
        <div className="mb-8">
          <button
            onClick={() => setShowNormalized(!showNormalized)}
            className="flex items-center gap-3 mb-4 p-3 w-full rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-6 h-6 bg-indigo-600 text-white rounded font-bold text-sm flex items-center justify-center">
              2
            </div>
            <h2 className="text-lg font-bold text-slate-800">Matriks Normalisasi (R)</h2>
            <span className="ml-auto text-slate-400">{showNormalized ? '▼' : '▶'}</span>
          </button>

          {showNormalized && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                <strong>Rumus Benefit:</strong> R = Nilai Mentah ÷ Nilai Maksimal
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left">
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500">Alternatif</th>
                        {kriteria.map((k) => (
                          <th key={k.id} className="px-4 py-3 text-center text-xs font-semibold text-slate-500">
                            <div>C{k.id}</div>
                            <div className="text-[10px] font-normal">Bobot: {k.bobot}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {results.map((r) => (
                        <tr key={r.alternatifId} className="hover:bg-slate-50">
                          <td className="px-5 py-3 font-medium text-slate-800">{r.alternatifName}</td>
                          {r.normalizedScores.map((score, idx) => (
                            <td key={idx} className="px-4 py-3 text-center text-sm">
                              {score.toFixed(2)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: Results & Leaderboard */}
        <div className="mb-8">
          <button
            onClick={() => setShowResults(!showResults)}
            className="flex items-center gap-3 mb-4 p-3 w-full rounded-lg hover:bg-slate-50 transition"
          >
            <div className="w-6 h-6 bg-indigo-600 text-white rounded font-bold text-sm flex items-center justify-center">
              3
            </div>
            <h2 className="text-lg font-bold text-slate-800">Puncak Klasemen Leaderboard</h2>
            <span className="ml-auto text-slate-400">{showResults ? '▼' : '▶'}</span>
          </button>

          {showResults && (
            <div className="space-y-6">
              {/* Top 3 Medal Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.slice(0, 3).map((r, idx) => (
                  <div
                    key={r.alternatifId}
                    className={`rounded-xl p-6 text-center text-white font-semibold ${
                      idx === 0
                        ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 md:col-span-1 md:row-span-2 text-lg'
                        : idx === 1
                          ? 'bg-gradient-to-br from-gray-300 to-gray-500'
                          : 'bg-gradient-to-br from-orange-400 to-orange-600'
                    }`}
                  >
                    <div className="text-4xl mb-2">{medals[idx]}</div>
                    <div className="text-sm opacity-90 mb-1">Juara {idx === 0 ? '1 Utama' : idx + 1}</div>
                    <div className="text-lg font-bold mb-2">{r.alternatifName}</div>
                    <div className="text-2xl font-mono">{r.finalScore.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              {/* Full Results Table */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left">
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">Rank</th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Alternatif Platform
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase">
                          Rincian Kalkulasi ∑ (W × R)
                        </th>
                        <th className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase text-center">
                          Skor Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {results.map((r) => {
                        // Build calculation string
                        let calcStr = ''
                        kriteria.forEach((k, idx) => {
                          if (idx > 0) calcStr += ' + '
                          calcStr += `(${k.bobot.toFixed(2)} × ${r.normalizedScores[idx].toFixed(2)})`
                        })

                        return (
                          <tr key={r.alternatifId} className="hover:bg-slate-50">
                            <td className="px-5 py-3 font-semibold text-slate-800">
                              {r.rank <= 3 ? medals[r.rank - 1] : r.rank}
                            </td>
                            <td className="px-5 py-3 font-medium text-slate-800">{r.alternatifName}</td>
                            <td className="px-5 py-3 text-xs font-mono text-slate-600">{calcStr}</td>
                            <td className="px-5 py-3 text-center font-bold text-indigo-600">
                              {r.finalScore.toFixed(2)}
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
