'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateSAW } from '@/lib/calculateSAW'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'
import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

export default function LaporanPage() {
  const [kriteria, setKriteria] = useState<Kriteria[]>([])
  const [alternatif, setAlternatif] = useState<Alternatif[]>([])
  const [penilaian, setPenilaian] = useState<Penilaian[]>([])
  const [loading, setLoading] = useState(true)
  const [showNormalized, setShowNormalized] = useState(true)
  const [showResults, setShowResults] = useState(true)
  

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

  // Use shared calculateSAW — single source of truth
  const sawResults = calculateSAW(alternatif, kriteria, penilaian)

  // Map to display format used by this page's template
  const results = sawResults.map((h) => ({
    alternatifId: h.alternatif.id,
    alternatifName: h.alternatif.nama_mata_kuliah,
    rawScores: kriteria.map((k) => {
      const p = penilaian.find((x) => x.alternatif_id === h.alternatif.id && x.kriteria_id === k.id)
      return p?.nilai ?? 0
    }),
    normalizedScores: kriteria.map((k) => h.nilaiNormalisasi[k.id] ?? 0),
    finalScore: h.skorAkhir,
    rank: h.peringkat,
  }))

  // Global max/min for formula display
  const globalMax = kriteria.some(k => k.jenis === 'benefit')
    ? Math.max(...results.flatMap(r => r.rawScores.filter((_, i) => kriteria[i]?.jenis === 'benefit')), 0)
    : 0
  const costScores = results.flatMap(r => r.rawScores.filter((_, i) => kriteria[i]?.jenis === 'cost')).filter(v => v > 0)
  const globalMin = costScores.length > 0 ? Math.min(...costScores) : 0
  

  if (loading) {
    return (
      <ProtectedPage>
        <PageHeader
          title="Laporan Hasil Keputusan"
          description="Hasil evaluasi algoritma Simple Additive Weighting (SAW) berdasarkan data matriks terkini"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Laporan' },
          ]}
          icon={
            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          }
        />
        <div className="px-4 md:px-8 pb-8">
          <Card>
            <LoadingSkeleton count={4} height="lg" />
          </Card>
        </div>
      </ProtectedPage>
    )
  }

  return (
    <ProtectedPage>
      <PageHeader
        title="Laporan Hasil Keputusan"
        description="Hasil evaluasi algoritma Simple Additive Weighting (SAW) berdasarkan data matriks terkini"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Laporan' },
        ]}
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
      </svg>
        }
      />

      <div className="px-4 md:px-8 pb-8">
        {/* Section 1: Raw Matrix */}
        <Card className="mb-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">1. Matriks Keputusan Awal (X)</h2>
            <p className="text-sm text-slate-700 dark:text-slate-400 mt-1">Data skor mentah dari setiap alternatif kriteria</p>
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-sm">
              <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-56 bg-slate-50">
                        Alternatif
                      </th>
                      {kriteria.map((k) => (
                        <th key={k.id} className="px-3 py-4 text-center min-w-28 bg-slate-50">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-slate-700">C{k.id}</span>
                            <span className="text-[10px] text-slate-500 font-normal break-words max-w-20">{k.nama_kriteria}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${k.jenis === 'benefit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {k.bobot}
                            </span>
                          </div>
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
                <tr className="border-t-4 border-slate-100 bg-slate-50">
  <td className="px-5 py-6">
    <div className="flex flex-col">
      <span className="font-semibold text-slate-950">
        Nilai Target
      </span>
    </div>
  </td>
  
  {kriteria.map((k, kriIdx) => {
    // Logika perhitungan nilai target (Tetap sama)
    let targetValue = 0;
    if (k.jenis === 'benefit') {
      results.forEach((r) => {
        if (r.rawScores[kriIdx] > targetValue) targetValue = r.rawScores[kriIdx];
      });
    } else {
      let min = Infinity;
      results.forEach((r) => {
        if (r.rawScores[kriIdx] > 0 && r.rawScores[kriIdx] < min) {
          min = r.rawScores[kriIdx];
        }
      });
      targetValue = min === Infinity ? 0 : min;
    }

    const isBenefit = k.jenis === 'benefit';

    return (
      <td key={kriIdx} className="px-4 py-6 text-center">
        {/* Kontainer dengan lebar tetap (w-28) agar semua kotak berukuran sama */}
        <div className={`
          inline-flex flex-col items-center justify-center 
          w-28 py-2.5 rounded-lg border
          ${isBenefit 
            ? 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400' 
            : 'bg-rose-50/50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-400'}
        `}>
          {/* Label Tipis */}
          <span className="text-xs font-medium mb-1">
            {isBenefit ? 'Maximum' : 'Minimum'}
          </span>
          
          {/* Nilai dengan font yang lebih tipis (font-medium/semibold) */}
          <span className="text-base font-medium tracking-tight">
            {targetValue.toFixed(2)}
          </span>
        </div>
      </td>
    );
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
              <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">2. Matriks Normalisasi (R)</h2>
              <p className="text-sm text-slate-700 dark:text-slate-400 mt-1">Hasil konversi nilai mentah menggunakan rumus Benefit/Cost</p>
            </div>
            <span className="text-slate-500 dark:text-slate-400 group-hover:translate-y-1 transition-transform">{showNormalized ? '▲' : '▼'}</span>
          </button>

          {showNormalized && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Kotak Rumus Benefit */}
  <div className="bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4">
    <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Rumus Benefit</p>
    <p className="text-slate-600 dark:text-slate-300 font-normal italic text-sm">
      Rij = Nilai Mentah / <span className="font-semibold text-emerald-700 dark:text-emerald-400 not-italic">{globalMax.toFixed(2)}</span>
    </p>
    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">*Angka didapat dari nilai maksimal pada matriks penilaian</p>
  </div>

  {/* Kotak Rumus Cost */}
  <div className="bg-rose-50/50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-4">
    <p className="text-[10px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">Rumus Cost</p>
    <p className="text-slate-600 dark:text-slate-300 font-normal italic text-sm">
      Rij = <span className="font-semibold text-rose-700 dark:text-rose-400 not-italic">{globalMin.toFixed(2)}</span> / Nilai Mentah
    </p>
    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">*Angka didapat dari nilai minimal pada matriks penilaian</p>
  </div>
</div>
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-4 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider min-w-56 bg-slate-50">
                        Alternatif
                      </th>
                      {kriteria.map((k) => (
                        <th key={k.id} className="px-3 py-4 text-center min-w-28 bg-slate-50">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-bold text-slate-700">C{k.id}</span>
                            <span className="text-[10px] text-slate-500 font-normal break-words max-w-20">{k.nama_kriteria}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${k.jenis === 'benefit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                              {k.bobot}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-950">
                    {results.map((r) => (
                      <tr key={r.alternatifId} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-semibold bg-slate-50 border-r border-slate-100">{r.alternatifName}</td>
                        {r.normalizedScores.map((score, idx) => (
                          <td key={idx} className="px-4 py-4 text-center font-bold text-slate-800">
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
              <h2 className="text-xl font-bold text-slate-950 dark:text-slate-100">3. Perankingan Akhir</h2>
              <p className="text-sm text-slate-700 dark:text-slate-400 mt-1">Urutan prioritas berdasarkan akumulasi bobot dan nilai normalisasi</p>
            </div>
            <span className="text-slate-500 dark:text-slate-400 group-hover:translate-y-1 transition-transform">{showResults ? '▲' : '▼'}</span>
          </button>

          {showResults && (
            <div className="mt-8 space-y-10 animate-in fade-in duration-500">
              

              {/* Main Result Table */}
              <div className="overflow-x-auto -mx-6 px-6">
  <table className="w-full text-sm">
    <thead>
      <tr className="border-b border-slate-200 text-left">
        <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider text-slate-500">Rank</th>
        <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider text-slate-500">Alternatif</th>
        <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider text-slate-500 hidden lg:table-cell">Kalkulasi ∑(W × R)</th>
        <th className="px-6 py-5 font-bold uppercase text-xs tracking-wider text-slate-500 text-right">Skor Akhir</th>
      </tr>
    </thead>
    <tbody className="divide-y-2 divide-slate-100 text-slate-950 font-medium">
      {results.map((r) => {
        let calcStr = '';
        kriteria.forEach((k, idx) => {
          if (idx > 0) calcStr += ' + ';
          calcStr += `(${k.bobot.toFixed(2)}×${r.normalizedScores[idx].toFixed(2)})`;
        });

        // Menentukan warna border dan teks berdasarkan peringkat
        const rankStyles = 
          r.rank === 1 ? 'border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-600' :
          r.rank === 2 ? 'border-slate-400 text-slate-500 bg-slate-50 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-500' :
          r.rank === 3 ? 'border-orange-700 text-orange-800 bg-orange-50 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-600' :
          'border-slate-400 text-slate-200 dark:border-slate-500 dark:text-slate-300';

        return (
          <tr key={r.alternatifId} className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-5">
              {/* Penerapan style dinamis pada lingkaran/kotak rank */}
              <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold ${rankStyles}`}>
                {r.rank}
              </span>
            </td>
            <td className="px-6 py-5 font-bold text-base">{r.alternatifName}</td>
            <td className="px-6 py-5 text-xs font-mono text-slate-700 hidden lg:table-cell">
              {calcStr}
            </td>
            <td className="px-6 py-5 text-right">
              <span className={`text-xl font-black text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-200 dark:border-indigo-700`}>
                {r.finalScore.toFixed(4)}
              </span>
            </td>
          </tr>
        );
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