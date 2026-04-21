import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { calculateSAW } from '@/lib/calculateSAW'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'

async function getDashboardData() {
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

export default async function DashboardPage() {
  const { kriteriaList, alternatifList, penilaianList } = await getDashboardData()
  const hasil = calculateSAW(alternatifList, kriteriaList, penilaianList)

  const topRanked = hasil.slice(0, 3)
  const totalBobot = kriteriaList.reduce((sum, k) => sum + k.bobot, 0)
  const bobotValid = Math.abs(totalBobot - 1) < 0.001

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Sistem Penunjang Keputusan - Simple Additive Weighting</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Kriteria</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{kriteriaList.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Mata Kuliah</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{alternatifList.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total Penilaian</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{penilaianList.length}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border shadow-sm p-6 ${bobotValid ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold" style={{color: bobotValid ? '#047857' : '#d97706'}}>
                Status Bobot
              </p>
              <p className="text-2xl font-bold mt-1" style={{color: bobotValid ? '#059669' : '#d97706'}}>
                {bobotValid ? 'Valid' : 'Perhatian'}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bobotValid ? 'bg-emerald-100' : 'bg-amber-100'}`}>
              <svg className={`w-6 h-6 ${bobotValid ? 'text-emerald-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          <p className={`text-xs mt-2 ${bobotValid ? 'text-emerald-700' : 'text-amber-700'}`}>
            Total: {totalBobot.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Top Rankings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Top 3 Mata Kuliah</h2>
          <Link href="/leaderboard" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold">
            Lihat Semua →
          </Link>
        </div>
        <div className="divide-y divide-slate-100">
          {topRanked.map((h, idx) => (
            <div key={h.alternatif.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-slate-400' : 'bg-orange-400'
              }`}>
                {h.peringkat}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{h.alternatif.nama_mata_kuliah}</p>
                <p className="text-xs text-slate-500">Skor: {h.skorAkhir.toFixed(4)}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold font-mono ${
                  idx === 0 ? 'text-amber-600' : idx === 1 ? 'text-slate-600' : 'text-orange-600'
                }`}>
                  {(h.skorAkhir * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/kriteria" className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:border-indigo-200 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">Kelola Kriteria</h3>
              <p className="text-xs text-slate-500 mt-1">Atur kriteria dan bobot penilaian</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
          </div>
          <span className="text-xs text-indigo-600 font-semibold group-hover:translate-x-1 transition-transform inline-block">Kelola Kriteria →</span>
        </Link>

        <Link href="/penilaian" className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:border-emerald-200 hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors">Matriks Penilaian</h3>
              <p className="text-xs text-slate-500 mt-1">Lihat data penilaian semua alternatif</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
          <span className="text-xs text-emerald-600 font-semibold group-hover:translate-x-1 transition-transform inline-block">Lihat Matriks →</span>
        </Link>
      </div>
    </div>
  )
}
