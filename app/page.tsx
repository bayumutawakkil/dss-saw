import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { calculateSAW } from '@/lib/calculateSAW'
import type { Kriteria, Alternatif, Penilaian } from '@/lib/supabase'
import ProtectedPage from '@/components/ProtectedPage'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'

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

async function DashboardContent() {
  const { kriteriaList, alternatifList, penilaianList } = await getDashboardData()
  const hasil = calculateSAW(alternatifList, kriteriaList, penilaianList)

  const topRanked = hasil.slice(0, 3)
  const totalBobot = kriteriaList.reduce((sum, k) => sum + k.bobot, 0)
  const bobotValid = Math.abs(totalBobot - 1) < 0.001

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Ringkasan sistem penunjang keputusan dan data terbaru"
        icon={
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
      />

      <div className="px-8 pb-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Kriteria</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{kriteriaList.length}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Mata Kuliah</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{alternatifList.length}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Total Penilaian</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{penilaianList.length}</p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </Card>

          <Card padding="lg" className={bobotValid ? 'bg-gradient-to-br from-emerald-50 to-emerald-50' : 'bg-gradient-to-br from-amber-50 to-amber-50'}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest font-semibold" style={{color: bobotValid ? '#047857' : '#d97706'}}>
                  Status Bobot
                </p>
                <p className="text-3xl font-bold mt-2" style={{color: bobotValid ? '#059669' : '#d97706'}}>
                  {bobotValid ? '✓' : '⚠'}
                </p>
              </div>
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${bobotValid ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                <span className={`text-2xl font-bold ${bobotValid ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {totalBobot.toFixed(2)}
                </span>
              </div>
            </div>
            <p className={`text-xs mt-3 font-medium ${bobotValid ? 'text-emerald-700' : 'text-amber-700'}`}>
              {bobotValid ? 'Total bobot valid' : 'Total harus = 1.00'}
            </p>
          </Card>
        </div>

        {/* Top Rankings */}
        <Card className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Peringkat Top 3</h2>
              <p className="text-sm text-slate-600 mt-1">Mata kuliah dengan skor SAW tertinggi</p>
            </div>
            <Link href="/leaderboard" className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold">
              Lihat Semua →
            </Link>
          </div>

          {topRanked.length === 0 ? (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm">Belum ada data penilaian. Silakan lengkapi data kriteria dan alternatif terlebih dahulu.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topRanked.map((h, idx) => (
                <div key={h.alternatif.id} className="px-4 py-4 flex items-center gap-4 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100 hover:border-slate-200">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${
                    idx === 0 ? 'bg-gradient-to-br from-amber-400 to-amber-500 shadow-md' : 
                    idx === 1 ? 'bg-gradient-to-br from-slate-400 to-slate-500' : 
                    'bg-gradient-to-br from-orange-400 to-orange-500'
                  }`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{h.alternatif.nama_mata_kuliah}</p>
                    <p className="text-xs text-slate-500 mt-1">Skor: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{h.skorAkhir.toFixed(4)}</code></p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold font-mono ${
                      idx === 0 ? 'text-amber-600' : idx === 1 ? 'text-slate-600' : 'text-orange-600'
                    }`}>
                      {(h.skorAkhir * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/kriteria" className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-indigo-200 p-6 transition-all duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">Kelola Kriteria</h3>
                <p className="text-sm text-slate-600 mt-2">Atur kriteria penilaian dan bobot untuk SAW</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors flex-shrink-0">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-indigo-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Kelola Kriteria <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>

          <Link href="/penilaian" className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 p-6 transition-all duration-300 cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-emerald-600 transition-colors">Matriks Penilaian</h3>
                <p className="text-sm text-slate-600 mt-2">Input skor penilaian untuk setiap alternatif</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm group-hover:gap-2 transition-all">
              Input Penilaian <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </Link>
        </div>
      </div>
    </>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedPage>
      <DashboardContent />
    </ProtectedPage>
  )
}
